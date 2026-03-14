# BATCH 1 — Terminal Logic (Parte 4: Command Handler)

## Objetivo
Crear el hook `useCommandHandler` que procesa comandos y retorna respuestas.

---

## Archivo: `src/lib/useCommandHandler.ts`

```typescript
"use client";

import { useRouter } from "next/navigation";
import { CommandKey, CommandResponse, TerminalMessage } from "./terminalTypes";
import {
  parseCommand,
  getCommandArgs,
  requiresNavigation,
} from "./commands";
import { getResponse } from "./responses";
import { v4 as uuidv4 } from "uuid";

/**
 * Hook que maneja la lógica de comandos
 * Retorna una función que procesa un comando y devuelve la respuesta
 */
export function useCommandHandler() {
  const router = useRouter();

  /**
   * Función principal que procesa un comando
   */
  const handleCommand = (userInput: string): TerminalMessage | null => {
    // Parsear el comando
    const cmd = parseCommand(userInput);

    // Si es desconocido, retornar error
    if (cmd === "unknown") {
      return {
        id: uuidv4(),
        type: "ai",
        text: getResponse("unknown"),
        timestamp: Date.now(),
      };
    }

    // Obtener argumentos si existen
    const args = getCommandArgs(userInput);

    // Ejecutar lógica específica del comando
    return executeCommand(cmd, args, router);
  };

  return { handleCommand };
}

/**
 * Función que ejecuta el comando específico
 */
function executeCommand(
  cmd: CommandKey,
  args: string[],
  router: ReturnType<typeof useRouter>
): TerminalMessage | null {
  // Crear mensaje de respuesta genérico
  const response: TerminalMessage = {
    id: uuidv4(),
    type: "ai",
    text: getResponse(cmd),
    timestamp: Date.now(),
  };

  // Si el comando requiere navegación, hacerlo
  if (requiresNavigation(cmd)) {
    navigateToCommand(cmd, args, router);
  }

  // Si es un comando que abre algo externo
  if (cmd === "/github") {
    window.open("https://github.com/tu-usuario", "_blank");
  }

  if (cmd === "/cv") {
    window.open("/cv.pdf", "_blank");
  }

  return response;
}

/**
 * Función que maneja navegación interna
 */
function navigateToCommand(
  cmd: CommandKey,
  args: string[],
  router: ReturnType<typeof useRouter>
): void {
  switch (cmd) {
    case "/about":
      router.push("/about");
      break;

    case "/projects":
      router.push("/projects");
      break;

    case "/project":
      // Si hay un argumento, ir a proyecto específico
      if (args.length > 0) {
        const projectId = args[0];
        router.push(`/projects/${projectId}`);
      } else {
        router.push("/projects");
      }
      break;

    case "/skills":
      router.push("/skills");
      break;

    case "/contact":
      router.push("/contact");
      break;

    default:
      break;
  }
}

/**
 * Hook alternativo: getCommandResponse (más simple)
 * Para componentes que solo necesitan la respuesta de texto
 */
export function useCommandResponse() {
  const getResponse = (userInput: string): string => {
    const cmd = parseCommand(userInput);
    return getResponse(cmd === "unknown" ? "unknown" : cmd);
  };

  return { getResponse };
}
```

---

## Cómo usar el handler

### En un componente de React:

```typescript
import { useCommandHandler } from "@/lib/useCommandHandler";

export function Terminal() {
  const { handleCommand } = useCommandHandler();
  const [history, setHistory] = useState<TerminalMessage[]>([]);

  const handleSubmit = (input: string) => {
    // 1. Añadir mensaje del usuario
    const userMessage: TerminalMessage = {
      id: uuidv4(),
      type: "user",
      text: input,
    };

    setHistory([...history, userMessage]);

    // 2. Procesar comando
    const response = handleCommand(input);

    // 3. Simular delay de "procesamiento"
    setTimeout(() => {
      if (response) {
        setHistory((prev) => [...prev, response]);
      }
    }, 500);
  };

  return (
    <div>
      {/* Terminal UI aquí */}
    </div>
  );
}
```

---

## Flujo completo de un comando

```
Usuario escribe: "/projects"
       ↓
parseCommand("/projects") → "/projects"
       ↓
requiresNavigation("/projects") → true
       ↓
executeCommand() → navega a /projects
       ↓
Mensaje AI: "Loading project index..."
       ↓
Terminal muestra mensaje y navega
```

---

## Extender el handler para nuevos comandos

Si quieres añadir un nuevo comando:

1. **En `terminalTypes.ts`**: Añade a `CommandKey`
```typescript
export type CommandKey = 
  | "/help"
  | "/about"
  | "/mi-nuevo-comando"  // ← AQUÍ
```

2. **En `commands.ts`**: Añade a la lista
```typescript
export const coreCommands: CommandKey[] = [
  "/help",
  "/about",
  "/mi-nuevo-comando",  // ← AQUÍ
];
```

3. **En `responses.ts`**: Añade la respuesta
```typescript
export const miNuevoComandoResponse = `Mi respuesta aquí`;

export const responseMap = {
  "/mi-nuevo-comando": miNuevoComandoResponse,  // ← AQUÍ
};
```

4. **En `useCommandHandler.ts`**: Añade lógica si es necesaria
```typescript
if (cmd === "/mi-nuevo-comando") {
  // Hacer algo especial
}
```

---

## ✅ Checklist

- [ ] Archivo `src/lib/useCommandHandler.ts` creado
- [ ] Hook `useCommandHandler` implementado
- [ ] Entiendo flujo de comando → respuesta → navegación
- [ ] Personalicé URLs de GitHub y CV

**Siguiente paso:** → `02-TERMINAL-COMPONENTS.md`
