"use client";

import { useState, useEffect, useCallback } from "react";
import { EditorialPage } from "@/components/editorial/EditorialPage";
import { CommandPalette } from "@/components/CommandPalette";
import type { Locale } from "@/lib/portfolio-content";

const LOCALE_KEY = "fdezz-portfolio-lang";

export default function Home() {
  // Default matches the SSR-rendered <html lang="es"> in layout.tsx; corrected
  // after mount from whatever the visitor last chose (shared with the ⌘K
  // palette's own Terminal instance via the same localStorage key).
  const [locale, setLocale] = useState<Locale>("es");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCALE_KEY) as Locale | null;
      // Reading localStorage can't happen during the lazy useState
      // initializer without breaking SSR hydration — same one-time
      // post-mount sync as Terminal's own useLocalStorage hook.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored === "en" || stored === "es") setLocale(stored);
    } catch {
      // localStorage unavailable — fall back to the SSR default
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const handleLocaleChange = useCallback((l: Locale) => {
    setLocale(l);
    try {
      localStorage.setItem(LOCALE_KEY, l);
    } catch {
      // ignore — per-viewer convenience only
    }
  }, []);

  return (
    <>
      <EditorialPage locale={locale} onLocaleChange={handleLocaleChange} />
      <CommandPalette locale={locale} />
    </>
  );
}
