import type { PortfolioContent } from "@/lib/portfolio-content";
import { getProjectFigure } from "@/lib/editorial/figures";
import { parseYearRange } from "@/lib/editorial/timeline";
import { foundedProjects } from "@/lib/editorial/ventures";
import { OWNER_NAME } from "@/lib/site";

export type Cell = string | number | boolean | null | readonly string[];
export type ColumnType = "text" | "text[]" | "int4" | "bool";

export interface Column {
  name: string;
  type: ColumnType;
}

export interface Table {
  name: string;
  columns: readonly Column[];
  rows: readonly (readonly Cell[])[];
}

/** Tables by name, in the order `\d` lists them. */
export type Database = ReadonlyMap<string, Table>;

const col = (name: string, type: ColumnType = "text"): Column => ({ name, type });

const table = (name: string, columns: Column[], rows: Cell[][]): Table => ({ name, columns, rows });

/**
 * The portfolio as a small Postgres database, one per locale: every value is
 * read from portfolio content, so the console can only answer with what the
 * page itself says.
 */
export function buildDatabase(content: PortfolioContent): Database {
  const { education, bio, cvLink } = content.about;
  const { location, availability, email, channels } = content.contact;
  const first = parseYearRange(education[0]?.year ?? "");
  const last = parseYearRange(education[education.length - 1]?.year ?? "");

  const tables = [
    table(
      "people",
      [col("id"), col("name"), col("role"), col("base"), col("status"), col("founded", "text[]"), col("first_year", "int4"), col("last_year", "int4"), col("email"), col("cv")],
      [
        [
          "santiago",
          OWNER_NAME,
          education[education.length - 1]?.title ?? null,
          location,
          availability,
          foundedProjects(content.projects).map((p) => p.title),
          first?.start ?? null,
          last?.end ?? null,
          email,
          cvLink,
        ],
      ],
    ),
    table(
      "projects",
      [col("id"), col("title"), col("status"), col("founder", "bool"), col("figure"), col("stack", "text[]"), col("github"), col("site")],
      content.projects.map((p) => {
        const figure = getProjectFigure(p);
        return [
          p.id,
          p.title,
          p.status,
          p.role === "founder",
          figure ? [figure.pre, figure.value, figure.label].filter(Boolean).join(" ") : null,
          p.technologies,
          p.links.github ?? null,
          p.links.demo ?? null,
        ];
      }),
    ),
    table(
      "stages",
      [col("start_year", "int4"), col("end_year", "int4"), col("period"), col("title"), col("institution"), col("founder", "bool")],
      education.map((e) => {
        const range = parseYearRange(e.year);
        return [range?.start ?? null, range?.end ?? null, e.year, e.title, e.institution, e.role === "founder"];
      }),
    ),
    table(
      "skills",
      [col("category"), col("skill")],
      Object.entries(bio.skills).flatMap(([category, skills]) => skills.map((skill) => [category, skill])),
    ),
    table(
      "channels",
      [col("type"), col("value"), col("url")],
      channels.map((c) => [c.type, c.value, c.url]),
    ),
  ];
  return new Map(tables.map((t) => [t.name, t]));
}
