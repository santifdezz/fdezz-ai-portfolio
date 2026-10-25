import Link from "next/link";
import { ArrowUpRight, BookOpen, Github, Globe } from "lucide-react";
import type { MotionValue } from "framer-motion";
import type { ProjectData } from "@/lib/portfolio-content";
import { getProjectFigures, isCompactFigure } from "@/lib/editorial/figures";
import { getTechColor } from "@/lib/techColors";
import type { EditorialCopy } from "./copy";
import { LiveRidges } from "./LiveRidges";
import { Odometer } from "./Odometer";
import { pad2 } from "./primitives";
import { RidgeLines } from "./RidgeLines";

type Plate = "violet" | "rave" | "oxblood" | "bottle" | "petrol" | "umber";

const PLATE_BY_PROJECT: Record<string, Plate> = {
  makineo: "violet",
  "ufc-data": "rave",
};
const PLATE_ROTATION: Plate[] = ["rave", "oxblood", "bottle", "petrol", "umber"];

export const plateFor = (projectId: string, index: number): Plate => PLATE_BY_PROJECT[projectId] ?? PLATE_ROTATION[index % PLATE_ROTATION.length];

interface ProjectSlideProps {
  project: ProjectData;
  index: number;
  total: number;
  copy: EditorialCopy;
  /** Custom-cursor label for the plate; only set while the gallery is pinned. */
  cursorLabel?: string;
  /** False while another slide is the pinned gallery's active one; its figure waits to roll. */
  live?: boolean;
  /** Pinned gallery only: draws the plate's ridges as the slide arrives. */
  ridgeDraw?: MotionValue<number>;
}

const MAX_SIDE_FIGURES = 2;

/**
 * One project: a cloth-coloured plate carrying its own number, beside the
 * facts. The plate is a slice of the hero's signal field; its headline figure
 * rolls in like a counter, with the project's other short figures under it.
 */
export function ProjectSlide({ project, index, total, copy, cursorLabel, live, ridgeDraw }: ProjectSlideProps) {
  const plate = plateFor(project.id, index);
  const [figure, ...others] = getProjectFigures(project);
  const sideFigures = others.filter(isCompactFigure).slice(0, MAX_SIDE_FIGURES);
  const titleId = `project-${project.id}`;
  const site = project.links.demo ? { href: project.links.demo, host: new URL(project.links.demo).host } : null;

  return (
    <article
      aria-labelledby={titleId}
      className="grid overflow-hidden rounded-[1.5rem] border border-[hsl(var(--border))] bg-[hsl(var(--card))] md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] pinned:h-full"
    >
      <div
        data-cursor={cursorLabel}
        className="relative isolate flex min-h-[16rem] flex-col justify-between gap-10 overflow-hidden p-6 sm:min-h-[22rem] sm:p-8 pinned:min-h-0"
        style={{ background: `hsl(var(--plate-${plate}))`, color: `hsl(var(--plate-${plate}-ink))` }}
      >
        {ridgeDraw ? (
          <LiveRidges ground={`hsl(var(--plate-${plate}))`} draw={ridgeDraw} className="absolute inset-x-0 top-[14%] -z-10 h-[62%] w-full opacity-[0.13]" />
        ) : (
          <RidgeLines ground={`hsl(var(--plate-${plate}))`} className="absolute inset-x-0 top-[14%] -z-10 h-[62%] w-full opacity-[0.13]" />
        )}
        <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.2em]">
          <span className="tabular-nums">
            {pad2(index + 1)}
            <span className="opacity-60 pinned:hidden"> / {pad2(total)}</span>
          </span>
          <span className="opacity-80">({copy.work.status[project.status]})</span>
        </div>

        {figure ? (
          <figure>
            {figure.pre && <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.2em] opacity-80">({figure.pre})</p>}
            <p className="pl-[0.06em] font-display text-[clamp(4.25rem,22vw,8.5rem)] font-light italic leading-[0.82] tracking-[-0.045em] [font-variant-numeric:lining-nums_proportional-nums] pinned:text-[clamp(4.5rem,10.5vw,10rem)]">
              <Odometer value={figure.value} live={live} />
            </p>
            <figcaption className="mt-3 max-w-[18ch] font-display text-[clamp(1.15rem,1.7vw,1.6rem)] italic leading-tight">
              {figure.label}
            </figcaption>
            {sideFigures.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-current/20 pt-3 font-mono text-[11px] uppercase tracking-[0.14em]">
                {sideFigures.map((f) => (
                  <li key={f.value}>
                    <span className="tabular-nums">{f.value}</span> <span className="opacity-75">{f.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </figure>
        ) : (
          <p className="font-display text-[clamp(4.5rem,10vw,9rem)] font-light italic leading-none">{pad2(index + 1)}</p>
        )}
      </div>

      <div className="flex min-h-0 flex-col p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h3 id={titleId} className="font-display text-[clamp(1.75rem,2.5vw,2.6rem)] font-normal leading-[1.02] tracking-[-0.02em]">
            {project.title}
          </h3>
          {project.role === "founder" && (
            <span className="rounded-full bg-[hsl(var(--primary))] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--primary-foreground))]">
              {copy.roles.founder}
            </span>
          )}
        </div>
        <p className="mt-4 max-w-[60ch] font-ui text-[15px] leading-relaxed text-[hsl(var(--foreground)/0.72)] lg:text-base">{project.description}</p>

        <ul className="mt-6 space-y-2.5">
          {project.features.map((f) => (
            <li key={f} className="flex gap-3 font-mono text-[12px] leading-snug text-[hsl(var(--foreground)/0.9)]">
              <span aria-hidden className="text-[hsl(var(--primary))]">→</span>
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-6 gap-y-5 pt-8">
          <ul className="flex flex-wrap gap-1.5">
            {project.technologies.map((t) => (
              <li key={t} className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${getTechColor(t)}`}>
                {t}
              </li>
            ))}
          </ul>
          <span className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-3">
            {site && (
              <a
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor={`${site.host} ↗`}
                className="group inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-85"
              >
                <Globe aria-hidden className="size-3.5" />
                {copy.work.visit(site.host)}
                <ArrowUpRight aria-hidden className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
            {project.links.caseStudy && (
              <Link
                href={project.links.caseStudy}
                data-cursor={copy.work.caseStudy}
                className="group inline-flex shrink-0 items-center gap-2 border-b border-[hsl(var(--foreground)/0.3)] pb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--foreground))] transition-colors hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                <BookOpen aria-hidden className="size-3.5" />
                {copy.work.caseStudy}
                <ArrowUpRight aria-hidden className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor={copy.cursor.repo}
                className="group inline-flex shrink-0 items-center gap-2 border-b border-[hsl(var(--foreground)/0.3)] pb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--foreground))] transition-colors hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                <Github aria-hidden className="size-3.5" />
                {copy.work.repo}
                <ArrowUpRight aria-hidden className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
          </span>
        </div>
      </div>
    </article>
  );
}
