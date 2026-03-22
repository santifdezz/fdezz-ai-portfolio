"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import type { Locale } from "@/lib/terminalTypes";

export type EchoState = "idle" | "wave" | "happy" | "thinking";

interface EchoProps {
  locale?: Locale;
  onSendMessage?: (msg: string) => void;
  echoState?: EchoState;
}

// SVG arm paths per state (M startX startY Q controlX controlY endX endY)
const LEFT_ARM: Record<EchoState, string> = {
  idle:     "M 22 70 Q 9 80 13 93",
  wave:     "M 22 70 Q 9 80 13 93",
  happy:    "M 20 66 Q 7 52 16 42",
  thinking: "M 22 70 Q 9 80 13 93",
};

const RIGHT_ARM: Record<EchoState, string> = {
  idle:     "M 78 70 Q 91 80 87 93",
  wave:     "M 80 60 Q 96 38 86 24",
  happy:    "M 80 66 Q 93 52 84 42",
  thinking: "M 78 66 Q 88 55 72 52",
};

const BUBBLE_TEXT: Record<EchoState, Record<Locale, string>> = {
  idle:     { en: "Hi! I'm ECHO 👋", es: "¡Hola! Soy ECHO 👋" },
  wave:     { en: "Ask me anything!", es: "¡Pregúntame lo que quieras!" },
  happy:    { en: "Nice to meet you! 🎉", es: "¡Encantado de conocerte! 🎉" },
  thinking: { en: "Let me think...", es: "Déjame pensar..." },
};

export function Echo({ locale = "es", onSendMessage, echoState: externalState }: EchoProps) {
  const [state, setState] = useState<EchoState>("idle");
  const [blink, setBlink] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const waveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeState = externalState ?? state;
  const isES = locale === "es";

  // Blink randomly
  useEffect(() => {
    const schedule = () => {
      const delay = 2500 + Math.random() * 3500;
      return setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          schedule();
        }, 130);
      }, delay);
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  // Auto-greet once after 3s
  useEffect(() => {
    if (hasGreeted || externalState) return;
    const t = setTimeout(() => {
      triggerWave();
      setHasGreeted(true);
    }, 3000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasGreeted, externalState]);

  const triggerWave = useCallback(() => {
    if (externalState) return;
    if (waveTimeoutRef.current) clearTimeout(waveTimeoutRef.current);
    setState("wave");
    setShowBubble(true);
    waveTimeoutRef.current = setTimeout(() => {
      setState("idle");
      setTimeout(() => setShowBubble(false), 1800);
    }, 2200);
  }, [externalState]);

  const handleClick = () => {
    if (externalState) {
      onSendMessage?.(isES ? "hola" : "hello");
      return;
    }
    triggerWave();
    onSendMessage?.(isES ? "hola" : "hello");
  };

  const leftArm = LEFT_ARM[activeState];
  const rightArm = RIGHT_ARM[activeState];

  return (
    <div className="hidden md:flex fixed bottom-5 right-5 z-50 flex-col items-center gap-1 pointer-events-none">
      {/* Speech bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.75, y: 6 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="font-ui bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl rounded-br-none px-3 py-2 text-xs text-[hsl(var(--foreground))] max-w-[170px] shadow-lg mb-1 pointer-events-none"
          >
            {BUBBLE_TEXT[activeState][locale]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character wrapper — floats */}
      <motion.div
        className="pointer-events-auto cursor-pointer select-none"
        style={{ transformOrigin: "center bottom" }}
        animate={
          activeState === "happy"
            ? { y: [0, -10, 0, -6, 0], scaleY: [1, 1.06, 0.96, 1.03, 1], scaleX: [1, 0.95, 1.04, 0.98, 1] }
            : { y: [0, -6, 0], rotate: [-0.5, 0.5, -0.5] }
        }
        transition={
          activeState === "happy"
            ? { duration: 0.75, ease: "easeInOut", repeat: 1 }
            : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
        }
        onClick={handleClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        title="ECHO — click me!"
      >
        <svg
          width="76"
          height="92"
          viewBox="0 0 100 118"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Drop shadow */}
          <ellipse cx="50" cy="116" rx="24" ry="5" fill="black" opacity="0.12" />

          {/* ── LEFT ARM ── */}
          <motion.path
            d={leftArm}
            animate={{ d: leftArm }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            stroke="#E04848"
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />

          {/* ── RIGHT ARM ── */}
          <motion.path
            d={rightArm}
            animate={{ d: rightArm }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            stroke="#E04848"
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />

          {/* ── BODY ── */}
          <ellipse cx="50" cy="82" rx="30" ry="31" fill="#FF6B6B" />

          {/* Body belly highlight */}
          <ellipse cx="50" cy="87" rx="17" ry="19" fill="#FFB3B3" opacity="0.32" />

          {/* ── HEAD ── */}
          <circle cx="50" cy="40" r="27" fill="#FF6B6B" />

          {/* Head specular */}
          <ellipse cx="42" cy="29" rx="11" ry="7" fill="white" opacity="0.14" />

          {/* ── EYES ── */}
          {/* Left eye */}
          <circle cx="40" cy="38" r="8" fill="#1a1a2e" />
          <circle cx="37.5" cy="35.5" r="2.5" fill="white" />
          {/* Left blink overlay */}
          {blink && <rect x="32" y="35" width="16" height="5" rx="2.5" fill="#FF6B6B" />}

          {/* Right eye */}
          <circle cx="60" cy="38" r="8" fill="#1a1a2e" />
          <circle cx="57.5" cy="35.5" r="2.5" fill="white" />
          {/* Right blink overlay */}
          {blink && <rect x="52" y="35" width="16" height="5" rx="2.5" fill="#FF6B6B" />}

          {/* Happy eye arcs (replaces circles when happy) */}
          {activeState === "happy" && (
            <>
              <path d="M 32 38 Q 40 30 48 38" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 52 38 Q 60 30 68 38" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* Thinking look (pupils shift up-left) */}
          {activeState === "thinking" && (
            <>
              <circle cx="35.5" cy="33.5" r="2.5" fill="white" />
              <circle cx="55.5" cy="33.5" r="2.5" fill="white" />
            </>
          )}

          {/* ── MOUTH ── */}
          <motion.path
            animate={{
              d: activeState === "happy"
                ? "M 39 50 Q 50 60 61 50"
                : activeState === "thinking"
                ? "M 44 50 Q 50 50 56 50"
                : "M 43 50 Q 50 56 57 50",
            }}
            transition={{ duration: 0.3 }}
            stroke="#C03030"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Blush cheeks when happy */}
          {activeState === "happy" && (
            <>
              <ellipse cx="32" cy="48" rx="7" ry="4.5" fill="#E04848" opacity="0.25" />
              <ellipse cx="68" cy="48" rx="7" ry="4.5" fill="#E04848" opacity="0.25" />
            </>
          )}

          {/* ── ANTENNA ── */}
          <line x1="50" y1="13" x2="50" y2="5" stroke="#C03030" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="3" r="4" fill="#FFD700" />
          {/* Antenna glow pulse */}
          <motion.circle
            cx="50" cy="3" r="7"
            fill="#FFD700"
            animate={{ opacity: [0, 0.45, 0], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "50px 3px" }}
          />

          {/* ── FEET ── */}
          <ellipse cx="39" cy="111" rx="11.5" ry="6" fill="#C03030" opacity="0.75" />
          <ellipse cx="61" cy="111" rx="11.5" ry="6" fill="#C03030" opacity="0.75" />
        </svg>
      </motion.div>

      {/* Label */}
      <p className="font-ui text-[9px] font-semibold tracking-widest text-[hsl(var(--muted-foreground))] opacity-60">
        ECHO
      </p>
    </div>
  );
}
