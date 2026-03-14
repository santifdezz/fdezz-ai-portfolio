"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, MessageCircle } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  showAvatar?: boolean;
}

export function ChatMessage({ role, content, showAvatar = true }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {showAvatar && (
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? "bg-purple-500/20 border border-purple-400"
              : "bg-cyan-500/20 border border-purple-400"
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4 text-purple-300" />
          ) : (
            <MessageCircle className="w-4 h-4 text-purple-400" />
          )}
        </div>
      )}

      <div className={`flex-1 ${isUser ? "text-right" : "text-left"}`}>
        <div
          className={`inline-block max-w-md px-4 py-3 rounded-lg ${
            isUser
              ? "bg-purple-500/15 border border-purple-400/30 text-[hsl(var(--foreground))]"
              : "bg-[hsl(var(--secondary)/0.5)] border border-purple-400/20 text-[hsl(var(--foreground))]"
          }`}
        >
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    </motion.div>
  );
}
