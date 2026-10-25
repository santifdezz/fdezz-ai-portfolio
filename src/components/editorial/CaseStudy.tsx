"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/portfolio-content";
import { MAKINEO_CASE } from "./makineo-case";

const LOCALE_KEY = "fdezz-portfolio-lang";

/**
 * A page for work whose code is private: what it is, how it is built and what
 * state it is in, with no code and nothing about its security internals.
 * Shares the language choice with the home page.
 */
export function CaseStudy() {
  const [locale, setLocale] = useState<Locale>("es");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCALE_KEY);
      // Post-mount sync, same as the home page: localStorage can't be read during SSR.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored === "en" || stored === "es") setLocale(stored);
    } catch {
      // storage unavailable: keep the SSR default
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const choose = useCallback((l: Locale) => {
    setLocale(l);
    try {
      localStorage.setItem(LOCALE_KEY, l);
    } catch {
      // per-viewer convenience only
    }
  }, []);

  const copy = MAKINEO_CASE[locale];

  return (
    <div className="editorial min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <header className="mx-auto flex max-w-[64rem] items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-10">
        <Link href="/" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]">
          <ArrowLeft aria-hidden className="size-3.5" />
          {copy.back}
        </Link>
        <div role="group" aria-label="Language" className="flex shrink-0 rounded-full border border-[hsl(var(--border))] p-1">
          {(["es", "en"] as Locale[]).map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={locale === l}
              onClick={() => choose(l)}
              className={`rounded-full px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors ${
                locale === l ? "bg-[hsl(var(--foreground))] text-[hsl(var(--background))]" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-[64rem] px-4 pb-24 pt-10 sm:px-6 lg:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--primary))]">({copy.eyebrow})</p>
        <h1 className="mt-6 font-display text-[clamp(2.4rem,6vw,5rem)] font-normal leading-[1.02] tracking-[-0.025em] text-balance">
          {copy.lead} <span className="font-light italic text-[hsl(var(--muted-foreground))]">{copy.rest}</span>
        </h1>
        <p className="mt-8 max-w-[62ch] font-ui text-lg leading-relaxed text-[hsl(var(--foreground)/0.82)]">{copy.intro}</p>

        <figure className="mt-14" role="img" aria-label={copy.diagramLabel}>
          <ol className="grid gap-px overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--border))]">
            {copy.tiers.map((tier) => (
              <li key={tier.label} className="grid gap-3 bg-[hsl(var(--card))] p-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center sm:p-5">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">{tier.label}</span>
                <span className="flex flex-wrap gap-2">
                  {tier.items.map((item) => (
                    <span key={item} className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-1.5 font-mono text-[12px]">
                      {item}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ol>
        </figure>

        <div className="mt-14 space-y-12">
          {copy.sections.map((section) => (
            <section key={section.title} className="grid gap-4 border-t border-[hsl(var(--border))] pt-6 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--primary))]">{section.title}</h2>
              <div className="space-y-4">
                {section.body.map((p) => (
                  <p key={p} className="max-w-[62ch] font-ui text-[16px] leading-relaxed text-[hsl(var(--foreground)/0.8)]">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12 grid gap-4 border-t border-[hsl(var(--border))] pt-6 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--primary))]">{copy.stackTitle}</h2>
          <ul className="flex flex-wrap gap-2">
            {copy.stack.map((s) => (
              <li key={s} className="rounded-full border border-[hsl(var(--border))] px-3 py-1 font-mono text-[11.5px] text-[hsl(var(--foreground)/0.85)]">
                {s}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16 flex flex-wrap gap-3">
          <a
            href="https://makineo.es"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 font-ui text-[0.9375rem] font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90"
          >
            {copy.visit}
            <ArrowUpRight aria-hidden className="size-4" />
          </a>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-5 py-3 font-ui text-[0.9375rem] font-medium transition-colors hover:bg-[hsl(var(--foreground)/0.06)]"
          >
            {copy.contact}
          </Link>
        </div>
      </main>
    </div>
  );
}
