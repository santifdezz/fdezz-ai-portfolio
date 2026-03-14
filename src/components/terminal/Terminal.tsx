"use client";

import { useState, useEffect, useRef } from "react";
import type { TerminalMessage } from "@/lib/terminalTypes";

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
  const [history, setHistory] = useState<TerminalMessage[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setHistory(initialBootMessages), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    historyRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const addMessage = (type: TerminalMessage["type"], text: string) => {
    const msg: TerminalMessage = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      text,
    };
    setHistory(prev => [...prev, msg]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMsg = input.trim();
    const userLine = `santi@ai-terminal:~$ ${userMsg}`;
    addMessage("user", userLine);
    setInput("");
    setIsProcessing(true);

    setTimeout(() => {
      addMessage("ai", `santi@ai-terminal:~$ Command: ${userMsg}`);
      addMessage("ai", "santi@ai-terminal:~$ Type /help for commands");
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono select-none">
      {/* Container responsive */}
      <div className="max-w-4xl mx-auto h-screen flex flex-col p-4 md:p-8">
        
        {/* Status bar minimal */}
        <div className="flex justify-between items-center mb-2 text-xs text-green-400/70 border-b border-green-900/50 pb-2">
          <span>santi@ai-terminal</span>
          <span>12:34:56 | v2.1</span>
        </div>

        {/* Terminal content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1 text-sm leading-relaxed">
          {history.map((msg) => (
            <div key={msg.id} className="break-words">
              {msg.type === "user" ? (
                <span className="text-green-400">{msg.text}</span>
              ) : (
                <span className="text-lime-400">{msg.text}</span>
              )}
            </div>
          ))}
          
          <div ref={historyRef} />
          
          {isProcessing && (
            <div>
              <span className="text-lime-400">santi@ai-terminal:~$ </span>
              <span className="animate-pulse">█</span>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-green-900/30">
          <div className="flex items-center">
            <span className="text-lime-400 mr-2 flex-shrink-0 text-sm">santi@ai-terminal:~$ </span>
            <input
              className="flex-1 bg-black text-green-400 outline-none border-none placeholder-green-600/50 font-mono text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type /help"
              disabled={isProcessing}
              autoFocus
            />
            {isProcessing && <span className="ml-1 animate-pulse">█</span>}
          </div>
        </form>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-pulse {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  );
}
