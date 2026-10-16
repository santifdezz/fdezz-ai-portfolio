"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { odometerCells } from "@/lib/editorial/figures";

/**
 * A figure that rolls digit by digit to its value, like a tape counter, once
 * it is on screen and `live` (the gallery's active slide). The real value
 * stays in the DOM as text; the rolling strips are CSS (see .odo-digit).
 * Reduced motion: the value, still.
 */
export function Odometer({ value, live = true }: { value: string; live?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  let digit = 0;

  return (
    <span ref={ref} className="odo" data-run={inView && live ? "" : undefined}>
      {odometerCells(value).map((cell, i) =>
        cell.kind === "digit" ? (
          <span key={i} className="odo-cell odo-digit" style={{ ["--d" as string]: cell.digit, ["--k" as string]: digit++ } as CSSProperties}>
            {cell.digit}
          </span>
        ) : (
          <span key={i} className="odo-cell">
            {cell.text}
          </span>
        ),
      )}
    </span>
  );
}
