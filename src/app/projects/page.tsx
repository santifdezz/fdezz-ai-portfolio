import ContentPanel from "@/components/ContentPanel";
import Link from "next/link";

export const metadata = {
  title: "Projects | AI Terminal Portfolio",
};

const projects = [
  {
    id: "1",
    name: "RAG SYSTEM",
    description: "Retrieval augmented generation pipeline for semantic search",
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "DATA PLATFORM",
    description: "End-to-end data ingestion and transformation system",
    status: "ACTIVE",
  },
  {
    id: "3",
    name: "RECOMMENDER ENGINE",
    description: "ML-based ranking system for personalized content",
    status: "LIVE",
  },
  {
    id: "4",
    name: "AI PORTFOLIO",
    description: "This portfolio (Next.js + AI Terminal)",
    status: "BUILDING",
  },
];

export default function ProjectsPage() {
  return (
    <ContentPanel title="PROJECT INDEX" showBackButton>
      <div className="space-y-4">
        {projects.map((project, idx) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block group"
          >
            <div className="p-3 md:p-4 border border-cyan-500/20 rounded hover:border-cyan-500/60 hover:bg-cyan-500/5 transition-all duration-200">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-cyan-400 text-xs md:text-sm">
                      [{idx + 1}]
                    </span>
                    <h3 className="text-cyan-300 font-bold text-sm md:text-base group-hover:text-cyan-200 transition-colors">
                      {project.name}
                    </h3>
                  </div>
                  <p className="text-cyan-100/70 text-xs md:text-sm ml-6">
                    {project.description}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs px-2 py-1 rounded font-mono font-bold ${
                      project.status === "ACTIVE"
                        ? "text-emerald-400"
                        : project.status === "LIVE"
                          ? "text-blue-400"
                          : "text-amber-400"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        <div className="pt-4 border-t border-cyan-500/20 text-xs md:text-sm text-cyan-400">
          <p>Click on a project to see full details.</p>
        </div>
      </div>
    </ContentPanel>
  );
}
