"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { makeActivity } from "./agents";
import { buildSite, defaultOptions, detectGenre, paletteFromFiles } from "./engine/build";
import { fixQa, qaScore, runQa } from "./engine/qa";
import { applyEdit } from "./engine/edit";
import { toast } from "./toast";
import type {
  AgentId,
  AgentState,
  BuildOptions,
  ChatMessage,
  EditOutcome,
  EngineSettings,
  FileMap,
  GenreId,
  Plan,
  Project,
  QaFinding,
  SelectionInfo,
  Version,
} from "./types";

export const BUILD_COST = 12;
export const EDIT_COST = 2;
const MAX_VERSIONS = 10;

const uid = () => `${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;

const defaultSettings: EngineSettings = {
  model: "atelier-1",
  temperature: 0.7,
  creativity: "balanced",
  systemPrompt:
    "You are Atelier's design engine. Compose a complete, genre-aware site from the brief. Use real copy, a deliberate type pairing, an 8px spacing rhythm, and motion that respects prefers-reduced-motion. Never imitate an existing brand's marks.",
};

export type AtelierState = {
  projects: Record<string, Project>;
  order: string[];
  credits: number;
  settings: EngineSettings;

  createProject: (prompt: string, genreOverride?: GenreId) => Project;
  updateOptions: (id: string, patch: Partial<BuildOptions>) => void;
  regeneratePlan: (id: string) => void;
  approveBuild: (id: string) => { ok: boolean; message?: string };
  patchAgent: (id: string, agentId: AgentId, patch: Partial<AgentState>) => void;
  logAgent: (id: string, agentId: AgentId, line: string, progress?: number) => void;
  completeBuild: (id: string, payload: { files: FileMap; qa: QaFinding[]; plan: Plan }) => void;
  applyInstruction: (
    id: string,
    text: string,
    selection?: SelectionInfo | null,
  ) => { ok: boolean; outcome?: EditOutcome; message?: string };
  deploy: (id: string) => string | null;
  restoreVersion: (id: string, versionId: string) => void;
  deleteProject: (id: string) => void;
  renameProject: (id: string, name: string) => void;
  setSettings: (patch: Partial<EngineSettings>) => void;
  updateProjectSettings: (id: string, patch: Partial<EngineSettings>) => void;
  addCredits: (amount: number) => void;
  resetAll: () => void;
};

function monogramFor(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "site";
}

function diffFiles(before: FileMap, after: FileMap): string[] {
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...keys].filter((k) => before[k] !== after[k]).sort((a, b) => {
    if (a === "index.html") return -1;
    if (b === "index.html") return 1;
    return a.localeCompare(b);
  });
}

function makeVersion(files: FileMap, label: string, note: string): Version {
  return { id: `v_${uid()}`, label, at: Date.now(), files, note };
}

function pushVersion(project: Project, files: FileMap, note: string): Version[] {
  const labels = project.versions.map((v) => Number(v.label.replace(/\D/g, "")) || 0);
  const next = Math.max(0, ...labels) + 1;
  return [makeVersion(files, `v${next}`, note), ...project.versions].slice(0, MAX_VERSIONS);
}

function userMessage(text: string): ChatMessage {
  return { id: uid(), role: "user", text, at: Date.now() };
}

function assistantMessage(text: string, kind: ChatMessage["kind"], changed?: string[]): ChatMessage {
  return { id: uid(), role: "assistant", text, at: Date.now(), kind, changed };
}

export const useAtelier = create<AtelierState>()(
  persist(
    (set, get) => ({
      projects: {},
      order: [],
      credits: 100,
      settings: defaultSettings,

      createProject(prompt, genreOverride) {
        const text = prompt.trim();
        const genre = genreOverride ?? detectGenre(text);
        const options: BuildOptions = defaultOptions(genre);
        const seedSalt = uid();
        const plan = buildSite(text, genre, options, seedSalt).plan;
        const now = Date.now();
        const project: Project = {
          id: `p_${uid()}`,
          name: plan.brand.name,
          prompt: text,
          genre,
          plan,
          files: {},
          options,
          seedSalt,
          stage: "plan",
          messages: [],
          versions: [],
          qa: [],
          activity: makeActivity(),
          settings: { ...get().settings },
          creditsSpent: 0,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({
          projects: { ...s.projects, [project.id]: project },
          order: [project.id, ...s.order],
        }));
        return project;
      },

      updateOptions(id, patch) {
        const p = get().projects[id];
        if (!p || p.stage !== "plan") return;
        const options = { ...p.options, ...patch };
        const plan = buildSite(p.prompt, p.genre, options, p.seedSalt).plan;
        set((s) => ({
          projects: { ...s.projects, [id]: { ...p, options, plan, updatedAt: Date.now() } },
        }));
      },

      regeneratePlan(id) {
        const p = get().projects[id];
        if (!p) return;
        const seedSalt = uid();
        const plan = buildSite(p.prompt, p.genre, p.options, seedSalt).plan;
        set((s) => ({
          projects: {
            ...s.projects,
            [id]: {
              ...p,
              seedSalt,
              plan,
              name: plan.brand.name,
              stage: "plan",
              files: {},
              versions: [],
              qa: [],
              activity: makeActivity(),
              updatedAt: Date.now(),
            },
          },
        }));
      },

      approveBuild(id) {
        const p = get().projects[id];
        if (!p) return { ok: false, message: "Project not found." };
        if (p.stage !== "plan") return { ok: false, message: "This project is already past the plan stage." };
        if (get().credits < BUILD_COST) {
          return { ok: false, message: `You need ${BUILD_COST} credits to build. Add credits from the plan screen.` };
        }
        const now = Date.now();
        const messages: ChatMessage[] = [
          userMessage(p.prompt),
          assistantMessage(
            "Plan approved. Six agents are picking it up — watch the activity panel for each handoff.",
            "build",
          ),
        ];
        set((s) => ({
          credits: s.credits - BUILD_COST,
          projects: {
            ...s.projects,
            [id]: {
              ...p,
              stage: "building",
              messages,
              activity: makeActivity(),
              creditsSpent: p.creditsSpent + BUILD_COST,
              updatedAt: now,
            },
          },
        }));
        return { ok: true };
      },

      patchAgent(id, agentId, patch) {
        const p = get().projects[id];
        if (!p) return;
        set((s) => ({
          projects: {
            ...s.projects,
            [id]: {
              ...p,
              activity: p.activity.map((a) => (a.id === agentId ? { ...a, ...patch } : a)),
            },
          },
        }));
      },

      logAgent(id, agentId, line, progress) {
        const p = get().projects[id];
        if (!p) return;
        set((s) => ({
          projects: {
            ...s.projects,
            [id]: {
              ...p,
              activity: p.activity.map((a) =>
                a.id === agentId
                  ? {
                      ...a,
                      logs: [...a.logs, line].slice(-8),
                      detail: line,
                      progress: progress ?? a.progress,
                    }
                  : a,
              ),
            },
          },
        }));
      },

      completeBuild(id, payload) {
        const p = get().projects[id];
        if (!p || p.stage !== "building") return;
        const palette = paletteFromFiles(payload.files);
        const plan: Plan = { ...payload.plan, brand: p.plan.brand, design: { ...payload.plan.design, palette } };
        const now = Date.now();
        const total = payload.qa.length;
        const fixed = payload.qa.filter((f) => f.fixed).length;
        const score = qaScore(payload.qa);
        const count = Object.keys(payload.files).length;
        const body =
          total === 0
            ? `Built ${count} files and ran the full accessibility and layout pass. Nothing needed fixing — quality score 100/100. Try an edit in the chat: only the affected files change.`
            : `Built ${count} files. QA raised ${total} ${total === 1 ? "issue" : "issues"}, the fixer resolved ${fixed}, and the reviewer signed off at ${score}/100. Try an edit in the chat: only the affected files change.`;
        set((s) => ({
          projects: {
            ...s.projects,
            [id]: {
              ...p,
              files: payload.files,
              qa: payload.qa,
              plan,
              stage: "ready",
              versions: pushVersion(p, payload.files, "Initial build"),
              messages: [...p.messages, assistantMessage(body, "build", Object.keys(payload.files))],
              updatedAt: now,
            },
          },
        }));
      },

      applyInstruction(id, text, selection) {
        const p = get().projects[id];
        if (!p) return { ok: false, message: "Project not found." };
        if (p.stage !== "ready") return { ok: false, message: "Wait for the build to finish before editing." };

        const outcome = applyEdit(
          { files: p.files, plan: p.plan, options: p.options, genre: p.genre },
          text,
          selection ?? null,
        );
        const now = Date.now();

        if (!outcome.changed.length) {
          set((s) => ({
            projects: {
              ...s.projects,
              [id]: {
                ...p,
                messages: [...p.messages, userMessage(text), assistantMessage(outcome.summary, "info")],
                updatedAt: now,
              },
            },
          }));
          return { ok: true, outcome };
        }

        if (get().credits < EDIT_COST) {
          return { ok: false, message: `An edit costs ${EDIT_COST} credits. Add more credits to keep going.` };
        }

        let files = outcome.files;
        let qa = runQa(files);
        let fixedCount = 0;
        if (qa.length) {
          const fixed = fixQa(files, qa);
          files = fixed.files;
          qa = fixed.findings;
          fixedCount = qa.filter((f) => f.fixed).length;
        }
        const changed = diffFiles(p.files, files);
        const brand = outcome.brandName
          ? { name: outcome.brandName, monogram: monogramFor(outcome.brandName) }
          : { name: p.plan.brand.name, monogram: p.plan.brand.monogram };
        const plan: Plan = {
          ...p.plan,
          brand: { ...p.plan.brand, ...brand },
          design: {
            ...p.plan.design,
            palette: paletteFromFiles(files),
            radius: outcome.radius ?? p.plan.design.radius,
          },
        };
        const options: BuildOptions = {
          ...p.options,
          radius: outcome.radius ?? p.options.radius,
          sections: outcome.addedSection
            ? Array.from(new Set([...p.options.sections, outcome.addedSection]))
            : p.options.sections,
        };
        const summary =
          outcome.summary +
          (fixedCount ? ` QA also patched ${fixedCount} side effect${fixedCount === 1 ? "" : "s"} in the new code.` : "");

        set((s) => ({
          credits: s.credits - EDIT_COST,
          projects: {
            ...s.projects,
            [id]: {
              ...p,
              files,
              qa,
              plan,
              options,
              name: brand.name,
              messages: [...p.messages, userMessage(text), assistantMessage(summary, "edit", changed)],
              versions: pushVersion(p, files, summary.slice(0, 120)),
              creditsSpent: p.creditsSpent + EDIT_COST,
              updatedAt: now,
            },
          },
        }));
        return { ok: true, outcome };
      },

      deploy(id) {
        const p = get().projects[id];
        if (!p || p.stage !== "ready") return null;
        if (p.deployed) return p.deployed.url;
        const subdomain = `${slugify(p.plan.brand.name)}-${uid().slice(0, 4)}`;
        const url = `/s/${p.id}`;
        const deployed = { url, subdomain, at: Date.now() };
        set((s) => ({
          projects: {
            ...s.projects,
            [id]: {
              ...p,
              deployed,
              messages: [
                ...p.messages,
                assistantMessage(
                  `Published to ${subdomain}.atelier.site. The preview link is live in this browser; connect a host to serve it from the wider web.`,
                  "info",
                ),
              ],
              updatedAt: Date.now(),
            },
          },
        }));
        return url;
      },

      restoreVersion(id, versionId) {
        const p = get().projects[id];
        if (!p) return;
        const version = p.versions.find((v) => v.id === versionId);
        if (!version) return;
        const now = Date.now();
        const plan: Plan = {
          ...p.plan,
          design: { ...p.plan.design, palette: paletteFromFiles(version.files) },
        };
        set((s) => ({
          projects: {
            ...s.projects,
            [id]: {
              ...p,
              files: version.files,
              plan,
              versions: pushVersion(p, version.files, `Restored ${version.label}`),
              messages: [
                ...p.messages,
                assistantMessage(`Rolled back to ${version.label}. All files restored.`, "info", Object.keys(version.files)),
              ],
              updatedAt: now,
            },
          },
        }));
        toast(`Restored ${version.label}`, "success");
      },

      deleteProject(id) {
        set((s) => {
          const projects = { ...s.projects };
          delete projects[id];
          return { projects, order: s.order.filter((x) => x !== id) };
        });
      },

      renameProject(id, name) {
        const p = get().projects[id];
        const clean = name.trim();
        if (!p || !clean) return;
        set((s) => ({
          projects: { ...s.projects, [id]: { ...p, name: clean, updatedAt: Date.now() } },
        }));
      },

      setSettings(patch) {
        set((s) => ({ settings: { ...s.settings, ...patch } }));
      },

      updateProjectSettings(id, patch) {
        const p = get().projects[id];
        if (!p) return;
        set((s) => ({
          settings: { ...s.settings, ...patch },
          projects: { ...s.projects, [id]: { ...p, settings: { ...p.settings, ...patch } } },
        }));
      },

      addCredits(amount) {
        set((s) => ({ credits: s.credits + amount }));
        toast(`Added ${amount} credits`, "success");
      },

      resetAll() {
        set({ projects: {}, order: [], credits: 100 });
      },
    }),
    {
      name: "atelier.store.v1",
      skipHydration: true,
      partialize: (s) => ({
        projects: s.projects,
        order: s.order,
        credits: s.credits,
        settings: s.settings,
      }),
    },
  ),
);

export function useHydrated() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (useAtelier.persist.hasHydrated()) {
      setReady(true);
      return;
    }
    const unsub = useAtelier.persist.onFinishHydration(() => setReady(true));
    void useAtelier.persist.rehydrate();
    return unsub;
  }, []);
  return ready;
}
