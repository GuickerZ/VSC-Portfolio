import Head from "next/head";
import { useTheme, ThemeType } from "@contexts/ThemeContext";
import WindowPage from "@components/WindowLayout/WindowPage";
import { VscColorMode, VscCheck, VscInfo, VscSettings } from "react-icons/vsc";

export default function Settings() {
  const { theme, setTheme, colors } = useTheme();

  const themes: {
    id: ThemeType;
    name: string;
    description: string;
    preview: string[];
  }[] = [
    {
      id: "default",
      name: "Tema Padrão",
      description: "Tema escuro moderno com acentos em roxo",
      preview: ["#171717", "#d946ef"],
    },
    {
      id: "dracula",
      name: "Tema Dracula",
      description: "Tema clássico Dracula com cores vibrantes",
      preview: ["#282a36", "#ff79c6"],
    },
    {
      id: "purple",
      name: "Tema Purple Dark",
      description: "Tema escuro elegante com roxo profundo",
      preview: ["#0f172a", "#5b21b6"],
    },
  ];

  return (
    <>
      <Head>
        <title>Configurações - Guilherme Matias | Portfólio</title>
      </Head>
      <WindowPage>
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <VscSettings
              className="text-3xl"
              style={{ color: colors.accent.primary }}
            />
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: colors.text.primary }}
              >
                Configurações
              </h1>
              <p className="text-sm" style={{ color: colors.text.tertiary }}>
                Personalize sua experiência
              </p>
            </div>
          </div>

          {/* Tema */}
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: colors.bg.secondary,
              borderColor: colors.border,
              borderWidth: "1px",
            }}
          >
            <div className="mb-4 flex items-center gap-2">
              <VscColorMode
                className="text-xl"
                style={{ color: colors.accent.primary }}
              />
              <h2
                className="text-lg font-semibold"
                style={{ color: colors.text.primary }}
              >
                Aparência
              </h2>
            </div>

            <div className="space-y-3">
              {themes.map((themeOption) => (
                <div
                  key={themeOption.id}
                  onClick={() => setTheme(themeOption.id)}
                  className="cursor-pointer rounded-lg p-4 transition-all"
                  style={{
                    backgroundColor:
                      theme === themeOption.id
                        ? colors.bg.tertiary
                        : colors.bg.primary,
                    borderColor:
                      theme === themeOption.id
                        ? colors.accent.primary
                        : colors.border,
                    borderWidth: "2px",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3
                          className="font-semibold"
                          style={{ color: colors.text.primary }}
                        >
                          {themeOption.name}
                        </h3>
                        {theme === themeOption.id && (
                          <VscCheck
                            className="text-lg"
                            style={{ color: colors.accent.primary }}
                          />
                        )}
                      </div>
                      <p
                        className="mt-1 text-sm"
                        style={{ color: colors.text.tertiary }}
                      >
                        {themeOption.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {themeOption.preview.map((color, idx) => (
                        <div
                          key={idx}
                          className="h-8 w-8 rounded"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informações do Sistema */}
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: colors.bg.secondary,
              borderColor: colors.border,
              borderWidth: "1px",
            }}
          >
            <div className="mb-4 flex items-center gap-2">
              <VscInfo
                className="text-xl"
                style={{ color: colors.accent.primary }}
              />
              <h2
                className="text-lg font-semibold"
                style={{ color: colors.text.primary }}
              >
                Sobre
              </h2>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span style={{ color: colors.text.tertiary }}>Versão</span>
                <span style={{ color: colors.text.secondary }}>2.0.0</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.text.tertiary }}>Framework</span>
                <span style={{ color: colors.text.secondary }}>Next.js 13</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.text.tertiary }}>
                  Desenvolvedor
                </span>
                <span style={{ color: colors.text.secondary }}>
                  Guilherme Matias
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.text.tertiary }}>GitHub</span>
                <a
                  href="https://github.com/GuickerZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: colors.accent.primary }}
                  className="hover:underline"
                >
                  @GuickerZ
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm" style={{ color: colors.text.tertiary }}>
              Feito por Guilherme Matias
            </p>
          </div>
        </div>
      </WindowPage>
    </>
  );
}
