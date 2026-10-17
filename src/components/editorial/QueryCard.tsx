import type { CSSProperties, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioContent } from "@/lib/portfolio-content";
import { getProjectFigure } from "@/lib/editorial/figures";
import { parseYearRange, trajectorySegments } from "@/lib/editorial/timeline";
import { foundedProjects } from "@/lib/editorial/ventures";
import type { EditorialCopy } from "./copy";
import { CopyButton } from "./primitives";

interface QueryCardProps {
  copy: EditorialCopy;
  content: PortfolioContent;
  className?: string;
}

/** The query, token by token; `br` breaks the line. */
const SQL: ReadonlyArray<{ text: string; tone?: "keyword" | "literal" } | "br"> = [
  { text: "SELECT", tone: "keyword" },
  { text: " * " },
  { text: "FROM", tone: "keyword" },
  { text: " people" },
  "br",
  { text: "WHERE", tone: "keyword" },
  { text: " id = " },
  { text: "'santiago'", tone: "literal" },
  { text: ";" },
];
// Each token's first step; a line break costs a beat, so WHERE arrives after a pause.
const LINE_PAUSE = 7; // in steps: ~180ms
const TOKEN_STARTS = SQL.reduce<number[]>((starts, token, i) => {
  const prev = i === 0 ? 0 : starts[i - 1] + (SQL[i - 1] === "br" ? LINE_PAUSE : (SQL[i - 1] as { text: string }).text.length);
  return [...starts, prev];
}, []);
const SQL_LENGTH = SQL.reduce((n, token) => n + (token === "br" ? 0 : token.text.length), 0);

// Load sequence (ms): the card frame enters at 160, typing starts once it has landed.
// Typed at a human pace, with a beat of hesitation before WHERE.
const TYPE_START = 520;
const TYPE_STEP = 26;
const TYPED_AT = TYPE_START + (SQL_LENGTH + LINE_PAUSE) * TYPE_STEP;
const SEQUENCE = {
  ["--d" as string]: "160ms",
  ["--qc-start" as string]: `${TYPE_START}ms`,
  ["--qc-step" as string]: `${TYPE_STEP}ms`,
  ["--qc-typed" as string]: `${TYPED_AT}ms`,
} as CSSProperties;

const TONE = { keyword: "text-[hsl(var(--primary))]", literal: "text-[hsl(var(--signal))]" };

/** The SQL typed out character by character (CSS only, so it runs before hydration). */
function TypedQuery() {
  return (
    <code aria-hidden className="font-mono text-[12px] leading-relaxed text-[hsl(var(--foreground)/0.85)]">
      {SQL.map((token, t) =>
        token === "br" ? (
          <br key={t} />
        ) : (
          <span key={t} className={token.tone ? TONE[token.tone] : undefined}>
            {Array.from(token.text, (ch, i) => (
              <span key={i} className="qc-char" style={{ ["--c" as string]: TOKEN_STARTS[t] + i } as CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
        ),
      )}
      <span className="qc-caret ml-px inline-block h-[1.05em] w-[0.6em] translate-y-[0.18em] bg-[hsl(var(--primary))]" />
    </code>
  );
}

const FOCUS_SHOWN = 4;

function Column({ name, type, row, children }: { name: string; type: string; row: number; children: ReactNode }) {
  return (
    <div
      className="qc-row grid grid-cols-[5.25rem_minmax(0,1fr)] gap-3 border-b border-dashed border-[hsl(var(--border))] py-2.5 last:border-b-0"
      style={{ ["--r" as string]: row } as CSSProperties}
    >
      <dt className="font-mono text-[11px] leading-tight">
        <span className="block text-[hsl(var(--foreground)/0.9)]">{name}</span>
        <span className="block text-[10px] text-[hsl(var(--muted-foreground))]">{type}</span>
      </dt>
      <dd className="min-w-0 font-ui text-[13.5px] leading-snug text-[hsl(var(--foreground))]">{children}</dd>
    </div>
  );
}

/**
 * A text[] value the way Postgres prints it: {a, b, c}. Past `limit` items it
 * elides the rest, "{a, b, …} (+5)", and keeps the full list for screen readers.
 */
function ArrayValue({ items, limit = Infinity }: { items: readonly string[]; limit?: number }) {
  const brace = "font-mono text-[hsl(var(--muted-foreground))]";
  const hidden = Math.max(0, items.length - limit);
  if (hidden === 0) {
    return (
      <>
        <span className={brace}>{"{"}</span>
        {items.join(", ")}
        <span className={brace}>{"}"}</span>
      </>
    );
  }
  return (
    <>
      <span className="sr-only">{items.join(", ")}</span>
      <span aria-hidden>
        <span className={brace}>{"{"}</span>
        {items.slice(0, limit).join(", ")}, …<span className={brace}>{"}"}</span>
        <span className="ml-1.5 font-mono text-[11px] text-[hsl(var(--muted-foreground))]">(+{hidden})</span>
      </span>
    </>
  );
}

/**
 * His CV as the single row a query returns — every value from portfolio
 * content. On load the query types itself out, then the row prints column by
 * column and the result count resolves; reduced motion shows it resolved.
 */
export function QueryCard({ copy, content, className = "" }: QueryCardProps) {
  const { education, bio, cvLink } = content.about;
  const { location, availability, email } = content.contact;
  const current = education[education.length - 1];
  const first = parseYearRange(education[0]?.year ?? "");
  const last = parseYearRange(current?.year ?? "");
  const segments = trajectorySegments(education);
  const founded = foundedProjects(content.projects);
  const skillGroups = Object.values(bio.skills);
  const languages = skillGroups[0] ?? [];
  const focus = skillGroups[skillGroups.length - 1] ?? [];
  const columns = founded.length > 0 ? 8 : 7;
  let row = 0;

  return (
    <aside aria-label={`${copy.card.label} · ${copy.card.rows(columns)}`} className={`enter relative ${className}`} style={SEQUENCE}>
      <div className="overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[5px_5px_0_0_hsl(var(--primary))]">
        <div className="flex items-start justify-between gap-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.55)] px-4 py-3">
          <TypedQuery />
          <a
            href={cvLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 pt-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
          >
            {copy.card.openCv} <ArrowUpRight aria-hidden className="size-3" />
          </a>
        </div>

        <div className="px-4 pb-1.5 pt-2.5">
          <p className="grid font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
            <span aria-hidden className="qc-pending [grid-area:1/1]">…</span>
            <span className="qc-done [grid-area:1/1]">{copy.card.rows(columns)}</span>
          </p>
          <dl className="mt-1">
            <Column row={row++} name="role" type="text">
              {current?.title}
            </Column>
            {founded.length > 0 && (
              <Column row={row++} name="founded" type="text[]">
                {founded.map((project) => {
                  const figure = getProjectFigure(project);
                  const stage = education.find((e) => e.role === "founder" && e.institution === project.title);
                  return (
                    <span key={project.id} className="block">
                      {project.title}
                      {stage && <span className="font-mono text-[11px] text-[hsl(var(--muted-foreground))]"> · {stage.year}</span>}
                      {figure && (
                        <span className="mt-0.5 block font-mono text-[11px] text-[hsl(var(--muted-foreground))]">
                          {figure.value} {figure.label}
                        </span>
                      )}
                    </span>
                  );
                })}
              </Column>
            )}
            <Column row={row++} name="path" type="int4range">
              <span className="flex items-baseline justify-between gap-2">
                {first && last && (
                  <span className="font-mono text-[12.5px] tabular-nums">
                    [{first.start}, {last.end}]
                  </span>
                )}
                <span className="font-mono text-[10.5px] text-[hsl(var(--muted-foreground))]">{copy.card.stages(education.length)}</span>
              </span>
              <span aria-hidden className="mt-2 flex h-1.5 gap-[3px]">
                {segments.map((s, i) => (
                  <span
                    key={s.title}
                    title={s.title}
                    style={{ flexGrow: s.weight }}
                    className={`basis-0 rounded-[1px] ${i === segments.length - 1 ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--foreground)/0.22)]"}`}
                  />
                ))}
              </span>
            </Column>
            <Column row={row++} name="base" type="text">
              {location}
            </Column>
            <Column row={row++} name="status" type="text">
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="size-[7px] shrink-0 rounded-[2px] bg-[hsl(var(--primary))] shadow-[0_0_10px_hsl(var(--primary)/0.85)]" />
                {availability}
              </span>
            </Column>
            <Column row={row++} name="langs" type="text[]">
              <ArrayValue items={languages} />
            </Column>
            <Column row={row++} name="focus" type="text[]">
              <ArrayValue items={focus} limit={FOCUS_SHOWN} />
            </Column>
            <Column row={row++} name="email" type="text">
              <span className="flex items-center justify-between gap-2">
                <span className="min-w-0 select-all truncate">{email}</span>
                <CopyButton text={email} labels={copy.clipboard} compact />
              </span>
            </Column>
          </dl>
        </div>
      </div>
    </aside>
  );
}
