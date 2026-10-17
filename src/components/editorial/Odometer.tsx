"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { odometerCells } from "@/lib/editorial/figures";

/**
 * A figure that rolls digit by digit to its value, like a tape counter, once
 * it is on screen and `live` (the gallery's active slide), settling from the
 * right. Until then it shows its real value, dimmed, so a slide waiting at the
 * side never reads "0". The real value stays in the DOM as text; the rolling
 * strips are CSS (see .odo-digit). Reduced motion: the value, still.
 */
export function Odometer({ value, live = true }: { value: string; live?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const cells = odometerCells(value);
  const digits = cells.filter((cell) => cell.kind === "digit").length;
  const run = inView && live;
  let digit = 0;

  return (
    <span ref={ref} className="odo" data-run={run ? "" : undefined} data-wait={run ? undefined : ""}>
      {cells.map((cell, i) =>
        cell.kind === "digit" ? (
          <span key={i} className="odo-cell odo-digit" style={{ ["--d" as string]: cell.digit, ["--k" as string]: digits - 1 - digit++ } as CSSProperties}>
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
