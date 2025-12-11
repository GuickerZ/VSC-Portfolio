// components/Screen.tsx
import { ReactNode, useContext } from "react";
import { MotionWindowContext } from "@contexts/MotionWindowContext";

import WindowLayout from "./WindowLayout";

interface ScreenProps {
  children: ReactNode;
}

export default function Screen({ children }: ScreenProps) {
  // agora o contexto é non-nullable, podemos desestruturar direto
  const { screenRef } = useContext(MotionWindowContext);

  return (
    <div
      ref={screenRef as any}
      className="fixed inset-0 h-screen w-screen overflow-hidden"
    >
      <WindowLayout>{children}</WindowLayout>
    </div>
  );
}
