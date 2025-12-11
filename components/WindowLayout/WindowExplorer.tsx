import { ReactNode } from "react";
import { useTheme } from "@contexts/ThemeContext";

interface WindowExplorerProps {
  children: ReactNode;
}

export default function WindowExplorer({ children }: WindowExplorerProps) {
  const { colors } = useTheme();

  return (
    <div
      className="h-full w-full min-w-[200px] max-w-[300px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-800"
      style={{
        backgroundColor: `${colors.bg.secondary}99`,
      }}
    >
      {children}
    </div>
  );
}
