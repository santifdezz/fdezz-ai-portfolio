"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface BootScreenProps {
  onBootComplete: () => void;
}

export default function BootScreen({ onBootComplete }: BootScreenProps) {
  const [bootSteps, setBootSteps] = useState<Array<{ step: string; status: "pending" | "active" | "complete" }>>([
    { step: "Initializing system modules", status: "pending" },
    { step: "Loading developer profile", status: "pending" },
    { step: "Indexing project database", status: "pending" },
    { step: "Establishing connections", status: "pending" },
    { step: "Compiling skill matrix", status: "pending" },
    { step: "System ready", status: "pending" },
  ]);

  useEffect(() => {
    let stepIndex = 0;

    const executeStep = () => {
      if (stepIndex < bootSteps.length) {
        // Mark current as active
        setBootSteps((prev) =>
          prev.map((s, i) =>
            i === stepIndex ? { ...s, status: "active" } : s
          )
        );

        // Mark as complete after delay
        setTimeout(() => {
          setBootSteps((prev) =>
            prev.map((s, i) =>
              i === stepIndex ? { ...s, status: "complete" } : s
            )
          );

          stepIndex++;

          if (stepIndex < bootSteps.length) {
            executeStep();
          } else {
            // Boot complete
            setTimeout(onBootComplete, 800);
          }
        }, 400);
      }
    };

    executeStep();
  }, [bootSteps, onBootComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 bg-gradient-to-br from-black via-slate-950 to-black text-cyan-50 font-mono flex items-center justify-center select-none z-50"
    >
      <div className="max-w-2xl w-full px-4 md:px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-2xl md:text-4xl font-bold text-cyan-400 mb-2 tracking-wider">
            AI SYSTEM
          </h1>
          <p className="text-cyan-400/60 text-xs md:text-sm tracking-widest">
            v2.1 — SANTI.DEV
          </p>
        </motion.div>

        {/* Boot Steps */}
        <div className="space-y-3 mb-12">
          {bootSteps.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-3 text-xs md:text-sm"
            >
              <span className="w-6 flex-shrink-0 text-center font-mono">
                {item.status === "complete" ? (
                  <span className="text-emerald-400">✓</span>
                ) : item.status === "active" ? (
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-cyan-400"
                  >
                    ●
                  </motion.span>
                ) : (
                  <span className="text-cyan-600">○</span>
                )}
              </span>
              <span
                className={`${
                  item.status === "complete"
                    ? "text-emerald-400"
                    : item.status === "active"
                      ? "text-cyan-300"
                      : "text-cyan-600/50"
                }`}
              >
                {item.step}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center text-xs text-cyan-400/40"
        >
          <p>System initialization complete. Booting terminal...</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
