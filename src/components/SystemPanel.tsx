"use client";

import { motion } from "framer-motion";

export default function SystemPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="border border-cyan-500/40 rounded-lg p-3 md:p-4 bg-black/60 backdrop-blur-sm shadow-[0_0_20px_rgba(0,242,255,0.1)] mb-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-cyan-500/20">
        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
        <h3 className="text-cyan-300 text-xs md:text-sm font-bold uppercase tracking-wider">
          SYSTEM STATUS
        </h3>
      </div>

      {/* Grid of info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <p className="text-cyan-400 font-bold">Developer</p>
          <p className="text-cyan-100/70">Santi</p>
        </div>
        <div>
          <p className="text-cyan-400 font-bold">Role</p>
          <p className="text-cyan-100/70">AI Engineer</p>
        </div>
        <div>
          <p className="text-cyan-400 font-bold">Projects</p>
          <p className="text-cyan-100/70">4+</p>
        </div>
        <div>
          <p className="text-cyan-400 font-bold">Status</p>
          <p className="text-emerald-400 font-bold">ONLINE</p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-3 pt-3 border-t border-cyan-500/10 text-xs space-y-1">
        <div className="flex justify-between">
          <span className="text-cyan-400">Stack:</span>
          <span className="text-cyan-100/70">Python • ML • Next.js</span>
        </div>
        <div className="flex justify-between">
          <span className="text-cyan-400">Version:</span>
          <span className="text-cyan-100/70">v2.1</span>
        </div>
      </div>
    </motion.div>
  );
}
