"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ProjectCodeDisplayProps {
  projectTitle: string;
  technologies: string[];
  description: string;
}

export function ProjectCodeDisplay({
  projectTitle,
  technologies,
  description,
}: ProjectCodeDisplayProps) {
  const [displayed, setDisplayed] = useState("");
  const [cursor, setCursor] = useState(true);
  const charRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate code snippet from project info
  const codeSnippet = `# ${projectTitle}
# ${description}

technologies = [
${technologies.map((t) => `  "${t}",`).join("\n")}
]

# Key Focus Areas
architecture = "Production-Grade"
status = "Optimized & Deployed"
`.trimStart();

  // Typewriter effect
  useEffect(() => {
    charRef.current = 0;
    setDisplayed("");

    const type = () => {
      if (charRef.current < codeSnippet.length) {
        charRef.current++;
        setDisplayed(codeSnippet.slice(0, charRef.current));
        const ch = codeSnippet[charRef.current - 1];
        const delay = ch === "\n" ? 60 : ch === " " ? 18 : 22;
        timerRef.current = setTimeout(type, delay);
      }
    };

    timerRef.current = setTimeout(type, 120);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [codeSnippet]);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-3 rounded-lg border border-[hsl(var(--border)/0.6)] bg-[hsl(var(--card)/0.7)] overflow-hidden text-xs font-mono"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[hsl(var(--secondary)/0.8)] border-b border-[hsl(var(--border)/0.4)]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
          {projectTitle}
        </span>
        <div className="w-12" />
      </div>

      {/* Code area */}
      <div className="px-4 py-3 min-h-[120px] overflow-x-auto">
        <pre className="text-[11px] leading-5">
          <CodeHighlight code={displayed} />
          <span
            className={`inline-block w-[7px] h-[13px] bg-purple-400 ml-px align-middle transition-opacity ${
              cursor ? "opacity-100" : "opacity-0"
            }`}
          />
        </pre>
      </div>
    </motion.div>
  );
}

// Minimal syntax highlighter
function CodeHighlight({ code }: { code: string }) {
  const tokens = tokenise(code);
  return (
    <>
      {tokens.map((tok, i) => (
        <span key={i} className={tok.cls}>
          {tok.text}
        </span>
      ))}
    </>
  );
}

interface Token {
  text: string;
  cls: string;
}

function tokenise(code: string): Token[] {
  const KEYWORDS =
    /\b(technologies|architecture|status|Key|Focus|Areas|Production-Grade|Optimized|Deployed)\b/g;
  const STRINGS = /(\"[^\"\\n]*\"|'[^'\\n]*')/g;
  const COMMENTS = /(#[^\n]*)/g;

  type Rule = { re: RegExp; cls: string };
  const rules: Rule[] = [
    { re: COMMENTS, cls: "text-[hsl(var(--muted-foreground))] italic" },
    { re: STRINGS, cls: "text-emerald-400" },
    { re: KEYWORDS, cls: "text-purple-400 font-semibold" },
  ];

  const result: Token[] = [];
  let remaining = code;

  while (remaining.length > 0) {
    let earliest: { index: number; length: number; cls: string } | null = null;

    for (const { re, cls } of rules) {
      re.lastIndex = 0;
      const m = re.exec(remaining);
      if (m && (earliest === null || m.index < earliest.index)) {
        earliest = { index: m.index, length: m[0].length, cls };
      }
    }

    if (!earliest) {
      result.push({ text: remaining, cls: "text-[hsl(var(--foreground))]" });
      break;
    }

    if (earliest.index > 0) {
      result.push({
        text: remaining.slice(0, earliest.index),
        cls: "text-[hsl(var(--foreground))]",
      });
    }
    result.push({
      text: remaining.slice(earliest.index, earliest.index + earliest.length),
      cls: earliest.cls,
    });
    remaining = remaining.slice(earliest.index + earliest.length);
  }

  return result;
}
