import { describe, expect, it } from "vitest";
import { buildRidgeField, ridgeGlow } from "./og-ridges";

const BASE_OPTIONS = { width: 200, top: 0, bottom: 100, lines: 5, peakX: 100, peakY: 50, step: 20 };

describe("buildRidgeField", () => {
  it("returns one entry per line, each path starting with an absolute moveto", () => {
    const field = buildRidgeField(BASE_OPTIONS);
    expect(field).toHaveLength(5);
    for (const ridge of field) {
      expect(ridge.strokeD.startsWith("M")).toBe(true);
      expect(ridge.areaD.startsWith("M")).toBe(true);
    }
  });

  it("samples the full width at the given step, ending exactly at the edge", () => {
    const field = buildRidgeField(BASE_OPTIONS);
    // 200px / 20px step => 11 sampled points (0, 20, ..., 200) => one M + ten L commands.
    const commandCount = field[0].strokeD.split(" ").length;
    expect(commandCount).toBe(11);
    expect(field[0].strokeD).toContain("200,");
  });

  it("closes the area path down to the shared bottom", () => {
    const [ridge] = buildRidgeField(BASE_OPTIONS);
    expect(ridge.areaD.endsWith(`L0,100 Z`)).toBe(true);
    expect(ridge.areaD).toContain("L200,100");
  });

  it("the peak lifts its nearest ridge upward (a smaller y than with no peak at all)", () => {
    const withPeak = buildRidgeField(BASE_OPTIONS);
    const noPeak = buildRidgeField({ ...BASE_OPTIONS, peakStrength: 0 });

    // The middle ridge (index 2, base y = 50) sits right under the peak (peakY = 50).
    const liftedPoint = withPeak[2].strokeD.split(" ")[5]; // x = 100, the sample nearest peakX
    const restingPoint = noPeak[2].strokeD.split(" ")[5];
    const liftedY = Number(liftedPoint.split(",")[1]);
    const restingY = Number(restingPoint.split(",")[1]);

    expect(withPeak[2].lift).toBeGreaterThan(0);
    expect(liftedY).toBeLessThan(restingY);
  });

  it("reports zero lift everywhere when peakStrength is 0", () => {
    const field = buildRidgeField({ ...BASE_OPTIONS, peakStrength: 0 });
    for (const ridge of field) expect(ridge.lift).toBe(0);
  });

  it("returns nothing for zero lines or non-positive width", () => {
    expect(buildRidgeField({ ...BASE_OPTIONS, lines: 0 })).toEqual([]);
    expect(buildRidgeField({ ...BASE_OPTIONS, width: 0 })).toEqual([]);
  });
});

describe("ridgeGlow", () => {
  it("stays quiet foreground at rest (no lift)", () => {
    expect(ridgeGlow(0)).toEqual({ color: "#f0f0f0", opacity: 0.09 });
  });

  it("stays quiet foreground right at and just under the SignalField cutoff (0.02)", () => {
    expect(ridgeGlow(0.02)).toEqual({ color: "#f0f0f0", opacity: 0.09 });
    expect(ridgeGlow(0.019)).toEqual({ color: "#f0f0f0", opacity: 0.09 });
  });

  it("glows violet past the cutoff, brighter the more the peak lifts it", () => {
    const dim = ridgeGlow(0.03);
    const bright = ridgeGlow(0.8);
    expect(dim.color).toBe("#a366ff");
    expect(bright.color).toBe("#a366ff");
    expect(bright.opacity).toBeGreaterThan(dim.opacity);
    // 0.12 + 0.5 * lift, same mapping as SignalField's canvas gradient.
    expect(dim.opacity).toBeCloseTo(0.12 + 0.5 * 0.03, 5);
  });

  it("caps opacity at 0.95 even for a very strong lift", () => {
    expect(ridgeGlow(5).opacity).toBe(0.95);
  });
});
