"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypingLineProps {
  text: string;
  speed?: number; // milliseconds per character
  delay?: number; // delay before starting
  className?: string;
}

export default function TypingLine({
  text,
  speed = 25,
  delay = 0,
  className = "",
}: TypingLineProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (displayedText.length === text.length) {
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedText, text, speed]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay / 1000 }}
      className={className}
    >
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-1.5 h-4 ml-0.5 bg-cyan-400"
        />
      )}
    </motion.span>
  );
}
