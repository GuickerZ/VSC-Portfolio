// pages/api/fetchRepo.ts
import type { NextApiRequest, NextApiResponse } from "next";

type RepoResult = {
  name?: string | null;
  description?: string | null;
  language?: string | null;
  stars?: number | null;
  forks?: number | null;
  url?: string | null;
  homepage?: string | null;
  ownerAvatar?: string | null;
  previewImage?: string | null;
  error?: string | null;
  cached?: boolean;
  cacheAge?: number;
};

interface CacheEntry {
  value: RepoResult;
  expiresAt: number;
  createdAt: number;
}

interface RedisClient {
  get(key: string): Promise<string | null>;
  setex(key: string, ttl: number, value: string): Promise<string>;
  ttl(key: string): Promise<number>;
  on(event: string, callback: (...args: unknown[]) => void): void;
}

const GLOBAL_CACHE = new Map<string, CacheEntry>();

const CACHE_TTL = {
  SUCCESS: 3600,
  PARTIAL: 1800,
  ERROR: 300,
  RATE_LIMIT: 60,
};

function getCached(key: string): { data: RepoResult | null; age: number } {
  const e = GLOBAL_CACHE.get(key);
  if (!e) return { data: null, age: 0 };

  const now = Date.now();
  if (e.expiresAt < now) {
    GLOBAL_CACHE.delete(key);
    return { data: null, age: 0 };
  }

  const age = Math.floor((now - e.createdAt) / 1000);
  return { data: e.value, age };
}

function setCached(key: string, value: RepoResult, ttlSeconds: number) {
  const now = Date.now();
  GLOBAL_CACHE.set(key, {
    value,
    expiresAt: now + ttlSeconds * 1000,
    createdAt: now,
  });
}

let redisClient: RedisClient | null = null;
let redisConnected = false;

if (process.env.REDIS_URL && !redisClient) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const IORedis = require("ioredis");
    redisClient = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
    }) as RedisClient;

    redisClient.on("connect", () => {
      redisConnected = true;
      console.log("[Redis] Connected successfully");
    });

    redisClient.on("error", (err: unknown) => {
      redisConnected = false;
      console.warn(
        "[Redis] Connection error:",
        err instanceof Error ? err.message : err,
      );
    });
  } catch (err) {
    console.warn("[Redis] Not available, using in-memory cache");
    redisClient = null;
  }
}

async function redisGet(
  key: string,
): Promise<{ data: RepoResult; age: number } | null> {
  if (!redisClient || !redisConnected) {
    const cached = getCached(key);
    return cached.data ? { data: cached.data, age: cached.age } : null;
  }

  try {
    const raw = await redisClient.get(key);
    if (!raw) return null;

    const parsed: { value: RepoResult; createdAt: number } = JSON.parse(raw);
    const age = parsed.createdAt
      ? Math.floor((Date.now() - parsed.createdAt) / 1000)
      : 0;
    return { data: parsed.value, age };
  } catch {
    const cached = getCached(key);
    return cached.data ? { data: cached.data, age: cached.age } : null;
  }
}

async function redisSet(key: string, value: RepoResult, ttlSeconds: number) {
  const payload = {
    value,
    createdAt: Date.now(),
  };

  setCached(key, value, ttlSeconds);

  if (!redisClient || !redisConnected) return;

  try {
    await redisClient.setex(key, ttlSeconds, JSON.stringify(payload));
  } catch (err) {
    console.warn("[Redis] Set error:", err);
  }
}

function parseOwnerRepo(pathname: string) {
  const parts = pathname.replace(/^\/+|\/+$/g, "").split("/");
  if (parts.length < 2) return null;
  return { owner: parts[0], repo: parts[1] };
}

function isRateLimited(data: { message?: string }): boolean {
  return data?.message?.toLowerCase().includes("rate limit") ?? false;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RepoResult>,
) {
  try {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Missing url query param" });
    }

    const parsed = new URL(url);
    const or = parseOwnerRepo(parsed.pathname);

    if (!or) {
      return res.status(400).json({ error: "Invalid GitHub repo URL" });
    }

    const { owner, repo } = or;
    const cacheKey = `repo:${owner}/${repo}`;

    const cached = await redisGet(cacheKey);
    if (cached?.data) {
      res.setHeader(
        "Cache-Control",
        "s-maxage=3600, stale-while-revalidate=86400",
      );
      res.setHeader("X-Cache", "HIT");
      res.setHeader("X-Cache-Age", cached.age.toString());

      return res.status(200).json({
        ...cached.data,
        cached: true,
        cacheAge: cached.age,
      });
    }

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const apiResp = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Next.js Portfolio",
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (apiResp.ok) {
      const repoData = await apiResp.json();

      const result: RepoResult = {
        name: repoData.name || null,
        description: repoData.description || null,
        language: repoData.language || null,
        stars:
          typeof repoData.stargazers_count === "number"
            ? repoData.stargazers_count
            : null,
        forks:
          typeof repoData.forks_count === "number"
            ? repoData.forks_count
            : null,
        url: repoData.html_url || `https://github.com/${owner}/${repo}`,
        homepage: repoData.homepage || null,
        ownerAvatar: repoData.owner?.avatar_url || null,
        previewImage: `https://opengraph.githubassets.com/1/${owner}/${repo}`,
      };

      await redisSet(cacheKey, result, CACHE_TTL.SUCCESS);

      res.setHeader(
        "Cache-Control",
        "s-maxage=3600, stale-while-revalidate=86400",
      );
      res.setHeader("X-Cache", "MISS");
      return res.status(200).json(result);
    }

    if (apiResp.status === 403 || apiResp.status === 429) {
      const errorData = await apiResp.json().catch(() => ({}));

      if (isRateLimited(errorData)) {
        console.warn(`[API] Rate limited for ${owner}/${repo}`);

        const emptyResult: RepoResult = { error: "Rate limited", name: repo };
        await redisSet(cacheKey, emptyResult, CACHE_TTL.RATE_LIMIT);

        res.setHeader(
          "Cache-Control",
          "s-maxage=60, stale-while-revalidate=300",
        );
        res.setHeader("X-Cache", "RATE-LIMITED");
        return res.status(200).json(emptyResult);
      }
    }

    console.log(`[API] Falling back to HTML scraping for ${owner}/${repo}`);

    const htmlResp = await fetch(`https://github.com/${owner}/${repo}`);
    const html = await htmlResp.text();

    const og = (name: string) => {
      const re = new RegExp(
        `<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']+)["']`,
        "i",
      );
      const m = html.match(re);
      return m ? m[1] : null;
    };

    const description =
      og("og:description") || og("twitter:description") || null;
    const title = og("og:title") || repo;
    const homepageMatch = html.match(/"homepage":\s*"([^"]+)"/);
    const homepage = homepageMatch ? homepageMatch[1] : null;

    const fallbackResult: RepoResult = {
      name: title,
      description,
      language: null,
      stars: null,
      forks: null,
      url: `https://github.com/${owner}/${repo}`,
      homepage,
      ownerAvatar: null,
      previewImage: `https://opengraph.githubassets.com/1/${owner}/${repo}`,
    };

    await redisSet(cacheKey, fallbackResult, CACHE_TTL.PARTIAL);

    res.setHeader(
      "Cache-Control",
      "s-maxage=1800, stale-while-revalidate=3600",
    );
    res.setHeader("X-Cache", "FALLBACK");
    return res.status(200).json(fallbackResult);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[API] Error:", error?.message || err);

    const errorResult: RepoResult = { error: "Internal error" };
    const cacheKey = req.query.url ? `repo:error:${req.query.url}` : "error";
    await redisSet(cacheKey, errorResult, CACHE_TTL.ERROR);

    return res.status(500).json(errorResult);
  }
}
