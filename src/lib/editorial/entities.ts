export interface EntityGroup {
  tag: string;
  terms: readonly string[];
}

export type EntityToken = { kind: "text"; text: string } | { kind: "entity"; text: string; tag: string };

interface Word {
  lead: string;
  core: string;
  trail: string;
  norm: string;
}

const EDGES = /^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u;

function toWord(raw: string): Word {
  const [, lead = "", core = "", trail = ""] = raw.match(EDGES) ?? [];
  return { lead, core, trail, norm: core.toLowerCase() };
}

/**
 * A small named-entity pass over a paragraph: every skill it names becomes an
 * entity tagged with its group (whole phrases first, then capitalised parts of
 * longer skills such as "Airflow" from "Apache Airflow", never words that are
 * capitalised only because they start a sentence). Joining every token's text
 * gives back the paragraph exactly.
 */
export function annotateEntities(paragraph: string, groups: readonly EntityGroup[]): EntityToken[] {
  const trimmed = paragraph.trim();
  if (!trimmed) return [];

  const parts = trimmed.split(/(\s+)/);
  const words = parts.filter((_, i) => i % 2 === 0).map(toWord);
  const gaps = parts.filter((_, i) => i % 2 === 1);

  const patterns = groups
    .flatMap((g) => g.terms.map((term) => ({ tag: g.tag, words: term.split(/\s+/).map((w) => toWord(w).norm).filter(Boolean) })))
    .filter((p) => p.words.length > 0)
    .sort((a, b) => b.words.length - a.words.length);

  const partTags = new Map<string, string>();
  for (const p of patterns) {
    if (p.words.length < 2) continue;
    for (const w of p.words) if (w.length > 1 && !partTags.has(w)) partTags.set(w, p.tag);
  }

  const matchAt = (i: number): { length: number; tag: string } | null => {
    for (const p of patterns) {
      const length = p.words.length;
      if (i + length > words.length) continue;
      const fits = p.words.every((part, k) => {
        const w = words[i + k];
        const innerPunctuation = k < length - 1 && (w.trail !== "" || words[i + k + 1].lead !== "");
        return w.norm === part && !innerPunctuation;
      });
      if (fits) return { length, tag: p.tag };
    }
    const word = words[i];
    const startsSentence = i === 0 || /[.!?:]$/.test(words[i - 1].trail);
    const tag = partTags.get(word.norm);
    return !startsSentence && tag && /^\p{Lu}/u.test(word.core) ? { length: 1, tag } : null;
  };

  const tokens: EntityToken[] = [];
  let text = "";
  const flush = () => {
    if (text) tokens.push({ kind: "text", text });
    text = "";
  };

  for (let i = 0; i < words.length; ) {
    const match = matchAt(i);
    const length = match?.length ?? 1;
    const last = i + length - 1;
    if (match) {
      text += words[i].lead;
      flush();
      const entity = words.slice(i, last + 1).map((w, k) => w.core + (k < length - 1 ? gaps[i + k] : "")).join("");
      tokens.push({ kind: "entity", text: entity, tag: match.tag });
      text += words[last].trail;
    } else {
      const w = words[i];
      text += w.lead + w.core + w.trail;
    }
    text += gaps[last] ?? "";
    i = last + 1;
  }
  flush();
  return tokens;
}
