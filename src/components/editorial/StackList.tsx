"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { getTechColor } from "@/lib/techColors";
import type { EditorialCopy } from "./copy";
import { pad2, Reveal, ResultFooter, SectionEyebrow, TwoTone } from "./primitives";

interface StackListProps {
  skills: Record<string, string[]>;
  copy: EditorialCopy;
}

/**
 * A channel's level: one segment per skill against the fullest channel's
 * scale. Segments light in order when the strip comes into view; the top lit
 * one is the peak-hold, in the second accent.
 */
function LevelMeter({ level, scale }: { level: number; scale: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const on = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <span ref={ref} aria-hidden className="flex h-2.5 w-full max-w-[15rem] gap-[3px]">
      {Array.from({ length: scale }, (_, s) => {
        const lit = on && s < level;
        const peak = s === level - 1;
        return (
          <span
            key={s}
            className={`meter-seg flex-1 rounded-[1px] ${
              !lit
                ? "bg-[hsl(var(--foreground)/0.07)]"
                : peak
                  ? "bg-[hsl(var(--signal))] shadow-[0_0_8px_hsl(var(--signal)/0.7)]"
                  : "bg-[hsl(var(--primary))]"
            }`}
            style={{ ["--s" as string]: s } as CSSProperties}
          />
        );
      })}
    </span>
  );
}

/** The stack as a mixing desk: one channel strip per group, its level the number of skills in it. */
export function StackList({ skills, copy }: StackListProps) {
  const groups = Object.entries(skills);
  const total = groups.reduce((sum, [, items]) => sum + items.length, 0);
  const scale = Math.max(1, ...groups.map(([, items]) => items.length));

  return (
    <section id="stack" aria-labelledby="stack-title" className="scroll-mt-16">
      <div className="mx-auto max-w-[90rem] px-4 py-[var(--section-y)] sm:px-6 lg:px-10">
        <SectionEyebrow label={copy.stack.eyebrow} meta={copy.stack.meta(total, groups.length)} />
        <TwoTone id="stack-title" lead={copy.stack.lead} rest={copy.stack.rest} className="mt-10 max-w-[22ch]" />

        <dl className="mt-16 border-t border-[hsl(var(--border))]">
          {groups.map(([group, items], i) => (
            <Reveal
              key={group}
              delay={0.04 * i}
              className="grid gap-4 border-b border-[hsl(var(--border))] py-7 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-14"
            >
              <dt className="flex flex-col gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">CH {pad2(i + 1)}</span>
                <span className="flex items-baseline gap-3">
                  <span className="font-display text-[1.6rem] font-normal leading-none tracking-[-0.01em]">{group}</span>
                  <span className="font-mono text-[11px] tabular-nums text-[hsl(var(--muted-foreground))]">({pad2(items.length)})</span>
                </span>
                <LevelMeter level={items.length} scale={scale} />
              </dt>
              <dd className="md:self-end">
                <ul className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <li key={item} className={`rounded-full border px-3 py-1 font-mono text-[12px] ${getTechColor(item)}`}>
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </Reveal>
          ))}
        </dl>
        <div className="pt-4">
          <ResultFooter text={copy.resultRows(total)} />
        </div>
      </div>
    </section>
  );
}
