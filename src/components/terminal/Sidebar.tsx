"use client";

import { motion } from "framer-motion";
import { StatusDot } from "./StatusDot";

interface ChatItem {
  id: string;
  title: string;
  preview?: string;
  timestamp?: number;
  isActive?: boolean;
}

interface SidebarProps {
  chats: ChatItem[];
  activeId?: string;
}

export function Sidebar({ chats, activeId }: SidebarProps) {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-[hsl(var(--card))] to-[hsl(var(--card)/0.5)] border-r border-[hsl(var(--border))] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[hsl(var(--border))]">
        <h1 className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">
          ✨ FDEZZ.AI
        </h1>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
          AI Terminal Portfolio
        </p>
      </div>

      {/* Status Card */}
      <div className="px-4 pt-4 pb-3 border-b border-[hsl(var(--border))]">
        <div className="space-y-3 text-xs">
          {/* Online Status */}
          <div className="flex items-center gap-2">
            <StatusDot status="online" size="sm" />
            <span className="text-[hsl(var(--foreground))]">
              Online & Coding
            </span>
          </div>

          {/* Role */}
          <div className="flex items-center gap-2">
            <span className="text-lg">💼</span>
            <div>
              <p className="text-[hsl(var(--foreground))] font-medium">
                Data Engineer
              </p>
              <p className="text-[hsl(var(--muted-foreground))]">
                @ Qaleon
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <span className="text-lg">📍</span>
            <div>
              <p className="text-[hsl(var(--foreground))]">
                Madrid, Spain
              </p>
              <p className="text-[hsl(var(--muted-foreground))]">
                Currently: AI & Big Data
              </p>
            </div>
          </div>

          {/* Made By */}
          <div className="flex items-center gap-2">
            <span className="text-lg">🚀</span>
            <div>
              <p className="text-[hsl(var(--foreground))] font-medium">
                Made by Santi
              </p>
              <p className="text-[hsl(var(--muted-foreground))]">
                Passionate about Data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto space-y-1 p-2">
        {chats.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              No conversations yet
            </p>
          </div>
        ) : (
          chats.map((chat) => (
            <motion.div
              key={chat.id}
              className={`p-3 rounded-lg cursor-not-allowed transition-colors ${
                activeId === chat.id
                  ? "bg-[hsl(var(--primary)/0.15)] border border-[hsl(var(--primary)/0.3)]"
                  : "hover:bg-[hsl(var(--secondary))] border border-transparent"
              }`}
              whileHover={activeId !== chat.id ? { x: 4 } : {}}
            >
              <p className="text-xs font-medium text-[hsl(var(--foreground))] truncate">
                {chat.title}
              </p>
              {chat.preview && (
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] truncate mt-1">
                  {chat.preview}
                </p>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[hsl(var(--border))] space-y-3">
        <div className="text-[11px] text-[hsl(var(--muted-foreground))] text-center space-y-1">
          <p>Read-only • Active chat only</p>
          <div className="flex items-center justify-center gap-1 pt-2 border-t border-[hsl(var(--border))] pt-3">
            <span className="text-xs text-[hsl(var(--primary))]">/help</span>
            <span className="text-[hsl(var(--muted-foreground))]">to explore</span>
          </div>
        </div>
      </div>
    </div>
  );
}
