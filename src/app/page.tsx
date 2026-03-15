"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BootScreen } from "@/components/terminal/BootScreen";
import Terminal from "@/components/terminal/Terminal";
import { NeuralBackground } from "@/components/background/NeuralBackground";

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <main className="relative w-full h-screen bg-[#050505] overflow-hidden">
      <NeuralBackground />
      <AnimatePresence mode="wait">
        {!booted ? (
          <motion.div
            key="boot"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <BootScreen locale="en" onComplete={() => setBooted(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Terminal />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
