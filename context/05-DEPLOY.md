# BATCH 5 — Deploy y Optimizaciones

## Objetivo
Dejar el proyecto listo para producción y subir a Vercel.

---

## 1. Limpieza y optimizaciones

### Remover dependencias no usadas

```bash
npm ls
# Eliminar lo que no uses:
npm uninstall package-name
```

### Optimizar imports

En tus archivos, asegúrate de que los imports son específicos:

```typescript
// ❌ NO hagas esto
import * as everything from "framer-motion";

// ✅ Haz esto
import { motion, AnimatePresence } from "framer-motion";
```

---

## 2. Archivo `.env.local` (desarrollo)

```
# .env.local
NEXT_PUBLIC_GITHUB_URL=https://github.com/tu-usuario
NEXT_PUBLIC_EMAIL=hello@example.com
```

---

## 3. Configurar `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Habilitar static export si quieres GitHub Pages
  // output: "export",
  
  // Optimizaciones
  poweredByHeader: false,
  
  // Configurar headers de seguridad
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
      ],
    },
  ],

  // Configurar rewrites para API (si la necesitas después)
  // rewrites: async () => ({
  //   afterFiles: [
  //     {
  //       source: "/api/:path*",
  //       destination: "https://api.example.com/:path*",
  //     },
  //   ],
  // }),
};

export default nextConfig;
```

---

## 4. Crear archivo `.gitignore`

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/

# Production
build/

# Misc
.DS_Store
*.pem
.env
.env.local
.env.*.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.idea/
.vscode/
*.swp
*.swo
```

---

## 5. README.md para el repo

```markdown
# AI Terminal Portfolio

Interactive portfolio for an AI Developer / Data Engineer presented as a terminal-style AI interface.

## 🎯 Features

- **Terminal UI**: Fully interactive command-line interface
- **AI System Aesthetic**: JARVIS-like interface with animations
- **100% Frontend**: No external APIs or LLM calls
- **Fast & Free**: Optimized for speed, deployable on Vercel/GitHub Pages
- **Interactive Commands**: `/help`, `/projects`, `/skills`, `/contact`, and more
- **Easter Eggs**: Hidden commands for fun interactions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/tu-usuario/ai-terminal-portfolio.git
cd ai-terminal-portfolio
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Available Commands

### Core Commands
- `/help` - Show all available commands
- `/about` - Developer profile
- `/projects` - View all projects
- `/project [id]` - View specific project
- `/skills` - Skill matrix
- `/contact` - Communication channels
- `/github` - Open GitHub profile
- `/cv` - Download CV

### System Commands
- `/system` - System status
- `/architecture` - Architecture overview
- `/timeline` - Development timeline

### Easter Eggs
- `/coffee` - Developer needs caffeine
- `/whoami` - Who are you?
- `/train` - Training sequence
- `/joke` - Random joke
- `/hack` - Security test

## 🛠 Tech Stack

- **Frontend**: Next.js 14+ with React
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Hosting**: Vercel or GitHub Pages

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── about/page.tsx
│   ├── projects/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── skills/page.tsx
│   └── contact/page.tsx
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
│   ├── terminalTypes.ts
│   ├── commands.ts
│   ├── responses.ts
│   ├── useCommandHandler.ts
│   └── animationVariants.ts
└── styles/
    └── globals.css
```

## 🎨 Customization

### Change Developer Info

Edit `src/lib/responses.ts`:
```typescript
export const systemResponse = `SYSTEM STATUS

Developer: YOUR_NAME
Role: YOUR_ROLE
...`;
```

### Change Colors

Edit `next.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      dark: "#0a0a0a",
      terminal: "#050505",
      accent: "#00e5ff",
    },
  },
},
```

### Add New Commands

1. Add to `CommandKey` in `src/lib/terminalTypes.ts`
2. Add to command list in `src/lib/commands.ts`
3. Add response in `src/lib/responses.ts`
4. Add logic in `src/lib/useCommandHandler.ts`

## 🚀 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Auto-deploy on every push

```bash
# One-time setup
npm i -g vercel
vercel
```

### Deploy to GitHub Pages

Update `next.config.ts`:
```typescript
output: "export",
```

Then:
```bash
npm run build
git add out/
git commit -m "Deploy"
git push
```

Enable GitHub Pages in repository settings to deploy from `out/` branch.

## 📝 License

MIT License - feel free to use this template for your own portfolio!

## 🤝 Contributing

Feel free to fork and customize this portfolio for your own use.

---

Made with ❤️ as a terminal-style AI portfolio
```

---

## 6. Crear `package.json` scripts

Tu `package.json` debería tener:

```json
{
  "name": "ai-terminal-portfolio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "next": "^14.0.0",
    "framer-motion": "^10.x",
    "clsx": "^2.x",
    "uuid": "^9.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/node": "^20.x",
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x",
    "eslint": "^8.x",
    "eslint-config-next": "^14.x"
  }
}
```

---

## 7. Checklist de optimización

```bash
# Verificar TypeScript
npm run type-check

# Linting
npm run lint

# Build para producción
npm run build

# Probar build local
npm run start
```

---

## 8. Metricas de rendimiento

Para verificar que tu sitio es rápido:

- Core Web Vitals en Google PageSpeed Insights
- Lighthouse score
- Bundle size con `next-bundle-analyzer`

---

## 9. Variables de entorno de ejemplo

```bash
# .env.example
NEXT_PUBLIC_GITHUB_URL=https://github.com/tu-usuario
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/tu-usuario
NEXT_PUBLIC_EMAIL=hello@example.com
```

---

## 10. GitHub Actions (opcional)

Crear `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - run: npm run type-check
      - run: npm run lint
```

---

## 11. Vercel Deployment

1. Conecta tu repo en [vercel.com](https://vercel.com)
2. Vercel automáticamente detectará Next.js
3. Configura variables de entorno en settings
4. Deploy automático en cada push

---

## 12. Actualizar CV

Si tienes un CV en PDF:

```bash
# Copiar PDF a public/
cp tu-cv.pdf public/cv.pdf
```

Luego en `useCommandHandler.ts`:

```typescript
if (cmd === "/cv") {
  window.open("/cv.pdf", "_blank");
}
```

---

## ✅ Checklist Final

- [ ] `npm run type-check` pasa
- [ ] `npm run lint` pasa
- [ ] `npm run build` pasa
- [ ] README.md creado y actualizado
- [ ] `.env.example` creado
- [ ] `.gitignore` creado
- [ ] Respuestas personalizadas con tu info
- [ ] GitHub repo creado
- [ ] Vercel conectado
- [ ] Deploy exitoso
- [ ] Dominio personalizado (opcional)

---

## Próximos pasos opcionales

- Añadir más proyectos
- Integrar analytics (Google Analytics)
- Añadir sistema de comments
- Crear versiones en otros idiomas
- Mejorar SEO con metadatos dinámicos
- Añadir dark/light theme switcher

---

## 🎉 ¡Felicidades!

Tu portfolio AI terminal está listo para mostrar a recruiters y el mundo.

Sigue iterando, añade más proyectos, y diviértete con la terminal.
