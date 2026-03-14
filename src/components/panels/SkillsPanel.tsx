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
  locale?: Locale;
  onCommandRun?: (cmd: string) => void;
}

export function SkillsPanel({
  categories,
  locale = "en",
  onCommandRun,
}: SkillsPanelProps) {
  const isES = locale === "es";

  return (
    <PanelBase
      icon={Zap}
      title={isES ? "Habilidades" : "Skills"}
      accentColor="purple"
    >
      <div className="space-y-4">
        {categories.map((category, idx) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
          >
            <h4 className="text-sm font-semibold text-purple-400 mb-2">
              {category.name}
            </h4>
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
          </motion.div>
        ))}
      </div>
    </PanelBase>
  );
}
