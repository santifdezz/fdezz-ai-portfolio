"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Play } from "lucide-react";
import type { Locale } from "@/lib/portfolio-content";

interface TourOption {
  id: string;
  label: string;
  labelES: string;
  cmd: string;
}

const DEFAULT_OPTIONS: TourOption[] = [
  { id: "about", label: "About Me", labelES: "Sobre Mí", cmd: "/about" },
  { id: "projects", label: "Projects", labelES: "Proyectos", cmd: "/projects" },
  { id: "timeline", label: "Timeline", labelES: "Línea de Tiempo", cmd: "/timeline" },
  { id: "services", label: "Services", labelES: "Servicios", cmd: "/services" },
  { id: "contact", label: "Contact", labelES: "Contacto", cmd: "/contact" },
];

interface TourSelectorProps {
  locale?: Locale;
  onStartTour: (selectedOptions: TourOption[]) => void;
}

export function TourSelector({ locale = "en", onStartTour }: TourSelectorProps) {
  const isES = locale === "es";
  const [selected, setSelected] = useState<TourOption[]>(DEFAULT_OPTIONS);

  const toggleOption = (id: string) => {
    setSelected((prev) => {
      if (prev.some((opt) => opt.id === id)) {
        return prev.filter((opt) => opt.id !== id);
      } else {
        const option = DEFAULT_OPTIONS.find((opt) => opt.id === id);
        if (option) {
          return [...prev, option];
        }
        return prev;
      }
    });
  };

  const moveUp = (index: number) => {
    if (index > 0) {
      const newSelected = [...selected];
      [newSelected[index], newSelected[index - 1]] = [newSelected[index - 1], newSelected[index]];
      setSelected(newSelected);
    }
  };

  const moveDown = (index: number) => {
    if (index < selected.length - 1) {
      const newSelected = [...selected];
      [newSelected[index], newSelected[index + 1]] = [newSelected[index + 1], newSelected[index]];
      setSelected(newSelected);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-md mx-auto p-5 bg-gradient-to-b from-purple-500/10 to-purple-500/5 rounded-xl border border-purple-400/30 shadow-lg shadow-purple-500/10"
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-[hsl(var(--foreground))] mb-1">
          {isES ? "✨ Personaliza Tu Recorrido" : "✨ Customize Your Tour"}
        </h3>
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          {isES
            ? "Selecciona qué ver y en qué orden"
            : "Select what to see and in which order"}
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {DEFAULT_OPTIONS.map((option) => {
            const isChecked = selected.some((opt) => opt.id === option.id);
            const index = selected.findIndex((opt) => opt.id === option.id);

            return (
              <motion.div
                key={option.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={`p-3 rounded-lg border transition-all ${
                  isChecked
                    ? "bg-purple-500/15 border-purple-400/50"
                    : "bg-[hsl(var(--secondary)/0.3)] border-purple-400/20 opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox */}
                  <motion.button
                    onClick={() => toggleOption(option.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      isChecked
                        ? "bg-purple-500 border-purple-500"
                        : "border-purple-400/50 hover:border-purple-400"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isChecked && <span className="text-white text-xs font-bold">✓</span>}
                  </motion.button>

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                      {isES ? option.labelES : option.label}
                    </p>
                  </div>

                  {/* Order Controls */}
                  {isChecked && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex items-center gap-1 flex-shrink-0"
                    >
                      <span className="text-xs text-purple-300 font-semibold mr-1">
                        #{index + 1}
                      </span>
                      <motion.button
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="p-1 hover:bg-purple-500/20 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronUp className="w-3 h-3 text-purple-300" />
                      </motion.button>
                      <motion.button
                        onClick={() => moveDown(index)}
                        disabled={index === selected.length - 1}
                        className="p-1 hover:bg-purple-500/20 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronDown className="w-3 h-3 text-purple-300" />
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Start Button */}
      <motion.button
        onClick={() => onStartTour(selected)}
        disabled={selected.length === 0}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Play className="w-4 h-4" />
        {isES ? "Comenzar Recorrido" : "Start Tour"}
      </motion.button>

      {/* Info Text */}
      <p className="text-xs text-[hsl(var(--muted-foreground))] text-center mt-3">
        {isES
          ? "Puedes cambiar de opinión más tarde"
          : "You can change your mind later"}
      </p>
    </motion.div>
  );
}
