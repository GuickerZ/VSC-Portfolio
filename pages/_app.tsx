// pages/_app.tsx
import "../styles/globals.css";
import { Inter } from "next/font/google";
import type { AppProps } from "next/app";
import { useEffect } from "react";

import { MotionWindowProvider } from "@contexts/MotionWindowContext";
import { ThemeProvider } from "@contexts/ThemeContext";
import { AudioProvider } from "@contexts/AudioContext";
import { CommandPaletteProvider } from "@contexts/CommandPaletteContext";
import Screen from "@components/Screen";
import CommandPalette from "@components/CommandPalette";

import { setVh } from "@components/setVh"; // ajuste o path se necessário

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // seta a variável --vh para evitar problemas com 100vh no mobile
    setVh();
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);

    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);

  return (
    <div className={`${inter.variable} font-sans`}>
      <ThemeProvider>
        <AudioProvider>
          <CommandPaletteProvider>
            <MotionWindowProvider>
              <CommandPalette />
              <Screen>
                <Component {...pageProps} />
              </Screen>
            </MotionWindowProvider>
          </CommandPaletteProvider>
        </AudioProvider>
      </ThemeProvider>
    </div>
  );
}
