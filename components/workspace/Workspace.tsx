"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  History,
  Pencil,
  Rocket,
  Settings2,
  Sparkles,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Chat } from "./Chat";
import { BuildRoom } from "./BuildRoom";
import { Preview } from "./Preview";
import { ActivityDrawer, SettingsDrawer, VersionsDrawer } from "./Drawers";
import { DeployModal } from "./DeployModal";
import { Logo } from "@/components/ui/Logo";
import { useAtelier, useHydrated } from "@/lib/store";
import { runBuildPipeline } from "@/lib/pipeline";
import { GENRE_LABEL } from "@/lib/engine/detect";
import { toast } from "@/lib/toast";
import type { Project, SelectionInfo } from "@/lib/types";

type DrawerId = "versions" | "activity" | "settings";

function IconButton({
  icon: Icon,
  label,
  onClick,
  badge,
  disabled,
  className = "",
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  badge?: number;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`relative grid h-8 w-8 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.02] text-muted transition hover:border-white/15 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      <Icon size={14} />
      {badge ? (
        <span className="absolute -right-1 -top-1 grid h-3.5 min-w-[14px] place-items-center rounded-full bg-ember px-1 text-[8px] font-semibold text-[#1b0b06]">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function ProjectTitle({ project }: { project: Project }) {
  const renameProject = useAtelier((s) => s.renameProject);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(project.name);

  useEffect(() => setValue(project.name), [project.name]);

  const commit = () => {
    setEditing(false);
    const clean = value.trim();
    if (clean && clean !== project.name) renameProject(project.id, clean);
    else setValue(project.name);
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setValue(project.name);
            setEditing(false);
          }
        }}
        className="w-40 rounded-md border border-ember/40 bg-black/40 px-2 py-1 text-[13px] text-ink outline-none"
        aria-label="Project name"
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="group flex min-w-0 items-center gap-1.5 text-[13px] font-medium text-ink"
      title="Rename project"
    >
      <span className="max-w-[130px] truncate sm:max-w-[240px]">{project.name}</span>
      <Pencil size={10} className="flex-none text-faint opacity-0 transition group-hover:opacity-100" />
    </button>
  );
}

export function Workspace({ id }: { id: string }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const project = useAtelier((s) => s.projects[id]);
  const credits = useAtelier((s) => s.credits);
  const applyInstruction = useAtelier((s) => s.applyInstruction);
  const deploy = useAtelier((s) => s.deploy);
  const restoreVersion = useAtelier((s) => s.restoreVersion);
  const updateProjectSettings = useAtelier((s) => s.updateProjectSettings);
  const addCredits = useAtelier((s) => s.addCredits);

  const [drawer, setDrawer] = useState<DrawerId | null>(null);
  const [deployOpen, setDeployOpen] = useState(false);
  const [selection, setSelection] = useState<SelectionInfo | null>(null);
  const [mobileView, setMobileView] = useState<"chat" | "preview">("preview");
  const [exporting, setExporting] = useState(false);
  const prevStage = useRef<Project["stage"] | undefined>(undefined);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (hydrated && project?.stage === "plan") router.replace(`/plan/${id}`);
  }, [hydrated, project?.stage, router, id]);

  useEffect(() => {
    if (hydrated && project?.stage === "building") void runBuildPipeline(id);
  }, [hydrated, project?.stage, id]);

  useEffect(() => {
    if (prevStage.current === "building" && project?.stage === "ready") {
      toast("Build complete — the reviewer signed off.", "success");
    }
    prevStage.current = project?.stage;
  }, [project?.stage]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setDrawer(null);
      setDeployOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!hydrated) {
    return (
      <div className="grid h-[100dvh] place-items-center bg-canvas">
        <div className="w-full max-w-4xl px-6">
          <div className="shimmer h-12 rounded-2xl" />
          <div className="mt-4 grid gap-3 md:grid-cols-[360px_1fr]">
            <div className="shimmer h-[60vh] rounded-[20px]" />
            <div className="shimmer h-[60vh] rounded-[20px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <main className="grid min-h-[100dvh] place-items-center px-6">
        <div className="panel max-w-md rounded-[24px] p-8 text-center">
          <Logo />
          <h1 className="font-display mt-6 text-3xl">This studio is empty.</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            That project isn&apos;t in this browser. Start a new brief or open one from your projects.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Link href="/dashboard" className="btn-ghost inline-flex h-10 items-center rounded-full px-4 text-[12px]">
              Projects
            </Link>
            <Link
              href="/#prompt"
              className="btn-ember inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[12px] font-semibold"
            >
              New brief
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (project.stage === "plan") {
    return (
      <div className="grid min-h-[100dvh] place-items-center">
        <p className="text-sm text-muted">Opening the plan…</p>
      </div>
    );
  }

  const ready = project.stage === "ready";
  const building = project.stage === "building";
  const workingCount = project.activity.filter((a) => a.status === "working").length;

  const exportZip = async () => {
    if (!project.files["index.html"] || exporting) return;
    setExporting(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      const slug = project.plan.brand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "site";
      const folder = zip.folder(slug) ?? zip;
      Object.entries(project.files).forEach(([path, content]) => folder.file(path, content));
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      const href = URL.createObjectURL(blob);
      a.href = href;
      a.download = `${slug}-atelier.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(href), 4000);
      toast(`ZIP exported · ${Object.keys(project.files).length} files`, "success");
    } catch {
      toast("The ZIP could not be generated.", "error");
    } finally {
      setExporting(false);
    }
  };

  const onDeploy = () => {
    const url = deploy(project.id);
    if (url) setDeployOpen(true);
  };

  return (
    <main className="flex h-[100dvh] flex-col overflow-hidden bg-canvas">
      <header className="flex flex-none items-center px-2.5 pt-2.5 sm:px-3">
        <div className="panel flex w-full items-center gap-2 rounded-2xl px-2 py-1.5">
          <Link
            href="/dashboard"
            className="grid h-8 w-8 flex-none place-items-center rounded-full text-muted transition hover:bg-white/[0.06] hover:text-ink"
            aria-label="Back to projects"
            title="Projects"
          >
            <ArrowLeft size={15} />
          </Link>
          <Logo compact />
          <span className="h-5 w-px flex-none bg-white/10" aria-hidden="true" />
          <ProjectTitle project={project} />
          <span className="hidden rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[9.5px] uppercase tracking-[0.1em] text-muted md:inline">
            {GENRE_LABEL[project.genre]}
          </span>
          <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[9.5px] text-muted sm:flex">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                ready ? "bg-fern" : building ? "animate-pulse bg-ember" : "bg-faint"
              }`}
            />
            {ready ? "live" : building ? "building" : "plan"}
          </span>

          <div className="ml-auto flex flex-none items-center gap-1.5">
            <button
              onClick={() => addCredits(40)}
              title="Add 40 demo credits"
              className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[10.5px] text-muted transition hover:text-ink sm:flex"
            >
              <Zap size={11} className="text-ember-soft" />
              {credits}
            </button>
            <IconButton icon={History} label="Version history" onClick={() => setDrawer("versions")} />
            <IconButton
              icon={Users}
              label="Agents & QA"
              onClick={() => setDrawer("activity")}
              badge={workingCount || undefined}
            />
            <IconButton icon={Settings2} label="Studio settings" onClick={() => setDrawer("settings")} />
            <IconButton
              icon={Download}
              label={exporting ? "Exporting…" : "Export ZIP"}
              onClick={() => void exportZip()}
              disabled={!ready || !project.files["index.html"] || exporting}
              className="hidden md:grid"
            />
            <button
              onClick={onDeploy}
              disabled={!ready}
              className="btn-ember flex h-8 items-center gap-1.5 rounded-full px-3 text-[11.5px] font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Rocket size={12} />
              Deploy
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-none justify-center px-3 pt-2 lg:hidden">
        <div className="panel flex w-full max-w-[280px] rounded-full p-0.5">
          {(["chat", "preview"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setMobileView(v)}
              className={`relative flex-1 rounded-full px-3 py-1.5 text-[11px] capitalize transition ${
                mobileView === v ? "text-ink" : "text-muted"
              }`}
            >
              {mobileView === v && (
                <motion.span
                  layoutId="mobile-view"
                  className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.08]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative flex items-center justify-center gap-1.5">
                {v === "chat" ? <Sparkles size={11} /> : <ArrowLeft size={11} className="rotate-180" />}
                {v}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-2.5 p-2.5 sm:p-3">
        <aside
          className={`panel min-h-0 w-full flex-none overflow-hidden rounded-[20px] lg:flex lg:w-[360px] xl:w-[390px] ${
            mobileView === "chat" ? "flex" : "hidden"
          }`}
        >
          <Chat project={project} onApply={(text, sel) => applyInstruction(project.id, text, sel)} selection={selection} onClearSelection={() => setSelection(null)} />
        </aside>

        <div className={`min-h-0 min-w-0 flex-1 ${mobileView === "preview" ? "flex" : "hidden"} lg:flex`}>
          <AnimatePresence mode="wait" initial={false}>
            {ready ? (
              <motion.div
                key="preview"
                initial={reduce ? false : { opacity: 0, scale: 0.995 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex min-h-0 w-full flex-col"
              >
                <Preview project={project} selection={selection} setSelection={setSelection} />
              </motion.div>
            ) : (
              <motion.div
                key="build"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.995 }}
                transition={{ duration: 0.3 }}
                className="panel min-h-0 w-full flex-1 overflow-hidden rounded-[20px]"
              >
                <BuildRoom project={project} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ActivityDrawer project={project} open={drawer === "activity"} onClose={() => setDrawer(null)} />
      <VersionsDrawer
        project={project}
        open={drawer === "versions"}
        onClose={() => setDrawer(null)}
        onRestore={(versionId) => restoreVersion(project.id, versionId)}
      />
      <SettingsDrawer
        project={project}
        open={drawer === "settings"}
        onClose={() => setDrawer(null)}
        onUpdate={(patch) => updateProjectSettings(project.id, patch)}
      />
      <DeployModal
        open={deployOpen}
        onClose={() => setDeployOpen(false)}
        project={project}
        url={project.deployed?.url ?? null}
        subdomain={project.deployed?.subdomain ?? null}
      />
    </main>
  );
}
