# BATCH 2 — Terminal UI (Parte 1: Componentes)

## Objetivo
Crear los componentes React que forman la interfaz de la terminal.

---

## Archivo 1: `src/components/terminal/TypingLine.tsx`

Componente que anima el typing de texto carácter a carácter.

```typescript
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypingLineProps {
  text: string;
  delay?: number;
  onComplete?: () => void;
}

export function TypingLine({
  text,
  delay = 0,
  onComplete,
}: TypingLineProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return;

    // Esperar el delay inicial
    if (delay > 0) {
      const delayTimeout = setTimeout(() => {
        let index = 0;
        const interval = setInterval(() => {
          if (index < text.length) {
            setDisplayedText(text.slice(0, index + 1));
            index++;
          } else {
            clearInterval(interval);
            onComplete?.();
          }
        }, 30); // 30ms por carácter

        return () => clearInterval(interval);
      }, delay);

      return () => clearTimeout(delayTimeout);
    } else {
      // Sin delay
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          onComplete?.();
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [text, delay, onComplete]);

  return (
    <span>
      {displayedText}
      {displayedText.length < text.length && (
        <span className="animate-pulse">_</span>
      )}
    </span>
  );
}
```

---

## Archivo 2: `src/components/terminal/TerminalHistory.tsx`

Componente que muestra el historial de mensajes.

```typescript
"use client";

import { useEffect, useRef } from "react";
import { TerminalMessage } from "@/lib/terminalTypes";
import { TypingLine } from "./TypingLine";
import { motion } from "framer-motion";

interface TerminalHistoryProps {
  messages: TerminalMessage[];
}

export function TerminalHistory({ messages }: TerminalHistoryProps) {
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
      {messages.map((msg, idx) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={getMessageStyle(msg.type)}
        >
          {/* Prefijo según tipo de mensaje */}
          <span className={getPrefixStyle(msg.type)}>
            {getPrefix(msg.type)}
          </span>

          {/* Texto con typing animation para mensajes AI */}
          {msg.type === "ai" && idx === messages.length - 1 ? (
            <TypingLine text={msg.text} />
          ) : (
            <span>{msg.text}</span>
          )}
        </motion.div>
      ))}

      {/* Referencia para scroll automático */}
      <div ref={endRef} />
    </div>
  );
}

/**
 * Obtener estilos según el tipo de mensaje
 */
function getMessageStyle(type: string): string {
  const baseStyle = "font-mono text-xs";

  switch (type) {
    case "system":
      return `${baseStyle} text-slate-500`;
    case "ai":
      return `${baseStyle} text-cyan-400`;
    case "user":
      return `${baseStyle} text-emerald-400`;
    case "error":
      return `${baseStyle} text-red-400`;
    default:
      return `${baseStyle} text-slate-400`;
  }
}

/**
 * Obtener prefijo según tipo
 */
function getPrefix(type: string): string {
  switch (type) {
    case "system":
      return "> ";
    case "ai":
      return "AI: ";
    case "user":
      return "> ";
    case "error":
      return "ERROR: ";
    default:
      return "";
  }
}

/**
 * Obtener estilo del prefijo
 */
function getPrefixStyle(type: string): string {
  switch (type) {
    case "system":
      return "text-slate-500";
    case "ai":
      return "text-cyan-500";
    case "user":
      return "text-emerald-500";
    case "error":
      return "text-red-500";
    default:
      return "text-slate-500";
  }
}
```

---

## Archivo 3: `src/components/terminal/CommandSuggestions.tsx`

Componente que muestra sugerencias de comandos.

```typescript
"use client";

import { CommandKey } from "@/lib/terminalTypes";
import { getCommandSuggestions, commandDescriptions } from "@/lib/commands";
import { motion, AnimatePresence } from "framer-motion";

interface CommandSuggestionsProps {
  input: string;
  onSelect: (cmd: string) => void;
}

export function CommandSuggestions({
  input,
  onSelect,
}: CommandSuggestionsProps) {
  const suggestions = getCommandSuggestions(input);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="absolute bottom-full mb-2 left-0 right-0 bg-[#111111] border border-cyan-500/40 rounded-lg overflow-hidden shadow-lg"
      >
        {suggestions.map((cmd, idx) => (
          <motion.button
            key={cmd}
            onClick={() => onSelect(cmd)}
            className="w-full text-left px-4 py-2 hover:bg-cyan-500/20 text-cyan-400 text-xs hover:text-cyan-300 transition-colors border-b border-cyan-500/20 last:border-b-0"
            whileHover={{ paddingLeft: 20 }}
          >
            <span className="text-cyan-500">{cmd}</span>
            <span className="ml-2 text-slate-500">
              {commandDescriptions[cmd as CommandKey]}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
```

---

## Archivo 4: `src/components/terminal/TerminalInput.tsx`

Componente del input de comandos.

```typescript
"use client";

import { useState, useRef, useEffect } from "react";
import { CommandSuggestions } from "./CommandSuggestions";

interface TerminalInputProps {
  onSubmit: (input: string) => void;
  isProcessing: boolean;
}

export function TerminalInput({
  onSubmit,
  isProcessing,
}: TerminalInputProps) {
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus en el input
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter: enviar comando
    if (e.key === "Enter" && !isProcessing) {
      if (input.trim()) {
        onSubmit(input);
        setCommandHistory([...commandHistory, input]);
        setHistoryIndex(-1);
        setInput("");
      }
      return;
    }

    // Arrow up: historial anterior
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      const newIndex = historyIndex + 1;
      if (newIndex < commandHistory.length) {
        setHistoryIndex(newIndex);
        setInput(
          commandHistory[commandHistory.length - 1 - newIndex]
        );
      }
      return;
    }

    // Arrow down: historial siguiente
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInput("");
        return;
      }

      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setInput(
        commandHistory[commandHistory.length - 1 - newIndex]
      );
      return;
    }

    // Escape: limpiar
    if (e.key === "Escape") {
      setInput("");
      setHistoryIndex(-1);
    }
  };

  const handleSelect = (cmd: string) => {
    setInput(cmd + " ");
    inputRef.current?.focus();
  };

  return (
    <div className="relative border-t border-cyan-500/30 px-4 py-3">
      <div className="flex items-center gap-2 relative">
        <span className="text-cyan-400 text-sm select-none">{">"}</span>

        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            placeholder="/help"
            className="w-full bg-transparent outline-none text-xs text-[#e6f7ff] caret-cyan-400 placeholder-slate-600 disabled:opacity-50"
          />

          {/* Sugerencias de comandos */}
          <CommandSuggestions input={input} onSelect={handleSelect} />
        </div>
      </div>

      {/* Indicador de procesamiento */}
      {isProcessing && (
        <div className="absolute right-4 top-3 text-cyan-400 text-xs animate-pulse">
          processing...
        </div>
      )}
    </div>
  );
}
```

---

## Archivo 5: `src/components/terminal/Terminal.tsx`

Componente principal que une todo.

```typescript
"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { TerminalMessage } from "@/lib/terminalTypes";
import { TerminalHistory } from "./TerminalHistory";
import { TerminalInput } from "./TerminalInput";
import { useCommandHandler } from "@/lib/useCommandHandler";
import { bootMessages, welcomeMessages } from "@/lib/responses";

export function Terminal() {
  const [messages, setMessages] = useState<TerminalMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { handleCommand } = useCommandHandler();

  // Boot sequence al montar el componente
  useEffect(() => {
    const bootSequence = async () => {
      const bootMsgs: TerminalMessage[] = bootMessages.map((text) => ({
        id: uuidv4(),
        type: "system" as const,
        text,
      }));

      const welcomeMsgs: TerminalMessage[] = welcomeMessages.map((text) => ({
        id: uuidv4(),
        type: "ai" as const,
        text,
      }));

      // Mostrar boot messages con delay
      for (let i = 0; i < bootMsgs.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setMessages((prev) => [...prev, bootMsgs[i]]);
      }

      // Mostrar welcome messages con delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      for (let i = 0; i < welcomeMsgs.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        setMessages((prev) => [...prev, welcomeMsgs[i]]);
      }
    };

    bootSequence();
  }, []);

  const handleSubmit = (input: string) => {
    setIsProcessing(true);

    // Añadir mensaje del usuario
    const userMessage: TerminalMessage = {
      id: uuidv4(),
      type: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Procesar comando con delay
    setTimeout(() => {
      const response = handleCommand(input);
      if (response) {
        setMessages((prev) => [...prev, response]);
      }
      setIsProcessing(false);
    }, 500);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-terminal text-[#e6f7ff] border-x border-cyan-500/40">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/30 text-xs tracking-widest uppercase text-cyan-300 bg-[#0a0a0a]">
        <span>AI SYSTEM — CARLOS.DEV</span>
        <span className="text-emerald-400 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          online
        </span>
      </div>

      {/* Terminal History */}
      <TerminalHistory messages={messages} />

      {/* Terminal Input */}
      <TerminalInput onSubmit={handleSubmit} isProcessing={isProcessing} />
    </div>
  );
}
```

---

## ✅ Checklist

- [ ] `TypingLine.tsx` creado
- [ ] `TerminalHistory.tsx` creado
- [ ] `CommandSuggestions.tsx` creado
- [ ] `TerminalInput.tsx` creado
- [ ] `Terminal.tsx` creado
- [ ] Todos los componentes están en `src/components/terminal/`

**Siguiente paso:** → `02-PAGE-HOME.md`
