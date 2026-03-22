"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Echo } from "@/components/character/Echo";
import { calculateMonthsYears } from "@/lib/dateUtils";
import type { Locale } from "@/lib/terminalTypes";

interface LandingPageProps {
  locale: Locale;
  onExplore: () => void;
  onTour: () => void;
  onLocaleChange: (l: Locale) => void;
}

const COPY = {
  es: {
    name: "Santiago Fernández",
    role: "Data & AI Engineer",
    tagline: "Construyendo IA que funciona en producción.",
    explore: "Explorar Portfolio",
    tour: "Recorrido Guiado",
    hint: "Pulsa Enter para explorar",
    qaleon: "@ Qaleon",
    projects: "proyectos",
    records: "registros/mes",
    ai: "IA en prod.",
  },
  en: {
    name: "Santiago Fernández",
    role: "Data & AI Engineer",
    tagline: "Building AI systems that actually work in production.",
    explore: "Explore Portfolio",
    tour: "Guided Tour",
    hint: "Press Enter to explore",
    qaleon: "@ Qaleon",
    projects: "projects",
    records: "records/mo",
    ai: "AI in prod.",
  },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
});

export function LandingPage({ locale, onExplore, onTour, onLocaleChange }: LandingPageProps) {
  const t = COPY[locale];
  const qaleonStart = new Date(2025, 9, 14);
  const { display } = calculateMonthsYears(qaleonStart);
  const expDisplay = locale === "es"
    ? display.replace("months", "meses").replace("month", "mes").replace("years", "años").replace("year", "año")
    : display;

  // Enter key shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") onExplore();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onExplore]);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center px-6 overflow-hidden">

      {/* Language toggle — top right */}
      <div className="absolute top-5 right-5 flex gap-2 z-10">
        {(["es", "en"] as Locale[]).map((l) => (
          <motion.button
            key={l}
            onClick={() => onLocaleChange(l)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`font-ui px-3 py-1.5 text-xs font-semibold rounded transition-all ${
              locale === l
                ? "bg-[hsl(var(--coral)/0.2)] border border-[hsl(var(--coral)/0.5)] text-[hsl(var(--coral))]"
                : "bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
          >
            {l.toUpperCase()}
          </motion.button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center text-center max-w-2xl gap-6">

        {/* ECHO — large, waving */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Glow behind ECHO */}
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-20"
            style={{ background: "hsl(var(--coral))", transform: "scale(1.5)" }}
          />
          {/* Inline Echo in wave state, bigger */}
          <EchoLarge />
        </motion.div>

        {/* Name */}
        <motion.h1
          {...fadeUp(0.2)}
          className="font-ui text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] tracking-tight"
        >
          {t.name}
        </motion.h1>

        {/* Role */}
        <motion.p
          {...fadeUp(0.32)}
          className="font-ui text-lg md:text-xl font-semibold"
          style={{ color: "hsl(var(--coral))" }}
        >
          {t.role}
        </motion.p>

        {/* Tagline */}
        <motion.p
          {...fadeUp(0.42)}
          className="font-ui text-base text-[hsl(var(--muted-foreground))] max-w-md leading-relaxed"
        >
          {t.tagline}
        </motion.p>

        {/* Stats row */}
        <motion.div {...fadeUp(0.52)} className="flex flex-wrap justify-center gap-3">
          {[
            { value: expDisplay, label: t.qaleon },
            { value: "5+", label: t.projects },
            { value: "+1M", label: t.records },
            { value: "AI", label: t.ai },
          ].map((stat) => (
            <div
              key={stat.label}
              className="font-ui px-4 py-2 rounded-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-center"
            >
              <span className="font-bold text-[hsl(var(--foreground))]">{stat.value}</span>
              <span className="text-[hsl(var(--muted-foreground))] text-sm ml-1.5">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div {...fadeUp(0.62)} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <motion.button
            onClick={onExplore}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="font-ui flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold text-white shadow-lg transition-all"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(272 75% 50%))",
              boxShadow: "0 8px 24px hsl(272 75% 62% / 0.35)",
            }}
          >
            {t.explore}
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={onTour}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="font-ui flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold border transition-all"
            style={{
              borderColor: "hsl(var(--coral) / 0.5)",
              color: "hsl(var(--coral))",
              background: "hsl(var(--coral) / 0.08)",
            }}
          >
            <Sparkles className="w-4 h-4" />
            {t.tour}
          </motion.button>
        </motion.div>

        {/* Keyboard hint */}
        <motion.p
          {...fadeUp(0.75)}
          className="font-mono text-[11px] text-[hsl(var(--muted-foreground))] opacity-50"
        >
          {t.hint}
        </motion.p>
      </div>
    </div>
  );
}

/* Inline ECHO at larger size for the landing hero */
function EchoLarge() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0], rotate: [-0.5, 0.5, -0.5] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="130" height="156" viewBox="0 0 100 118" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shadow */}
        <ellipse cx="50" cy="116" rx="24" ry="5" fill="black" opacity="0.12" />
        {/* Left arm — idle */}
        <path d="M 22 70 Q 9 80 13 93" stroke="#E04848" strokeWidth="11" strokeLinecap="round" fill="none" />
        {/* Right arm — wave */}
        <path d="M 80 60 Q 96 38 86 24" stroke="#E04848" strokeWidth="11" strokeLinecap="round" fill="none" />
        {/* Body */}
        <ellipse cx="50" cy="82" rx="30" ry="31" fill="#FF6B6B" />
        <ellipse cx="50" cy="87" rx="17" ry="19" fill="#FFB3B3" opacity="0.32" />
        {/* Head */}
        <circle cx="50" cy="40" r="27" fill="#FF6B6B" />
        <ellipse cx="42" cy="29" rx="11" ry="7" fill="white" opacity="0.14" />
        {/* Eyes */}
        <circle cx="40" cy="38" r="8" fill="#1a1a2e" />
        <circle cx="37.5" cy="35.5" r="2.5" fill="white" />
        <circle cx="60" cy="38" r="8" fill="#1a1a2e" />
        <circle cx="57.5" cy="35.5" r="2.5" fill="white" />
        {/* Happy smile */}
        <path d="M 40 50 Q 50 59 60 50" stroke="#C03030" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Blush */}
        <ellipse cx="32" cy="48" rx="7" ry="4.5" fill="#E04848" opacity="0.2" />
        <ellipse cx="68" cy="48" rx="7" ry="4.5" fill="#E04848" opacity="0.2" />
        {/* Antenna */}
        <line x1="50" y1="13" x2="50" y2="5" stroke="#C03030" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="3" r="4" fill="#FFD700" />
        <motion.circle cx="50" cy="3" r="7" fill="#FFD700"
          animate={{ opacity: [0, 0.45, 0] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />
        {/* Feet */}
        <ellipse cx="39" cy="111" rx="11.5" ry="6" fill="#C03030" opacity="0.75" />
        <ellipse cx="61" cy="111" rx="11.5" ry="6" fill="#C03030" opacity="0.75" />
        {/* Hand wave detail */}
        <circle cx="86" cy="22" r="7" fill="#FF6B6B" />
        <circle cx="80" cy="16" r="4.5" fill="#FF6B6B" />
        <circle cx="92" cy="16" r="4.5" fill="#FF6B6B" />
      </svg>
    </motion.div>
  );
}
