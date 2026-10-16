export type Locale = 'en' | 'es';

export interface EducationEntry {
  year: string;
  title: string;
  institution: string;
  description: string;
  narrative?: string;
  learnings?: string[];
  icon?: string;
  /** Set on a stage where Santiago founded something (not a job or a degree). */
  role?: 'founder';
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress';
  statusColor: 'green' | 'yellow';
  technologies: string[];
  features: string[];
  links: {
    github?: string;
    /** Live site or demo. */
    demo?: string;
  };
  /** Set when Santiago founded the project, not only built it. */
  role?: 'founder';
}

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  features: string[];
  technologies: string[];
}

export interface ProcessPhase {
  step: string;
  title: string;
  description: string;
}

export interface ContactMethod {
  type: 'email' | 'github' | 'linkedin';
  label: string;
  value: string;
  url: string;
}

export interface BioData {
  shortDescription: string;
  fullDescription: string;
  skills: Record<string, string[]>;
  tagline: string;
}

export interface PortfolioContent {
  about: {
    title: string;
    subtitle: string;
    description: string;
    bio: BioData;
    education: EducationEntry[];
    cvLink: string;
  };
  projects: ProjectData[];
  services: ServiceData[];
  contact: {
    title: string;
    subtitle: string;
    description: string;
    email: string;
    location: string;
    availability: string;
    channels: ContactMethod[];
  };
  process: ProcessPhase[];
}

const contentEN: PortfolioContent = {
  about: {
    title: 'About Me',
    subtitle: 'My educational and professional journey',
    description:
      'A combination of specialized technical training and passion for data that allows me to transform complex information into useful solutions.',
    bio: {
      shortDescription: 'Hello. I\'m Santi.\n\nMy journey started in 2020 learning networks and hardware. Today, in 2026, I work as a Data Engineer at Qaleon Solutions, building AI-powered data systems that process millions of records.\n\nI\'ve built RAG systems with LangChain, designed ETL pipelines orchestrated with Airflow, and trained vision models for real-time detection — all in production, collaborating directly with clients.\n\nThe common thread across all of it: data, automation, and making complex systems work reliably.',
      fullDescription: 'I combine solid engineering foundations with hands-on specialization in AI and data science. At Qaleon I work across the full data stack: from raw ingestion and ETL orchestration to ML model deployment and RAG systems — always in production, always with real business impact.',
      tagline: 'Passionate about Data',
      skills: {
        'Languages': ['Python', 'JavaScript', 'TypeScript', 'SQL', 'GDScript'],
        'Frameworks': ['Django', 'FastAPI', 'Flask', 'React', 'Next.js', 'Express'],
        'Libraries': ['Pandas', 'Scikit-learn', 'Matplotlib', 'Streamlit', 'NumPy', 'LangChain', 'TensorFlow', 'OpenCV'],
        'Tools & Databases': ['PostgreSQL', 'MongoDB', 'Docker', 'Git', 'Jupyter', 'Apache Airflow', 'LLaMA', 'FAISS', 'Ollama', 'Claude Code'],
        'Specializations': ['Machine Learning', 'ETL Pipelines', 'Web Development', 'QA Automation', 'Data Analysis', 'RAG Systems', 'Vision Models', 'Sentiment Analysis', 'AI Agents'],
      },
    },
    education: [
      {
        year: '2020-2021',
        title: 'Intermediate Degree in Microcomputer Systems and Networks',
        institution: 'IES Fernando Wirtz',
        description: 'Fundamentals in networks, hardware, and basic software.',
        icon: '📚',
        narrative: 'My first step in the tech world was understanding networks. The foundations I learned here became the base for everything that came after.',
        learnings: ['Networks & Connectivity', 'Hardware & Components', 'Operating Systems', 'Infrastructure Configuration'],
      },
      {
        year: '2021',
        title: 'Internal Technical Support and System Maintenance',
        institution: 'Qindel Group, A Coruña',
        description: 'Applied technical foundations in a professional environment.',
        icon: '🔧',
        narrative: 'This is where theory became practice. I applied everything I learned and discovered the reality of managing systems in production.',
        learnings: ['Technical Support', 'System Administration', 'Problem Solving', 'Real-world Troubleshooting'],
      },
      {
        year: '2022-2024',
        title: 'Higher Degree in Multiplatform Application Development',
        institution: 'CPR Afundación Abanca',
        description: 'Software development, programming, databases, and interface design.',
        icon: '🎨',
        narrative: 'This is where everything connected. I learned to build real systems: not just code, but architecture, databases, APIs, and interfaces.',
        learnings: ['Software Architecture', 'Database Design', 'API Development', 'User Interface Design', 'Full Stack Development'],
      },
      {
        year: '2024-2025',
        title: 'Specialization in Artificial Intelligence and Big Data',
        institution: 'IES Fernando Wirtz',
        description: 'Specialization in AI techniques, machine learning, and big data analysis.',
        icon: '🤖',
        narrative: 'Where my journey converges. Combining all my previous skills into AI and data science. Data pipelines, machine learning models, and modern analysis techniques.',
        learnings: ['Machine Learning', 'Deep Learning', 'Data Engineering', 'Big Data Processing', 'Predictive Modeling'],
      },
      {
        year: 'June 2025',
        title: 'Founder of Makineo',
        institution: 'Makineo',
        description: 'Founded a full-stack platform for the Spanish electronic music scene that manages 200+ events.',
        icon: '🎛️',
        role: 'founder',
        learnings: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'Cypress'],
      },
      {
        year: '2025-2026',
        title: 'Data Engineer at Qaleon Solutions',
        institution: 'Qaleon Solutions - AI Consulting, Madrid',
        description: 'Professional role managing two concurrent projects with focus on AI/ML implementation, RAG systems, and production optimization.',
        icon: '🚀',
        narrative: 'From education to production. Applying advanced AI concepts in real-world scenarios. Leading the charge on RAG implementation, optimizing database queries for performance, building vision models for detection and classification, orchestrating complex ETL workflows with Airflow, and collaborating closely with clients to deliver cutting-edge AI solutions.',
        learnings: ['RAG System Development', 'Database Query Optimization', 'Vision Models for Detection & Classification', 'Sentiment Analysis', 'ETL Orchestration with Airflow', 'Docker Containerization', 'Production Environments', 'Client Collaboration', 'AI Agent Development', 'Task Management at Scale'],
      },
    ],
    cvLink: 'https://drive.google.com/file/d/1dbUMNeNlhRK0g-ME5o7E6tKNkuXnGtzr/view?usp=sharing',
  },

  projects: [
    {
      id: 'ufc-data',
      title: 'UFC Data Pipeline',
      description:
        'ETL pipeline extracting 20+ years of UFC data — 3,600+ events, 1,500+ fighters. Cleans, normalises, and feeds an ML classification model targeting 65%+ accuracy for fight outcome prediction using 50+ fighter features.',
      status: 'in-progress',
      statusColor: 'yellow',
      technologies: ['Python', 'BeautifulSoup', 'Scikit-learn', 'Pandas', 'PostgreSQL'],
      features: ['Full ETL pipeline (extract → transform → load)', 'ML classification model (in progress)', '50+ engineered features per fighter', 'Automated data refresh'],
      links: {
        github: 'https://github.com/santifdezz/ufc-etl',
      },
    },
    {
      id: 'makineo',
      title: 'Makineo',
      description:
        'Full-stack platform for the Spanish electronic music scene. Manages 200+ events with custom admin panel, JWT authentication, RESTful API, and automated E2E test suite.',
      status: 'completed',
      statusColor: 'green',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'Cypress'],
      features: ['200+ events managed', 'Custom admin panel', 'JWT authentication system', 'RESTful API + E2E tests'],
      links: {
        github: 'https://github.com/santifdezz/makineo-app',
        demo: 'https://makineo.es',
      },
      role: 'founder',
    },
    {
      id: 'punch',
      title: 'Punch',
      description:
        'UI/UX reviewer: paste a URL, it opens the page in a real browser, measures SEO, accessibility, AI-search visibility and Web Vitals, and a vision model annotates the screenshot like a desk critic.',
      status: 'in-progress',
      statusColor: 'yellow',
      technologies: ['Python', 'FastAPI', 'Nuxt 3', 'PostgreSQL', 'Redis', 'Playwright', 'Claude'],
      features: ['4 audit families: SEO, accessibility, GEO, tech', 'AI vision notes on full-page screenshots', 'WCAG contrast fixes with exact values', 'SSRF-hardened URL fetching'],
      links: {
        github: 'https://github.com/santifdezz/punch',
      },
    },
    {
      id: 'cuadroscan',
      title: 'CuadroScan',
      description:
        "Photo of a home's electrical panel in, REBT compliance review out. The AI only reads the photo; a deterministic rules engine decides, and every check cites its article and page of the regulation.",
      status: 'in-progress',
      statusColor: 'yellow',
      technologies: ['Python', 'FastAPI', 'Claude', 'SVG'],
      features: ['Photo to confirmable inventory', 'Rules engine with BOE citations', 'Single-line diagram and printable report', '3 sample photos in a no-API-key demo mode'],
      links: {},
    },
  ],

  services: [
    {
      id: 'data-engineering',
      title: 'Data Engineering',
      description:
        'Design and construction of robust and scalable data pipelines. Extraction, transformation, and loading (ETL) of large volumes of information.',
      features: ['Automated data pipelines', 'Multi-source integration', 'Database optimization', 'Scalable architectures'],
      technologies: ['Apache Airflow', 'PostgreSQL', 'MongoDB', 'Docker'],
    },
    {
      id: 'python-dev',
      title: 'Python Development',
      description:
        'Development of robust and efficient Python applications. From automation scripts to complete web applications.',
      features: [
        'Web applications with Django/Flask',
        'Automation scripts',
        'RESTful APIs',
        'Microservices',
      ],
      technologies: ['Django', 'FastAPI', 'Flask', 'Pandas'],
    },
    {
      id: 'data-analysis',
      title: 'Data Analysis',
      description:
        'Deep data analysis to obtain valuable insights. Interactive visualizations and automated reports for decision making.',
      features: ['Advanced statistical analysis', 'Interactive dashboards', 'Predictive models', 'Automated reports'],
      technologies: ['Pandas', 'Matplotlib', 'Streamlit', 'Jupyter'],
    },
    {
      id: 'qa-testing',
      title: 'QA Testing',
      description: 'Software quality assurance through exhaustive testing. Test automation to ensure reliability.',
      features: ['Functional testing', 'Performance testing', 'Test automation', 'Bug documentation'],
      technologies: ['Selenium', 'PyTest', 'Postman', 'Jenkins'],
    },
  ],

  contact: {
    title: 'Contact Information',
    subtitle: "Let's talk about your next project",
    description: "I'm always open to new opportunities and interesting projects. Don't hesitate to contact me.",
    email: 'santifdezseo@gmail.com',
    location: 'Madrid, Spain',
    availability: 'Open to OSS · Employed @ Qaleon',
    channels: [
      {
        type: 'email',
        label: 'Email',
        value: 'santifdezseo@gmail.com',
        url: 'mailto:santifdezseo@gmail.com',
      },
      {
        type: 'github',
        label: 'GitHub',
        value: 'github.com/santifdezz',
        url: 'https://github.com/santifdezz',
      },
      {
        type: 'linkedin',
        label: 'LinkedIn',
        value: 'linkedin.com/in/santifdezseo',
        url: 'https://linkedin.com/in/santifdezseo',
      },
    ],
  },

  process: [
    {
      step: '01',
      title: 'Analysis',
      description: 'Deep understanding of requirements',
    },
    {
      step: '02',
      title: 'Planning',
      description: 'Strategy and technical architecture',
    },
    {
      step: '03',
      title: 'Development',
      description: 'Implementation with best practices',
    },
    {
      step: '04',
      title: 'Delivery',
      description: 'Testing and complete documentation',
    },
  ],
};

const contentES: PortfolioContent = {
  about: {
    title: 'Sobre Mí',
    subtitle: 'Mi trayectoria educativa y profesional',
    description:
      'Una combinación de formación técnica especializada y pasión por los datos que me permite transformar información compleja en soluciones útiles.',
    bio: {
      shortDescription: 'Hola. Soy Santi.\n\nMi viaje comenzó en 2020 aprendiendo redes y hardware. Hoy, en 2026, trabajo como Data Engineer en Qaleon Solutions, construyendo sistemas de datos con IA que procesan millones de registros.\n\nHe construido sistemas RAG con LangChain, diseñado pipelines ETL orquestados con Airflow, y entrenado modelos de visión para detección en tiempo real — todo en producción, colaborando directamente con clientes.\n\nEl hilo conductor de todo ello: datos, automatización, y hacer que sistemas complejos funcionen de forma fiable.',
      fullDescription: 'Combino fundamentos sólidos de ingeniería con especialización práctica en IA y ciencia de datos. En Qaleon trabajo en todo el stack de datos: desde ingesta y orquestación ETL hasta despliegue de modelos ML y sistemas RAG — siempre en producción, siempre con impacto real de negocio.',
      tagline: 'Apasionado por los datos',
      skills: {
        'Lenguajes': ['Python', 'JavaScript', 'TypeScript', 'SQL', 'GDScript'],
        'Frameworks': ['Django', 'FastAPI', 'Flask', 'React', 'Next.js', 'Express'],
        'Librerías': ['Pandas', 'Scikit-learn', 'Matplotlib', 'Streamlit', 'NumPy', 'LangChain', 'TensorFlow', 'OpenCV'],
        'Herramientas y BD': ['PostgreSQL', 'MongoDB', 'Docker', 'Git', 'Jupyter', 'Apache Airflow', 'LLaMA', 'FAISS', 'Ollama', 'Claude Code'],
        'Especializaciones': ['Machine Learning', 'Pipelines ETL', 'Desarrollo Web', 'Automatización QA', 'Análisis de Datos', 'Sistemas RAG', 'Modelos de Visión', 'Análisis de Sentimiento', 'Agentes IA'],
      },
    },
    education: [
      {
        year: '2020-2021',
        title: 'Ciclo Medio de Sistemas MicroInformáticos y Redes',
        institution: 'IES Fernando Wirtz',
        description: 'Fundamentos en redes, hardware y software básico.',
        icon: '📚',
        narrative: 'Mi primer paso en el mundo tech fue entender las redes. Los fundamentos que aprendí aquí son la base de todo lo que vino después.',
        learnings: ['Redes y Conectividad', 'Hardware y Componentes', 'Sistemas Operativos', 'Configuración de Infraestructura'],
      },
      {
        year: '2021',
        title: 'Soporte Técnico Interno y Mantenimiento de Sistemas',
        institution: 'Qindel Group, A Coruña',
        description: 'Aplicación práctica de fundamentos técnicos en ambiente profesional.',
        icon: '🔧',
        narrative: 'Aquí la teoría se convirtió en práctica. Apliqué todo lo aprendido y descubrí la realidad de manejar sistemas en producción.',
        learnings: ['Soporte Técnico', 'Administración de Sistemas', 'Resolución de Problemas', 'Troubleshooting Real'],
      },
      {
        year: '2022-2024',
        title: 'Ciclo Superior de Desarrollo de Aplicaciones Multiplataforma',
        institution: 'CPR Afundación Abanca',
        description: 'Desarrollo de software, programación, bases de datos y diseño de interfaces.',
        icon: '🎨',
        narrative: 'Aquí todo conectó. Aprendí a construir sistemas reales: no solo código, sino arquitectura, bases de datos, APIs e interfaces.',
        learnings: ['Arquitectura de Software', 'Diseño de Bases de Datos', 'Desarrollo de APIs', 'Diseño de UI', 'Desarrollo Full Stack'],
      },
      {
        year: '2024-2025',
        title: 'Ciclo de Especialización en Inteligencia Artificial y Big Data',
        institution: 'IES Fernando Wirtz',
        description: 'Especialización en técnicas de IA, machine learning y análisis de big data.',
        icon: '🤖',
        narrative: 'Donde mi viaje converge. Combinando todas mis habilidades previas en IA y ciencia de datos. Pipelines, modelos ML y análisis moderno.',
        learnings: ['Machine Learning', 'Deep Learning', 'Data Engineering', 'Big Data Processing', 'Modelado Predictivo'],
      },
      {
        year: 'Junio 2025',
        title: 'Fundador de Makineo',
        institution: 'Makineo',
        description: 'Fundé una plataforma full-stack para la escena de música electrónica española que gestiona 200+ eventos.',
        icon: '🎛️',
        role: 'founder',
        learnings: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'Cypress'],
      },
      {
        year: '2025-2026',
        title: 'Data Engineer en Qaleon Solutions',
        institution: 'Qaleon Solutions - Consultoría de IA, Madrid',
        description: 'Rol profesional liderando dos proyectos simultáneos con énfasis en implementación de IA/ML, sistemas RAG y optimización en producción.',
        icon: '🚀',
        narrative: 'De la educación a producción. Aplicando conceptos avanzados de IA en escenarios reales. Liderando la implementación de RAG, optimizando queries de bases de datos para performance, construyendo modelos de visión para detección y clasificación, orquestando flujos ETL complejos con Airflow, y colaborando estrechamente con clientes para entregar soluciones de IA de punta.',
        learnings: ['Desarrollo de Sistemas RAG', 'Optimización de Queries de BD', 'Modelos de Visión para Detección & Clasificación', 'Análisis de Sentimiento', 'Orquestación ETL con Airflow', 'Containerización Docker', 'Entornos de Producción', 'Colaboración con Cliente', 'Desarrollo de Agentes IA', 'Gestión de Tareas a Escala'],
      },
    ],
    cvLink: 'https://drive.google.com/file/d/1vHmpMBStHvWnwua-diwFh_GwdIv5NUF7/view?usp=sharing',
  },

  projects: [
    {
      id: 'ufc-data',
      title: 'UFC Data Pipeline',
      description:
        'Pipeline ETL que extrae más de 20 años de datos de UFC — 3.600+ eventos, 1.500+ luchadores. Limpia, normaliza y alimenta un modelo ML de clasificación con objetivo de >65% de precisión en predicción de resultados usando 50+ características por luchador.',
      status: 'in-progress',
      statusColor: 'yellow',
      technologies: ['Python', 'BeautifulSoup', 'Scikit-learn', 'Pandas', 'PostgreSQL'],
      features: ['Pipeline ETL completo (extracción → transformación → carga)', 'Modelo ML de clasificación (en progreso)', '50+ características por luchador', 'Actualización automática de datos'],
      links: {
        github: 'https://github.com/santifdezz/ufc-etl',
      },
    },
    {
      id: 'makineo',
      title: 'Makineo',
      description:
        'Plataforma full-stack para la escena de música electrónica española. Gestiona 200+ eventos con panel de administración propio, autenticación JWT, API RESTful y suite de tests E2E automatizados.',
      status: 'completed',
      statusColor: 'green',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'Cypress'],
      features: ['200+ eventos gestionados', 'Panel de administración propio', 'Sistema de autenticación JWT', 'API RESTful + tests E2E'],
      links: {
        github: 'https://github.com/santifdezz/makineo-app',
        demo: 'https://makineo.es',
      },
      role: 'founder',
    },
    {
      id: 'punch',
      title: 'Punch',
      description:
        'Revisor de UI/UX: pegas una URL, abre la página en un navegador real, mide SEO, accesibilidad, visibilidad en buscadores de IA y Web Vitals, y un modelo de visión anota la captura como un crítico de mesa.',
      status: 'in-progress',
      statusColor: 'yellow',
      technologies: ['Python', 'FastAPI', 'Nuxt 3', 'PostgreSQL', 'Redis', 'Playwright', 'Claude'],
      features: ['4 familias de auditoría: SEO, accesibilidad, GEO, técnica', 'Notas de visión IA sobre capturas completas', 'Arreglos de contraste WCAG con valores exactos', 'Descarga de URLs protegida contra SSRF'],
      links: {
        github: 'https://github.com/santifdezz/punch',
      },
    },
    {
      id: 'cuadroscan',
      title: 'CuadroScan',
      description:
        'Foto del cuadro eléctrico de una vivienda y revisión contra el REBT. La IA solo lee la foto; un motor de reglas determinista decide, y cada comprobación cita su artículo y página del reglamento.',
      status: 'in-progress',
      statusColor: 'yellow',
      technologies: ['Python', 'FastAPI', 'Claude', 'SVG'],
      features: ['De la foto a un inventario confirmable', 'Motor de reglas con citas del BOE', 'Esquema unifilar e informe imprimible', '3 fotos de ejemplo en modo demo sin clave de API'],
      links: {},
    },
  ],

  services: [
    {
      id: 'data-engineering',
      title: 'Data Engineering',
      description:
        'Diseño y construcción de pipelines de datos robustos y escalables. Extracción, transformación y carga (ETL) de grandes volúmenes de información.',
      features: ['Pipelines de datos automatizados', 'Integración de múltiples fuentes', 'Optimización de bases de datos', 'Arquitecturas escalables'],
      technologies: ['Apache NIFI', 'PostgreSQL', 'MongoDB', 'Docker'],
    },
    {
      id: 'python-dev',
      title: 'Python Development',
      description:
        'Desarrollo de aplicaciones Python robustas y eficientes. Desde scripts de automatización hasta aplicaciones web completas.',
      features: ['Aplicaciones web con Django/Flask', 'Scripts de automatización', 'APIs RESTful', 'Microservicios'],
      technologies: ['Django', 'FastAPI', 'Flask', 'Pandas'],
    },
    {
      id: 'data-analysis',
      title: 'Data Analysis',
      description:
        'Análisis profundo de datos para obtener insights valiosos. Visualizaciones interactivas y reportes automatizados para la toma de decisiones.',
      features: ['Análisis estadístico avanzado', 'Dashboards interactivos', 'Modelos predictivos', 'Reportes automatizados'],
      technologies: ['Pandas', 'Matplotlib', 'Streamlit', 'Jupyter'],
    },
    {
      id: 'qa-testing',
      title: 'QA Testing',
      description:
        'Aseguramiento de la calidad del software mediante pruebas exhaustivas. Automatización de pruebas para garantizar la fiabilidad.',
      features: ['Pruebas funcionales', 'Pruebas de rendimiento', 'Automatización de tests', 'Documentación de bugs'],
      technologies: ['Selenium', 'PyTest', 'Postman', 'Jenkins'],
    },
  ],

  contact: {
    title: 'Información de contacto',
    subtitle: 'Hablemos sobre tu próximo proyecto',
    description: 'Estoy siempre abierto a nuevas oportunidades y proyectos interesantes. No dudes en contactarme.',
    email: 'santifdezseo@gmail.com',
    location: 'Madrid, España',
    availability: 'Abierto a OSS · Contratado @ Qaleon',
    channels: [
      {
        type: 'email',
        label: 'Email',
        value: 'santifdezseo@gmail.com',
        url: 'mailto:santifdezseo@gmail.com',
      },
      {
        type: 'github',
        label: 'GitHub',
        value: 'github.com/santifdezz',
        url: 'https://github.com/santifdezz',
      },
      {
        type: 'linkedin',
        label: 'LinkedIn',
        value: 'linkedin.com/in/santifdezseo',
        url: 'https://linkedin.com/in/santifdezseo',
      },
    ],
  },

  process: [
    {
      step: '01',
      title: 'Análisis',
      description: 'Entendimiento profundo de requisitos',
    },
    {
      step: '02',
      title: 'Planificación',
      description: 'Estrategia y arquitectura técnica',
    },
    {
      step: '03',
      title: 'Desarrollo',
      description: 'Implementación con mejores prácticas',
    },
    {
      step: '04',
      title: 'Entrega',
      description: 'Testing y documentación completa',
    },
  ],
};

export function getPortfolioContent(locale: Locale): PortfolioContent {
  return locale === 'es' ? contentES : contentEN;
}

export function getProjectById(locale: Locale, projectId: string): ProjectData | undefined {
  return getPortfolioContent(locale).projects.find((p) => p.id === projectId);
}

export function getProjectsByTechnology(locale: Locale, tech: string): ProjectData[] {
  return getPortfolioContent(locale).projects.filter((p) =>
    p.technologies.some((t) => t.toLowerCase().includes(tech.toLowerCase())),
  );
}

export function getProjectsByStatus(locale: Locale, status: 'completed' | 'in-progress'): ProjectData[] {
  return getPortfolioContent(locale).projects.filter((p) => p.status === status);
}

export function getServiceById(locale: Locale, serviceId: string): ServiceData | undefined {
  return getPortfolioContent(locale).services.find((s) => s.id === serviceId);
}
