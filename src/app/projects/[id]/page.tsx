import ContentPanel from "@/components/ContentPanel";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Project Details | AI Terminal Portfolio",
};

const projectsData = {
  "1": {
    title: "RAG SYSTEM",
    overview:
      "Advanced retrieval-augmented generation system for semantic search and context injection in LLM applications.",
    architecture:
      "Backend built with FastAPI, vector database integration via Pinecone, LLM chains through LangChain, and React frontend for user interaction.",
    technologies: [
      "Python 3.11",
      "FastAPI",
      "LangChain",
      "Pinecone",
      "PostgreSQL",
      "Docker",
      "React",
    ],
    github: "https://github.com/devalentineomonya/RAG-System",
    status: "ACTIVE",
    impact: "Used in production for semantic search across 100K+ documents",
  },
  "2": {
    title: "DATA PLATFORM",
    overview:
      "End-to-end data platform handling ingestion, transformation, and analytics for enterprise data pipelines.",
    architecture:
      "Apache Spark for distributed ETL, Airflow for orchestration, Snowflake for data warehouse, and dbt for transformation layer.",
    technologies: [
      "Python",
      "Apache Spark",
      "Apache Airflow",
      "Snowflake",
      "dbt",
      "PostgreSQL",
      "Docker",
    ],
    github: "https://github.com/devalentineomonya/DataPlatform",
    status: "ACTIVE",
    impact: "Processes 10M+ events daily with 99.9% uptime",
  },
  "3": {
    title: "RECOMMENDER ENGINE",
    overview:
      "Machine learning-based recommendation system providing personalized content discovery for users.",
    architecture:
      "Collaborative filtering and content-based algorithms with real-time scoring, Redis caching, and A/B testing framework.",
    technologies: [
      "Python",
      "scikit-learn",
      "FastAPI",
      "Redis",
      "PostgreSQL",
      "Docker",
    ],
    github: "https://github.com/devalentineomonya/RecommenderEngine",
    status: "LIVE",
    impact: "40% improvement in click-through rate",
  },
  "4": {
    title: "AI PORTFOLIO",
    overview:
      "Interactive AI terminal portfolio showcasing modern web development with Next.js and real-time interactions.",
    architecture:
      "Next.js 16 with App Router, TypeScript for type safety, Tailwind CSS for styling, and Framer Motion for animations.",
    technologies: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
    github: "https://github.com/devalentineomonya/portfolio",
    status: "BUILDING",
    impact: "Demonstrates modern frontend development practices",
  },
};

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = params;
  const project = projectsData[id as keyof typeof projectsData];

  if (!project) {
    notFound();
  }

  return (
    <ContentPanel title={`PROJECT: ${project.title}`} showBackButton>
      <section className="space-y-5">
        <div>
          <h2 className="text-cyan-300 font-bold text-sm md:text-base mb-2 uppercase tracking-wider">
            Overview
          </h2>
          <p className="text-cyan-100/80 text-xs md:text-sm">{project.overview}</p>
        </div>

        <div>
          <h2 className="text-cyan-300 font-bold text-sm md:text-base mb-2 uppercase tracking-wider">
            Architecture
          </h2>
          <p className="text-cyan-100/80 text-xs md:text-sm">
            {project.architecture}
          </p>
        </div>

        <div>
          <h2 className="text-cyan-300 font-bold text-sm md:text-base mb-2 uppercase tracking-wider">
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs text-cyan-300 hover:bg-cyan-500/20 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 pt-2">
          <div>
            <p className="text-cyan-400 font-bold text-xs md:text-sm">Status</p>
            <p className="text-cyan-100/80 text-xs md:text-sm">{project.status}</p>
          </div>
          <div>
            <p className="text-cyan-400 font-bold text-xs md:text-sm">Impact</p>
            <p className="text-cyan-100/80 text-xs md:text-sm">{project.impact}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-cyan-500/20">
          <Link
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 hover:underline text-xs md:text-sm transition-colors"
          >
            → View on GitHub
          </Link>
        </div>

        <div className="pt-2">
          <Link
            href="/projects"
            className="text-cyan-400 hover:text-cyan-300 hover:underline text-xs md:text-sm transition-colors"
          >
            ← Back to projects
          </Link>
        </div>
      </section>
    </ContentPanel>
  );
}
