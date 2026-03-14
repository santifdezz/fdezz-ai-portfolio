"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, ChevronRight } from "lucide-react";
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
  onCommandRun?: (cmd: string) => void;
}

export function HelpPanel({
  commands,
  locale = "en",
  onCommandRun,
}: HelpPanelProps) {
  const isES = locale === "es";
  const [selectedCommand, setSelectedCommand] = useState<HelpCommand | null>(
    commands.length > 0 ? commands[0] : null
  );

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
      accentColor="purple"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-96">
        {/* Left Column: Commands List */}
        <div className="lg:col-span-1 space-y-3 overflow-y-auto max-h-96 pr-2">
          <p className="text-xs uppercase font-semibold text-purple-400 tracking-wider sticky top-0 bg-[hsl(var(--background))] py-1">
            {isES ? "Comandos" : "Commands"}
          </p>

          <div className="space-y-2">
            {Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category} className="space-y-1.5">
                <p className="text-xs font-semibold text-purple-300/60 uppercase tracking-wider px-2">
                  {category}
                </p>
                <div className="space-y-1">
                  {cmds.map((cmd, cmdIdx) => (
                    <motion.button
                      key={cmd.command}
                      onClick={() => {
                        setSelectedCommand(cmd);
                        onCommandRun?.(cmd.command);
                      }}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: cmdIdx * 0.05 }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-mono transition-all ${
                        selectedCommand?.command === cmd.command
                          ? "bg-purple-500/20 border border-purple-400 text-purple-300 shadow-lg shadow-purple-500/20"
                          : "bg-[hsl(var(--secondary)/0.5)] border border-purple-400/20 text-[hsl(var(--foreground))] hover:border-purple-400/50 hover:bg-purple-500/10"
                      }`}
                    >
                      {cmd.command}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Command Details */}
        {selectedCommand && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2 space-y-4 p-4 bg-purple-500/5 rounded-lg border border-purple-500/20"
          >
            {/* Command Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                </motion.div>
                <h3 className="text-lg font-bold text-[hsl(var(--foreground))]">
                  {selectedCommand.command}
                </h3>
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {selectedCommand.description}
              </p>
            </div>

            {/* Example */}
            {selectedCommand.example && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-2 p-3 bg-[hsl(var(--secondary)/0.5)] rounded-lg border border-purple-500/20"
              >
                <p className="text-xs uppercase font-semibold text-purple-400 tracking-wider">
                  {isES ? "Ejemplo" : "Example"}
                </p>
                <code className="text-sm font-mono text-purple-300 block">
                  {selectedCommand.example}
                </code>
              </motion.div>
            )}

            {/* Execute Button */}
            {onCommandRun && (
              <motion.button
                onClick={() => onCommandRun(selectedCommand.command)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 px-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-400/30 hover:border-purple-400/60 rounded-lg text-sm font-semibold text-purple-300 transition-all flex items-center justify-center gap-2"
              >
                <ChevronRight className="w-4 h-4" />
                {isES ? "Ejecutar Comando" : "Execute Command"}
              </motion.button>
            )}

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-[hsl(var(--muted-foreground))] italic border-l-2 border-purple-500/30 pl-3"
            >
              {isES
                ? "💡 Haz clic en cualquier comando para verlo o ejecutarlo"
                : "💡 Click any command to view it or execute it"}
            </motion.div>
          </motion.div>
        )}
      </div>
    </PanelBase>
  );
}
