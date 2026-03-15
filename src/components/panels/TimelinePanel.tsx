"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { PanelBase } from "./PanelBase";
import type { Locale } from "@/lib/portfolio-content";
import type { EducationEntry } from "@/lib/portfolio-content";

const periodIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "2020-2021": BookOpen,
  "2021": Wrench,
  "2022-2024": Code,
  "2024": TestTube,
  "2024-2025": Brain,
  "2025-2026": Brain,
};

interface TimelinePanelProps {
  periods: EducationEntry[];
  locale?: Locale;
  onCommandRun?: (cmd: string) => void;
}

export function TimelinePanel({
  periods,
  locale = "en",
  onCommandRun,
}: TimelinePanelProps) {
  const isES = locale === "es";
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <PanelBase
      icon={BookOpen}
      title={isES ? "Línea de Tiempo" : "Timeline"}
      accentColor="purple"
    >
      <div className="space-y-6">
        {/* Timeline Visual */}
        <div className="relative">
          {/* Horizontal Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gradient-to-r from-purple-600/20 via-purple-500/40 to-purple-600/20 rounded-full" />

          {/* Timeline Points */}
          <div className="relative flex justify-between items-start gap-2 px-1">
            {periods.map((period, idx) => {
              const IconComponent = periodIcons[period.year] || BookOpen;
              const isActive = expandedIndex === idx;

              return (
                <motion.div
                  key={period.year}
                  className="flex flex-col items-center gap-3 flex-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {/* Dot Button */}
                  <motion.button
                    onClick={() => setExpandedIndex(isActive ? null : idx)}
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 ${
                      isActive
                        ? "bg-purple-500/25 border-2 border-purple-400 shadow-lg shadow-purple-500/40"
                        : "bg-[hsl(var(--secondary))] border border-purple-400/40 hover:border-purple-400/60"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${
                        isActive ? "text-purple-300" : "text-purple-400"
                      }`}
                    />
                  </motion.button>

                  {/* Year Label */}
                  <p className="text-xs font-semibold text-purple-300 text-center">
                    {period.year}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Expanded Period Details */}
        {expandedIndex !== null && periods[expandedIndex] && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 p-4 bg-purple-500/5 rounded-lg border border-purple-500/20"
          >
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-purple-500/20 rounded text-xs font-semibold text-purple-300">
                  {isES ? `CAPÍTULO ${expandedIndex + 1}/${periods.length}` : `CHAPTER ${expandedIndex + 1}/${periods.length}`}
                </div>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                  {periods[expandedIndex].year}
                </span>
              </div>
              <h4 className="text-sm font-bold text-[hsl(var(--foreground))]">
                {periods[expandedIndex].title}
              </h4>
            </div>

            {/* Institution */}
            <div className="flex items-start gap-2 text-xs text-[hsl(var(--muted-foreground))]">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-400" />
              <span>{periods[expandedIndex].institution}</span>
            </div>

            {/* Narrative */}
            {periods[expandedIndex].narrative && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="italic text-sm text-[hsl(var(--foreground))] border-l-2 border-purple-500/30 pl-3 py-2"
              >
                "{periods[expandedIndex].narrative}"
              </motion.div>
            )}

            {/* Learnings */}
            {periods[expandedIndex].learnings && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
                  {isES ? "Aprendí:" : "I Learned:"}
                </p>
                <div className="space-y-1.5">
                  {periods[expandedIndex].learnings!.map((learning, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span>{learning}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <div className="space-y-2 pt-2 border-t border-purple-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase">
                  {isES ? "Progreso" : "Progress"}
                </span>
                <span className="text-xs font-semibold text-purple-300">
                  {expandedIndex + 1}/{periods.length}
                </span>
              </div>
              <div className="h-2 bg-[hsl(var(--secondary))] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((expandedIndex + 1) / periods.length) * 100}%`,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{
                    boxShadow:
                      "0 0 10px rgba(168, 85, 247, 0.5), inset 0 0 6px rgba(168, 85, 247, 0.3)",
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Timeline Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center p-3 bg-purple-500/5 rounded-lg border border-purple-500/20"
          >
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              {isES ? "Total" : "Total"}
            </p>
            <p className="text-sm font-bold text-purple-300">{periods.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center p-3 bg-purple-500/5 rounded-lg border border-purple-500/20"
          >
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              {isES ? "Años" : "Years"}
            </p>
            <p className="text-sm font-bold text-purple-300">
              {periods.length > 0
                ? `${periods[0].year.split("-")[0]}-${periods[periods.length - 1].year.split("-").pop()}`
                : "N/A"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center p-3 bg-purple-500/5 rounded-lg border border-purple-500/20"
          >
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              {isES ? "Estado" : "Status"}
            </p>
            <p className="text-sm font-bold text-purple-300">
              {isES ? "En Curso" : "Active"}
            </p>
          </motion.div>
        </div>

        {/* Prev / Next navigation */}
        {expandedIndex !== null && (
          <div className="flex items-center justify-between gap-2">
            <motion.button
              onClick={() => setExpandedIndex(Math.max(0, expandedIndex - 1))}
              disabled={expandedIndex === 0}
              whileHover={expandedIndex > 0 ? { x: -2 } : {}}
              whileTap={expandedIndex > 0 ? { scale: 0.95 } : {}}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] disabled:opacity-30 hover:enabled:border-purple-500/50 hover:enabled:text-purple-300 transition-all"
            >
              <ChevronLeft className="w-3 h-3" />
              {isES ? "Anterior" : "Previous"}
            </motion.button>

            <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
              {expandedIndex + 1} / {periods.length}
            </span>

            <motion.button
              onClick={() => setExpandedIndex(Math.min(periods.length - 1, expandedIndex + 1))}
              disabled={expandedIndex === periods.length - 1}
              whileHover={expandedIndex < periods.length - 1 ? { x: 2 } : {}}
              whileTap={expandedIndex < periods.length - 1 ? { scale: 0.95 } : {}}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] disabled:opacity-30 hover:enabled:border-purple-500/50 hover:enabled:text-purple-300 transition-all"
            >
              {isES ? "Siguiente" : "Next"}
              <ChevronRight className="w-3 h-3" />
            </motion.button>
          </div>
        )}

        {expandedIndex === null && (
          <p className="text-xs text-[hsl(var(--muted-foreground))] text-center">
            {isES ? "Haz clic en cada período para ver más detalles" : "Click each period to view more details"}
          </p>
        )}
      </div>
    </PanelBase>
  );
}
