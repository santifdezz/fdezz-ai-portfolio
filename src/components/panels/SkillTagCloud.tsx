"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cloud } from "lucide-react";
import { PanelBase } from "./PanelBase";
import type { Locale } from "@/lib/portfolio-content";

interface SkillTagCloudProps {
  skillLevels: Record<string, number>;
  locale?: Locale;
  onCommandRun?: (cmd: string) => void;
}

function getSizeClass(pct: number): { fontSize: string; padding: string } {
  if (pct >= 85) return { fontSize: "28px", padding: "12px 18px" };
  if (pct >= 75) return { fontSize: "22px", padding: "10px 16px" };
  if (pct >= 65) return { fontSize: "18px", padding: "8px 14px" };
  if (pct >= 50) return { fontSize: "14px", padding: "6px 12px" };
  return { fontSize: "12px", padding: "4px 10px" };
}

function getColorScheme(
  pct: number
): { bg: string; border: string; text: string } {
  if (pct >= 85)
    return {
      bg: "bg-emerald-500/20",
      border: "border-emerald-500/50",
      text: "text-emerald-300",
    };
  if (pct >= 75)
    return {
      bg: "bg-purple-500/20",
      border: "border-purple-500/50",
      text: "text-purple-300",
    };
  if (pct >= 65)
    return {
      bg: "bg-blue-500/20",
      border: "border-blue-500/50",
      text: "text-blue-300",
    };
  if (pct >= 50)
    return {
      bg: "bg-cyan-500/20",
      border: "border-cyan-500/50",
      text: "text-cyan-300",
    };
  return {
    bg: "bg-slate-500/20",
    border: "border-slate-500/50",
    text: "text-slate-300",
  };
}

function levelLabel(pct: number, isES: boolean): string {
  if (pct >= 85) return isES ? "Experto" : "Expert";
  if (pct >= 75) return isES ? "Avanzado" : "Advanced";
  if (pct >= 65) return isES ? "Competente" : "Proficient";
  if (pct >= 50) return isES ? "Intermedio" : "Intermediate";
  return isES ? "Básico" : "Basic";
}

export function SkillTagCloud({
  skillLevels,
  locale = "en",
  onCommandRun,
}: SkillTagCloudProps) {
  const isES = locale === "es";

  // Sort skills by proficiency descending for better visual distribution
  const sortedSkills = Object.entries(skillLevels)
    .sort((a, b) => b[1] - a[1])
    .map(([skill, pct]) => ({ skill, pct }));

  return (
    <PanelBase
      icon={Cloud}
      title={isES ? "Nube de Habilidades" : "Skill Cloud"}
      accentColor="purple"
    >
      <div className="space-y-6">
        {/* Cloud visualization */}
        <div className="flex flex-wrap gap-3 justify-center py-4">
          {sortedSkills.map(({ skill, pct }, idx) => {
            const { fontSize, padding } = getSizeClass(pct);
            const { bg, border, text } = getColorScheme(pct);

            return (
              <motion.button
                key={skill}
                onClick={() => {
                  const query = isES
                    ? `Proyectos que usan ${skill}`
                    : `Projects using ${skill}`;
                  onCommandRun?.(query);
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: idx * 0.05,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={onCommandRun ? { scale: 1.12 } : {}}
                whileTap={onCommandRun ? { scale: 0.95 } : {}}
                title={`${skill} — ${levelLabel(pct, isES)} (${pct}%)`}
                className={`${bg} ${border} ${text} border rounded-full font-semibold transition-all ${
                  onCommandRun ? "cursor-pointer hover:shadow-lg" : "cursor-default"
                }`}
                style={{
                  fontSize,
                  padding,
                }}
              >
                {skill}
              </motion.button>
            );
          })}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3 py-2 border-t border-[hsl(var(--border)/0.5)]">
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              {isES ? "Total" : "Total"}
            </p>
            <p className="text-lg font-bold text-purple-300">
              {Object.keys(skillLevels).length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              {isES ? "Promedio" : "Average"}
            </p>
            <p className="text-lg font-bold text-purple-300">
              {(
                Object.values(skillLevels).reduce((a, b) => a + b) /
                Object.keys(skillLevels).length
              ).toFixed(0)}
              %
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              {isES ? "Expertos" : "Experts"}
            </p>
            <p className="text-lg font-bold text-emerald-300">
              {Object.values(skillLevels).filter((p) => p >= 85).length}
            </p>
          </motion.div>
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-2 justify-center text-[10px] pt-2 border-t border-[hsl(var(--border)/0.5)]"
        >
          {[
            {
              pct: 85,
              label: isES ? "Experto (85+)" : "Expert (85+)",
              color: "bg-emerald-500/40",
            },
            {
              pct: 75,
              label: isES ? "Avanzado (75+)" : "Advanced (75+)",
              color: "bg-purple-500/40",
            },
            {
              pct: 65,
              label: isES ? "Competente (65+)" : "Proficient (65+)",
              color: "bg-blue-500/40",
            },
            {
              pct: 50,
              label: isES ? "Intermedio (50+)" : "Intermediate (50+)",
              color: "bg-cyan-500/40",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`${item.color} px-2 py-1 rounded-full text-[hsl(var(--muted-foreground))]`}
            >
              {item.label}
            </div>
          ))}
        </motion.div>

        {/* Hint */}
        <p className="text-[10px] text-center text-[hsl(var(--muted-foreground))] italic">
          {isES
            ? "Haz clic en una habilidad para ver proyectos relacionados"
            : "Click a skill to see related projects"}
        </p>
      </div>
    </PanelBase>
  );
}
