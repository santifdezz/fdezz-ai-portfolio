"use client";

import React from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { PanelBase } from "./PanelBase";
import type { Locale } from "@/lib/portfolio-content";

interface HelpCommand {
  command: string;
  description: string;
  example?: string;
  category: string;
}

interface HelpPanelProps {
  commands: HelpCommand[];
  locale?: Locale;
}

export function HelpPanel({
  commands,
  locale = "en",
}: HelpPanelProps) {
  const isES = locale === "es";

  // Group commands by category
  const groupedCommands = commands.reduce(
    (acc, cmd) => {
      if (!acc[cmd.category]) {
        acc[cmd.category] = [];
      }
      acc[cmd.category].push(cmd);
      return acc;
    },
    {} as Record<string, HelpCommand[]>
  );

  return (
    <PanelBase
      icon={HelpCircle}
      title={isES ? "Ayuda" : "Help"}
      accentColor="cyan"
    >
      <div className="space-y-6">
        {Object.entries(groupedCommands).map(([category, cmds], idx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
          >
            <h4 className="text-xs uppercase font-semibold text-cyan-400 tracking-wider mb-3">
              {category}
            </h4>
            <div className="space-y-2 pl-3 border-l border-cyan-500/30">
              {cmds.map((cmd) => (
                <motion.div
                  key={cmd.command}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  className="space-y-1"
                >
                  <code className="text-sm font-mono text-cyan-300 bg-[hsl(var(--secondary)/0.7)] px-2 py-1 rounded">
                    {cmd.command}
                  </code>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {cmd.description}
                  </p>
                  {cmd.example && (
                    <p className="text-xs text-[hsl(var(--muted-foreground)/0.7)] italic">
                      {isES ? "Ejemplo" : "Example"}: {cmd.example}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </PanelBase>
  );
}
