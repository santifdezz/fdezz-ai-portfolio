import { describe, expect, it } from "vitest";
import { alignedTable, expandedTable, formatCell, formatRows, hintQuery, PSQL_TEXT } from "./format";
import type { Column } from "./tables";

const cols: Column[] = [
  { name: "id", type: "text" },
  { name: "n", type: "int4" },
];

describe("formatCell", () => {
  it("prints values the way psql does", () => {
    expect(formatCell(null)).toBe("");
    expect(formatCell(true)).toBe("t");
    expect(formatCell(false)).toBe("f");
    expect(formatCell(2020)).toBe("2020");
    expect(formatCell(["Python", "Machine Learning", 'say "hi"'])).toBe('{Python,"Machine Learning","say \\"hi\\""}');
    expect(formatCell([])).toBe("{}");
  });
});

describe("alignedTable", () => {
  it("centres headers, rules with -+-, right-aligns numbers and counts rows", () => {
    expect(alignedTable(cols, [["makineo", 200], ["ufc", 3600]], "(2 rows)")).toEqual([
      "   id    |  n",
      "---------+------",
      " makineo |  200",
      " ufc     | 3600",
      "(2 rows)",
    ]);
  });

  it("still draws the header for an empty result", () => {
    expect(alignedTable(cols, [], "(0 rows)")).toEqual([" id | n", "----+---", "(0 rows)"]);
  });
});

describe("expandedTable", () => {
  it("prints one block per record; a label wider than the block stands alone", () => {
    expect(expandedTable(cols, [["makineo", 200]], { record: "RECORD", empty: "(0 rows)" })).toEqual([
      "-[ RECORD 1 ]",
      "id | makineo",
      "n  | 200",
    ]);
  });

  it("puts the + on the rule when the names are wider than the label", () => {
    const wide: Column[] = [{ name: "a_very_long_column", type: "text" }];
    expect(expandedTable(wide, [["x"]], { record: "RECORD", empty: "" })[0]).toBe("-[ RECORD 1 ]------+--");
  });
});

describe("formatRows", () => {
  const result = { columns: cols, rows: [["makineo", 200]] as const };

  it("goes expanded in auto mode only when the table is too wide", () => {
    expect(formatRows("en", result, "auto", 80)[0]).toBe("   id    |  n");
    expect(formatRows("en", result, "auto", 10)[0]).toBe("-[ RECORD 1 ]");
    expect(formatRows("es", result, "on", 80)[0]).toBe("-[ REGISTRO 1 ]");
    expect(formatRows("en", result, "off", 10).at(-1)).toBe("(1 row)");
  });

  it("titles \\d listings in the reader's language", () => {
    expect(formatRows("es", { ...result, title: "relations" }, "off", 80)[0].trim()).toBe(PSQL_TEXT.es.relations);
    expect(formatRows("en", { ...result, title: "table:people" }, "off", 80)[0].trim()).toBe('Table "public.people"');
  });
});

describe("hintQuery", () => {
  it("turns each hint into the line to run", () => {
    expect(hintQuery({ kind: "query", query: "SELECT 1" })).toBe("SELECT 1");
    expect(hintQuery({ kind: "tables" })).toBe("\\d");
    expect(hintQuery({ kind: "describe", table: "people" })).toBe("\\d people");
  });
});
