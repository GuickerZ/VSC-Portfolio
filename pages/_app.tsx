import "../styles/globals.css";
import { Inter } from "next/font/google";
import type { AppProps } from "next/app";
import { MotionWindowProvider } from "@contexts/MotionWindowContext";
import { ThemeProvider } from "@contexts/ThemeContext";
import { AudioProvider } from "@contexts/AudioContext";
import { CommandPaletteProvider } from "@contexts/CommandPaletteContext";
import Screen from "@components/Screen";
import CommandPalette from "@components/CommandPalette";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
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
