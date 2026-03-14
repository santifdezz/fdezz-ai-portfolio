"use client";

import Link from "next/link";
import { PageLayout, stagger, fadeItem } from "@/components/layouts/PageLayout";
import { motion } from "framer-motion";
import { projects } from "@/lib/projects";

export default function ProjectsPage() {
  return (
    <PageLayout title="PROJECTS" subtitle="Project index">
      <motion.div variants={stagger} className="space-y-4">
        {projects.map((project) => (
          <motion.div key={project.id} variants={fadeItem}>
            <Link href={`/projects/${project.id}`}>
              <div className="border border-cyan-900/40 rounded p-4 hover:border-cyan-500/50 hover:bg-cyan-950/10 transition-all cursor-pointer group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-cyan-400 text-sm font-medium group-hover:text-cyan-300 transition-colors">
                        {project.name}
                      </span>
                      <span className="text-xs text-slate-600">{project.year}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-1.5 py-0.5 border border-cyan-900/40 text-cyan-500/70 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-slate-600 group-hover:text-cyan-400 transition-colors text-sm shrink-0">→</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </PageLayout>
  );
}
