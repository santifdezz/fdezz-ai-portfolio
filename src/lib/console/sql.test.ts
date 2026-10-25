import { describe, expect, it } from "vitest";
import { getPortfolioContent } from "@/lib/portfolio-content";
import { run, suggestQuery, tokenize } from "./sql";
import { buildDatabase } from "./tables";

const db = buildDatabase(getPortfolioContent("en"));
const rows = (input: string) => {
  const result = run(input, db);
  if (result.kind !== "rows") throw new Error(`expected rows, got ${JSON.stringify(result)}`);
  return result;
};
const values = (input: string) => rows(input).rows;

describe("tokenize", () => {
  it("reads words, quoted strings with doubled quotes, numbers and operators", () => {
    expect(tokenize("SELECT a FROM t WHERE b <> 'it''s' LIMIT 2;").map((t) => t.value)).toEqual([
      "SELECT", "a", "FROM", "t", "WHERE", "b", "<>", "it's", "LIMIT", "2", ";",
    ]);
  });
});

describe("run · SELECT", () => {
  it("selects every column with *", () => {
    const result = rows("SELECT * FROM channels;");
    expect(result.columns.map((c) => c.name)).toEqual(["type", "value", "url"]);
    expect(result.rows).toHaveLength(3);
  });

  it("is case-insensitive about keywords and names, and forgives a missing semicolon", () => {
    expect(values("select TITLE from Projects")).toEqual([["Makineo"], ["Punch"], ["CuadroScan"], ["MakineoBeats"], ["Cabezones FC"]]);
  });

  it("projects, filters, orders and limits", () => {
    expect(values("SELECT start_year, title FROM stages WHERE start_year >= 2024 ORDER BY start_year DESC LIMIT 2")).toEqual([
      [2025, "Founder of Makineo"],
      [2025, "Data Scientist at Qaleon Solutions"],
    ]);
  });

  it("filters booleans, ILIKE patterns, array membership and NULLs", () => {
    expect(values("SELECT title FROM projects WHERE founder = true")).toEqual([["Makineo"]]);
    expect(values("SELECT skill FROM skills WHERE skill ILIKE 'pyt%'")).toEqual([["Python"]]);
    expect(values("SELECT title FROM projects WHERE 'Capacitor' = ANY(stack)")).toEqual([["Makineo"]]);
    expect(values("SELECT title FROM projects WHERE site IS NULL")).toEqual([["Cabezones FC"]]);
    expect(values("SELECT title FROM projects WHERE stack ILIKE '%capacitor%' AND status != 'in-progress'")).toEqual([["Makineo"]]);
  });

  it("counts", () => {
    expect(rows("SELECT count(*) FROM skills WHERE category = 'Languages';")).toMatchObject({ columns: [{ name: "count" }], rows: [[3]] });
  });

  it("returns no rows rather than failing when nothing matches", () => {
    expect(values("SELECT * FROM projects WHERE title = 'Nope'")).toEqual([]);
  });
});

describe("run · errors", () => {
  it("names a missing table and points at \\d", () => {
    expect(run("SELECT * FROM users", db)).toEqual({ kind: "error", error: { code: "relation", name: "users" }, hint: { kind: "tables" } });
  });

  it("names a missing column and points at the table's description", () => {
    expect(run("SELECT salary FROM people", db)).toEqual({
      kind: "error",
      error: { code: "column", name: "salary" },
      hint: { kind: "describe", table: "people" },
    });
  });

  it("reports where the syntax breaks, or the end of input", () => {
    expect(run("SELECT * FROM projects WHERE", db)).toEqual({ kind: "error", error: { code: "syntax", near: null } });
    expect(run("SELECT * projects", db)).toEqual({ kind: "error", error: { code: "syntax", near: "projects" } });
    expect(run("SELECT * FROM projects LIMIT 1 extra", db)).toEqual({ kind: "error", error: { code: "syntax", near: "extra" } });
    expect(run("SELECT * FROM projects WHERE title = 'open", db)).toMatchObject({ kind: "error", error: { code: "syntax" } });
  });

  it("answers a plain question with a syntax error and the query that would answer it", () => {
    expect(run("¿Qué proyectos has hecho?", db)).toEqual({
      kind: "error",
      error: { code: "syntax", near: "¿Qué" },
      hint: { kind: "query", query: "SELECT title, status, figure FROM projects;" },
    });
  });
});

describe("run · meta-commands", () => {
  it("lists tables and describes one", () => {
    expect(rows("\\d").rows.map((r) => r[1])).toEqual(["people", "projects", "stages", "skills", "channels"]);
    expect(rows("\\d projects").rows).toContainEqual(["stack", "text[]"]);
    expect(run("\\d nope", db)).toMatchObject({ kind: "error", error: { code: "relation", name: "nope" } });
  });

  it("toggles expanded display, quits, helps, and rejects unknown commands", () => {
    expect(run("\\x", db)).toEqual({ kind: "expanded", mode: "on" });
    expect(run("\\x auto", db)).toEqual({ kind: "expanded", mode: "auto" });
    expect(run("\\q", db)).toEqual({ kind: "quit" });
    expect(run("exit", db)).toEqual({ kind: "quit" });
    expect(run("help", db)).toEqual({ kind: "help" });
    expect(run("\\z", db)).toMatchObject({ kind: "error", error: { code: "meta", command: "\\z" } });
  });

  it("ignores an empty line", () => {
    expect(run("   ", db)).toEqual({ kind: "empty" });
  });
});

describe("suggestQuery", () => {
  it.each([
    ["what projects?", "SELECT title, status, figure FROM projects;"],
    ["¿dónde has trabajado?", "SELECT start_year, title, institution FROM stages ORDER BY start_year DESC;"],
    ["qué tecnologías usas", "SELECT category, skill FROM skills;"],
    ["how do I contact you", "SELECT * FROM channels;"],
    ["¿quién eres?", "SELECT * FROM people;"],
    ["asdf", "\\d"],
  ])("%s → %s", (question, query) => {
    expect(suggestQuery(question)).toBe(query);
  });

  it("only ever suggests queries that run", () => {
    for (const q of ["projects", "work", "skills", "contact", "who", "zzz"]) {
      expect(run(suggestQuery(q), db).kind).toBe("rows");
    }
  });
});
