import type { CommandKey, Locale } from "./terminalTypes";
import { en } from "./content/en";
import { es } from "./content/es";
import {
  getPortfolioContent,
  getProjectById,
  getProjectsByTechnology,
  getProjectsByStatus,
  getServiceById,
  type ProjectData,
} from "./portfolio-content";

function getContent(locale: Locale) {
  return locale === "es" ? es : en;
}

export function getBootMessages(locale: Locale): string[] {
  return getContent(locale).bootMessages;
}

export function getWelcomeMessages(locale: Locale): string[] {
  return getContent(locale).welcomeMessages;
}

export function getResponse(command: CommandKey, locale: Locale): string {
  const content = getContent(locale);
  const resp = content.responses[command as keyof typeof content.responses];
  return typeof resp === "string" ? resp : "";
}

export function getUnknownResponse(cmd: string, locale: Locale): string {
  return getContent(locale).unknown(cmd);
}

// Portfolio content formatting functions

function formatEducationTimeline(locale: Locale): string {
  const portfolio = getPortfolioContent(locale);
  const education = portfolio.about.education;
  const lines: string[] = [];

  const title = locale === "es" ? "📚 LÍNEA EDUCATIVA" : "📚 EDUCATION TIMELINE";
  lines.push(title);
  lines.push("─".repeat(title.length));
  lines.push("");

  education.forEach((entry, index) => {
    lines.push(`[${entry.year}] ${entry.title}`);
    lines.push(`  ${entry.institution}`);
    lines.push(`  ${entry.description}`);
    if (index < education.length - 1) lines.push("");
  });

  lines.push("");
  lines.push("─".repeat(title.length));
  const cvLabel = locale === "es" ? "Ver CV" : "View CV";
  lines.push(`📄 ${cvLabel}: ${portfolio.about.cvLink}`);

  return lines.join("\n");
}

function formatProjectsList(projects: ProjectData[], locale: Locale): string {
  const lines: string[] = [];
  const title =
    locale === "es" ? `📂 PORTAFOLIO (${projects.length} proyectos)` : `📂 PORTFOLIO (${projects.length} projects)`;

  lines.push(title);
  lines.push("─".repeat(title.length));
  lines.push("");

  projects.forEach((project, index) => {
    const status = project.status === "completed" ? "✅" : "🟡";
    const statusText = project.status === "completed" ? "Completed" : "In Progress";

    lines.push(`[${index + 1}] ${project.title}  ${status} ${statusText}`);
    lines.push(`    ${project.description}`);
    lines.push(`    Tech: ${project.technologies.slice(0, 3).join(" • ")}`);

    const links: string[] = [];
    if (project.links.github) links.push(`GitHub: ${project.links.github}`);
    if (project.links.demo) links.push(`Demo: ${project.links.demo}`);

    if (links.length > 0) {
      lines.push(`    Links: ${links.join(" | ")}`);
    }

    if (index < projects.length - 1) lines.push("");
  });

  return lines.join("\n");
}

function formatServicesList(locale: Locale): string {
  const portfolio = getPortfolioContent(locale);
  const lines: string[] = [];

  const title = locale === "es" ? "🛠️  SERVICIOS" : "🛠️  SERVICES";
  lines.push(title);
  lines.push("─".repeat(title.length));
  lines.push("");

  portfolio.services.forEach((service, index) => {
    lines.push(`[${index + 1}] ${service.title.toUpperCase()}`);
    lines.push(`    ${service.description}`);
    lines.push("");

    const featureLabel = locale === "es" ? "✓" : "✓";
    service.features.forEach((feature) => {
      lines.push(`    ${featureLabel} ${feature}`);
    });

    lines.push("");
    const techLabel = locale === "es" ? "Tech:" : "Tech:";
    lines.push(`    ${techLabel} ${service.technologies.join(" • ")}`);

    if (index < portfolio.services.length - 1) lines.push("");
  });

  return lines.join("\n");
}

function formatContactInfo(locale: Locale): string {
  const portfolio = getPortfolioContent(locale);
  const lines: string[] = [];

  const title = locale === "es" ? "📬 CONTACTO" : "📬 CONTACT";
  lines.push(title);
  lines.push("─".repeat(title.length));
  lines.push("");

  portfolio.contact.channels.forEach((channel) => {
    const icons: Record<string, string> = {
      email: "📧",
      github: "👨‍💻",
      linkedin: "💼",
    };
    lines.push(`${icons[channel.type]} ${channel.label}: ${channel.value}`);
    lines.push(`   ${channel.url}`);
  });

  lines.push("");
  lines.push("─".repeat(title.length));
  lines.push(`📍 ${portfolio.contact.location}`);
  lines.push(`✅ ${portfolio.contact.availability}`);
  const responseLabel = locale === "es" ? "⏱️  Tiempo de respuesta:" : "⏱️  Response time:";
  const responseText = locale === "es" ? "Menos de 24 horas" : "Usually within 24 hours";
  lines.push(`${responseLabel} ${responseText}`);

  return lines.join("\n");
}

function formatAboutNarrative(locale: Locale): string {
  const portfolio = getPortfolioContent(locale);
  const { bio } = portfolio.about;
  const lines: string[] = [];

  // Header
  const isES = locale === 'es';
  const header = isES ? '🎬 BIENVENIDO A MI HISTORIA' : '🎬 WELCOME TO MY STORY';
  lines.push(header);
  lines.push('─'.repeat(header.length));
  lines.push('');

  // Short description
  lines.push(bio.shortDescription);
  lines.push('');

  // Skills Matrix with visual bars
  const skillsLabel = isES ? '┌─ HERRAMIENTAS QUE DOMINO' : '┌─ TOOLS I MASTER';
  lines.push(skillsLabel);
  lines.push('├' + '─'.repeat(skillsLabel.length - 2));
  lines.push('│');

  Object.entries(bio.skills).forEach((entry, idx) => {
    const [category, items] = entry;
    lines.push(`│ ${category.toUpperCase()}`);

    // Split items into rows of 3
    for (let i = 0; i < items.length; i += 3) {
      const row = items.slice(i, i + 3);
      const rowStr = row.map(item => {
        const bars = '███';
        return `${item} ${bars}`;
      }).join('  ');
      lines.push(`│ ${rowStr}`);
    }

    if (idx < Object.entries(bio.skills).length - 1) {
      lines.push('│');
    }
  });

  lines.push('│');
  lines.push('└' + '─'.repeat(skillsLabel.length - 2));
  lines.push('');

  // Call to action
  const timelineLabel = isES ? '📖 Para ver mi recorrido completo: /timeline' : '📖 To see my full journey: /timeline';
  const servicesLabel = isES ? '🛠️  Para ver qué puedo hacer: /services' : '🛠️  To see what I can do: /services';
  const projectsLabel = isES ? '📂 Para ver mis proyectos: /projects' : '📂 To see my projects: /projects';

  lines.push(timelineLabel);
  lines.push(servicesLabel);
  lines.push(projectsLabel);

  return lines.join('\n');
}

export function getAboutResponse(locale: Locale): string {
  return formatAboutNarrative(locale);
}

export function getProjectsResponse(locale: Locale, filter?: string): string {
  const portfolio = getPortfolioContent(locale);
  let projects = portfolio.projects;

  if (filter) {
    const filterLower = filter.toLowerCase();

    // Filter by status
    if (filterLower === "completed" || filterLower === "done") {
      projects = getProjectsByStatus(locale, "completed");
    } else if (filterLower === "in-progress" || filterLower === "progress") {
      projects = getProjectsByStatus(locale, "in-progress");
    } else {
      // Filter by technology
      projects = getProjectsByTechnology(locale, filter);
    }
  }

  if (projects.length === 0) {
    return locale === "es"
      ? "No se encontraron proyectos con ese filtro."
      : "No projects found with that filter.";
  }

  return formatProjectsList(projects, locale);
}

export function getProjectDetailsResponse(locale: Locale, projectId: string): string {
  const project = getProjectById(locale, projectId);

  if (!project) {
    return locale === "es" ? "Proyecto no encontrado." : "Project not found.";
  }

  const lines: string[] = [];
  const status = project.status === "completed" ? "✅ Completed" : "🟡 In Progress";

  lines.push(`📂 ${project.title}`);
  lines.push("─".repeat(40));
  lines.push(`Status: ${status}`);
  lines.push("");
  lines.push(project.description);
  lines.push("");

  const featureLabel = locale === "es" ? "Características" : "Features";
  lines.push(`${featureLabel}:`);
  project.features.forEach((feature) => {
    lines.push(`  ✓ ${feature}`);
  });

  lines.push("");
  const techLabel = locale === "es" ? "Tecnologías" : "Technologies";
  lines.push(`${techLabel}:`);
  lines.push(`  ${project.technologies.join(" • ")}`);

  lines.push("");
  const linkLabel = locale === "es" ? "Enlaces" : "Links";
  lines.push(`${linkLabel}:`);
  if (project.links.github) {
    lines.push(`  GitHub: ${project.links.github}`);
  }
  if (project.links.demo) {
    lines.push(`  Demo: ${project.links.demo}`);
  }

  return lines.join("\n");
}

export function getServicesResponse(locale: Locale): string {
  return formatServicesList(locale);
}

export function getContactResponse(locale: Locale): string {
  return formatContactInfo(locale);
}

function formatTimelineIntro(locale: Locale): string {
  const isES = locale === 'es';
  const lines: string[] = [];

  const title = isES ? '⏳ LÍNEA DE TIEMPO & RECORRIDO PROFESIONAL' : '⏳ TIMELINE & CAREER JOURNEY';
  lines.push(title);
  lines.push('─'.repeat(title.length));
  lines.push('');

  const intro = isES
    ? 'Déjame contar mi historia...\nDe 2020 a 2025, he crecido en tecnología.\n'
    : 'Let me tell you my story...\nFrom 2020 to 2025, I\'ve evolved in tech.\n';
  lines.push(intro);

  // Progress visual
  const progressTitle = isES ? 'Tu Viaje en el Tiempo' : 'Your Time Journey';
  lines.push(progressTitle);
  lines.push('━'.repeat(progressTitle.length));
  lines.push('2020 ████░░░░░░░░░░░░░░░░░░ 2025');
  lines.push('');

  // Options
  const optionsLabel = isES ? 'Elige un período para explorar:' : 'Choose a period to explore:';
  lines.push(optionsLabel);
  lines.push('');

  const portfolio = getPortfolioContent(locale);
  portfolio.about.education.forEach((edu, idx) => {
    const number = idx + 1;
    const emoji = edu.icon || '📌';
    const title = `${number}️⃣  ${edu.year}`;
    lines.push(`${emoji} ${title}`);
    lines.push(`   ${edu.title}`);
  });

  lines.push('');
  const allLabel = isES ? 'O escribe "all" para ver todo de una vez' : 'Or type "all" to see everything at once';
  lines.push(allLabel);
  lines.push('');
  const example = isES
    ? 'Ejemplo: /timeline 1 (o /timeline all)'
    : 'Example: /timeline 1 (or /timeline all)';
  lines.push(example);

  return lines.join('\n');
}

function formatTimelinePeriod(locale: Locale, periodIndex: number): string {
  const portfolio = getPortfolioContent(locale);
  const education = portfolio.about.education;

  if (periodIndex < 0 || periodIndex >= education.length) {
    return locale === 'es' ? 'Período no encontrado.' : 'Period not found.';
  }

  const edu = education[periodIndex];
  const lines: string[] = [];
  const isES = locale === 'es';

  // Header with emoji and period number
  const headerEmoji = edu.icon || '📌';
  const periodNum = periodIndex + 1;
  const totalPeriods = education.length;
  const header = `${headerEmoji} CAPÍTULO ${periodNum}/${totalPeriods}: ${edu.year}`;

  lines.push(header);
  lines.push('━'.repeat(header.length));
  lines.push(`📍 ${edu.institution}`);
  lines.push(`📚 ${edu.title}`);
  lines.push('');

  // Narrative
  if (edu.narrative) {
    lines.push(`"${edu.narrative}"`);
    lines.push('');
  }

  // Learnings
  const learningsLabel = isES ? 'APRENDÍ:' : 'I LEARNED:';
  lines.push(learningsLabel);
  if (edu.learnings) {
    edu.learnings.forEach((learning) => {
      lines.push(`  ✓ ${learning}`);
    });
  } else {
    lines.push(`  ✓ ${edu.description}`);
  }

  lines.push('');

  // Progress bar
  const filled = '█';
  const empty = '░';
  const barLength = 20;
  const filledCount = Math.ceil((periodNum / totalPeriods) * barLength);
  const progressBar = filled.repeat(filledCount) + empty.repeat(barLength - filledCount);
  lines.push(`Progreso: [${progressBar}] ${periodNum}/${totalPeriods}`);

  lines.push('');

  // Next/Previous suggestions
  const hasNext = periodIndex < education.length - 1;
  const hasPrev = periodIndex > 0;

  if (hasNext || hasPrev) {
    const suggestions = isES ? '¿Continuar?' : 'Ready for next?';
    lines.push(suggestions);

    if (hasPrev) {
      const prevNum = periodIndex;
      const prevLabel = isES ? `${prevNum} (anterior)` : `${prevNum} (previous)`;
      lines.push(`  ← ${prevLabel}`);
    }

    if (hasNext) {
      const nextNum = periodIndex + 2;
      const nextLabel = isES ? `${nextNum} (siguiente)` : `${nextNum} (next)`;
      lines.push(`  → ${nextLabel}`);
    }

    lines.push(`  ${isES ? 'O escribe "all" para ver todo' : 'Or type "all" to see everything'}`);
  } else {
    const endMessage = isES
      ? '¡Eso es todo mi viaje (por ahora)!'
      : 'That\'s my whole journey (so far)!';
    lines.push(endMessage);
    lines.push(isES ? 'Tipo /about para volver.' : 'Type /about to return.');
  }

  return lines.join('\n');
}

function formatTimelineAll(locale: Locale): string {
  const portfolio = getPortfolioContent(locale);
  const education = portfolio.about.education;
  const lines: string[] = [];
  const isES = locale === 'es';

  const title = isES ? '📖 MI RECORRIDO COMPLETO' : '📖 MY FULL JOURNEY';
  lines.push(title);
  lines.push('═'.repeat(title.length));
  lines.push('');

  education.forEach((edu, idx) => {
    const periodNum = idx + 1;
    const emoji = edu.icon || '📌';
    const header = `${emoji} ${edu.year} • ${edu.title}`;

    lines.push(header);
    lines.push('─'.repeat(header.length));
    lines.push(`📍 ${edu.institution}`);
    lines.push('');

    if (edu.narrative) {
      lines.push(`  "${edu.narrative}"`);
    }

    lines.push('');

    if (edu.learnings) {
      const learningsLabel = isES ? 'Aprendí:' : 'Learned:';
      lines.push(`  ${learningsLabel}`);
      edu.learnings.forEach((learning) => {
        lines.push(`    ✓ ${learning}`);
      });
    }

    if (idx < education.length - 1) {
      lines.push('');
      lines.push('    ↓');
      lines.push('');
    }
  });

  lines.push('');
  lines.push('═'.repeat(title.length));
  const endMsg = isES
    ? '¡Este es mi viaje hasta ahora! Ahora estoy enfocado en IA & Big Data en Qaleon.'
    : 'This is my journey so far! Now I\'m focused on AI & Big Data at Qaleon.';
  lines.push(endMsg);

  return lines.join('\n');
}

export function getTimelineResponse(locale: Locale, arg?: string): string {
  if (!arg) {
    // Show intro
    return formatTimelineIntro(locale);
  }

  const argLower = arg.toLowerCase().trim();

  // Check if "all"
  if (argLower === 'all') {
    return formatTimelineAll(locale);
  }

  // Try to parse as number
  const periodNum = parseInt(argLower, 10);
  if (!isNaN(periodNum) && periodNum > 0 && periodNum <= 5) {
    const periodIndex = periodNum - 1;
    return formatTimelinePeriod(locale, periodIndex);
  }

  // If argument is invalid, show intro again
  return formatTimelineIntro(locale);
}

// ========================
// PANEL RESPONSE FUNCTIONS
// ========================

import type { CommandResponse } from "./terminalTypes";

export function getAboutPanelResponse(locale: Locale): CommandResponse {
  const portfolio = getPortfolioContent(locale);
  const { bio } = portfolio.about;

  return {
    type: "panel",
    panelType: "bio",
    panelData: {
      shortDescription: bio.shortDescription,
      fullDescription: bio.fullDescription,
      tagline: bio.tagline,
      cvLink: portfolio.about.cvLink,
      skills: Object.entries(bio.skills).map(([name, items]) => ({
        name,
        items,
      })),
      locale,
    },
  };
}

export function getProjectsPanelResponse(
  locale: Locale,
  filter?: string
): CommandResponse {
  const portfolio = getPortfolioContent(locale);
  let projects = portfolio.projects;

  if (filter) {
    const filterLower = filter.toLowerCase();
    if (filterLower === "completed" || filterLower === "done") {
      projects = getProjectsByStatus(locale, "completed");
    } else if (filterLower === "in-progress" || filterLower === "progress") {
      projects = getProjectsByStatus(locale, "in-progress");
    } else {
      projects = getProjectsByTechnology(locale, filter);
    }
  }

  if (projects.length === 0) {
    return {
      type: "error",
      text:
        locale === "es"
          ? "No se encontraron proyectos con ese filtro."
          : "No projects found with that filter.",
    };
  }

  return {
    type: "panel",
    panelType: "projects",
    panelData: {
      projects: projects.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        features: p.features || [],
        technologies: p.technologies,
        status: p.status,
        links: p.links,
      })),
      locale,
    },
  };
}

export function getServicesPanelResponse(locale: Locale): CommandResponse {
  const portfolio = getPortfolioContent(locale);
  const services = portfolio.services || [];

  return {
    type: "panel",
    panelType: "services",
    panelData: {
      services: services.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        icon: s.icon,
        features: s.features || [],
        technologies: s.technologies || [],
      })),
      locale,
    },
  };
}

export function getContactPanelResponse(locale: Locale): CommandResponse {
  const portfolio = getPortfolioContent(locale);
  const contactInfo = portfolio.contact;

  if (!contactInfo) {
    return {
      type: "error",
      text: locale === "es" ? "Información de contacto no disponible." : "Contact information not available.",
    };
  }

  // Transform channels to ContactLink format
  const contacts = (contactInfo.channels || []).map((channel: any) => ({
    label: channel.label,
    value: channel.value,
    type: channel.type,
  }));

  return {
    type: "panel",
    panelType: "contact",
    panelData: {
      subtitle: contactInfo.subtitle,
      description: contactInfo.description,
      location: contactInfo.location,
      availability: contactInfo.availability,
      contacts,
      locale,
    },
  };
}

export function getTimelinePanelResponse(locale: Locale): CommandResponse {
  const portfolio = getPortfolioContent(locale);
  const periods = portfolio.about.education;

  return {
    type: "panel",
    panelType: "timeline",
    panelData: {
      periods,
      locale,
    },
  };
}

export function getHelpPanelResponse(locale: Locale): CommandResponse {
  const content = getContent(locale);
  const isES = locale === "es";

  const commands = [
    {
      command: "/about",
      description: isES ? "Ver mi biografía y habilidades" : "View my biography and skills",
      example: "/about",
      category: isES ? "Información" : "Information",
    },
    {
      command: "/timeline",
      description: isES ? "Ver mi recorrido profesional" : "View my professional journey",
      example: "/timeline 1",
      category: isES ? "Información" : "Information",
    },
    {
      command: "/skills",
      description: isES ? "Ver mis habilidades por categoría" : "View my skills by category",
      example: "/skills",
      category: isES ? "Información" : "Information",
    },
    {
      command: "/projects",
      description: isES ? "Ver mis proyectos" : "View my projects",
      example: "/projects python",
      category: isES ? "Portafolio" : "Portfolio",
    },
    {
      command: "/project",
      description: isES ? "Ver detalles de un proyecto" : "View project details",
      example: isES ? "/project data-pipeline" : "/project data-pipeline",
      category: isES ? "Portafolio" : "Portfolio",
    },
    {
      command: "/services",
      description: isES ? "Ver mis servicios" : "View my services",
      example: "/services",
      category: isES ? "Portafolio" : "Portfolio",
    },
    {
      command: "/contact",
      description: isES ? "Información de contacto" : "Contact information",
      example: "/contact",
      category: isES ? "Contacto" : "Contact",
    },
    {
      command: "/whoami",
      description: isES ? "¿Quién soy? (Easter egg)" : "Who am I? (Easter egg)",
      example: "/whoami",
      category: isES ? "Diversión" : "Fun",
    },
    {
      command: "/github",
      description: isES ? "Visitar mi GitHub" : "Visit my GitHub",
      example: "/github",
      category: isES ? "Enlaces" : "Links",
    },
    {
      command: "/cv",
      description: isES ? "Descargar mi CV" : "Download my CV",
      example: "/cv",
      category: isES ? "Documentos" : "Documents",
    },
    {
      command: "/lang",
      description: isES ? "Cambiar idioma (en/es)" : "Change language (en/es)",
      example: "/lang es",
      category: isES ? "Sistema" : "System",
    },
    {
      command: "/clear",
      description: isES ? "Limpiar el terminal" : "Clear the terminal",
      example: "/clear",
      category: isES ? "Sistema" : "System",
    },
    {
      command: "/help",
      description: isES ? "Ver este mensaje de ayuda" : "View this help message",
      example: "/help",
      category: isES ? "Sistema" : "System",
    },
  ];

  return {
    type: "panel",
    panelType: "help",
    panelData: {
      commands,
      locale,
    },
  };
}
