import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import WindowExplorer from "@components/WindowLayout/WindowExplorer";
import WindowPage from "@components/WindowLayout/WindowPage";
import { useTheme } from "@contexts/ThemeContext";

interface CommitsProps {
  sourceCodeCommits: {
    sha: string;
    commit: {
      committer: {
        name: string;
        email: string;
        date: string;
      };
      message: string;
    };
    html_url: string;
    author: {
      avatar_url: string;
    };
  }[];
}

export default function Commits({ sourceCodeCommits }: CommitsProps) {
  const { colors } = useTheme();

  return (
    <>
      <Head>
        <title>Commits - Guilherme Matias | Portfólio</title>
      </Head>
      <WindowExplorer>
        <div
          className="flex h-10 items-center px-3"
          style={{ backgroundColor: colors.bg.tertiary }}
        >
          <h1
            className="select-none text-sm"
            style={{ color: colors.text.primary }}
          >
            COMMITS
          </h1>
        </div>

        <div className="h-[calc(100%-40px)] overflow-y-scroll scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-800">
          {sourceCodeCommits.map((data) => (
            <div
              key={data.sha}
              className="flex w-full flex-col gap-1 p-2 transition-colors"
              style={{ backgroundColor: "transparent" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = colors.bg.hover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Image
                    src={data.author.avatar_url}
                    alt="Github Avatar"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <Link
                    href={`https://github.com/${data.commit.committer.name}`}
                    className="cursor-pointer select-none text-sm hover:underline"
                    style={{ color: colors.text.secondary }}
                  >
                    {data.commit.committer.name}
                  </Link>
                </div>
                <Link
                  href={data.html_url}
                  className="cursor-pointer select-none text-sm hover:underline"
                  style={{ color: colors.accent.primary }}
                >
                  #{data.sha.slice(0, 7)}
                </Link>
              </div>
              <p
                className="select-none text-sm"
                style={{ color: colors.text.secondary }}
              >
                {data.commit.message}
              </p>
              <p
                className="select-none text-xs"
                style={{ color: colors.text.tertiary }}
              >
                {new Date(data.commit.committer.date).toLocaleDateString(
                  "pt-BR",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </p>
            </div>
          ))}
        </div>
      </WindowExplorer>
      <WindowPage>
        <div className="flex flex-col gap-2">
          <h1
            className="select-none text-lg"
            style={{ color: colors.text.primary }}
          >
            Commits do Projeto
          </h1>
          <p className="font-light" style={{ color: colors.text.secondary }}>
            Bem-vindo à página de commits do meu portfólio! Aqui, você pode
            acompanhar todas as recentes modificações neste espaço que reflete
            meu trabalho e habilidades.
          </p>
          <p className="font-light" style={{ color: colors.text.secondary }}>
            Fique a vontade para explorar e analisar todas as alterações feitas
            nesse projeto.
          </p>
          <span
            className="select-none text-sm font-light"
            style={{ color: colors.text.tertiary }}
          >
            Att. Guilherme Matias
          </span>
        </div>
      </WindowPage>
    </>
  );
}

export async function getStaticProps() {
  const commits = await axios.get(
    "https://api.github.com/repos/GuickerZ/GuickerZ/commits",
  );

  return {
    props: {
      sourceCodeCommits: commits.data,
    },
  };
}
