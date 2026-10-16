"use client";

import { Fragment, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { annotateEntities, type EntityGroup } from "@/lib/editorial/entities";
import { revealWindow } from "@/lib/editorial/scroll";
import { REDUCED_MOTION_QUERY, useMediaQuery } from "./hooks";
import { SectionEyebrow } from "./primitives";

interface PointRevealProps {
  eyebrow: string;
  paragraph: string;
  groups: readonly EntityGroup[];
  entitiesLabel: (found: number, total: number) => string;
}

// Concrete colours: Framer interpolates values, not CSS variables.
// Mirrors the .editorial palette in globals.css.
const TEXT = "hsl(0, 0%, 94%)";
const MUTED = "hsl(220, 9%, 45%)";
const SIGNAL = "hsl(73, 100%, 50%)";

function Entity({ text, tag, progress, window }: { text: string; tag: string; progress?: MotionValue<number>; window: [number, number] }) {
  const settled = useMotionValue(1);
  const shown = useTransform(progress ?? settled, window, [0, 1]);
  const color = useTransform(shown, [0, 1], [TEXT, SIGNAL]);
  // The tag always holds its place (no reflow while scrolling); it lights up with its box.
  const tagColor = useTransform(shown, [0, 1], [MUTED, SIGNAL]);
  return (
    <span className="relative whitespace-nowrap">
      <motion.span
        aria-hidden
        style={{ opacity: shown, scaleX: shown }}
        className="entity-box absolute -inset-x-[0.14em] inset-y-[0.04em] origin-left rounded-[0.16em] border border-[hsl(var(--signal)/0.55)] bg-[hsl(var(--signal)/0.07)]"
      />
      <motion.span style={{ color }} className="relative">
        {text}
      </motion.span>
      <motion.span
        style={{ color: tagColor }}
        className="relative ml-[0.3em] align-[0.42em] font-mono text-[10px] font-normal not-italic uppercase tracking-[0.16em]"
      >
        {tag}
      </motion.span>
    </span>
  );
}

/**
 * One real paragraph from the bio, read by a small named-entity pass: as it
 * scrolls through, every skill it names is boxed and tagged with its group.
 */
export function PointReveal({ eyebrow, paragraph, groups, entitiesLabel }: PointRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useMediaQuery(REDUCED_MOTION_QUERY);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.45"] });
  const tokens = annotateEntities(paragraph, groups);
  // Each entity's place among the entities, for its slice of the scroll.
  const order = tokens.reduce<number[]>(
    (acc, t) => [...acc, t.kind === "entity" ? acc.filter((n) => n >= 0).length : -1],
    [],
  );
  const total = order.filter((n) => n >= 0).length;
  const windows = Array.from({ length: total }, (_, k) => revealWindow(k, total, 1));

  const [found, setFound] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setFound(windows.filter(([start, end]) => p >= (start + end) / 2).length);
  });

  return (
    <section id="point" aria-label={eyebrow} className="scroll-mt-16">
      <div className="mx-auto max-w-[90rem] px-4 pt-[var(--section-y)] sm:px-6 lg:px-10">
        <SectionEyebrow
          label={eyebrow}
          meta={
            <span aria-hidden>
              ner(about.bio) <span className="text-[hsl(var(--primary))]">→</span> {entitiesLabel(reduce ? total : found, total)}
            </span>
          }
        />
        <p
          ref={ref}
          className="mt-14 max-w-[32ch] font-display font-normal leading-[1.2] tracking-[-0.015em] text-[clamp(1.85rem,4.2vw,3.9rem)] text-[hsl(var(--foreground))]"
        >
          {tokens.map((token, i) => {
            if (token.kind === "text") return <Fragment key={i}>{token.text}</Fragment>;
            return (
              <Entity key={i} text={token.text} tag={token.tag} window={windows[order[i]]} progress={reduce ? undefined : scrollYProgress} />
            );
          })}
        </p>
      </div>
    </section>
  );
}
