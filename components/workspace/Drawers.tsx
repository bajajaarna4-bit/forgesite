"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  History,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { AGENTS } from "@/lib/agents";
import { qaScore } from "@/lib/engine/qa";
import { GENRE_LABEL } from "@/lib/engine/detect";
import { timeAgo } from "@/lib/utils";
import type { EngineSettings, Project, QaFinding } from "@/lib/types";

function Drawer({
  open,
  onClose,
  title,
  eyebrow,
  icon: Icon,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow: string;
  icon: typeof History;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.button
            aria-label="Close panel"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={reduce ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduce ? undefined : { x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="panel-solid absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col border-l border-white/10"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-ember-soft">
                  <Icon size={15} />
                </span>
                <div>
                  <p className="text-[9.5px] uppercase tracking-[0.18em] text-faint">{eyebrow}</p>
                  <p className="text-[13px] font-medium">{title}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-white/10 hover:text-ink"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>
            <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

const SEVERITY: Record<QaFinding["severity"], { label: string; tint: string }> = {
  high: { label: "high", tint: "#ff6a3d" },
  medium: { label: "medium", tint: "#ffb020" },
  low: { label: "low", tint: "#8b93ff" },
};

export function ActivityDrawer({
  project,
  open,
  onClose,
}: {
  project: Project;
  open: boolean;
  onClose: () => void;
}) {
  const score = qaScore(project.qa);
  const openIssues = project.qa.filter((f) => !f.fixed).length;

  return (
    <Drawer open={open} onClose={onClose} title="Agents & QA" eyebrow="Studio activity" icon={Users}>
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-xl border border-fern/20 bg-fern/[0.05] px-3.5 py-3">
          <ShieldCheck size={18} className="flex-none text-fern" />
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium">
              Quality score {score}
              <span className="text-faint">/100</span>
            </p>
            <p className="text-[10.5px] text-faint">
              {project.qa.length === 0
                ? "No issues raised in the last pass."
                : `${project.qa.length - openIssues} of ${project.qa.length} findings patched automatically`}
            </p>
          </div>
          <span
            className="rounded-full border px-2 py-0.5 text-[9.5px]"
            style={{
              borderColor: openIssues ? "rgba(255,106,61,.3)" : "rgba(61,220,151,.3)",
              color: openIssues ? "#ffb9a4" : "#9df0cc",
              background: openIssues ? "rgba(255,106,61,.08)" : "rgba(61,220,151,.08)",
            }}
          >
            {openIssues ? `${openIssues} open` : "clean"}
          </span>
        </div>

        <p className="mb-2 mt-5 text-[9.5px] uppercase tracking-[0.18em] text-faint">Agents</p>
        <div className="space-y-2">
          {AGENTS.map((meta) => {
            const state = project.activity.find((a) => a.id === meta.id);
            if (!state) return null;
            const done = state.status === "done";
            return (
              <div key={meta.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="grid h-6 w-6 flex-none place-items-center rounded-md text-[10px] font-semibold"
                    style={{ background: `${meta.tint}1f`, color: meta.tint }}
                  >
                    {meta.name.slice(0, 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11.5px] font-medium">{meta.name}</p>
                    <p className="text-[10px] text-faint">{meta.role}</p>
                  </div>
                  <span className="flex items-center gap-1 text-[9.5px]" style={{ color: done ? "#3ddc97" : meta.tint }}>
                    {done ? <Check size={10} /> : null}
                    {state.status}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-[10.5px] leading-relaxed text-muted">{state.detail}</p>
                <div className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-white/[0.05]">
                  <div className="h-full rounded-full" style={{ width: `${state.progress}%`, background: meta.tint }} />
                </div>
                {state.logs.length > 0 && (
                  <p className="mt-2 truncate font-mono text-[9px] text-faint">› {state.logs[state.logs.length - 1]}</p>
                )}
              </div>
            );
          })}
        </div>

        <p className="mb-2 mt-5 flex items-center justify-between text-[9.5px] uppercase tracking-[0.18em] text-faint">
          QA findings <span className="font-mono text-[9px] normal-case tracking-normal">{project.qa.length}</span>
        </p>
        {project.qa.length === 0 ? (
          <div className="flex items-center gap-2 rounded-xl border border-fern/20 bg-fern/[0.04] px-3 py-3 text-[11px] text-muted">
            <CheckCircle2 size={14} className="text-fern" /> No issues on the last pass.
          </div>
        ) : (
          <div className="space-y-2">
            {project.qa.map((f, i) => {
              const sev = SEVERITY[f.severity];
              return (
                <div key={`${f.id}-${i}`} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="rounded px-1.5 py-0.5 font-mono text-[8.5px] uppercase"
                      style={{ background: `${sev.tint}18`, color: sev.tint }}
                    >
                      {sev.label}
                    </span>
                    <span className="truncate text-[10.5px] text-muted">{f.rule}</span>
                    <span className="ml-auto flex flex-none items-center gap-1 text-[9.5px] text-fern">
                      {f.fixed ? (
                        <>
                          <Check size={9} /> patched
                        </>
                      ) : (
                        <span className="text-ember-soft">open</span>
                      )}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[10.5px] leading-relaxed text-faint">{f.detail}</p>
                  <p className="mt-1 font-mono text-[9px] text-faint">{f.file}</p>
                </div>
              );
            })}
          </div>
        )}
        <p className="mt-4 flex items-start gap-1.5 text-[10px] leading-relaxed text-faint">
          <AlertTriangle size={11} className="mt-0.5 flex-none" />
          Findings are produced by rules running against the real generated files, then patched in place.
        </p>
      </div>
    </Drawer>
  );
}

export function VersionsDrawer({
  project,
  open,
  onClose,
  onRestore,
}: {
  project: Project;
  open: boolean;
  onClose: () => void;
  onRestore: (versionId: string) => void;
}) {
  return (
    <Drawer open={open} onClose={onClose} title="Version history" eyebrow="Every state kept" icon={History}>
      <div className="p-4">
        {project.versions.length === 0 ? (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-[11.5px] text-faint">
            Versions appear after the first build. Every edit creates a restore point.
          </div>
        ) : (
          <ol className="relative space-y-2 before:absolute before:bottom-4 before:left-[15px] before:top-4 before:w-px before:bg-white/[0.07]">
            {project.versions.map((v, i) => {
              const current = i === 0;
              return (
                <li key={v.id} className="relative flex gap-3">
                  <span
                    className={`relative z-10 mt-1 grid h-8 w-8 flex-none place-items-center rounded-full border text-[9px] font-semibold ${
                      current
                        ? "border-ember/40 bg-ember/15 text-ember-soft"
                        : "border-white/10 bg-[#0d0f15] text-faint"
                    }`}
                  >
                    {v.label}
                  </span>
                  <div className="min-w-0 flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 flex-1 text-[11px] leading-relaxed text-muted">{v.note}</p>
                      {current ? (
                        <span className="flex-none rounded-full border border-ember/30 bg-ember/10 px-1.5 py-0.5 text-[9px] text-ember-soft">
                          current
                        </span>
                      ) : (
                        <button
                          onClick={() => onRestore(v.id)}
                          className="flex flex-none items-center gap-1 rounded-md border border-white/10 px-1.5 py-0.5 text-[9.5px] text-muted transition hover:border-white/25 hover:text-ink"
                        >
                          <RotateCcw size={9} /> Restore
                        </button>
                      )}
                    </div>
                    <p className="mt-1.5 flex items-center gap-1.5 text-[9.5px] text-faint">
                      {timeAgo(v.at)}
                      <span className="text-white/15">·</span>
                      {Object.keys(v.files).length} files
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        <p className="mt-4 text-[10px] leading-relaxed text-faint">
          Restoring creates a new version rather than deleting history. Up to 10 versions are kept per project.
        </p>
      </div>
    </Drawer>
  );
}

const MODELS: { value: EngineSettings["model"]; label: string; note: string }[] = [
  { value: "atelier-1", label: "Atelier-1", note: "Balanced default" },
  { value: "atelier-1-pro", label: "Atelier-1 Pro", note: "Slower, richer composition" },
  { value: "atelier-1-fast", label: "Atelier-1 Fast", note: "Tightest loop" },
];

export function SettingsDrawer({
  project,
  open,
  onClose,
  onUpdate,
}: {
  project: Project;
  open: boolean;
  onClose: () => void;
  onUpdate: (patch: Partial<EngineSettings>) => void;
}) {
  const s = project.settings;
  return (
    <Drawer open={open} onClose={onClose} title="Studio settings" eyebrow="Project controls" icon={Settings2}>
      <div className="space-y-5 p-4">
        <div>
          <label className="text-[9.5px] uppercase tracking-[0.18em] text-faint" htmlFor="model">
            Model
          </label>
          <select
            id="model"
            value={s.model}
            onChange={(e) => onUpdate({ model: e.target.value as EngineSettings["model"] })}
            className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0d0f15] px-3 py-2 text-[12px] text-ink outline-none focus:border-ember/50"
          >
            {MODELS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label} — {m.note}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-[9.5px] uppercase tracking-[0.18em] text-faint" htmlFor="temp">
              Temperature
            </label>
            <span className="font-mono text-[10px] text-muted">{s.temperature.toFixed(2)}</span>
          </div>
          <input
            id="temp"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={s.temperature}
            onChange={(e) => onUpdate({ temperature: Number(e.target.value) })}
            className="range mt-2 w-full"
          />
          <div className="flex justify-between text-[9px] text-faint">
            <span>precise</span>
            <span>expressive</span>
          </div>
        </div>

        <div>
          <p className="text-[9.5px] uppercase tracking-[0.18em] text-faint">Creativity</p>
          <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg border border-white/10 bg-black/25 p-1">
            {(["precise", "balanced", "expressive"] as const).map((c) => (
              <button
                key={c}
                onClick={() => onUpdate({ creativity: c })}
                className={`rounded-md py-1.5 text-[10.5px] capitalize transition ${
                  s.creativity === c ? "bg-white/[0.1] text-ink" : "text-faint hover:text-muted"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[9.5px] uppercase tracking-[0.18em] text-faint" htmlFor="sys">
            System instruction
          </label>
          <textarea
            id="sys"
            value={s.systemPrompt}
            onChange={(e) => onUpdate({ systemPrompt: e.target.value })}
            rows={6}
            className="mt-1.5 w-full resize-none rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-[11px] leading-relaxed text-muted outline-none focus:border-ember/50"
          />
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-[9.5px] uppercase tracking-[0.18em] text-faint">Project</p>
          <dl className="mt-2 space-y-1.5 text-[11px]">
            <div className="flex justify-between gap-3">
              <dt className="text-faint">Genre</dt>
              <dd className="text-muted">{GENRE_LABEL[project.genre]}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-faint">Versions</dt>
              <dd className="text-muted">{project.versions.length}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-faint">Credits spent</dt>
              <dd className="text-muted">{project.creditsSpent}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-faint">Updated</dt>
              <dd className="text-muted">{timeAgo(project.updatedAt)}</dd>
            </div>
          </dl>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-iris/20 bg-iris/[0.05] p-3 text-[10.5px] leading-relaxed text-muted">
          <Settings2 size={13} className="mt-0.5 flex-none text-iris" />
          <span>
            These controls are recorded with the project. The local engine is deterministic, so the output stays
            reproducible until you swap in a hosted model — the seam is ready in <code className="font-mono text-[10px]">lib/pipeline.ts</code>.
          </span>
        </div>
      </div>
    </Drawer>
  );
}
