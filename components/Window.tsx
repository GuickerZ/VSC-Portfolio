// components/Window.tsx
import React, { useContext } from "react";
import { motion } from "framer-motion";
import { MotionWindowContext } from "../contexts/MotionWindowContext";

export default function Window() {
  const ctx = useContext(MotionWindowContext);
  if (!ctx) return null;

  const {
    windowData,
    windowRef,
    controls,
    handleStartDrag,
    handleEndDrag,
    handleResizeWindow,
  } = ctx;

  return (
    // screenRef deve estar em um wrapper mais alto (veja _app ou layout)
    <div id="screen" ref={ctx.screenRef} className="relative h-full w-full">
      <motion.div
        ref={windowRef as any}
        drag
        dragControls={controls}
        dragListener={false} // só inicia drag via controls.start (titlebar)
        initial={false} // evita mismatch SSR/Client
        onDragEnd={() => handleEndDrag()}
        style={{
          width: windowData.width,
          height: windowData.height,
          x: windowData.x,
          y: windowData.y,
          position: "absolute",
          top: 0,
          left: 0,
          // zIndex e aparência padrão
          boxShadow: "0 8px 24px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.12)",
          borderRadius: 8,
          background: "rgba(255,255,255,0.9)",
          overflow: "hidden",
        }}
        // se quiser, você pode adicionar dragConstraints aqui
      >
        {/* Titlebar (arrastar por aqui) */}
        <div
          className="titlebar flex items-center px-3 py-2"
          onPointerDown={handleStartDrag}
          onPointerUp={() => handleEndDrag()}
          style={{ WebkitUserSelect: "none" }}
        >
          <div className="flex-1 text-sm font-medium">Minha Janela</div>
          {/* botões de fechar/minimizar, etc */}
          <div className="space-x-2">
            <button aria-label="minimize">—</button>
            <button aria-label="maximize">□</button>
            <button aria-label="close">×</button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="h-[calc(100%-40px)] overflow-auto p-4">
          <p>Conteúdo da janela aqui.</p>

          {/* Exemplo de grip de resize no canto inferior direito */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 300 }} // só como exemplo
            onDrag={handleResizeWindow}
            style={{
              position: "absolute",
              right: 8,
              bottom: 8,
              width: 24,
              height: 24,
              cursor: "nwse-resize",
              opacity: 0.5,
            }}
            aria-hidden
          />
        </div>
      </motion.div>
    </div>
  );
}
