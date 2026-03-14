import React from "react";
import { registerPanel, getPanelComponent, type PanelType } from "./panelRegistry";
import { TimelineMessage } from "@/components/terminal/TimelineMessage";
import { ProjectsPanel } from "@/components/panels/ProjectsPanel";
import { BioPanel } from "@/components/panels/BioPanel";
import { SkillsPanel } from "@/components/panels/SkillsPanel";
import { ServicesPanel } from "@/components/panels/ServicesPanel";
import { ContactPanel } from "@/components/panels/ContactPanel";
import { HelpPanel } from "@/components/panels/HelpPanel";

/**
 * Initialize panel registry on module load
 * Registers all available panel types with their components
 */
export function initializePanelRegistry() {
  registerPanel(
    "timeline",
    TimelineMessage,
    "Interactive timeline of professional journey"
  );
  registerPanel(
    "projects",
    ProjectsPanel,
    "Visual showcase of projects"
  );
  registerPanel(
    "bio",
    BioPanel,
    "Professional biography and skills matrix"
  );
  registerPanel(
    "skills",
    SkillsPanel,
    "Categorized skills and expertise"
  );
  registerPanel(
    "services",
    ServicesPanel,
    "Services and capabilities"
  );
  registerPanel(
    "contact",
    ContactPanel,
    "Contact information and links"
  );
  registerPanel(
    "help",
    HelpPanel,
    "Help and command documentation"
  );
}

/**
 * Factory function to create panel components from CommandResponse data
 * Returns a React component that can be rendered in ChatBubble
 */
export function createPanelComponent(
  panelType: PanelType,
  panelData: Record<string, any>
): React.ReactNode {
  const PanelComponent = getPanelComponent(panelType);

  if (!PanelComponent) {
    console.warn(`Panel type "${panelType}" not registered`);
    return null;
  }

  return React.createElement(PanelComponent, {
    ...panelData,
    key: `panel-${panelType}-${Date.now()}`,
  });
}

/**
 * Determine if a CommandResponse should use a panel
 */
export function shouldUsePanel(response: any): response is { panelType: PanelType; panelData: Record<string, any> } {
  return response?.panelType && typeof response?.panelData === "object";
}

// Initialize on module load
if (typeof window !== "undefined") {
  initializePanelRegistry();
}
