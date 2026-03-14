"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Skill {
  name: string;
  level: number;
  category: string;
}

const skills: Skill[] = [
  { name: "Python", level: 100, category: "Backend" },
  { name: "Data Engineering", level: 90, category: "Backend" },
  { name: "React", level: 90, category: "Frontend" },
  { name: "TypeScript", level: 85, category: "Frontend" },
  { name: "Machine Learning", level: 85, category: "AI/ML" },
  { name: "LLM Systems", level: 80, category: "AI/ML" },
];

const timelineEvents = [
  { year: "2024-Q1", event: "AI Terminal Portfolio v1.0", status: "active" },
  { year: "2024-Q2", event: "Advanced Features", status: "planning" },
  { year: "2024-Q3", event: "Optimization & Deploy", status: "planning" },
  { year: "2024-Q4", event: "Polish & Expansion", status: "planning" },
];

const SkillBar = ({ skill }: { skill: Skill }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-1"
    >
      <div className="flex justify-between text-xs">
        <span className="text-cyan-300 font-semibold">{skill.name}</span>
        <span className="text-cyan-500">{skill.level}%</span>
      </div>
      <div className="h-1.5 bg-cyan-950/50 rounded-full overflow-hidden border border-cyan-500/20">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
        />
      </div>
    </motion.div>
  );
};

export default function RightPanel() {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "skills"
  );

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4 overflow-hidden">
      {/* Real-time Status */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border border-cyan-500/30 rounded-xl p-4 backdrop-blur-sm"
      >
        <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-widest mb-3">
          Live Status
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400">System</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-emerald-400">ACTIVE</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-cyan-400">CPU</span>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-cyan-300"
            >
              45%
            </motion.span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-cyan-400">Memory</span>
            <span className="text-cyan-300">62%</span>
          </div>
        </div>
      </motion.div>

      {/* Skills Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex-1 flex flex-col"
      >
        <button
          onClick={() => toggleSection("skills")}
          className="flex items-center justify-between px-4 py-3 bg-cyan-950/40 border border-cyan-500/30 rounded-lg hover:bg-cyan-950/60 transition-colors mb-2"
        >
          <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-widest">
            Top Skills
          </h3>
          <span className="text-cyan-400 text-xs">
            {expandedSection === "skills" ? "−" : "+"}
          </span>
        </button>

        {expandedSection === "skills" && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {skills.map((skill) => (
              <SkillBar key={skill.name} skill={skill} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Timeline Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex-1 flex flex-col"
      >
        <button
          onClick={() => toggleSection("timeline")}
          className="flex items-center justify-between px-4 py-3 bg-cyan-950/40 border border-cyan-500/30 rounded-lg hover:bg-cyan-950/60 transition-colors mb-2"
        >
          <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-widest">
            Timeline
          </h3>
          <span className="text-cyan-400 text-xs">
            {expandedSection === "timeline" ? "−" : "+"}
          </span>
        </button>

        {expandedSection === "timeline" && (
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {timelineEvents.map((item, idx) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-2 text-xs"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      item.status === "active"
                        ? "bg-emerald-400"
                        : "bg-cyan-500/50"
                    }`}
                  ></div>
                  {idx < timelineEvents.length - 1 && (
                    <div className="w-0.5 h-6 bg-cyan-500/30 mt-1"></div>
                  )}
                </div>
                <div>
                  <p className="text-cyan-400 font-semibold">{item.year}</p>
                  <p className="text-cyan-200/70">{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Projects Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border border-cyan-500/30 rounded-xl p-3 backdrop-blur-sm"
      >
        <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-widest mb-2">
          Active Projects
        </h3>
        <div className="space-y-1 text-xs">
          <div className="px-2 py-1 bg-cyan-500/10 rounded text-cyan-300 hover:bg-cyan-500/20 transition-colors cursor-pointer">
            RAG System
          </div>
          <div className="px-2 py-1 bg-cyan-500/10 rounded text-cyan-300 hover:bg-cyan-500/20 transition-colors cursor-pointer">
            Data Platform
          </div>
          <div className="px-2 py-1 bg-cyan-500/10 rounded text-cyan-300 hover:bg-cyan-500/20 transition-colors cursor-pointer">
            AI Portfolio
          </div>
        </div>
      </motion.div>
    </div>
  );
}
