"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useClipboard } from "./hooks";
import type { EditorialCopy } from "./copy";
import { SignalRule } from "./SignalRule";

export const EASE = [0.2, 0.75, 0.1, 1] as const;

export const pad2 = (n: number) => String(n).padStart(2, "0");

const IN_VIEW = { once: true, margin: "0px 0px -12% 0px" } as const;

/**
 * "(LABEL) ──╱╲── meta" — the eyebrow that opens each section. Its rule is a
 * ridge of the hero's signal field: a pulse runs along it and settles flat.
 * On narrow screens the meta drops to its own line instead of crushing the rule.
 */
export function SectionEyebrow({ label, meta, tone = "ground" }: { label: string; meta?: ReactNode; tone?: "ground" | "accent" }) {
  const onAccent = tone === "accent";
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em]">
      <span className={`whitespace-nowrap ${onAccent ? "text-[hsl(var(--primary-foreground))]" : "text-[hsl(var(--primary))]"}`}>({label})</span>
      <SignalRule tone={tone} />
      {meta != null && (
        <span className={`tabular-nums max-sm:basis-full ${onAccent ? "text-[hsl(var(--primary-foreground)/0.8)]" : "text-[hsl(var(--muted-foreground))]"}`}>
          {meta}
        </span>
      )}
    </div>
  );
}

/** psql's footer under a result — "(6 rows)" — closing a section. Counted from content. */
export function ResultFooter({ text, tone = "ground" }: { text: string; tone?: "ground" | "accent" }) {
  return (
    <p
      aria-hidden
      className={`font-mono text-[11px] tabular-nums tracking-[0.08em] ${
        tone === "accent" ? "text-[hsl(var(--primary-foreground)/0.7)]" : "text-[hsl(var(--muted-foreground))]"
      }`}
    >
      {text}
    </p>
  );
}

/** Two-tone display headline: roman lead, grey italic continuation. */
export function TwoTone({ id, lead, rest, className = "" }: { id?: string; lead: string; rest: string; className?: string }) {
  return (
    <h2
      id={id}
      className={`font-display font-normal tracking-[-0.02em] leading-[1.02] text-[clamp(2.25rem,5vw,4.5rem)] text-balance ${className}`}
    >
      {lead} <span className="italic font-light text-[hsl(var(--muted-foreground))]">{rest}</span>
    </h2>
  );
}

const SCAN_HIDDEN = { ["--scan" as string]: "0%", ["--scan-o" as string]: 1 };
const SCAN_SHOWN = { ["--scan" as string]: "100%", ["--scan-o" as string]: 0 };

/**
 * Scanline reveal on first view: a 1px accent line drops down the block and
 * uncovers it, like a plot being redrawn. Reduced motion: rendered resolved
 * (see globals.css).
 */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      data-reveal
      className={`scan-reveal ${className}`}
      initial={SCAN_HIDDEN}
      whileInView={SCAN_SHOWN}
      viewport={IN_VIEW}
      transition={{
        ["--scan" as string]: { duration: 0.45, ease: EASE, delay },
        ["--scan-o" as string]: { duration: 0.2, ease: "easeOut", delay: delay + 0.42 },
      }}
    >
      {children}
    </motion.div>
  );
}

export function CopyButton({
  text,
  labels,
  tone = "ground",
  compact = false,
}: {
  text: string;
  labels: EditorialCopy["clipboard"];
  tone?: "ground" | "accent";
  /** Icon only; the label stays available to assistive tech. */
  compact?: boolean;
}) {
  const { state, copy } = useClipboard();
  const label = state === "copied" ? labels.copied : state === "failed" ? labels.failed : labels.copy;
  const styles =
    tone === "accent"
      ? "border-[hsl(var(--primary-foreground)/0.4)] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-foreground))] hover:text-[hsl(var(--primary))]"
      : "border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary)/0.6)] hover:text-[hsl(var(--primary))]";
  return (
    <>
      <button
        type="button"
        onClick={() => copy(text)}
        title={compact ? label : undefined}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
          compact ? "p-1.5" : "px-3 py-1.5"
        } ${styles}`}
      >
        {state === "copied" ? <Check aria-hidden className="size-3.5" /> : <Copy aria-hidden className="size-3.5" />}
        <span className={compact ? "sr-only" : undefined}>{label}</span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {state === "copied" ? labels.copied : state === "failed" ? labels.failedHint : ""}
      </span>
    </>
  );
}

/** A print registration mark, used as the marquee separator. */
export function RegistrationMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="6" cy="6" r="3.25" />
      <path d="M6 0v12M0 6h12" />
    </svg>
  );
}
