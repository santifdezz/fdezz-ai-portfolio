/** Which slide a pinned gallery is showing, given its 0..1 scroll progress. */
export function activeSlideIndex(progress: number, count: number): number {
  if (count <= 1) return 0;
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.round(clamped * (count - 1));
}

/**
 * The slice of a 0..1 scroll progress over which word `index` of `count`
 * brightens. Windows overlap by ~`softness` words so the front stays soft.
 */
export function revealWindow(index: number, count: number, softness = 4): [number, number] {
  if (count <= 1) return [0, 1];
  const width = Math.min(0.5, softness / count);
  const start = (index / (count - 1)) * (1 - width);
  return [start, start + width];
}

/**
 * Where a reader is along a strip of sections: the section the reading line is
 * in and how far along the whole strip that puts them (0..1), so a playhead can
 * sweep across each section's step while it is being read.
 */
export function readingPosition(
  sections: ReadonlyArray<{ top: number; height: number }>,
  line: number,
): { index: number; progress: number } {
  let index = -1;
  sections.forEach((s, i) => {
    if (s.top <= line && (index < 0 || s.top >= sections[index].top)) index = i;
  });
  if (index < 0) return { index, progress: 0 };
  const { top, height } = sections[index];
  const within = height > 0 ? Math.min(1, Math.max(0, (line - top) / height)) : 1;
  return { index, progress: (index + within) / sections.length };
}
