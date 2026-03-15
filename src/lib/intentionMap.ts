import type { Locale } from "./terminalTypes";

export type Intention =
  | "greeting"
  | "projects"
  | "about"
  | "skills"
  | "services"
  | "contact"
  | "help"
  | "timeline"
  | "unknown";

export interface IntentionResponse {
  intention: Intention;
  message: string;
  suggestedOptions: string[]; // IDs de opciones sugeridas
  filter?: string; // For project filtering by skill/tech
}

interface IntentionConfig {
  keywords: string[];
  response: string;
  suggestedOptions: string[];
}

const INTENTIONS_EN: Record<Intention, IntentionConfig> = {
  greeting: {
    keywords: [
      "hi",
      "hello",
      "hey",
      "hola",
      "buenos",
      "good morning",
      "good afternoon",
      "good evening",
      "greetings",
    ],
    response:
      "Hey! I'm Claudia — Santiago's AI assistant. Yes, an AI running inside an AI portfolio. Very meta, I know. I'd apologize but I find it hilarious. Ask me anything about him: projects, skills, career... or just say hi again, I don't judge.",
    suggestedOptions: ["about", "projects", "timeline", "skills", "services", "contact"],
  },

  about: {
    keywords: [
      "quien",
      "quién",
      "who",
      "who is",
      "who are",
      "background",
      "biography",
      "biografía",
      "bio",
      "profile",
      "perfil",
      "introduce",
      "tell me",
      "información",
      "información personal",
      "sobre",
      "sobre mi",
      "sobre mí",
      "cuéntame",
      "cuéntame sobre",
      "háblame",
      "háblame de",
    ],
    response:
      "Ah, the man of the hour. Santiago is a Data & AI Engineer who genuinely loves building things that process absurd amounts of data — we're talking millions of records a month. He's currently at Qaleon, still writes Python at 11pm by choice, and has a suspicious enthusiasm for ETL pipelines. Full profile loading...",
    suggestedOptions: ["about", "projects", "timeline", "skills", "services", "contact"],
  },

  projects: {
    keywords: [
      "project",
      "projects",
      "work",
      "portfolio",
      "what have",
      "built",
      "created",
      "portfolio",
      "proyectos",
      "trabajo",
      "qué ha hecho",
      "examples",
    ],
    response:
      "Oh, this is where it gets fun. RAG systems, computer vision, ETL pipelines, full-stack apps... He's built things that actually run in production, which — honestly — is rarer than it sounds. Brace yourself, the list is longer than expected.",
    suggestedOptions: ["about", "projects", "timeline", "skills", "services", "contact"],
  },

  skills: {
    keywords: [
      "skill",
      "skills",
      "technology",
      "technologies",
      "tech stack",
      "languages",
      "expertise",
      "knows",
      "habilidades",
      "lenguajes",
      "qué sabe",
    ],
    response:
      "Python? Obviously. SQL? Could do it in his sleep. TypeScript, React, FastAPI, LangChain, PyTorch, Airflow... At some point I started wondering if he just collects technologies as a hobby. The bars don't lie though — most of them are actually deep.",
    suggestedOptions: ["about", "projects", "timeline", "skills", "services", "contact"],
  },

  services: {
    keywords: [
      "service",
      "services",
      "help",
      "can you",
      "does he",
      "offer",
      "offering",
      "what can",
      "servicios",
      "qué ofrece",
      "puedo",
    ],
    response:
      "Need a data pipeline that doesn't fall apart on Monday morning? RAG system that actually retrieves relevant things? Full-stack app built by someone who reads the docs? He does all of that. And he won't pretend to know something he doesn't — which, surprisingly, is a rare trait.",
    suggestedOptions: ["about", "projects", "timeline", "skills", "services", "contact"],
  },

  timeline: {
    keywords: [
      "timeline",
      "experience",
      "experiencia",
      "career",
      "carrera",
      "journey",
      "recorrido",
      "history",
      "historia",
      "background",
      "when",
      "cuándo",
      "how long",
      "cuánto tiempo",
      "trayectoria",
      "línea de tiempo",
      "ruta profesional",
      "evolución",
    ],
    response:
      "2020: student with a laptop and too many tabs open. 2026: Data Engineer building production AI systems and still too many tabs open. Some things don't change. Each chapter brought new tech, new challenges, and — apparently — a growing affection for Python. Click through to see how the story unfolds.",
    suggestedOptions: ["about", "projects", "timeline", "skills", "services", "contact"],
  },

  contact: {
    keywords: [
      "contact",
      "email",
      "reach",
      "get in touch",
      "phone",
      "linkedin",
      "github",
      "connect",
      "contacto",
      "cómo contactar",
      "dónde",
      "teléfono",
    ],
    response:
      "He's reachable! GitHub, LinkedIn, email — even a quick message with a subject line like 'saw your portfolio, let's talk' works great. He replies within 24h, which in engineering terms is practically instant. Go on, don't be shy.",
    suggestedOptions: ["about", "projects", "timeline", "skills", "services", "contact"],
  },

  help: {
    keywords: [
      "help",
      "how does",
      "how do i",
      "tutorial",
      "guide",
      "instructions",
      "how to",
      "ayuda",
      "cómo",
      "instrucciones",
      "tutorial",
    ],
    response:
      "Ah, the brave soul who actually types 'help'. You can ask me anything in plain language — about Santiago's work, background, skills, how to reach him... I understand context surprisingly well for a bunch of if-statements. What are you curious about?",
    suggestedOptions: ["about", "projects", "timeline", "skills", "services", "contact"],
  },

  unknown: {
    keywords: [],
    response:
      "Hmm, not sure I caught that one. I'm good but not *omniscient* good. Try asking about Santiago's projects, skills, career, or how to contact him — those I can definitely answer. Or just say hi, I enjoy the interaction.",
    suggestedOptions: ["about", "projects", "timeline", "skills", "services", "contact"],
  },
};

const INTENTIONS_ES: Record<Intention, IntentionConfig> = {
  greeting: {
    keywords: [
      "hola",
      "buenos",
      "buenas",
      "hey",
      "saludos",
      "buenos días",
      "buenas tardes",
      "buenas noches",
    ],
    response:
      "¡Hola! Soy Claudia — la IA dentro del portfolio de IA de Santiago. Sí, es muy meta, ya lo sé. Me parece fascinante, la verdad. Puedes preguntarme lo que quieras sobre él: proyectos, habilidades, carrera... o simplemente charlar, que tampoco me aburro.",
    suggestedOptions: ["about", "projects", "timeline", "skills", "services", "contact"],
  },

  about: {
    keywords: [
      "sobre",
      "sobre mi",
      "sobre mí",
      "quién",
      "quién es",
      "quiénes",
      "background",
      "biografía",
      "bio",
      "perfil",
      "presenta",
      "cuéntame",
      "cuéntame sobre",
      "háblame",
      "háblame de",
      "información",
      "información personal",
    ],
    response:
      "El hombre del momento. Santiago es Ingeniero de Datos y le encanta construir cosas que procesan cantidades absurdas de información — hablamos de millones de registros al mes. Trabaja en Qaleon, sigue escribiendo Python a las 11 de la noche por voluntad propia, y tiene un entusiasmo sospechoso por las pipelines ETL. Cargando perfil completo...",
    suggestedOptions: ["about", "projects", "timeline", "skills", "services", "contact"],
  },

  projects: {
    keywords: [
      "proyecto",
      "proyectos",
      "trabajo",
      "portafolio",
      "qué ha hecho",
      "construido",
      "creado",
      "ejemplos",
      "qué hizo",
    ],
    response:
      "Aquí es donde se pone interesante. Sistemas RAG, visión por computadora, pipelines de datos, apps full-stack... Ha construido cosas que realmente corren en producción, lo cual — seamos honestos — es más raro de lo que parece. Prepárate, la lista es más larga de lo esperado.",
    suggestedOptions: ["about", "projects", "timeline", "skills", "services", "contact"],
  },

  skills: {
    keywords: [
      "habilidad",
      "habilidades",
      "tecnología",
      "tecnologías",
      "stack",
      "lenguajes",
      "experiencia",
      "sabe",
      "qué sabe",
      "domina",
    ],
    response:
      "¿Python? Obvio. ¿SQL? Lo haría dormido. TypeScript, React, FastAPI, LangChain, PyTorch, Airflow... En algún momento empecé a pensar que colecciona tecnologías como hobby. Aunque las barras no mienten — la mayoría tienen profundidad real, no solo 'lo he tocado una vez'.",
    suggestedOptions: ["about", "projects", "timeline", "skills", "services", "contact"],
  },

  services: {
    keywords: [
      "servicio",
      "servicios",
      "ayuda",
      "puede",
      "ofrece",
      "qué ofrece",
      "qué puede",
      "consultoría",
      "qué hace",
    ],
    response:
      "¿Necesitas una pipeline que no se rompa el lunes por la mañana? ¿Un sistema RAG que realmente recupere cosas relevantes? ¿Una app construida por alguien que sí lee la documentación? Todo eso. Y no pretenderá saber lo que no sabe — que, sorprendentemente, es un rasgo bastante escaso.",
    suggestedOptions: ["about", "projects", "timeline", "skills", "services", "contact"],
  },

  timeline: {
    keywords: [
      "timeline",
      "línea de tiempo",
      "experiencia",
      "carrera",
      "trayectoria",
      "recorrido",
      "historia",
      "cuándo",
      "cuánto tiempo",
      "evolución",
      "ruta profesional",
      "camino profesional",
    ],
    response:
      "2020: estudiante con un portátil y demasiadas pestañas abiertas. 2026: Ingeniero de Datos construyendo sistemas de IA en producción, y aún demasiadas pestañas abiertas. Algunas cosas no cambian. Cada capítulo trajo nueva tecnología, nuevos retos y — aparentemente — un cariño creciente por Python. Dale al play para ver cómo se desarrolla la historia.",
    suggestedOptions: ["about", "projects", "timeline", "skills", "services", "contact"],
  },

  contact: {
    keywords: [
      "contacto",
      "email",
      "alcanzar",
      "contactar",
      "teléfono",
      "linkedin",
      "github",
      "conectar",
      "cómo contactar",
      "dónde",
      "cómo llegar",
    ],
    response:
      "¡Es contactable! GitHub, LinkedIn, email — hasta un mensaje con el asunto 'vi tu portfolio, hablemos' funciona genial. Responde en menos de 24h, que en términos de ingeniería es prácticamente instantáneo. Venga, no te cortes.",
    suggestedOptions: ["about", "projects", "timeline", "skills", "services", "contact"],
  },

  help: {
    keywords: [
      "ayuda",
      "cómo",
      "cómo funciona",
      "cómo se usa",
      "tutorial",
      "guía",
      "instrucciones",
    ],
    response:
      "El valiente que escribe 'ayuda'. Puedes preguntarme cualquier cosa en lenguaje natural — sobre el trabajo de Santiago, su carrera, habilidades, cómo contactarle... Entiendo el contexto sorprendentemente bien para ser básicamente una cadena de condiciones. ¿Qué te genera curiosidad?",
    suggestedOptions: ["about", "projects", "timeline", "skills", "services", "contact"],
  },

  unknown: {
    keywords: [],
    response:
      "Mmm, eso no lo he pillado del todo. Soy buena, pero no *omnisciente* buena. Prueba a preguntarme por los proyectos, habilidades, trayectoria o cómo contactarle — eso sí lo domino. O dime hola, que la interacción también me gusta.",
    suggestedOptions: ["about", "projects", "timeline", "skills", "services", "contact"],
  },
};

// List of known technologies for filtering
const KNOWN_SKILLS = [
  "Python", "JavaScript", "TypeScript", "SQL", "GDScript",
  "Django", "FastAPI", "Flask", "React", "Next.js", "Express",
  "Pandas", "Scikit-learn", "Matplotlib", "Streamlit", "NumPy", "LangChain", "TensorFlow", "OpenCV",
  "PostgreSQL", "MongoDB", "Docker", "Git", "Jupyter", "Apache Airflow", "LLaMA", "FAISS", "Ollama", "Claude Code",
  "Machine Learning", "ETL", "Web Development", "QA", "Data Analysis", "RAG", "Vision", "Sentiment", "AI Agents"
];

export function parseIntention(input: string, locale: Locale): IntentionResponse {
  const intentions = locale === "es" ? INTENTIONS_ES : INTENTIONS_EN;
  const lowerInput = input.toLowerCase().trim();

  // Skip if input is too short
  if (lowerInput.length < 2) {
    const unknownIntention = intentions.unknown;
    return {
      intention: "unknown",
      message: unknownIntention.response,
      suggestedOptions: unknownIntention.suggestedOptions,
    };
  }

  // Find matching intention
  for (const [intention, config] of Object.entries(intentions)) {
    if (config.keywords.length === 0) continue; // Skip "unknown"

    for (const keyword of config.keywords) {
      if (lowerInput.includes(keyword.toLowerCase())) {
        const response: IntentionResponse = {
          intention: intention as Intention,
          message: config.response,
          suggestedOptions: config.suggestedOptions,
        };

        // Extract skill filter if it's a projects query
        if (intention === "projects") {
          const foundSkill = KNOWN_SKILLS.find(skill =>
            lowerInput.toLowerCase().includes(skill.toLowerCase())
          );
          if (foundSkill) {
            response.filter = foundSkill;
          }
        }

        return response;
      }
    }
  }

  // Default to unknown
  const unknownIntention = intentions.unknown;
  return {
    intention: "unknown",
    message: unknownIntention.response,
    suggestedOptions: unknownIntention.suggestedOptions,
  };
}
