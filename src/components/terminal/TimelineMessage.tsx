"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Wrench,
  Code,
  TestTube,
  Brain,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BookMarked,
} from "lucide-react";
import type { EducationEntry, Locale } from "@/lib/portfolio-content";

const periodIcons: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  "2020-2021": BookOpen,
  "2021": Wrench,
  "2022-2024": Code,
  "2024": TestTube,
  "2024-2025": Brain,
  "2025-2026": Brain, // Qaleon AI/ML role
};

interface TimelineMessageProps {
  periodIndex: number;
  totalPeriods: number;
  education: EducationEntry;
  onNavigate: (newPeriodIndex: number) => void;
  locale: Locale;
}

export function TimelineMessage({
  periodIndex,
  totalPeriods,
  education,
  onNavigate,
  locale,
}: TimelineMessageProps) {
  const isES = locale === "es";
  const periodNum = periodIndex + 1;
  const IconComponent = periodIcons[education.year] || BookOpen;

  return (
    <div className="w-full space-y-4 p-4 bg-gradient-to-b from-transparent to-[hsl(var(--secondary)/0.2)] rounded-lg">
      {/* HEADER */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.4, type: "spring" }}
          >
            <IconComponent className="w-6 h-6 text-[hsl(var(--primary))]" strokeWidth={2} />
          </motion.div>
          <div>
            <h3 className="text-sm font-semibold text-[hsl(var(--primary))]">
              {isES ? `CAPÍTULO ${periodNum}/${totalPeriods}` : `CHAPTER ${periodNum}/${totalPeriods}`}
            </h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">{education.year}</p>
          </div>
        </div>

        <p className="text-sm font-bold text-[hsl(var(--foreground))]">{education.title}</p>
      </div>

      {/* INSTITUTION */}
      <div className="flex items-start gap-2.5 text-xs text-[hsl(var(--muted-foreground))]">
        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[hsl(var(--primary)/0.7)]" strokeWidth={2} />
        <p>{education.institution}</p>
      </div>

      {/* NARRATIVE */}
      {education.narrative && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="italic text-sm text-[hsl(var(--foreground))] border-l-2 border-[hsl(var(--primary)/0.3)] pl-3 py-2"
        >
          "{education.narrative}"
        </motion.div>
      )}

      {/* LEARNINGS */}
      {education.learnings && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[hsl(var(--primary))] uppercase tracking-wide">
            {isES ? "Aprendí:" : "I Learned:"}
          </p>
          <div className="space-y-1.5">
            {education.learnings.map((learning, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.08 }}
                className="text-xs text-[hsl(var(--foreground))] flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--success))] flex-shrink-0" strokeWidth={2.5} />
                <span>{learning}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* PROGRESS BAR */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wide">
            {isES ? "Progreso" : "Progress"}
          </span>
          <span className="text-xs font-semibold text-[hsl(var(--primary))]">
            {periodNum}/{totalPeriods}
          </span>
        </div>

        {/* Barra de progreso con gradiente */}
        <div className="h-2.5 bg-[hsl(var(--secondary))] rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--primary)/0.8)] to-[hsl(var(--primary)/0.6)]"
            initial={{ width: 0 }}
            animate={{ width: `${(periodNum / totalPeriods) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            style={{
              boxShadow: "0 0 12px hsl(var(--primary)/0.6), inset 0 0 8px hsl(var(--primary)/0.3)",
            }}
          />
        </div>
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="space-y-3 pt-2">
        {/* Period Selector */}
        <div className="flex items-center gap-2 justify-center">
          {/* Previous Button */}
          {periodIndex > 0 && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onNavigate(periodIndex - 1)}
              className="p-2 rounded-lg bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary)/0.8)] text-[hsl(var(--foreground))] transition-all duration-200 border border-[hsl(var(--border)/0.5)]"
              aria-label={isES ? "Período anterior" : "Previous period"}
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            </motion.button>
          )}

          {/* Period Circles */}
          <div className="flex gap-2">
            {Array.from({ length: totalPeriods }).map((_, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => onNavigate(idx)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all duration-200 flex items-center justify-center ${
                  idx === periodIndex
                    ? "bg-[hsl(var(--primary))] text-white shadow-lg shadow-[hsl(var(--primary)/0.4)] border border-[hsl(var(--primary)/0.8)]"
                    : "bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary)/0.8)] border border-[hsl(var(--border)/0.5)]"
                }`}
              >
                {idx + 1}
              </motion.button>
            ))}
          </div>

          {/* Next Button */}
          {periodIndex < totalPeriods - 1 && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onNavigate(periodIndex + 1)}
              className="p-2 rounded-lg bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary)/0.8)] text-[hsl(var(--foreground))] transition-all duration-200 border border-[hsl(var(--border)/0.5)]"
              aria-label={isES ? "Período siguiente" : "Next period"}
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </motion.button>
          )}
        </div>

        {/* View All Button */}
        <motion.button
          whileHover={{ scale: 1.02, x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate(-1)}
          className="w-full py-2.5 rounded-lg bg-[hsl(var(--primary)/0.1)] hover:bg-[hsl(var(--primary)/0.15)] text-xs font-semibold text-[hsl(var(--primary))] transition-all duration-200 flex items-center justify-center gap-2 border border-[hsl(var(--primary)/0.2)]"
        >
          <BookMarked className="w-4 h-4" strokeWidth={2} />
          <span>{isES ? "Ver Todo mi Recorrido" : "See My Full Journey"}</span>
        </motion.button>
      </div>
    </div>
  );
}
