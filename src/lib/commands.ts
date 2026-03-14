import type { CommandKey } from "./terminalTypes";

export const coreCommands: CommandKey[] = [
  "/help",
  "/about",
  "/projects",
  "/project",
  "/services",
  "/skills",
  "/contact",
  "/github",
  "/cv",
  "/system",
  "/architecture",
  "/timeline",
  "/lang",
  "/clear",
];

export const easterEggCommands: CommandKey[] = [
  "/coffee",
  "/whoami",
  "/train",
  "/joke",
  "/hack",
];

export const allCommands: CommandKey[] = [
  ...coreCommands,
  ...easterEggCommands,
];

export const commandDescriptions: Record<CommandKey, string> = {
  "/help":         "List all available commands",
  "/about":        "Developer profile & info",
  "/projects":     "Browse all projects",
  "/project":      "Project detail: /project <id>",
  "/services":     "Services & specializations",
  "/skills":       "Skill matrix overview",
  "/contact":      "Contact channels",
  "/github":       "Open GitHub profile",
  "/cv":           "Download CV / Resume",
  "/system":       "System status report",
  "/architecture": "Tech architecture overview",
  "/timeline":     "Career timeline",
  "/lang":         "Switch language: /lang en|es",
  "/clear":        "Clear terminal history",
  "/coffee":       "☕ Need a break?",
  "/whoami":       "Who are you really?",
  "/train":        "🚂 choo choo",
  "/joke":         "Tell me a joke",
  "/hack":         "Initiate hack sequence",
};

export const navigationCommands: CommandKey[] = [
  "/about",
  "/projects",
  "/skills",
  "/contact",
  "/timeline",
];

export function parseCommand(raw: string): CommandKey | "unknown" {
  const [cmd] = raw.trim().split(" ");
  return allCommands.includes(cmd as CommandKey)
    ? (cmd as CommandKey)
    : "unknown";
}

export function getCommandArgs(raw: string): string[] {
  const parts = raw.trim().split(" ");
  return parts.slice(1).filter(Boolean);
}

export function getCommandSuggestions(input: string): CommandKey[] {
  if (!input || !input.startsWith("/")) return [];
  return allCommands.filter(
    (cmd) => cmd.startsWith(input.toLowerCase()) && cmd !== input.toLowerCase()
  );
}

export function isEasterEgg(cmd: CommandKey | "unknown"): boolean {
  return easterEggCommands.includes(cmd as CommandKey);
}

export function requiresNavigation(cmd: CommandKey | "unknown"): boolean {
  return navigationCommands.includes(cmd as CommandKey);
}
