"use client";

import { PageLayout, stagger, fadeItem } from "@/components/layouts/PageLayout";
import { motion } from "framer-motion";

const events = [
  {
    year: "2025",
    title: "AI Terminal Portfolio",
    description: "Built an interactive terminal portfolio. Exploring agentic AI systems.",
  },
  {
    year: "2024",
    title: "Full-Stack AI Projects",
    description: "RAG systems, LLM integrations, DevOps dashboards.",
  },
  {
    year: "2023",
    title: "Deep TypeScript & Next.js",
    description: "Mastered full-stack TypeScript. First production Next.js apps.",
  },
  {
    year: "2022",
    title: "Developer Career Start",
    description: "First professional role. React, Node.js, team collaboration.",
  },
];

export default function TimelinePage() {
  return (
    <PageLayout title="TIMELINE" subtitle="Career history">
      <motion.div variants={stagger} className="relative">
        <div className="absolute left-14 top-0 bottom-0 w-px bg-cyan-900/30" />
        <div className="space-y-8">
          {events.map((e) => (
            <motion.div key={e.year} variants={fadeItem} className="flex gap-6">
              <div className="w-12 shrink-0 text-right text-xs text-cyan-400/60 pt-0.5">{e.year}</div>
              <div className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full border border-cyan-500 bg-[#0a0a0a]" />
                <div className="text-sm text-slate-200 font-medium mb-1">{e.title}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{e.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageLayout>
  );
}
