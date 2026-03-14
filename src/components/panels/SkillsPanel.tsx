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
}

export function SkillsPanel({
  categories,
  locale = "en",
}: SkillsPanelProps) {
  const isES = locale === "es";

  return (
    <PanelBase
      icon={Zap}
      title={isES ? "Habilidades" : "Skills"}
      accentColor="green"
    >
      <div className="space-y-4">
        {categories.map((category, idx) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
          >
            <h4 className="text-sm font-semibold text-green-400 mb-2">
              {category.name}
            </h4>
            <div className="flex flex-wrap gap-2">
              {category.items.map((skill) => (
                <motion.span
                  key={skill}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1.5 text-xs bg-green-500/10 text-green-300 rounded-full border border-green-500/30 cursor-pointer hover:border-green-500/50 transition-colors"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </PanelBase>
  );
}
