"use client";

import { useEffect, useMemo, useState } from "react";

export type DeviceKind = "mobile" | "tablet" | "laptop" | "desktop" | "wide";

export const BREAKPOINTS = {
  // соответствуют Tailwind по умолчанию
  sm: 640,   // ≥640px
  md: 768,   // ≥768px
  lg: 1024,  // ≥1024px
  xl: 1280,  // ≥1280px
  "2xl": 1536, // ≥1536px
} as const;

function classify(width: number): DeviceKind {
  if (width < BREAKPOINTS.md) return "mobile";          // <768
  if (width < BREAKPOINTS.lg) return "tablet";          // 768–1023
  if (width < BREAKPOINTS.xl) return "laptop";          // 1024–1279
  if (width < BREAKPOINTS["2xl"]) return "desktop";     // 1280–1535
  return "wide";                                        // ≥1536
}

export function useBreakpoint() {
  const [size, setSize] = useState<{ width: number; height: number }>(() => ({
    // SSR-safe: до монтирования рендрим как 0
    width: 0,
    height: 0,
  }));

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = requestAnimationFrame(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      });
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
    };
  }, []);

  const device = useMemo(() => classify(size.width), [size.width]);

  // удобные флаги (совместимы с tailwind breakpoints)
  const flags = useMemo(() => {
    const w = size.width;
    return {
      // down
      isSmDown: w < BREAKPOINTS.sm,
      isMdDown: w < BREAKPOINTS.md,
      isLgDown: w < BREAKPOINTS.lg,
      isXlDown: w < BREAKPOINTS.xl,

      // up
      isSmUp: w >= BREAKPOINTS.sm,
      isMdUp: w >= BREAKPOINTS.md,
      isLgUp: w >= BREAKPOINTS.lg,
      isXlUp: w >= BREAKPOINTS.xl,
      is2xlUp: w >= BREAKPOINTS["2xl"],
    };
  }, [size.width]);

  return {
    width: size.width,
    height: size.height,
    device,                // "mobile" | "tablet" | "laptop" | "desktop" | "wide"
    ...flags,
    // удобные алиасы
    isMobile: device === "mobile",
    isTablet: device === "tablet",
    isDesktop: device === "desktop" || device === "wide" || device === "laptop",
  };
}
