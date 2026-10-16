"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { EducationEntry } from "@/lib/portfolio-content";
import { ganttLayout, playheadYear, recordedFraction, splitNarrative, type GanttBar } from "@/lib/editorial/timeline";
import type { EditorialCopy } from "./copy";
import { REDUCED_MOTION_QUERY, useMediaQuery } from "./hooks";
import { ResultFooter, SectionEyebrow, TwoTone } from "./primitives";

interface ExperienceTimelineProps {
  entries: EducationEntry[];
  copy: EditorialCopy;
}

const formatYears = (year: string) => year.replace(/\s*-\s*/, " – ");
const ROW = "md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-10";
const PRIMARY = "hsl(var(--primary))";
const PLAYED = "hsl(var(--foreground) / 0.3)";

/** A stage's bar, recorded as the playhead crosses it: lit while recording, settled after. */
function Clip({ bar, head, current }: { bar: GanttBar; head: MotionValue<number>; current: boolean }) {
  const recorded = useTransform(head, (h) => recordedFraction(h, bar));
  const background = useTransform(recorded, (f) => (current || (f > 0 && f < 1) ? PRIMARY : PLAYED));
  return (
    <motion.span
      className={`absolute top-1/2 h-2 -translate-y-1/2 origin-left rounded-[2px] ${current ? "shadow-[0_0_14px_hsl(var(--primary)/0.45)]" : ""}`}
      style={{ left: `${bar.startPct}%`, width: `${bar.widthPct}%`, scaleX: recorded, background }}
    />
  );
}

/** A one-off stage: an LED that fires (fast attack, slow decay) when the playhead reaches it. */
function Marker({ bar, head, highlighted }: { bar: GanttBar; head: MotionValue<number>; highlighted: boolean }) {
  const [lit, setLit] = useState(() => recordedFraction(head.get(), bar) === 1);
  useMotionValueEvent(head, "change", (h) => setLit(recordedFraction(h, bar) === 1));
  return (
    <motion.span
      className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 ${
        highlighted ? "size-3 bg-[hsl(var(--primary))] shadow-[0_0_12px_hsl(var(--primary)/0.6)]" : "size-2.5 bg-[hsl(var(--foreground)/0.6)]"
      }`}
      style={{ left: `${bar.startPct}%` }}
      initial={false}
      animate={lit ? { opacity: 1, scale: [0.5, 1.7, 1] } : { opacity: 0.18, scale: 0.6 }}
      transition={lit ? { duration: 0.44, times: [0, 0.09, 1], ease: "easeOut" } : { duration: 0.2 }}
    />
  );
}

/**
 * The trajectory as a DAW arrangement on real years: a playhead tied to the
 * scroll sweeps 2020 → today, each stage's clip records as it passes, one-off
 * stages fire like LEDs, and a readout shows the year under the playhead.
 * Each stage still opens to its detail. Reduced motion: everything recorded,
 * no playhead.
 */
export function ExperienceTimeline({ entries, copy }: ExperienceTimelineProps) {
  const { from, to, years, bars } = ganttLayout(entries);
  const yearPct = (year: number) => ((year - from) / Math.max(1, to - from)) * 100;
  const currentIndex = entries.length - 1;

  const chartRef = useRef<HTMLDivElement>(null);
  const reduce = useMediaQuery(REDUCED_MOTION_QUERY);
  const { scrollYProgress } = useScroll({ target: chartRef, offset: ["start 0.75", "end 0.85"] });
  const scrolled = useTransform(scrollYProgress, (p) => p * 100);
  const everything = useMotionValue(100);
  const head = reduce ? everything : scrolled;
  const headLeft = useTransform(head, (h) => `${h}%`);
  const readout = useTransform(head, (h) => String(playheadYear(h, from, to)));

  const playhead = !reduce && (
    <motion.span aria-hidden className="absolute -inset-y-2 w-px bg-[hsl(var(--primary)/0.55)]" style={{ left: headLeft }} />
  );

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

        <div ref={chartRef} className="mt-16">
          <div aria-hidden className={`grid border-b border-[hsl(var(--border))] pb-3 pt-8 ${ROW}`}>
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
              {!reduce && (
                <motion.span
                  className="absolute -top-8 -translate-x-1/2 rounded-[3px] bg-[hsl(var(--primary))] px-1.5 py-0.5 text-[10px] text-[hsl(var(--primary-foreground))]"
                  style={{ left: headLeft }}
                >
                  {readout}
                </motion.span>
              )}
            </div>
          </div>

          {/* Remounts when reduced motion resolves after hydration, so markers start from the right state. */}
          <ol key={reduce ? "still" : "live"}>
            {entries.map((entry, i) => {
              const bar = bars[i];
              const current = i === currentIndex;
              const founder = entry.role === "founder";
              const { kicker, rest } = splitNarrative(entry.narrative);
              return (
                <li key={`${entry.year}-${entry.title}`} className="border-b border-[hsl(var(--border))]">
                  <details open={current} className="group">
                    <summary className={`grid cursor-pointer list-none items-center gap-4 py-5 [&::-webkit-details-marker]:hidden ${ROW}`}>
                      <span className="flex items-start gap-3">
                        <span
                          aria-hidden
                          className="mt-[1.35rem] grid size-4 shrink-0 place-items-center font-mono text-[13px] leading-none text-[hsl(var(--muted-foreground))] transition-transform duration-200 group-open:rotate-45"
                        >
                          +
                        </span>
                        <span className="min-w-0">
                          <span className="mb-1 block font-mono text-[10.5px] tabular-nums tracking-[0.12em] text-[hsl(var(--muted-foreground))]">
                            {formatYears(entry.year)}
                          </span>
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-display text-[1.25rem] leading-tight tracking-[-0.01em] text-[hsl(var(--foreground))]">
                              {entry.title}
                            </span>
                            {current && (
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
                          <Marker bar={bar} head={head} highlighted={current || founder} />
                        ) : (
                          <Clip bar={bar} head={head} current={current} />
                        )}
                        {playhead}
                      </span>
                    </summary>

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
                  </details>
                </li>
              );
            })}
          </ol>
          <div className="pt-4">
            <ResultFooter text={copy.resultRows(entries.length)} />
          </div>
        </div>
      </div>
    </section>
  );
}
