import { foundedProjects } from "@/lib/editorial/ventures";
import type { EducationEntry, PortfolioContent, ProjectData } from "@/lib/portfolio-content";
import { OG_IMAGE_URL, SITE_URL } from "@/lib/site";

export interface OrganizationNode {
  "@type": "Organization";
  "@id"?: string;
  name: string;
  url?: string;
  description?: string;
  founder?: { "@id": string };
}

export interface PersonNode {
  "@type": "Person";
  "@id": string;
  name: string;
  url: string;
  image: string;
  email?: string;
  sameAs: string[];
  jobTitle: string;
  workLocation: { "@type": "Place"; name: string };
  knowsLanguage: { "@type": "Language"; name: string }[];
  worksFor?: OrganizationNode;
  skills: string[];
}

export interface PersonSchema {
  "@context": "https://schema.org";
  "@graph": [PersonNode, ...OrganizationNode[]];
}

const PERSON_ID = `${SITE_URL}/#person`;

// As the page title presents him (src/app/layout.tsx); portfolio-content has no field for either.
const NAME = "Santiago Fernández";
const JOB_TITLE = "Data & AI Engineer";

const LANGUAGES = ["Spanish", "English"];

/** The about.bio.skills groups (English labels) published as his skills. */
const SKILL_GROUPS = ["Languages", "Specializations"];

/** Websites of organizations the content only names. */
const ORGANIZATION_URLS = new Map([["Qaleon Solutions", "https://qaleon.com"]]);

/** "Qaleon Solutions - AI Consulting, Madrid" → "Qaleon Solutions" */
const organizationName = (institution: string) => institution.split(/ - |,/)[0].trim();

/** The organization of the latest education entry: his current job. */
function currentEmployer(education: readonly EducationEntry[]): OrganizationNode | undefined {
  const latest = education.at(-1);
  if (!latest) return undefined;
  const name = organizationName(latest.institution);
  const url = ORGANIZATION_URLS.get(name);
  return url ? { "@type": "Organization", name, url } : { "@type": "Organization", name };
}

function venture(project: ProjectData): OrganizationNode {
  const site = project.links.demo;
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#org-${project.id}`,
    name: project.title,
    ...(site ? { url: site } : {}),
    description: project.description,
    founder: { "@id": PERSON_ID },
  };
}

/**
 * schema.org JSON-LD for the site's owner, built from the portfolio content:
 * the Person, plus an Organization for every project he founded that points
 * back to him through `founder`. Expects the English content, since skill
 * groups are picked by their English labels.
 */
export function buildPersonSchema(content: PortfolioContent): PersonSchema {
  const { about, contact, projects } = content;
  const email = contact.channels.find((c) => c.type === "email")?.value;
  const worksFor = currentEmployer(about.education);

  const person: PersonNode = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: NAME,
    url: SITE_URL,
    image: OG_IMAGE_URL,
    ...(email ? { email } : {}),
    sameAs: contact.channels.filter((c) => c.type !== "email").map((c) => c.url),
    jobTitle: JOB_TITLE,
    workLocation: { "@type": "Place", name: contact.location },
    knowsLanguage: LANGUAGES.map((name) => ({ "@type": "Language", name })),
    ...(worksFor ? { worksFor } : {}),
    skills: SKILL_GROUPS.flatMap((group) => about.bio.skills[group] ?? []),
  };

  return { "@context": "https://schema.org", "@graph": [person, ...foundedProjects(projects).map(venture)] };
}

/** The schema as JSON for an inline <script>: "<" is escaped so no string can close the tag. */
export function serializeJsonLd(schema: PersonSchema): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
