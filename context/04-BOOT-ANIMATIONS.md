# BATCH 4 — Boot Screen + Animaciones

## Objetivo
Hacer la interfaz más vistosa con Framer Motion y una pantalla de boot impresionante.

---

## Archivo 1: `src/components/terminal/BootScreen.tsx`

Pantalla inicial antes de la terminal.

```typescript
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface BootScreenProps {
  onBootComplete: () => void;
}

export function BootScreen({ onBootComplete }: BootScreenProps) {
  const [modules, setModules] = useState<
    Array<{ name: string; loaded: boolean }>
  >([
    { name: "developer profile", loaded: false },
    { name: "project index", loaded: false },
    { name: "skill matrix", loaded: false },
    { name: "ai interface", loaded: false },
  ]);

  useEffect(() => {
    // Animar carga de módulos secuencialmente
    modules.forEach((module, idx) => {
      setTimeout(() => {
        setModules((prev) =>
          prev.map((m, i) =>
            i === idx ? { ...m, loaded: true } : m
          )
        );

        // Al cargar el último módulo, completar boot
        if (idx === modules.length - 1) {
          setTimeout(onBootComplete, 800);
        }
      }, (idx + 1) * 400);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="w-full h-screen bg-dark text-[#e6f7ff] flex items-center justify-center font-mono"
    >
      <div className="max-w-md text-center space-y-8">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl uppercase tracking-widest text-cyan-400 mb-2">
            AI System
          </h1>
          <p className="text-xs text-slate-500">v1.0</p>
        </motion.div>

        {/* Loading sequence */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <p className="text-xs text-slate-500 mb-4">Initializing modules...</p>

          {modules.map((module, idx) => (
            <motion.div
              key={module.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (idx + 1) * 0.4 }}
              className="flex items-center gap-3"
            >
              <span className="text-xs text-slate-500">[</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: module.loaded ? 1 : 0 }}
                className="text-emerald-400"
              >
                ✓
              </motion.span>
              <span
                className={`text-xs ${
                  module.loaded ? "text-cyan-400" : "text-slate-600"
                }`}
              >
                {module.name}
              </span>
              <span className="text-xs text-slate-500">]</span>
            </motion.div>
          ))}
        </motion.div>

        {/* System ready */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6 }}
          className="pt-4 border-t border-cyan-500/30"
        >
          <p className="text-xs text-emerald-400">system ready</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
```

---

## Archivo 2: `src/components/terminal/TerminalWithBoot.tsx`

Wrapper que muestra boot primero, luego terminal.

```typescript
"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Terminal } from "./Terminal";
import { BootScreen } from "./BootScreen";

export function TerminalWithBoot() {
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!bootComplete ? (
        <BootScreen key="boot" onBootComplete={() => setBootComplete(true)} />
      ) : (
        <Terminal key="terminal" />
      )}
    </AnimatePresence>
  );
}
```

---

## Archivo 3: Actualizar `src/app/page.tsx`

Cambiar para usar el boot screen.

```typescript
"use client";

import { TerminalWithBoot } from "@/components/terminal/TerminalWithBoot";

export default function Home() {
  return (
    <main className="w-full h-screen bg-dark overflow-hidden">
      <TerminalWithBoot />
    </main>
  );
}
```

---

## Archivo 4: `src/components/layouts/PageLayout.tsx`

Wrapper para todas las páginas con estilos consistentes.

```typescript
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function PageLayout({
  title,
  subtitle,
  children,
}: PageLayoutProps) {
  return (
    <main className="min-h-screen bg-dark text-[#e6f7ff] p-4">
      {/* Fondo con grid */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-cyan-500/5 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="border-b border-cyan-500/30 pb-4">
            <div className="text-xs uppercase tracking-widest text-cyan-400 mb-2">
              {"←"} <Link href="/">back to terminal</Link>
            </div>
            <h1 className="text-2xl uppercase tracking-widest text-cyan-300 mb-1">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-500">{subtitle}</p>
            )}
          </div>
        </motion.div>

        {/* Content */}
        {children}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-6 border-t border-cyan-500/30 text-xs text-cyan-400"
        >
          <Link href="/" className="hover:text-cyan-300 transition">
            ← back to terminal
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
```

---

## Archivo 5: `src/lib/animationVariants.ts`

Utilidades de animación reutilizables.

```typescript
import { Variants } from "framer-motion";

/**
 * Animación de fade in
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Animación de slide desde la izquierda
 */
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

/**
 * Animación de slide desde arriba
 */
export const slideInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

/**
 * Animación de escala
 */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

/**
 * Stagger (para listas)
 */
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

/**
 * Glow pulse
 */
export const glowPulse: Variants = {
  animate: {
    boxShadow: [
      "0 0 10px rgba(0, 229, 255, 0.3)",
      "0 0 20px rgba(0, 229, 255, 0.6)",
      "0 0 10px rgba(0, 229, 255, 0.3)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};
```

---

## Archivo 6: `src/components/terminal/IdleMode.tsx`

Sistema de idle mode (cuando usuario no interactúa).

```typescript
"use client";

import { useEffect, useState } from "react";
import { TerminalMessage } from "@/lib/terminalTypes";
import { idleResponse } from "@/lib/responses";
import { v4 as uuidv4 } from "uuid";

interface IdleModeProps {
  onIdle: (message: TerminalMessage) => void;
  timeout?: number;
}

export function IdleMode({ onIdle, timeout = 45000 }: IdleModeProps) {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Resetear timer cuando hay actividad
    const resetTimer = () => {
      setIsActive(true);
    };

    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    // Timer para idle
    const idleTimer = setTimeout(() => {
      setIsActive(false);
      onIdle({
        id: uuidv4(),
        type: "system",
        text: idleResponse,
      });
    }, timeout);

    return () => {
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      clearTimeout(idleTimer);
    };
  }, [timeout, onIdle]);

  return null; // Component sin render
}
```

---

## Archivo 7: `src/styles/animations.css`

Animaciones CSS customizadas.

```css
/* Glow animations */
@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 10px rgba(0, 229, 255, 0.3),
                inset 0 0 10px rgba(0, 229, 255, 0.1);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.6),
                inset 0 0 20px rgba(0, 229, 255, 0.2);
  }
}

.glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
}

/* Typing cursor */
@keyframes blink {
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0;
  }
}

.cursor {
  animation: blink 1s infinite;
}

/* Scan effect */
@keyframes scan {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 100%;
  }
}

.scan-effect {
  animation: scan 6s linear infinite;
  background: linear-gradient(
    180deg,
    rgba(0, 229, 255, 0.1) 0%,
    rgba(0, 229, 255, 0.03) 50%,
    rgba(0, 229, 255, 0.1) 100%
  );
  background-size: 100% 200%;
}

/* Float animation */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.float {
  animation: float 3s ease-in-out infinite;
}
```

---

## Cómo usar las animaciones

En tus componentes:

```typescript
import { motion } from "framer-motion";
import { slideInLeft, staggerContainer, glowPulse } from "@/lib/animationVariants";

export function MyComponent() {
  return (
    <motion.div
      variants={slideInLeft}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      Content
    </motion.div>
  );
}

// Para listas
<motion.div
  variants={staggerContainer}
  initial="initial"
  animate="animate"
>
  {items.map((item) => (
    <motion.div key={item.id} variants={staggerItem}>
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

---

## ✅ Checklist

- [ ] `BootScreen.tsx` creado
- [ ] `TerminalWithBoot.tsx` creado
- [ ] `PageLayout.tsx` creado
- [ ] `animationVariants.ts` creado
- [ ] `IdleMode.tsx` creado
- [ ] `animations.css` incluido en `globals.css`
- [ ] Boot screen funciona en home

**Siguiente paso:** → `05-DEPLOY.md`
