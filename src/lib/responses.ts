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
