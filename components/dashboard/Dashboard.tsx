"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  FolderOpen,
  Plus,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import { PageNav } from "@/components/ui/PageNav";
import { MiniSite } from "@/components/previews/MiniSite";
import { useAtelier, useHydrated } from "@/lib/store";
import { GENRE_LABEL } from "@/lib/engine/detect";
import { timeAgo } from "@/lib/utils";
import type { Project } from "@/lib/types";

function StageBadge({ stage }: { stage: Project["stage"] }) {
  const map = {
    plan: { label: "Plan ready", color: "#ffb020" },
    building: { label: "Building", color: "#ff6a3d" },
    ready: { label: "Live", color: "#3ddc97" },
  } as const;
  const s = map[stage];
  return (
    <span
      className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9.5px] backdrop-blur"
      style={{ borderColor: `${s.color}44`, background: `${s.color}14`, color: s.color }}
    >
      <span className="h-1 w-1 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}

function ProjectCard({ project, onDelete }: { project: Project; onDelete: () => void }) {
  const href = project.stage === "plan" ? `/plan/${project.id}` : `/workspace/${project.id}`;
  return (
    <div className="panel panel-hover group relative overflow-hidden rounded-[20px]">
      <Link href={href} className="block p-2.5 pb-0">
        <div className="relative overflow-hidden rounded-[13px]">
          <MiniSite genre={project.genre} />
          <div className="absolute left-2 top-2 flex gap-1.5">
            <StageBadge stage={project.stage} />
          </div>
        </div>
      </Link>
      <div className="flex items-start gap-2 px-3.5 pb-3.5 pt-3">
        <span
          className="mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-lg border text-[11px] font-semibold"
          style={{
            borderColor: `${project.plan.design.palette[4].hex}44`,
            background: `${project.plan.design.palette[4].hex}18`,
            color: project.plan.design.palette[4].hex,
          }}
        >
          {project.plan.brand.monogram}
        </span>
        <div className="min-w-0 flex-1">
          <Link href={href} className="block truncate text-[13.5px] font-medium hover:text-ember-soft">
            {project.name}
          </Link>
          <p className="truncate text-[10.5px] text-faint">
            {GENRE_LABEL[project.genre]} · {timeAgo(project.updatedAt)}
            {project.versions.length ? ` · ${project.versions.length} version${project.versions.length === 1 ? "" : "s"}` : ""}
          </p>
        </div>
        <div className="flex flex-none items-center gap-1">
          <button
            onClick={onDelete}
            className="grid h-7 w-7 place-items-center rounded-md text-faint opacity-0 transition hover:bg-ember/10 hover:text-ember-soft focus:opacity-100 group-hover:opacity-100"
            aria-label={`Delete ${project.name}`}
            title="Delete project"
          >
            <Trash2 size={12} />
          </button>
          <Link
            href={href}
            className="grid h-7 w-7 place-items-center rounded-md text-muted transition hover:bg-white/[0.07] hover:text-ink"
            aria-label={`Open ${project.name}`}
          >
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const hydrated = useHydrated();
  const projects = useAtelier((s) => s.projects);
  const order = useAtelier((s) => s.order);
  const credits = useAtelier((s) => s.credits);
  const deleteProject = useAtelier((s) => s.deleteProject);
  const addCredits = useAtelier((s) => s.addCredits);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [finalizing, setFinalizing] = useState(false);

  const list = order.map((id) => projects[id]).filter(Boolean);
  const ready = list.filter((p) => p.stage === "ready").length;
  const target = deleteId ? projects[deleteId] : null;

  const confirmDelete = () => {
    if (!deleteId) return;
    setFinalizing(true);
    setTimeout(() => {
      deleteProject(deleteId);
      setDeleteId(null);
      setFinalizing(false);
    }, 260);
  };

  return (
    <main className="relative min-h-screen pb-24">
      <div className="aurora" aria-hidden="true" />
      <div className="relative z-10">
        <PageNav active="projects" />

        <div className="mx-auto max-w-[1240px] px-4 pt-28 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted">
                <FolderOpen size={12} className="text-ember-soft" /> Your studio
              </p>
              <h1 className="font-display mt-3 text-[42px] leading-[1.02] tracking-[-0.02em] sm:text-[54px]">
                Projects in progress.
              </h1>
              <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted">
                Every brief, plan and build is kept in this browser. Open one to keep editing, or start something new.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => addCredits(40)}
                className="panel flex items-center gap-2 rounded-full px-3 py-2 text-left transition hover:border-white/20"
                title="Add 40 demo credits"
              >
                <Zap size={14} className="text-ember-soft" />
                <span>
                  <span className="block text-[12px] font-medium leading-none">{credits} credits</span>
                  <span className="mt-1 block text-[9.5px] text-faint">
                    {ready} built · {list.length} total
                  </span>
                </span>
                <Plus size={11} className="ml-1 text-faint" />
              </button>
            </div>
          </div>

          {!hydrated ? (
            <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="shimmer h-[290px] rounded-[20px]" />
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="panel relative mt-9 overflow-hidden rounded-[24px] px-6 py-16 text-center">
              <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
              <div className="relative">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-ember/30 bg-ember/[0.08] text-ember-soft">
                  <Sparkles size={22} />
                </span>
                <h2 className="font-display mt-5 text-[32px] leading-tight sm:text-[38px]">
                  Nothing on the easel <span className="text-gradient-ember">yet.</span>
                </h2>
                <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-muted">
                  Describe a site in one sentence. We&apos;ll show you the plan before a single line is written.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Link
                    href="/#prompt"
                    className="btn-ember inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-[12.5px] font-semibold"
                  >
                    Start with a brief <ArrowRight size={13} />
                  </Link>
                  <Link
                    href="/templates"
                    className="btn-ghost inline-flex h-10 items-center rounded-full px-4 text-[12px] text-muted hover:text-ink"
                  >
                    Browse templates
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((p) => (
                <ProjectCard key={p.id} project={p} onDelete={() => setDeleteId(p.id)} />
              ))}
              <Link
                href="/#prompt"
                className="group flex min-h-[260px] flex-col items-center justify-center rounded-[20px] border border-dashed border-white/12 bg-white/[0.012] p-6 text-center transition hover:border-ember/35 hover:bg-ember/[0.03]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-muted transition group-hover:border-ember/40 group-hover:text-ember-soft">
                  <Plus size={17} />
                </span>
                <p className="mt-3 text-[13px] font-medium">Start another brief</p>
                <p className="mt-1 max-w-[200px] text-[10.5px] leading-relaxed text-faint">
                  New blank canvas, plan first, build second.
                </p>
              </Link>
            </div>
          )}

          <p className="mt-8 text-[10.5px] text-faint">
            Projects are stored locally in this browser. Export a ZIP from any workspace to keep a copy.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {target && (
          <div className="fixed inset-0 z-[80] grid place-items-center p-4">
            <motion.button
              aria-label="Cancel delete"
              onClick={() => setDeleteId(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              className="panel-solid relative w-full max-w-sm rounded-[22px] border border-white/10 p-5"
              role="dialog"
              aria-modal="true"
            >
              <h2 className="text-[15px] font-medium">Delete “{target.name}”?</h2>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                The plan, files and version history for this project will be removed from this browser. This cannot be
                undone.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="btn-ghost h-9 rounded-full px-4 text-[11.5px] text-muted hover:text-ink"
                >
                  Keep it
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={finalizing}
                  className="flex h-9 items-center gap-1.5 rounded-full bg-ember px-4 text-[11.5px] font-semibold text-[#1b0b06] transition hover:brightness-105 disabled:opacity-60"
                >
                  <Trash2 size={12} /> {finalizing ? "Deleting…" : "Delete project"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
