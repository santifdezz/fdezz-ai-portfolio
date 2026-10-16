"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type RefObject } from "react";
import { X } from "lucide-react";
import { getPortfolioContent, type Locale } from "@/lib/portfolio-content";
import { formatRows, hintQuery, PSQL_TEXT } from "@/lib/console/format";
import { run, type ExpandedMode } from "@/lib/console/sql";
import { buildDatabase } from "@/lib/console/tables";
import { REDUCED_MOTION_QUERY } from "@/components/editorial/hooks";

const PROMPT = "santiago=#";
const TYPE_STEP_MS = 14;
const MAX_STAGGERED_LINES = 30;

/** Queries offered as pads under the output, in the order a visitor would want them. */
const PADS = [
  "SELECT * FROM people;",
  "SELECT title, figure FROM projects;",
  "SELECT start_year, title FROM stages ORDER BY start_year DESC;",
  "\\d",
];

type Line = { text: string; tone?: "error" | "muted" } | { hint: string; label: string; query: string };

interface Entry {
  id: number;
  input: string | null;
  lines: Line[];
}

const URL_PATTERN = /(https?:\/\/[^\s|]+|mailto:[^\s|]+)/g;

/** Output text with its URLs (channels, CV, sites) made clickable. */
function Linkified({ text }: { text: string }) {
  return text.split(URL_PATTERN).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={part} target={part.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" className="underline decoration-[hsl(var(--primary)/0.5)] underline-offset-2 hover:text-[hsl(var(--primary))]">
        {part}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** Characters that fit across the output, so `\x auto` can switch to records when a table won't. */
function useColumns(ref: RefObject<HTMLElement | null>) {
  const [columns, setColumns] = useState(80);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const probe = document.createElement("span");
    probe.textContent = "0".repeat(20);
    probe.style.cssText = "position:absolute;visibility:hidden;white-space:pre";
    el.appendChild(probe);
    const charWidth = probe.getBoundingClientRect().width / 20 || 7.5;
    probe.remove();
    const observer = new ResizeObserver(([entry]) => setColumns(Math.max(20, Math.floor(entry.contentRect.width / charWidth) - 1)));
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return columns;
}

/**
 * The ⌘K overlay as a psql session on the portfolio itself: tables built from
 * the same content as the page, a slice of SELECT, psql's meta-commands and
 * its output formats. Not an assistant — a question gets psql's syntax error
 * plus the query that answers it, one click away.
 */
export function PsqlConsole({ locale, onQuit }: { locale: Locale; onQuit: () => void }) {
  const text = PSQL_TEXT[locale];
  const db = useMemo(() => buildDatabase(getPortfolioContent(locale)), [locale]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ExpandedMode>("auto");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [typing, setTyping] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const nextId = useRef(0);
  const columns = useColumns(outputRef);

  useEffect(() => {
    inputRef.current?.focus();
    return () => clearInterval(timer.current);
  }, []);

  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  const submit = useCallback(
    (line: string) => {
      const result = run(line, db);
      if (result.kind === "quit") return onQuit();
      let lines: Line[] = [];
      if (result.kind === "rows") lines = formatRows(locale, result, mode, columns).map((t) => ({ text: t }));
      else if (result.kind === "help") lines = text.help.map((t) => ({ text: t }));
      else if (result.kind === "expanded") {
        setMode(result.mode);
        lines = [{ text: text.expanded(result.mode), tone: "muted" }];
      } else if (result.kind === "error") {
        lines = [{ text: `${text.errorLabel}:  ${text.error(result.error)}`, tone: "error" }];
        if (result.hint) lines.push({ hint: `${text.hintLabel}:  `, label: text.hint(result.hint), query: hintQuery(result.hint) });
      }
      setEntries((prev) => [...prev, { id: nextId.current++, input: line, lines }]);
      if (line.trim()) setHistory((prev) => (prev[prev.length - 1] === line ? prev : [...prev, line]));
      setCursor(null);
      setInput("");
    },
    [db, locale, mode, columns, text, onQuit],
  );

  /** Run a pad or hint: typed into the prompt first, unless motion is reduced. */
  const typeAndRun = useCallback(
    (query: string) => {
      clearInterval(timer.current);
      inputRef.current?.focus();
      if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return submit(query);
      setTyping(true);
      let n = 0;
      timer.current = setInterval(() => {
        n += 1;
        setInput(query.slice(0, n));
        if (n >= query.length) {
          clearInterval(timer.current);
          setTyping(false);
          submit(query);
        }
      }, TYPE_STEP_MS);
    },
    [submit],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (typing) return e.preventDefault();
    if (e.key === "Enter") {
      e.preventDefault();
      submit(input);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      if (history.length === 0) return;
      e.preventDefault();
      const from = cursor ?? history.length;
      const to = Math.min(history.length, Math.max(0, from + (e.key === "ArrowUp" ? -1 : 1)));
      setCursor(to === history.length ? null : to);
      setInput(history[to] ?? "");
    }
  };

  let lineIndex = 0;
  const stagger = () => ({ ["--l" as string]: Math.min(lineIndex++, MAX_STAGGERED_LINES) }) as CSSProperties;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[5px_5px_0_0_hsl(var(--primary))]">
      <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.55)] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em]">
        <span aria-hidden className="size-[7px] rounded-[2px] bg-[hsl(var(--primary))] shadow-[0_0_10px_hsl(var(--primary)/0.85)]" />
        <span className="text-[hsl(var(--foreground))]">psql</span>
        <span className="truncate normal-case tracking-normal text-[hsl(var(--muted-foreground))]">portfolio @ sfseoane.es</span>
        <span className="ml-auto shrink-0 normal-case tracking-normal text-[hsl(var(--muted-foreground))]">\x {mode}</span>
        <button
          type="button"
          onClick={onQuit}
          aria-label={locale === "es" ? "Cerrar consola" : "Close console"}
          className="-mr-1 rounded p-1 text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <div
        ref={outputRef}
        role="log"
        aria-live="polite"
        onMouseUp={() => {
          if (!window.getSelection()?.toString()) inputRef.current?.focus();
        }}
        className="relative min-h-0 flex-1 overflow-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed text-[hsl(var(--foreground)/0.9)]"
      >
        {text.banner.map((t) => (
          <p key={t} className="whitespace-pre-wrap text-[hsl(var(--muted-foreground))]">
            {t}
          </p>
        ))}
        {entries.map((entry) => (
          <div key={entry.id} className="mt-3">
            {entry.input !== null && (
              <p className="whitespace-pre-wrap break-words">
                <span className="text-[hsl(var(--primary))]">{PROMPT}</span> {entry.input}
              </p>
            )}
            {entry.lines.map((line, i) =>
              "hint" in line ? (
                <p key={i} className="psql-line whitespace-pre-wrap" style={stagger()}>
                  <span className="text-[hsl(var(--muted-foreground))]">{line.hint}</span>
                  {line.label}{" "}
                  <button
                    type="button"
                    onClick={() => typeAndRun(line.query)}
                    className="text-[hsl(var(--signal))] underline decoration-[hsl(var(--signal)/0.5)] underline-offset-2 hover:decoration-[hsl(var(--signal))]"
                  >
                    {line.query}
                  </button>
                </p>
              ) : (
                <p
                  key={i}
                  style={stagger()}
                  className={`psql-line whitespace-pre ${
                    line.tone === "error" ? "text-[hsl(var(--plate-rave-ink))]" : line.tone === "muted" ? "text-[hsl(var(--muted-foreground))]" : ""
                  }`}
                >
                  <Linkified text={line.text || " "} />
                </p>
              ),
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-[hsl(var(--border))] px-4 pb-3 pt-2.5">
        <div className="no-scrollbar -mx-4 mb-2.5 flex gap-1.5 overflow-x-auto px-4">
          {PADS.map((query, i) => (
            <button
              key={query}
              type="button"
              onClick={() => typeAndRun(query)}
              disabled={typing}
              className="shrink-0 rounded-[4px] border border-[hsl(var(--border))] px-2 py-1 font-mono text-[11px] text-[hsl(var(--muted-foreground))] transition-colors hover:border-[hsl(var(--primary)/0.6)] hover:text-[hsl(var(--foreground))] disabled:opacity-50"
            >
              <span className="mr-1.5 tabular-nums text-[hsl(var(--primary))]">{String(i + 1).padStart(2, "0")}</span>
              {query}
            </button>
          ))}
        </div>
        <label className="flex items-baseline gap-2 font-mono text-[13px]">
          <span className="shrink-0 text-[hsl(var(--primary))]">{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setCursor(null);
            }}
            onKeyDown={onKeyDown}
            readOnly={typing}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            enterKeyHint="send"
            aria-label={locale === "es" ? "Consulta SQL" : "SQL query"}
            placeholder="SELECT * FROM projects;"
            className="psql-input min-w-0 flex-1 bg-transparent text-[hsl(var(--foreground))] caret-[hsl(var(--primary))] outline-none placeholder:text-[hsl(var(--muted-foreground)/0.5)]"
          />
        </label>
      </div>
    </div>
  );
}
