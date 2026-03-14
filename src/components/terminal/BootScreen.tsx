"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/terminalTypes";

interface BootScreenProps {
  locale: Locale;
  onComplete: () => void;
}

const DOCKER_LOGS = [
  "$ docker run --rm -it fdezz/ai-portfolio:latest",
  "",
  "[2026-03-14 16:46:13] Starting AI Terminal Portfolio v1.0.0",
  "[2026-03-14 16:46:13] Environment: production",
  "[2026-03-14 16:46:14] Loading modules...",
  "[2026-03-14 16:46:14]   ✓ TypeScript engine",
  "[2026-03-14 16:46:15]   ✓ React framework",
  "[2026-03-14 16:46:15]   ✓ Next.js runtime",
  "[2026-03-14 16:46:16]   ✓ AI command handler",
  "[2026-03-14 16:46:17] Initializing interfaces...",
  "[2026-03-14 16:46:17]   ✓ Chat UI",
  "[2026-03-14 16:46:18]   ✓ Sidebar history",
  "[2026-03-14 16:46:18]   ✓ Message pipeline",
  "[2026-03-14 16:46:19] Building portfolio content...",
  "[2026-03-14 16:46:20]   ✓ Projects (3)",
  "[2026-03-14 16:46:20]   ✓ Skills matrix",
  "[2026-03-14 16:46:21]   ✓ Contact data",
  "[2026-03-14 16:46:21] Establishing i18n layer...",
  "[2026-03-14 16:46:21]   ✓ English",
  "[2026-03-14 16:46:21]   ✓ Spanish",
  "[2026-03-14 16:46:22] Server ready on http://localhost:3000",
  "",
  "Welcome to fdezz's AI Terminal",
];

export function BootScreen({ locale, onComplete }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isRepeatVisit = sessionStorage.getItem("booted");
      if (isRepeatVisit) {
        onComplete();
        return;
      }
    }

    let idx = 0;
    const timer = setInterval(() => {
      if (idx < DOCKER_LOGS.length) {
        setVisibleLines((prev) => [...prev, DOCKER_LOGS[idx]]);
        idx++;
      } else {
        clearInterval(timer);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("booted", "true");
        }
        setTimeout(onComplete, 800);
      }
    }, 120);

    const handleSkip = () => {
      clearInterval(timer);
      setVisibleLines(DOCKER_LOGS);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("booted", "true");
      }
      setTimeout(onComplete, 300);
    };

    window.addEventListener("keydown", handleSkip, { once: true });
    window.addEventListener("click", handleSkip, { once: true });

    return () => {
      clearInterval(timer);
      window.removeEventListener("keydown", handleSkip);
      window.removeEventListener("click", handleSkip);
    };
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      className="fixed inset-0 bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(220 13% 7%)] text-[hsl(var(--foreground))] font-mono overflow-hidden flex flex-col justify-between p-8"
    >
      {/* Logs area */}
      <div className="flex-1 overflow-y-auto space-y-0 text-xs leading-relaxed max-w-2xl">
        {visibleLines.map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1 }}
            className={`${
              !line
                ? "h-1"
                : line.includes("✓")
                  ? "text-[hsl(var(--success))]"
                  : line.includes("$")
                    ? "text-[hsl(var(--primary))]"
                    : "text-[hsl(var(--muted-foreground))]"
            }`}
          >
            {line}
          </motion.div>
        ))}
      </div>

      {/* Footer hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-[11px] text-[hsl(var(--muted-foreground))] animate-pulse"
      >
        Press any key to skip •  Starting in 3 seconds...
      </motion.div>
    </motion.div>
  );
}
