"use client";

import { motion } from "framer-motion";
import type { TerminalMessage } from "@/lib/terminalTypes";

interface ChatBubbleProps {
  message: TerminalMessage;
}

function isPreformatted(text: string): boolean {
  return text.includes("\n") && text.length > 60;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const { type, text, component } = message;

  // System messages: subtle centered
  if (type === "system") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex justify-center py-2"
      >
        <span className="text-xs text-[hsl(var(--muted-foreground))] font-mono">
          {text}
        </span>
      </motion.div>
    );
  }

  // User messages: right-aligned with purple tint
  if (type === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-end mb-3"
      >
        <div className="max-w-[70%] bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary)/0.2)] text-[hsl(var(--foreground))] rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
          {component ? (
            component
          ) : text ? (
            isPreformatted(text) ? (
              <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-[hsl(var(--foreground))]">
                {text}
              </pre>
            ) : (
              <p className="text-sm leading-relaxed text-[hsl(var(--foreground))]">
                {text}
              </p>
            )
          ) : null}
        </div>
      </motion.div>
    );
  }

  // Error messages: left-aligned red
  if (type === "error") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-start mb-3"
      >
        <div className="max-w-[70%] bg-[hsl(var(--destructive)/0.1)] border border-[hsl(var(--destructive)/0.2)] text-[hsl(var(--destructive-foreground))] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
          {component ? (
            component
          ) : text ? (
            isPreformatted(text) ? (
              <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed">
                {text}
              </pre>
            ) : (
              <p className="text-sm leading-relaxed">{text}</p>
            )
          ) : null}
        </div>
      </motion.div>
    );
  }

  // AI messages: left-aligned neutral
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start mb-3"
    >
      {component ? (
        <div className="max-w-[85%]">{component}</div>
      ) : (
        <div className="max-w-[70%] bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
          {text && (
            isPreformatted(text) ? (
              <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-[hsl(var(--foreground))]">
                {text}
              </pre>
            ) : (
              <p className="text-sm leading-relaxed text-[hsl(var(--foreground))]">
                {text}
              </p>
            )
          )}
        </div>
      )}
    </motion.div>
  );
}
