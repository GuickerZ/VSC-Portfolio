import Head from "next/head";
import Link from "next/link";
import { SiVisualstudiocode } from "react-icons/si";

import WindowPage from "@components/WindowLayout/WindowPage";
import { useTheme } from "@contexts/ThemeContext";

export default function NotFound() {
  const { colors } = useTheme();

  return (
    <>
      <Head>
        <title>Página não Encontrada - Guilherme Matias | Portfólio</title>
      </Head>
      <WindowPage>
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center gap-5">
            <SiVisualstudiocode
              className="text-9xl"
              style={{ color: colors.bg.tertiary }}
            />
            <div className="flex flex-col items-center gap-2">
              <p
                className="select-none text-center"
                style={{ color: colors.text.tertiary }}
              >
                Página não encontrada!
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="select-none text-xs"
                  style={{ color: colors.text.tertiary }}
                >
                  Ir para o Início
                </span>
                <Link
                  href="/"
                  className="cursor-pointer select-none rounded-[3px] p-[2px_3px] text-xs font-light outline-none transition-colors"
                  style={{
                    backgroundColor: colors.bg.secondary,
                    color: colors.text.tertiary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.bg.hover;
                    e.currentTarget.style.color = colors.text.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.bg.secondary;
                    e.currentTarget.style.color = colors.text.tertiary;
                  }}
                >
                  Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </WindowPage>
    </>
  );
}
