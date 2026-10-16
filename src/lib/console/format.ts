import type { Locale } from "@/lib/portfolio-content";
import type { ConsoleError, ExpandedMode, Hint } from "./sql";
import type { Cell, Column } from "./tables";

/** psql's own wording, in the reader's language (psql ships both). */
export const PSQL_TEXT = {
  en: {
    rows: (n: number) => `(${n} ${n === 1 ? "row" : "rows"})`,
    record: "RECORD",
    relations: "List of relations",
    table: (name: string) => `Table "public.${name}"`,
    expanded: (mode: ExpandedMode) =>
      mode === "auto" ? "Expanded display is used automatically." : `Expanded display is ${mode}.`,
    error: (e: ConsoleError) => {
      switch (e.code) {
        case "syntax":
          return e.near === null ? "syntax error at end of input" : `syntax error at or near "${e.near}"`;
        case "relation":
          return `relation "${e.name}" does not exist`;
        case "column":
          return `column "${e.name}" does not exist`;
        case "meta":
          return `invalid command ${e.command}`;
      }
    },
    errorLabel: "ERROR",
    hintLabel: "HINT",
    hint: (h: Hint) =>
      h.kind === "query" ? "This is a SQL console. Try:" : h.kind === "tables" ? "List the tables with:" : "See its columns with:",
    banner: ["psql (16.4) — portfolio @ sfseoane.es", 'Type \\? for help, \\d to list the tables.'],
    help: [
      "General",
      "  \\d [TABLE]      list tables, or describe one",
      "  \\x [on|off|auto] toggle expanded display",
      "  \\q              quit (or Esc)",
      "  Ctrl+L          clear the screen · ↑ ↓ history",
      "",
      "Query",
      "  SELECT * | count(*) | col, … FROM table",
      "    [WHERE col = 'v' | col ILIKE '%v%' | 'v' = ANY(col) [AND …]]",
      "    [ORDER BY col [ASC|DESC]] [LIMIT n];",
    ],
  },
  es: {
    rows: (n: number) => `(${n} ${n === 1 ? "fila" : "filas"})`,
    record: "REGISTRO",
    relations: "Listado de relaciones",
    table: (name: string) => `Tabla «public.${name}»`,
    expanded: (mode: ExpandedMode) =>
      mode === "auto" ? "El despliegue expandido se usará automáticamente." : `El despliegue expandido está ${mode === "on" ? "activado" : "desactivado"}.`,
    error: (e: ConsoleError) => {
      switch (e.code) {
        case "syntax":
          return e.near === null ? "error de sintaxis al final de la entrada" : `error de sintaxis en o cerca de «${e.near}»`;
        case "relation":
          return `no existe la relación «${e.name}»`;
        case "column":
          return `no existe la columna «${e.name}»`;
        case "meta":
          return `orden ${e.command} no válida`;
      }
    },
    errorLabel: "ERROR",
    hintLabel: "SUGERENCIA",
    hint: (h: Hint) =>
      h.kind === "query" ? "Esto es una consola SQL. Prueba:" : h.kind === "tables" ? "Lista las tablas con:" : "Mira sus columnas con:",
    banner: ["psql (16.4) — portfolio @ sfseoane.es", "Escribe \\? para ver la ayuda, \\d para listar las tablas."],
    help: [
      "General",
      "  \\d [TABLA]      lista las tablas, o describe una",
      "  \\x [on|off|auto] despliegue expandido",
      "  \\q              salir (o Esc)",
      "  Ctrl+L          limpiar la pantalla · ↑ ↓ historial",
      "",
      "Consulta",
      "  SELECT * | count(*) | col, … FROM tabla",
      "    [WHERE col = 'v' | col ILIKE '%v%' | 'v' = ANY(col) [AND …]]",
      "    [ORDER BY col [ASC|DESC]] [LIMIT n];",
    ],
  },
} as const;

/** The query a hint offers to run. */
export function hintQuery(hint: Hint): string {
  return hint.kind === "query" ? hint.query : hint.kind === "tables" ? "\\d" : `\\d ${hint.table}`;
}

const NEEDS_QUOTES = /[\s,{}"\\]|^$/;

/** A value the way psql prints it: t/f, {a,"b c"}, blank for NULL. */
export function formatCell(cell: Cell): string {
  if (cell === null) return "";
  if (typeof cell === "boolean") return cell ? "t" : "f";
  if (Array.isArray(cell)) return `{${cell.map((item) => (NEEDS_QUOTES.test(item) ? `"${item.replace(/(["\\])/g, "\\$1")}"` : item)).join(",")}}`;
  return String(cell);
}

const center = (text: string, width: number) => {
  const left = Math.floor((width - text.length) / 2);
  return " ".repeat(Math.max(0, left)) + text + " ".repeat(Math.max(0, width - text.length - left));
};

/** psql's aligned format: centred header, `-+-` rule, numbers right-aligned, row count. */
export function alignedTable(columns: readonly Column[], rows: readonly (readonly Cell[])[], footer: string, title?: string): string[] {
  const cells = rows.map((row) => row.map(formatCell));
  const widths = columns.map((c, i) => Math.max(c.name.length, ...cells.map((row) => row[i].length)));
  const total = widths.reduce((sum, w) => sum + w + 3, -1);
  const line = (values: string[], align: (i: number, v: string) => string) => ` ${values.map((v, i) => align(i, v)).join(" | ")} `.trimEnd();
  return [
    ...(title ? [center(title, total)] : []),
    line(columns.map((c) => c.name), (i, v) => center(v, widths[i])),
    widths.map((w) => "-".repeat(w + 2)).join("+"),
    ...cells.map((row) => line(row, (i, v) => (columns[i].type === "int4" ? v.padStart(widths[i]) : v.padEnd(widths[i])))),
    footer,
  ];
}

/**
 * psql's expanded format (\x): one block per record, `name | value`, under a
 * `-[ RECORD n ]-+---` rule (no `+` when the label is wider than the names).
 */
export function expandedTable(
  columns: readonly Column[],
  rows: readonly (readonly Cell[])[],
  labels: { record: string; empty: string },
  title?: string,
): string[] {
  const keyWidth = Math.max(...columns.map((c) => c.name.length));
  const valueWidth = Math.max(1, ...rows.flatMap((row) => row.map((cell) => formatCell(cell).length)));
  const head = (n: number) => {
    const label = `-[ ${labels.record} ${n} ]`;
    return label.length < keyWidth + 1
      ? `${label.padEnd(keyWidth + 1, "-")}+${"-".repeat(valueWidth + 1)}`
      : label.padEnd(keyWidth + 3 + valueWidth, "-");
  };
  return [
    ...(title ? [title] : []),
    ...(rows.length === 0 ? [labels.empty] : []),
    ...rows.flatMap((row, r) => [head(r + 1), ...columns.map((c, i) => `${c.name.padEnd(keyWidth)} | ${formatCell(row[i])}`.trimEnd())]),
  ];
}

/** Aligned, unless expanded is on — or auto and the aligned table is wider than the screen. */
export function formatRows(
  locale: Locale,
  result: { columns: readonly Column[]; rows: readonly (readonly Cell[])[]; title?: string },
  mode: ExpandedMode,
  maxWidth: number,
): string[] {
  const text = PSQL_TEXT[locale];
  const title = result.title === "relations" ? text.relations : result.title?.startsWith("table:") ? text.table(result.title.slice(6)) : undefined;
  const aligned = alignedTable(result.columns, result.rows, text.rows(result.rows.length), title);
  const tooWide = Math.max(...aligned.map((l) => l.length)) > maxWidth;
  if (mode === "on" || (mode === "auto" && tooWide)) {
    return expandedTable(result.columns, result.rows, { record: text.record, empty: text.rows(0) }, title);
  }
  return aligned;
}
