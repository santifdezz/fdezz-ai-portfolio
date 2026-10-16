"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ridgePath } from "@/lib/editorial/signal";
import { REDUCED_MOTION_QUERY, useMediaQuery } from "./hooks";

const W = 1440;
const H = 120;
const LINES = 5;

const ridge = (amp: number, line: number, base: number, height: number) =>
  ridgePath({ width: W, base, peakX: W * 0.7, spread: 120, height, amp, texture: 0.3, rippleScale: 1.4, line, time: 1.7, step: 12 });

/**
 * The contact block as the record's B-side: its top edge is one of the hero's
 * ridges, rising out of the page as you scroll in, with fainter ridges echoing
 * it inside the block. Reduced motion: a straight edge.
 */
export function ContactEdge() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useMediaQuery(REDUCED_MOTION_QUERY);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.35"] });
  const edge = useTransform(scrollYProgress, (p) => `${ridge(p, 0, H, H * 0.82)}L${W},${H + 1}L0,${H + 1}Z`);
  const echoes = useTransform(scrollYProgress, (p) =>
    Array.from({ length: LINES }, (_, i) => ridge(p * (1 - (i + 1) / (LINES + 2)), i + 1, 22 + i * 20, H * 0.5)).join(""),
  );

  if (reduce) return null;
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-x-0 top-0">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-x-0 -bottom-px h-[clamp(3.5rem,8vw,7.5rem)] w-full">
        <motion.path d={edge} fill="hsl(var(--primary))" />
      </svg>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-[clamp(5rem,11vw,10rem)] w-full">
        <motion.path d={echoes} fill="none" stroke="hsl(var(--primary-foreground) / 0.09)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
