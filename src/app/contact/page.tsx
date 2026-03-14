"use client";

import { PageLayout, stagger, fadeItem } from "@/components/layouts/PageLayout";
import { motion } from "framer-motion";

const channels = [
  {
    label: "GITHUB",
    value: "github.com/fdezz",
    href: "https://github.com/fdezz",
    description: "Code, projects, open source",
  },
  {
    label: "EMAIL",
    value: "hello@fdezz.dev",
    href: "mailto:hello@fdezz.dev",
    description: "Direct contact",
  },
  {
    label: "LINKEDIN",
    value: "linkedin.com/in/fdezz",
    href: "https://linkedin.com/in/fdezz",
    description: "Professional network",
  },
];

export default function ContactPage() {
  return (
    <PageLayout title="CONTACT" subtitle="Channels of communication">
      <motion.div variants={stagger} className="space-y-4">
        {channels.map((ch) => (
          <motion.div key={ch.label} variants={fadeItem}>
            <a
              href={ch.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-cyan-900/40 rounded p-4 hover:border-cyan-500/50 hover:bg-cyan-950/10 transition-all group"
            >
              <div className="text-xs text-cyan-400/60 mb-1">{ch.label}</div>
              <div className="text-sm text-cyan-400 group-hover:text-cyan-300 mb-1 transition-colors">
                {ch.value}
              </div>
              <div className="text-xs text-slate-500">{ch.description}</div>
            </a>
          </motion.div>
        ))}
      </motion.div>
    </PageLayout>
  );
}
