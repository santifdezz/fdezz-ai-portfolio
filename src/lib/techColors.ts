const TECH_CATEGORIES: Record<string, string> = {
  // Data / AI / ML
  Python: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  Pandas: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  "Scikit-learn": "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  Matplotlib: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  Jupyter: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  NumPy: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  PyTorch: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  TensorFlow: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  OpenCV: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  Ollama: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  "Claude Code": "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  BeautifulSoup: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  LangChain: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  FAISS: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
  // Backend / API
  Django: "bg-blue-500/10 text-blue-300 border-blue-500/25",
  FastAPI: "bg-blue-500/10 text-blue-300 border-blue-500/25",
  Flask: "bg-blue-500/10 text-blue-300 border-blue-500/25",
  "Node.js": "bg-blue-500/10 text-blue-300 border-blue-500/25",
  Express: "bg-blue-500/10 text-blue-300 border-blue-500/25",
  JWT: "bg-blue-500/10 text-blue-300 border-blue-500/25",
  // Frontend
  React: "bg-violet-500/10 text-violet-300 border-violet-500/25",
  JavaScript: "bg-violet-500/10 text-violet-300 border-violet-500/25",
  TypeScript: "bg-violet-500/10 text-violet-300 border-violet-500/25",
  Streamlit: "bg-violet-500/10 text-violet-300 border-violet-500/25",
  // Databases
  PostgreSQL: "bg-amber-500/10 text-amber-300 border-amber-500/25",
  MongoDB: "bg-amber-500/10 text-amber-300 border-amber-500/25",
  Redis: "bg-amber-500/10 text-amber-300 border-amber-500/25",
  // DevOps / Infra
  Docker: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
  "Apache Airflow": "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
  "Apache NIFI": "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
  Jenkins: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
  Git: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
  // Testing / QA
  Cypress: "bg-rose-500/10 text-rose-300 border-rose-500/25",
  Selenium: "bg-rose-500/10 text-rose-300 border-rose-500/25",
  PyTest: "bg-rose-500/10 text-rose-300 border-rose-500/25",
  Postman: "bg-rose-500/10 text-rose-300 border-rose-500/25",
  Cucumber: "bg-rose-500/10 text-rose-300 border-rose-500/25",
  Gherkin: "bg-rose-500/10 text-rose-300 border-rose-500/25",
  // Other / Gaming
  Godot: "bg-purple-500/10 text-purple-300 border-purple-500/25",
  GDScript: "bg-purple-500/10 text-purple-300 border-purple-500/25",
  "C#": "bg-purple-500/10 text-purple-300 border-purple-500/25",
};

export function getTechColor(tech: string): string {
  return TECH_CATEGORIES[tech] ?? "bg-slate-500/10 text-slate-300 border-slate-500/25";
}
