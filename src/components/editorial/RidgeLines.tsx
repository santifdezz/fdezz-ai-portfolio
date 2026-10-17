import { ridgePath } from "@/lib/editorial/signal";

export const WIDTH = 600;

interface RidgeLinesProps {
  /** Number of stacked ridges. */
  lines?: number;
  /** Peak position across the width, 0..1. */
  peakAt?: number;
  /** Fill each ridge with this colour so it hides the ones behind it, as in the hero. */
  ground: string;
  className?: string;
}

/**
 * A still slice of the hero's signal field, as texture: stacked ridges with
 * one peak, stroked in the current text colour (set the strength with the
 * text opacity). Decorative.
 */
export function ridgeGeometry(lines: number, peakAt: number) {
  const height = 40 + lines * 22;
  const ridges = Array.from({ length: lines }, (_, i) => {
    const base = 40 + i * 22;
    const d = ridgePath({
      width: WIDTH,
      base,
      peakX: WIDTH * peakAt + (i % 2 ? 14 : -10),
      spread: 46,
      height: 34 * (1 - i / (lines * 1.6)),
      amp: 1,
      rippleScale: 1,
      line: i,
      time: 2.4,
      step: 8,
    });
    return { d, area: `${d}L${WIDTH},${height}L0,${height}Z` };
  });
  return { height, ridges };
}

export function RidgeLines({ lines = 9, peakAt = 0.66, ground, className = "" }: RidgeLinesProps) {
  const { height, ridges } = ridgeGeometry(lines, peakAt);

  return (
    <svg aria-hidden viewBox={`0 0 ${WIDTH} ${height}`} preserveAspectRatio="none" className={`pointer-events-none ${className}`}>
      {ridges.map(({ d, area }, i) => (
        <g key={i}>
          <path d={area} fill={ground} />
          <path d={d} fill="none" stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke" />
        </g>
      ))}
    </svg>
  );
}
