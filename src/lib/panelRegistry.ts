import React from "react";

/**
 * Panel Registry System
 * Maps panel types to their React components
 * Allows easy extension with new panel types
 */

export type PanelType =
  | "timeline"
  | "projects"
  | "bio"
  | "skills"
  | "skillcloud"
  | "services"
  | "contact"
  | "help";

export interface PanelRegistryEntry {
  type: PanelType;
  component: React.ComponentType<any>;
  description: string;
}

// Panel components will be lazily imported to avoid circular dependencies
// Registry is populated by panelFactory.ts
export const panelRegistry = new Map<PanelType, PanelRegistryEntry>();

/**
 * Register a panel type with its component
 */
export function registerPanel(
  type: PanelType,
  component: React.ComponentType<any>,
  description: string
) {
  panelRegistry.set(type, { type, component, description });
}

/**
 * Get panel component by type
 */
export function getPanelComponent(type: PanelType): React.ComponentType<any> | null {
  const entry = panelRegistry.get(type);
  return entry?.component || null;
}

/**
 * Check if panel type is registered
 */
export function isPanelTypeRegistered(type: string): type is PanelType {
  return panelRegistry.has(type as PanelType);
}
