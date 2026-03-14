"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ContentPanelProps {
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
}

export default function ContentPanel({
  title,
  children,
  showBackButton = true,
}: ContentPanelProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-cyan-50 font-mono select-none">
      <div className="max-w-4xl mx-auto h-screen flex flex-col p-3 md:p-6">
        {/* Panel with glow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col border border-cyan-500/40 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,242,255,0.15)] bg-black/60 backdrop-blur-sm"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 md:px-4 py-2 border-b border-cyan-500/30 text-xs tracking-widest uppercase text-cyan-300 bg-black/40">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              {title}
            </span>
            {showBackButton && (
              <Link
                href="/"
                className="text-cyan-400 hover:text-cyan-300 transition-colors text-xs"
              >
                [BACK]
              </Link>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-3 md:px-4 py-3 md:py-4 space-y-2 text-xs md:text-sm leading-relaxed scrollbar-thin">
            {children}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-cyan-600/50 mt-3 md:mt-4"
        >
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            ← Back to terminal
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
