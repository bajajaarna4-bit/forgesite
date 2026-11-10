"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  Code2,
  Copy,
  Database,
  ExternalLink,
  Eye,
  FileCode2,
  FileText,
  FolderTree,
  Loader2,
  Monitor,
  MousePointerClick,
  RotateCw,
  Smartphone,
  Tablet,
} from "lucide-react";
import { assembleSite, fileSize } from "@/lib/engine/build";
import { qaScore } from "@/lib/engine/qa";
import { useDebounced } from "@/lib/use-debounced";
import { toast } from "@/lib/toast";
import type { Project, SelectionInfo } from "@/lib/types";

type Tab = "preview" | "code" | "files" | "data";
type Device = "desktop" | "tablet" | "mobile";

const TABS: { id: Tab; label: string; icon: typeof Eye }[] = [
  { id: "preview", label: "Preview", icon: Eye },
  { id: "code", label: "Code", icon: Code2 },
  { id: "files", label: "Files", icon: FolderTree },
  { id: "data", label: "Database", icon: Database },
];

const DEVICES: { id: Device; label: string; icon: typeof Monitor; width?: number }[] = [
  { id: "desktop", label: "Desktop", icon: Monitor },
  { id: "tablet", label: "Tablet", icon: Tablet, width: 820 },
  { id: "mobile", label: "Mobile", icon: Smartphone, width: 390 },
];

function shortSelector(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  for (let depth = 0; node && depth < 3; depth++) {
    const tag = node.tagName.toLowerCase();
    const classes = [...node.classList].slice(0, 2);
    let part = tag;
    if (node.id) part = `#${node.id}`;
    else if (classes.length) part += `.${classes.join(".")}`;
    else {
      const parent = node.parentElement;
      if (parent) {
        const same = [...parent.children].filter((c) => c.tagName === node!.tagName);
        if (same.length > 1) part += `:nth-of-type(${same.indexOf(node) + 1})`;
      }
    }
    parts.unshift(part);
    if (node.id) break;
    node = node.parentElement;
  }
  return parts.join(" ");
}

function bytesOf(files: Record<string, string>) {
  return Object.values(files).reduce((sum, content) => sum + new TextEncoder().encode(content).length, 0);
}

function bytesLabel(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function Preview({
  project,
  selection,
  setSelection,
}: {
  project: Project;
  selection: SelectionInfo | null;
  setSelection: (selection: SelectionInfo | null) => void;
}) {
  const [tab, setTab] = useState<Tab>("preview");
  const [device, setDevice] = useState<Device>("desktop");
  const [editMode, setEditMode] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const [activeFile, setActiveFile] = useState("index.html");
  const [copied, setCopied] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const editRef = useRef(false);
  const hoveredRef = useRef<HTMLElement | null>(null);
  const selectedRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  const html = useMemo(() => assembleSite(project.files), [project.files]);
  const deferred = useDebounced(html, 240);
  const [shown, setShown] = useState(deferred);
  const [refreshing, setRefreshing] = useState(false);

  const setSelected = (el: HTMLElement | null) => {
    if (selectedRef.current) {
      selectedRef.current.style.outline = "";
      selectedRef.current.style.outlineOffset = "";
    }
    selectedRef.current = el;
    if (el) {
      el.style.outline = "2px solid #8b93ff";
      el.style.outlineOffset = "2px";
    }
  };

  useEffect(() => {
    editRef.current = editMode;
    if (!editMode) {
      if (hoveredRef.current) {
        hoveredRef.current.style.outline = "";
        hoveredRef.current.style.outlineOffset = "";
        hoveredRef.current = null;
      }
      setSelection(null);
    }
  }, [editMode, setSelection]);

  useEffect(() => {
    if (deferred === shown) return;
    setRefreshing(true);
    const t = setTimeout(() => {
      setLoaded(false);
      setShown(deferred);
      setSelected(null);
      setRefreshing(false);
    }, 320);
    return () => clearTimeout(t);
  }, [deferred, shown]);

  useEffect(() => {
    if (!selection) setSelected(null);
  }, [selection]);

  const onFrameLoad = () => {
    setLoaded(true);
    const doc = frameRef.current?.contentDocument;
    if (!doc || (doc as Document & { __atelierBound?: boolean }).__atelierBound) return;
    (doc as Document & { __atelierBound?: boolean }).__atelierBound = true;

    const onMove = (e: MouseEvent) => {
      if (!editRef.current) return;
      const el = e.target as HTMLElement | null;
      if (!el || el === hoveredRef.current) return;
      if (hoveredRef.current) {
        hoveredRef.current.style.outline = "";
        hoveredRef.current.style.outlineOffset = "";
      }
      hoveredRef.current = el;
      if (el !== selectedRef.current) {
        el.style.outline = "2px dashed rgba(255,106,61,.65)";
        el.style.outlineOffset = "2px";
      }
      el.style.cursor = "crosshair";
    };

    const onClick = (e: MouseEvent) => {
      if (!editRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      const el = e.target as HTMLElement | null;
      if (!el) return;
      setSelected(el);
      setSelection({
        selector: shortSelector(el).slice(0, 180),
        tag: el.tagName.toLowerCase(),
        classes: el.className?.toString?.().slice(0, 100) ?? "",
        text: (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 90),
      });
    };

    doc.addEventListener("mousemove", onMove, true);
    doc.addEventListener("click", onClick, true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && editMode) setEditMode(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editMode]);

  const refresh = () => {
    setFrameKey((k) => k + 1);
    setLoaded(false);
    setSelected(null);
  };

  const files = Object.keys(project.files);
  const ordered = ["index.html", ...files.filter((f) => f !== "index.html")];
  const current = project.files[activeFile] ?? "";
  const lines = current.split("\n");
  const total = bytesOf(project.files);
  const qa = qaScore(project.qa);
  const deviceWidth = DEVICES.find((d) => d.id === device)?.width;

  const copyFile = async () => {
    try {
      await navigator.clipboard.writeText(current);
      setCopied(true);
      toast(`Copied ${activeFile}`, "success");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast("Clipboard is blocked in this browser.", "error");
    }
  };

  const fileIcon = (name: string) =>
    name.endsWith(".html") ? (
      <FileCode2 size={13} className="text-ember-soft" />
    ) : name.endsWith(".css") ? (
      <Code2 size={13} className="text-iris" />
    ) : name.endsWith(".js") ? (
      <Code2 size={13} className="text-ember-soft" />
    ) : (
      <FileText size={13} className="text-faint" />
    );

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-2.5">
      <div className="panel flex flex-wrap items-center gap-1.5 rounded-2xl p-1.5">
        <div className="relative flex items-center gap-0.5">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`relative flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11.5px] transition ${
                  active ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="workspace-tab"
                    className="absolute inset-0 rounded-lg border border-white/10 bg-white/[0.08]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Icon size={13} className="relative" />
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          {tab === "preview" && (
            <>
              <div className="flex items-center gap-0.5 rounded-lg border border-white/[0.07] bg-white/[0.02] p-0.5">
                {DEVICES.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setDevice(id)}
                    className={`grid h-7 w-7 place-items-center rounded-md transition ${
                      device === id ? "bg-white/[0.1] text-ink" : "text-faint hover:text-muted"
                    }`}
                    title={`${label} preview`}
                    aria-label={`${label} preview`}
                    aria-pressed={device === id}
                  >
                    <Icon size={13} />
                  </button>
                ))}
              </div>
              <button
                onClick={() => setEditMode((v) => !v)}
                className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] transition ${
                  editMode
                    ? "border-iris/40 bg-iris/[0.12] text-iris"
                    : "border-white/[0.07] bg-white/[0.02] text-muted hover:text-ink"
                }`}
                aria-pressed={editMode}
                title="Click any element to scope an edit"
              >
                <MousePointerClick size={13} /> Select
              </button>
              <button
                onClick={refresh}
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.02] text-muted transition hover:text-ink"
                title="Reload preview"
                aria-label="Reload preview"
              >
                <RotateCw size={12} className={refreshing ? "animate-spin" : ""} />
              </button>
            </>
          )}
          <span className="hidden items-center gap-1 rounded-full border border-white/[0.07] px-2 py-1 font-mono text-[9.5px] text-faint sm:flex">
            QA {qa}
          </span>
          <Link
            href={`/s/${project.id}`}
            target="_blank"
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.02] text-muted transition hover:text-ink"
            title="Open preview in a new tab"
            aria-label="Open preview in a new tab"
          >
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      <div className="panel relative min-h-0 flex-1 overflow-hidden rounded-[20px]">
        <AnimatePresence mode="wait" initial={false}>
          {tab === "preview" && (
            <motion.div
              key="preview"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-full min-h-0 flex-col"
            >
              <div className="checker relative flex min-h-0 flex-1 justify-center overflow-auto p-2.5 sm:p-3.5">
                <div
                  className="relative h-full overflow-hidden rounded-xl border border-white/10 bg-white shadow-[0_30px_80px_-40px_rgba(0,0,0,.9)] transition-[width] duration-500"
                  style={{ width: deviceWidth ? `min(${deviceWidth}px, 100%)` : "100%" }}
                >
                  {(!loaded || refreshing) && (
                    <div className="absolute inset-0 z-10 grid place-items-center bg-[#0b0d12]/70 backdrop-blur-sm">
                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] text-muted">
                        <Loader2 size={12} className="animate-spin text-ember-soft" />
                        {refreshing ? "Applying change…" : `Rendering ${project.plan.brand.name}…`}
                      </div>
                    </div>
                  )}
                  <iframe
                    key={`${frameKey}-${device}`}
                    ref={frameRef}
                    title={`${project.plan.brand.name} preview`}
                    srcDoc={shown}
                    onLoad={onFrameLoad}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    className="block h-full w-full bg-white"
                  />
                  {editMode && (
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center p-2">
                      <span className="flex items-center gap-1.5 rounded-full border border-iris/40 bg-[#0b0d12]/90 px-2.5 py-1 text-[10px] text-iris shadow-lg">
                        <MousePointerClick size={10} /> Click an element to scope your edit · Esc to exit
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {tab === "code" && (
            <motion.div
              key="code"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="flex h-full min-h-0 flex-col"
            >
              <div className="scroll-thin flex items-center gap-0.5 overflow-x-auto border-b border-white/[0.06] bg-black/20 px-2 py-1.5">
                {ordered.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFile(f)}
                    className={`flex flex-none items-center gap-1.5 rounded-md px-2 py-1.5 font-mono text-[10.5px] transition ${
                      activeFile === f ? "bg-white/[0.08] text-ink" : "text-faint hover:bg-white/[0.04] hover:text-muted"
                    }`}
                  >
                    {fileIcon(f)}
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-3.5 py-2">
                <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] text-faint">
                  <span className="truncate text-muted">{activeFile}</span>
                  <span>·</span>
                  <span>{lines.length} lines</span>
                  <span>·</span>
                  <span>{fileSize(current)}</span>
                </div>
                <button
                  onClick={() => void copyFile()}
                  className="flex items-center gap-1.5 rounded-md border border-white/[0.07] px-2 py-1 text-[10px] text-muted hover:text-ink"
                >
                  {copied ? <Check size={10} className="text-fern" /> : <Copy size={10} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="scroll-thin min-h-0 flex-1 overflow-auto bg-[#08090c] py-2">
                <pre className="min-w-max font-mono text-[11px] leading-[1.65] text-[#c7ccd6]">
                  {lines.map((line, i) => (
                    <div key={i} className="flex px-3 hover:bg-white/[0.02]">
                      <span className="w-9 flex-none select-none pr-3 text-right text-[9.5px] text-white/20">{i + 1}</span>
                      <code className="whitespace-pre">{line || " "}</code>
                    </div>
                  ))}
                </pre>
              </div>
            </motion.div>
          )}

          {tab === "files" && (
            <motion.div
              key="files"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="flex h-full min-h-0 flex-col"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <div>
                  <p className="text-[12px] font-medium">Project files</p>
                  <p className="text-[10.5px] text-faint">
                    {ordered.length} files · {bytesLabel(total)} · no build step
                  </p>
                </div>
                <span className="rounded-full border border-white/[0.07] px-2 py-0.5 font-mono text-[9.5px] text-faint">
                  plain HTML · CSS · JS
                </span>
              </div>
              <div className="scroll-thin min-h-0 flex-1 overflow-y-auto p-2">
                {ordered.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setActiveFile(f);
                      setTab("code");
                    }}
                    className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-white/[0.04]"
                  >
                    <span className="grid h-7 w-7 flex-none place-items-center rounded-md border border-white/[0.06] bg-white/[0.03]">
                      {fileIcon(f)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-[11.5px] text-ink/90">{f}</span>
                      <span className="block text-[10px] text-faint">
                        {f === "index.html"
                          ? "Document, markup and page sections"
                          : f.includes("tokens")
                            ? "Palette, type scale and base primitives"
                            : f.includes("site")
                              ? "Layout and component styles"
                              : f.endsWith(".js")
                                ? "Interaction layer"
                                : "Project readme"}
                      </span>
                    </span>
                    <span className="font-mono text-[10px] text-faint">{fileSize(project.files[f] ?? "")}</span>
                  </button>
                ))}
                <p className="px-3 pt-3 text-[10.5px] leading-relaxed text-faint">
                  Editing happens through chat, so files stay consistent. Open the Code tab to read exactly what the
                  agents wrote.
                </p>
              </div>
            </motion.div>
          )}

          {tab === "data" && (
            <motion.div
              key="data"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="scroll-thin h-full min-h-0 overflow-y-auto p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-iris/20 bg-iris/[0.05] px-3.5 py-3">
                <div>
                  <p className="text-[12px] font-medium">Backend seam</p>
                  <p className="text-[10.5px] text-faint">
                    Schema written by the Backend agent · local preview keeps state in the browser
                  </p>
                </div>
                <span className="rounded-full border border-amber-300/25 bg-amber-300/[0.07] px-2 py-0.5 text-[9.5px] text-amber-200/80">
                  not connected
                </span>
              </div>

              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {project.plan.database.map((table) => (
                  <div key={table.table} className="overflow-hidden rounded-xl border border-white/[0.07]">
                    <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.025] px-3 py-2">
                      <span className="font-mono text-[11px] text-ink">{table.table}</span>
                      <span className="text-[9.5px] text-faint">{table.columns.length} columns</span>
                    </div>
                    <ul className="divide-y divide-white/[0.04]">
                      {table.columns.map((c) => (
                        <li key={c.name} className="flex items-center gap-3 px-3 py-1.5">
                          <span className="w-32 flex-none truncate font-mono text-[10.5px] text-muted">{c.name}</span>
                          <span className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] text-faint">{c.type}</span>
                          {c.note && <span className="truncate text-[9.5px] text-faint">{c.note}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {[
                  ["Auth", "Email + magic link", "Supabase"],
                  ["Storage", "Project media bucket", "Supabase"],
                  ["Runtime", "Static HTML, CSS, JS", "No server"],
                ].map(([label, value, tag]) => (
                  <div key={label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="text-[9.5px] uppercase tracking-[0.16em] text-faint">{label}</p>
                    <p className="mt-1 text-[11.5px] text-muted">{value}</p>
                    <p className="mt-0.5 font-mono text-[9px] text-faint">{tag}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10.5px] leading-relaxed text-faint">
                The generated site is deliberately static. Connect a Supabase project later and the schema above is
                ready to migrate — no fake records are shown here.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
