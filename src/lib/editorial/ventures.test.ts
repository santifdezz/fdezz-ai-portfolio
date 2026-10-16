import { describe, expect, it } from "vitest";
import { getPortfolioContent, type ProjectData } from "@/lib/portfolio-content";
import { foundedProjects, foundersFirst, organisationName, projectPitch, thesisFacts } from "./ventures";

const project = (id: string, role?: ProjectData["role"]): ProjectData => ({
  id,
  title: id,
  description: "",
  status: "completed",
  statusColor: "green",
  technologies: [],
  features: [],
  links: {},
  role,
});

describe("foundersFirst", () => {
  it("moves founded projects to the front and keeps the rest in content order", () => {
    const input = [project("a"), project("b"), project("venture", "founder"), project("c")];
    expect(foundersFirst(input).map((p) => p.id)).toEqual(["venture", "a", "b", "c"]);
  });

  it("keeps several founded projects in their own order", () => {
    const input = [project("a"), project("v1", "founder"), project("b"), project("v2", "founder")];
    expect(foundersFirst(input).map((p) => p.id)).toEqual(["v1", "v2", "a", "b"]);
  });

  it("returns a new array and leaves the input untouched", () => {
    const input = [project("a"), project("venture", "founder")];
    const output = foundersFirst(input);
    expect(output).not.toBe(input);
    expect(input.map((p) => p.id)).toEqual(["a", "venture"]);
  });

  it("handles no projects", () => {
    expect(foundersFirst([])).toEqual([]);
  });
});

describe("foundedProjects", () => {
  it.each(["en", "es"] as const)("%s: Makineo is the project Santiago founded", (locale) => {
    expect(foundedProjects(getPortfolioContent(locale).projects).map((p) => p.title)).toEqual(["Makineo"]);
  });

  it("returns nothing when no project is founded", () => {
    expect(foundedProjects([project("a"), project("b")])).toEqual([]);
  });
});

describe("organisationName", () => {
  it.each([
    ["Qaleon Solutions - AI Consulting, Madrid", "Qaleon Solutions"],
    ["Qaleon Solutions - Consultoría de IA, Madrid", "Qaleon Solutions"],
    ["Qindel Group, A Coruña", "Qindel Group"],
    ["Makineo", "Makineo"],
  ])("%s → %s", (institution, expected) => {
    expect(organisationName(institution)).toBe(expected);
  });
});

describe("projectPitch", () => {
  it.each([
    ["en", "full-stack platform for the Spanish electronic music scene"],
    ["es", "plataforma full-stack para la escena de música electrónica española"],
  ] as const)("%s: Makineo's first sentence, ready to sit mid-sentence", (locale, expected) => {
    const makineo = getPortfolioContent(locale).projects.find((p) => p.id === "makineo")!;
    expect(projectPitch(makineo)).toBe(expected);
  });

  it("is empty for an empty description", () => {
    expect(projectPitch({ description: "" })).toBe("");
  });
});

describe("thesisFacts", () => {
  it("reads the venture's figure and the latest employer from content", () => {
    expect(thesisFacts(getPortfolioContent("en"))).toEqual({
      venture: { name: "Makineo", figure: "1,000+ experiences listed", pitch: "full-stack platform for the Spanish electronic music scene" },
      employer: "Qaleon Solutions",
    });
  });

  it("has no venture when nothing founded quotes a number, and no employer when the latest stage is the venture", () => {
    const content = getPortfolioContent("en");
    const facts = thesisFacts({
      projects: [project("solo", "founder")],
      about: { ...content.about, education: [{ ...content.about.education[0], role: "founder" }] },
    });
    expect(facts).toEqual({ venture: null, employer: null });
  });
});
