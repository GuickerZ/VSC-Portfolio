import { ReactNode } from "react";
import { useTheme } from "@contexts/ThemeContext";

interface WindowPageProps {
  children?: ReactNode;
}

export default function WindowPage({ children }: WindowPageProps) {
  const { colors } = useTheme();

  return (
    <div
      className="h-full w-full min-w-0 overflow-auto scroll-smooth border-r-[1px] p-3 scrollbar-thin scrollbar-track-neutral-900 scrollbar-thumb-neutral-800 sm:p-5"
      style={{
        borderColor: colors.border,
      }}
    >
      <div className="min-w-0">{children}</div>
    </div>
  );
}
