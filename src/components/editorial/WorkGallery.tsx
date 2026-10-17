"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { ProjectData } from "@/lib/portfolio-content";
import { activeSlideIndex } from "@/lib/editorial/scroll";
import { foundersFirst } from "@/lib/editorial/ventures";
import type { EditorialCopy } from "./copy";
import { PIN_QUERY, useMediaQuery } from "./hooks";
import { plateFor, ProjectSlide } from "./ProjectSlide";
import { pad2, ResultFooter, SectionEyebrow, TwoTone } from "./primitives";

interface WorkGalleryProps {
  projects: ProjectData[];
  copy: EditorialCopy;
}

/** The slide's position on the scroll (0..1), as the centre of a window `half` wide either side. */
const around = (index: number, total: number) => (total > 1 ? index / (total - 1) : 0);

/** Washes the pinned stage with the active project's plate colour, a tenth strong. Only opacity changes. */
function Tint({ plate, index, total, progress }: { plate: string; index: number; total: number; progress: MotionValue<number> }) {
  const at = around(index, total);
  const half = total > 1 ? 1 / (total - 1) : 1;
  const opacity = useTransform(progress, [at - half, at, at + half], [0, 1, 0], { clamp: true });
  return <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ opacity, background: `hsl(var(--plate-${plate}) / 0.1)` }} />;
}

/** One slide of the pinned gallery; its plate's ridges draw as it comes to the centre. */
function PinnedSlide({ progress, ...slide }: { progress: MotionValue<number> } & React.ComponentProps<typeof ProjectSlide>) {
  const at = around(slide.index, slide.total);
  const half = slide.total > 1 ? 1 / (slide.total - 1) : 1;
  const ridgeDraw = useTransform(progress, [at - half, at - half * 0.15], [0.12, 1], { clamp: true });
  return <ProjectSlide {...slide} ridgeDraw={ridgeDraw} />;
}

/**
 * Vertical scroll drives a horizontal track. The layout is pure CSS (the
 * `pinned:` variant), so server HTML already has its final height: the wrapper
 * is one viewport plus the track's travel, (N−1) × (slide + gap), and a sticky
 * viewport inside holds the slides while JS only translates the track.
 * Below 768px, on touch, on short screens or with reduced motion it is a
 * plain vertical list.
 */
export function WorkGallery({ projects: contentOrder, copy }: WorkGalleryProps) {
  // What he founded opens the gallery; the rest keep content order.
  const projects = foundersFirst(contentOrder);
  const pinned = useMediaQuery(PIN_QUERY);
  const wrapRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const activeRef = useRef(0);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  const total = projects.length;

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!pinned || !track || !viewport) return;
    const observer = new ResizeObserver(() => setDistance(Math.max(0, track.offsetWidth - viewport.clientWidth)));
    observer.observe(track);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [pinned]);

  const travel = pinned ? distance : 0;
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = activeSlideIndex(p, total);
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActive(next);
    }
  });

  const scrollToSlide = (index: number, behavior: ScrollBehavior) => {
    const wrap = wrapRef.current;
    if (!pinned || !wrap) return;
    const top = wrap.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (total > 1 ? (index / (total - 1)) * travel : 0), behavior });
  };
  // Keyboard focus on a slide that is off to the side: jump to where it sits.
  const bringIntoView = (index: number) => {
    if (index !== activeRef.current) scrollToSlide(index, "instant");
  };

  const geometry = {
    "--n": total,
    "--slide-w": "min(80vw, 72rem)",
    "--gap": "2rem",
  } as CSSProperties;

  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-16">
      <div className="mx-auto max-w-[90rem] px-4 pb-10 pt-[var(--section-y)] sm:px-6 lg:px-10">
        <SectionEyebrow label={copy.work.eyebrow} />
        <TwoTone id="work-title" lead={copy.work.lead(total)} rest={copy.work.rest} className="mt-10 max-w-[22ch]" />
      </div>

      <div
        ref={wrapRef}
        style={geometry}
        className="relative pinned:h-[calc(100vh+(var(--n)-1)*(var(--slide-w)+var(--gap)))]"
      >
        <div
          ref={viewportRef}
          className="pinned:sticky pinned:top-0 pinned:isolate pinned:flex pinned:h-screen pinned:flex-col pinned:overflow-clip pinned:pb-8 pinned:pt-20"
        >
          {pinned &&
            projects.map((project, i) => (
              <Tint key={project.id} plate={plateFor(project.id, i)} index={i} total={total} progress={scrollYProgress} />
            ))}
          {/* Step-sequencer pads: one per project, lit as you pass, playhead below. */}
          <div className="mx-auto mb-6 hidden w-full max-w-[90rem] items-center gap-6 px-6 pinned:flex lg:px-10">
            <div className="relative pb-2.5">
              <ol aria-label={copy.work.progress} className="flex gap-1.5">
                {projects.map((project, i) => (
                  <li key={project.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSlide(i, "smooth")}
                      aria-label={copy.work.pad(i + 1, project.title)}
                      aria-current={i === active ? "step" : undefined}
                      className={`relative h-7 w-10 rounded-[4px] font-mono text-[10.5px] tabular-nums transition-colors ${
                        i === active
                          ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-[0_0_14px_hsl(var(--primary)/0.55)]"
                          : i < active
                            ? "bg-[hsl(var(--foreground)/0.14)] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--foreground)/0.22)]"
                            : "border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--muted-foreground))]"
                      }`}
                    >
                      {pad2(i + 1)}
                    </button>
                  </li>
                ))}
              </ol>
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-[hsl(var(--border))]">
                <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-[hsl(var(--primary))]" />
              </div>
            </div>
            <span className="ml-auto truncate font-mono text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
              {projects[active]?.title}
            </span>
          </div>

          <motion.ol
            ref={trackRef}
            style={{ x }}
            className="mx-auto grid max-w-[90rem] gap-6 px-4 pb-8 sm:px-6 lg:px-10 pinned:mx-0 pinned:flex pinned:min-h-0 pinned:w-max pinned:max-w-none pinned:flex-1 pinned:gap-[var(--gap)] pinned:px-[calc((100%-var(--slide-w))/2)] pinned:pb-0"
          >
            {projects.map((project, i) => (
              <li
                key={project.id}
                onFocusCapture={() => bringIntoView(i)}
                className="pinned:h-full pinned:max-h-[38rem] pinned:w-[var(--slide-w)] pinned:shrink-0 pinned:self-center"
              >
                {pinned ? (
                  <PinnedSlide
                    progress={scrollYProgress}
                    project={project}
                    index={i}
                    total={total}
                    copy={copy}
                    cursorLabel={copy.cursor.scroll}
                    live={i === active}
                  />
                ) : (
                  <ProjectSlide project={project} index={i} total={total} copy={copy} />
                )}
              </li>
            ))}
          </motion.ol>
        </div>
      </div>
      <div className="mx-auto max-w-[90rem] px-4 pt-2 sm:px-6 lg:px-10 pinned:pt-6">
        <ResultFooter text={copy.resultRows(total)} />
      </div>
    </section>
  );
}
