import { describe, expect, it } from "vitest";
import { ridgeLift, ridgePath, ripple, RIPPLE_AMPLITUDE } from "./signal";

describe("ridgeLift", () => {
  it("peaks right under the cursor, scaled by strength", () => {
    expect(ridgeLift(0, 0, 1)).toBeCloseTo(1, 10);
    expect(ridgeLift(0, 0, 0.5)).toBeCloseTo(0.5, 10);
  });

  it("is zero when the cursor is gone", () => {
    expect(ridgeLift(0, 0, 0)).toBe(0);
  });

  it("falls off with horizontal and vertical distance", () => {
    const peak = ridgeLift(0, 0, 1);
    expect(ridgeLift(60, 0, 1)).toBeLessThan(peak);
    expect(ridgeLift(0, 60, 1)).toBeLessThan(peak);
    expect(ridgeLift(240, 0, 1)).toBeLessThan(ridgeLift(120, 0, 1));
    expect(ridgeLift(600, 600, 1)).toBeLessThan(0.001);
  });

  it("is symmetric left/right and above/below", () => {
    expect(ridgeLift(-80, 30, 1)).toBeCloseTo(ridgeLift(80, 30, 1), 12);
    expect(ridgeLift(40, -90, 1)).toBeCloseTo(ridgeLift(40, 90, 1), 12);
  });

  it("never lifts a line downwards", () => {
    for (const dx of [-500, -50, 0, 50, 500]) {
      for (const dy of [-300, 0, 300]) expect(ridgeLift(dx, dy, 1)).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("ripple", () => {
  it("stays within its amplitude everywhere", () => {
    for (let x = 0; x < 2000; x += 37) {
      for (let line = 0; line < 30; line++) {
        for (const t of [0, 1.3, 9.7]) expect(Math.abs(ripple(x, line, t))).toBeLessThanOrEqual(RIPPLE_AMPLITUDE);
      }
    }
  });

  it("differs between neighbouring lines so the field does not look stamped", () => {
    expect(ripple(400, 3, 0)).not.toBeCloseTo(ripple(400, 4, 0), 3);
  });

  it("moves with time", () => {
    expect(ripple(400, 3, 0)).not.toBeCloseTo(ripple(400, 3, 2), 3);
  });
});

describe("ridgePath", () => {
  const ys = (d: string) => d.slice(1).split("L").map((p) => Number(p.split(",")[1]));
  const xs = (d: string) => d.slice(1).split("L").map((p) => Number(p.split(",")[0]));
  const base = { width: 300, base: 20, peakX: 150, spread: 20, height: 12 };

  it("is a flat line at its base when the peak is gone and the ripple is off", () => {
    expect(new Set(ys(ridgePath({ ...base, amp: 0 })))).toEqual(new Set([20]));
  });

  it("starts at x=0, steps evenly and ends exactly at the width", () => {
    const x = xs(ridgePath({ ...base, width: 100, amp: 1, step: 30 }));
    expect(x).toEqual([0, 30, 60, 90, 100]);
  });

  it("rises (smaller y) at the peak and settles back away from it", () => {
    const d = ridgePath({ ...base, amp: 1, texture: 0, step: 10 });
    const y = ys(d);
    const atPeak = y[15];
    expect(atPeak).toBeCloseTo(20 - 12, 1);
    expect(y[0]).toBeCloseTo(20, 1);
    expect(y[y.length - 1]).toBeCloseTo(20, 1);
    expect(Math.min(...y)).toBe(atPeak);
  });

  it("scales the peak with amp", () => {
    const half = ys(ridgePath({ ...base, amp: 0.5, texture: 0, step: 10 }))[15];
    expect(half).toBeCloseTo(20 - 6, 1);
  });

  it("only adds the resting ripple when asked, within its amplitude", () => {
    const y = ys(ridgePath({ ...base, amp: 0, rippleScale: 1, line: 3, time: 1.2 }));
    expect(y.some((v) => v !== 20)).toBe(true);
    for (const v of y) expect(Math.abs(v - 20)).toBeLessThanOrEqual(RIPPLE_AMPLITUDE + 0.05);
  });
});
