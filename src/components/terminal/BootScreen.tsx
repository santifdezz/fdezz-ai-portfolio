"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/terminalTypes";

interface BootScreenProps {
  locale: Locale;
  onComplete: () => void;
}

function generateBootLogs(): string[] {
  const now = new Date();
  const timestamp = now.toISOString().split('T')[0] + ' ' + now.toTimeString().slice(0, 8);

  return [
    "$ docker run --rm -it fdezz/ai-portfolio:latest",
    "",
    `[${timestamp}] Starting AI Terminal Portfolio v1.0.0`,
    `[${timestamp}] Environment: production`,
    `[${timestamp}] Loading modules...`,
    `[${timestamp}]   ✓ TypeScript engine`,
    `[${timestamp}]   ✓ React framework`,
    `[${timestamp}]   ✓ Next.js runtime`,
    `[${timestamp}]   ✓ AI command handler`,
    `[${timestamp}] Initializing interfaces...`,
    `[${timestamp}]   ✓ Chat UI`,
    `[${timestamp}]   ✓ Sidebar history`,
    `[${timestamp}]   ✓ Message pipeline`,
    `[${timestamp}] Building portfolio content...`,
    `[${timestamp}]   ✓ Projects (5)`,
    `[${timestamp}]   ✓ Skills matrix`,
    `[${timestamp}]   ✓ Contact data`,
    `[${timestamp}] Establishing i18n layer...`,
    `[${timestamp}]   ✓ English`,
    `[${timestamp}]   ✓ Spanish`,
    `[${timestamp}] Server ready on http://localhost:3000`,
    "",
    "Welcome to fdezz's AI Terminal",
  ];
}

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

    const DOCKER_LOGS = generateBootLogs();

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
