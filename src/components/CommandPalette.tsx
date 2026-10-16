"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PsqlConsole } from "@/components/console/PsqlConsole";
import type { Locale } from "@/lib/portfolio-content";

interface CommandPaletteProps {
  locale: Locale;
}

// ⌘K opens a psql session on the portfolio itself — the shortcut a technical
// reviewer instinctively tries, answered in a data engineer's own tool. Nobody
// else ever has to open it; the page says everything on its own.
export function CommandPalette({ locale }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === "k";
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Lock page scroll while the console is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    // Outside the landing's wrapper, so it takes the landing palette from here.
    <div className="editorial">
      {/* Discoverable trigger — not everyone tries ⌘K unprompted */}
      <motion.button
        ref={trigger}
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-[6px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.9)] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))] backdrop-blur-sm transition-colors hover:border-[hsl(var(--primary)/0.6)] hover:text-[hsl(var(--foreground))]"
        aria-label={locale === "es" ? "Abrir consola SQL (⌘K)" : "Open SQL console (⌘K)"}
      >
        <span aria-hidden className="size-[7px] rounded-[2px] bg-[hsl(var(--primary))] shadow-[0_0_10px_hsl(var(--primary)/0.85)]" />
        psql
        <kbd className="hidden rounded-[3px] border border-[hsl(var(--border))] px-1.5 py-0.5 font-mono text-[10px] normal-case tracking-normal text-[hsl(var(--primary))] [@media(hover:hover)]:inline">⌘K</kbd>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end bg-[hsl(var(--background)/0.72)] p-2 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={locale === "es" ? "Consola SQL del portfolio" : "Portfolio SQL console"}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="h-[min(40rem,calc(100svh-4rem))] w-full sm:max-w-4xl"
            >
              <PsqlConsole locale={locale} onQuit={close} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
