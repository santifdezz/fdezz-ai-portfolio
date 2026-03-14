export type Locale = "en" | "es";

import type React from "react";

export type MessageType = "system" | "ai" | "user" | "error";

export interface TerminalMessage {
  id: string;
  type: MessageType;
  text?: string;
  component?: React.ReactNode;
  panelType?: string;
  panelData?: Record<string, any>;
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
  | "/tutorial"
  | "/lang"
  | "/coffee"
  | "/whoami"
  | "/train"
  | "/joke"
  | "/hack"
  | "/clear";

export interface CommandResponse {
  type: "text" | "nav" | "external" | "error" | "clear" | "lang" | "panel";
  text?: string;
  component?: React.ReactNode;
  path?: string;
  url?: string;
  locale?: Locale;
  panelType?: string;
  panelData?: Record<string, any>;
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
