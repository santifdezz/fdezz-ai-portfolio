"use client";

import { useState, useEffect, useCallback } from "react";
import type { TerminalMessage, Locale } from "@/lib/terminalTypes";
import { TERMINAL_CONFIG } from "@/lib/terminalTypes";
import { getWelcomeMessages } from "@/lib/responses";
import { useCommandHandler } from "@/lib/useCommandHandler";
import { initializePanelRegistry } from "@/lib/panelFactory";
import { TerminalHistory } from "./TerminalHistory";
import { TerminalInput } from "./TerminalInput";
import { Sidebar } from "./Sidebar";

function makeMsg(type: TerminalMessage["type"], text: string): TerminalMessage {
  return { id: Math.random().toString(36).slice(2), type, text, timestamp: Date.now() };
}

function useNow() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("en-GB"));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function useLocalStorage(key: string, defaultValue: Locale): [Locale, (value: Locale) => void] {
  const [value, setValue] = useState<Locale>(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(key) as Locale | null;
      if (stored && (stored === "en" || stored === "es")) {
        setValue(stored);
      }
      setIsHydrated(true);
    }
  }, [key]);

  const setValueWithStorage = useCallback(
    (newValue: Locale) => {
      setValue(newValue);
      if (typeof window !== "undefined") {
        localStorage.setItem(key, newValue);
      }
    },
    [key]
  );

  return [isHydrated ? value : defaultValue, setValueWithStorage];
}

export default function Terminal() {
  const [history, setHistory] = useState<TerminalMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [locale, setLocale] = useLocalStorage("fdezz-portfolio-lang", "en");
  const { handleCommand } = useCommandHandler();
  const time = useNow();

  // Initialize panel registry on mount
  useEffect(() => {
    initializePanelRegistry();
  }, []);

  // Welcome messages on mount
  useEffect(() => {
    const welcomeMsgs = getWelcomeMessages(locale);
    const all: TerminalMessage[] = welcomeMsgs.map((line) => makeMsg("ai", line));

    let i = 0;
    const show = () => {
      if (i < all.length) {
        const msg = all[i++];
        setHistory((prev) => [...prev, msg]);
        setTimeout(show, 300);
      }
    };
    const timer = setTimeout(show, 200);
    return () => clearTimeout(timer);
  }, []);

  const addMsg = useCallback((msg: TerminalMessage): void => {
    setHistory((prev) => [...prev, msg]);
  }, []);

  const handleSubmit = useCallback(
    (input: string): void => {
      addMsg(makeMsg("user", input));
      setIsProcessing(true);

      setTimeout(() => {
        // Create callback for timeline navigation
        const onTimelineNavigate = (newIndex: number) => {
          if (newIndex === -1) {
            // "View All" was clicked
            handleSubmit("/timeline all");
          } else {
            // Navigate to specific period (1-based)
            handleSubmit(`/timeline ${newIndex + 1}`);
          }
        };

        const response = handleCommand(input, locale, { onTimelineNavigate });

        if (response.type === "clear") {
          setHistory([]);
          setIsProcessing(false);
          return;
        }

        if (response.type === "lang" && response.locale) {
          setLocale(response.locale);
        }

        if (response.type === "external" && response.url) {
          window.open(response.url, "_blank", "noopener,noreferrer");
        }

        // Handle both text and component responses, including panel responses
        if (response.text || response.component || response.panelType) {
          const msgType = response.type === "error" ? "error" : "ai";
          addMsg({
            id: Math.random().toString(36).slice(2),
            type: msgType,
            text: response.text,
            component: response.component,
            panelType: (response as any).panelType,
            panelData: (response as any).panelData,
            timestamp: Date.now(),
          });
        }

        setIsProcessing(false);
      }, TERMINAL_CONFIG.messageDelay);
    },
    [addMsg, handleCommand, locale]
  );

  const chatHistoryItems = [
    {
      id: "current",
      title: "Current Conversation",
      isActive: true,
    },
  ];

  return (
    <div className="h-screen flex bg-[hsl(var(--background))]">
      {/* Sidebar */}
      <Sidebar chats={chatHistoryItems} activeId="current" />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 md:px-8 py-4 border-b border-[hsl(var(--border))] bg-gradient-to-r from-[hsl(var(--card))] to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
            <h1 className="text-sm font-semibold text-[hsl(var(--foreground))]">
              AI Terminal
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))] font-mono">
            <span className="uppercase">{locale}</span>
            <span>{time}</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
          <div className="max-w-4xl mx-auto space-y-2">
            <TerminalHistory messages={history} />
          </div>
        </div>

        {/* Input Area */}
        <TerminalInput onSubmit={handleSubmit} isProcessing={isProcessing} />
      </div>
    </div>
  );
}
