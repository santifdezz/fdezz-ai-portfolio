import type { Locale } from "@/lib/portfolio-content";

export interface CaseStudyCopy {
  back: string;
  eyebrow: string;
  lead: string;
  rest: string;
  intro: string;
  diagramLabel: string;
  tiers: Array<{ label: string; items: string[] }>;
  sections: Array<{ title: string; body: string[] }>;
  stack: string[];
  stackTitle: string;
  visit: string;
  contact: string;
}

// Every claim here comes from the project's own docs (ARCHITECTURE.md, NATIVE_APPS_ARCHITECTURE.md,
// the e2e and load folders). Nothing about security internals: the repo is private on purpose.
export const MAKINEO_CASE: Record<Locale, CaseStudyCopy> = {
  es: {
    back: "Volver al portfolio",
    eyebrow: "Caso de estudio",
    lead: "Cómo está hecho",
    rest: "Makineo.",
    intro:
      "Makineo es una plataforma para la escena de música electrónica en España: más de 1.000 experiencias publicadas, con web, panel de administración y app Android. El repositorio es privado y no es de código abierto, así que esta página cuenta cómo está construida sin enseñar código.",
    diagramLabel: "Esquema de la arquitectura en tres capas: web y app Android, aplicación (Nuxt y FastAPI) y datos (PostgreSQL), con tareas en segundo plano",
    tiers: [
      { label: "Cliente", items: ["Web", "App Android"] },
      { label: "Aplicación", items: ["Nuxt · Vue · TypeScript", "FastAPI (Python)", "Tareas en segundo plano"] },
      { label: "Datos", items: ["PostgreSQL"] },
    ],
    sections: [
      {
        title: "Arquitectura",
        body: [
          "Una web Nuxt con renderizado en servidor habla con una API FastAPI sobre PostgreSQL. La base de datos resuelve el mapa y las distancias y también la búsqueda semántica del contenido.",
          "La app Android es la misma web empaquetada con Capacitor, no una reescritura: una sola base de código para web y móvil.",
        ],
      },
      {
        title: "Datos",
        body: [
          "Los eventos llegan de promotores y de una ingesta propia con scraping respetuoso (respeta el robots.txt de cada sitio). Tareas programadas mantienen el catálogo al día: detectan novedades, marcan los eventos ya pasados y generan texto sobre la escena.",
          "Sobre la misma base de datos hay una capa RAG para consultar el contenido en lenguaje natural, sin infraestructura adicional.",
        ],
      },
      {
        title: "Calidad y operación",
        body: [
          "El backend tiene una batería de pruebas con pytest (más de 700 ficheros de test), el navegador se prueba de extremo a extremo con Playwright y la carga con k6, con escenarios de base, de uso y de estrés.",
          "Desarrollo y producción son entornos separados, con contenedores Docker y monitorización de la aplicación.",
        ],
      },
      {
        title: "Estado, con honestidad",
        body: [
          "Android está publicado en Google Play. iOS compila en integración continua, pero todavía no está publicado. Si hace falta ver código, lo enseño en pantalla o doy acceso de lectura durante una entrevista.",
        ],
      },
    ],
    stackTitle: "Stack",
    stack: ["Nuxt", "Vue", "TypeScript", "FastAPI", "PostgreSQL", "Capacitor", "Docker", "Playwright", "pytest", "k6"],
    visit: "Visitar makineo.es",
    contact: "Hablemos",
  },
  en: {
    back: "Back to the portfolio",
    eyebrow: "Case study",
    lead: "How",
    rest: "Makineo is built.",
    intro:
      "Makineo is a platform for Spain's electronic music scene: over 1,000 published experiences, with a website, an admin panel and an Android app. The repository is private and not open source, so this page explains how it is built without showing code.",
    diagramLabel: "Architecture sketch in three layers: web and Android app, application (Nuxt and FastAPI) and data (PostgreSQL), with background jobs",
    tiers: [
      { label: "Client", items: ["Web", "Android app"] },
      { label: "Application", items: ["Nuxt · Vue · TypeScript", "FastAPI (Python)", "Background jobs"] },
      { label: "Data", items: ["PostgreSQL"] },
    ],
    sections: [
      {
        title: "Architecture",
        body: [
          "A server-rendered Nuxt site talks to a FastAPI backend on PostgreSQL. The database handles the map and distances as well as semantic search over the content.",
          "The Android app is the same website packaged with Capacitor, not a rewrite: one codebase for web and mobile.",
        ],
      },
      {
        title: "Data",
        body: [
          "Events come from promoters and from an in-house ingestion with polite scraping (each site's robots.txt is respected). Scheduled jobs keep the catalogue current: they spot new events, mark past ones and generate text about the scene.",
          "On the same database there is a RAG layer to query the content in natural language, with no extra infrastructure.",
        ],
      },
      {
        title: "Quality and operations",
        body: [
          "The backend has a large pytest suite (700+ test files), the browser is tested end to end with Playwright and load with k6, with baseline, usage and stress scenarios.",
          "Development and production are separate environments, on Docker containers, with application monitoring.",
        ],
      },
      {
        title: "Status, honestly",
        body: [
          "Android is live on Google Play. iOS builds in continuous integration but is not published yet. If you need to see code, I will walk through it on screen or give read access during an interview.",
        ],
      },
    ],
    stackTitle: "Stack",
    stack: ["Nuxt", "Vue", "TypeScript", "FastAPI", "PostgreSQL", "Capacitor", "Docker", "Playwright", "pytest", "k6"],
    visit: "Visit makineo.es",
    contact: "Let's talk",
  },
};
