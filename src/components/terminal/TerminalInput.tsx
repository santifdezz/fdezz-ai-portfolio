"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import CommandSuggestions from "./CommandSuggestions";

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (input: string) => void;
  isProcessing: boolean;
  commandHistory: string[];
}

export default function TerminalInput({
  value,
  onChange,
  onSubmit,
  isProcessing,
  commandHistory,
}: TerminalInputProps) {
  const [historyIndex, setHistoryIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !isProcessing) {
        onSubmit(value);
        setHistoryIndex(-1);
        return;
      }

      // Command history navigation
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        if (newIndex >= 0) {
          setHistoryIndex(newIndex);
          onChange(commandHistory[commandHistory.length - 1 - newIndex]);
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          onChange(commandHistory[commandHistory.length - 1 - newIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          onChange("");
        }
        return;
      }

      // Reset history index on any other key
      if (historyIndex >= 0) {
        setHistoryIndex(-1);
      }
    },
    [value, onSubmit, onChange, isProcessing, historyIndex, commandHistory]
  );

  const handleSelectSuggestion = (command: string) => {
    onChange(command + " ");
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="relative border-t border-cyan-500/30 px-3 py-2 md:px-4 md:py-3 flex items-center gap-2 bg-black/40"
    >
      <CommandSuggestions input={value} onSelect={handleSelectSuggestion} />

      <span className="text-cyan-400 dark:text-cyan-300 text-sm flex-shrink-0">
        &gt;
      </span>
      <input
        className="flex-1 bg-transparent outline-none text-xs md:text-sm text-cyan-50 dark:text-cyan-50 caret-cyan-400 font-mono placeholder-cyan-600/50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type /help"
        disabled={isProcessing}
        autoFocus
        spellCheck="false"
      />
      {isProcessing && (
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="text-cyan-400 dark:text-cyan-300 text-xs flex-shrink-0"
        >
          ⬤
        </motion.div>
      )}
    </motion.div>
  );
}
