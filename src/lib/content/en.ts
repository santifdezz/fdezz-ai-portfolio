export const en = {
  bootMessages: [
    "[ 0.001s] Initializing system...",
    "[ 0.123s] Loading developer profile... [OK]",
    "[ 0.456s] Indexing projects... [OK]",
    "[ 0.789s] Loading skill matrix... [OK]",
    "[ 1.234s] AI interface ready.",
  ],

  welcomeMessages: [
    "Welcome.",
    "You are now connected to fdezz's AI system.",
    "Type /help to explore.",
  ],

  responses: {
    "/help": `AVAILABLE COMMANDS
──────────────────────────────────────
  /about           Developer profile & info
  /projects [filter] Browse all projects
  /project <id>    Project detail
  /services        Services & specializations
  /skills          Skill matrix
  /contact         Contact channels
  /github          Open GitHub profile
  /cv              Download CV
  /system          System status
  /architecture    Tech architecture
  /timeline        Career timeline
  /lang en|es      Switch language
  /clear           Clear terminal

  Easter eggs: /coffee /whoami /train /joke /hack
──────────────────────────────────────`,

    "/about": "Loading developer profile...",
    "/projects": "Loading project index...",
    "/skills": "Loading skill matrix...",
    "/contact": "Loading contact channels...",
    "/timeline": "Loading career timeline...",
    "/github": "Opening GitHub profile...",
    "/cv": "Opening CV...",
    "/lang": "Language switched to English.",
    "/clear": "",

    "/system": `SYSTEM STATUS
──────────────────────────────────────
  NODE        fdezz@ai-terminal
  OS          Arch Linux (Docker)
  STACK       Next.js 16 + React 19
  RUNTIME     TypeScript 5
  STATUS      ● ONLINE
  UPTIME      99.9%
  LANGUAGE    EN
──────────────────────────────────────`,

    "/architecture": `ARCHITECTURE OVERVIEW
──────────────────────────────────────
  FRONTEND
  ├── Next.js 16 (App Router)
  ├── React 19
  ├── TypeScript 5
  ├── Tailwind CSS v4
  └── Framer Motion

  INFRASTRUCTURE
  ├── Docker (development)
  └── Next.js SSR/SSG

  PATTERN
  └── Terminal-first UI, no external APIs
──────────────────────────────────────`,

    "/coffee": `
  ( (
   ) )
 ._______.
 |  ☕   |  Brewing...
 |_______|

  "A developer is just a coffee
   conversion machine."`,

    "/whoami": `
  > Running identity check...
  > Cross-referencing neural patterns...
  >
  > Result: You are a curious human.
  > That's enough. Welcome.`,

    "/train": `
  ====Steam==== o O O o O O  o
  |  [fdezz]  |
 _|___________|_
  o-o       o-o   choo choo!`,

    "/joke": `
  Why do programmers prefer dark mode?

  Because light attracts bugs.`,

    "/hack": `
  Initiating hack sequence...
  ████████████████████ 100%

  Just kidding.
  (Please don't try this at home.)`,
  },

  unknown: (cmd: string) =>
    `Command not found: ${cmd}\nType /help for available commands.`,
};
