import type { CSSProperties } from "react";

/**
 * A scene change between sections: the next section's name in giant outlined
 * type that crosses the screen with the scroll, filling in as it passes the
 * middle, over a hairline that draws itself. Pure CSS scroll timelines, so it
 * costs no JS; where those aren't supported, or under reduced motion, it is a
 * still band. Decorative.
 */
export function KineticBand({ label, number }: { label: string; number: string }) {
  const words = Array.from({ length: 3 }, () => label);
  return (
    <div aria-hidden className="kinetic relative overflow-hidden pt-[var(--section-y)]">
      <div className="kinetic-rule mx-auto h-px w-[calc(100%-2rem)] max-w-[90rem] origin-left bg-[hsl(var(--primary))] sm:w-[calc(100%-3rem)] lg:w-[calc(100%-5rem)]" />
      <div className="kinetic-track flex w-max items-baseline gap-[0.5em] pt-[0.14em] whitespace-nowrap font-display text-[clamp(5rem,19vw,17rem)] font-light italic leading-[0.95] tracking-[-0.03em]">
        <span className="font-mono text-[0.1em] not-italic tracking-[0.2em] text-[hsl(var(--primary))]">({number})</span>
        {words.map((w, i) => (
          <span key={i} className="kinetic-word" style={{ ["--w" as string]: i } as CSSProperties}>
            {w}
            <span className="px-[0.35em] text-[hsl(var(--primary))] not-italic">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
