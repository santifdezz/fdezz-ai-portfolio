# BATCH 1 — Terminal Logic (Parte 2: Commands)

## Objetivo
Crear el diccionario de comandos y el parser que identifica qué comando ejecutar.

---

## Archivo: `src/lib/commands.ts`

```typescript
import { CommandKey } from "./terminalTypes";

/**
 * Lista de comandos principales
 */
export const coreCommands: CommandKey[] = [
  "/help",
  "/about",
  "/projects",
  "/project",
  "/skills",
  "/contact",
  "/github",
  "/cv",
  "/system",
  "/architecture",
  "/timeline",
];

/**
 * Lista de easter eggs (comandos ocultos)
 */
export const easterEggCommands: CommandKey[] = [
  "/coffee",
  "/whoami",
  "/train",
  "/joke",
  "/hack",
];

/**
 * Todos los comandos disponibles
 */
export const allCommands: CommandKey[] = [
  ...coreCommands,
  ...easterEggCommands,
];

/**
 * Parser de comandos
 * Extrae el comando de la entrada del usuario
 *
 * Ejemplo:
 * parseCommand("/help") → "/help"
 * parseCommand("/projects RAG") → "/projects"
 * parseCommand("random text") → "unknown"
 */
export function parseCommand(raw: string): CommandKey | "unknown" {
  const trimmed = raw.trim().toLowerCase();
  
  // Si está vacío, unknown
  if (!trimmed) return "unknown";

  // Obtener la primera palabra (el comando)
  const [cmd] = trimmed.split(" ");

  // Verificar si es un comando válido
  if (allCommands.includes(cmd as CommandKey)) {
    return cmd as CommandKey;
  }

  return "unknown";
}

/**
 * Extraer argumentos del comando
 * Ejemplo:
 * getCommandArgs("/project rag-system") → ["rag-system"]
 */
export function getCommandArgs(raw: string): string[] {
  const trimmed = raw.trim();
  const [, ...args] = trimmed.split(" ");
  return args.filter((arg) => arg.length > 0);
}

/**
 * Obtener sugerencias de comandos basadas en lo que escribió
 * Ejemplo:
 * getCommandSuggestions("/p") → ["/projects", "/project"]
 */
export function getCommandSuggestions(input: string): CommandKey[] {
  if (!input.startsWith("/")) return [];

  const trimmed = input.toLowerCase();
  return allCommands.filter((cmd) =>
    cmd.startsWith(trimmed)
  ) as CommandKey[];
}

/**
 * Verificar si un comando es un easter egg
 */
export function isEasterEgg(cmd: CommandKey | "unknown"): boolean {
  return easterEggCommands.includes(cmd as CommandKey);
}

/**
 * Verificar si un comando requiere navegación
 */
export function requiresNavigation(cmd: CommandKey | "unknown"): boolean {
  const navCommands: CommandKey[] = [
    "/about",
    "/projects",
    "/project",
    "/skills",
    "/contact",
  ];
  return navCommands.includes(cmd as CommandKey);
}

/**
 * Obtener descripción corta de cada comando
 */
export const commandDescriptions: Record<CommandKey, string> = {
  "/help": "Show available commands",
  "/about": "Developer profile",
  "/projects": "Project index",
  "/project": "Project details",
  "/skills": "Skill matrix",
  "/contact": "Contact info",
  "/github": "Open GitHub",
  "/cv": "Download CV",
  "/system": "System status",
  "/architecture": "Architecture overview",
  "/timeline": "Development timeline",
  "/coffee": "Easter egg",
  "/whoami": "Easter egg",
  "/train": "Easter egg",
  "/joke": "Easter egg",
  "/hack": "Easter egg",
};
```

---

## Cómo usar el parser

### Ejemplo 1: Comando simple
```typescript
const cmd = parseCommand("/help");
console.log(cmd); // "/help"
```

### Ejemplo 2: Comando con argumentos
```typescript
const cmd = parseCommand("/project rag-system");
console.log(cmd); // "/project"

const args = getCommandArgs("/project rag-system");
console.log(args); // ["rag-system"]
```

### Ejemplo 3: Autocomplete
```typescript
const suggestions = getCommandSuggestions("/proj");
console.log(suggestions); // ["/projects", "/project"]
```

### Ejemplo 4: Validación
```typescript
const cmd = parseCommand("/projects");
if (requiresNavigation(cmd)) {
  router.push("/projects");
}
```

---

## ✅ Checklist

- [ ] Archivo `src/lib/commands.ts` creado
- [ ] Funciones copiadas correctamente
- [ ] Entiendo `parseCommand()` y `getCommandArgs()`

**Siguiente paso:** → `01-RESPONSES.md`