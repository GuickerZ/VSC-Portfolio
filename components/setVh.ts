// utils/setVh.ts
export function setVh(): void {
  if (typeof window === "undefined") return;
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}
