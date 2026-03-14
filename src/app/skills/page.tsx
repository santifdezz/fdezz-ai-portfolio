"use client";

import { PageLayout, stagger, fadeItem } from "@/components/layouts/PageLayout";
import { motion } from "framer-motion";

interface Skill {
  name: string;
  level: number;
}

interface Category {
  label: string;
  skills: Skill[];
}

const categories: Category[] = [
  {
    label: "FRONTEND",
    skills: [
      { name: "TypeScript",     level: 90 },
      { name: "React / Next.js",level: 88 },
      { name: "Tailwind CSS",   level: 85 },
      { name: "Framer Motion",  level: 72 },
    ],
  },
  {
    label: "BACKEND",
    skills: [
      { name: "Node.js",        level: 85 },
      { name: "Python",         level: 80 },
      { name: "PostgreSQL",     level: 75 },
      { name: "Redis",          level: 65 },
    ],
  },
  {
    label: "DEVOPS",
    skills: [
      { name: "Docker",         level: 82 },
      { name: "Linux / Shell",  level: 78 },
      { name: "CI/CD",          level: 70 },
      { name: "Nginx",          level: 60 },
    ],
  },
  {
    label: "AI / ML",
    skills: [
      { name: "LLM Integration",level: 80 },
      { name: "Prompt Eng.",    level: 85 },
      { name: "RAG Systems",    level: 72 },
      { name: "Agent Design",   level: 68 },
    ],
  },
];

function SkillBar({ name, level }: Skill) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-300">{name}</span>
        <span className="text-slate-500">{level}%</span>
      </div>
      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #06b6d4, #10b981)" }}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function SkillsPage() {
  return (
    <PageLayout title="SKILLS" subtitle="Skill matrix overview">
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat) => (
          <motion.div key={cat.label} variants={fadeItem} className="space-y-3">
            <div className="text-xs text-cyan-400/60 border-b border-cyan-900/30 pb-1">{cat.label}</div>
            {cat.skills.map((s) => (
              <SkillBar key={s.name} {...s} />
            ))}
          </motion.div>
        ))}
      </motion.div>
    </PageLayout>
  );
}
