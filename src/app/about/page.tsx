"use client";

import { PageLayout, stagger, fadeItem } from "@/components/layouts/PageLayout";
import { motion } from "framer-motion";

const sections = [
  {
    label: "PROFILE",
    content: `Full-stack developer with a focus on AI-powered tools, developer experience,
and clean system design. I build things that work — fast, maintainable, and honest.`,
  },
  {
    label: "FOCUS",
    content: `Currently deep in AI integrations, LLM tooling, and building developer portfolios
that actually demonstrate real skills. Big fan of terminal interfaces.`,
  },
  {
    label: "STACK",
    content: `TypeScript · Next.js · React · Node.js · Python · Docker
PostgreSQL · Redis · Tailwind CSS · Framer Motion`,
  },
  {
    label: "CURRENTLY",
    content: `Building AI-powered developer tools. Exploring agentic systems.
Looking for challenging problems worth solving.`,
  },
];

export default function AboutPage() {
  return (
    <PageLayout title="ABOUT" subtitle="Developer profile">
      <motion.div variants={stagger} className="space-y-6">
        {sections.map((s) => (
          <motion.div key={s.label} variants={fadeItem} className="border-l-2 border-cyan-900/60 pl-4">
            <div className="text-xs text-cyan-400/60 mb-1">{s.label}</div>
            <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{s.content}</p>
          </motion.div>
        ))}
      </motion.div>
    </PageLayout>
  );
}
