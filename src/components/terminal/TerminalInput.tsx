"use client";

import { useState, useRef, useCallback } from "react";
import type { KeyboardEvent } from "react";
import { getCommandSuggestions } from "@/lib/commands";
import type { CommandKey } from "@/lib/terminalTypes";
import { CommandSuggestions } from "./CommandSuggestions";

interface TerminalInputProps {
  onSubmit: (input: string) => void;
  isProcessing: boolean;
}

export function TerminalInput({ onSubmit, isProcessing }: TerminalInputProps) {
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = getCommandSuggestions(input);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isProcessing) return;
    setCmdHistory((prev) => [trimmed, ...prev.slice(0, 49)]);
    setHistoryIdx(-1);
    setInput("");
    onSubmit(trimmed);
  }, [input, isProcessing, onSubmit]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
      return;
    }
    if (e.key === "Escape") {
      setInput("");
      setHistoryIdx(-1);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(next);
      setInput(cmdHistory[next] ?? "");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(historyIdx - 1, -1);
      setHistoryIdx(next);
      setInput(next === -1 ? "" : (cmdHistory[next] ?? ""));
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      if (suggestions.length === 1) {
        setInput(suggestions[0]);
      }
    }
  };

  const handleSelect = (cmd: CommandKey) => {
    setInput(cmd);
    setHistoryIdx(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="border-t border-[hsl(var(--border))] bg-gradient-to-t from-[hsl(var(--card)/0.5)] to-transparent p-4 md:p-6">
      <div className="relative max-w-4xl mx-auto">
        <CommandSuggestions suggestions={suggestions} onSelect={handleSelect} />

        <div className="flex items-center gap-3 bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] rounded-xl px-4 py-3 shadow-[var(--shadow-elegant)] focus-within:border-[hsl(var(--primary))] transition-colors duration-200">
          <span className="text-[hsl(var(--primary))] text-sm font-mono select-none">→</span>

          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-[hsl(var(--foreground))] outline-none border-none text-sm placeholder-[hsl(var(--muted-foreground))] font-mono"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setHistoryIdx(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder={isProcessing ? "processing..." : "Type a command or message..."}
            disabled={isProcessing}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />

          {/* Send button */}
          {input.trim() && !isProcessing && (
            <button
              onClick={handleSubmit}
              className="px-3 py-1 rounded-lg bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.25)] font-mono text-xs font-semibold transition-colors duration-150 shrink-0"
              title="Send (Enter)"
            >
              Send
            </button>
          )}

          {isProcessing && (
            <span className="text-[hsl(var(--primary))] animate-pulse font-mono text-sm">
              ⚡
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
