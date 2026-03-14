"use client";

import { motion } from "framer-motion";
import { Terminal, Briefcase, MapPin, Sparkles } from "lucide-react";
import type { Locale } from "@/lib/terminalTypes";
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
  locale?: Locale;
  onCommandRun: (cmd: string) => void;
  onLocaleChange?: (locale: Locale) => void;
}

export function Sidebar({ chats, activeId, locale = "es", onCommandRun, onLocaleChange }: SidebarProps) {
  const isES = locale === "es";
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-[hsl(var(--card))] to-[hsl(var(--card)/0.5)] border-r border-[hsl(var(--border))] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-2 mb-1">
          <Terminal className="w-4 h-4 text-purple-400" />
          <h1 className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">
            SFSEOANE.ES
          </h1>
        </div>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
          {isES ? "Portafolio IA" : "AI Portfolio"}
        </p>
      </div>

      {/* Status Card */}
      <div className="px-4 pt-4 pb-3 border-b border-[hsl(var(--border))]">
        <div className="space-y-3 text-xs">
          {/* Online Status */}
          <div className="flex items-center gap-2">
            <StatusDot status="online" size="sm" />
            <span className="text-[hsl(var(--foreground))]">
              {isES ? "En línea & Codificando" : "Online & Coding"}
            </span>
          </div>

          {/* Role */}
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <div>
              <p className="text-[hsl(var(--foreground))] font-medium">
                {isES ? "Ingeniero de Datos" : "Data Engineer"}
              </p>
              <p className="text-[hsl(var(--muted-foreground))]">
                @ Qaleon
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <div>
              <p className="text-[hsl(var(--foreground))]">
                {isES ? "Madrid, España" : "Madrid, Spain"}
              </p>
              <p className="text-[hsl(var(--muted-foreground))]">
                {isES ? "Actualmente: IA y Big Data" : "Currently: AI & Big Data"}
              </p>
            </div>
          </div>

          {/* Made By */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <div>
              <p className="text-[hsl(var(--foreground))] font-medium">
                {isES ? "Creado por Santi" : "Made by Santi"}
              </p>
              <p className="text-[hsl(var(--muted-foreground))]">
                {isES ? "Apasionado por Datos" : "Passionate about Data"}
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

      {/* Quick Commands */}
      <div className="px-4 py-3 border-t border-[hsl(var(--border))] space-y-2">
        <div className="flex items-center gap-1">
          <p className="text-[10px] uppercase font-semibold text-purple-400 tracking-wider">
            {isES ? "👇 Explora Aquí" : "👇 Explore"}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { text: isES ? "sobre" : "about me", label: isES ? "Sobre" : "About" },
            { text: isES ? "proyectos" : "projects", label: isES ? "Proyectos" : "Projects" },
            { text: isES ? "experiencia" : "experience", label: isES ? "Experiencia" : "Timeline" },
            { text: isES ? "contacto" : "contact", label: isES ? "Contacto" : "Contact" },
          ].map((item) => (
            <motion.button
              key={item.text}
              onClick={() => onCommandRun(item.text)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 text-xs bg-purple-500/10 border border-purple-500/30 rounded-full hover:bg-purple-500/20 hover:border-purple-500/50 transition-all text-purple-300 font-medium cursor-pointer"
            >
              {item.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[hsl(var(--border))] space-y-3">
        {/* Language Switcher */}
        <div className="flex items-center justify-center gap-2">
          <motion.button
            onClick={() => onLocaleChange?.("en")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${
              locale === "en"
                ? "bg-purple-500/20 border border-purple-500/50 text-purple-300"
                : "bg-[hsl(var(--secondary)/0.5)] border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
          >
            EN
          </motion.button>
          <motion.button
            onClick={() => onLocaleChange?.("es")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${
              locale === "es"
                ? "bg-purple-500/20 border border-purple-500/50 text-purple-300"
                : "bg-[hsl(var(--secondary)/0.5)] border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
          >
            ES
          </motion.button>
        </div>

        {/* Help Hint */}
        <div className="text-[11px] text-[hsl(var(--muted-foreground))] text-center space-y-1">
          <p>{isES ? "Chat Activo • Solo Lectura" : "Read-only • Active chat only"}</p>
          <div className="flex items-center justify-center gap-1 pt-2 border-t border-[hsl(var(--border))] pt-3">
            <span className="text-xs text-[hsl(var(--primary))]">/help</span>
            <span className="text-[hsl(var(--muted-foreground))]">{isES ? "para explorar" : "to explore"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
