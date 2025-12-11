import Head from "next/head";
import Image from "next/image";
import { useTheme } from "@contexts/ThemeContext";
import WindowPage from "@components/WindowLayout/WindowPage";
import {
  VscGithub,
  VscMail,
  VscLocation,
  VscCalendar,
  VscCode,
  VscBook,
} from "react-icons/vsc";
import { useEffect, useState } from "react";

interface GitHubStats {
  repos: number;
  followers: number;
  following: number;
}

interface LanguageStats {
  [key: string]: number;
}

export default function Profile() {
  const { colors } = useTheme();
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
  const [languages, setLanguages] = useState<LanguageStats>({});
  const [error, setError] = useState(false);

  useEffect(() => {
    // Buscar estatísticas do GitHub
    fetch("https://api.github.com/users/GuickerZ")
      .then((res) => {
        if (res.status === 403 || res.status === 429) {
          setError(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && !data.message) {
          setGithubStats({
            repos: data.public_repos ?? 0,
            followers: data.followers ?? 0,
            following: data.following ?? 0,
          });
        }
      })
      .catch(() => setError(true));

    // Buscar linguagens dos repositórios
    fetch("https://api.github.com/users/GuickerZ/repos?per_page=100")
      .then((res) => {
        if (res.status === 403 || res.status === 429) return [];
        return res.json();
      })
      .then((repos) => {
        if (!Array.isArray(repos)) return;
        const langCount: LanguageStats = {};
        repos.forEach((repo: any) => {
          if (repo.language) {
            langCount[repo.language] = (langCount[repo.language] || 0) + 1;
          }
        });
        setLanguages(langCount);
      })
      .catch(() => undefined);
  }, []);

  const calculatePercentage = (lang: string): number => {
    const total = Object.values(languages).reduce((a, b) => a + b, 0);
    return total > 0 ? Math.round((languages[lang] / total) * 100) : 0;
  };

  const topLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const stats = [
    {
      label: "Repositórios",
      value: githubStats?.repos.toString() || "...",
      icon: VscCode,
    },
    {
      label: "Anos de XP",
      value: "2+",
      icon: VscCalendar,
    },
    {
      label: "Seguidores",
      value: githubStats?.followers.toString() || "...",
      icon: VscBook,
    },
  ];

  return (
    <>
      <Head>
        <title>Perfil - Guilherme Matias | Portfólio</title>
      </Head>
      <WindowPage>
        <div className="flex flex-col gap-6">
          {/* Header do Perfil */}
          <div
            className="relative overflow-hidden rounded-lg p-4"
            style={{
              background: `linear-gradient(135deg, ${colors.accent.primary} 0%, ${colors.accent.secondary} 100%)`,
            }}
          >
            <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
              <div className="relative shrink-0">
                <Image
                  src="https://github.com/GuickerZ.png"
                  alt="Guilherme Matias"
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-white shadow-xl"
                />
                <div
                  className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: colors.text.accent }}
                />
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <h1 className="truncate text-xl font-bold text-white">
                  Guilherme Matias
                </h1>
                <p className="text-sm text-white/90">Desenvolvedor Back-end</p>
                <a
                  href="https://github.com/GuickerZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 text-white/90 transition-colors hover:text-white sm:justify-start"
                >
                  <VscGithub className="text-base" />
                  <span className="text-xs">@GuickerZ</span>
                </a>
              </div>
            </div>
          </div>

          {/* Erro de API */}
          {error && (
            <div
              className="rounded-lg p-3 text-center text-xs"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
              }}
            >
              Algumas informações podem estar indisponíveis (limite da API)
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg p-3 text-center transition-all hover:scale-105"
                style={{
                  backgroundColor: colors.bg.secondary,
                  borderColor: colors.border,
                  borderWidth: "1px",
                }}
              >
                <stat.icon
                  className="mx-auto mb-1 text-xl"
                  style={{ color: colors.accent.primary }}
                />
                <div
                  className="text-lg font-bold"
                  style={{ color: colors.text.primary }}
                >
                  {stat.value}
                </div>
                <div
                  className="truncate text-xs"
                  style={{ color: colors.text.tertiary }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Informações */}
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: colors.bg.secondary,
              borderColor: colors.border,
              borderWidth: "1px",
            }}
          >
            <h2
              className="mb-3 text-base font-semibold"
              style={{ color: colors.text.primary }}
            >
              Informações
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <VscLocation
                  className="shrink-0 text-lg"
                  style={{ color: colors.accent.primary }}
                />
                <div className="min-w-0">
                  <div
                    className="text-xs"
                    style={{ color: colors.text.tertiary }}
                  >
                    Localização
                  </div>
                  <div
                    className="truncate text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    Garanhuns, PE
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <VscBook
                  className="shrink-0 text-lg"
                  style={{ color: colors.accent.primary }}
                />
                <div className="min-w-0">
                  <div
                    className="text-xs"
                    style={{ color: colors.text.tertiary }}
                  >
                    Formação
                  </div>
                  <div
                    className="truncate text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    TI - IFPE (2022.1)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Linguagens Baseadas no GitHub */}
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: colors.bg.secondary,
              borderColor: colors.border,
              borderWidth: "1px",
            }}
          >
            <h2
              className="mb-3 text-base font-semibold"
              style={{ color: colors.text.primary }}
            >
              Linguagens mais usadas
            </h2>
            <div className="flex flex-col gap-3">
              {topLanguages.length === 0 ? (
                <div
                  className="text-sm"
                  style={{ color: colors.text.tertiary }}
                >
                  {error ? "Indisponível" : "Carregando..."}
                </div>
              ) : (
                topLanguages.slice(0, 6).map(([lang]) => (
                  <div key={lang}>
                    <div
                      className="mb-1 flex justify-between text-xs"
                      style={{ color: colors.text.secondary }}
                    >
                      <span className="truncate">{lang}</span>
                      <span
                        className="shrink-0 pl-2"
                        style={{ color: colors.text.tertiary }}
                      >
                        {calculatePercentage(lang)}%
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ backgroundColor: colors.bg.tertiary }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${calculatePercentage(lang)}%`,
                          backgroundColor: colors.accent.primary,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </WindowPage>
    </>
  );
}
