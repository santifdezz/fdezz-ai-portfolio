"use client";

import { motion, AnimatePresence } from "framer-motion";
import { commandDescriptions } from "@/lib/commands";
import type { CommandKey } from "@/lib/terminalTypes";

interface CommandSuggestionsProps {
  suggestions: CommandKey[];
  onSelect: (cmd: CommandKey) => void;
}

export function CommandSuggestions({ suggestions, onSelect }: CommandSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.15 }}
        className="absolute bottom-full left-0 right-0 mb-2 z-10 bg-[hsl(var(--card))] backdrop-blur-sm border border-[hsl(var(--border))] rounded-lg overflow-hidden shadow-[var(--shadow-card)]"
      >
        {suggestions.slice(0, 5).map((cmd) => (
          <motion.button
            key={cmd}
            onClick={() => onSelect(cmd)}
            className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-[hsl(var(--secondary))] transition-colors border-b border-[hsl(var(--border))] last:border-b-0 text-xs"
            whileHover={{ paddingLeft: 20 }}
          >
            <span className="text-[hsl(var(--primary))] font-semibold shrink-0 w-20">
              {cmd}
            </span>
            <span className="text-[hsl(var(--muted-foreground))] truncate text-[11px]">
              {commandDescriptions[cmd]}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
