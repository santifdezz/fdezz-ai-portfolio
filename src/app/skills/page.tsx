import ContentPanel from "@/components/ContentPanel";

export const metadata = {
  title: "Skills | AI Terminal Portfolio",
};

const SkillBar = ({ name, level }: { name: string; level: number }) => {
  const filled = Math.floor(level / 10);
  const bar = "█".repeat(filled) + "░".repeat(10 - filled);
  return (
    <div className="flex justify-between items-center text-xs md:text-sm">
      <span className="w-32 md:w-40 text-cyan-100">{name}</span>
      <span className="font-mono text-cyan-400">{bar}</span>
      <span className="w-8 text-right text-cyan-300">{level}/10</span>
    </div>
  );
};

export default function SkillsPage() {
  return (
    <ContentPanel title="SKILL MATRIX" showBackButton>
      <section className="space-y-6">
        <div>
          <h2 className="text-cyan-300 font-bold text-sm md:text-base mb-3 uppercase tracking-wider border-b border-cyan-500/20 pb-2">
            Backend & Data
          </h2>
          <div className="space-y-2">
            <SkillBar name="Python" level={10} />
            <SkillBar name="Data Engineering" level={9} />
            <SkillBar name="Machine Learning" level={9} />
            <SkillBar name="LLM Systems" level={8} />
            <SkillBar name="System Design" level={8} />
          </div>
        </div>

        <div>
          <h2 className="text-cyan-300 font-bold text-sm md:text-base mb-3 uppercase tracking-wider border-b border-cyan-500/20 pb-2">
            Frontend & Web
          </h2>
          <div className="space-y-2">
            <SkillBar name="TypeScript/JavaScript" level={9} />
            <SkillBar name="React" level={9} />
            <SkillBar name="Next.js" level={9} />
            <SkillBar name="Tailwind CSS" level={10} />
            <SkillBar name="Framer Motion" level={8} />
          </div>
        </div>

        <div>
          <h2 className="text-cyan-300 font-bold text-sm md:text-base mb-3 uppercase tracking-wider border-b border-cyan-500/20 pb-2">
            DevOps & Infrastructure
          </h2>
          <div className="space-y-2">
            <SkillBar name="Docker" level={9} />
            <SkillBar name="PostgreSQL" level={8} />
            <SkillBar name="Cloud (AWS/GCP)" level={7} />
            <SkillBar name="CI/CD Pipelines" level={8} />
          </div>
        </div>

        <div className="pt-4 border-t border-cyan-500/20">
          <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
            <div>
              <p className="text-cyan-400 font-bold">Status</p>
              <p className="text-cyan-100/70">ACTIVE</p>
            </div>
            <div>
              <p className="text-cyan-400 font-bold">Last Updated</p>
              <p className="text-cyan-100/70">2024</p>
            </div>
          </div>
        </div>
      </section>
    </ContentPanel>
  );
}
