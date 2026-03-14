"use client";

import { useState, useEffect } from "react";

interface TypingLineProps {
  text: string;
  delay?: number;
  onComplete?: () => void;
  className?: string;
}

export function TypingLine({ text, delay = 25, onComplete, className }: TypingLineProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);

    if (!text) {
      setDone(true);
      onComplete?.();
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, delay);

    return () => clearInterval(interval);
  }, [text, delay, onComplete]);

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="animate-blink">▋</span>}
    </span>
  );
}
