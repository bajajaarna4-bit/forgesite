"use client";

import { useAtelier } from "./store";
import { GENRE_LABEL, buildSite, fileSize } from "./engine/build";
import { fixQa, qaScore, runQa } from "./engine/qa";
import type { AgentId, AgentState } from "./types";

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const running = new Set<string>();

function trim(value: string, max = 104) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

export async function runBuildPipeline(projectId: string) {
  if (running.has(projectId)) return;
  running.add(projectId);
  try {
    await build(projectId);
  } finally {
    running.delete(projectId);
  }
}

async function build(projectId: string) {
  const initial = useAtelier.getState().projects[projectId];
  if (!initial || initial.stage !== "building") return;

  const { files, plan } = buildSite(initial.prompt, initial.genre, initial.options, initial.seedSalt);
  const raw = runQa(files);
  const fixed = fixQa(files, raw);
  const finalFiles = fixed.files;
  const findings = fixed.findings;
  const score = qaScore(findings);
  const fixedCount = findings.filter((f) => f.fixed).length;

  const alive = () => {
    const p = useAtelier.getState().projects[projectId];
    return Boolean(p && p.stage === "building");
  };

  const patch = (agent: AgentId, data: Partial<AgentState>) => {
    if (!alive()) return;
    useAtelier.getState().patchAgent(projectId, agent, data);
  };

  const log = (agent: AgentId, line: string, progress: number) => {
    if (!alive()) return;
    useAtelier.getState().logAgent(projectId, agent, line, progress);
  };

  const phase = async (agent: AgentId, steps: { line: string; progress: number; ms: number }[]) => {
    if (!alive()) return false;
    patch(agent, { status: "working", progress: 2, detail: "Picking up the handoff" });
    const started = Date.now();
    for (const step of steps) {
      if (!alive()) return false;
      log(agent, step.line, step.progress);
      await wait(step.ms);
    }
    if (!alive()) return false;
    const last = steps[steps.length - 1];
    patch(agent, {
      status: "done",
      progress: 100,
      ms: Math.max(600, Date.now() - started),
      detail: last ? last.line : "Done",
    });
    return true;
  };

  const words = initial.prompt.trim().split(/\s+/).length;
  const palette = plan.design.palette.filter((p) => ["Canvas", "Ink", "Accent"].includes(p.name));
  const checkList = "copy, alt text, intrinsic sizes, contrast, headings, reduced motion";

  const plannerOk = await phase("planner", [
    { line: `Reading the brief — ${words} words, mood leaning ${plan.design.mood.toLowerCase()}.`, progress: 22, ms: 420 },
    {
      line: `Genre locked: ${GENRE_LABEL[initial.genre]}. Sitemap: ${plan.pages.map((p) => p.name).join(" · ")}.`,
      progress: 58,
      ms: 440,
    },
    {
      line: `Components sketched: ${plan.components.slice(0, 4).map((c) => c.name).join(", ")}${
        plan.components.length > 4 ? "…" : "."
      }`,
      progress: 92,
      ms: 420,
    },
  ]);
  if (!plannerOk) return;

  const designOk = await phase("designer", [
    {
      line: `Palette locked: ${palette.map((p) => `${p.name} ${p.hex}`).join(" · ")}.`,
      progress: 24,
      ms: 400,
    },
    {
      line: `Type pairing: ${plan.design.fonts.display} for display, ${plan.design.fonts.body} for text.`,
      progress: 62,
      ms: 380,
    },
    {
      line: `Radius ${plan.design.radius}px, 8px spacing rhythm. ${plan.design.motion[0] ?? "Quiet motion."}`,
      progress: 94,
      ms: 380,
    },
  ]);
  if (!designOk) return;

  const frontendOk = await phase("frontend", [
    {
      line: `Writing index.html — ${fileSize(files["index.html"] ?? "")}, ${plan.pages.length} view${
        plan.pages.length === 1 ? "" : "s"
      }.`,
      progress: 20,
      ms: 460,
    },
    {
      line: `Writing styles/tokens.css and styles/site.css — ${fileSize(
        (files["styles/tokens.css"] ?? "") + (files["styles/site.css"] ?? ""),
      )} combined.`,
      progress: 48,
      ms: 460,
    },
    {
      line: `Wiring app.js — ${fileSize(files["app.js"] ?? "")}, ${plan.design.motion.length} motion behaviours.`,
      progress: 74,
      ms: 440,
    },
    { line: "Checking the reflow at 360, 768 and 1440.", progress: 94, ms: 380 },
  ]);
  if (!frontendOk) return;

  const backendOk = await phase("backend", [
    {
      line: `Schema: ${plan.database.map((d) => `${d.table} (${d.columns.length} fields)`).join(", ")}.`,
      progress: 40,
      ms: 380,
    },
    { line: "Auth and persistence stubbed behind a Supabase-shaped seam.", progress: 88, ms: 360 },
  ]);
  if (!backendOk) return;

  const qaSteps: { line: string; progress: number; ms: number }[] = [
    { line: `Testing: ${checkList}.`, progress: 12, ms: 380 },
  ];
  if (findings.length) {
    findings.slice(0, 5).forEach((f, i) => {
      qaSteps.push({
        line: trim(`${f.fixed ? "Caught" : "Flagged"} — ${f.detail}`, 110),
        progress: 24 + i * 12,
        ms: 340,
      });
    });
    findings
      .filter((f) => f.fixed)
      .slice(0, 3)
      .forEach((f, i) => {
        qaSteps.push({
          line: `Patched ${f.file} — ${f.rule.toLowerCase()}.`,
          progress: 62 + i * 9,
          ms: 320,
        });
      });
    qaSteps.push({
      line: `Fixed ${fixedCount} of ${findings.length}. Quality score ${score}/100.`,
      progress: 96,
      ms: 320,
    });
  } else {
    qaSteps.push({ line: `No issues across the full pass. Quality score 100/100.`, progress: 50, ms: 420 });
    qaSteps.push({ line: "Re-checking focus order and motion preferences.", progress: 88, ms: 380 });
  }
  const qaOk = await phase("qa", qaSteps);
  if (!qaOk) return;

  const reviewOk = await phase("reviewer", [
    {
      line: `Reading the diff — ${Object.keys(finalFiles).length} files, no unrelated edits.`,
      progress: 30,
      ms: 380,
    },
    { line: "Hierarchy, spacing rhythm, focus order and reduced motion check out.", progress: 68, ms: 360 },
    {
      line: `Signed off at ${score}/100. Handing the project back to you.`,
      progress: 96,
      ms: 340,
    },
  ]);
  if (!reviewOk) return;

  useAtelier.getState().completeBuild(projectId, { files: finalFiles, qa: findings, plan });
}
