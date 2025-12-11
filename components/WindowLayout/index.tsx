import { ReactNode, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { MotionWindowContext } from "@contexts/MotionWindowContext";
import { useTheme } from "@contexts/ThemeContext";
import WindowHead from "./WindowHead";
import WindowSidebar from "./WindowSidebar";
import WindowFooter from "./WindowFooter";

interface WindowLayoutProps {
  children?: ReactNode;
}

export default function WindowLayout({ children }: WindowLayoutProps) {
  const router = useRouter();
  const { controls, windowData, windowRef } = useContext(MotionWindowContext);
  const { colors } = useTheme();
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );

  useEffect(() => {
    const ww = windowData.width.get();
    const wh = windowData.height.get();
    const x = Math.round((window.innerWidth - ww) / 2);
    const y = Math.round((window.innerHeight - wh) / 2);
    setPosition({ x, y });
  }, [windowData.width, windowData.height]);

  if (!position) return null;

  return (
    <motion.div
      drag
      dragListener={false}
      dragControls={controls}
      dragElastic={0}
      dragMomentum={false}
      dragTransition={{ power: 0, timeConstant: 0 }}
      initial={position}
      ref={windowRef}
      data-show-explorer={router.pathname == "/commits"}
      className="group grid grid-cols-[fit-content(100%)_1fr] grid-rows-[fit-content(100%)_auto_fit-content(100%)] rounded-md drop-shadow-[0px_0px_10px_#000000] data-[show-explorer=true]:grid-cols-[fit-content(100%)_fit-content(100%)_1fr]"
      style={{
        width: windowData.width,
        height: windowData.height,
        backgroundColor: colors.bg.primary,
        willChange: "transform",
        touchAction: "none",
      }}
    >
      <WindowHead />
      <WindowSidebar />
      {children}
      <WindowFooter />
    </motion.div>
  );
}
