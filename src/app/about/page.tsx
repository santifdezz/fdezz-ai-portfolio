import ContentPanel from "@/components/ContentPanel";

export const metadata = {
  title: "About | AI Terminal Portfolio",
};

export default function AboutPage() {
  return (
    <ContentPanel title="DEVELOPER PROFILE" showBackButton>
      <section className="space-y-4">
        <div>
          <h2 className="text-cyan-300 font-bold text-sm md:text-base mb-2 uppercase tracking-wider">
            Who I Am
          </h2>
          <p className="text-cyan-100/80">
            Full-stack engineer specialized in AI, data systems, and modern web
            technologies. Passionate about building scalable systems that solve
            real-world problems.
          </p>
        </div>

        <div>
          <h2 className="text-cyan-300 font-bold text-sm md:text-base mb-2 uppercase tracking-wider">
            What I Build
          </h2>
          <ul className="list-none space-y-1 text-cyan-100/80">
            <li>• ML/LLM applications and RAG systems</li>
            <li>• Data platforms and ETL pipelines</li>
            <li>• Interactive AI interfaces</li>
            <li>• Performance-optimized web applications</li>
          </ul>
        </div>

        <div>
          <h2 className="text-cyan-300 font-bold text-sm md:text-base mb-2 uppercase tracking-wider">
            What Interests Me
          </h2>
          <ul className="list-none space-y-1 text-cyan-100/80">
            <li>• System design & architecture</li>
            <li>• Distributed systems and scalability</li>
            <li>• LLM applications & prompt engineering</li>
            <li>• Developer experience and tooling</li>
          </ul>
        </div>

        <div>
          <h2 className="text-cyan-300 font-bold text-sm md:text-base mb-2 uppercase tracking-wider">
            Current Focus
          </h2>
          <p className="text-cyan-100/80">
            Building scalable AI applications with focus on real-world deployment,
            optimization, and user experience. Interested in exploring the frontier
            of LLM applications and system design.
          </p>
        </div>

        <div className="pt-4 border-t border-cyan-500/20">
          <p className="text-cyan-400 text-xs">
            Type <span className="font-bold">/projects</span> to see what I'm
            working on.
          </p>
        </div>
      </section>
    </ContentPanel>
  );
}
