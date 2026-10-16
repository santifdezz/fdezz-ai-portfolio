"use client";

import { useRef } from "react";
import type { ProjectData } from "@/lib/portfolio-content";
import { getProjectFigures, isCompactFigure } from "@/lib/editorial/figures";
import { useTurntable } from "./hooks";
import { RegistrationMark } from "./primitives";

/**
 * A ticker along the hero's bottom edge carrying every number each project
 * quotes (its headline figure plus the ones short enough to stand alone),
 * each under its project's name. It runs like a platter: scrolling nudges its
 * speed and hovering brakes it. Decorative here (the gallery shows the same
 * figures in full), so it is hidden from assistive tech. Its right end fades
 * out before the fixed ⌘K button.
 */
export function MetricsTicker({ projects }: { projects: readonly ProjectData[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useTurntable(ref, { pitch: true });

  const figures = projects.flatMap((p) =>
    getProjectFigures(p)
      .filter((f, i) => i === 0 || isCompactFigure(f))
      .map((f) => ({ id: p.id, title: p.title, ...f })),
  );
  const repeats = Math.max(2, Math.ceil(8 / Math.max(1, figures.length)));
  const run = Array.from({ length: repeats }, () => figures).flat();

  return (
    <div
      ref={ref}
      aria-hidden
      className="enter relative overflow-hidden border-y border-[hsl(var(--border))] py-3 [mask-image:linear-gradient(90deg,transparent,black_6%,black_calc(100%-11rem),transparent_calc(100%-7.5rem))]"
      style={{ ["--d" as string]: "900ms" }}
    >
      <div className="marquee-track flex w-max">
        {[0, 1].map((half) => (
          <ul key={half} className="flex shrink-0 items-center">
            {run.map((f, i) => (
              <li key={`${half}-${i}-${f.id}-${f.value}`} className="flex items-baseline gap-3">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">{f.title}</span>
                {f.pre && <span className="font-display text-[1.05rem] italic text-[hsl(var(--muted-foreground))]">{f.pre}</span>}
                <span className="font-display text-[1.9rem] font-light italic leading-none text-[hsl(var(--foreground))]">{f.value}</span>
                <span className="font-display text-[1.05rem] italic text-[hsl(var(--muted-foreground))]">{f.label}</span>
                <RegistrationMark className="mx-8 size-3 self-center text-[hsl(var(--primary))]" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
