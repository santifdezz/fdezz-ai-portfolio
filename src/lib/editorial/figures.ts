import type { ProjectData } from "@/lib/portfolio-content";

export interface ProjectFigure {
  pre: string;
  value: string;
  label: string;
}

interface Candidate extends ProjectFigure {
  magnitude: number;
}

// A number as written in the copy: "3,600+", "1.200+", "95%+", "<4", or a tight range "3-4".
const DIGITS = String.raw`\d{1,3}(?:[.,]\d{3})+|\d+`;
const NUMBER = new RegExp(`([<>~]?)(${DIGITS})(?:[-–](${DIGITS}))?([%+]*)`, "g");
// Clause breaks: sentence ends, ", ", " — ", brackets. Thousands separators survive.
const CLAUSE_BREAK = /[.;:!?](?=\s|$)|,(?=\s)|\s[—–-]\s|[()[\]]/;
const WORD_CHAR = /[\p{L}\p{N}]/u;

const isYear = (prefix: string, digits: string, suffix: string) =>
  !prefix && !suffix && /^(19|20)\d{2}$/.test(digits);

function candidatesIn(clause: string): Candidate[] {
  const found: Candidate[] = [];
  for (const match of clause.matchAll(NUMBER)) {
    const [raw, prefix, digits, upper, suffix] = match;
    const start = match.index ?? 0;
    const end = start + raw.length;
    const after = clause[end] ?? "";
    // "2D", "8h", "24-hour": the number is part of a word, not a figure.
    const glued =
      WORD_CHAR.test(clause[start - 1] ?? "") ||
      WORD_CHAR.test(after) ||
      (after === "-" && WORD_CHAR.test(clause[end + 1] ?? ""));
    if (glued || isYear(prefix, digits, suffix)) continue;

    found.push({
      pre: clause.slice(0, start).trim(),
      value: raw,
      label: clause.slice(end).trim(),
      magnitude: Number((upper ?? digits).replace(/[.,]/g, "")),
    });
  }
  return found;
}

/**
 * Every number the project quotes, largest first, each with the words around
 * it as its caption. Features are read before the description, so when both
 * quote the same value the feature's phrasing wins; each value appears once.
 */
export function getProjectFigures(project: ProjectData): ProjectFigure[] {
  const clauses = [...project.features, ...project.description.split(CLAUSE_BREAK)];
  const found = clauses.flatMap((clause) => candidatesIn(clause.trim()));
  const unique = found.filter((c, i) => found.findIndex((other) => other.value === c.value) === i);
  return [...unique].sort((a, b) => b.magnitude - a.magnitude).map(({ pre, value, label }) => ({ pre, value, label }));
}

/** The project's headline number: its largest figure. */
export function getProjectFigure(project: ProjectData): ProjectFigure | null {
  return getProjectFigures(project)[0] ?? null;
}

const MAX_COMPACT_WORDS = 4;

/** A figure that reads on its own in a small slot: no lead-in, a short caption. */
export function isCompactFigure(figure: ProjectFigure): boolean {
  const words = figure.label.split(/\s+/).filter(Boolean).length;
  return figure.pre === "" && words > 0 && words <= MAX_COMPACT_WORDS;
}

export type OdometerCell = { kind: "digit"; digit: number } | { kind: "mark"; text: string };

/** "3,600+" as odometer cells: digits roll, separators and signs stay put. */
export function odometerCells(value: string): OdometerCell[] {
  return Array.from(value, (ch) => (/\d/.test(ch) ? { kind: "digit", digit: Number(ch) } : { kind: "mark", text: ch }));
}
