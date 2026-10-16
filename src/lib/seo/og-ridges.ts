import { ridgeLift, ripple } from "@/lib/editorial/signal";

/** How far a ridge rises at the very centre of the peak, in px (mirrors SignalField's PEAK). */
const PEAK_RISE = 70;

export interface RidgePath {
  /** The ridge's rippled, lifted surface, as an open SVG path ("M...L...L..."). */
  strokeD: string;
  /** The same path closed down to `bottom`, for an opaque fill that hides the ridges behind it. */
  areaD: string;
  /** Highest lift (0..peakStrength) reached anywhere along this ridge. */
  lift: number;
}

export interface RidgeFieldOptions {
  /** Canvas width the field spans, in px. */
  width: number;
  /** Y of the topmost ridge's resting line. */
  top: number;
  /** Y of the bottommost ridge's resting line, and where every area path closes. */
  bottom: number;
  /** Number of stacked ridges. */
  lines: number;
  /** Where the single Gaussian peak sits. */
  peakX: number;
  peakY: number;
  /** 0 disables the peak; 1 is the full rise defined by PEAK_RISE. Defaults to 1. */
  peakStrength?: number;
  /** Horizontal sampling step, in px. Defaults to 14. */
  step?: number;
  /** Phase fed to ripple() for the resting wave. Defaults to 0 (a fixed, non-animated frame). */
  time?: number;
}

const round = (n: number): number => Math.round(n * 100) / 100;

/**
 * A static ridgeline field: `lines` stacked horizontal signal lines, each a
 * slightly rippled path (ripple()) with one shared Gaussian peak (ridgeLift())
 * rising near (peakX, peakY). Reuses the exact math SignalField animates on
 * the landing page, at a single frozen frame — suited to a server-rendered
 * image where nothing can tick a requestAnimationFrame loop. Ridges are
 * returned top-first; draw each one's area then its stroke in that order so
 * later (lower) ridges correctly occlude earlier ones, the way the canvas does.
 */
export function buildRidgeField(options: RidgeFieldOptions): RidgePath[] {
  const { width, top, bottom, lines, peakX, peakY, peakStrength = 1, step = 14, time = 0 } = options;
  if (lines < 1 || width <= 0) return [];

  const gap = lines > 1 ? (bottom - top) / (lines - 1) : 0;

  return Array.from({ length: lines }, (_, line) => {
    const base = top + line * gap;
    const points: Array<[number, number]> = [];
    let lift = 0;

    const sample = (x: number): [number, number] => {
      const l = ridgeLift(x - peakX, base - peakY, peakStrength);
      lift = Math.max(lift, l);
      return [x, base + ripple(x, line, time) - PEAK_RISE * l];
    };

    for (let x = 0; x <= width; x += step) points.push(sample(x));
    if (points[points.length - 1][0] !== width) points.push(sample(width));

    const strokeD = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${round(x)},${round(y)}`).join(" ");
    const areaD = `${strokeD} L${round(width)},${round(bottom)} L0,${round(bottom)} Z`;

    return { strokeD, areaD, lift };
  });
}

export interface RidgeGlow {
  color: string;
  opacity: number;
}

/** Quiet foreground every ridge rests at when the peak doesn't touch it. */
const RESTING_COLOR = "#f0f0f0";
const RESTING_OPACITY = 0.09;
/** Below this, treat a ridge as untouched — matches SignalField's `lifted > 0.02` cutoff. */
const GLOW_THRESHOLD = 0.02;
const VIOLET = "#a366ff";

/**
 * The colour+opacity a ridge's stroke glows at, given its peak `lift` (0..~peakStrength):
 * quiet foreground at rest, violet and brighter the more the peak lifts it — the same mapping
 * SignalField's canvas gradient uses for its middle colour stop (`0.12 + 0.5 * lifted`).
 */
export function ridgeGlow(lift: number): RidgeGlow {
  if (lift <= GLOW_THRESHOLD) return { color: RESTING_COLOR, opacity: RESTING_OPACITY };
  return { color: VIOLET, opacity: Math.min(0.95, 0.12 + 0.5 * lift) };
}
