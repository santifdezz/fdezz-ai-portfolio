/**
 * A scene change between sections: the next section's name, whole and aligned
 * with the page's grid, in large type that drifts a little with the scroll and
 * fills in as it passes the middle, over a hairline that draws itself. Pure CSS
 * scroll timelines, so it costs no JS; where those aren't supported, or under
 * reduced motion, it is a still band (outlined). Decorative.
 */
export function KineticBand({ label, number }: { label: string; number: string }) {
  return (
    <div aria-hidden className="kinetic relative overflow-hidden pt-[calc(var(--section-y)*0.55)]">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10">
        <div className="kinetic-rule h-px origin-left bg-[hsl(var(--primary))]" />
        <div className="kinetic-track flex items-baseline gap-[0.35em] whitespace-nowrap pt-[0.12em] font-display text-[clamp(3rem,10.5vw,9rem)] font-light italic leading-[0.98] tracking-[-0.03em]">
          <span className="font-mono text-[0.1em] not-italic tracking-[0.2em] text-[hsl(var(--primary))]">({number})</span>
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
}
