export type Locale = 'en' | 'es';

export interface EducationEntry {
  year: string;
  title: string;
  institution: string;
  description: string;
  narrative?: string;
  learnings?: string[];
  icon?: string;
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
    demo?: string;
  };
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
      shortDescription: 'Hello. I\'m Santi.\n\nMy journey started in 2020 learning networks and hardware. Today, in 2025, I work with Artificial Intelligence and Big Data.\n\nBetween those years, I\'ve learned to build, debug, and transform complex data into useful solutions.',
      fullDescription: 'My education combines solid foundations in technology with advanced specialization in data science and artificial intelligence, preparing me to face the challenges of modern data analysis.',
      tagline: 'Passionate about Data',
      skills: {
        'Languages': ['Python', 'JavaScript', 'TypeScript', 'SQL', 'GDScript'],
        'Frameworks': ['Django', 'FastAPI', 'Flask', 'React', 'Next.js', 'Express'],
        'Libraries': ['Pandas', 'Scikit-learn', 'Matplotlib', 'Streamlit', 'NumPy'],
        'Tools & Databases': ['PostgreSQL', 'MongoDB', 'Docker', 'Git', 'Jupyter', 'Apache Airflow'],
        'Specializations': ['Machine Learning', 'ETL Pipelines', 'Web Development', 'QA Automation', 'Data Analysis'],
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
        year: '2024',
        title: 'QA Tester (Internship)',
        institution: 'Merlín Software, A Coruña',
        description: 'Performed automated tests on APIs, mobile apps, and websites.',
        icon: '🧪',
        narrative: 'Quality through automation. I learned to think like a tester, breaking things systematically to prevent users from experiencing bugs.',
        learnings: ['Test Automation', 'E2E Testing', 'API Testing', 'Quality Assurance', 'Automated Testing Frameworks'],
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
    ],
    cvLink: 'https://drive.google.com/file/d/1dbUMNeNlhRK0g-ME5o7E6tKNkuXnGtzr/view?usp=sharing',
  },

  projects: [
    {
      id: 'ufc-data',
      title: 'UFC Fighters Data',
      description:
        'Comprehensive analysis of UFC fighters data. Extraction, cleaning, and building predictive model for fight outcomes.',
      status: 'in-progress',
      statusColor: 'yellow',
      technologies: ['Python', 'Machine Learning', 'Scikit-learn', 'Data Mining', 'API'],
      features: ['ML predictive model', 'Performance analysis', 'Advanced visualization', 'Automated data pipeline'],
      links: {
        github: 'https://github.com/santifdezz/ufc-predictor',
      },
    },
    {
      id: 'coruna-tenders',
      title: 'La Coruña Public Tenders',
      description:
        'Data extraction and analysis project for public tenders in La Coruña. Complete automation from data collection to visualization.',
      status: 'completed',
      statusColor: 'green',
      technologies: ['Python', 'Web Scraping', 'Pandas', 'PostgreSQL', 'Streamlit'],
      features: ['Automated data extraction', 'Complete statistical analysis', 'Tenders capture in real time', 'Data Cleaning'],
      links: {
        github: 'https://github.com/santifdezz/analisis-licitaciones-coruna',
      },
    },
    {
      id: 'forbes-qa',
      title: 'Forbes Website QA',
      description:
        'End-to-end test automation project using Cypress and Cucumber. It validates key features like menu navigation, article search, dynamic content interaction, and newsletter subscription, simulating real user behavior.',
      status: 'completed',
      statusColor: 'green',
      technologies: ['Gherkin', 'Cypress', 'JavaScript', 'Cucumber'],
      features: ['Menu navigation', 'Article search', 'Dynamic content interaction', 'Newsletter subscription'],
      links: {
        github: 'https://github.com/santifdezz/forbes-qa-cypress',
      },
    },
    {
      id: 'makineo',
      title: 'Makineo',
      description:
        'Complete web platform for electronic music events. Comprehensive management of events, artists, and users with modern interface.',
      status: 'completed',
      statusColor: 'green',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Cypress', 'Cucumber'],
      features: ['Event management', 'User system', 'Admin panel', 'RESTful API'],
      links: {
        github: 'https://github.com/santifdezz/makineo-app',
        demo: 'https://www.makineo.es/',
      },
    },
    {
      id: 'godot-game',
      title: 'Game in Godot',
      description:
        'Project developed during the DAM course, it is a basic 2D Top-Down Shooter game using Godot Engine, created in 1 month without prior knowledge of the tool.',
      status: 'completed',
      statusColor: 'green',
      technologies: ['Godot', 'GDScript', 'C#'],
      features: ['Top-down shooter', 'Godot Engine', 'Singleplayer'],
      links: {
        github: 'https://github.com/santifdezz/TopDown-Shooter-Game',
      },
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
    availability: 'Available for projects',
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
      shortDescription: 'Hola. Soy Santi.\n\nMi viaje comenzó en 2020 aprendiendo redes y hardware. Hoy, en 2025, trabajo con Inteligencia Artificial y Big Data.\n\nEntre esos años, he aprendido a construir, debuggear, y transformar datos complejos en soluciones útiles.',
      fullDescription: 'Mi formación combina fundamentos sólidos en tecnología con especialización avanzada en ciencia de datos e inteligencia artificial, preparándome para enfrentar los desafíos del análisis de datos moderno.',
      tagline: 'Apasionado por los datos',
      skills: {
        'Lenguajes': ['Python', 'JavaScript', 'TypeScript', 'SQL', 'GDScript'],
        'Frameworks': ['Django', 'FastAPI', 'Flask', 'React', 'Next.js', 'Express'],
        'Librerías': ['Pandas', 'Scikit-learn', 'Matplotlib', 'Streamlit', 'NumPy'],
        'Herramientas y BD': ['PostgreSQL', 'MongoDB', 'Docker', 'Git', 'Jupyter', 'Apache Airflow'],
        'Especializaciones': ['Machine Learning', 'Pipelines ETL', 'Desarrollo Web', 'Automatización QA', 'Análisis de Datos'],
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
        year: '2024',
        title: 'QA Tester (Prácticas)',
        institution: 'Merlín Software, A Coruña',
        description: 'Realicé pruebas automatizadas a APIs, apps móviles y webs.',
        icon: '🧪',
        narrative: 'Calidad a través de automatización. Aprendí a pensar como tester, rompiendo cosas sistemáticamente para prevenir bugs en usuarios.',
        learnings: ['Automatización de Tests', 'Testing E2E', 'Testing de APIs', 'Aseguramiento de Calidad', 'Frameworks de Testing'],
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
    ],
    cvLink: 'https://drive.google.com/file/d/1vHmpMBStHvWnwua-diwFh_GwdIv5NUF7/view?usp=sharing',
  },

  projects: [
    {
      id: 'ufc-data',
      title: 'UFC DATA Pipeline',
      description:
        'Análisis exhaustivo de datos de luchadores, peleas y eventos de UFC. Extracción, limpieza y construcción de modelo predictivo para resultados de combates (Modelo en progreso).',
      status: 'in-progress',
      statusColor: 'yellow',
      technologies: ['Python', 'BeautifulSoup', 'Machine Learning', 'Scikit-learn', 'Data Mining', 'API'],
      features: ['ETL', 'Scraping con BeautifulSoup', 'Visualización de datos', 'Limpieza de datos'],
      links: {
        github: 'https://github.com/santifdezz/ufc-etl',
      },
    },
    {
      id: 'coruna-tenders',
      title: 'Licitaciones de La Coruña',
      description:
        'Proyecto de extracción y análisis de datos para licitaciones públicas en La Coruña. Automatización completa del proceso desde la recolección hasta la visualización.',
      status: 'completed',
      statusColor: 'green',
      technologies: ['Python', 'Web Scraping', 'Pandas', 'PostgreSQL'],
      features: ['Extracción automática de datos', 'Análisis estadístico completo', 'Capturas de licitaciones en tiempo real', 'Limpieza de Datos'],
      links: {
        github: 'https://github.com/santifdezz/analisis-licitaciones-coruna',
      },
    },
    {
      id: 'forbes-qa',
      title: 'Forbes Website QA',
      description:
        'Proyecto de automatización de pruebas end-to-end usando Cypress y Cucumber. Valida funcionalidades clave como navegación por el menú, búsqueda de artículos, interacción con contenido dinámico y suscripción a newsletters, simulando el comportamiento real de un usuario.',
      status: 'completed',
      statusColor: 'green',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Cypress', 'Cucumber'],
      features: ['Gestión de eventos', 'Sistema de usuarios', 'Panel de administración', 'API RESTful'],
      links: {
        github: 'https://github.com/santifdezz/forbes-qa-cypress',
      },
    },
    {
      id: 'makineo',
      title: 'Makineo',
      description:
        'Plataforma web completa para eventos de música electrónica. Gestión integral de eventos, artistas y usuarios con interfaz moderna.',
      status: 'completed',
      statusColor: 'green',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT'],
      features: ['Gestión de eventos', 'Sistema de usuarios', 'Panel de administración', 'API RESTful'],
      links: {
        github: 'https://github.com/santifdezz/makineo-app',
        demo: 'https://www.makineo.es/',
      },
    },
    {
      id: 'godot-game',
      title: 'Juego en Godot',
      description:
        'Proyecto desarrollado en el ciclo de DAM, es un juego Top-Down Shooter 2d básico utiliza Godot Engine y fue hecho sin conocimientos de la herramienta en 1 mes.',
      status: 'completed',
      statusColor: 'green',
      technologies: ['Godot', 'GDScript', 'C#'],
      features: ['Top-down shooter', 'Godot Engine', 'Singleplayer'],
      links: {
        github: 'https://github.com/santifdezz/TopDown-Shooter-Game',
      },
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
    availability: 'Disponible para proyectos',
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
