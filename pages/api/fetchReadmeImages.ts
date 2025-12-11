// pages/api/fetchReadmeImages.ts
import type { NextApiRequest, NextApiResponse } from "next";

interface CacheEntry {
  value: string[];
  expiresAt: number;
  createdAt: number;
}

interface RedisClient {
  get(key: string): Promise<string | null>;
  setex(key: string, ttl: number, value: string): Promise<string>;
  on(event: string, callback: (...args: unknown[]) => void): void;
}

const GLOBAL_CACHE = new Map<string, CacheEntry>();

const CACHE_TTL = {
  SUCCESS: 7200,
  EMPTY: 3600,
  ERROR: 600,
};

function getCached(key: string): { data: string[] | null; age: number } {
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

function setCached(key: string, value: string[], ttlSeconds: number) {
  const now = Date.now();
  GLOBAL_CACHE.set(key, {
    value,
    expiresAt: now + ttlSeconds * 1000,
    createdAt: now,
  });
}

// Redis setup
let redisClient: RedisClient | null = null;
let redisConnected = false;

if (process.env.REDIS_URL && !redisClient) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const IORedis = require("ioredis");
    redisClient = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) =>
        times > 3 ? null : Math.min(times * 200, 2000),
    }) as RedisClient;

    redisClient.on("connect", () => {
      redisConnected = true;
    });
    redisClient.on("error", () => {
      redisConnected = false;
    });
  } catch {
    redisClient = null;
  }
}

async function redisGet(
  key: string,
): Promise<{ data: string[]; age: number } | null> {
  if (!redisClient || !redisConnected) {
    const cached = getCached(key);
    return cached.data ? { data: cached.data, age: cached.age } : null;
  }

  try {
    const raw = await redisClient.get(key);
    if (!raw) return null;

    const parsed: { value: string[]; createdAt: number } = JSON.parse(raw);
    const age = parsed.createdAt
      ? Math.floor((Date.now() - parsed.createdAt) / 1000)
      : 0;
    return { data: parsed.value, age };
  } catch {
    const cached = getCached(key);
    return cached.data ? { data: cached.data, age: cached.age } : null;
  }
}

async function redisSet(key: string, value: string[], ttlSeconds: number) {
  const payload = { value, createdAt: Date.now() };
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
  return parts.length >= 2 ? { owner: parts[0], repo: parts[1] } : null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Missing url param", images: [] });
    }

    const parsed = new URL(url);
    const or = parseOwnerRepo(parsed.pathname);

    if (!or) {
      return res.status(400).json({ error: "Invalid GitHub URL", images: [] });
    }

    const { owner, repo } = or;
    const cacheKey = `readmeImages:${owner}/${repo}`;

    // Try cache
    const cached = await redisGet(cacheKey);
    if (cached?.data) {
      res.setHeader(
        "Cache-Control",
        "s-maxage=7200, stale-while-revalidate=86400",
      );
      res.setHeader("X-Cache", "HIT");
      res.setHeader("X-Cache-Age", cached.age.toString());
      return res.status(200).json({ images: cached.data, cached: true });
    }

    // Fetch default branch
    const repoApi = `https://api.github.com/repos/${owner}/${repo}`;
    const repoResp = await fetch(repoApi, {
      headers: { "User-Agent": "Next.js Portfolio" },
    });

    if (!repoResp.ok) {
      await redisSet(cacheKey, [], CACHE_TTL.ERROR);
      res.setHeader("X-Cache", "ERROR");
      return res.status(200).json({ images: [] });
    }

    const repoJson = await repoResp.json();
    const defaultBranch = repoJson.default_branch || "main";

    // Try README variants
    const possibleNames = ["README.md", "README.MD", "readme.md", "Readme.md"];
    let readmeText: string | null = null;

    for (const name of possibleNames) {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${name}`;
      const r = await fetch(rawUrl);
      if (r.ok) {
        readmeText = await r.text();
        break;
      }
    }

    if (!readmeText) {
      await redisSet(cacheKey, [], CACHE_TTL.EMPTY);
      res.setHeader("X-Cache", "EMPTY");
      return res.status(200).json({ images: [] });
    }

    // Extract images
    const mdRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
    const imgTagRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    const found: string[] = [];

    let m;
    while ((m = mdRegex.exec(readmeText)) !== null) {
      if (m[1]) found.push(m[1].trim());
    }
    while ((m = imgTagRegex.exec(readmeText)) !== null) {
      if (m[1]) found.push(m[1].trim());
    }

    // Normalize URLs
    const normalized = found
      .map((raw) => {
        const split = raw.split(/\s+/)[0];
        const urlStr = split.replace(/^<|>$/g, "");

        try {
          const u = new URL(urlStr);
          return u.toString();
        } catch {
          const path = urlStr.replace(/^\.\/+/, "").replace(/^\/+/, "");
          return `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${path}`;
        }
      })
      .filter(Boolean);

    const unique = Array.from(new Set(normalized)).filter(
      (u) => !u.startsWith("data:"),
    );

    const ttl = unique.length > 0 ? CACHE_TTL.SUCCESS : CACHE_TTL.EMPTY;
    await redisSet(cacheKey, unique, ttl);

    res.setHeader(
      "Cache-Control",
      `s-maxage=${ttl}, stale-while-revalidate=86400`,
    );
    res.setHeader("X-Cache", "MISS");
    return res.status(200).json({ images: unique });
  } catch (err) {
    console.error("fetchReadmeImages error:", err);
    return res.status(500).json({ images: [], error: "Internal error" });
  }
}
