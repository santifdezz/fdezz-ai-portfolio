"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { CURSOR_QUERY, useMediaQuery } from "./hooks";

interface CursorState {
  active: boolean;
  label: string;
}

const zoneLabelAt = (x: number, y: number) =>
  document.elementFromPoint(x, y)?.closest("[data-cursor]")?.getAttribute("data-cursor") ?? null;

// Keeps the last label while the disc shrinks away; returns `prev` when nothing changed.
const nextCursor = (prev: CursorState, label: string | null): CursorState => {
  if (label) return prev.active && prev.label === label ? prev : { active: true, label };
  return prev.active ? { active: false, label: prev.label } : prev;
};

function Reticle() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 600, damping: 45, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 600, damping: 45, mass: 0.5 });
  const [cursor, setCursor] = useState<CursorState>({ active: false, label: "" });

  useEffect(() => {
    // Not `data-cursor`: zones are found with closest("[data-cursor]"), which would reach <html>.
    const root = document.documentElement;
    root.dataset.customCursor = "on";

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const label = zoneLabelAt(e.clientX, e.clientY);
      setCursor((prev) => nextCursor(prev, label));
    };
    // Scrolling moves zones under a still pointer (the gallery slides past).
    const onScroll = () => {
      const label = zoneLabelAt(x.get(), y.get());
      setCursor((prev) => nextCursor(prev, label));
    };
    const onLeave = () => setCursor((prev) => nextCursor(prev, null));

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      delete root.dataset.customCursor;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[45]" style={{ x: springX, y: springY }}>
      <motion.div
        className="relative"
        initial={false}
        animate={cursor.active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
      >
        <svg viewBox="0 0 48 48" className="absolute -left-6 -top-6 size-12 text-[hsl(var(--primary))]" fill="none" stroke="currentColor" strokeWidth="1.25">
          <circle cx="24" cy="24" r="6.5" />
          <path d="M24 1v13M24 34v13M1 24h13M34 24h13" />
        </svg>
        <span className="absolute left-5 top-4 whitespace-nowrap rounded-[3px] bg-[hsl(var(--foreground))] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--background))]">
          {cursor.label}
        </span>
      </motion.div>
    </motion.div>
  );
}

/** An instrument reticle with a readout, over interactive zones only; off on touch, small screens and reduced motion. */
export function CustomCursor() {
  const enabled = useMediaQuery(CURSOR_QUERY);
  return enabled ? <Reticle /> : null;
}
