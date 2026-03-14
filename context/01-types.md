# BATCH 1 — Terminal Logic (Parte 1: Types)

## Objetivo
Definir todos los tipos TypeScript que usará la terminal.

---

## Archivo: `src/lib/terminalTypes.ts`

```typescript
/**
 * Tipos principales para el sistema de terminal
 */

// Tipos de mensaje en la terminal
export type MessageType = "system" | "ai" | "user" | "error";

// Estructura de un mensaje en el historial
export interface TerminalMessage {
  id: string;
  type: MessageType;
  text: string;
  timestamp?: number;
}

// Comandos disponibles
export type CommandKey =
  | "/help"
  | "/about"
  | "/projects"
  | "/project"
  | "/skills"
  | "/contact"
  | "/github"
  | "/cv"
  | "/system"
  | "/architecture"
  | "/timeline"
  // Easter eggs
  | "/coffee"
  | "/whoami"
  | "/train"
  | "/joke"
  | "/hack";

// Respuesta del manejador de comandos
export interface CommandResponse {
  type: "text" | "nav" | "external" | "error";
  text: string;
  path?: string;      // Para navegación interna
  url?: string;       // Para enlaces externos
}

// Configuración de la terminal
export interface TerminalConfig {
  bootDelay: number;       // ms antes de mostrar mensajes
  typingDelay: number;     // ms por carácter
  messageDelay: number;    // ms entre mensajes
  idleTimeout: number;     // ms para entrar en idle mode
}

// Estado global de la terminal
export interface TerminalState {
  history: TerminalMessage[];
  input: string;
  isProcessing: boolean;
  isIdle: boolean;
}
```

---

## Referencia de MessageType

| Tipo | Color | Prefijo | Uso |
|------|-------|---------|-----|
| `system` | Gris azulado | `>` | Logs del sistema |
| `ai` | Cyan | `AI:` | Respuestas de la IA |
| `user` | Accent | `>` | Comandos del usuario |
| `error` | Rojo | `ERROR` | Errores |

---

## Referencia de CommandKey

### Core Commands
- `/help` - Mostrar ayuda
- `/about` - Perfil del desarrollador
- `/projects` - Índice de proyectos
- `/project` - Detalles de un proyecto específico
- `/skills` - Matriz de habilidades
- `/contact` - Canales de comunicación
- `/github` - Abrir GitHub
- `/cv` - Descargar CV

### System Commands
- `/system` - Estado del sistema
- `/architecture` - Arquitectura del proyecto
- `/timeline` - Timeline de desarrollo

### Easter Eggs
- `/coffee` - Chiste sobre café
- `/whoami` - Identidad del visitante
- `/train` - Broma sobre entrenamiento
- `/joke` - Chiste random
- `/hack` - Intento de acceso denegado

---

## Valores predeterminados para TerminalConfig

```typescript
export const DEFAULT_TERMINAL_CONFIG: TerminalConfig = {
  bootDelay: 300,        // 300ms antes de boot
  typingDelay: 30,       // 30ms entre caracteres
  messageDelay: 500,     // 500ms entre mensajes
  idleTimeout: 45000,    // 45 segundos antes de idle
};
```

---

## Inicialización de TerminalState

```typescript
export const initialTerminalState: TerminalState = {
  history: [],
  input: "",
  isProcessing: false,
  isIdle: false,
};
```

---

## ✅ Checklist

- [ ] Archivo `src/lib/terminalTypes.ts` creado
- [ ] Todos los tipos copiados
- [ ] Entiendo qué es cada tipo

**Siguiente paso:** → `01-COMMANDS.md`