# BATCH 0 — Setup Inicial

## Objetivo
Tener el esqueleto listo con Next.js, TypeScript y Tailwind.

---

## 1. Crear proyecto Next.js

```bash
npx create-next-app@latest ai-terminal-portfolio
```

**Responde así a las preguntas:**
```
✔ Would you like to use TypeScript? › Yes
✔ Would you like to use ESLint? › Yes
✔ Would you like to use Tailwind CSS? › Yes
✔ Would you like your code inside a `src/` directory? › Yes
✔ Would you like to use App Router? › Yes
✔ Would you like to use Turbopack for `next dev`? › No
✔ Would you like to customize the import alias? › No
```

---

## 2. Instalar dependencias adicionales

```bash
cd ai-terminal-portfolio
npm install framer-motion clsx uuid
```

**Versiones recomendadas:**
- `framer-motion`: ^10.x
- `clsx`: ^2.x
- `uuid`: ^9.x

---

## 3. Estructura de carpetas

Crea esta estructura dentro de `src/`:

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              (home + terminal)
│   ├── about/
│   │   └── page.tsx
│   ├── projects/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── skills/
│   │   └── page.tsx
│   └── contact/
│       └── page.tsx
├── components/
│   ├── terminal/
│   │   ├── Terminal.tsx
│   │   ├── TerminalHistory.tsx
│   │   ├── TerminalInput.tsx
│   │   ├── CommandSuggestions.tsx
│   │   └── TypingLine.tsx
│   └── layouts/
│       └── PageLayout.tsx
├── lib/
│   ├── commands.ts
│   ├── responses.ts
│   ├── terminalTypes.ts
│   └── useCommandHandler.ts
└── styles/
    └── globals.css
```

**Comando para crear estructura:**
```bash
mkdir -p src/components/terminal src/components/layouts src/lib
```

---

## 4. Configurar Tailwind (next.config.ts)

El archivo debería verse así (Next 14+):

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0a0a0a",
        terminal: "#050505",
        accent: "#00e5ff",
        neon: "#00f2ff",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
```

---

## 5. Configurar globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: #0a0a0a;
  color: #e6f7ff;
  font-family: "JetBrains Mono", monospace;
}

/* Terminal glow effect */
.terminal-glow {
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.25), 
              inset 0 0 20px rgba(0, 229, 255, 0.1);
}

.terminal-border {
  border: 1px solid rgba(0, 229, 255, 0.4);
}

/* Typing cursor */
.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Glow pulse */
@keyframes glow-pulse {
  0%, 100% { text-shadow: 0 0 5px rgba(0, 229, 255, 0.5); }
  50% { text-shadow: 0 0 20px rgba(0, 229, 255, 0.8); }
}

.glow-pulse {
  animation: glow-pulse 2s infinite;
}
```

---

## 6. Configurar layout.tsx

```typescript
import type { Metadata } from "next";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "AI Terminal Portfolio",
  description: "Interactive AI-powered developer portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dark text-[#e6f7ff] font-mono">
        {children}
      </body>
    </html>
  );
}
```

---

## 7. Verificar instalación

```bash
npm run dev
```

Debería estar disponible en `http://localhost:3000`

---

## ✅ Checklist Batch 0

- [ ] `create-next-app` ejecutado
- [ ] Dependencias instaladas (`framer-motion`, `clsx`, `uuid`)
- [ ] Estructura de carpetas creada
- [ ] `next.config.ts` configurado
- [ ] `globals.css` con estilos base
- [ ] `layout.tsx` configurado
- [ ] `npm run dev` funciona

**Siguiente paso:** → Ir a `01-TYPES.md` (Batch 1)