import type { ThesisFacts } from "@/lib/editorial/ventures";
import type { Locale } from "@/lib/portfolio-content";

export const SECTION_IDS = ["point", "work", "experience", "stack", "contact"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export interface ThesisSegment {
  text: string;
  strong?: boolean;
}

const listFormat = (locale: Locale) => (items: string[]) =>
  new Intl.ListFormat(locale, { type: "conjunction" }).format(items);

/** NER-style tag per skill group, keyed by the group names both locales use. */
export const ENTITY_TAGS: Record<string, string> = {
  Languages: "LANG",
  Lenguajes: "LANG",
  Frameworks: "FRAMEWORK",
  Libraries: "LIB",
  Librerías: "LIB",
  "Tools & Databases": "TOOL",
  "Herramientas y BD": "TOOL",
  Specializations: "METHOD",
  Especializaciones: "METHOD",
};

export interface EditorialCopy {
  skip: string;
  nav: { label: string; language: string; items: Record<SectionId, string> };
  roles: { founder: string };
  hero: {
    facts: { status: string };
    lead: string;
    /** The role line after the name: where he works and what he founded, in the register of a CV. */
    rest: (founded: string[], employer: string | null) => string;
    thesis: (facts: ThesisFacts) => ThesisSegment[];
    badge: string;
    badgeLabel: string;
  };
  card: {
    label: string;
    rows: (columns: number) => string;
    stages: (n: number) => string;
    openCv: string;
  };
  point: { eyebrow: string; entities: (found: number, total: number) => string };
  work: {
    eyebrow: string;
    lead: (n: number) => string;
    rest: string;
    status: { completed: string; "in-progress": string };
    repo: string;
    progress: string;
    pad: (n: number, title: string) => string;
    visit: (host: string) => string;
    caseStudy: string;
  };
  experience: { eyebrow: string; lead: (n: number) => string; rest: string; current: string };
  stack: { eyebrow: string; lead: string; rest: string; meta: (items: number, groups: number) => string };
  contact: { eyebrow: string; open: string; write: string; closing: string; press: string; tap: string; closingEnd: string };
  /** psql's result footer, closing each section: "(2 rows)". */
  resultRows: (n: number) => string;
  clipboard: { copy: string; copied: string; failed: string; failedHint: string };
  cursor: { scroll: string; repo: string; contact: string };
  intro: { role: string };
}

export const COPY: Record<Locale, EditorialCopy> = {
  en: {
    skip: "Skip to content",
    nav: {
      label: "Sections",
      language: "Language",
      items: { point: "The point", work: "Work", experience: "Experience", stack: "Stack", contact: "Contact" },
    },
    roles: { founder: "Founder" },
    hero: {
      facts: { status: "Status" },
      lead: "Santiago Fernández.",
      rest: (founded, employer) => {
        const role = employer ? `Data Scientist at ${employer}` : "Data Scientist";
        return founded.length ? `${role} and founder of ${listFormat("en")(founded)}.` : `${role}.`;
      },
      thesis: ({ venture, impact }) => [
        ...(impact ? [{ text: `${impact}.` }] : []),
        ...(venture
          ? [
              { text: `${impact ? " " : ""}Founder of ` },
              { text: venture.name, strong: true },
              { text: `, a ${venture.pitch}, with ` },
              { text: venture.figure, strong: true },
              { text: "." },
            ]
          : []),
      ],
      badge: "Let's talk",
      badgeLabel: "Go to contact",
    },
    card: {
      label: "Profile",
      rows: (columns) => `1 row · ${columns} columns`,
      stages: (n) => `${n} stages`,
      openCv: "Open CV",
    },
    point: { eyebrow: "The point", entities: (found, total) => `${found}/${total} entities` },
    work: {
      eyebrow: "Work",
      lead: (n) => `${n} projects,`,
      rest: "from the platform I founded to an ETL pipeline.",
      status: { completed: "Completed", "in-progress": "In progress" },
      repo: "View repository",
      progress: "Project",
      pad: (n, title) => `Go to project ${n}: ${title}`,
      visit: (host) => `Visit ${host}`,
      caseStudy: "How it's built",
    },
    experience: {
      eyebrow: "Experience",
      lead: (n) => `${n} stages,`,
      rest: "from networks to AI in production.",
      current: "Current",
    },
    stack: {
      eyebrow: "Stack",
      lead: "Python at the core,",
      rest: "and what I build around it.",
      meta: (items, groups) => `${items} skills · ${groups} groups`,
    },
    contact: {
      eyebrow: "Contact",
      open: "Open",
      write: "Write",
      closing: "Want to go deeper?",
      press: "Press",
      tap: "Tap",
      closingEnd: "and query my database.",
    },
    resultRows: (n) => `(${n} ${n === 1 ? "row" : "rows"})`,
    clipboard: {
      copy: "Copy",
      copied: "Copied",
      failed: "Select it",
      failedHint: "Couldn't copy. Select the address to copy it.",
    },
    cursor: { scroll: "Scroll", repo: "GitHub ↗", contact: "Contact" },
    intro: { role: "Data Scientist" },
  },
  es: {
    skip: "Saltar al contenido",
    nav: {
      label: "Secciones",
      language: "Idioma",
      items: { point: "La idea", work: "Proyectos", experience: "Experiencia", stack: "Stack", contact: "Contacto" },
    },
    roles: { founder: "Fundador" },
    hero: {
      facts: { status: "Estado" },
      lead: "Santiago Fernández.",
      rest: (founded, employer) => {
        const role = employer ? `Data Scientist en ${employer}` : "Data Scientist";
        return founded.length ? `${role} y fundador de ${listFormat("es")(founded)}.` : `${role}.`;
      },
      thesis: ({ venture, impact }) => [
        ...(impact ? [{ text: `${impact}.` }] : []),
        ...(venture
          ? [
              { text: `${impact ? " " : ""}Fundador de ` },
              { text: venture.name, strong: true },
              { text: `, ${venture.pitch}, con ` },
              { text: venture.figure, strong: true },
              { text: "." },
            ]
          : []),
      ],
      badge: "Hablemos",
      badgeLabel: "Ir a contacto",
    },
    card: {
      label: "Perfil",
      rows: (columns) => `1 fila · ${columns} columnas`,
      stages: (n) => `${n} etapas`,
      openCv: "Ver CV",
    },
    point: { eyebrow: "La idea", entities: (found, total) => `${found}/${total} entidades` },
    work: {
      eyebrow: "Proyectos",
      lead: (n) => `${n} proyectos,`,
      rest: "de la plataforma que fundé a un pipeline ETL.",
      status: { completed: "Completado", "in-progress": "En curso" },
      repo: "Ver repositorio",
      progress: "Proyecto",
      pad: (n, title) => `Ir al proyecto ${n}: ${title}`,
      visit: (host) => `Visitar ${host}`,
      caseStudy: "Cómo está hecho",
    },
    experience: {
      eyebrow: "Experiencia",
      lead: (n) => `${n} etapas,`,
      rest: "de las redes a la IA en producción.",
      current: "Actual",
    },
    stack: {
      eyebrow: "Stack",
      lead: "Python en el centro,",
      rest: "y lo que construyo a su alrededor.",
      meta: (items, groups) => `${items} habilidades · ${groups} grupos`,
    },
    contact: {
      eyebrow: "Contacto",
      open: "Abrir",
      write: "Escribir",
      closing: "¿Quieres profundizar?",
      press: "Pulsa",
      tap: "Toca",
      closingEnd: "y consulta mi base de datos.",
    },
    resultRows: (n) => `(${n} ${n === 1 ? "fila" : "filas"})`,
    clipboard: {
      copy: "Copiar",
      copied: "Copiado",
      failed: "Selecciónalo",
      failedHint: "No se pudo copiar. Selecciona la dirección para copiarla.",
    },
    cursor: { scroll: "Desliza", repo: "GitHub ↗", contact: "Contacto" },
    intro: { role: "Data Scientist" },
  },
};
