"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

interface NavItem {
  icon: string;
  label: string;
  command: string;
  description: string;
}

const navItems: NavItem[] = [
  { icon: "🏠", label: "Home", command: "/help", description: "Main terminal" },
  {
    icon: "👤",
    label: "About",
    command: "/about",
    description: "Developer profile",
  },
  {
    icon: "⚡",
    label: "Skills",
    command: "/skills",
    description: "Tech stack",
  },
  {
    icon: "📦",
    label: "Projects",
    command: "/projects",
    description: "Portfolio",
  },
  {
    icon: "📞",
    label: "Contact",
    command: "/contact",
    description: "Get in touch",
  },
];

export default function Sidebar() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full p-6 space-y-8">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
          <h1 className="text-xl font-bold text-cyan-300">SANTI.AI</h1>
        </div>
        <p className="text-xs text-cyan-500/60">AI Developer & Engineer</p>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item, idx) => (
          <motion.button
            key={item.command}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
            onClick={() => {
              // Trigger command in chat
              const event = new CustomEvent("executeCommand", {
                detail: { command: item.command },
              });
              window.dispatchEvent(event);
            }}
            onMouseEnter={() => setHoveredItem(item.command)}
            onMouseLeave={() => setHoveredItem(null)}
            className="w-full text-left group"
          >
            <div className="relative px-4 py-3 rounded-lg transition-all duration-200 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30">
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-cyan-200 group-hover:text-cyan-100">
                    {item.label}
                  </p>
                  <p className="text-xs text-cyan-600/70 group-hover:text-cyan-500/70">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Hover effect */}
              {hoveredItem === item.command && (
                <motion.div
                  layoutId="hoverBg"
                  className="absolute inset-0 bg-cyan-500/5 rounded-lg -z-10"
                  transition={{ type: "spring", bounce: 0.2 }}
                />
              )}
            </div>
          </motion.button>
        ))}
      </nav>

      {/* Status Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="space-y-4 pt-4 border-t border-cyan-500/10"
      >
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400">Status</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400">ONLINE</span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-cyan-400">Mode</span>
            <span className="text-cyan-300">INTERACTIVE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-cyan-400">Version</span>
            <span className="text-cyan-300">v2.1</span>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold text-cyan-300 uppercase">Connect</p>
          <div className="flex gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-2 py-2 rounded text-xs bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 transition-colors text-center"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-2 py-2 rounded text-xs bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 transition-colors text-center"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
