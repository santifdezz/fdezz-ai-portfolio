"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/terminalTypes";

interface CodeSnippet {
  label: string;
  labelES: string;
  code: string;
}

const SNIPPETS: CodeSnippet[] = [
  {
    label: "RAG Pipeline",
    labelES: "Pipeline RAG",
    code: `# RAG with LangChain + FAISS
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS

vectorstore = FAISS.from_documents(docs, embeddings)
retriever  = vectorstore.as_retriever(k=5)
chain      = RetrievalQA.from_chain(llm, retriever)

answer = chain.run("Licitaciones de salud 2026")`,
  },
  {
    label: "Airflow ETL",
    labelES: "ETL con Airflow",
    code: `# ETL Orchestration — Airflow DAG
from airflow.decorators import dag, task
from datetime import datetime

@dag(schedule="@daily", start_date=datetime(2026, 1, 1))
def ingest_pipeline():

    @task
    def extract() -> list[dict]:
        return fetch_source_records()   # +1M rows/month

    @task
    def transform(records):
        return clean_and_normalise(records)

    @task
    def load(clean_data):
        bulk_upsert_postgres(clean_data)

    load(transform(extract()))`,
  },
  {
    label: "Vision Model",
    labelES: "Modelo de Visión",
    code: `# Real-time object detection (production)
import cv2, torch
from torchvision.models.detection import fasterrcnn_resnet50_fpn

model = fasterrcnn_resnet50_fpn(pretrained=True).eval()

def detect(frame: np.ndarray) -> list[dict]:
    tensor = transforms.ToTensor()(frame).unsqueeze(0)
    with torch.no_grad():
        preds = model(tensor)[0]
    return [
        {"box": b.tolist(), "score": float(s)}
        for b, s in zip(preds["boxes"], preds["scores"])
        if s > 0.7
    ]`,
  },
  {
    label: "Sentiment NLP",
    labelES: "NLP Sentimientos",
    code: `# Sentiment analysis pipeline
from transformers import pipeline

clf = pipeline(
    "text-classification",
    model="nlptown/bert-base-multilingual-uncased-sentiment",
    device=0,           # GPU inference
)

texts = load_feedback_batch()   # 50k reviews
results = clf(texts, batch_size=32, truncation=True)

positives = sum(1 for r in results if int(r["label"][0]) >= 4)
print(f"Positive rate: {positives / len(results):.1%}")`,
  },
];

interface LiveCodePanelProps {
  locale?: Locale;
}

export function LiveCodePanel({ locale = "en" }: LiveCodePanelProps) {
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [cursor, setCursor] = useState(true);
  const charRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const snippet = SNIPPETS[snippetIdx];
  const fullCode = snippet.code.trimStart();

  // Typewriter effect
  useEffect(() => {
    charRef.current = 0;
    setDisplayed("");

    const type = () => {
      if (charRef.current < fullCode.length) {
        charRef.current++;
        setDisplayed(fullCode.slice(0, charRef.current));
        // Variable speed: faster on whitespace/newlines, slower on keywords
        const ch = fullCode[charRef.current - 1];
        const delay = ch === "\n" ? 60 : ch === " " ? 18 : 22;
        timerRef.current = setTimeout(type, delay);
      } else {
        // Pause then switch to next snippet
        timerRef.current = setTimeout(() => {
          setSnippetIdx((i) => (i + 1) % SNIPPETS.length);
        }, 3200);
      }
    };

    timerRef.current = setTimeout(type, 120);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [snippetIdx, fullCode]);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(id);
  }, []);

  const isES = locale === "es";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="my-2 rounded-lg border border-[hsl(var(--border)/0.6)] bg-[hsl(var(--card)/0.7)] overflow-hidden text-xs font-mono"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[hsl(var(--secondary)/0.8)] border-b border-[hsl(var(--border)/0.4)]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
          {isES ? snippet.labelES : snippet.label}
        </span>
        <div className="flex gap-1">
          {SNIPPETS.map((_, i) => (
            <button
              key={i}
              onClick={() => setSnippetIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === snippetIdx ? "bg-purple-400" : "bg-[hsl(var(--border))]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Code area */}
      <div className="px-4 py-3 min-h-[130px] overflow-x-auto">
        <pre className="text-[11px] leading-5">
          <CodeHighlight code={displayed} />
          <span className={`inline-block w-[7px] h-[13px] bg-purple-400 ml-px align-middle transition-opacity ${cursor ? "opacity-100" : "opacity-0"}`} />
        </pre>
      </div>
    </motion.div>
  );
}

// Minimal syntax highlighter — no external dep
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

interface Token { text: string; cls: string }

function tokenise(code: string): Token[] {
  const KEYWORDS = /\b(from|import|def|return|with|if|for|in|as|and|or|not|True|False|None|class|self|await|async)\b/g;
  const STRINGS  = /("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"\n]*"|'[^'\n]*')/g;
  const COMMENTS = /(#[^\n]*)/g;
  const NUMBERS  = /\b(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?%?)\b/g;
  const DECORATORS = /(@\w+)/g;
  const BUILTINS = /\b(print|len|list|dict|str|int|float|bool|zip|sum|range|enumerate|type|isinstance)\b/g;

  type Rule = { re: RegExp; cls: string };
  const rules: Rule[] = [
    { re: COMMENTS,   cls: "text-[hsl(var(--muted-foreground))] italic" },
    { re: STRINGS,    cls: "text-emerald-400" },
    { re: DECORATORS, cls: "text-yellow-400" },
    { re: KEYWORDS,   cls: "text-purple-400 font-semibold" },
    { re: BUILTINS,   cls: "text-blue-400" },
    { re: NUMBERS,    cls: "text-orange-400" },
  ];

  // Build a flat token list
  const result: Token[] = [];
  let remaining = code;
  let pos = 0;

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
      result.push({ text: remaining.slice(0, earliest.index), cls: "text-[hsl(var(--foreground))]" });
    }
    result.push({ text: remaining.slice(earliest.index, earliest.index + earliest.length), cls: earliest.cls });
    remaining = remaining.slice(earliest.index + earliest.length);
    pos += earliest.index + earliest.length;
  }

  return result;
}
