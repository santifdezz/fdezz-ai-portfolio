export interface NarrativeParts {
  kicker: string;
  rest: string[];
}

export function splitNarrative(narrative: string | undefined): NarrativeParts {
  const sentences = (narrative ?? "").match(/[^.!?]+(?:[.!?]+|$)/g) ?? [];
  const [kicker = "", ...rest] = sentences.map((s) => s.trim()).filter(Boolean);
  return { kicker, rest };
}

export function parseYearRange(year: string): { start: number; end: number } | null {
  const years = (year.match(/\d{4}/g) ?? []).map(Number);
  if (years.length === 0) return null;
  return { start: years[0], end: years[years.length - 1] };
}

export interface TrajectorySegment {
  title: string;
  weight: number;
}

const MIN_STAGE_YEARS = 0.5;

/** Each stage's share of the whole path, by length in years (short stages get a floor). */
export function trajectorySegments(
  entries: ReadonlyArray<{ year: string; title: string }>,
): TrajectorySegment[] {
  const lengths = entries.map((e) => {
    const range = parseYearRange(e.year);
    return Math.max(range ? range.end - range.start : 0, MIN_STAGE_YEARS);
  });
  const total = lengths.reduce((sum, n) => sum + n, 0);
  return entries.map((e, i) => ({ title: e.title, weight: lengths[i] / total }));
}

const MONTHS = [
  ["january", "enero"],
  ["february", "febrero"],
  ["march", "marzo"],
  ["april", "abril"],
  ["may", "mayo"],
  ["june", "junio"],
  ["july", "julio"],
  ["august", "agosto"],
  ["september", "septiembre"],
  ["october", "octubre"],
  ["november", "noviembre"],
  ["december", "diciembre"],
];

/** Month index (0–11) named in a stage's date, in English or Spanish, if any. */
function monthOf(text: string): number | null {
  const words: string[] = text.toLowerCase().match(/\p{L}+/gu) ?? [];
  const index = MONTHS.findIndex((names) => names.some((name) => words.includes(name)));
  return index >= 0 ? index : null;
}

export interface GanttBar {
  startPct: number;
  widthPct: number;
  milestone: boolean;
}

/** Bars on a shared year axis; single-year stages become milestones, placed at their month when it is named. */
export function ganttLayout(entries: ReadonlyArray<{ year: string }>): {
  from: number;
  to: number;
  years: number[];
  bars: GanttBar[];
} {
  const ranges = entries.map((e) => parseYearRange(e.year));
  const known = ranges.filter((r): r is { start: number; end: number } => r !== null);
  if (known.length === 0) return { from: 0, to: 0, years: [], bars: [] };

  const from = Math.min(...known.map((r) => r.start));
  const last = Math.max(...known.map((r) => r.end));
  const to = last > from ? last : from + 1;
  const pct = (year: number) => ((year - from) / (to - from)) * 100;

  return {
    from,
    to,
    years: Array.from({ length: to - from + 1 }, (_, i) => from + i),
    bars: ranges.map((r, i) => {
      const range = r ?? { start: from, end: from };
      const milestone = range.end === range.start;
      if (milestone) return { startPct: pct(range.start + (monthOf(entries[i].year) ?? 0) / 12), widthPct: 0, milestone };
      return { startPct: pct(range.start), widthPct: pct(range.end) - pct(range.start), milestone };
    }),
  };
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * How much of a Gantt bar the playhead has recorded, 0..1, with the playhead
 * and the bar both in percent of the year axis. A milestone (no width) is
 * all-or-nothing: recorded once the playhead reaches it.
 */
export function recordedFraction(playheadPct: number, bar: Pick<GanttBar, "startPct" | "widthPct">): number {
  if (bar.widthPct <= 0) return playheadPct >= bar.startPct ? 1 : 0;
  return clamp01((playheadPct - bar.startPct) / bar.widthPct);
}

/** The year the playhead is over, for its readout; the axis end reads as `to`. */
export function playheadYear(playheadPct: number, from: number, to: number): number {
  const span = Math.max(0, to - from);
  return from + Math.min(span, Math.floor((clamp01(playheadPct / 100) * span) + 1e-9));
}
