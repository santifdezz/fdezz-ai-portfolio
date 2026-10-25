"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import type { EducationEntry } from "@/lib/portfolio-content";
import { ganttLayout, splitNarrative, type GanttBar } from "@/lib/editorial/timeline";
import type { EditorialCopy } from "./copy";
import { REDUCED_MOTION_QUERY, useMediaQuery } from "./hooks";
import { ResultFooter, SectionEyebrow, TwoTone } from "./primitives";

interface ExperienceTimelineProps {
  entries: EducationEntry[];
  copy: EditorialCopy;
}

const formatYears = (year: string) => year.replace(/\s*-\s*/, " – ");
const ROW = "md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-10";

/** A stage's bar: draws left to right as its row comes into view, lit while it draws and whenever the row is active. */
function Clip({ bar, drawn, accent, pulse }: { bar: GanttBar; drawn: MotionValue<number>; accent: boolean; pulse: boolean }) {
  const [drawing, setDrawing] = useState(false);
  useMotionValueEvent(drawn, "change", (f) => setDrawing(f > 0 && f < 1));
  const width = useTransform(drawn, (f) => `${bar.widthPct * f}%`);
  const lit = accent || drawing;
  return (
    <motion.span
      className={`absolute top-1/2 h-2 -translate-y-1/2 origin-left rounded-[2px] transition-[background-color,box-shadow] duration-300 ${
        lit ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--foreground)/0.3)]"
      } ${accent ? "shadow-[0_0_14px_hsl(var(--primary)/0.45)]" : ""}`}
      style={{ left: `${bar.startPct}%`, width }}
      initial={false}
      animate={pulse ? { scaleY: [1, 1.9, 1] } : { scaleY: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    />
  );
}

/** A one-off stage: an LED that fires (fast attack, slow decay) when its row comes into view. */
function Marker({ bar, lit, highlighted }: { bar: GanttBar; lit: boolean; highlighted: boolean }) {
  return (
    <motion.span
      className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 transition-[background-color,box-shadow] duration-300 ${
        highlighted ? "size-3 bg-[hsl(var(--primary))] shadow-[0_0_12px_hsl(var(--primary)/0.6)]" : "size-2.5 bg-[hsl(var(--foreground)/0.6)]"
      }`}
      style={{ left: `${bar.startPct}%` }}
      initial={false}
      animate={lit ? { opacity: 1, scale: [0.5, 1.7, 1] } : { opacity: 0.18, scale: 0.6 }}
      transition={lit ? { duration: 0.44, delay: 0.25, times: [0, 0.09, 1], ease: "easeOut" } : { duration: 0.2 }}
    />
  );
}

interface RowProps {
  entry: EducationEntry;
  bar: GanttBar;
  years: number[];
  yearPct: (year: number) => number;
  current: boolean;
  reduce: boolean;
  dimmed: boolean;
  copy: EditorialCopy;
  onActive: (active: boolean) => void;
}

/**
 * One stage. It is dim until it enters the reader's view, then lights up and
 * draws its own bar; hovering or focusing it dims the others and brightens its
 * bar; opening it pulses the bar and unfolds the detail.
 */
function Row({ entry, bar, years, yearPct, current, reduce, dimmed, copy, onActive }: RowProps) {
  const rowRef = useRef<HTMLLIElement>(null);
  const seen = useInView(rowRef, { once: true, margin: "0px 0px -30% 0px" });
  const revealed = reduce || seen;
  const [open, setOpen] = useState(current);
  const [hovered, setHovered] = useState(false);
  const [wasToggled, setWasToggled] = useState(false);
  const drawn = useMotionValue(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce) {
      drawn.set(1);
      return;
    }
    if (!seen) return;
    const controls = animate(drawn, 1, { duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [seen, reduce, drawn]);

  const founder = entry.role === "founder";
  const accent = current || open || hovered;
  const { kicker, rest } = splitNarrative(entry.narrative);
  const detailId = `experience-detail-${entry.year}-${entry.title}`.replace(/[^\w-]+/g, "-");

  const setActive = (active: boolean) => {
    setHovered(active);
    onActive(active);
  };

  return (
    <li
      ref={rowRef}
      className={`border-b border-[hsl(var(--border))] ${reduce ? "" : "transition-opacity duration-500"}`}
      style={{ opacity: !revealed ? 0.3 : dimmed ? 0.45 : 1 }}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailId}
        onClick={() => {
          setOpen((o) => !o);
          setWasToggled(true);
        }}
        className={`grid w-full cursor-pointer items-center gap-4 py-5 text-left ${ROW}`}
      >
        <span className="flex items-start gap-3">
          <span
            aria-hidden
            className={`mt-[1.35rem] grid size-4 shrink-0 place-items-center font-mono text-[13px] leading-none text-[hsl(var(--muted-foreground))] transition-transform duration-300 ${
              open ? "rotate-45" : ""
            }`}
          >
            +
          </span>
          <span className="min-w-0">
            <span className="mb-1 block font-mono text-[10.5px] tabular-nums tracking-[0.12em] text-[hsl(var(--muted-foreground))]">
              {formatYears(entry.year)}
            </span>
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-display text-[1.25rem] leading-tight tracking-[-0.01em] text-[hsl(var(--foreground))]">{entry.title}</span>
              {(current || founder) && (
                <span className="rounded-full bg-[hsl(var(--primary))] px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[hsl(var(--primary-foreground))]">
                  {copy.experience.current}
                </span>
              )}
            </span>
            <span className="mt-1 block font-ui text-[12.5px] text-[hsl(var(--muted-foreground))]">{entry.institution}</span>
          </span>
        </span>

        <span aria-hidden className="relative block h-6">
          {years.map((y) => (
            <span key={y} className="absolute inset-y-0 w-px bg-[hsl(var(--border)/0.6)]" style={{ left: `${yearPct(y)}%` }} />
          ))}
          {bar.milestone ? (
            <Marker bar={bar} lit={revealed} highlighted={accent || founder} />
          ) : (
            <Clip bar={bar} drawn={drawn} accent={accent} pulse={wasToggled && open} />
          )}
          {current && !bar.milestone && (
            <span
              className="absolute top-1/2 size-1.5 -translate-y-1/2 translate-x-[-50%] rounded-full bg-[hsl(var(--primary))] motion-safe:animate-pulse"
              style={{ left: `${bar.startPct + bar.widthPct}%` }}
            />
          )}
        </span>
      </button>

      <div
        id={detailId}
        inert={!open}
        className={`grid ${reduce ? "" : "transition-[grid-template-rows,opacity] duration-300 ease-out"} ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className={`grid pb-9 ${ROW}`}>
            <span className="hidden md:block" />
            <div className="max-md:pl-7">
              {kicker && (
                <p className="font-display text-[1.3rem] font-light italic leading-snug text-[hsl(var(--foreground)/0.92)]">{kicker}</p>
              )}
              <ul className="mt-3 space-y-2">
                {[entry.description, ...rest].map((line) => (
                  <li key={line} className="flex gap-3 font-ui text-[15px] leading-relaxed text-[hsl(var(--foreground)/0.72)]">
                    <span aria-hidden className="mt-[0.72em] h-px w-3 shrink-0 bg-[hsl(var(--primary))]" />
                    {line}
                  </li>
                ))}
              </ul>
              {entry.learnings && entry.learnings.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {entry.learnings.map((l) => (
                    <li
                      key={l}
                      className="rounded-[3px] border border-[hsl(var(--border))] px-2 py-0.5 font-mono text-[11px] text-[hsl(var(--muted-foreground))]"
                    >
                      {l}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * The trajectory as a DAW arrangement on real years. Each stage is its own
 * beat: dim until the reader reaches it, then it lights up and records its
 * clip (one-off stages fire like LEDs). Hover or focus isolates a stage by
 * dimming the rest; opening it pulses its bar and unfolds the detail. Reduced
 * motion: everything recorded and settled, no transitions.
 */
export function ExperienceTimeline({ entries, copy }: ExperienceTimelineProps) {
  const { from, to, years, bars } = ganttLayout(entries);
  const yearPct = (year: number) => ((year - from) / Math.max(1, to - from)) * 100;
  const reduce = useMediaQuery(REDUCED_MOTION_QUERY);
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-16">
      <div className="mx-auto max-w-[90rem] px-4 pt-[var(--section-y)] sm:px-6 lg:px-10">
        <SectionEyebrow label={copy.experience.eyebrow} meta={years.length ? `${from} → ${to}` : undefined} />
        <TwoTone
          id="experience-title"
          lead={copy.experience.lead(entries.length)}
          rest={copy.experience.rest}
          className="mt-10 max-w-[22ch]"
        />

        <div className="mt-16">
          <div aria-hidden className={`grid border-b border-[hsl(var(--border))] pb-3 pt-2 ${ROW}`}>
            <span className="hidden md:block" />
            <div className="relative h-4 font-mono text-[10.5px] tabular-nums text-[hsl(var(--muted-foreground))]">
              {years.map((y, i) => (
                <span
                  key={y}
                  className={`absolute top-0 ${i === 0 ? "" : i === years.length - 1 ? "-translate-x-full" : "-translate-x-1/2"}`}
                  style={{ left: `${yearPct(y)}%` }}
                >
                  {y}
                </span>
              ))}
            </div>
          </div>

          <ol>
            {entries.map((entry, i) => (
              <Row
                // Remounts when reduced motion resolves after hydration, so bars start from the right state.
                key={`${entry.year}-${entry.title}-${reduce ? "still" : "live"}`}
                entry={entry}
                bar={bars[i]}
                years={years}
                yearPct={yearPct}
                current={i === entries.length - 1}
                reduce={reduce}
                dimmed={active !== null && active !== i}
                copy={copy}
                onActive={(on) => setActive((prev) => (on ? i : prev === i ? null : prev))}
              />
            ))}
          </ol>
          <div className="pt-4">
            <ResultFooter text={copy.resultRows(entries.length)} />
          </div>
        </div>
      </div>
    </section>
  );
}
