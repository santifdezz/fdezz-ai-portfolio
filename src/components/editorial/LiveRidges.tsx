"use client";

import { motion, type MotionValue } from "framer-motion";
import { ridgeGeometry, WIDTH } from "./RidgeLines";

interface LiveRidgesProps {
  lines?: number;
  peakAt?: number;
  ground: string;
  /** 0..1: how much of each ridge has been drawn. */
  draw: MotionValue<number>;
  className?: string;
}

/**
 * RidgeLines whose strokes are drawn by a motion value: the plate's signal
 * traces itself as its slide arrives in the pinned gallery. The fills stay put
 * so each ridge still hides the ones behind it.
 */
export function LiveRidges({ lines = 9, peakAt = 0.66, ground, draw, className = "" }: LiveRidgesProps) {
  const { height, ridges } = ridgeGeometry(lines, peakAt);
  return (
    <svg aria-hidden viewBox={`0 0 ${WIDTH} ${height}`} preserveAspectRatio="none" className={`pointer-events-none ${className}`}>
      {ridges.map(({ d, area }, i) => (
        <g key={i}>
          <path d={area} fill={ground} />
          <motion.path d={d} fill="none" stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke" style={{ pathLength: draw }} />
        </g>
      ))}
    </svg>
  );
}
