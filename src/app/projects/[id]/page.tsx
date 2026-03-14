"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PageLayout, stagger, fadeItem } from "@/components/layouts/PageLayout";
import { getProject } from "@/lib/projects";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const project = getProject(id);

  if (!project) return notFound();

  return (
    <PageLayout title={project.name} subtitle={project.description}>
      <motion.div variants={stagger} className="space-y-6">

        <motion.div variants={fadeItem} className="border-l-2 border-cyan-900/60 pl-4">
          <div className="text-xs text-cyan-400/60 mb-1">OVERVIEW</div>
          <p className="text-sm text-slate-300 leading-relaxed">{project.overview}</p>
        </motion.div>

        <motion.div variants={fadeItem} className="border-l-2 border-cyan-900/60 pl-4">
          <div className="text-xs text-cyan-400/60 mb-1">ARCHITECTURE</div>
          <p className="text-sm text-slate-300 leading-relaxed">{project.architecture}</p>
        </motion.div>

        <motion.div variants={fadeItem} className="border-l-2 border-cyan-900/60 pl-4">
          <div className="text-xs text-cyan-400/60 mb-2">STACK</div>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-1 border border-cyan-900/50 text-cyan-400/80 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {project.github && (
          <motion.div variants={fadeItem}>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-900/40 px-3 py-1.5 rounded hover:border-cyan-500/50 transition-all"
            >
              View on GitHub →
            </a>
          </motion.div>
        )}

        <motion.div variants={fadeItem}>
          <Link
            href="/projects"
            className="text-xs text-slate-500 hover:text-cyan-400 transition-colors"
          >
            ← all projects
          </Link>
        </motion.div>

      </motion.div>
    </PageLayout>
  );
}
