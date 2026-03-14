export type CommandKey =
  | "/help" | "/about" | "/projects" | "/skills" 
  | "/contact" | "/github" | "/cv" | "/system"
  | "/coffee" | "/whoami";

export const allCommands: CommandKey[] = [
  "/help", "/about", "/projects", "/skills",
  "/contact", "/github", "/cv", "/system",
  "/coffee", "/whoami"
];

export function parseCommand(raw: string): CommandKey | "unknown" {
  const [cmd] = raw.trim().split(" ");
  return allCommands.includes(cmd as CommandKey) ? 
    cmd as CommandKey : "unknown";
}
