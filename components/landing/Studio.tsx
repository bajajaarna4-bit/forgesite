"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useReducedMotion,
} from "framer-motion";
import { Check, FileCode2, GitBranch, Lock, Sparkles } from "lucide-react";
import { MiniSite } from "@/components/previews/MiniSite";

const STEPS = [
  {
    k: "01",
    title: "A brief, not a form",
    body: "Write the way you talk. Atelier reads genre, mood and the one job the site has to do.",
  },
  {
    k: "02",
    title: "The plan you approve",
    body: "Sitemap, sections, palette, type pairing and data shape — all visible before code.",
  },
  {
    k: "03",
    title: "Six agents, in the open",
    body: "Planner hands to Designer, then Frontend, Backend, QA and Reviewer. Every step is logged.",
  },
  {
    k: "04",
    title: "Tested, then handed over",
    body: "Real checks catch contrast, alt text and layout shift. Export the files or publish them.",
  },
];

const AGENTS = [
  { name: "Planner", detail: "Sitemap and sections", pct: 100, tone: "#ffb020" },
  { name: "Designer", detail: "Palette and type", pct: 100, tone: "#ff6a3d" },
  { name: "Frontend", detail: "5 files written", pct: 100, tone: "#8f9dff" },
  { name: "Backend", detail: "Schema drafted", pct: 100, tone: "#4fd1a5" },
  { name: "QA", detail: "Fixing contrast and sizes", pct: 64, tone: "#f0d16a" },
  { name: "Reviewer", detail: "Queued", pct: 0, tone: "#c9a4ff" },
];

function Scene({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="panel mx-auto w-full max-w-md rounded-3xl p-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">Your brief</span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] text-muted">
            Reads as Streaming
          </span>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-ink">
          A moody streaming service for independent cinema, with a rotating hero, a continue-watching
          rail and a title modal.
          <span className="ml-0.5 inline-block h-[1.05em] w-[1.5px] translate-y-[3px] animate-pulse bg-ember" />
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {["Streaming", "Cinematic", "Dark", "Curated"].map((chip) => (
            <span key={chip} className="chip rounded-full px-2.5 py-1 text-[10px] text-muted">
              {chip}
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3">
          <span className="text-[10px] text-faint">Planner is reading…</span>
          <span className="btn-ember rounded-full px-3.5 py-1.5 text-[11px] font-semibold">Craft</span>
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="panel w-full max-w-md rounded-3xl p-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-faint">The plan</span>
          <span className="flex items-center gap-1 rounded-full bg-fern/10 px-2 py-0.5 text-[9px] text-fern">
            <Check size={9} /> Ready to approve
          </span>
        </div>
        <div className="mt-4 space-y-1.5">
          {[
            ["Home", "Hero · rails · collection"],
            ["Browse", "Filters · grids"],
            ["Title", "Modal · episodes"],
          ].map(([page, meta]) => (
            <div key={page} className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-ember/80" />
              <span className="text-[12px] text-ink">{page}</span>
              <span className="ml-auto text-[9.5px] text-faint">{meta}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="mb-1.5 text-[9px] uppercase tracking-[0.16em] text-faint">Palette</div>
          <div className="flex gap-1.5">
            {["#08080A", "#E3A342", "#191A1E", "#ECECEC", "#3B3020"].map((c) => (
              <span key={c} className="h-7 flex-1 rounded-lg ring-1 ring-inset ring-white/10" style={{ background: c }} />
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] text-faint">
          <span>Sora · Manrope</span>
          <span>12px radius</span>
          <span>Reduced-motion ready</span>
        </div>
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className="grid w-full max-w-md gap-2.5">
        <div className="panel rounded-2xl p-3.5">
          <div className="mb-2 flex items-center justify-between text-[10px] text-faint">
            <span className="uppercase tracking-[0.16em]">Agent activity</span>
            <span className="text-fern">3 done · 1 working</span>
          </div>
          <div className="space-y-1.5">
            {AGENTS.map((agent) => (
              <div key={agent.name} className="flex items-center gap-2">
                <span
                  className="grid h-5 w-5 place-items-center rounded-md text-[8px] font-bold text-black/70"
                  style={{ background: agent.tone }}
                >
                  {agent.name[0]}
                </span>
                <span className="w-[70px] text-[10.5px] text-ink/85">{agent.name}</span>
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.span
                    className="block h-full rounded-full"
                    style={{ background: agent.tone, opacity: 0.85 }}
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.pct}%` }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  />
                </span>
                <span className="w-[104px] truncate text-right text-[9px] text-faint">{agent.detail}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel rounded-2xl p-3">
          <div className="mb-2 flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.14em] text-faint">
            <FileCode2 size={11} /> index.html · styles/site.css
          </div>
          <div className="space-y-1 font-mono text-[10px] leading-relaxed">
            <div className="text-faint">
              <span className="text-[#8f9dff]">&lt;section</span> class=<span className="text-[#ffb020]">&quot;hero&quot;</span>
              <span className="text-[#8f9dff]">&gt;</span>
            </div>
            <div className="pl-3 text-muted">&lt;h1 class=&quot;display&quot;&gt;The Long Night&lt;/h1&gt;</div>
            <div className="pl-3 text-muted">&lt;button class=&quot;btn btn--primary&quot;&gt;Play&lt;/button&gt;</div>
            <div className="text-faint">
              <span className="text-[#8f9dff]">&lt;/section&gt;</span>
              <span className="ml-1 inline-block h-3 w-[1.5px] animate-pulse bg-ember align-middle" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <MiniSite genre="streaming" />
      <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5">
        <span className="flex items-center gap-2 text-[11px] text-ink/80">
          <span className="h-1.5 w-1.5 rounded-full bg-fern" />
          nocturne-film.vercel.app
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-faint">
          <Lock size={10} /> Published
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 text-[10px] text-faint">
        <span className="flex items-center gap-1.5">
          <GitBranch size={10} /> 1 version · 0 open issues
        </span>
        <span className="flex items-center gap-1.5 text-fern">
          <Sparkles size={10} /> QA 98/100
        </span>
      </div>
    </div>
  );
}

export function Studio() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    const next = Math.max(0, Math.min(STEPS.length - 1, Math.floor(v * STEPS.length + 0.08)));
    setIndex(next);
  });

  const jump = (i: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + ((i + 0.35) / STEPS.length) * range, behavior: "smooth" });
  };

  return (
    <div id="studio">
      <section ref={wrapRef} className="relative hidden lg:block" style={{ height: "320vh" }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(60% 50% at 70% 40%, rgba(255,106,61,.12), transparent 70%), radial-gradient(40% 40% at 20% 80%, rgba(139,147,255,.1), transparent 70%)",
            }}
          />
          <div className="relative mx-auto grid w-full max-w-6xl grid-cols-[.9fr_1.1fr] items-center gap-16 px-8">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-faint">The studio</span>
              <h2 className="mt-3 font-display text-[clamp(38px,4.2vw,58px)] leading-[0.98] tracking-[-0.03em] text-ink">
                From one line
                <br />
                to a finished site.
              </h2>
              <div className="mt-8 space-y-1">
                {STEPS.map((step, i) => {
                  const active = i === index;
                  return (
                    <button
                      key={step.k}
                      type="button"
                      onClick={() => jump(i)}
                      className="relative block w-full rounded-2xl px-4 py-3.5 text-left transition-all duration-500"
                      style={{
                        background: active ? "rgba(255,255,255,.045)" : "transparent",
                        opacity: active ? 1 : 0.45,
                      }}
                    >
                      <span
                        className="absolute inset-y-3 left-0 w-[2px] rounded-full transition-all duration-500"
                        style={{ background: active ? "linear-gradient(180deg,#ffb020,#ff6a3d)" : "transparent" }}
                      />
                      <span className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-faint">{step.k}</span>
                        <span className="text-[15px] font-medium tracking-[-0.01em] text-ink">{step.title}</span>
                      </span>
                      <span
                        className="mt-1.5 block overflow-hidden pl-7 text-[12.5px] leading-relaxed text-muted transition-all duration-500"
                        style={{ maxHeight: active ? 60 : 0, opacity: active ? 1 : 0 }}
                      >
                        {step.body}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 h-[2px] w-full max-w-xs overflow-hidden rounded-full bg-white/[0.07]">
                <motion.div
                  className="h-full origin-left rounded-full bg-gradient-to-r from-ember-soft to-ember"
                  style={{ scaleX: scrollYProgress }}
                />
              </div>
            </div>

            <div className="relative flex h-[440px] items-center justify-center">
              <div className="absolute inset-x-10 inset-y-10 rounded-full bg-ember/[0.07] blur-[70px]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? undefined : { opacity: 0, y: -14, filter: "blur(6px)" }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex w-full justify-center"
                >
                  <Scene index={index} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-5 py-20 lg:hidden">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-faint">The studio</span>
        <h2 className="mt-3 font-display text-[clamp(34px,8vw,46px)] leading-[1] tracking-[-0.03em] text-ink">
          From one line
          <br />
          to a finished site.
        </h2>
        <div className="mt-8 space-y-4">
          {STEPS.map((step, i) => (
            <div key={step.k} className="panel rounded-2xl p-4">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[10px] text-faint">{step.k}</span>
                <span className="text-[15px] font-medium text-ink">{step.title}</span>
              </div>
              <p className="mt-1.5 pl-7 text-[12.5px] leading-relaxed text-muted">{step.body}</p>
              {i === 3 && (
                <div className="mt-4">
                  <MiniSite genre="streaming" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
