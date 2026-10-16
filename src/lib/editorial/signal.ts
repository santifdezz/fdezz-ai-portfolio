/** Horizontal and vertical reach of the cursor's peak, in px. */
const SPREAD_X = 70;
const SPREAD_Y = 110;

/**
 * How much the cursor lifts a ridge (0..strength): a Gaussian peak under the
 * pointer, `dx`/`dy` px away from it. Always ≥ 0 — ridges only rise.
 */
export function ridgeLift(dx: number, dy: number, strength: number): number {
  if (strength <= 0) return 0;
  return strength * Math.exp(-(dx * dx) / (2 * SPREAD_X * SPREAD_X) - (dy * dy) / (2 * SPREAD_Y * SPREAD_Y));
}

export const RIPPLE_AMPLITUDE = 3;

/**
 * The resting signal on each ridge: two slow sine waves with a per-line phase,
 * bounded by RIPPLE_AMPLITUDE px, drifting with `time` (seconds).
 */
export function ripple(x: number, line: number, time: number): number {
  const a = Math.sin(x * 0.011 + line * 1.7 + time * 0.6);
  const b = Math.sin(x * 0.027 - line * 0.9 - time * 0.9);
  return RIPPLE_AMPLITUDE * (0.6 * a + 0.4 * b);
}

export interface RidgeOptions {
  /** Drawing width in px; one point every `step` px, plus one at the end. */
  width: number;
  /** Resting y of the line. */
  base: number;
  /** Where the peak stands, and how wide it is (Gaussian sigma, px). */
  peakX: number;
  spread: number;
  /** Peak height in px at `amp` 1; `amp` 0 leaves only the resting ripple. */
  height: number;
  amp: number;
  /** How jagged the peak is (0 = smooth), like the hero's ridges. */
  texture?: number;
  /** Resting ripple, as a share of RIPPLE_AMPLITUDE (0 = flat). */
  rippleScale?: number;
  line?: number;
  time?: number;
  step?: number;
}

const round = (n: number) => Math.round(n * 10) / 10;

/**
 * One ridge of the hero's signal field as an SVG path: a resting line with a
 * single peak rising (towards smaller y) at `peakX`. Pure, so the eyebrow rule,
 * the plates and the contact edge all draw the same line the hero does.
 */
export function ridgePath({
  width,
  base,
  peakX,
  spread,
  height,
  amp,
  texture = 0.35,
  rippleScale = 0,
  line = 0,
  time = 0,
  step = 6,
}: RidgeOptions): string {
  const xs = Array.from({ length: Math.floor(width / step) + 1 }, (_, i) => i * step);
  if (xs[xs.length - 1] < width) xs.push(width);
  const points = xs.map((x) => {
    const dx = x - peakX;
    const lift = amp * Math.exp(-(dx * dx) / (2 * spread * spread));
    const jag = 1 + texture * Math.sin(x * 0.21 + line * 2.3);
    const y = base + rippleScale * ripple(x, line, time) - height * lift * jag;
    return `${round(x)},${round(y)}`;
  });
  return `M${points.join("L")}`;
}
