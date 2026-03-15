"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { TerminalMessage, Locale } from "@/lib/terminalTypes";
import { TERMINAL_CONFIG } from "@/lib/terminalTypes";
import { getWelcomeMessages, getAboutPanelResponse, getProjectsPanelResponse, getTimelinePanelResponse, getServicesPanelResponse, getContactPanelResponse, getHelpPanelResponse, getSkillsPanelResponse } from "@/lib/responses";
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

const TOUR_CMDS: Record<string, Record<string, string>> = {
  es: {
    about:     "Cuéntame sobre Santiago, ¿quién es?",
    projects:  "¿Qué proyectos ha construido?",
    timeline:  "¿Cuál es su trayectoria profesional?",
    skills:    "¿Qué habilidades técnicas tiene?",
    services:  "¿Qué servicios ofrece?",
    contact:   "¿Cómo puedo contactarle?",
  },
  en: {
    about:     "Tell me about Santiago, who is he?",
    projects:  "What projects has he built?",
    timeline:  "What is his career journey?",
    skills:    "What technical skills does he have?",
    services:  "What services does he offer?",
    contact:   "How can I get in touch with him?",
  },
};

function getTourCmd(tourId: string, locale: string): string {
  return TOUR_CMDS[locale]?.[tourId] ?? TOUR_CMDS["en"][tourId] ?? tourId;
}

export default function Terminal() {
  const [history, setHistory] = useState<TerminalMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [locale, setLocale] = useLocalStorage("fdezz-portfolio-lang", "es");
  const [uiState, setUiState] = useState<UIState>("welcome");
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const time = useNow();
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const wasAtBottomRef = useRef(true);

  // Track if user is scrolled to bottom
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      wasAtBottomRef.current = isAtBottom;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Smart auto-scroll: only scroll if already at bottom or first message
  useEffect(() => {
    if (!wasAtBottomRef.current && history.length > 1) return;

    // Delay scroll slightly so message appears first
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timer);
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
      addMsg(makeMsg("user", input));
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

        // Map intention to panel response function
        const intentionToPanel: Record<string, () => any> = {
          about: () => getAboutPanelResponse(locale),
          projects: () => getProjectsPanelResponse(locale, intentionResponse.filter),
          timeline: () => getTimelinePanelResponse(locale),
          services: () => getServicesPanelResponse(locale),
          contact: () => getContactPanelResponse(locale),
          help: () => getHelpPanelResponse(locale),
          skills: () => getSkillsPanelResponse(locale),
        };

        const getPanelResponse = intentionToPanel[intentionResponse.intention];

        if (getPanelResponse) {
          // Execute the panel response after a brief delay
          setTimeout(() => {
            const response = getPanelResponse();

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
    [addMsg, locale]
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
      {/* Sidebar — always visible on md+, drawer on mobile */}
      <div className={`${sidebarOpen ? "block" : "hidden"} md:block fixed md:static inset-0 z-40`}>
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 bg-black/60 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className="relative z-10 h-full">
          <Sidebar
            chats={chatHistoryItems}
            activeId="current"
            locale={locale}
            onCommandRun={handleSubmit}
            onLocaleChange={setLocale}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex justify-between items-center px-4 md:px-8 py-4 border-b border-[hsl(var(--border))] bg-gradient-to-r from-[hsl(var(--card))] to-transparent">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
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
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
          <div className="max-w-4xl mx-auto space-y-2">
            {/* Chat Messages */}
            {history.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}

            {/* Tour Selector - shown after welcome */}
            {uiState === "tour-selector" && history.length > 0 && (
              <TourSelector
                onStartTour={(selectedOptions) => {
                  const ids = selectedOptions.map((opt) => opt.id);
                  setSelectedTours(ids);
                  setUiState("tour-player");
                  // Fire first step immediately — avoids React StrictMode double-fire
                  if (selectedOptions.length > 0) {
                    const firstCmd = getTourCmd(selectedOptions[0].id, locale);
                    handleSubmit(firstCmd);
                  }
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
                  cmd: getTourCmd(tourId, locale),
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
          <ChatInput onSubmit={handleSubmit} isProcessing={isProcessing} locale={locale} />
        )}
      </div>
    </div>
  );
}
