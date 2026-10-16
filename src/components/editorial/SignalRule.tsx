"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { ridgePath } from "@/lib/editorial/signal";
import { REDUCED_MOTION_QUERY, useMediaQuery } from "./hooks";

const HEIGHT = 14;
const BASE = HEIGHT - 1.5;
const PEAK = 10;
const SPREAD = 16;
const TRAVEL = 0.8; // share of the rule the pulse crosses before it dies out
const DURATION = 0.95;

/**
 * The eyebrow rule as one ridge of the hero's signal field: a pulse runs along
 * it as the line draws in, and decays (exponential release) to a flat line.
 * Reduced motion: the flat line, drawn.
 */
export function SignalRule({ tone }: { tone: "ground" | "accent" }) {
  const ref = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(0);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useMediaQuery(REDUCED_MOTION_QUERY);
  const t = useMotionValue(0);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(t, 1, { duration: DURATION, ease: "linear" });
    return () => controls.stop();
  }, [inView, reduce, t]);

  const d = useTransform(t, (p) =>
    ridgePath({
      width,
      base: BASE,
      peakX: p * width * TRAVEL,
      spread: SPREAD,
      height: PEAK,
      amp: p >= 1 ? 0 : Math.exp(-3.2 * p),
    }),
  );
  const drawn = useTransform(t, (p) => Math.min(1, p * 1.5));
  const pulse = useTransform(t, [0, 0.75, 1], [1, 0.9, 0]);

  const stroke = tone === "accent" ? "hsl(var(--primary-foreground) / 0.4)" : "hsl(var(--border))";
  const head = tone === "accent" ? "hsl(var(--primary-foreground))" : "hsl(var(--primary))";
  const flat = `M0,${BASE}L${width},${BASE}`;

  return (
    <svg ref={ref} aria-hidden className="block h-3.5 min-w-8 flex-1 overflow-visible" viewBox={`0 0 ${Math.max(1, width)} ${HEIGHT}`}>
      {reduce ? (
        <path d={flat} fill="none" stroke={stroke} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      ) : (
        <>
          <motion.path d={flat} fill="none" stroke={stroke} strokeWidth={1} style={{ pathLength: drawn }} />
          <motion.path
            d={d}
            fill="none"
            stroke={head}
            strokeWidth={1.25}
            strokeLinejoin="round"
            style={{ pathLength: drawn, opacity: pulse }}
          />
        </>
      )}
    </svg>
  );
}
