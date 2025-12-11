import { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { FaDesktop, FaMobileAlt, FaGlobe } from "react-icons/fa";
import WindowPage from "@components/WindowLayout/WindowPage";

/* --- TIPAGEM COMPLETA DA API LANYARD --- */
interface LanyardResponse {
  data: LanyardData;
  success: boolean;
}

interface LanyardData {
  kv: Record<string, string>;
  discord_user: DiscordUser;
  activities: Activity[];
  discord_status: "online" | "idle" | "dnd" | "offline";
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  listening_to_spotify: boolean;
  spotify: Spotify | null;
}

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  display_name: string | null;
  public_flags: number;
  avatar_decoration_data?: {
    asset: string;
    sku_id: string;
  } | null;
}

interface Activity {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  timestamps?: { start: number; end?: number };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  application_id?: string;
}

interface Spotify {
  track_id: string;
  timestamps: { start: number; end: number };
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
}

const USER_ID = "738200239395176499";

const Home: NextPage = () => {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${USER_ID}`);
        const json: LanyardResponse = await res.json();
        if (json.success) setData(json.data);
      } catch (error) {
        console.error("Erro ao carregar Lanyard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalData = setInterval(fetchData, 5000);
    const intervalTime = setInterval(() => setCurrentTime(Date.now()), 1000);

    return () => {
      clearInterval(intervalData);
      clearInterval(intervalTime);
    };
  }, []);

  const getAvatar = (u: DiscordUser) =>
    `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${u.avatar.startsWith("a_") ? "gif" : "png"}?size=1024`;

  const getDecoration = (u: DiscordUser) =>
    u.avatar_decoration_data
      ? `https://cdn.discordapp.com/avatar-decoration-presets/${u.avatar_decoration_data.asset}.png?size=512`
      : null;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return "bg-[#23a559] shadow-[0_0_10px_#23a559]";
      case "dnd":
        return "bg-[#f23f43] shadow-[0_0_10px_#f23f43]";
      case "idle":
        return "bg-[#f0b232] shadow-[0_0_10px_#f0b232]";
      default:
        return "bg-zinc-500";
    }
  };

  if (loading || !data) {
    return (
      <WindowPage>
        <div className="flex h-full animate-pulse items-center justify-center text-zinc-500">
          Carregando perfil...
        </div>
      </WindowPage>
    );
  }

  const user = data.discord_user;
  const statusColor = getStatusColor(data.discord_status);

  return (
    <>
      <Head>
        <title>{user.display_name || user.username} | Portfolio</title>
      </Head>
      <WindowPage>
        <div className="flex h-full w-full justify-center overflow-y-auto p-4 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700">
          <div className="animate-fadeIn flex w-full max-w-[500px] flex-col gap-5 pb-4">
            {/* --- CARD DE PERFIL --- */}
            <div className="relative flex flex-col items-center overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-6 shadow-2xl backdrop-blur-xl">
              <div className="pointer-events-none absolute left-0 top-0 h-32 w-full bg-gradient-to-b from-white/5 to-transparent" />

              {/* Avatar & Decoration Wrapper */}
              <div className="relative mb-4 mt-2">
                <div className="relative h-32 w-32">
                  <img
                    src={getAvatar(user)}
                    alt="avatar"
                    className="h-full w-full rounded-full bg-zinc-800 object-cover ring-2 ring-white/10"
                  />

                  <div
                    className={`absolute bottom-1 right-2 h-7 w-7 rounded-full border-[4px] border-[#0a0a0a] ${statusColor} z-20`}
                  />
                </div>

                {getDecoration(user) && (
                  <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[122%] w-[122%] -translate-x-1/2 -translate-y-1/2">
                    <img
                      src={getDecoration(user)!}
                      alt="decoration"
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
              </div>

              <h1 className="text-center text-3xl font-bold text-white drop-shadow-lg">
                {user.display_name}
              </h1>
              <div className="mt-1 flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1">
                <span className="font-mono text-sm text-zinc-400">
                  @{user.username}
                </span>
              </div>

              <div className="mt-4 flex gap-3 text-xl text-zinc-500">
                {data.active_on_discord_desktop && (
                  <span
                    title="Desktop"
                    className="drop-shadow-glow text-white transition hover:scale-110"
                  >
                    <FaDesktop />
                  </span>
                )}
                {data.active_on_discord_mobile && (
                  <span
                    title="Mobile"
                    className="drop-shadow-glow text-white transition hover:scale-110"
                  >
                    <FaMobileAlt />
                  </span>
                )}
                {data.active_on_discord_web && (
                  <span
                    title="Web"
                    className="drop-shadow-glow text-white transition hover:scale-110"
                  >
                    <FaGlobe />
                  </span>
                )}
              </div>

              {Object.keys(data.kv).length > 0 && (
                <div className="mt-4 w-full text-center">
                  {Object.entries(data.kv).map(([key, value]) => (
                    <p key={key} className="text-sm text-zinc-400">
                      <span className="mr-1 text-zinc-600">{key}:</span> {value}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Spotify */}
            {data.listening_to_spotify && data.spotify && (
              <div className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/5 bg-black/40 p-4 backdrop-blur-md transition duration-300 hover:bg-black/50">
                <div className="absolute -left-4 top-0 h-full w-20 bg-green-500/10 blur-2xl transition group-hover:bg-green-500/20" />

                <a
                  href={`https://open.spotify.com/track/${data.spotify.track_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="relative z-10 shrink-0"
                >
                  <img
                    src={data.spotify.album_art_url}
                    alt="Album Art"
                    className="h-20 w-20 rounded-xl shadow-lg transition duration-300 hover:scale-105"
                  />
                  <div className="absolute right-[-5px] top-[-5px] rounded-full bg-[#1DB954] p-1 text-[10px] text-white shadow-lg">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 17.3c-.2.3-.5.4-.8.2-2.2-1.3-5-1.6-8.3-.9-.3.1-.6-.1-.7-.4-.1-.3.1-.6.4-.7 3.6-.8 6.7-.5 9.2 1 .3.2.4.5.2.8zm1.1-2.4c-.3.4-.8.5-1.2.3-2.7-1.7-6.8-2.1-9.9-1.2-.4.1-.9-.1-1-.5-.1-.4.1-.9.5-1 3.6-1.1 8.1-.6 11.2 1.3.4.2.5.7.3 1.1zm.1-2.5C15.4 10.6 8.9 10.4 5.2 11.5c-.6.2-1.1-.2-1.3-.7-.2-.6.2-1.1.7-1.3 4.2-1.3 11.4-1 15.6 1.5.5.3.7 1 .4 1.5-.3.5-1 .6-1.5.3z" />
                    </svg>
                  </div>
                </a>

                <div className="z-10 flex min-w-0 flex-1 flex-col">
                  <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-green-400">
                    Ouvindo no Spotify
                  </h2>
                  <span
                    className="cursor-pointer truncate text-lg font-bold text-white hover:underline"
                    title={data.spotify.song}
                  >
                    {data.spotify.song}
                  </span>
                  <span className="truncate text-sm text-zinc-400">
                    {data.spotify.artist}
                  </span>

                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{
                        width: `${Math.min(100, ((currentTime - data.spotify.timestamps.start) / (data.spotify.timestamps.end - data.spotify.timestamps.start)) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-zinc-500">
                    <span>
                      {formatTime(currentTime - data.spotify.timestamps.start)}
                    </span>
                    <span>
                      {formatTime(
                        data.spotify.timestamps.end -
                          data.spotify.timestamps.start,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Activities */}
            {data.activities
              .filter((act) => act.id !== "spotify:1")
              .map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 rounded-2xl border border-white/5 bg-black/40 p-4 backdrop-blur-md transition hover:bg-black/50"
                >
                  <div className="relative h-16 w-16 shrink-0">
                    {activity.assets?.large_image ? (
                      <img
                        src={`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`}
                        className="h-full w-full rounded-xl object-cover shadow-lg"
                        alt={activity.name}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-xl bg-zinc-800 text-2xl">
                        🎮
                      </div>
                    )}
                    {activity.assets?.small_image && (
                      <img
                        src={`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`}
                        className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-zinc-900"
                        alt="small"
                      />
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-400">
                      {activity.type === 0 ? "Jogando" : "Atividade"}
                    </h3>
                    <span className="truncate font-bold text-white">
                      {activity.name}
                    </span>
                    <span className="truncate text-sm text-zinc-400">
                      {activity.details}
                    </span>
                    <span className="truncate text-xs text-zinc-500">
                      {activity.state}
                    </span>

                    {activity.timestamps?.start && (
                      <span className="mt-1 w-fit rounded bg-black/20 px-2 py-0.5 text-[10px] text-zinc-600">
                        {formatTime(currentTime - activity.timestamps.start)}{" "}
                        decorridos
                      </span>
                    )}
                  </div>
                </div>
              ))}

            <div className="pb-4 text-center opacity-30 transition hover:opacity-100">
              <code className="cursor-pointer select-all rounded bg-white/5 px-2 py-1 text-[10px] text-white">
                UID: {user.id}
              </code>
            </div>
          </div>
        </div>
      </WindowPage>
    </>
  );
};

export default Home;
