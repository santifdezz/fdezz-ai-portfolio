export const es = {
  bootMessages: [
    "[ 0.001s] Inicializando sistema...",
    "[ 0.123s] Cargando perfil del desarrollador... [OK]",
    "[ 0.456s] Indexando proyectos... [OK]",
    "[ 0.789s] Cargando matriz de habilidades... [OK]",
    "[ 1.234s] Interfaz AI lista.",
  ],

  welcomeMessages: [
    "Bienvenido a sfseoane.es",
    "Soy Claudia, tu asistente virtual. Estoy aquí para ayudarte a explorar el portafolio profesional de Santiago.",
    "No puedo compartir todo sobre él, pero sé lo suficiente para darte una buena idea de quién es profesionalmente.",
    "Escribe /help para explorar, o ve directamente a /about para comenzar.",
  ],

  responses: {
    "/help": `COMANDOS DISPONIBLES
──────────────────────────────────────
  /about              Perfil del desarrollador
  /projects [filtro]  Ver todos los proyectos
  /project <id>       Detalle de proyecto
  /services           Servicios & especializaciones
  /skills             Matriz de habilidades
  /contact            Canales de contacto
  /github             Abrir perfil GitHub
  /cv                 Descargar CV
  /system             Estado del sistema
  /architecture       Arquitectura técnica
  /timeline           Línea de tiempo
  /lang en|es         Cambiar idioma
  /clear              Limpiar terminal

  Easter eggs: /coffee /whoami /train /joke /hack
──────────────────────────────────────`,

    "/about": "Cargando perfil del desarrollador...",
    "/projects": "Cargando índice de proyectos...",
    "/skills": "Cargando matriz de habilidades...",
    "/contact": "Cargando canales de contacto...",
    "/timeline": "Cargando línea de tiempo...",
    "/github": "Abriendo perfil GitHub...",
    "/cv": "Abriendo CV...",
    "/lang": "Idioma cambiado al Español.",
    "/clear": "",

    "/system": `ESTADO DEL SISTEMA
──────────────────────────────────────
  NODO        fdezz@ai-terminal
  SO          Arch Linux (Docker)
  STACK       Next.js 16 + React 19
  RUNTIME     TypeScript 5
  ESTADO      ● EN LÍNEA
  UPTIME      99.9%
  IDIOMA      ES
──────────────────────────────────────`,

    "/architecture": `ARQUITECTURA
──────────────────────────────────────
  FRONTEND
  ├── Next.js 16 (App Router)
  ├── React 19
  ├── TypeScript 5
  ├── Tailwind CSS v4
  └── Framer Motion

  INFRAESTRUCTURA
  ├── Docker (desarrollo)
  └── Next.js SSR/SSG

  PATRÓN
  └── UI tipo terminal, sin APIs externas
──────────────────────────────────────`,

    "/coffee": `
  ( (
   ) )
 ._______.
 |  ☕   |  Preparando...
 |_______|

  "Un desarrollador es una máquina
   que convierte café en código."`,

    "/whoami": `
  > Ejecutando verificación de identidad...
  > Cruzando patrones neuronales...
  >
  > Resultado: Eres un humano curioso.
  > Suficiente. Bienvenido.`,

    "/train": `
  ====Vapor==== o O O o O O  o
  |  [fdezz]  |
 _|___________|_
  o-o       o-o   ¡chuu chuu!`,

    "/joke": `
  ¿Por qué los programadores prefieren el modo oscuro?

  Porque la luz atrae bugs.`,

    "/hack": `
  Iniciando secuencia de hackeo...
  ████████████████████ 100%

  Era broma.
  (Por favor no lo intentes en casa.)`,
  },

  unknown: (cmd: string) =>
    `Comando no encontrado: ${cmd}\nEscribe /help para ver los comandos disponibles.`,
};
