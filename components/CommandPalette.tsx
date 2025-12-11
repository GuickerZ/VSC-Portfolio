import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@contexts/ThemeContext";
import { useAudio } from "@contexts/AudioContext";
import { useCommandPalette } from "@contexts/CommandPaletteContext";
import {
  VscHome,
  VscAccount,
  VscCode,
  VscGitCommit,
  VscSettingsGear,
  VscSearch,
} from "react-icons/vsc";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { FaDiscord } from "react-icons/fa";

interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

export default function CommandPalette() {
  const router = useRouter();
  const { colors, setTheme } = useTheme();
  const { isMuted, toggle: toggleAudio } = useAudio();
  const { isOpen, close, toggle } = useCommandPalette();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = useMemo(
    () => [
      {
        id: "home",
        label: "Ir para Início",
        icon: <VscHome />,
        action: () => router.push("/"),
        keywords: ["home", "inicio", "index"],
      },
      {
        id: "profile",
        label: "Ir para Perfil",
        icon: <VscAccount />,
        action: () => router.push("/profile"),
        keywords: ["perfil", "github", "sobre"],
      },
      {
        id: "projects",
        label: "Ir para Projetos",
        icon: <VscCode />,
        action: () => router.push("/projects"),
        keywords: ["projetos", "repos", "repositorios"],
      },
      {
        id: "commits",
        label: "Ir para Commits",
        icon: <VscGitCommit />,
        action: () => router.push("/commits"),
        keywords: ["git", "historico"],
      },
      {
        id: "settings",
        label: "Ir para Configurações",
        icon: <VscSettingsGear />,
        action: () => router.push("/settings"),
        keywords: ["config", "tema", "preferencias"],
      },
      {
        id: "discord",
        label: "Ir para Discord",
        icon: <FaDiscord />,
        action: () => router.push("/discord"),
        keywords: ["social", "contato"],
      },
      {
        id: "toggle-music",
        label: isMuted ? "Ativar Música" : "Desativar Música",
        icon: isMuted ? <HiVolumeOff /> : <HiVolumeUp />,
        action: () => toggleAudio(),
        keywords: ["audio", "som", "musica", "play", "pause"],
      },
      {
        id: "theme-default",
        label: "Tema: Default (Dark)",
        icon: <VscSettingsGear />,
        action: () => setTheme("default"),
        keywords: ["escuro", "noite", "dark"],
      },
      {
        id: "theme-purple",
        label: "Tema: Purple",
        icon: <VscSettingsGear />,
        action: () => setTheme("purple"),
        keywords: ["roxo", "violet"],
      },
      {
        id: "theme-dracula",
        label: "Tema: Dracula",
        icon: <VscSettingsGear />,
        action: () => setTheme("dracula"),
        keywords: ["roxo", "purple"],
      },
    ],
    [router, isMuted, toggleAudio, setTheme],
  );

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    const lower = search.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(lower) ||
        cmd.keywords?.some((k) => k.includes(lower)),
    );
  }, [commands, search]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        toggle();
        setSearch("");
        setSelectedIndex(0);
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1,
        );
      } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        close();
      }
    },
    [isOpen, filteredCommands, selectedIndex],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
            onClick={() => close()}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="fixed left-1/2 top-12 z-[101] w-[90%] max-w-md -translate-x-1/2 overflow-hidden rounded-lg shadow-2xl"
            style={{
              backgroundColor: colors.bg.secondary,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div className="flex items-center gap-2 px-3 py-2">
              <VscSearch
                className="text-sm"
                style={{ color: colors.text.tertiary }}
              />
              <input
                type="text"
                placeholder="Buscar comandos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-opacity-50"
                style={{ color: colors.text.primary }}
              />
            </div>

            <div
              className="max-h-72 overflow-y-auto border-t"
              style={{ borderColor: colors.border }}
            >
              {filteredCommands.length === 0 ? (
                <div
                  className="px-3 py-6 text-center text-sm"
                  style={{ color: colors.text.tertiary }}
                >
                  Nenhum resultado encontrado
                </div>
              ) : (
                filteredCommands.map((cmd, index) => (
                  <div
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      close();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className="flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors"
                    style={{
                      backgroundColor:
                        index === selectedIndex
                          ? colors.accent.primary
                          : "transparent",
                      color:
                        index === selectedIndex ? "#fff" : colors.text.primary,
                    }}
                  >
                    <span
                      style={{
                        color:
                          index === selectedIndex
                            ? "#fff"
                            : colors.text.tertiary,
                      }}
                    >
                      {cmd.icon}
                    </span>
                    <span className="text-sm">{cmd.label}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
