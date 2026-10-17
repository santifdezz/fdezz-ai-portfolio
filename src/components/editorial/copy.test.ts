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

  it.each(["en", "es"] as const)("%s: leads with a metric", (locale) => {
    expect(COPY[locale].hero.thesis(thesisFacts(getPortfolioContent(locale)))[0].text).toMatch(/^\d/);
  });

  it.each([
    ["en", "1,000+ experiences listed on Makineo, a full-stack platform for the Spanish electronic music scene. My RAG and ETL systems run in production at Qaleon Solutions."],
    ["es", "1.000+ experiencias publicadas en Makineo, plataforma full-stack para la escena de música electrónica española. Mis sistemas RAG y ETL, en producción en Qaleon Solutions."],
  ] as const)("%s: reads as one sentence built from content", (locale, expected) => {
    expect(thesisText(locale)).toBe(expected);
  });

  it.each(["en", "es"] as const)("%s: still a sentence without a venture or an employer", (locale) => {
    const venture = { name: "Acme", figure: "40 users", pitch: "tiny app" };
    for (const facts of [
      { venture: null, employer: "Qaleon Solutions" },
      { venture, employer: null },
      { venture: null, employer: null },
    ]) {
      const text = COPY[locale].hero.thesis(facts).map((s) => s.text).join("");
      expect(text).toMatch(/\.$/);
      expect(text).not.toMatch(/undefined|null/);
      if (facts.venture) expect(text).toContain(`40 users ${locale === "en" ? "on" : "en"} Acme, ${locale === "en" ? "a " : ""}tiny app`);
      if (facts.employer) expect(text).toContain("Qaleon Solutions");
    }
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
  it.each(["en", "es"] as const)("%s: names every project he founded, from content", (locale) => {
    const founded = foundedProjects(getPortfolioContent(locale).projects).map((p) => p.title);
    const headline = COPY[locale].hero.rest(founded);
    for (const name of founded) expect(headline).toContain(name);
  });

  it("joins several founded projects as a list", () => {
    expect(COPY.en.hero.rest(["Makineo", "Acme"])).toContain("Makineo and Acme");
    expect(COPY.es.hero.rest(["Makineo", "Acme"])).toContain("Makineo y Acme");
  });

  it.each([
    ["en", /^I build /, /\bbuilds\b/],
    ["es", /^Construyo /, /\b(construye|fundó)\b/],
  ] as const)("%s: speaks in the first person after the name", (locale, firstPerson, thirdPerson) => {
    for (const founded of [["Makineo"], []]) {
      const sentence = COPY[locale].hero.rest(founded);
      expect(sentence).toMatch(firstPerson);
      expect(sentence).not.toMatch(thirdPerson);
    }
    expect(COPY[locale].hero.lead).toMatch(/\.$/);
  });

  it.each(["en", "es"] as const)("%s: falls back to the engineering line when nothing is founded", (locale) => {
    expect(COPY[locale].hero.rest([])).not.toMatch(/found|fund/i);
  });
});

describe("entity tags", () => {
  it.each(["en", "es"] as const)("%s: every skill group has an NER tag", (locale) => {
    for (const group of Object.keys(getPortfolioContent(locale).about.bio.skills)) {
      expect(ENTITY_TAGS[group], group).toMatch(/^[A-Z]+$/);
    }
  });
});
