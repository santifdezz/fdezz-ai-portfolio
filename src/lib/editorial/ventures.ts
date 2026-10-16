import type { PortfolioContent, ProjectData } from "@/lib/portfolio-content";
import { getProjectFigure } from "./figures";

const isFounded = (p: ProjectData) => p.role === "founder";

/** Projects Santiago founded, in content order. */
export function foundedProjects(projects: readonly ProjectData[]): ProjectData[] {
  return projects.filter(isFounded);
}

/** A new list with founded projects first; everything else keeps content order. */
export function foundersFirst(projects: readonly ProjectData[]): ProjectData[] {
  return [...projects].sort((a, b) => Number(isFounded(b)) - Number(isFounded(a)));
}

/** "Qaleon Solutions - AI Consulting, Madrid" → "Qaleon Solutions": the organisation, without what or where. */
export function organisationName(institution: string): string {
  return institution.split(/\s+[-–—]\s+|,\s/)[0].trim();
}

/**
 * What a project is, as a phrase that fits mid-sentence: the first sentence of
 * its description, without the full stop and with a lower-case first letter.
 */
export function projectPitch(project: Pick<ProjectData, "description">): string {
  const first = project.description.match(/^[^.!?]+/)?.[0].trim() ?? "";
  return first.charAt(0).toLocaleLowerCase() + first.slice(1);
}

/** What the hero thesis quotes, all read from portfolio content. */
export interface ThesisFacts {
  /** The venture he founded: its headline figure ("200+ events managed"), name and what it is. */
  venture: { name: string; figure: string; pitch: string } | null;
  /** Where his systems run today: the organisation of his latest stage. */
  employer: string | null;
}

export function thesisFacts(content: Pick<PortfolioContent, "projects" | "about">): ThesisFacts {
  const founded = foundedProjects(content.projects).find((p) => getProjectFigure(p));
  const figure = founded ? getProjectFigure(founded) : null;
  const latest = content.about.education[content.about.education.length - 1];
  return {
    venture:
      founded && figure
        ? { name: founded.title, figure: [figure.pre, figure.value, figure.label].filter(Boolean).join(" "), pitch: projectPitch(founded) }
        : null,
    employer: latest && latest.role !== "founder" ? organisationName(latest.institution) : null,
  };
}
