export interface Project {
  id: string;
  name: string;
  description: string;
  overview: string;
  architecture: string;
  stack: string[];
  tags: string[];
  github?: string;
  demo?: string;
  year: number;
}

export const projects: Project[] = [
  {
    id: "ai-terminal-portfolio",
    name: "AI Terminal Portfolio",
    description: "Interactive terminal-interface portfolio powered by Next.js and React.",
    overview:
      "A portfolio built as a fully functional terminal. Visitors interact via typed commands to explore projects, skills, and contact info.",
    architecture:
      "Next.js App Router with client-side terminal state. No external APIs — all content is static and typed.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Framer Motion", "Docker"],
    tags: ["Frontend", "Portfolio", "Terminal UI"],
    github: "https://github.com/fdezz",
    year: 2025,
  },
  {
    id: "rag-system",
    name: "RAG Document Engine",
    description: "Retrieval-Augmented Generation system for private document Q&A.",
    overview:
      "Processes PDFs and internal docs into a vector store, enabling natural-language queries with cited sources.",
    architecture:
      "Python FastAPI backend, pgvector PostgreSQL, OpenAI embeddings, React frontend with streaming responses.",
    stack: ["Python", "FastAPI", "PostgreSQL", "pgvector", "OpenAI API", "React"],
    tags: ["AI", "RAG", "Backend"],
    github: "https://github.com/fdezz",
    year: 2025,
  },
  {
    id: "devops-dashboard",
    name: "DevOps Dashboard",
    description: "Real-time infrastructure monitoring dashboard with Docker and metrics.",
    overview:
      "Aggregates container stats, service health, and deployment logs into a single terminal-style dashboard.",
    architecture:
      "Node.js backend polling Docker API, WebSocket push to Next.js frontend, Redis for metric caching.",
    stack: ["Node.js", "Docker API", "WebSockets", "Redis", "Next.js", "TypeScript"],
    tags: ["DevOps", "Monitoring", "Fullstack"],
    github: "https://github.com/fdezz",
    year: 2024,
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
