// contexts/MotionWindowContext.tsx
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  PointerEvent,
} from "react";
import {
  useDragControls,
  useMotionValue,
  DragHandlers,
  MotionValue,
} from "framer-motion";

import {
  MotionWindowContextData,
  MotionWindowProviderProps,
} from "@interfaces/MotionWindowContextInterfaces";

export const MotionWindowContext = createContext({} as MotionWindowContextData);

const MIN_WIDTH = 320;
const MIN_HEIGHT = 280;
const MOBILE_BREAKPOINT = 768;

const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;

export function MotionWindowProvider({ children }: MotionWindowProviderProps) {
  const controls = useDragControls();
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  const windowRef = useRef<HTMLDivElement | null>(null);
  const screenRef = useRef<HTMLDivElement | null>(null);

  const windowWidth = useMotionValue<number>(800) as MotionValue<number>;
  const windowHeight = useMotionValue<number>(600) as MotionValue<number>;

  // Inicializa tamanho baseado na tela
  useEffect(() => {
    if (!screenRef.current) return;

    const mobile = isMobile();
    setIsMobileView(mobile);

    if (mobile) {
      const w = Math.max(MIN_WIDTH, Math.floor(window.innerWidth * 0.92));
      const h = Math.max(MIN_HEIGHT, Math.floor(window.innerHeight * 0.75));
      windowWidth.set(w);
      windowHeight.set(h);
    } else {
      const sw = screenRef.current.clientWidth;
      const sh = screenRef.current.clientHeight;
      const w = Math.min(Math.max(MIN_WIDTH, 800), sw - 40);
      const h = Math.min(Math.max(MIN_HEIGHT, 600), sh - 40);
      windowWidth.set(w);
      windowHeight.set(h);
    }
  }, [screenRef, windowWidth, windowHeight]);

  // Responde a mudanças de viewport
  useEffect(() => {
    const onResize = () => {
      const mobile = isMobile();
      setIsMobileView(mobile);

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Limita o tamanho máximo da janela
      const maxW = mobile ? Math.floor(vw * 0.95) : vw - 40;
      const maxH = mobile ? Math.floor(vh * 0.8) : vh - 40;

      const currentW = windowWidth.get();
      const currentH = windowHeight.get();

      if (currentW > maxW) windowWidth.set(Math.max(MIN_WIDTH, maxW));
      if (currentH > maxH) windowHeight.set(Math.max(MIN_HEIGHT, maxH));
    };

    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, [windowWidth, windowHeight]);

  const handleStartDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      controls.start(event as any);
    },
    [controls],
  );

  const resizeWindow: DragHandlers["onDrag"] = (event, info) => {
    if (!screenRef.current) return;

    const mobile = isMobile();
    const maxW = mobile
      ? Math.floor(window.innerWidth * 0.92)
      : screenRef.current.clientWidth - 40;
    const maxH = mobile
      ? Math.floor(window.innerHeight * 0.75)
      : screenRef.current.clientHeight - 40;

    const newWidth = Math.max(
      MIN_WIDTH,
      Math.min(windowWidth.get() + info.delta.x, maxW),
    );
    const newHeight = Math.max(
      MIN_HEIGHT,
      Math.min(windowHeight.get() + info.delta.y, maxH),
    );

    windowWidth.set(newWidth);
    windowHeight.set(newHeight);
  };

  const handleResizeWindow = useCallback(resizeWindow, [
    windowWidth,
    windowHeight,
  ]);

  return (
    <MotionWindowContext.Provider
      value={
        {
          screenRef,
          windowRef,
          windowData: { width: windowWidth, height: windowHeight },
          controls,
          handleStartDrag,
          handleResizeWindow,
          isMobileView,
        } as any
      }
    >
      {children}
    </MotionWindowContext.Provider>
  );
}
