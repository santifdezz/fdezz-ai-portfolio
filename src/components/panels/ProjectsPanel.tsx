"use client";

import React from "react";
import { motion } from "framer-motion";
import { GitBranch, ExternalLink, Github, ChevronDown, CheckCircle2 } from "lucide-react";
import { PanelBase } from "./PanelBase";
import type { Locale } from "@/lib/portfolio-content";

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  features?: string[];
  technologies?: string[];
  links?: {
    github?: string;
    demo?: string;
    external?: string;
  };
  status?: "completed" | "in-progress" | "planned";
}

interface ProjectsPanelProps {
  projects: ProjectItem[];
  locale?: Locale;
}

const statusColors = {
  completed: "bg-green-500/20 text-green-300 border-green-500/30",
  "in-progress": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  planned: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const statusLabels = {
  en: {
    completed: "Completed",
    "in-progress": "In Progress",
    planned: "Planned",
  },
  es: {
    completed: "Completado",
    "in-progress": "En Desarrollo",
    planned: "Planificado",
  },
};

export function ProjectsPanel({
  projects,
  locale = "en",
}: ProjectsPanelProps) {
  const isES = locale === "es";
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  return (
    <PanelBase
      icon={GitBranch}
      title={isES ? "Proyectos" : "Projects"}
      accentColor="purple"
    >
      <div className="space-y-4">
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="bg-[hsl(var(--secondary)/0.5)] rounded-lg border border-[hsl(var(--border)/0.5)] hover:border-purple-500/50 transition-all overflow-hidden"
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-4 cursor-pointer"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-[hsl(var(--foreground))]">
                      {project.title}
                    </h4>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                      {project.description}
                    </p>
                  </div>
                  {project.status && (
                    <span
                      className={`px-2 py-1 text-xs rounded border whitespace-nowrap ${
                        statusColors[project.status]
                      }`}
                    >
                      {
                        statusLabels[isES ? "es" : "en"][
                          project.status as keyof typeof statusLabels["en"]
                        ]
                      }
                    </span>
                  )}
                </div>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-purple-500/10 text-purple-300 rounded border border-purple-500/30 hover:bg-purple-500/20 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Features Toggle + Links */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-2">
                    {project.links?.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-purple-400 transition-colors"
                        title="GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.links?.demo && (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-purple-400 transition-colors"
                        title={isES ? "Demo" : "Demo"}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.links?.external && (
                      <a
                        href={project.links.external}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-purple-400 transition-colors"
                        title={isES ? "Enlace" : "Link"}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Features Expand Button */}
                  {project.features && project.features.length > 0 && (
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === project.id ? null : project.id)
                      }
                      className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <span>{isES ? "Características" : "Features"}</span>
                      <motion.div
                        animate={{
                          rotate: expandedId === project.id ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-3 h-3" />
                      </motion.div>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Features List (Expandable) */}
            {project.features && project.features.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: expandedId === project.id ? "auto" : 0,
                  opacity: expandedId === project.id ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-[hsl(var(--border)/0.3)]"
              >
                <div className="p-3 space-y-1.5 bg-[hsl(var(--secondary)/0.3)]">
                  {project.features.map((feature, fidx) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: fidx * 0.05 }}
                      className="flex items-start gap-2 text-xs text-[hsl(var(--muted-foreground))]"
                    >
                      <CheckCircle2 className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </PanelBase>
  );
}
