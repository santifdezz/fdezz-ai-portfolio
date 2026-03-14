"use client";

import React from "react";
import { motion } from "framer-motion";
import { GitBranch, ExternalLink, Github } from "lucide-react";
import { PanelBase } from "./PanelBase";
import type { Locale } from "@/lib/portfolio-content";

interface ProjectItem {
  id: string;
  title: string;
  description: string;
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
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-[hsl(var(--secondary)/0.5)] rounded-lg border border-[hsl(var(--border)/0.5)] hover:border-purple-500/50 transition-colors cursor-pointer"
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
                      className="px-2 py-1 text-xs bg-purple-500/10 text-purple-300 rounded border border-purple-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Links */}
              {project.links && (
                <div className="flex gap-2 pt-2">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-purple-400 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-purple-400 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {project.links.external && (
                    <a
                      href={project.links.external}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-purple-400 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </PanelBase>
  );
}
