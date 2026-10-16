import { describe, expect, it } from "vitest";
import { getPortfolioContent, type ProjectData } from "@/lib/portfolio-content";
import { getProjectFigure, getProjectFigures, isCompactFigure, odometerCells } from "./figures";

const project = (overrides: Partial<ProjectData>): ProjectData => ({
  id: "test",
  title: "Test",
  description: "",
  status: "completed",
  statusColor: "green",
  technologies: [],
  features: [],
  links: {},
  ...overrides,
});

const figureOf = (locale: "en" | "es", id: string) => {
  const found = getPortfolioContent(locale).projects.find((p) => p.id === id);
  if (!found) throw new Error(`missing project ${id}`);
  return getProjectFigure(found);
};

describe("getProjectFigure — real content", () => {
  it.each([
    ["ufc-data", { pre: "", value: "3,600+", label: "events" }],
    ["makineo", { pre: "", value: "1,000+", label: "experiences listed" }],
  ])("en · %s", (id, expected) => {
    expect(figureOf("en", id)).toEqual(expected);
  });

  it.each([
    ["ufc-data", { pre: "", value: "3.600+", label: "eventos" }],
    ["makineo", { pre: "", value: "1.000+", label: "experiencias publicadas" }],
  ])("es · %s", (id, expected) => {
    expect(figureOf("es", id)).toEqual(expected);
  });

  it("every figure value appears verbatim in its own project's text", () => {
    for (const locale of ["en", "es"] as const) {
      for (const p of getPortfolioContent(locale).projects) {
        const figure = getProjectFigure(p);
        expect(figure, `${locale}/${p.id}`).not.toBeNull();
        const source = [...p.features, p.description].join(" ");
        expect(source).toContain(figure!.value);
      }
    }
  });
});

// Copy from projects that have since left the portfolio; the shapes are still worth guarding.
describe("getProjectFigure — copy shapes", () => {
  it("keeps the words before the number as its lead-in (Built in <4 weeks)", () => {
    const p = project({
      description: "Playable 2D shooter built from scratch in Godot Engine in under 4 weeks.",
      features: ["Built in <4 weeks from zero", "Full gameplay loop"],
    });
    expect(getProjectFigure(p)).toEqual({ pre: "Built in", value: "<4", label: "weeks from zero" });
  });

  it("lets a bigger percentage beat a smaller count (95%+ over 30+)", () => {
    const p = project({ features: ["30+ automated test scenarios", "95%+ pass rate per run"] });
    expect(getProjectFigure(p)).toEqual({ pre: "", value: "95%+", label: "pass rate per run" });
  });

  it("prefers the feature phrasing when the description repeats the number (1.200+)", () => {
    const p = project({
      description: "Pipeline que procesa más de 1.200 licitaciones públicas al mes.",
      features: ["1.200+ licitaciones procesadas al mes", "8h → 15min de análisis"],
    });
    expect(getProjectFigure(p)).toEqual({ pre: "", value: "1.200+", label: "licitaciones procesadas al mes" });
  });
});

describe("getProjectFigure — edge cases", () => {
  it("returns null when the project has no numbers", () => {
    expect(getProjectFigure(project({ description: "A tidy app.", features: ["Fast", "Typed"] }))).toBeNull();
  });

  it("picks the largest magnitude, reading thousands separators", () => {
    const p = project({ features: ["50+ features", "1.200+ rows loaded"] });
    expect(getProjectFigure(p)?.value).toBe("1.200+");
  });

  it("prefers a feature over the description on a tie", () => {
    const p = project({ description: "Handles 200 events. Nice.", features: ["200+ events managed"] });
    expect(getProjectFigure(p)).toEqual({ pre: "", value: "200+", label: "events managed" });
  });

  it("ignores digits glued to letters such as 2D, 8h or 15min", () => {
    const p = project({ description: "A 2D game.", features: ["8h → 15min analysis time", "3 levels"] });
    expect(getProjectFigure(p)?.value).toBe("3");
  });

  it("ignores bare years", () => {
    const p = project({ description: "Shipped in 2024 with 40 users." });
    expect(getProjectFigure(p)?.value).toBe("40");
  });

  it("keeps a tight range together as one figure, sized by its upper bound", () => {
    expect(getProjectFigure(project({ features: ["Ships in 3-4 weeks"] }))).toEqual({
      pre: "Ships in",
      value: "3-4",
      label: "weeks",
    });
    // 2–5 only beats 4 if the range counts as 5.
    expect(getProjectFigure(project({ features: ["4 regions", "2–5 years in prod"] }))?.value).toBe("2–5");
  });

  it("ignores numbers hyphenated into a word, such as 24-hour", () => {
    expect(getProjectFigure(project({ features: ["24-hour uptime checks", "3 regions"] }))?.value).toBe("3");
  });

  it("ignores year ranges", () => {
    expect(getProjectFigure(project({ description: "Built 2020-2021 for 40 users." }))?.value).toBe("40");
  });

  it("splits description clauses on commas and dashes, not on thousands separators", () => {
    const p = project({ description: "Loads 20+ years of data — 3,600+ events, 1,500+ fighters." });
    expect(getProjectFigure(p)).toEqual({ pre: "", value: "3,600+", label: "events" });
  });
});

describe("getProjectFigures", () => {
  it("lists every figure the UFC pipeline quotes, largest first, each value once", () => {
    const ufc = getPortfolioContent("en").projects.find((p) => p.id === "ufc-data")!;
    expect(getProjectFigures(ufc).map((f) => f.value)).toEqual(["3,600+", "1,500+", "65%+", "50+", "20+"]);
  });

  it("keeps the feature's phrasing when the description repeats a value", () => {
    const ufc = getPortfolioContent("en").projects.find((p) => p.id === "ufc-data")!;
    expect(getProjectFigures(ufc).find((f) => f.value === "50+")).toEqual({
      pre: "",
      value: "50+",
      label: "engineered features per fighter",
    });
  });

  it("is empty for a project without numbers, and its head is the headline figure", () => {
    expect(getProjectFigures(project({ description: "A tidy app." }))).toEqual([]);
    const p = project({ features: ["50+ features", "1.200+ rows loaded"] });
    expect(getProjectFigures(p)[0]).toEqual(getProjectFigure(p));
  });
});

describe("isCompactFigure", () => {
  it.each([
    [{ pre: "", value: "1,500+", label: "fighters" }, true],
    [{ pre: "", value: "50+", label: "engineered features per fighter" }, true],
    [{ pre: "ETL pipeline extracting", value: "20+", label: "years of UFC data" }, false],
    [{ pre: "", value: "65%+", label: "accuracy for fight outcome prediction using" }, false],
    [{ pre: "", value: "3", label: "" }, false],
  ])("%o → %s", (figure, expected) => {
    expect(isCompactFigure(figure)).toBe(expected);
  });
});

describe("odometerCells", () => {
  it("rolls digits and keeps separators and signs in place", () => {
    expect(odometerCells("3,600+")).toEqual([
      { kind: "digit", digit: 3 },
      { kind: "mark", text: "," },
      { kind: "digit", digit: 6 },
      { kind: "digit", digit: 0 },
      { kind: "digit", digit: 0 },
      { kind: "mark", text: "+" },
    ]);
  });

  it("handles a lead sign and an empty value", () => {
    expect(odometerCells("<4")).toEqual([{ kind: "mark", text: "<" }, { kind: "digit", digit: 4 }]);
    expect(odometerCells("")).toEqual([]);
  });
});
