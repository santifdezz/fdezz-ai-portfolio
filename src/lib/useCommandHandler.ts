import { useRouter } from "next/navigation";
import { parseCommand, type CommandKey } from "./commands";
import { responses } from "./responses";
import type { TerminalMessage } from "./terminalTypes";

export interface CommandResult {
  type: "text" | "nav" | "external";
  text: string;
  path?: string;
  url?: string;
}

export function useCommandHandler() {
  const router = useRouter();

  const handleCommand = (rawInput: string): CommandResult => {
    const trimmed = rawInput.trim();
    const [cmdPart, ...argParts] = trimmed.split(" ");
    const args = argParts.join(" ");

    const cmd = parseCommand(trimmed);

    // Handle help with optional command argument
    if (cmd === "/help") {
      if (args && argParts.length > 0) {
        // /help <command> -> show specific command help
        const specificCmd = (argParts[0] as CommandKey) || "/help";
        if (specificCmd in responses) {
          return {
            type: "text",
            text: responses[specificCmd as keyof typeof responses] as string,
          };
        }
      }
      return {
        type: "text",
        text: responses.help,
      };
    }

    // Handle project details
    if (cmd === "/projects" && argParts.length > 0) {
      const projectId = argParts[0];
      const details = responses.projectDetails(projectId);
      return {
        type: "text",
        text: details,
      };
    }

    // Handle core commands with text responses
    if (cmd in responses && cmd !== "/help" && cmd !== "/projects") {
      return {
        type: "text",
        text: responses[cmd as keyof typeof responses] as string,
      };
    }

    // Handle projects listing (without specific ID)
    if (cmd === "/projects") {
      return {
        type: "text",
        text: responses.projects,
      };
    }

    // Handle navigation commands
    const navMap: Record<CommandKey, string> = {
      "/about": "/about",
      "/skills": "/skills",
      "/contact": "/contact",
      "/projects": "/projects",
      "/project": "/projects",
      "/help": "/",
      "/github": "https://github.com",
      "/cv": "/cv.pdf",
      "/system": "/",
      "/architecture": "/",
      "/timeline": "/",
      "/coffee": "/",
      "/whoami": "/",
      "/train": "/",
      "/joke": "/",
      "/hack": "/",
    };

    if (cmd !== "unknown" && cmd in navMap) {
      const target = navMap[cmd];
      const isExternal = target.startsWith("http");

      return {
        type: isExternal ? "external" : "text",
        text: isExternal ? `Opening ${cmd}...` : "",
        url: isExternal ? target : undefined,
      };
    }

    // Unknown command
    return {
      type: "text",
      text: responses.unknown.replace(
        "${(input: string) => input}",
        trimmed
      ),
    };
  };

  return { handleCommand };
}
