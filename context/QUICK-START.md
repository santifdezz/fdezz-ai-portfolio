# 🎬 Guía Rápida — AI Terminal Portfolio

Resumen ejecutivo de cómo construir tu portfolio terminal JARVIS.

---

## ⚡ TL;DR (30 segundos)

```bash
# 1. Crear proyecto
npx create-next-app@latest ai-terminal-portfolio
cd ai-terminal-portfolio
npm install framer-motion clsx uuid

# 2. Crear estructura de carpetas (ver 00-SETUP.md)

# 3. Copiar archivos según batches (01-05)

# 4. Deploy
npm run build
# o conectar a Vercel
```

---

## 📋 Los 5 Archivos Clave a Crear

| Archivo | Propósito | Líneas |
|---------|-----------|--------|
| `src/lib/terminalTypes.ts` | Tipos TypeScript | ~80 |
| `src/lib/commands.ts` | Parser + diccionario | ~120 |
| `src/lib/responses.ts` | Respuestas texto | ~150 |
| `src/lib/useCommandHandler.ts` | Lógica de comandos | ~140 |
| `src/components/terminal/Terminal.tsx` | UI principal | ~180 |

Total de código: ~800 líneas (muy manejable)

---

## 🔧 Instalación en pasos

### Paso 1: Setup (10 min)
```bash
npx create-next-app@latest ai-terminal-portfolio --typescript --tailwind
cd ai-terminal-portfolio
npm install framer-motion clsx uuid
```

### Paso 2: Crear carpetas (2 min)
```bash
mkdir -p src/components/terminal src/components/layouts src/lib
```

### Paso 3: Copiar archivos (60 min)
- Copiar `terminalTypes.ts`
- Copiar `commands.ts`
- Copiar `responses.ts`
- Copiar `useCommandHandler.ts`
- Copiar 5 componentes terminal
- Copiar página home

### Paso 4: Crear páginas (45 min)
- `/about`
- `/projects`
- `/projects/[id]`
- `/skills`
- `/contact`

### Paso 5: Polish (30 min)
- BootScreen
- Animaciones
- IdleMode

### Paso 6: Deploy (15 min)
- Push a GitHub
- Conectar a Vercel
- ¡Listo!

**Tiempo total: ~2.5 horas**

---

## 🎨 Componentes principales

### 1️⃣ Núcleo (Batch 1)

```
Input del usuario → Parser
                      ↓
                  Command Handler
                      ↓
              Response Engine
                      ↓
           Mostrar en terminal
```

**Archivos:**
- `terminalTypes.ts` - Tipos
- `commands.ts` - Parser
- `responses.ts` - Respuestas
- `useCommandHandler.ts` - Lógica

---

### 2️⃣ UI (Batch 2)

```
Terminal (componente principal)
├── TerminalHistory (muestra mensajes)
├── TerminalInput (input de usuario)
├── CommandSuggestions (autocomplete)
└── TypingLine (anima typing)
```

---

### 3️⃣ Páginas (Batch 3)

```
/home (Terminal)
/about
/projects
/projects/[id]
/skills
/contact
```

Todos con estilos consistentes y animaciones.

---

### 4️⃣ Polish (Batch 4)

```
BootScreen → Terminal → Animaciones → IdleMode
```

---

## 💻 Configuraciones clave

### `next.config.ts`
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

### `globals.css`
```css
body {
  background-color: #0a0a0a;
  color: #e6f7ff;
  font-family: "JetBrains Mono", monospace;
}

.terminal-glow {
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.25);
}
```

---

## 🎯 Comandos esenciales

Estos **DEBEN** funcionar:

```
/help        ← Listar todos los comandos
/about       ← Ir a /about
/projects    ← Ir a /projects
/skills      ← Ir a /skills
/contact     ← Ir a /contact
/github      ← Abrir GitHub (externa)
/cv          ← Descargar CV (externa)
```

Bonus:
```
/system      ← Mostrar estado
/architecture ← Mostrar arquitectura
/coffee      ← Easter egg
/joke        ← Easter egg
```

---

## 🚀 Flujo completo de un comando

```bash
Usuario: /projects

↓ TerminalInput.onSubmit

↓ addMessageToHistory({ type: "user", text: "/projects" })

↓ handleCommand("/projects")
  ├─ parseCommand("/projects") → "/projects"
  ├─ requiresNavigation("/projects") → true
  └─ router.push("/projects")

↓ addMessageToHistory({ type: "ai", text: "Loading..." })

↓ TerminalHistory renderiza con TypingLine

↓ (simultáneamente) Navega a /projects

↓ ProjectsPage se renderiza
```

---

## 🎬 Pantalla de boot (recomendada)

```
AI SYSTEM v1.0

Initializing modules...

[✓] developer profile
[✓] project index
[✓] skill matrix
[✓] ai interface

system ready
```

Luego:
```
Welcome.
You are now interacting with Carlos' AI system.
Type /help to begin.
```

---

## 🎨 Color palette

```
Background:      #0a0a0a  (muy oscuro)
Terminal:        #050505  (casi negro)
Text:            #e6f7ff  (azul claro)
Accent:          #00e5ff  (cyan brillante)
Accent 2:        #00f2ff  (neon)
Success:         #10b981  (verde)
Error:           #ef4444  (rojo)
```

En Tailwind:
```
bg-dark         = #0a0a0a
bg-terminal     = #050505
text-cyan-400   = #22d3ee
text-emerald-400 = #10b981
```

---

## 📦 Dependencias mínimas

```json
{
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "next": "^14",
    "framer-motion": "^10",
    "clsx": "^2",
    "uuid": "^9"
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^3",
    "postcss": "^8",
    "autoprefixer": "^10"
  }
}
```

Sin librerías innecesarias.

---

## 🔍 Checklist de commit

Después de cada batch:

```bash
git add .
git commit -m "Batch X: descripción"
git push
```

Commits recomendados:
- `Batch 0: Setup inicial`
- `Batch 1: Terminal logic`
- `Batch 2: Terminal UI`
- `Batch 3: Pages`
- `Batch 4: Boot + Animations`
- `Batch 5: Deploy ready`

---

## 🌍 Deploy en 1 minuto

1. Push a GitHub
2. Ir a [vercel.com](https://vercel.com)
3. Conectar repo
4. Click "Deploy"
5. ¡Listo! Ya está online

URL automática: `tu-proyecto.vercel.app`

---

## 🎯 Optimizaciones finales

```bash
# Verificar que todo está bien
npm run type-check   # Errores TS
npm run lint         # Código limpio
npm run build        # Build para prod
npm run start        # Probar build local
```

Si todo pasa, está listo para deploy.

---

## 🐛 Errores comunes

| Error | Solución |
|-------|----------|
| "Module not found" | Verifica imports y rutas |
| "Type error" | Corre `npm run type-check` |
| "Styling roto" | Verifica que Tailwind está en `content` de config |
| "Terminal no aparece" | Verifica que `/page.tsx` importa `TerminalWithBoot` |
| "Comandos no funcionan" | Verifica `useCommandHandler` y router |

---

## 📱 Responsive design

Terminal se adapta a móvil con Tailwind:

```tsx
<div className="max-w-4xl mx-auto">
  <Terminal />
</div>
```

En móvil verá terminal a pantalla completa. En desktop, centrada con margen.

---

## 🎥 UX flow para visitante

```
1. Entra a tu-portfolio.vercel.app
   ↓
2. Ve boot screen (AI SYSTEM v1.0)
   ↓
3. Aparece terminal con welcome
   ↓
4. Lee "/help"
   ↓
5. Explora "/projects", "/about", "/skills"
   ↓
6. Impresionado, cliquea CV o GitHub
```

---

## 💡 Diferenciadores respecto a portfolio normal

✅ **Interactividad**: No es estático  
✅ **Estética AI**: Muestra que sabes de tecnología  
✅ **Memorabilidad**: Recruiters lo recuerdan  
✅ **Frontend skill**: Demuestra React + Next.js  
✅ **Animations**: Usa Framer Motion profesionalmente  
✅ **100% Frontend**: Sin APIs, super rápido  
✅ **TypeScript**: Código tipado y limpio  

---

## 🎓 Qué aprenderás construyendo esto

- ✅ Next.js App Router
- ✅ TypeScript tipos avanzados
- ✅ React hooks y state management
- ✅ Framer Motion animaciones
- ✅ Tailwind CSS mastery
- ✅ Routing y navegación
- ✅ Component composition
- ✅ UI/UX patterns
- ✅ Deployment a Vercel

**Es un proyecto bastante educativo.**

---

## 🎉 Resultado final

Un portfolio que:
- Se ve **profesional y moderno**
- Es **totalmente funcional y rápido**
- Demuestra **skills técnicos reales**
- Es **memorable y diferente**
- Es **gratis de hostear**
- Es **tuyo para customizar**

---

## 📚 Documentos en orden

1. **ROADMAP.md** ← Estás aquí
2. **00-SETUP.md** ← Empieza aquí
3. **01-TYPES.md**
4. **01-COMMANDS.md**
5. **01-RESPONSES.md**
6. **01-HANDLER.md**
7. **02-TERMINAL-COMPONENTS.md**
8. **02-PAGE-HOME.md**
9. **03-PAGES.md**
10. **04-BOOT-ANIMATIONS.md**
11. **05-DEPLOY.md**

---

## ✨ Última palabra

Este portfolio es:
- Modular (puedes cambiar cualquier parte)
- Escalable (puedes agregar más funciones)
- Profesional (se ve de verdad)
- Educativo (aprendes mucho)

**No es un template genérico.**
Es una arquitectura pensada desde cero para que sea:
1. Consistente
2. Mantenible
3. Expandible
4. Impresionante

---

**Licencia:** Use libremente para su propio portfolio.  
**Tiempo de implementación:** 2-3 horas.  
**Dificultad:** Intermedia (si sabes React).

---

🚀 **¡Vamos a construirlo!**
