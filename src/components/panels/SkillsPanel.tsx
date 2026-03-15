"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { PanelBase } from "./PanelBase";
import type { Locale } from "@/lib/portfolio-content";

interface SkillCategory {
  name: string;
  items: string[];
}

interface SkillsPanelProps {
  categories: SkillCategory[];
  skillLevels?: Record<string, number>;
  locale?: Locale;
  onCommandRun?: (cmd: string) => void;
}

function levelLabel(pct: number, isES: boolean): string {
  if (pct >= 85) return isES ? "Experto" : "Expert";
  if (pct >= 70) return isES ? "Avanzado" : "Advanced";
  if (pct >= 50) return isES ? "Intermedio" : "Intermediate";
  return isES ? "Básico" : "Basic";
}

function levelColor(pct: number): string {
  if (pct >= 85) return "bg-emerald-500";
  if (pct >= 70) return "bg-purple-500";
  if (pct >= 50) return "bg-blue-500";
  return "bg-slate-500";
}

export function SkillsPanel({
  categories,
  skillLevels,
  locale = "en",
  onCommandRun,
}: SkillsPanelProps) {
  const isES = locale === "es";
  const hasLevels = skillLevels && Object.keys(skillLevels).length > 0;

  return (
    <PanelBase
      icon={Zap}
      title={isES ? "Habilidades" : "Skills"}
      accentColor="purple"
    >
      <div className="space-y-5">
        {categories.map((category, idx) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + idx * 0.08 }}
          >
            <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
              {category.name}
            </h4>

            {hasLevels ? (
              /* Proficiency bar view */
              <div className="space-y-1.5">
                {category.items.map((skill) => {
                  const pct = skillLevels![skill];
                  if (pct === undefined) {
                    /* Fallback tag for skills without a level */
                    return (
                      <span
                        key={skill}
                        className="inline-block mr-2 mb-1 px-2.5 py-1 text-xs bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/30"
                      >
                        {skill}
                      </span>
                    );
                  }
                  return (
                    <div key={skill} className="flex items-center gap-2">
                      <button
                        onClick={() => onCommandRun?.(`proyectos ${skill}`)}
                        className={`w-28 shrink-0 text-xs text-left text-[hsl(var(--foreground))] ${onCommandRun ? "hover:text-purple-300 cursor-pointer" : "cursor-default"} transition-colors truncate`}
                        title={skill}
                      >
                        {skill}
                      </button>
                      <div className="flex-1 h-1.5 bg-[hsl(var(--secondary))] rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${levelColor(pct)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.2 + idx * 0.08, duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                      <span className="w-20 shrink-0 text-[10px] text-[hsl(var(--muted-foreground))] text-right">
                        {levelLabel(pct, isES)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Tag view fallback */
              <div className="flex flex-wrap gap-2">
                {category.items.map((skill) => (
                  <motion.button
                    key={skill}
                    onClick={() => onCommandRun?.(`/projects ${skill}`)}
                    title={isES ? `Filtrar proyectos por ${skill}` : `Filter projects by ${skill}`}
                    whileHover={onCommandRun ? { scale: 1.05 } : {}}
                    whileTap={onCommandRun ? { scale: 0.95 } : {}}
                    className={`px-3 py-1.5 text-xs bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/30 transition-colors ${
                      onCommandRun ? "cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/20" : "cursor-default"
                    }`}
                  >
                    {skill}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        ))}

        {/* Legend — only when bars are shown */}
        {hasLevels && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-3 pt-2 border-t border-[hsl(var(--border)/0.5)]"
          >
            {[
              { color: "bg-emerald-500", label: isES ? "Experto (85+)" : "Expert (85+)" },
              { color: "bg-purple-500", label: isES ? "Avanzado (70+)" : "Advanced (70+)" },
              { color: "bg-blue-500", label: isES ? "Intermedio (50+)" : "Intermediate (50+)" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-[10px] text-[hsl(var(--muted-foreground))]">{item.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </PanelBase>
  );
}
