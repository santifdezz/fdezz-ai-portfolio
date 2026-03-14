"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { TerminalMessage } from "@/lib/terminalTypes";
import { useCommandHandler } from "@/lib/useCommandHandler";
import { motion, AnimatePresence } from "framer-motion";
import BootScreen from "@/components/BootScreen";
import SystemPanel from "@/components/SystemPanel";
import TerminalHistory from "./TerminalHistory";
import TerminalInput from "./TerminalInput";

const initialBootMessages: TerminalMessage[] = [
  { id: "1", type: "system", text: "██╗  ██╗ █████╗ ██╗    ██╗██╗███╗   ██╗███████╗" },
  { id: "2", type: "system", text: "██║  ██║██╔══██╗██║    ██║██║████╗  ██║██╔════╝" },
  { id: "3", type: "system", text: "███████║███████║██║ █╗ ██║██║██╔██╗ ██║█████╗  " },
  { id: "4", type: "system", text: "██╔══██║██╔══██║██║███╗██║██║██║╚██╗██║██╔══╝  " },
  { id: "5", type: "system", text: "██║  ██║██║  ██║╚███╔███╔╝██║██║ ╚████║███████╗" },
  { id: "6", type: "system", text: "╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝╚═╝  ╚═══╝╚══════╝" },
  { id: "7", type: "system", text: "" },
  { id: "8", type: "system", text: "[ 0.123s] Booting AI Terminal v2.1..." },
  { id: "9", type: "system", text: "[ 0.456s] Loading developer profile..." },
  { id: "10", type: "system", text: "[ 0.789s] Indexing projects... [OK]" },
  { id: "11", type: "system", text: "[ 1.234s] System ready" },
  { id: "12", type: "ai", text: "santi@ai-terminal:~$ Welcome. Type /help" },
];

export default function Terminal() {
  const [bootComplete, setBootComplete] = useState(false);
  const [history, setHistory] = useState<TerminalMessage[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);
  const [showIdleMessage, setShowIdleMessage] = useState(false);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { handleCommand } = useCommandHandler();

  // Boot sequence
  useEffect(() => {
    if (bootComplete) {
      const timer = setTimeout(() => setHistory(initialBootMessages), 300);
      return () => clearTimeout(timer);
    }
  }, [bootComplete]);

  // Idle mode - show message after 30 seconds of inactivity
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      setShowIdleMessage(false);

      idleTimeoutRef.current = setTimeout(() => {
        if (!isProcessing && input === "") {
          setShowIdleMessage(true);
        }
      }, 30000); // 30 seconds
    };

    resetIdleTimer();

    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [isProcessing, input]);

  const addMessage = useCallback(
    (type: TerminalMessage["type"], text: string) => {
      const msg: TerminalMessage = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        text,
      };
      setHistory((prev) => [...prev, msg]);
    },
    []
  );

  const handleSubmit = useCallback(
    (inputText: string) => {
      if (!inputText.trim() || isProcessing) return;

      // Reset idle state
      setShowIdleMessage(false);

      // Add user message
      addMessage("user", `santi@ai-terminal:~$ ${inputText}`);

      // Add to command history
      setCommandHistory((prev) => [...prev, inputText]);

      setInput("");
      setIsProcessing(true);

      // Simulate processing delay
      setTimeout(() => {
        const result = handleCommand(inputText);

        // Add response
        if (result.type === "text") {
          const lines = result.text.split("\n");
          lines.forEach((line) => {
            addMessage("ai", line);
          });
        } else if (result.type === "external") {
          addMessage("ai", result.text);
          // In real app, would open external link
          if (result.url) window.open(result.url, "_blank");
        }

        setIsProcessing(false);
      }, 800);
    },
    [isProcessing, addMessage, handleCommand]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-cyan-50 font-mono select-none">
      {/* Boot Screen */}
      <AnimatePresence>
        {!bootComplete && (
          <BootScreen onBootComplete={() => setBootComplete(true)} />
        )}
      </AnimatePresence>

      {/* Main container */}
      {bootComplete && (
        <div className="max-w-4xl mx-auto h-screen flex flex-col p-3 md:p-6 overflow-hidden">
          {/* System Panel */}
          <SystemPanel />

          {/* Terminal box with border glow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col border border-cyan-500/40 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,242,255,0.15)] bg-black/60 backdrop-blur-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 md:px-4 py-2 border-b border-cyan-500/30 text-xs tracking-widest uppercase text-cyan-300 bg-black/40">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                AI SYSTEM — SANTI.DEV
              </span>
              <span className="text-emerald-400 text-xs">● ONLINE</span>
            </div>

            {/* History with idle message */}
            <div className="flex-1 flex flex-col">
              <TerminalHistory messages={history} isProcessing={isProcessing} />

              {/* Idle message */}
              <AnimatePresence>
                {showIdleMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="px-3 md:px-4 py-2 text-xs md:text-sm"
                  >
                    <span className="text-cyan-400">
                      SYSTEM IDLE. Type /help if you need guidance.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input */}
            <TerminalInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              isProcessing={isProcessing}
              commandHistory={commandHistory}
            />
          </motion.div>

          {/* Footer info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-cyan-600/50 mt-3 md:mt-4"
          >
            Type /help for commands • AI Terminal v2.1
          </motion.div>
        </div>
      )}
    </div>
  );
}
