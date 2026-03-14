export type Locale = "en" | "es";

export type MessageType = "system" | "ai" | "user" | "error";

export interface TerminalMessage {
  id: string;
  type: MessageType;
  text: string;
  timestamp?: number;
}

export type CommandKey =
  | "/help"
  | "/about"
  | "/projects"
  | "/project"
  | "/services"
  | "/skills"
  | "/contact"
  | "/github"
  | "/cv"
  | "/system"
  | "/architecture"
  | "/timeline"
  | "/lang"
  | "/coffee"
  | "/whoami"
  | "/train"
  | "/joke"
  | "/hack"
  | "/clear";

export interface CommandResponse {
  type: "text" | "nav" | "external" | "error" | "clear" | "lang";
  text: string;
  path?: string;
  url?: string;
  locale?: Locale;
}

export interface TerminalConfig {
  bootDelay: number;
  typingDelay: number;
  messageDelay: number;
  idleTimeout: number;
}

export const TERMINAL_CONFIG: TerminalConfig = {
  bootDelay: 300,
  typingDelay: 25,
  messageDelay: 500,
  idleTimeout: 45000,
};
