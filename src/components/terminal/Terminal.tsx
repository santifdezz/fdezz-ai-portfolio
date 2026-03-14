"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { TerminalMessage, Locale } from "@/lib/terminalTypes";
import { TERMINAL_CONFIG } from "@/lib/terminalTypes";
import { getWelcomeMessages } from "@/lib/responses";
import { useCommandHandler } from "@/lib/useCommandHandler";
import { initializePanelRegistry } from "@/lib/panelFactory";
import { parseIntention } from "@/lib/intentionMap";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { Sidebar } from "./Sidebar";
import { TourSelector } from "@/components/panels/TourSelector";
import { TourPlayer } from "@/components/panels/TourPlayer";

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

type UIState = "welcome" | "chat" | "tour-selector" | "tour-player";

export default function Terminal() {
  const [history, setHistory] = useState<TerminalMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [locale, setLocale] = useLocalStorage("fdezz-portfolio-lang", "es");
  const [uiState, setUiState] = useState<UIState>("welcome");
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const { handleCommand } = useCommandHandler();
  const time = useNow();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Initialize panel registry on mount
  useEffect(() => {
    initializePanelRegistry();
  }, []);

  // Welcome messages on mount and when locale changes
  useEffect(() => {
    setHistory([]);
    setUiState("welcome");

    const welcomeMsgs = getWelcomeMessages(locale);
    // Filter out empty messages for chat display
    const all: TerminalMessage[] = welcomeMsgs
      .filter((line) => line.trim().length > 0)
      .map((line) => makeMsg("ai", line));

    let i = 0;
    const show = () => {
      if (i < all.length) {
        const msg = all[i++];
        setHistory((prev) => [...prev, msg]);
        setTimeout(show, 300);
      } else {
        // After welcome completes, show tour selector
        setTimeout(() => setUiState("tour-selector"), 500);
      }
    };
    const timer = setTimeout(show, 200);
    return () => clearTimeout(timer);
  }, [locale]);

  const addMsg = useCallback((msg: TerminalMessage): void => {
    setHistory((prev) => [...prev, msg]);
  }, []);

  const handleSubmit = useCallback(
    (input: string): void => {
      // All input is natural language - parse intention
      addMsg({ ...makeMsg("user", input), type: "user" });
      setIsProcessing(true);

      setTimeout(() => {
        const intentionResponse = parseIntention(input, locale);

        // Add AI response message
        addMsg({
          id: Math.random().toString(36).slice(2),
          type: "ai",
          text: intentionResponse.message,
          timestamp: Date.now(),
        });

        // Map intention to command and execute it
        const intentionToCommand: Record<string, string> = {
          about: "/about",
          projects: "/projects",
          timeline: "/timeline",
          services: "/services",
          contact: "/contact",
          help: "/help",
          skills: "/skills",
        };

        const command = intentionToCommand[intentionResponse.intention];

        if (command) {
          // Execute the command after a brief delay
          setTimeout(() => {
            const onTimelineNavigate = (newIndex: number) => {
              if (newIndex === -1) {
                handleSubmit("/timeline all");
              } else {
                handleSubmit(`/timeline ${newIndex + 1}`);
              }
            };

            const response = handleCommand(command, locale, { onTimelineNavigate });

            if (response.type === "clear") {
              setHistory([]);
              setIsProcessing(false);
              return;
            }

            if (response.type === "lang" && response.locale) {
              setLocale(response.locale);
              setIsProcessing(false);
              return;
            }

            if (response.type === "external" && response.url) {
              window.open(response.url, "_blank", "noopener,noreferrer");
            }

            if (response.text || response.component || response.panelType) {
              const msgType = response.type === "error" ? "error" : "ai";
              addMsg({
                id: Math.random().toString(36).slice(2),
                type: msgType,
                text: response.text,
                component: response.component,
                panelType: (response as any).panelType,
                panelData: {
                  ...(response as any).panelData,
                  onCommandRun: handleSubmit,
                },
                timestamp: Date.now(),
              });
            }

            setIsProcessing(false);
          }, 500);
        } else {
          setIsProcessing(false);
        }
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
      <Sidebar chats={chatHistoryItems} activeId="current" locale={locale} onCommandRun={handleSubmit} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 md:px-8 py-4 border-b border-[hsl(var(--border))] bg-gradient-to-r from-[hsl(var(--card))] to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
            <h1 className="text-sm font-semibold text-[hsl(var(--foreground))]">
              AI Portfolio
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
            {/* Chat Messages */}
            {history.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}

            {/* Tour Selector - shown after welcome */}
            {uiState === "tour-selector" && history.length > 0 && (
              <TourSelector
                onStartTour={(selectedOptions) => {
                  setSelectedTours(selectedOptions.map((opt) => opt.id));
                  setUiState("tour-player");
                }}
                locale={locale}
              />
            )}

            {/* Tour Player - shown when tours selected */}
            {uiState === "tour-player" && selectedTours.length > 0 && (
              <TourPlayer
                steps={selectedTours.map((tourId) => ({
                  id: tourId,
                  label: tourId.charAt(0).toUpperCase() + tourId.slice(1),
                  cmd: `/${tourId}`,
                }))}
                locale={locale}
                onCommandRun={handleSubmit}
                onExit={() => {
                  setUiState("chat");
                  setSelectedTours([]);
                }}
              />
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input Area - only show after welcome and tour selection complete */}
        {(uiState === "chat" || uiState === "welcome") && (
          <ChatInput onSubmit={handleSubmit} isProcessing={isProcessing} />
        )}
      </div>
    </div>
  );
}
