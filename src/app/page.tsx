"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Terminal from "@/components/terminal/Terminal";
import { NeuralBackground } from "@/components/background/NeuralBackground";
import { LandingPage } from "@/components/LandingPage";
import type { Locale } from "@/lib/terminalTypes";

export default function Home() {
  const [stage, setStage] = useState<"landing" | "terminal">("landing");
  const [startTour, setStartTour] = useState(false);
  const [locale, setLocale] = useState<Locale>("es");

  const goExplore = () => setStage("terminal");
  const goTour = () => { setStartTour(true); setStage("terminal"); };

  return (
    <main className="relative w-full h-screen bg-[hsl(var(--background))] overflow-hidden">
      <NeuralBackground />
      <AnimatePresence mode="wait">
        {stage === "landing" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <LandingPage
              locale={locale}
              onExplore={goExplore}
              onTour={goTour}
              onLocaleChange={setLocale}
            />
          </motion.div>
        ) : (
          <motion.div
            key="terminal"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Terminal initialLocale={locale} autoStartTour={startTour} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
