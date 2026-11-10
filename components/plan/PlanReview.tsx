"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CreditCard,
  Database,
  Layers,
  Plus,
  RefreshCw,
  Rocket,
  Sparkles,
  Type,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { BUILD_COST, useAtelier, useHydrated } from "@/lib/store";
import { assembleSite, buildSite, GENRE_ACCENTS } from "@/lib/engine/build";
import { GENRE_LABEL } from "@/lib/engine/detect";
import { toast } from "@/lib/toast";
import { useDebounced } from "@/lib/use-debounced";
import type { BuildOptions } from "@/lib/types";

function Card({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      className={`panel rounded-[20px] ${className}`}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}

function CardHead({
  icon: Icon,
  label,
  aside,
}: {
  icon: typeof Layers;
  label: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-3.5">
      <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        <Icon size={13} className="text-faint" />
        {label}
      </span>
      {aside}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-28">
      <div className="shimmer h-4 w-32 rounded-full" />
      <div className="shimmer mt-5 h-12 w-2/3 rounded-2xl" />
      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_440px]">
        <div className="space-y-5">
          <div className="shimmer h-48 rounded-[20px]" />
          <div className="shimmer h-64 rounded-[20px]" />
        </div>
        <div className="shimmer h-[560px] rounded-[20px]" />
      </div>
    </div>
  );
}

export function PlanReview({ id }: { id: string }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const project = useAtelier((s) => s.projects[id]);
  const credits = useAtelier((s) => s.credits);
  const updateOptions = useAtelier((s) => s.updateOptions);
  const regeneratePlan = useAtelier((s) => s.regeneratePlan);
  const approveBuild = useAtelier((s) => s.approveBuild);
  const addCredits = useAtelier((s) => s.addCredits);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [approving, setApproving] = useState(false);

  const preview = useMemo(() => {
    if (!project) return null;
    try {
      return buildSite(project.prompt, project.genre, project.options, project.seedSalt);
    } catch {
      return null;
    }
  }, [project?.prompt, project?.genre, project?.options, project?.seedSalt]);

  const html = useMemo(() => (preview ? assembleSite(preview.files) : ""), [preview]);
  const debouncedHtml = useDebounced(html, 280);

  useEffect(() => {
    setFrameLoaded(false);
  }, [debouncedHtml]);

  useEffect(() => {
    if (project && project.stage !== "plan") router.replace(`/workspace/${id}`);
  }, [project, router, id]);

  if (!hydrated) return <Skeleton />;

  if (!project) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <div className="panel max-w-md rounded-[24px] p-8 text-center">
          <Logo />
          <h1 className="font-display mt-6 text-3xl">That plan has left the studio.</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Plans live in this browser&apos;s local storage. Start a new brief and we&apos;ll shape another one.
          </p>
          <Link
            href="/#prompt"
            className="btn-ember mt-6 inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold"
          >
            Start a new brief <ArrowRight size={15} />
          </Link>
        </div>
      </main>
    );
  }

  if (project.stage !== "plan") {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="flex items-center gap-2 text-sm text-muted">
          <RefreshCw size={14} className="animate-spin" /> Opening the build room…
        </p>
      </div>
    );
  }

  const { plan, options, genre } = project;
  const accents = GENRE_ACCENTS[genre];
  const canApprove = credits >= BUILD_COST;

  const approve = () => {
    setApproving(true);
    const result = approveBuild(id);
    if (result.ok) {
      router.push(`/workspace/${id}`);
      return;
    }
    setApproving(false);
    toast(result.message ?? "Could not approve this plan.", "error");
  };

  const patch = (p: Partial<BuildOptions>) => updateOptions(id, p);

  const toggleSection = (section: string) => {
    const set = new Set(options.sections);
    if (set.has(section)) set.delete(section);
    else set.add(section);
    patch({ sections: [...set] });
  };

  return (
    <main className="relative min-h-screen overflow-x-clip pb-20">
      <div className="aurora" aria-hidden="true" />
      <div className="relative z-10">
        <header className="fixed inset-x-0 top-3 z-40 px-3 sm:px-5">
          <div className="panel mx-auto flex max-w-[1460px] items-center gap-2.5 rounded-2xl px-2.5 py-2">
            <Link
              href="/"
              className="btn-ghost grid h-9 w-9 place-items-center rounded-full text-muted hover:text-ink"
              aria-label="Back to Atelier"
            >
              <ArrowLeft size={15} />
            </Link>
            <Logo compact />
            <span className="hidden items-center gap-2 sm:flex">
              <span className="text-faint">/</span>
              <span className="max-w-[220px] truncate text-sm font-medium text-ink">{project.name}</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
                Plan review
              </span>
            </span>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-muted sm:flex">
                <CreditCard size={13} className="text-ember-soft" />
                {credits} credits
              </span>
              <button
                onClick={approve}
                disabled={approving}
                className="btn-ember inline-flex h-9 items-center gap-2 rounded-full px-4 text-[13px] font-semibold disabled:opacity-60"
              >
                <Rocket size={14} />
                {approving ? "Opening…" : "Approve & build"}
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1460px] px-4 pt-24 sm:px-5 sm:pt-28">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted">
                <Sparkles size={12} className="text-ember-soft" />
                {GENRE_LABEL[genre]} · Plan 01
              </p>
              <h1 className="font-display mt-3 text-balance text-[42px] leading-[1.02] tracking-[-0.02em] sm:text-[56px]">
                Here&apos;s what we&apos;ll <span className="text-gradient-ember">build.</span>
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
                {plan.brand.name} — {plan.brand.tagline.replace(/\.\s*$/, "")}. Read the pages, adjust the palette
                and roundness, then
                hand it to the agents. Everything on the right is real output from the engine, not a mockup.
              </p>
            </div>
            <button
              onClick={() => {
                regeneratePlan(id);
                toast("A fresh direction, same brief.", "success");
              }}
              className="btn-ghost inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-medium text-muted hover:text-ink"
            >
              <RefreshCw size={14} /> Regenerate
            </button>
          </div>

          <div className="mt-8 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_460px]">
            <div className="space-y-5">
              <Card delay={0.02}>
                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start">
                  <span
                    className="grid h-16 w-16 flex-none place-items-center rounded-[18px] text-[22px] font-semibold text-ink"
                    style={{
                      background: `linear-gradient(145deg, ${plan.design.palette[4].hex}33, rgba(255,255,255,.04))`,
                      border: `1px solid ${plan.design.palette[4].hex}55`,
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,.16), 0 18px 40px -22px ${plan.design.palette[4].hex}88`,
                    }}
                    aria-hidden="true"
                  >
                    {plan.brand.monogram}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-display text-[28px] leading-tight">{plan.brand.name}</h2>
                    <p className="mt-1 text-sm text-muted">{plan.brand.tagline}</p>
                    <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-faint">{plan.positioning}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {plan.features.slice(0, 5).map((f) => (
                        <span key={f} className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[11px] text-muted">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/[0.06] px-5 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-faint">Your brief</p>
                    <span className="font-mono text-[10px] text-faint">{project.prompt.trim().split(/\s+/).length} words</span>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">“{project.prompt}”</p>
                </div>
              </Card>

              <Card delay={0.05}>
                <CardHead icon={Layers} label="Pages & sections" aside={<span className="font-mono text-[10px] text-faint">{plan.pages.length} views</span>} />
                <ul className="divide-y divide-white/[0.05]">
                  {plan.pages.map((page) => (
                    <li key={page.name} className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-start sm:gap-5">
                      <div className="flex w-full items-center gap-2 sm:w-52 sm:flex-none">
                        <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                        <span className="text-sm font-medium">{page.name}</span>
                        <code className="ml-auto font-mono text-[10px] text-faint sm:ml-0">{page.route}</code>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {page.sections.map((s) => (
                          <span key={s} className="rounded-md border border-white/[0.07] bg-white/[0.025] px-2 py-0.5 text-[10.5px] text-muted">
                            {s}
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>

              <div className="grid gap-5 md:grid-cols-2">
                <Card delay={0.08}>
                  <CardHead icon={Type} label="Type & motion" />
                  <div className="flex flex-col gap-4 p-5">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-faint">Display — {plan.design.fonts.display}</p>
                      <p className="font-display mt-1 text-[34px] leading-none">Aa quiet room</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-faint">Body — {plan.design.fonts.body}</p>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
                        Clear, plain copy at 16px with a 1.55 line height. Nothing decorative where it costs legibility.
                      </p>
                    </div>
                    <div className="mt-auto border-t border-white/[0.06] pt-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-faint">Motion</p>
                      <ul className="mt-2 space-y-1.5">
                        {plan.design.motion.map((m) => (
                          <li key={m} className="flex items-start gap-2 text-[12px] text-muted">
                            <Check size={12} className="mt-0.5 flex-none text-fern" /> {m}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 flex items-end gap-1.5 border-t border-white/[0.06] pt-3">
                        {[8, 12, 16, 24, 32].map((n) => (
                          <span
                            key={n}
                            className="rounded bg-white/[0.07]"
                            style={{ width: n, height: n }}
                            title={`${n}px spacing`}
                          />
                        ))}
                        <span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-faint">
                          8px rhythm · {plan.design.radius}px radius
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card delay={0.11}>
                  <CardHead icon={Database} label="Data shape" />
                  <div className="space-y-3 p-5">
                    {plan.database.map((table) => (
                      <div key={table.table} className="overflow-hidden rounded-xl border border-white/[0.07]">
                        <div className="flex items-center justify-between bg-white/[0.035] px-3 py-2">
                          <span className="font-mono text-[11px] text-ink">{table.table}</span>
                          <span className="text-[10px] text-faint">{table.columns.length} fields</span>
                        </div>
                        <ul className="divide-y divide-white/[0.04]">
                          {table.columns.slice(0, 5).map((c) => (
                            <li key={c.name} className="flex items-center justify-between gap-3 px-3 py-1.5">
                              <span className="font-mono text-[10.5px] text-muted">{c.name}</span>
                              <span className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9.5px] text-faint">{c.type}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <p className="text-[11px] leading-relaxed text-faint">
                      The build ships a Supabase-shaped seam. No credentials are needed for the local preview.
                    </p>
                  </div>
                </Card>
              </div>

              <Card delay={0.14}>
                <CardHead icon={Sparkles} label="Components" aside={<span className="font-mono text-[10px] text-faint">{plan.components.length}</span>} />
                <div className="grid gap-x-6 gap-y-3 p-5 sm:grid-cols-2">
                  {plan.components.map((c) => (
                    <div key={c.name} className="flex items-start gap-2.5">
                      <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-iris/80" />
                      <div>
                        <p className="text-[12.5px] font-medium">{c.name}</p>
                        <p className="text-[11.5px] leading-relaxed text-faint">{c.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 border-t border-white/[0.06] px-5 py-3">
                  {plan.stack.map((s) => (
                    <span key={s} className="rounded-full border border-white/[0.08] px-2.5 py-0.5 text-[10.5px] text-muted">
                      {s}
                    </span>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-4 lg:sticky lg:top-20">
              <div className="panel overflow-hidden rounded-[20px]">
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
                  <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fern opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-fern" />
                    </span>
                    Live preview
                  </span>
                  <span className="font-mono text-[10px] text-faint">engine · {GENRE_LABEL[genre].toLowerCase()}</span>
                </div>
                <div className="preview-shell relative">
                  {!frameLoaded && <div className="shimmer absolute inset-0 z-10" aria-hidden="true" />}
                  {debouncedHtml ? (
                    <iframe
                      title={`${plan.brand.name} live plan preview`}
                      srcDoc={debouncedHtml}
                      onLoad={() => setFrameLoaded(true)}
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      className="block h-[420px] w-full bg-white"
                    />
                  ) : (
                    <div className="grid h-[420px] place-items-center text-xs text-faint">Preview unavailable</div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-4 py-2.5">
                  <span className="truncate font-mono text-[10px] text-faint">
                    {plan.brand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.atelier.site
                  </span>
                  <Link href={`/s/${id}`} className="flex items-center gap-1 text-[11px] text-muted hover:text-ink">
                    Open full <ChevronRight size={12} />
                  </Link>
                </div>
              </div>

              <div className="panel rounded-[20px] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">Design direction</p>
                  <span className="font-mono text-[10px] text-faint">{plan.design.palette[4].hex}</span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {accents.map((a, i) => {
                    const active = options.palette === i;
                    return (
                      <button
                        key={a.name}
                        onClick={() => patch({ palette: i })}
                        aria-pressed={active}
                        className={`group relative rounded-xl border p-2.5 text-left transition ${
                          active
                            ? "border-white/25 bg-white/[0.07]"
                            : "border-white/[0.07] bg-white/[0.02] hover:border-white/15"
                        }`}
                      >
                        <span
                          className="block h-9 w-full rounded-lg"
                          style={{ background: a.hex, boxShadow: `0 8px 24px -12px ${a.hex}` }}
                        />
                        <span className="mt-2 flex items-center justify-between gap-1">
                          <span className="text-[11px] font-medium">{a.name}</span>
                          {active && <Check size={11} className="text-fern" />}
                        </span>
                        <span className="mt-0.5 block font-mono text-[9px] uppercase text-faint">{a.hex}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted">Corner roundness</span>
                    <span className="font-mono text-faint">{options.radius}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={32}
                    step={2}
                    value={options.radius}
                    onChange={(e) => patch({ radius: Number(e.target.value) })}
                    className="range mt-2 w-full"
                    aria-label="Corner roundness"
                  />
                </div>

                {genre === "streaming" && (
                  <div className="mt-4">
                    <p className="text-[11px] text-muted">Optional home rails</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {[
                        { id: "top10", label: "Top 10" },
                        { id: "collection", label: "Curated collection" },
                      ].map((s) => {
                        const on = options.sections.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            onClick={() => toggleSection(s.id)}
                            aria-pressed={on}
                            className={`rounded-full border px-3 py-1.5 text-[11px] transition ${
                              on
                                ? "border-ember/40 bg-ember/10 text-ember-soft"
                                : "border-white/10 bg-white/[0.02] text-muted hover:border-white/20"
                            }`}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex gap-1.5 border-t border-white/[0.06] pt-3">
                  {plan.design.palette.map((p) => (
                    <span key={p.name} className="group relative">
                      <span
                        className="block h-5 w-5 rounded-full border border-white/15"
                        style={{ background: p.hex }}
                        title={`${p.name} ${p.hex}`}
                      />
                    </span>
                  ))}
                  <span className="ml-auto flex items-center gap-1 text-[10px] text-faint">
                    Extracted from the built tokens
                  </span>
                </div>
              </div>

              <div className="panel rounded-[20px] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Ready when you are.</p>
                    <p className="mt-0.5 text-[11.5px] text-faint">
                      {BUILD_COST} credits · about 8 seconds · six agents
                    </p>
                  </div>
                  <button
                    onClick={() => addCredits(40)}
                    className="btn-ghost inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-[11px] text-muted hover:text-ink"
                    title="Add demo credits"
                  >
                    <Plus size={12} /> 40
                  </button>
                </div>
                <button
                  onClick={approve}
                  disabled={approving || !canApprove}
                  className="btn-ember mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Rocket size={15} />
                  {canApprove ? "Approve & build" : `Need ${BUILD_COST} credits`}
                </button>
                <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10.5px] text-faint">
                  <CreditCard size={11} /> {credits} credits available
                  <span className="text-white/15">·</span>
                  <span>edits cost 2</span>
                </div>
              </div>

              <p className="px-1 text-[11px] leading-relaxed text-faint">
                The preview is generated locally by the deterministic engine — the same files the agents will write.
                Connect a model in settings later without changing this flow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
