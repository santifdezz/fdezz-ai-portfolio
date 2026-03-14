"use client";

import { useEffect, useRef } from "react";
import type { TerminalMessage } from "@/lib/terminalTypes";
import { motion } from "framer-motion";

interface TerminalHistoryProps {
  messages: TerminalMessage[];
  isProcessing: boolean;
}

export default function TerminalHistory({
  messages,
  isProcessing,
}: TerminalHistoryProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto space-y-0 text-sm leading-relaxed pr-2">
      {messages.map((msg, idx) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="break-words font-mono text-xs md:text-sm"
        >
          {msg.type === "system" && (
            <span className="text-cyan-600 dark:text-cyan-400">{msg.text}</span>
          )}
          {msg.type === "ai" && (
            <span className="text-cyan-300 dark:text-cyan-200">{msg.text}</span>
          )}
          {msg.type === "user" && (
            <span className="text-lime-300 dark:text-lime-200">{msg.text}</span>
          )}
        </motion.div>
      ))}

      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1"
        >
          <span className="text-cyan-300 dark:text-cyan-200">santi@ai-terminal:~$ </span>
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-cyan-300 dark:text-cyan-200"
          >
            █
          </motion.span>
        </motion.div>
      )}

      <div ref={endRef} className="h-0" />
    </div>
  );
}
