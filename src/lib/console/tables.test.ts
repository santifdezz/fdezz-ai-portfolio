import { describe, expect, it } from "vitest";
import { getPortfolioContent } from "@/lib/portfolio-content";
import { buildDatabase } from "./tables";

describe("buildDatabase", () => {
  const db = buildDatabase(getPortfolioContent("en"));
  const rowsOf = (name: string) => {
    const table = db.get(name)!;
    return table.rows.map((row) => Object.fromEntries(table.columns.map((c, i) => [c.name, row[i]])));
  };

  it("lists its tables in a fixed order", () => {
    expect([...db.keys()]).toEqual(["people", "projects", "stages", "skills", "channels"]);
  });

  it("gives every row one value per column", () => {
    for (const table of db.values()) {
      for (const row of table.rows) expect(row, table.name).toHaveLength(table.columns.length);
    }
  });

  it("describes him from content: latest stage, founded ventures, first and last year", () => {
    expect(rowsOf("people")).toEqual([
      expect.objectContaining({
        id: "santiago",
        name: "Santiago Fernández",
        role: "Data Scientist at Qaleon Solutions",
        founded: ["Makineo"],
        first_year: 2020,
        last_year: 2026,
        email: "santifdezseo@gmail.com",
      }),
    ]);
  });

  it("reads projects with their headline figure and links", () => {
    const makineo = rowsOf("projects").find((p) => p.id === "makineo");
    expect(makineo).toMatchObject({ founder: true, figure: "1,000+ experiences listed", site: "https://makineo.es" });
    expect(rowsOf("projects").find((p) => p.id === "agiency")).toMatchObject({ founder: false, site: null });
  });

  it("has one skills row per skill and one stage row per stage", () => {
    const content = getPortfolioContent("en");
    expect(rowsOf("skills")).toHaveLength(Object.values(content.about.bio.skills).flat().length);
    expect(rowsOf("stages")).toHaveLength(content.about.education.length);
    expect(rowsOf("stages").find((s) => s.founder)).toMatchObject({ start_year: 2025, end_year: 2025, institution: "Makineo" });
  });

  it("speaks the reader's language", () => {
    const es = buildDatabase(getPortfolioContent("es"));
    expect(es.get("people")!.rows[0][2]).toBe("Data Scientist en Qaleon Solutions");
  });
});
