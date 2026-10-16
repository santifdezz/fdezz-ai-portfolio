import { describe, expect, it } from "vitest";
import { getPortfolioContent } from "@/lib/portfolio-content";
import { annotateEntities, type EntityGroup } from "./entities";

const entities = (paragraph: string, groups: readonly EntityGroup[]) =>
  annotateEntities(paragraph, groups).flatMap((t) => (t.kind === "entity" ? [`${t.text}:${t.tag}`] : []));

const joined = (paragraph: string, groups: readonly EntityGroup[]) =>
  annotateEntities(paragraph, groups)
    .map((t) => t.text)
    .join("");

const TAGS = ["LANG", "FRAMEWORK", "LIB", "TOOL", "METHOD"];
const groupsFor = (locale: "en" | "es"): EntityGroup[] =>
  Object.values(getPortfolioContent(locale).about.bio.skills).map((terms, i) => ({ tag: TAGS[i], terms }));

describe("annotateEntities", () => {
  it("reproduces the paragraph exactly when its tokens are joined", () => {
    const text = "I've built RAG systems with LangChain, then shipped.";
    expect(joined(text, [{ tag: "METHOD", terms: ["RAG Systems"] }, { tag: "LIB", terms: ["LangChain"] }])).toBe(text);
  });

  it("tags a multi-word skill as one entity, case-insensitively", () => {
    expect(entities("trained vision models daily", [{ tag: "METHOD", terms: ["Vision Models"] }])).toEqual([
      "vision models:METHOD",
    ]);
  });

  it("keeps punctuation outside the entity", () => {
    const tokens = annotateEntities("with LangChain, then", [{ tag: "LIB", terms: ["LangChain"] }]);
    expect(tokens).toEqual([
      { kind: "text", text: "with " },
      { kind: "entity", text: "LangChain", tag: "LIB" },
      { kind: "text", text: ", then" },
    ]);
  });

  it("tags a capitalised part of a longer skill mid-sentence", () => {
    expect(entities("orchestrated with Airflow daily", [{ tag: "TOOL", terms: ["Apache Airflow"] }])).toEqual([
      "Airflow:TOOL",
    ]);
  });

  it("does not tag a word that is only capitalised because it starts a sentence", () => {
    expect(entities("Data moves. Data rests.", [{ tag: "METHOD", terms: ["Data Analysis"] }])).toEqual([]);
  });

  it("prefers the longest phrase over a single word inside it", () => {
    expect(
      entities("built RAG systems", [
        { tag: "LIB", terms: ["RAG"] },
        { tag: "METHOD", terms: ["RAG Systems"] },
      ]),
    ).toEqual(["RAG systems:METHOD"]);
  });

  it("does not join a phrase across punctuation", () => {
    expect(entities("RAG, systems", [{ tag: "METHOD", terms: ["RAG Systems"] }])).toEqual([]);
  });

  it("returns nothing for a blank paragraph", () => {
    expect(annotateEntities("   ", [{ tag: "LIB", terms: ["Python"] }])).toEqual([]);
  });

  it("finds the real entities in the real EN bio paragraph", () => {
    const paragraph = getPortfolioContent("en").about.bio.shortDescription.split("\n\n")[2];
    expect(entities(paragraph, groupsFor("en"))).toEqual([
      "RAG systems:METHOD",
      "LangChain:LIB",
      "ETL pipelines:METHOD",
      "Airflow:TOOL",
      "vision models:METHOD",
    ]);
    expect(joined(paragraph, groupsFor("en"))).toBe(paragraph);
  });

  it("finds the real entities in the real ES bio paragraph", () => {
    const paragraph = getPortfolioContent("es").about.bio.shortDescription.split("\n\n")[2];
    expect(entities(paragraph, groupsFor("es"))).toEqual([
      "sistemas RAG:METHOD",
      "LangChain:LIB",
      "pipelines ETL:METHOD",
      "Airflow:TOOL",
      "modelos de visión:METHOD",
    ]);
    expect(joined(paragraph, groupsFor("es"))).toBe(paragraph);
  });
});
