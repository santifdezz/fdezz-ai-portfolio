"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import type { Locale } from "@/lib/terminalTypes";

const PLACEHOLDERS: Record<Locale, string[]> = {
  en: [
    "Ask about my projects...",
    "What AI systems have you built?",
    "Tell me about your ETL experience...",
    "How do you use RAG in production?",
    "What's your stack at Qaleon?",
    "Show me your skills...",
  ],
  es: [
    "Cuéntame sobre tus proyectos...",
    "¿Qué sistemas de IA has construido?",
    "Háblame de tu experiencia con ETL...",
    "¿Cómo usas RAG en producción?",
    "¿Cuál es tu stack en Qaleon?",
    "Muéstrame tus habilidades...",
  ],
};

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isProcessing?: boolean;
  locale?: Locale;
}

export function ChatInput({
  onSubmit,
  isProcessing = false,
  locale = "en",
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS[locale].length);
    }, 3500);
    return () => clearInterval(id);
  }, [locale]);

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
          placeholder={PLACEHOLDERS[locale][placeholderIdx]}
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
          <span className="hidden sm:inline">{locale === "es" ? "Enviar" : "Send"}</span>
        </motion.button>
      </div>
    </form>
  );
}
