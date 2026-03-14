# BATCH 1 — Terminal Logic (Parte 3: Responses)

## Objetivo
Diccionario de respuestas para cada comando. Estos textos se mostrarán en la terminal.

---

## Archivo: `src/lib/responses.ts`

```typescript
/**
 * Mensajes iniciales del sistema
 */
export const bootMessages = [
  "initializing system...",
  "loading developer profile...",
  "indexing projects...",
  "system ready",
];

/**
 * Mensaje de bienvenida
 */
export const welcomeMessages = [
  "Welcome.",
  "You are now interacting with Carlos' AI system.",
  "Type /help to explore the system.",
];

/**
 * COMANDO: /help
 */
export const helpResponse = `Available commands:

/about          Developer profile
/projects       Project index
/skills         Skill matrix
/contact        Communication channels
/github         Open GitHub
/cv             Download CV

System:
/system         System status
/architecture   Architecture overview
/timeline       Development timeline

Easter eggs: /coffee /whoami /train /joke /hack`;

/**
 * COMANDO: /about
 */
export const aboutResponse = `DEVELOPER PROFILE

Loading profile...`;

/**
 * COMANDO: /projects
 */
export const projectsResponse = `PROJECT INDEX

Loading projects...`;

/**
 * COMANDO: /skills
 */
export const skillsResponse = `SKILL MATRIX

Loading skill matrix...`;

/**
 * COMANDO: /contact
 */
export const contactResponse = `COMMUNICATION CHANNELS

Loading contact information...`;

/**
 * COMANDO: /github
 */
export const githubResponse = `Opening GitHub...`;

/**
 * COMANDO: /cv
 */
export const cvResponse = `Preparing CV download...`;

/**
 * COMANDO: /system
 */
export const systemResponse = `SYSTEM STATUS

Developer: Carlos
Role: AI Developer / Data Engineer
Projects: 8
Primary Stack: Python / ML / Data
Status: ONLINE
Uptime: 100%
Response Time: < 100ms`;

/**
 * COMANDO: /architecture
 */
export const architectureResponse = `ARCHITECTURE OVERVIEW

Frontend
└─ Next.js + React
   └─ Tailwind CSS + Framer Motion

Terminal Interface
└─ Command Parser
   └─ Response Engine
      └─ Navigation Router

Data Layer
└─ Static JSON
   └─ Project metadata
      └─ Skill definitions`;

/**
 * COMANDO: /timeline
 */
export const timelineResponse = `DEVELOPMENT TIMELINE

2024 Q1  - AI Systems Development
2024 Q2  - Data Pipeline Architecture
2024 Q3  - LLM Integration
2024 Q4  - Portfolio Terminal Interface`;

/**
 * COMANDO: /coffee (Easter egg)
 */
export const coffeeResponse = `System requires caffeine.
Developer status: operational.
Supply your source of caffeine.`;

/**
 * COMANDO: /whoami (Easter egg)
 */
export const whoamiResponse = `You are a visitor exploring this portfolio.
Your curiosity: DETECTED
Your interest level: HIGH`;

/**
 * COMANDO: /train (Easter egg)
 */
export const trainResponse = `Training sequence initiated...
Just kidding. Models are already optimized.
Better luck next time.`;

/**
 * COMANDO: /joke (Easter egg)
 */
export const jokeResponse = `Why did the neural network break up?
It found someone with better generalization.`;

/**
 * COMANDO: /hack (Easter egg)
 */
export const hackResponse = `ACCESS DENIED.
Nice try.
Attempt logged.`;

/**
 * Comando desconocido
 */
export const unknownResponse = `UNKNOWN COMMAND

Type /help to see available commands.`;

/**
 * Sistema en idle (inactividad)
 */
export const idleResponse = `SYSTEM IDLE
Awaiting input...

Type /help if you're lost.`;

/**
 * Diccionario de respuestas por comando
 */
export const responseMap: Record<string, string> = {
  "/help": helpResponse,
  "/about": aboutResponse,
  "/projects": projectsResponse,
  "/skills": skillsResponse,
  "/contact": contactResponse,
  "/github": githubResponse,
  "/cv": cvResponse,
  "/system": systemResponse,
  "/architecture": architectureResponse,
  "/timeline": timelineResponse,
  "/coffee": coffeeResponse,
  "/whoami": whoamiResponse,
  "/train": trainResponse,
  "/joke": jokeResponse,
  "/hack": hackResponse,
  unknown: unknownResponse,
};

/**
 * Obtener respuesta por comando
 */
export function getResponse(command: string): string {
  return responseMap[command] || responseMap["unknown"];
}
```

---

## Cómo usar las respuestas

```typescript
import { getResponse } from "@/lib/responses";

// En tu componente
const response = getResponse("/help");
console.log(response);
```

---

## Personalizar respuestas

Si quieres cambiar alguna respuesta, simplemente edita el string correspondiente:

```typescript
export const systemResponse = `SYSTEM STATUS

Developer: TU_NOMBRE
Role: TU_ROL
Projects: NUM_PROYECTOS
Primary Stack: TUS_TECNOLOGIAS
Status: ONLINE`;
```

---

## Mensajes de transición

Cuando un comando navega a otra página, añade estos mensajes:

```typescript
export const navMessages: Record<string, string> = {
  "/about": "Loading developer profile...",
  "/projects": "Loading project index...",
  "/skills": "Loading skill matrix...",
  "/contact": "Opening communication channels...",
};
```

---

## ✅ Checklist

- [ ] Archivo `src/lib/responses.ts` creado
- [ ] Todas las respuestas copiadas
- [ ] Personalicé con mi información
- [ ] Entiendo `responseMap` y `getResponse()`

**Siguiente paso:** → `01-HANDLER.md`
