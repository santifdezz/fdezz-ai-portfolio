"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export { item as fadeItem, container as stagger };

export function PageLayout({ title, subtitle, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e6f7ff] font-mono">
      <div className="max-w-3xl mx-auto p-6 md:p-10">

        {/* Back */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-cyan-400 transition-colors"
          >
            ← back to terminal
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 border-b border-cyan-900/30 pb-4"
        >
          <div className="text-xs text-slate-500 mb-1">fdezz@ai-terminal:~$ /{title.toLowerCase()}</div>
          <h1 className="text-xl text-cyan-400 font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
        </motion.div>

        {/* Content */}
        <motion.div variants={container} initial="hidden" animate="show">
          {children}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-4 border-t border-cyan-900/30"
        >
          <Link href="/" className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">
            ← back to terminal
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
