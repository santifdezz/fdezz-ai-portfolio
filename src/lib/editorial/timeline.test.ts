import { describe, expect, it } from "vitest";
import { getPortfolioContent } from "@/lib/portfolio-content";
import { ganttLayout, parseYearRange, playheadYear, recordedFraction, splitNarrative, trajectorySegments } from "./timeline";

describe("splitNarrative", () => {
  it("uses the first sentence as the kicker and keeps the rest as bullets", () => {
    expect(splitNarrative("Quality through automation. I learned to test. Then to automate.")).toEqual({
      kicker: "Quality through automation.",
      rest: ["I learned to test.", "Then to automate."],
    });
  });

  it("returns no bullets for a single sentence", () => {
    expect(splitNarrative("Only one line here.")).toEqual({ kicker: "Only one line here.", rest: [] });
  });

  it("keeps a trailing fragment without final punctuation", () => {
    expect(splitNarrative("First. Then a fragment")).toEqual({ kicker: "First.", rest: ["Then a fragment"] });
  });

  it("handles missing or blank narratives", () => {
    expect(splitNarrative(undefined)).toEqual({ kicker: "", rest: [] });
    expect(splitNarrative("   ")).toEqual({ kicker: "", rest: [] });
  });

  it("splits every real narrative into a kicker and at least one bullet", () => {
    for (const locale of ["en", "es"] as const) {
      // Stages without a narrative (e.g. the founding) are left out on purpose.
      for (const entry of getPortfolioContent(locale).about.education.filter((e) => e.narrative)) {
        const { kicker, rest } = splitNarrative(entry.narrative);
        expect(kicker, `${locale}/${entry.year}`).toMatch(/[.!?]$/);
        expect(rest.length, `${locale}/${entry.year}`).toBeGreaterThan(0);
      }
    }
  });
});

describe("parseYearRange", () => {
  it("parses ranges and single years", () => {
    expect(parseYearRange("2020-2021")).toEqual({ start: 2020, end: 2021 });
    expect(parseYearRange("2021")).toEqual({ start: 2021, end: 2021 });
    expect(parseYearRange("2024 – 2025")).toEqual({ start: 2024, end: 2025 });
  });

  it("returns null for text without a year", () => {
    expect(parseYearRange("soon")).toBeNull();
  });
});

describe("trajectorySegments", () => {
  it("weights each stage by its length, with a floor for single-year stages", () => {
    const segments = trajectorySegments([
      { year: "2020-2022", title: "A" },
      { year: "2022", title: "B" },
      { year: "2023-2024", title: "C" },
    ]);
    expect(segments.map((s) => s.title)).toEqual(["A", "B", "C"]);
    expect(segments.map((s) => s.weight)).toEqual([2 / 3.5, 0.5 / 3.5, 1 / 3.5]);
  });

  it("returns weights that sum to 1 for the real timeline", () => {
    const segments = trajectorySegments(getPortfolioContent("en").about.education);
    expect(segments).toHaveLength(6);
    expect(segments.reduce((sum, s) => sum + s.weight, 0)).toBeCloseTo(1, 10);
  });

  it("returns an empty list for no entries", () => {
    expect(trajectorySegments([])).toEqual([]);
  });
});

describe("ganttLayout", () => {
  it("spans the axis from the first start year to the last end year", () => {
    const { from, to, years } = ganttLayout([{ year: "2020-2021" }, { year: "2024-2026" }]);
    expect({ from, to, years }).toEqual({ from: 2020, to: 2026, years: [2020, 2021, 2022, 2023, 2024, 2025, 2026] });
  });

  it("places each range by its years as a share of the axis", () => {
    const { bars } = ganttLayout([{ year: "2020-2022" }, { year: "2022-2024" }]);
    expect(bars).toEqual([
      { startPct: 0, widthPct: 50, milestone: false },
      { startPct: 50, widthPct: 50, milestone: false },
    ]);
  });

  it("marks single-year stages as milestones at their year", () => {
    const { bars } = ganttLayout([{ year: "2020-2024" }, { year: "2022" }]);
    expect(bars[1]).toEqual({ startPct: 50, widthPct: 0, milestone: true });
  });

  it("keeps every real stage inside the axis", () => {
    const { from, to, bars } = ganttLayout(getPortfolioContent("en").about.education);
    expect([from, to]).toEqual([2020, 2026]);
    expect(bars.map((b) => b.milestone)).toEqual([false, true, false, false, true, false]);
    for (const b of bars) {
      expect(b.startPct).toBeGreaterThanOrEqual(0);
      expect(b.startPct + b.widthPct).toBeLessThanOrEqual(100);
    }
  });

  it("places a dated milestone at its month, in either language", () => {
    const june = ((2025 + 5 / 12 - 2024) / 2) * 100;
    expect(ganttLayout([{ year: "2024-2026" }, { year: "June 2025" }]).bars[1]).toEqual({ startPct: june, widthPct: 0, milestone: true });
    expect(ganttLayout([{ year: "2024-2026" }, { year: "Junio 2025" }]).bars[1]).toEqual({ startPct: june, widthPct: 0, milestone: true });
  });

  it("gives a one-year axis when every stage shares a year", () => {
    const { from, to, bars } = ganttLayout([{ year: "2024" }]);
    expect([from, to]).toEqual([2024, 2025]);
    expect(bars).toEqual([{ startPct: 0, widthPct: 0, milestone: true }]);
  });

  it("returns an empty layout for no stages", () => {
    expect(ganttLayout([])).toEqual({ from: 0, to: 0, years: [], bars: [] });
  });
});

describe("founding stage", () => {
  it.each([
    ["en", "June 2025", "Founder of Makineo"],
    ["es", "Junio 2025", "Fundador de Makineo"],
  ] as const)("%s: Makineo's founding sits on the timeline as a June 2025 milestone", (locale, year, title) => {
    const education = getPortfolioContent(locale).about.education;
    const index = education.findIndex((e) => e.role === "founder");
    expect(education[index]).toMatchObject({ year, title, institution: "Makineo" });
    const { bars } = ganttLayout(education);
    expect(bars[index]).toEqual({ startPct: ((2025 + 5 / 12 - 2020) / 6) * 100, widthPct: 0, milestone: true });
    // Chronological: after the AI specialisation, before Qaleon (still the current stage).
    expect(education[index - 1].year).toBe("2024-2025");
    expect(education.at(-1)?.year).toBe("2025-2026");
  });
});

describe("recordedFraction", () => {
  const bar = { startPct: 20, widthPct: 40 };

  it("is empty before the bar, partial across it, full after it", () => {
    expect(recordedFraction(0, bar)).toBe(0);
    expect(recordedFraction(20, bar)).toBe(0);
    expect(recordedFraction(40, bar)).toBeCloseTo(0.5, 10);
    expect(recordedFraction(60, bar)).toBe(1);
    expect(recordedFraction(100, bar)).toBe(1);
  });

  it("treats a milestone as recorded once the playhead reaches it", () => {
    const milestone = { startPct: 70, widthPct: 0 };
    expect(recordedFraction(69.9, milestone)).toBe(0);
    expect(recordedFraction(70, milestone)).toBe(1);
  });
});

describe("playheadYear", () => {
  it("reads the year under the playhead on a 2020→2026 axis", () => {
    expect(playheadYear(0, 2020, 2026)).toBe(2020);
    expect(playheadYear(50, 2020, 2026)).toBe(2023);
    expect(playheadYear(99, 2020, 2026)).toBe(2025);
    expect(playheadYear(100, 2020, 2026)).toBe(2026);
  });

  it("stays on the axis when the playhead overshoots either end", () => {
    expect(playheadYear(-10, 2020, 2026)).toBe(2020);
    expect(playheadYear(140, 2020, 2026)).toBe(2026);
  });

  it("copes with an empty axis", () => {
    expect(playheadYear(50, 2024, 2024)).toBe(2024);
  });
});
