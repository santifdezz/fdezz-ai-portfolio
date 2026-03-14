export type MessageType = "system" | "ai" | "user";

export interface TerminalMessage {
  id: string;
  type: MessageType;
  text: string;
  timestamp?: number;
}
