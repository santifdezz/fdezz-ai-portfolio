"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TerminalMessage } from "@/lib/terminalTypes";
import { useCommandHandler } from "@/lib/useCommandHandler";

export default function ChatInterface() {
  const [messages, setMessages] = useState<TerminalMessage[]>([
    {
      id: "welcome",
      type: "ai",
      text: "Hey! Welcome to my AI terminal. Type a command or ask something. Try /help for a list of commands.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { handleCommand } = useCommandHandler();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for commands from sidebar
  useEffect(() => {
    const handleExecuteCommand = (event: Event) => {
      const customEvent = event as CustomEvent;
      setInput(customEvent.detail.command);
      setTimeout(() => {
        handleSubmit(customEvent.detail.command);
      }, 100);
    };

    window.addEventListener("executeCommand", handleExecuteCommand);
    return () => window.removeEventListener("executeCommand", handleExecuteCommand);
  }, []);

  const handleSubmit = useCallback(
    (inputText?: string) => {
      const text = inputText || input;
      if (!text.trim() || isProcessing) return;

      // Add user message
      const userMsg: TerminalMessage = {
        id: Math.random().toString(36).substr(2, 9),
        type: "user",
        text,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsProcessing(true);

      // Simulate thinking time
      setTimeout(() => {
        const result = handleCommand(text);

        if (result.type === "text") {
          const responseMsg: TerminalMessage = {
            id: Math.random().toString(36).substr(2, 9),
            type: "ai",
            text: result.text,
          };
          setMessages((prev) => [...prev, responseMsg]);
        }

        setIsProcessing(false);
      }, 600);
    },
    [input, isProcessing, handleCommand]
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-black/60 to-black/40">
      {/* Header */}
      <div className="px-6 py-4 border-b border-cyan-500/10 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
          <div>
            <h2 className="text-lg font-semibold text-cyan-300">AI Terminal</h2>
            <p className="text-xs text-cyan-500/60">Interactive conversation mode</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                  msg.type === "user"
                    ? "bg-cyan-600/30 border border-cyan-500/50 text-cyan-50 rounded-br-sm"
                    : "bg-cyan-950/40 border border-cyan-500/20 text-cyan-100/90 rounded-bl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-cyan-950/40 border border-cyan-500/20 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                  className="w-2 h-2 rounded-full bg-cyan-400"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  className="w-2 h-2 rounded-full bg-cyan-400"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  className="w-2 h-2 rounded-full bg-cyan-400"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-cyan-500/10 bg-black/40 backdrop-blur-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command or message..."
            disabled={isProcessing}
            className="flex-1 px-4 py-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-cyan-50 placeholder-cyan-600/50 focus:outline-none focus:border-cyan-500/60 focus:bg-cyan-950/40 transition-colors"
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="px-4 py-3 rounded-lg bg-cyan-600/40 hover:bg-cyan-600/60 disabled:opacity-50 disabled:cursor-not-allowed text-cyan-50 font-semibold transition-colors"
          >
            Send
          </button>
        </form>
        <p className="text-xs text-cyan-600/60 mt-2">
          Try: <span className="text-cyan-400">/help</span> • /about •
          <span className="text-cyan-400"> /projects</span> • /skills
        </p>
      </div>
    </div>
  );
}
