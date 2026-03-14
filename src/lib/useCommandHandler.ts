"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { CommandKey, CommandResponse, Locale } from "./terminalTypes";
import { parseCommand, getCommandArgs, requiresNavigation } from "./commands";
import {
  getResponse,
  getUnknownResponse,
  getAboutResponse,
  getAboutPanelResponse,
  getProjectsResponse,
  getProjectsPanelResponse,
  getProjectDetailsResponse,
  getServicesResponse,
  getServicesPanelResponse,
  getContactResponse,
  getContactPanelResponse,
  getTimelineResponse,
  getHelpPanelResponse,
} from "./responses";
import { TimelineMessage } from "@/components/terminal/TimelineMessage";
import { getPortfolioContent } from "./portfolio-content";

const GITHUB_URL = "https://github.com/fdezz";
const CV_URL = "/cv.pdf";

interface HandleCommandOptions {
  onTimelineNavigate?: (periodIndex: number) => void;
}

export function useCommandHandler() {
  const router = useRouter();

  function handleCommand(
    input: string,
    locale: Locale,
    options?: HandleCommandOptions
  ): CommandResponse {
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
      return getAboutPanelResponse(locale);
    }

    if (cmd === "/projects") {
      const args = getCommandArgs(input);
      const filter = args[0];
      return getProjectsPanelResponse(locale, filter);
    }

    if (cmd === "/services") {
      return getServicesPanelResponse(locale);
    }

    if (cmd === "/contact") {
      return getContactPanelResponse(locale);
    }

    // Interactive timeline (replaces navigation)
    if (cmd === "/timeline") {
      const args = getCommandArgs(input);
      const periodArg = args[0];

      // If "all" argument or no argument, show text overview
      if (periodArg === "all" || !periodArg) {
        return { type: "text", text: getTimelineResponse(locale, periodArg) };
      }

      // Show visual timeline component for specific period
      const portfolioContent = getPortfolioContent(locale);
      const periodIndex = parseInt(periodArg) - 1; // Convert 1-based to 0-based
      const educationList = portfolioContent.about.education;

      if (periodIndex < 0 || periodIndex >= educationList.length) {
        return {
          type: "error",
          text: locale === "es"
            ? "Período inválido. Usa /timeline para ver el recorrido."
            : "Invalid period. Use /timeline to see your journey.",
        };
      }

      const education = educationList[periodIndex];

      // Create component with onNavigate callback using React.createElement
      const component = React.createElement(TimelineMessage, {
        periodIndex,
        totalPeriods: educationList.length,
        education,
        onNavigate: (newIndex: number) => {
          if (options?.onTimelineNavigate) {
            options.onTimelineNavigate(newIndex);
          }
        },
        locale,
      });

      return { type: "text", component };
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

    // Help command with visual panel
    if (cmd === "/help") {
      return getHelpPanelResponse(locale);
    }

    // Text responses (system, architecture, easter eggs, etc.)
    return {
      type: "text",
      text: getResponse(cmd, locale),
    };
  }

  return { handleCommand };
}
