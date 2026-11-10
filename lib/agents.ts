import type { AgentId, AgentState } from "./types";

export type AgentMeta = {
  id: AgentId;
  name: string;
  role: string;
  tint: string;
};

export const AGENTS: AgentMeta[] = [
  { id: "planner", name: "Planner", role: "Reads the brief, draws the sitemap", tint: "#ffb020" },
  { id: "designer", name: "Designer", role: "Palette, type, spacing, motion", tint: "#ff6a3d" },
  { id: "frontend", name: "Frontend", role: "Markup, layout, interaction", tint: "#8f9dff" },
  { id: "backend", name: "Backend", role: "Schema, data shape, auth seam", tint: "#4fd1a5" },
  { id: "qa", name: "QA", role: "Accessibility, contrast, layout", tint: "#f0d16a" },
  { id: "reviewer", name: "Reviewer", role: "Final read, signs it off", tint: "#c9a4ff" },
];

export const AGENT_BY_ID = Object.fromEntries(AGENTS.map((a) => [a.id, a])) as Record<AgentId, AgentMeta>;

export function makeActivity(): AgentState[] {
  return AGENTS.map((a) => ({
    id: a.id,
    status: "queued" as const,
    detail: "Waiting for handoff",
    logs: [],
    ms: 0,
    progress: 0,
  }));
}
