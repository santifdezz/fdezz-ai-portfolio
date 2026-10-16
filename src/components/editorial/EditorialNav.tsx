"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/portfolio-content";
import { SECTION_IDS, type EditorialCopy } from "./copy";
import { useReadingPosition, useScrolledPast } from "./hooks";

interface EditorialNavProps {
  copy: EditorialCopy;
  locale: Locale;
  onLocaleChange: (l: Locale) => void;
}

const LED = {
  done: "bg-[hsl(var(--foreground)/0.55)]",
  active: "bg-[hsl(var(--primary))] shadow-[0_0_10px_hsl(var(--primary)/0.85)]",
  queued: "border border-[hsl(var(--muted-foreground)/0.6)]",
};

/**
 * Section navigation as a step sequencer: one step per section, an LED that
 * lights for the section being read, and a playhead that sweeps across each
 * step while you read it. Steps share one width so the playhead lines up.
 */
export function EditorialNav({ copy, locale, onLocaleChange }: EditorialNavProps) {
  const { active, playhead } = useReadingPosition(SECTION_IDS);
  const activeIndex = SECTION_IDS.findIndex((id) => id === active);
  const scrolled = useScrolledPast(8);
  const listRef = useRef<HTMLDivElement>(null);

  // On narrow screens the strip scrolls sideways; keep the active step in it.
  useEffect(() => {
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>("[aria-current]");
    if (!list || !item || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 border-b transition-[background-color,border-color] duration-300 ${
        scrolled
          ? "border-[hsl(var(--border)/0.7)] bg-[hsl(var(--background)/0.82)] backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-3 px-4 sm:px-6 lg:px-10">
        <a href="#top" className="shrink-0 font-display text-[1.05rem] leading-none tracking-[-0.01em] text-[hsl(var(--foreground))]">
          <span className="hidden md:inline">
            Santiago <span className="italic text-[hsl(var(--muted-foreground))]">Fernández</span>
          </span>
          <span className="md:hidden">
            S<span className="italic text-[hsl(var(--muted-foreground))]">F</span>
          </span>
        </a>

        <nav aria-label={copy.nav.label} className="mx-auto min-w-0">
          <div
            ref={listRef}
            className="no-scrollbar overflow-x-auto max-md:[mask-image:linear-gradient(90deg,transparent,black_14px,black_calc(100%-14px),transparent)]"
          >
            <div className="relative w-max min-w-full pb-1.5">
              <ul className="grid auto-cols-[minmax(6.75rem,1fr)] grid-flow-col">
                {SECTION_IDS.map((id, i) => {
                  const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "queued";
                  return (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        aria-current={state === "active" ? "location" : undefined}
                        className={`flex items-center justify-center gap-2 px-2.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors ${
                          state === "active"
                            ? "text-[hsl(var(--foreground))]"
                            : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                        }`}
                      >
                        {/* Keyed on state so the LED remounts and fires its hit when its step goes active. */}
                        <span
                          key={state}
                          aria-hidden
                          className={`size-[7px] shrink-0 rounded-[2px] transition-[background-color,box-shadow] duration-300 ${LED[state]} ${
                            state === "active" ? "led-hit" : ""
                          }`}
                        />
                        {copy.nav.items[id]}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div aria-hidden className="absolute inset-x-2.5 bottom-0 h-px bg-[hsl(var(--border))]">
                <motion.div style={{ scaleX: playhead }} className="h-full origin-left bg-[hsl(var(--primary))]" />
              </div>
            </div>
          </div>
        </nav>

        <div
          role="group"
          aria-label={copy.nav.language}
          className="flex shrink-0 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--background)/0.72)] p-1 backdrop-blur-md"
        >
          {(["es", "en"] as Locale[]).map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={locale === l}
              onClick={() => onLocaleChange(l)}
              className={`rounded-full px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors ${
                locale === l
                  ? "bg-[hsl(var(--foreground))] text-[hsl(var(--background))]"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
