"use client";

import { motion, AnimatePresence } from "framer-motion";
import { allCommands } from "@/lib/commands";

interface CommandSuggestionsProps {
  input: string;
  onSelect: (command: string) => void;
}

export default function CommandSuggestions({
  input,
  onSelect,
}: CommandSuggestionsProps) {
  if (!input.startsWith("/")) return null;

  const suggestions = allCommands.filter((cmd) =>
    cmd.toLowerCase().startsWith(input.toLowerCase())
  );

  if (suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.15 }}
        className="absolute bottom-full left-3 md:left-4 right-3 md:right-4 mb-1 border border-cyan-500/40 rounded bg-black/80 backdrop-blur-sm shadow-lg max-h-48 overflow-y-auto"
      >
        {suggestions.map((cmd, idx) => (
          <motion.button
            key={cmd}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onSelect(cmd)}
            className="w-full text-left px-3 py-1.5 md:py-2 text-xs md:text-sm font-mono text-cyan-300 hover:bg-cyan-500/20 transition-colors border-b border-cyan-500/10 last:border-b-0"
          >
            <span className="text-cyan-400">{cmd}</span>
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
