"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Code, Zap } from "lucide-react";
import { PanelBase } from "./PanelBase";
import type { Locale } from "@/lib/portfolio-content";

interface Skill {
  name: string;
  items: string[];
}

interface BioPanelProps {
  shortDescription: string;
  fullDescription?: string;
  tagline?: string;
  skills?: Skill[];
  locale?: Locale;
}

export function BioPanel({
  shortDescription,
  fullDescription,
  tagline,
  skills = [],
  locale = "en",
}: BioPanelProps) {
  const isES = locale === "es";

  return (
    <PanelBase
      icon={User}
      title={isES ? "Sobre Mí" : "About Me"}
      accentColor="cyan"
    >
      <div className="space-y-6">
        {/* Tagline */}
        {tagline && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm italic text-[hsl(var(--muted-foreground))] border-l-2 border-cyan-500/50 pl-3"
          >
            "{tagline}"
          </motion.p>
        )}

        {/* Short Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm leading-relaxed text-[hsl(var(--foreground))]">
            {shortDescription}
          </p>
        </motion.div>

        {/* Full Description */}
        {fullDescription && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-sm leading-relaxed text-[hsl(var(--foreground))] text-justify">
              {fullDescription}
            </p>
          </motion.div>
        )}

        {/* Skills Matrix */}
        {skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h4 className="text-xs uppercase font-semibold text-cyan-400 tracking-wider">
              {isES ? "Herramientas & Conocimientos" : "Tools & Knowledge"}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((skillGroup, idx) => (
                <motion.div
                  key={skillGroup.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="space-y-2 p-3 bg-[hsl(var(--secondary)/0.5)] rounded-lg border border-[hsl(var(--border)/0.5)]"
                >
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-[hsl(var(--foreground))]">
                      {skillGroup.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-1 text-xs bg-cyan-500/10 text-cyan-300 rounded border border-cyan-500/30"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </PanelBase>
  );
}
