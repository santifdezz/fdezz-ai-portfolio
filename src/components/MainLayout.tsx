"use client";

import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./layout/Sidebar";
import ChatInterface from "./layout/ChatInterface";
import RightPanel from "./layout/RightPanel";
import BootScreen from "./BootScreen";
import { useState } from "react";

export default function MainLayout() {
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-cyan-50 font-sans">
      {/* Boot Screen */}
      <AnimatePresence>
        {!bootComplete && (
          <BootScreen onBootComplete={() => setBootComplete(true)} />
        )}
      </AnimatePresence>

      {/* Main Layout */}
      {bootComplete && (
        <div className="flex h-screen overflow-hidden">
          {/* Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-64 border-r border-cyan-500/20 bg-black/40 backdrop-blur-sm overflow-y-auto"
          >
            <Sidebar />
          </motion.div>

          {/* Center Chat */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <ChatInterface />
          </motion.div>

          {/* Right Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-80 border-l border-cyan-500/20 bg-black/40 backdrop-blur-sm overflow-y-auto"
          >
            <RightPanel />
          </motion.div>
        </div>
      )}
    </div>
  );
}
