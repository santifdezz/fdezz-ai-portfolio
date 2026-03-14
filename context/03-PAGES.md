# BATCH 3 — Páginas de Contenido

## Objetivo
Crear todas las páginas que se abren con comandos.

---

## Archivo 1: `src/app/about/page.tsx`

```typescript
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-dark text-[#e6f7ff] p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="border-b border-cyan-500/30 pb-4">
            <div className="text-xs uppercase tracking-widest text-cyan-400 mb-2">
              {"←"} <Link href="/">back to terminal</Link>
            </div>
            <h1 className="text-2xl uppercase tracking-widest text-cyan-300 mb-2">
              Developer Profile
            </h1>
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-8">
          {/* Who I Am */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="border-l-2 border-cyan-500/40 pl-4"
          >
            <h2 className="text-lg uppercase tracking-wide text-cyan-400 mb-4">
              Who I Am
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              AI Developer and Data Engineer focused on building intelligent systems.
              Passionate about machine learning, data infrastructure, and solving complex
              problems with code.
            </p>
          </motion.section>

          {/* What I Build */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="border-l-2 border-cyan-500/40 pl-4"
          >
            <h2 className="text-lg uppercase tracking-wide text-cyan-400 mb-4">
              What I Build
            </h2>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>• Retrieval Augmented Generation (RAG) systems</li>
              <li>• Data pipelines and ETL infrastructure</li>
              <li>• Machine learning models and inference engines</li>
              <li>• AI agent systems with tool use</li>
            </ul>
          </motion.section>

          {/* Current Focus */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="border-l-2 border-cyan-500/40 pl-4"
          >
            <h2 className="text-lg uppercase tracking-wide text-cyan-400 mb-4">
              Current Focus
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Working on scalable AI systems, prompt engineering best practices,
              and production-ready LLM applications.
            </p>
          </motion.section>
        </div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-6 border-t border-cyan-500/30"
        >
          <Link
            href="/"
            className="text-xs text-cyan-400 hover:text-cyan-300 transition"
          >
            ← back to terminal
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
```

---

## Archivo 2: `src/app/skills/page.tsx`

```typescript
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function SkillsPage() {
  const skills = [
    { name: "Python", level: 95 },
    { name: "Machine Learning", level: 85 },
    { name: "Data Engineering", level: 90 },
    { name: "LLM Systems", level: 80 },
    { name: "FastAPI", level: 85 },
    { name: "PostgreSQL", level: 80 },
    { name: "Docker", level: 85 },
    { name: "Cloud (AWS/GCP)", level: 75 },
  ];

  return (
    <main className="min-h-screen bg-dark text-[#e6f7ff] p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="border-b border-cyan-500/30 pb-4">
            <div className="text-xs uppercase tracking-widest text-cyan-400 mb-2">
              {"←"} <Link href="/">back to terminal</Link>
            </div>
            <h1 className="text-2xl uppercase tracking-widest text-cyan-300">
              Skill Matrix
            </h1>
          </div>
        </motion.div>

        {/* Skills Grid */}
        <div className="space-y-4">
          {skills.map((skill, idx) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="space-y-1"
            >
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 uppercase tracking-wide">
                  {skill.name}
                </span>
                <span className="text-cyan-400">{skill.level}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ delay: 0.3 + idx * 0.05, duration: 1 }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-6 border-t border-cyan-500/30"
        >
          <Link
            href="/"
            className="text-xs text-cyan-400 hover:text-cyan-300 transition"
          >
            ← back to terminal
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
```

---

## Archivo 3: `src/app/projects/page.tsx`

```typescript
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

const projects: Project[] = [
  {
    id: "rag-system",
    name: "RAG System",
    description: "Retrieval Augmented Generation pipeline with LangChain",
    tags: ["Python", "LangChain", "Vector DB"],
  },
  {
    id: "data-platform",
    name: "Data Platform",
    description: "ETL infrastructure for real-time data processing",
    tags: ["Python", "Kafka", "PostgreSQL"],
  },
  {
    id: "recommender-engine",
    name: "Recommender Engine",
    description: "ML-based ranking system with online learning",
    tags: ["Python", "Scikit-learn", "Redis"],
  },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-dark text-[#e6f7ff] p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="border-b border-cyan-500/30 pb-4">
            <div className="text-xs uppercase tracking-widest text-cyan-400 mb-2">
              {"←"} <Link href="/">back to terminal</Link>
            </div>
            <h1 className="text-2xl uppercase tracking-widest text-cyan-300">
              Project Index
            </h1>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="space-y-4">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="border border-cyan-500/40 rounded-lg p-4 bg-[#050505] hover:border-cyan-500/60 transition cursor-pointer"
            >
              <Link href={`/projects/${project.id}`}>
                <h2 className="text-lg uppercase tracking-wide text-cyan-400 mb-2 hover:text-cyan-300">
                  [{project.id.toUpperCase()}]
                </h2>
                <p className="text-sm text-slate-300 mb-3">{project.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 pt-6 border-t border-cyan-500/30"
        >
          <Link
            href="/"
            className="text-xs text-cyan-400 hover:text-cyan-300 transition"
          >
            ← back to terminal
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
```

---

## Archivo 4: `src/app/projects/[id]/page.tsx`

```typescript
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const projectData: Record<string, any> = {
  "rag-system": {
    name: "RAG System",
    description: "Retrieval Augmented Generation pipeline",
    overview:
      "A production-ready RAG system that retrieves context from a vector database and generates responses using LLMs.",
    architecture: "Retrieval Module → Context Ranking → LLM Generation",
    stack: ["Python", "LangChain", "Pinecone", "OpenAI", "FastAPI"],
    github: "https://github.com/tu-usuario/rag-system",
  },
  "data-platform": {
    name: "Data Platform",
    description: "ETL infrastructure for real-time processing",
    overview:
      "Scalable data ingestion and transformation platform handling millions of events per day.",
    architecture: "Kafka → Spark → Data Warehouse → Analytics",
    stack: ["Python", "Kafka", "Apache Spark", "PostgreSQL", "Docker"],
    github: "https://github.com/tu-usuario/data-platform",
  },
  "recommender-engine": {
    name: "Recommender Engine",
    description: "ML-based ranking system",
    overview:
      "Machine learning system that learns from user interactions and provides personalized recommendations.",
    architecture: "Feature Engineering → Model Training → Online Scoring",
    stack: ["Python", "Scikit-learn", "Redis", "FastAPI", "PostgreSQL"],
    github: "https://github.com/tu-usuario/recommender-engine",
  },
};

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = projectData[params.id];

  if (!project) {
    return (
      <main className="min-h-screen bg-dark text-[#e6f7ff] p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-cyan-400 mb-4">Project not found</h1>
          <Link href="/projects" className="text-cyan-400 hover:text-cyan-300">
            ← back to projects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-dark text-[#e6f7ff] p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="border-b border-cyan-500/30 pb-4">
            <div className="text-xs uppercase tracking-widest text-cyan-400 mb-2">
              {"←"} <Link href="/projects">back to projects</Link>
            </div>
            <h1 className="text-2xl uppercase tracking-widest text-cyan-300">
              {project.name}
            </h1>
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-8">
          {/* Overview */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="border-l-2 border-cyan-500/40 pl-4"
          >
            <h2 className="text-lg uppercase tracking-wide text-cyan-400 mb-2">
              Overview
            </h2>
            <p className="text-sm text-slate-300">{project.overview}</p>
          </motion.section>

          {/* Architecture */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="border-l-2 border-cyan-500/40 pl-4"
          >
            <h2 className="text-lg uppercase tracking-wide text-cyan-400 mb-2">
              Architecture
            </h2>
            <p className="text-sm text-slate-300">{project.architecture}</p>
          </motion.section>

          {/* Stack */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="border-l-2 border-cyan-500/40 pl-4"
          >
            <h2 className="text-lg uppercase tracking-wide text-cyan-400 mb-4">
              Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech: string) => (
                <span
                  key={tech}
                  className="text-xs px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/40"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.section>

          {/* GitHub */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/40 hover:bg-cyan-500/30 transition"
            >
              → View on GitHub
            </a>
          </motion.section>
        </div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-6 border-t border-cyan-500/30"
        >
          <Link
            href="/projects"
            className="text-xs text-cyan-400 hover:text-cyan-300 transition"
          >
            ← back to projects
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
```

---

## Archivo 5: `src/app/contact/page.tsx`

```typescript
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactPage() {
  const contacts = [
    {
      label: "Email",
      value: "hello@example.com",
      href: "mailto:hello@example.com",
    },
    {
      label: "GitHub",
      value: "github.com/tu-usuario",
      href: "https://github.com/tu-usuario",
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/tu-usuario",
      href: "https://linkedin.com/in/tu-usuario",
    },
  ];

  return (
    <main className="min-h-screen bg-dark text-[#e6f7ff] p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="border-b border-cyan-500/30 pb-4">
            <div className="text-xs uppercase tracking-widest text-cyan-400 mb-2">
              {"←"} <Link href="/">back to terminal</Link>
            </div>
            <h1 className="text-2xl uppercase tracking-widest text-cyan-300">
              Communication Channels
            </h1>
          </div>
        </motion.div>

        {/* Contacts */}
        <div className="space-y-4">
          {contacts.map((contact, idx) => (
            <motion.a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="block border-l-2 border-cyan-500/40 pl-4 py-2 hover:border-cyan-500/60 transition"
            >
              <div className="text-xs uppercase tracking-wide text-cyan-400 mb-1">
                {contact.label}
              </div>
              <div className="text-sm text-slate-300">{contact.value}</div>
            </motion.a>
          ))}
        </div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 pt-6 border-t border-cyan-500/30"
        >
          <Link
            href="/"
            className="text-xs text-cyan-400 hover:text-cyan-300 transition"
          >
            ← back to terminal
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
```

---

## ✅ Checklist

- [ ] `src/app/about/page.tsx` creado
- [ ] `src/app/skills/page.tsx` creado
- [ ] `src/app/projects/page.tsx` creado
- [ ] `src/app/projects/[id]/page.tsx` creado
- [ ] `src/app/contact/page.tsx` creado
- [ ] Todos los links funcionan

**Siguiente paso:** → `04-BOOT-SCREEN.md`
