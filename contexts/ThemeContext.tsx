import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type ThemeType = "default" | "dracula" | "purple";

interface ThemeContextData {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: {
    bg: {
      primary: string;
      secondary: string;
      tertiary: string;
      hover: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      accent: string;
    };
    border: string;
    accent: {
      primary: string;
      secondary: string;
    };
  };
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext({} as ThemeContextData);

const themes = {
  default: {
    bg: {
      primary: "#171717",
      secondary: "#262626",
      tertiary: "#404040",
      hover: "#525252",
    },
    text: {
      primary: "#fafafa",
      secondary: "#d4d4d4",
      tertiary: "#a3a3a3",
      accent: "#10b981",
    },
    border: "#525252",
    accent: {
      primary: "#d946ef",
      secondary: "#c026d3",
    },
  },
  dracula: {
    bg: {
      primary: "#282a36",
      secondary: "#44475a",
      tertiary: "#6272a4",
      hover: "#6272a4",
    },
    text: {
      primary: "#f8f8f2",
      secondary: "#f8f8f2",
      tertiary: "#6272a4",
      accent: "#50fa7b",
    },
    border: "#44475a",
    accent: {
      primary: "#ff79c6",
      secondary: "#bd93f9",
    },
  },
  purple: {
    bg: {
      primary: "#0f172a",
      secondary: "#1e293b",
      tertiary: "#334155",
      hover: "#475569",
    },
    text: {
      primary: "#f4f4f5",
      secondary: "#d4d4d8",
      tertiary: "#a1a1aa",
      accent: "#8b5cf6",
    },
    border: "#334155",
    accent: {
      primary: "#5b21b6",
      secondary: "#7c3aed",
    },
  },
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeType>("default");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeType;
    if (savedTheme && themes[savedTheme]) {
      setThemeState(savedTheme);
    }
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        colors: themes[theme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
