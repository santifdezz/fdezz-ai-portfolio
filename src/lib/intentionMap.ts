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
      "Hey! Welcome to my portfolio. I'm Claudia, Santiago's virtual assistant. I'm here to help you explore his professional profile. What would you like to know about him?",
    suggestedOptions: ["about", "projects", "timeline"],
  },

  about: {
    keywords: [
      "about",
      "quien",
      "who",
      "who is",
      "who are",
      "background",
      "biography",
      "bio",
      "profile",
      "introduce",
      "tell me",
      "información",
      "información personal",
    ],
    response:
      "Great! Let me tell you about Santiago. He's a Data Engineer passionate about AI and Big Data. He has experience building scalable systems and working with modern technologies. Check out his full bio and skills to get a complete picture!",
    suggestedOptions: ["about", "skills", "timeline"],
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
      "Santiago has worked on several interesting projects ranging from AI/ML to data engineering and full-stack development. Each project showcases different skills and technologies. I can show you all of them, or filter by technology if you prefer!",
    suggestedOptions: ["projects", "contact"],
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
      "Santiago is proficient in multiple programming languages and frameworks. He specializes in Python, TypeScript, React, and Big Data technologies. He also has expertise in cloud architecture and modern DevOps practices. Let me show you the complete skills matrix!",
    suggestedOptions: ["skills", "projects"],
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
      "Santiago offers services in data engineering, full-stack development, system architecture, and AI/ML consulting. He specializes in building scalable solutions and mentoring teams. Want to see more details about what he can help you with?",
    suggestedOptions: ["services", "contact"],
  },

  timeline: {
    keywords: [
      "timeline",
      "experience",
      "career",
      "journey",
      "history",
      "background",
      "when",
      "how long",
      "trayectoria",
      "línea de tiempo",
      "historia",
    ],
    response:
      "Santiago's career journey spans from 2020 to today. He's grown through different roles, learning new technologies and building increasingly complex systems. His timeline shows the evolution from student to professional engineer. Want to see the details?",
    suggestedOptions: ["timeline", "about"],
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
      "You can reach Santiago through multiple channels. He's active on GitHub, LinkedIn, and you can email him directly. All contact information is available in the contact section. Would you like to see it?",
    suggestedOptions: ["contact", "about"],
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
      "I'm here to help! You can explore Santiago's portfolio by selecting topics in the options below. Each section provides different information - about his background, projects, skills, and more. Just click what interests you most, and I'll guide you through it!",
    suggestedOptions: ["about", "projects", "timeline", "services", "contact"],
  },

  unknown: {
    keywords: [],
    response:
      "Interesting question! I'm designed to help you explore Santiago's professional portfolio. You can ask about his projects, skills, experience, or how to contact him. What would you like to know?",
    suggestedOptions: ["about", "projects", "services"],
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
      "¡Hola! Bienvenido al portafolio de Santiago. Soy Claudia, su asistente virtual. Estoy aquí para ayudarte a explorar su perfil profesional. ¿Qué te gustaría saber sobre él?",
    suggestedOptions: ["about", "projects", "timeline"],
  },

  about: {
    keywords: [
      "sobre",
      "quién",
      "quién es",
      "background",
      "biografía",
      "bio",
      "perfil",
      "presenta",
      "cuéntame",
      "información",
      "información personal",
    ],
    response:
      "¡Claro! Santiago es un Ingeniero de Datos apasionado por la IA y Big Data. Tiene experiencia construyendo sistemas escalables y trabajando con tecnologías modernas. Revisa su biografía completa y habilidades para obtener una imagen completa!",
    suggestedOptions: ["about", "skills", "timeline"],
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
      "Santiago ha trabajado en varios proyectos interesantes que van desde IA/ML hasta ingeniería de datos y desarrollo full-stack. Cada proyecto muestra diferentes habilidades y tecnologías. ¡Puedo mostrarte todos, o filtrar por tecnología si prefieres!",
    suggestedOptions: ["projects", "contact"],
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
      "Santiago es competente en múltiples lenguajes de programación y frameworks. Se especializa en Python, TypeScript, React y tecnologías de Big Data. También tiene experiencia en arquitectura en la nube y prácticas modernas de DevOps. ¡Déjame mostrarte la matriz completa de habilidades!",
    suggestedOptions: ["skills", "projects"],
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
      "Santiago ofrece servicios en ingeniería de datos, desarrollo full-stack, arquitectura de sistemas y consultoría en IA/ML. Se especializa en construir soluciones escalables y mentoría de equipos. ¿Te gustaría ver más detalles sobre cómo puede ayudarte?",
    suggestedOptions: ["services", "contact"],
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
    ],
    response:
      "La trayectoria profesional de Santiago abarca desde 2020 hasta hoy. Ha crecido a través de diferentes roles, aprendiendo nuevas tecnologías y construyendo sistemas cada vez más complejos. Su línea de tiempo muestra la evolución de estudiante a ingeniero profesional. ¿Te gustaría ver los detalles?",
    suggestedOptions: ["timeline", "about"],
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
      "Puedes contactar a Santiago a través de varios canales. Es activo en GitHub, LinkedIn, y puedes enviarle un email directamente. Toda la información de contacto está disponible en la sección de contacto. ¿Te gustaría verla?",
    suggestedOptions: ["contact", "about"],
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
      "¡Estoy aquí para ayudarte! Puedes explorar el portafolio de Santiago seleccionando temas en las opciones de abajo. Cada sección proporciona información diferente: sobre su trasfondo, proyectos, habilidades y más. ¡Solo haz clic en lo que te interesa y te guiaré a través de ello!",
    suggestedOptions: ["about", "projects", "timeline", "services", "contact"],
  },

  unknown: {
    keywords: [],
    response:
      "¡Pregunta interesante! Estoy diseñada para ayudarte a explorar el portafolio profesional de Santiago. Puedes preguntar sobre sus proyectos, habilidades, experiencia, o cómo contactarlo. ¿Qué te gustaría saber?",
    suggestedOptions: ["about", "projects", "services"],
  },
};

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
        return {
          intention: intention as Intention,
          message: config.response,
          suggestedOptions: config.suggestedOptions,
        };
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
