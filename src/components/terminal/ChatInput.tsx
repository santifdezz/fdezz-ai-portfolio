"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isProcessing?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSubmit,
  isProcessing = false,
  placeholder = "Ask me something...",
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSubmit(input.trim());
      setInput("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-6 md:px-8 py-4 border-t border-[hsl(var(--border))]"
    >
      <div className="max-w-4xl mx-auto flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={isProcessing}
          className="flex-1 px-4 py-2.5 bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          autoFocus
        />
        <motion.button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </motion.button>
      </div>
    </form>
  );
}
