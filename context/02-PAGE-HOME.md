# BATCH 2 — Terminal UI (Parte 2: Home Page)

## Objetivo
Crear la página principal (`/`) que muestre la terminal.

---

## Archivo: `src/app/page.tsx`

```typescript
"use client";

import { Terminal } from "@/components/terminal/Terminal";

export default function Home() {
  return (
    <main className="w-full h-screen bg-dark overflow-hidden">
      <Terminal />
    </main>
  );
}
```

---

## Verificar que funciona

1. Ejecutar:
```bash
npm run dev
```

2. Ir a `http://localhost:3000`

3. Deberías ver:
   - Boot sequence con mensajes
   - Welcome messages
   - Terminal input lista
   - Sugerencias de comandos cuando escribas `/`

---

## Layout completo (opcional)

Si quieres un layout más complejo con paneles extras:

```typescript
"use client";

import { Terminal } from "@/components/terminal/Terminal";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-dark text-[#e6f7ff]">
      {/* Fondo con grid opcional */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,...')] opacity-5 pointer-events-none" />

      {/* Layout principal */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-screen">
        {/* Columna izquierda - Sistema Status (opcional) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
          className="hidden lg:block border border-cyan-500/40 rounded-lg p-4 bg-[#050505] overflow-hidden"
        >
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 mb-4">
            System Status
          </h2>
          <div className="space-y-2 text-xs text-slate-400">
            <div>Developer: Carlos</div>
            <div>Status: <span className="text-emerald-400">ONLINE</span></div>
            <div>Projects: 8</div>
            <div>Uptime: 100%</div>
          </div>
        </motion.div>

        {/* Columna central - Terminal (principal) */}
        <div className="lg:col-span-2">
          <Terminal />
        </div>

        {/* Columna derecha - Quick links (opcional) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.5 }}
          className="hidden lg:block border border-cyan-500/40 rounded-lg p-4 bg-[#050505] overflow-hidden"
        >
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 mb-4">
            Quick Links
          </h2>
          <div className="space-y-2">
            <a
              href="https://github.com/tu-usuario"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-cyan-400 hover:text-cyan-300 transition"
            >
              → GitHub
            </a>
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-cyan-400 hover:text-cyan-300 transition"
            >
              → Download CV
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // Trigger /help command
              }}
              className="block text-xs text-cyan-400 hover:text-cyan-300 transition"
            >
              → Help
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
```

---

## Si quieres un dashboard más visual

Alternativa más "JARVIS" con múltiples paneles:

```typescript
"use client";

import { Terminal } from "@/components/terminal/Terminal";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-dark text-[#e6f7ff] p-4">
      {/* Grid de 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Panel 1: Skill Matrix */}
        <SkillMatrixPanel />

        {/* Panel 2: Project Index */}
        <ProjectIndexPanel />
      </div>

      {/* Terminal ocupando todo el ancho abajo */}
      <Terminal />
    </main>
  );
}

function SkillMatrixPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-cyan-500/40 rounded-lg p-4 bg-[#050505]"
    >
      <h2 className="text-xs uppercase tracking-widest text-cyan-400 mb-4">
        Skill Matrix
      </h2>
      <div className="space-y-2 text-xs text-slate-300">
        <div className="flex justify-between">
          <span>Python</span>
          <span className="text-emerald-400">████████████</span>
        </div>
        <div className="flex justify-between">
          <span>Machine Learning</span>
          <span className="text-emerald-400">██████████</span>
        </div>
        <div className="flex justify-between">
          <span>Data Engineering</span>
          <span className="text-emerald-400">███████████</span>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectIndexPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="border border-cyan-500/40 rounded-lg p-4 bg-[#050505]"
    >
      <h2 className="text-xs uppercase tracking-widest text-cyan-400 mb-4">
        Project Index
      </h2>
      <div className="space-y-2 text-xs text-slate-300">
        <div className="text-cyan-400">[RAG System]</div>
        <div className="text-cyan-400">[Data Platform]</div>
        <div className="text-cyan-400">[Recommender Engine]</div>
      </div>
    </motion.div>
  );
}
```

---

## ✅ Checklist

- [ ] Archivo `src/app/page.tsx` creado
- [ ] Terminal funciona en home
- [ ] Boot sequence visible
- [ ] Comandos procesables

**Siguiente paso:** → `03-PAGES.md`
