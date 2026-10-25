import { describe, expect, it } from "vitest";
import { getPortfolioContent } from "@/lib/portfolio-content";
import { foundedProjects, thesisFacts } from "@/lib/editorial/ventures";
import { COPY, ENTITY_TAGS } from "./copy";

const numbersIn = (text: string) => text.match(/\d+(?:[.,]\d+)*/g) ?? [];

const thesisText = (locale: "en" | "es") =>
  COPY[locale].hero.thesis(thesisFacts(getPortfolioContent(locale))).map((s) => s.text).join("");

describe("hero thesis", () => {
  it.each(["en", "es"] as const)("%s: every number it quotes exists in the portfolio content", (locale) => {
    const thesis = thesisText(locale);
    const content = JSON.stringify(getPortfolioContent(locale));
    const quoted = numbersIn(thesis);

    expect(quoted.length).toBeGreaterThan(0);
    for (const n of quoted) {
      expect(content, `"${n}" is not in ${locale} content`).toMatch(new RegExp(`(^|\\D)${n.replace(/[.,]/g, "\\$&")}(\\D|$)`));
    }
  });

  it.each(["en", "es"] as const)("%s: leads with what he delivers at his current employer", (locale) => {
    const first = COPY[locale].hero.thesis(thesisFacts(getPortfolioContent(locale)))[0].text;
    expect(first).toMatch(/30[.,]000\+/);
  });

  it.each([
    ["en", "Multi-project solutions for clients across several sectors, including a multinational: 30,000+ documents and 20M+ data records processed. Founder of Makineo, a full-stack platform for the Spanish electronic music scene, with 900+ upcoming experiences."],
    ["es", "Soluciones multiproyecto para clientes de distintos sectores, incluida una multinacional: 30.000+ documentos y 20M+ de datos procesados. Fundador de Makineo, plataforma full-stack para la escena de música electrónica española, con 900+ experiencias próximas."],
  ] as const)("%s: reads employer first, then the venture, built from content", (locale, expected) => {
    expect(thesisText(locale)).toBe(expected);
  });

  it.each(["en", "es"] as const)("%s: still a sentence without a venture or an impact line", (locale) => {
    const venture = { name: "Acme", figure: "40 users", pitch: "tiny app" };
    for (const facts of [
      { venture: null, employer: "Qaleon Solutions", impact: "Shipped things" },
      { venture, employer: null, impact: null },
      { venture, employer: "Qaleon Solutions", impact: "Shipped things" },
    ]) {
      const text = COPY[locale].hero.thesis(facts).map((s) => s.text).join("");
      expect(text).toMatch(/\.$/);
      expect(text).not.toMatch(/undefined|null/);
      if (facts.venture) expect(text).toContain(`Acme, ${locale === "en" ? "a " : ""}tiny app`);
      if (facts.impact) expect(text.indexOf("Shipped things")).toBe(0);
    }
    expect(COPY[locale].hero.thesis({ venture: null, employer: null, impact: null })).toEqual([]);
  });
});

describe("result footer", () => {
  it("counts rows the way psql does", () => {
    expect(COPY.en.resultRows(1)).toBe("(1 row)");
    expect(COPY.en.resultRows(38)).toBe("(38 rows)");
    expect(COPY.es.resultRows(1)).toBe("(1 fila)");
    expect(COPY.es.resultRows(2)).toBe("(2 filas)");
  });
});

describe("hero headline", () => {
  it.each(["en", "es"] as const)("%s: names the employer and every project he founded, from content", (locale) => {
    const content = getPortfolioContent(locale);
    const founded = foundedProjects(content.projects).map((p) => p.title);
    const headline = COPY[locale].hero.rest(founded, thesisFacts(content).employer);
    for (const name of founded) expect(headline).toContain(name);
    expect(headline).toContain("Qaleon Solutions");
  });

  it("joins several founded projects as a list", () => {
    expect(COPY.en.hero.rest(["Makineo", "Acme"], null)).toContain("Makineo and Acme");
    expect(COPY.es.hero.rest(["Makineo", "Acme"], null)).toContain("Makineo y Acme");
  });

  it.each([
    ["en", "Data Scientist at Qaleon Solutions and founder of Makineo."],
    ["es", "Data Scientist en Qaleon Solutions y fundador de Makineo."],
  ] as const)("%s: states the role like a CV, employer first and no first-person verbs", (locale, expected) => {
    const sentence = COPY[locale].hero.rest(["Makineo"], "Qaleon Solutions");
    expect(sentence).toBe(expected);
    expect(sentence).not.toMatch(/\b(I build|I founded|Construyo|fundé)\b/);
    expect(COPY[locale].hero.lead).toMatch(/\.$/);
  });

  it.each(["en", "es"] as const)("%s: degrades to a plain role line without a venture or employer", (locale) => {
    expect(COPY[locale].hero.rest([], null)).toBe("Data Scientist.");
    expect(COPY[locale].hero.rest([], "Qaleon Solutions")).not.toMatch(/found|fund/i);
  });
});

describe("entity tags", () => {
  it.each(["en", "es"] as const)("%s: every skill group has an NER tag", (locale) => {
    for (const group of Object.keys(getPortfolioContent(locale).about.bio.skills)) {
      expect(ENTITY_TAGS[group], group).toMatch(/^[A-Z]+$/);
    }
  });
});
