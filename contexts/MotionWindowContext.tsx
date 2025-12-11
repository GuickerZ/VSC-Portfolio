// contexts/MotionWindowContext.tsx
import React, {
  ReactNode,
  RefObject,
  PointerEvent,
  useCallback,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  createContext,
} from "react";
import {
  useDragControls,
  useMotionValue,
  DragHandlers,
  MotionValue,
} from "framer-motion";

/**
 * UseIsomorphicLayoutEffect: usa useLayoutEffect no cliente e useEffect no SSR
 * Evita o warning: "useLayoutEffect does nothing on the server..."
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type WindowData = {
  width: MotionValue<number>;
  height: MotionValue<number>;
  x: MotionValue<number>;
  y: MotionValue<number>;
};

export type MotionWindowProviderProps = {
  children: ReactNode;
};

export type MotionWindowContextData = {
  screenRef: RefObject<HTMLDivElement>;
  windowRef: RefObject<HTMLDivElement>;
  windowData: WindowData;
  controls: ReturnType<typeof useDragControls>;
  handleStartDrag: (event: PointerEvent<HTMLDivElement>) => void;
  handleEndDrag: () => void;
  handleResizeWindow: DragHandlers["onDrag"];
  isMobileView: boolean;
};

// contexto non-null para facilitar consumo
export const MotionWindowContext = createContext<MotionWindowContextData>(
  {} as MotionWindowContextData,
);

const MIN_WIDTH = 320;
const MIN_HEIGHT = 280;
const MOBILE_BREAKPOINT = 768;

const isMobileWindow = () =>
  typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;

export function MotionWindowProvider({ children }: MotionWindowProviderProps) {
  const controls = useDragControls();
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  const windowRef = useRef<HTMLDivElement | null>(null);
  const screenRef = useRef<HTMLDivElement | null>(null);

  const windowWidth = useMotionValue<number>(800);
  const windowHeight = useMotionValue<number>(600);
  const posX = useMotionValue<number>(0);
  const posY = useMotionValue<number>(0);

  const isDraggingRef = useRef(false);

  // inicializa tamanho e posição **antes da pintura no cliente**
  // e usa useEffect no servidor para evitar warnings
  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined" || !screenRef.current) return;

    const mobile = isMobileWindow();
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

    const sw = screenRef.current.clientWidth;
    const sh = screenRef.current.clientHeight;
    const x = Math.max(0, Math.floor((sw - windowWidth.get()) / 2));
    const y = Math.max(0, Math.floor((sh - windowHeight.get()) / 2));
    posX.set(x);
    posY.set(y);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenRef]);

  // resize: recalcula limites e recentraliza quando apropriado
  useEffect(() => {
    const onResize = () => {
      if (typeof window === "undefined") return;
      const mobile = isMobileWindow();
      setIsMobileView(mobile);

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const maxW = mobile
        ? Math.floor(vw * 0.95)
        : (screenRef.current?.clientWidth ?? vw) - 40;
      const maxH = mobile
        ? Math.floor(vh * 0.8)
        : (screenRef.current?.clientHeight ?? vh) - 40;

      const currentW = windowWidth.get();
      const currentH = windowHeight.get();

      if (currentW > maxW) windowWidth.set(Math.max(MIN_WIDTH, maxW));
      if (currentH > maxH) windowHeight.set(Math.max(MIN_HEIGHT, maxH));

      if (!isDraggingRef.current && screenRef.current) {
        const sw = screenRef.current.clientWidth;
        const sh = screenRef.current.clientHeight;
        const x = Math.max(0, Math.floor((sw - windowWidth.get()) / 2));
        const y = Math.max(0, Math.floor((sh - windowHeight.get()) / 2));
        posX.set(x);
        posY.set(y);
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    onResize();
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [windowWidth, windowHeight, posX, posY]);

  const handleStartDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      isDraggingRef.current = true;
      controls.start(event as unknown as PointerEvent);
    },
    [controls],
  );

  const handleEndDrag = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const resizeWindow: DragHandlers["onDrag"] = (event, info) => {
    if (!screenRef.current) return;

    const mobile = isMobileWindow();
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

  const value: MotionWindowContextData = {
    screenRef,
    windowRef,
    windowData: { width: windowWidth, height: windowHeight, x: posX, y: posY },
    controls,
    handleStartDrag,
    handleEndDrag,
    handleResizeWindow,
    isMobileView,
  };

  return (
    <MotionWindowContext.Provider value={value}>
      {children}
    </MotionWindowContext.Provider>
  );
}

export default MotionWindowProvider;
