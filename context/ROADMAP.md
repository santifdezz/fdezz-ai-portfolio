# 🚀 AI Terminal Portfolio — Roadmap Completo

Documentación modular para construir tu portfolio tipo **JARVIS** sin perder consistencia.

---

## 📊 Estructura de Batches

Todo está dividido en **5 Batches** (fases) con documentos pequeños y enfocados.

```
00-SETUP.md
    ↓
BATCH 1: Terminal Logic
├── 01-TYPES.md
├── 01-COMMANDS.md
├── 01-RESPONSES.md
└── 01-HANDLER.md
    ↓
BATCH 2: Terminal UI
├── 02-TERMINAL-COMPONENTS.md
└── 02-PAGE-HOME.md
    ↓
BATCH 3: Pages
└── 03-PAGES.md
    ↓
BATCH 4: Polish & Animations
└── 04-BOOT-ANIMATIONS.md
    ↓
BATCH 5: Deploy
└── 05-DEPLOY.md
```

---

## 🎯 Qué hace cada archivo

### BATCH 0: Setup Inicial
**archivo:** `00-SETUP.md`

- Crear proyecto Next.js
- Instalar dependencias (`framer-motion`, `clsx`, `uuid`)
- Configurar estructura de carpetas
- Setup de Tailwind y globals.css

**Tiempo:** ~10 minutos

---

### BATCH 1: Terminal Logic

La lógica sin UI. Todo es determinista y sin APIs.

#### `01-TYPES.md`
Define todos los tipos TypeScript:
- `MessageType` (system, ai, user, error)
- `TerminalMessage` (estructura de mensajes)
- `CommandKey` (todos los comandos disponibles)
- `CommandResponse` (respuesta de un comando)
- `TerminalConfig` (configuración global)

#### `01-COMMANDS.ts`
Diccionario y parser de comandos:
- Lista de comandos core
- Lista de easter eggs
- `parseCommand()` - extrae el comando de la entrada
- `getCommandArgs()` - obtiene argumentos
- `getCommandSuggestions()` - autocomplete
- Validaciones

#### `01-RESPONSES.md`
Textos estáticos para cada comando:
- `/help`, `/about`, `/projects`, etc.
- Respuestas de sistema
- Easter egg responses
- Diccionario `responseMap`

#### `01-HANDLER.md`
Hook `useCommandHandler`:
- Procesa comandos
- Navega usando Next.js router
- Abre enlaces externos
- Simula delays

---

### BATCH 2: Terminal UI

La interfaz visual funcional.

#### `02-TERMINAL-COMPONENTS.md`
5 componentes React:

1. **TypingLine.tsx** - Anima typing carácter a carácter
2. **TerminalHistory.tsx** - Muestra historial con colores
3. **CommandSuggestions.tsx** - Autocomplete flotante
4. **TerminalInput.tsx** - Input con historial (↑/↓)
5. **Terminal.tsx** - Componente principal que los une

#### `02-PAGE-HOME.md`
Página principal (`/page.tsx`):
- Layout simple (solo terminal)
- Layout complejo (terminal + paneles extras)
- Boot sequence en home

---

### BATCH 3: Páginas

Todas las páginas que se abren con comandos.

#### `03-PAGES.md`
5 páginas completas:

1. **`/about`** - Perfil del desarrollador
2. **`/skills`** - Matriz de habilidades con barras
3. **`/projects`** - Índice de proyectos
4. **`/projects/[id]`** - Detalle de proyecto
5. **`/contact`** - Canales de comunicación

Todas con:
- Estilos consistentes
- Animaciones Framer Motion
- Links de navegación
- Back button a terminal

---

### BATCH 4: Polish & Animations

Hacerlo vistoso y profesional.

#### `04-BOOT-ANIMATIONS.md`
6 componentes/archivos:

1. **BootScreen.tsx** - Pantalla inicial "AI SYSTEM v1.0"
2. **TerminalWithBoot.tsx** - Wrapper que muestra boot → terminal
3. **PageLayout.tsx** - Wrapper reutilizable para páginas
4. **animationVariants.ts** - Presets de Framer Motion
5. **IdleMode.tsx** - Sistema idle (45s sin input)
6. **animations.css** - Efectos CSS adicionales

Incluye:
- Boot sequence con checkmarks
- Transiciones entre pantallas
- Glow effects
- Typing cursor
- Scan effect
- Float animation

---

### BATCH 5: Deploy

Listo para producción.

#### `05-DEPLOY.md`

- Optimizaciones (`npm ls`, imports)
- `.env.local` y variables de entorno
- `next.config.ts` con security headers
- `.gitignore` template
- **README.md completo** con instrucciones
- Deployment a Vercel (recomendado)
- Deployment a GitHub Pages (alternativa)
- GitHub Actions para CI/CD
- Checklist final

---

## 📝 Cómo usar estos documentos

### Opción 1: Seguir en orden (recomendado)

1. Abre `00-SETUP.md` → crea proyecto
2. Lee `01-TYPES.md` → crea archivo de tipos
3. Lee `01-COMMANDS.md` → crea parser
4. Lee `01-RESPONSES.md` → crea respuestas
5. Lee `01-HANDLER.md` → crea hook
6. Lee `02-TERMINAL-COMPONENTS.md` → crea componentes
7. Lee `02-PAGE-HOME.md` → crea home page
8. Lee `03-PAGES.md` → crea todas las páginas
9. Lee `04-BOOT-ANIMATIONS.md` → añade animaciones
10. Lee `05-DEPLOY.md` → deploy a Vercel

### Opción 2: Copiar todo en Claude Code

Si tienes acceso a Claude Code, puedes copiar cada archivo y decirle:

> "Crea un archivo en `src/lib/terminalTypes.ts` con este contenido..."

---

## 🎨 Arquitectura de carpetas (final)

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  (home + TerminalWithBoot)
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
│   │   ├── TypingLine.tsx
│   │   ├── BootScreen.tsx
│   │   └── TerminalWithBoot.tsx
│   └── layouts/
│       └── PageLayout.tsx
├── lib/
│   ├── terminalTypes.ts
│   ├── commands.ts
│   ├── responses.ts
│   ├── useCommandHandler.ts
│   ├── animationVariants.ts
│   └── IdleMode.tsx
├── styles/
│   ├── globals.css
│   └── animations.css
└── public/
    └── cv.pdf
```

---

## 🔄 Flow de un comando (ejemplo: `/projects`)

```
Usuario escribe "/projects" en terminal
           ↓
TerminalInput.onKeyDown(Enter)
           ↓
Terminal.handleSubmit("/projects")
           ↓
useCommandHandler.handleCommand("/projects")
           ↓
parseCommand("/projects") → "/projects" ✓
           ↓
requiresNavigation("/projects") → true
           ↓
Ejecutar navigate → router.push("/projects")
           ↓
Retorna mensaje AI: "Loading project index..."
           ↓
TerminalHistory muestra mensaje con typing effect
           ↓
(Simultáneamente) Navega a /projects
           ↓
ProjectsPage se renderiza
```

---

## 🛠 Stack resumido

| Aspecto | Tech |
|--------|------|
| Framework | Next.js 14+ |
| Lenguaje | TypeScript |
| Styling | Tailwind CSS |
| Animaciones | Framer Motion |
| Terminal | React + Custom |
| Routing | Next.js App Router |
| Hosting | Vercel (recomendado) |

---

## ⏱ Tiempo estimado total

- **Batch 0** (Setup): 10 min
- **Batch 1** (Logic): 30 min
- **Batch 2** (UI): 45 min
- **Batch 3** (Pages): 60 min
- **Batch 4** (Polish): 45 min
- **Batch 5** (Deploy): 30 min

**Total: ~3.5 horas** para tener todo funcional

---

## ✅ Checklist de implementación

- [ ] Batch 0: Proyecto creado y configurado
- [ ] Batch 1: Tipos, comandos, respuestas, handler listos
- [ ] Batch 2: Terminal funciona en home
- [ ] Batch 3: Todas las páginas creadas y navegación funciona
- [ ] Batch 4: Boot screen, animaciones, idle mode
- [ ] Batch 5: Personalizado, optimizado, deployado

---

## 🎯 Recomendaciones mientras construyes

### Mantén la consistencia
- Usa `PageLayout` para todas las páginas
- Usa `animationVariants` para animaciones
- Mantén mismo color scheme

### Personaliza desde el inicio
- En `01-RESPONSES.md`: actualiza nombre, rol, tecnologías
- En `02-TERMINAL-COMPONENTS.md`: personaliza el header
- En `03-PAGES.md`: actualiza contenido de projects y skills

### Prueba frecuentemente
```bash
npm run dev  # Después de cada batch
```

### Itera después de deploy
Una vez en Vercel:
- Añade más proyectos
- Mejora contenido
- Optimiza animaciones
- Recibe feedback

---

## 🚀 Después de deploy

### Opcional pero recomendado
- Google Analytics
- Custom domain
- SEO optimization
- Dark/light theme toggle
- Multiple language support
- Blog section

### Mantén actualizado
- Agrega nuevos proyectos cuando completes
- Actualiza skills cuando aprendas cosas nuevas
- Refrescaancho según feedback de recluiter

---

## 📞 Troubleshooting rápido

**"Terminal no aparece"**
→ Verifica que `TerminalWithBoot` está en `/page.tsx`

**"Comandos no funcionan"**
→ Revisa `01-HANDLER.md` y `useCommandHandler` imports

**"Animaciones lentas"**
→ Reduce `typingDelay` en `terminalTypes.ts`

**"Build falla"**
→ Corre `npm run type-check` para ver errores TS

**"Deploy en Vercel no funciona"**
→ Verifica variables de entorno en `.env.local`

---

## 📚 Referencias útiles

- [Next.js Docs](https://nextjs.org/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel Deployment](https://vercel.com/docs)

---

## 💡 Pro tips

1. **Usa Git desde el inicio**: `git init` después del setup
2. **Commit después de cada batch**: mantén historial
3. **Test en móvil**: responsive design importante
4. **Lighthouse score**: apunta a >90 performance
5. **Core Web Vitals**: mantén <2.5s LCP

---

**¡Listo para empezar?** Abre `00-SETUP.md` y sigue adelante. 🚀
