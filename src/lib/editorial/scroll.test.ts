import { describe, expect, it } from "vitest";
import { activeSlideIndex, readingPosition, revealWindow } from "./scroll";

describe("activeSlideIndex", () => {
  it("maps progress evenly onto slides", () => {
    expect(activeSlideIndex(0, 5)).toBe(0);
    expect(activeSlideIndex(0.5, 5)).toBe(2);
    expect(activeSlideIndex(1, 5)).toBe(4);
  });

  it("switches at the halfway point between two slides", () => {
    expect(activeSlideIndex(0.124, 5)).toBe(0);
    expect(activeSlideIndex(0.126, 5)).toBe(1);
  });

  it("clamps progress outside 0..1", () => {
    expect(activeSlideIndex(-0.3, 5)).toBe(0);
    expect(activeSlideIndex(1.7, 5)).toBe(4);
  });

  it("handles one or zero slides", () => {
    expect(activeSlideIndex(0.8, 1)).toBe(0);
    expect(activeSlideIndex(0.8, 0)).toBe(0);
  });
});

describe("revealWindow", () => {
  it("starts the first word at 0 and finishes the last word at 1", () => {
    expect(revealWindow(0, 30)[0]).toBe(0);
    expect(revealWindow(29, 30)[1]).toBeCloseTo(1, 10);
  });

  it("moves every window forward as the index grows", () => {
    const windows = Array.from({ length: 30 }, (_, i) => revealWindow(i, 30));
    for (let i = 1; i < windows.length; i++) {
      expect(windows[i][0]).toBeGreaterThan(windows[i - 1][0]);
    }
  });

  it("keeps windows inside 0..1 with a positive width", () => {
    for (const n of [1, 2, 7, 30]) {
      for (let i = 0; i < n; i++) {
        const [start, end] = revealWindow(i, n);
        expect(start).toBeGreaterThanOrEqual(0);
        expect(end).toBeLessThanOrEqual(1);
        expect(end).toBeGreaterThan(start);
      }
    }
  });
});

describe("readingPosition", () => {
  const sections = [
    { top: 1000, height: 1000 },
    { top: 2000, height: 3000 },
    { top: 5000, height: 1000 },
  ];

  it("is before the first section while the line has not reached it", () => {
    expect(readingPosition(sections, 500)).toEqual({ index: -1, progress: 0 });
  });

  it("reports how far through the current section the line is", () => {
    expect(readingPosition(sections, 1500)).toEqual({ index: 0, progress: 0.5 / 3 });
    expect(readingPosition(sections, 3500)).toEqual({ index: 1, progress: 1.5 / 3 });
  });

  it("caps the last section at the end of the strip", () => {
    expect(readingPosition(sections, 99999)).toEqual({ index: 2, progress: 1 });
  });

  it("counts a section whose top sits exactly on the line", () => {
    expect(readingPosition([{ top: 300, height: 100 }], 300)).toEqual({ index: 0, progress: 0 });
  });

  it("does not depend on input order", () => {
    const shuffled = [
      { top: 200, height: 100 },
      { top: -900, height: 800 },
      { top: -100, height: 300 },
    ];
    expect(readingPosition(shuffled, 300).index).toBe(0);
  });

  it("handles no sections", () => {
    expect(readingPosition([], 100)).toEqual({ index: -1, progress: 0 });
  });
});
