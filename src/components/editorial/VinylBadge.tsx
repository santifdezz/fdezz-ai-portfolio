"use client";

import { ArrowDownRight } from "lucide-react";

const RING = 37;
const RING_LENGTH = 2 * Math.PI * RING;

interface VinylBadgeProps {
  href: string;
  ring: string;
  label: string;
  cursorLabel: string;
}

/**
 * The contact call-to-action as a record — Makineo is an electronic-music
 * platform. Grooves and label turn slowly; the light on the vinyl and the
 * button in the middle stay put. Hover or focus brakes it to a stop like a
 * platter, and letting go spins it back up (see useTransport).
 */
export function VinylBadge({ href, ring, label, cursorLabel }: VinylBadgeProps) {
  return (
    <a
      data-brake
      href={href}
      aria-label={label}
      data-cursor={cursorLabel}
      className="vinyl group relative block size-[7rem] shrink-0 rounded-full sm:size-[8.5rem]"
    >
      <span aria-hidden data-loop className="vinyl-spin absolute inset-0 rounded-full">
        <span className="absolute inset-[22%] rounded-full bg-[hsl(var(--primary))]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
            <defs>
              <path id="vinyl-label-ring" d={`M50,50 m-${RING},0 a${RING},${RING} 0 1,1 ${RING * 2},0 a${RING},${RING} 0 1,1 -${RING * 2},0`} />
            </defs>
            <text className="fill-[hsl(var(--primary-foreground))] font-mono text-[11.5px] uppercase">
              <textPath href="#vinyl-label-ring" textLength={RING_LENGTH - 1} lengthAdjust="spacing">
                {`${ring} · `.toUpperCase()}
              </textPath>
            </text>
          </svg>
        </span>
      </span>
      <span aria-hidden className="vinyl-sheen pointer-events-none absolute inset-0 rounded-full" />
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[hsl(var(--background))] text-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary-foreground)/0.3)] transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110"
      >
        <ArrowDownRight className="size-4" strokeWidth={2} />
      </span>
    </a>
  );
}
