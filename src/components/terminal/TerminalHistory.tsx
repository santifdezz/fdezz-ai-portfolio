"use client";

import { useEffect, useRef } from "react";
import type { TerminalMessage } from "@/lib/terminalTypes";
import { ChatBubble } from "./ChatBubble";

interface TerminalHistoryProps {
  messages: TerminalMessage[];
}

export function TerminalHistory({ messages }: TerminalHistoryProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </>
  );
}
