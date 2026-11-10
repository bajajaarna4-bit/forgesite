"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, CircleDashed, Loader2 } from "lucide-react";
import { AGENT_BY_ID, AGENTS } from "@/lib/agents";
import type { AgentId, Project } from "@/lib/types";

function Ring({ progress, tint }: { progress: number; tint: string }) {
  const r = 13;
  const c = 2 * Math.PI * r;
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" className="flex-none -rotate-90" aria-hidden="true">
      <circle cx="17" cy="17" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="2.5" />
      <circle
        cx="17"
        cy="17"
        r={r}
        fill="none"
        stroke={tint}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (Math.min(100, progress) / 100) * c}
        style={{ transition: "stroke-dashoffset .6s cubic-bezier(.16,1,.3,1)" }}
      />
    </svg>
  );
}

export function BuildRoom({ project }: { project: Project }) {
  const reduce = useReducedMotion();
  const activity = project.activity;
  const done = activity.filter((a) => a.status === "done").length;
  const working = activity.find((a) => a.status === "working");
  const queued = activity.find((a) => a.status === "queued");
  const active = working ?? queued;
  const overall = Math.round(activity.reduce((sum, a) => sum + a.progress, 0) / activity.length);
  const activeLogs = active ? activity.find((a) => a.id === active.id)?.logs ?? [] : [];

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full opacity-30 blur-[90px]"
        style={{ background: "radial-gradient(circle, rgba(255,106,61,.5), transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
        <div>
          <p className="flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.2em] text-ember-soft">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember" />
            </span>
            Build room · live
          </p>
          <h2 className="font-display mt-1.5 text-[30px] leading-tight">Six agents. One room.</h2>
          <p className="mt-1 text-[12px] text-muted">
            {working ? (
              <>
                <span style={{ color: AGENT_BY_ID[working.id].tint }} className="font-medium">
                  {AGENT_BY_ID[working.id].name}
                </span>{" "}
                {working.detail.charAt(0).toLowerCase() + working.detail.slice(1)}
              </>
            ) : (
              "Wrapping up the handoff."
            )}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-[38px] leading-none">
            {done}
            <span className="text-[22px] text-faint">/6</span>
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-faint">agents done</p>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between text-[10px] text-faint">
            <span>Overall handoff</span>
            <span className="font-mono">{overall}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-ember-soft via-ember to-ember-deep"
              animate={{ width: `${overall}%` }}
              transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {AGENTS.map((meta, i) => {
            const state = activity.find((a) => a.id === meta.id);
            if (!state) return null;
            const isActive = state.status === "working";
            const isDone = state.status === "done";
            return (
              <motion.div
                key={meta.id}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-xl border p-3"
                style={{
                  borderColor: isActive ? `${meta.tint}66` : "rgba(255,255,255,.07)",
                  background: isActive
                    ? `linear-gradient(160deg, ${meta.tint}18, rgba(255,255,255,.02))`
                    : "rgba(255,255,255,.02)",
                  boxShadow: isActive ? `0 14px 40px -26px ${meta.tint}` : undefined,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="grid h-7 w-7 flex-none place-items-center rounded-lg text-[11px] font-semibold"
                    style={{ background: `${meta.tint}22`, color: meta.tint, border: `1px solid ${meta.tint}44` }}
                  >
                    {meta.name.slice(0, 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium">{meta.name}</p>
                    <p className="flex items-center gap-1 text-[10px] text-faint">
                      {isDone ? (
                        <>
                          <Check size={9} className="text-fern" /> {Math.round(state.ms / 100) / 10}s
                        </>
                      ) : isActive ? (
                        <>
                          <Loader2 size={9} className="animate-spin" style={{ color: meta.tint }} /> working
                        </>
                      ) : (
                        <>
                          <CircleDashed size={9} /> waiting
                        </>
                      )}
                    </p>
                  </div>
                  <Ring progress={state.progress} tint={meta.tint} />
                </div>

                <div className="mt-2 min-h-[28px]">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={state.detail}
                      initial={reduce ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -4 }}
                      transition={{ duration: 0.28 }}
                      className="line-clamp-2 text-[10.5px] leading-snug text-muted"
                    >
                      {state.detail}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${state.progress}%`, background: meta.tint }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-3 rounded-xl border border-white/[0.06] bg-black/25 p-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[9.5px] uppercase tracking-[0.18em] text-faint">Console</span>
            <span className="font-mono text-[9px] text-faint">{active ? AGENT_BY_ID[active.id as AgentId].name : "idle"}</span>
          </div>
          <div className="scroll-thin max-h-24 space-y-1 overflow-y-auto font-mono text-[10px] leading-relaxed text-muted">
            {activeLogs.length === 0 && <p className="text-faint">Waiting for the first handoff…</p>}
            {activeLogs.map((line, i) => (
              <p key={`${line}-${i}`} className="flex gap-2">
                <span className="text-faint">›</span>
                <span>{line}</span>
              </p>
            ))}
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] text-faint">
          Every line above is real output from this build. Nothing is theatre.
        </p>
      </div>
    </div>
  );
}
