import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  getPortfolioContent,
  type ContactMethod,
  type EducationEntry,
  type PortfolioContent,
  type ProjectData,
} from "@/lib/portfolio-content";
import { SITE_URL } from "@/lib/site";
import {
  buildPersonSchema,
  serializeJsonLd,
  type OrganizationNode,
  type PersonNode,
  type PersonSchema,
} from "./person-schema";

const content = getPortfolioContent("en");

const channel = (type: ContactMethod["type"]) => content.contact.channels.find((c) => c.type === type)!;

const withChannels = (channels: ContactMethod[]): PortfolioContent => ({
  ...content,
  contact: { ...content.contact, channels },
});
const withEducation = (education: EducationEntry[]): PortfolioContent => ({
  ...content,
  about: { ...content.about, education },
});
const withProjects = (projects: ProjectData[]): PortfolioContent => ({ ...content, projects });

const project = (id: string, role?: ProjectData["role"]): ProjectData => ({
  id,
  title: id,
  description: `${id} description`,
  status: "completed",
  statusColor: "green",
  technologies: [],
  features: [],
  links: {},
  role,
});

const job = (institution: string): EducationEntry => ({ year: "2026", title: "Role", institution, description: "" });

function nodes(schema: PersonSchema) {
  const graph = schema["@graph"];
  const people = graph.filter((n): n is PersonNode => n["@type"] === "Person");
  expect(people).toHaveLength(1);
  return {
    person: people[0],
    organizations: graph.filter((n): n is OrganizationNode => n["@type"] === "Organization"),
  };
}

describe("buildPersonSchema", () => {
  it("takes the email and profile links from the contact channels", () => {
    const { person } = nodes(buildPersonSchema(content));
    expect(person.email).toBe(channel("email").value);
    expect(person.sameAs).toEqual([channel("github").url, channel("linkedin").url]);
  });

  it("follows the channels when they change", () => {
    const { person } = nodes(
      buildPersonSchema(
        withChannels([
          { type: "email", label: "Email", value: "someone@example.com", url: "mailto:someone@example.com" },
          { type: "github", label: "GitHub", value: "github.com/someone", url: "https://github.com/someone" },
        ]),
      ),
    );
    expect(person.email).toBe("someone@example.com");
    expect(person.sameAs).toEqual(["https://github.com/someone"]);
  });

  it("leaves the email out when there is no email channel", () => {
    const { person } = nodes(buildPersonSchema(withChannels([])));
    expect(person).not.toHaveProperty("email");
    expect(person.sameAs).toEqual([]);
  });

  it("identifies him on the canonical site, with no fdezz.ai URL left", () => {
    const schema = buildPersonSchema(content);
    const { person } = nodes(schema);
    expect(person["@id"]).toBe(`${SITE_URL}/#person`);
    expect(person.url).toBe(SITE_URL);
    expect(person.image).toBe(`${SITE_URL}/og-image.png`);
    expect(JSON.stringify(schema)).not.toContain("fdezz.ai");
  });

  it("publishes Makineo as an Organization founded by the Person", () => {
    const { person, organizations } = nodes(buildPersonSchema(content));
    const makineo = content.projects.find((p) => p.id === "makineo")!;

    expect(organizations).toHaveLength(1);
    const [venture] = organizations;
    expect(venture).toMatchObject({ "@type": "Organization", "@id": `${SITE_URL}/#org-makineo`, name: "Makineo" });
    expect(venture.founder).toEqual({ "@id": person["@id"] });
    expect(venture["@id"]).not.toBe(person["@id"]);
    expect(venture.description).toBe(makineo.description);
    expect(venture.url).toBe(makineo.links.demo);
  });

  it("adds one Organization per founded project, and none when nothing is founded", () => {
    const live = { ...project("v1", "founder"), links: { demo: "https://v1.example" } };
    const founded = nodes(buildPersonSchema(withProjects([project("a"), live, project("v2", "founder")])));
    expect(founded.organizations.map((o) => o.name)).toEqual(["v1", "v2"]);
    expect(founded.organizations.map((o) => o.founder)).toEqual([
      { "@id": founded.person["@id"] },
      { "@id": founded.person["@id"] },
    ]);
    // A venture's live site is its url; one without a site gets none.
    expect(founded.organizations[0].url).toBe("https://v1.example");
    expect(founded.organizations[1]).not.toHaveProperty("url");

    expect(nodes(buildPersonSchema(withProjects([project("a")]))).organizations).toEqual([]);
  });

  it("lists only skills the content names: its Languages and Specializations", () => {
    const { person } = nodes(buildPersonSchema(content));
    const { Languages, Specializations } = content.about.bio.skills;
    expect(person.skills).toEqual([...Languages, ...Specializations]);
    expect(person.skills).not.toContain("Cloud Architecture");
    // hasSkill is not a schema.org property; validators reject it.
    expect(person).not.toHaveProperty("hasSkill");
  });

  it("works for the institution of the latest education entry", () => {
    expect(nodes(buildPersonSchema(content)).person.worksFor).toEqual({
      "@type": "Organization",
      name: "Qaleon Solutions",
      url: "https://qaleon.com",
    });
    expect(nodes(buildPersonSchema(withEducation([job("Old Place"), job("Acme Labs, Vigo")]))).person.worksFor).toEqual({
      "@type": "Organization",
      name: "Acme Labs",
    });
    expect(nodes(buildPersonSchema(withEducation([]))).person).not.toHaveProperty("worksFor");
  });

  it("names him and his job as the page title does", () => {
    // Read as text: importing layout.tsx would pull in next/font.
    const layout = readFileSync(new URL("../../app/layout.tsx", import.meta.url), "utf8");
    const [, pageTitle] = layout.match(/^\s*title: "([^"]+)"/m) ?? [];
    const { person } = nodes(buildPersonSchema(content));
    expect(pageTitle).toContain(person.name);
    expect(pageTitle).toContain(person.jobTitle);
    expect(person.workLocation).toEqual({ "@type": "Place", name: content.contact.location });
  });
});

describe("serializeJsonLd", () => {
  it("escapes < so no string can close the script tag, and parses back to the same schema", () => {
    const schema = buildPersonSchema(
      withProjects([{ ...project("v", "founder"), description: "</script><script>alert(1)</script>" }]),
    );
    const json = serializeJsonLd(schema);
    expect(json).not.toContain("<");
    expect(JSON.parse(json)).toEqual(schema);
  });
});
