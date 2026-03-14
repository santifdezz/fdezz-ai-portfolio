"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import type { Locale } from "@/lib/terminalTypes";

interface TourStep {
  id: string;
  label: string;
  cmd: string;
}

interface TourPlayerProps {
  steps: TourStep[];
  locale?: Locale;
  onCommandRun: (cmd: string) => void;
  onExit: () => void;
  panelContent?: React.ReactNode;
}

export function TourPlayer({
  steps,
  locale = "en",
  onCommandRun,
  onExit,
  panelContent,
}: TourPlayerProps) {
  const isES = locale === "es";
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onExit();
    } else {
      setCurrentStep((prev) => prev + 1);
      onCommandRun(steps[currentStep + 1].cmd);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4"
    >
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-purple-300">
            {isES ? "Recorrido" : "Tour"}: {currentStep + 1}/{steps.length}
          </p>
          <motion.button
            onClick={onExit}
            className="p-1 hover:bg-purple-500/20 rounded text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="h-1.5 bg-[hsl(var(--secondary))] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Step Navigation Dots */}
      <div className="flex gap-1 justify-center">
        {steps.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => {
              setCurrentStep(idx);
              onCommandRun(steps[idx].cmd);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentStep
                ? "w-6 bg-purple-500"
                : idx < currentStep
                  ? "bg-purple-500/50"
                  : "bg-[hsl(var(--secondary))]"
            }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>

      {/* Content */}
      {panelContent && (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {panelContent}
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-2 pt-2">
        {currentStep > 0 && (
          <motion.button
            onClick={() => {
              setCurrentStep((prev) => prev - 1);
              onCommandRun(steps[currentStep - 1].cmd);
            }}
            className="flex-1 py-2.5 px-4 bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary)/0.8)] border border-purple-400/30 text-[hsl(var(--foreground))] font-semibold rounded-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isES ? "← Anterior" : "← Previous"}
          </motion.button>
        )}

        <motion.button
          onClick={handleNext}
          className={`flex-1 py-2.5 px-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            currentStep > 0 ? "" : ""
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLast ? (
            isES ? (
              "Completado ✓"
            ) : (
              "Done ✓"
            )
          ) : (
            <>
              {isES ? "Siguiente" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
