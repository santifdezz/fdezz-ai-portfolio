"use client";

import { useRouter } from "next/navigation";
import type { CommandKey, CommandResponse, Locale } from "./terminalTypes";
import { parseCommand, getCommandArgs, requiresNavigation } from "./commands";
import {
  getResponse,
  getUnknownResponse,
  getAboutResponse,
  getProjectsResponse,
  getProjectDetailsResponse,
  getServicesResponse,
  getContactResponse,
} from "./responses";

const GITHUB_URL = "https://github.com/fdezz";
const CV_URL = "/cv.pdf";

export function useCommandHandler() {
  const router = useRouter();

  function handleCommand(input: string, locale: Locale): CommandResponse {
    const cmd = parseCommand(input);

    if (cmd === "unknown") {
      const [rawCmd] = input.trim().split(" ");
      return {
        type: "error",
        text: getUnknownResponse(rawCmd, locale),
      };
    }

    // Dynamic portfolio content commands
    if (cmd === "/about") {
      return { type: "text", text: getAboutResponse(locale) };
    }

    if (cmd === "/projects") {
      const args = getCommandArgs(input);
      const filter = args[0];
      return { type: "text", text: getProjectsResponse(locale, filter) };
    }

    if (cmd === "/services") {
      return { type: "text", text: getServicesResponse(locale) };
    }

    if (cmd === "/contact") {
      return { type: "text", text: getContactResponse(locale) };
    }

    // Navigation commands
    if (requiresNavigation(cmd)) {
      const text = getResponse(cmd, locale);
      const pathMap: Partial<Record<CommandKey, string>> = {
        "/about":    "/about",
        "/projects": "/projects",
        "/skills":   "/skills",
        "/contact":  "/contact",
        "/timeline": "/timeline",
      };
      const path = pathMap[cmd];
      if (path) {
        setTimeout(() => router.push(path), 400);
      }
      return { type: "nav", text, path };
    }

    // /project <id>
    if (cmd === "/project") {
      const args = getCommandArgs(input);
      if (!args[0]) {
        return {
          type: "error",
          text: locale === "es" ? "Uso: /project <id>" : "Usage: /project <id>",
        };
      }
      const projectId = args[0];
      const text = getProjectDetailsResponse(locale, projectId);
      return { type: "text", text };
    }

    // External links
    if (cmd === "/github") {
      return {
        type: "external",
        text: getResponse(cmd, locale),
        url: GITHUB_URL,
      };
    }

    if (cmd === "/cv") {
      return {
        type: "external",
        text: getResponse(cmd, locale),
        url: CV_URL,
      };
    }

    // Language switch
    if (cmd === "/lang") {
      const args = getCommandArgs(input);
      const newLocale = args[0] as Locale;
      if (newLocale === "en" || newLocale === "es") {
        return { type: "lang", text: getResponse(cmd, locale), locale: newLocale };
      }
      return {
        type: "error",
        text: "Usage: /lang en|es",
      };
    }

    // Clear
    if (cmd === "/clear") {
      return { type: "clear", text: "" };
    }

    // Text responses (system, architecture, help, easter eggs, etc.)
    return {
      type: "text",
      text: getResponse(cmd, locale),
    };
  }

  return { handleCommand };
}
