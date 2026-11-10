"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  History,
  MousePointerClick,
  Palette,
  Rocket,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Studio } from "./Studio";
import { BeforeAfter } from "./BeforeAfter";
import { TemplatesGrid } from "@/components/TemplatesGrid";
import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Motion";

const MARQUEE = [
  ["Quick commerce", "#FFD447"],
  ["Streaming", "#E3A342"],
  ["Creator video", "#E4572E"],
  ["Social feed", "#C0502E"],
  ["SaaS", "#0E6B4E"],
  ["Portfolio", "#A8492E"],
  ["8px rhythm", "#8b93ff"],
  ["AA contrast", "#3ddc97"],
  ["Reduced motion", "#ffb020"],
  ["Click to edit", "#ff6a3d"],
  ["Real copy", "#f2f3f5"],
  ["Five files", "#9ba1ac"],
];

const FEATURES = [
  {
    icon: Palette,
    title: "Genre-aware design",
    body: "Commerce, streaming, video, social, SaaS and portfolio each get their own type pairing, palette and layout grammar.",
    tint: "#ffb020",
  },
  {
    icon: MousePointerClick,
    title: "Edit by talking",
    body: "“Make the accent orange.” “Add testimonials.” The parser finds the precise tokens and files to touch.",
    tint: "#ff6a3d",
  },
  {
    icon: Users,
    title: "Six visible agents",
    body: "Planner, Designer, Frontend, Backend, QA and Reviewer hand off in the open with a live activity log.",
    tint: "#8b93ff",
  },
  {
    icon: History,
    title: "Every version kept",
    body: "Builds and edits become versions you can restore. Nothing is overwritten without a way back.",
    tint: "#3ddc97",
  },
  {
    icon: Sparkles,
    title: "QA that actually patches",
    body: "Alt text, intrinsic image sizes, contrast and reduced motion are checked against the generated files, then fixed.",
    tint: "#f0d16a",
  },
  {
    icon: Rocket,
    title: "Export or publish",
    body: "Download a ZIP, read every file, or publish a shareable preview. No lock-in and no proprietary runtime.",
    tint: "#c9a4ff",
  },
];

type Plan = {
  name: string;
  price: string;
  cadence?: string;
  credits: number;
  blurb: string;
  features: string[];
  cta: string;
  anchor?: string;
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Sketch",
    price: "Free",
    credits: 100,
    blurb: "For trying the studio on a real idea.",
    features: ["100 starting credits", "Full engine access", "ZIP export", "Version history"],
    cta: "Start free",
    anchor: "#prompt",
  },
  {
    name: "Studio",
    price: "$24",
    cadence: "/month",
    credits: 220,
    blurb: "For people shipping a few sites a month.",
    features: ["220 credits monthly", "Priority generation", "Hosted preview links", "Custom domains (seam)"],
    cta: "Add 220 credits",
    popular: true,
  },
  {
    name: "Atelier",
    price: "$79",
    cadence: "/month",
    credits: 600,
    blurb: "For teams with a full shelf of briefs.",
    features: ["600 credits monthly", "Shared palettes", "Named support", "Bring your own model key"],
    cta: "Add 600 credits",
  },
];

function SpotlightCard({
  icon: Icon,
  title,
  body,
  tint,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  tint: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect || !ref.current) return;
        ref.current.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        ref.current.style.setProperty("--my", `${e.clientY - rect.top}px`);
      }}
      className="spotlight panel-hover rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5"
    >
      <span
        className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08]"
        style={{ background: `${tint}14`, color: tint }}
      >
        <Icon size={16} />
      </span>
      <h3 className="mt-4 text-[14.5px] font-medium tracking-[-0.01em] text-ink">{title}</h3>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function useLenis() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis: { raf: (t: number) => void; destroy: () => void; scrollTo: (target: Element, opts?: { offset?: number }) => void; start: () => void; stop: () => void } | null = null;
    let frame = 0;
    let cancelled = false;
    let detach: (() => void) | null = null;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const instance = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
      lenis = instance;
      const loop = (time: number) => {
        instance.raf(time);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);

      const onClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        const anchor = target?.closest('a[href^="#"]');
        if (!anchor) return;
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;
        const el = document.querySelector(href);
        if (!el) return;
        e.preventDefault();
        instance.scrollTo(el, { offset: -90 });
      };
      const onVisibility = () => (document.hidden ? instance.stop() : instance.start());
      document.addEventListener("click", onClick);
      document.addEventListener("visibilitychange", onVisibility);
      detach = () => {
        document.removeEventListener("click", onClick);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      detach?.();
      lenis?.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, []);
}

export function LandingPage() {
  useLenis();

  const buyCredits = async (credits: number) => {
    const { useAtelier } = await import("@/lib/store");
    useAtelier.getState().addCredits(credits);
  };

  return (
    <main className="relative min-h-screen overflow-x-clip bg-canvas">
      <div className="aurora" aria-hidden="true" />
      <div className="relative z-10">
        <Nav />
        <Hero />

        <div className="marquee border-y border-white/[0.06] bg-white/[0.015] py-3.5">
          <div className="marquee-track">
            {[...MARQUEE, ...MARQUEE].map(([label, color], i) => (
              <span
                key={`${label}-${i}`}
                className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/[0.06] px-3 py-1.5 text-[11px] text-muted"
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <Studio />
        <BeforeAfter />

        <section id="templates" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-faint">A place to start</span>
              <h2 className="mt-3 font-display text-[clamp(36px,4.6vw,58px)] leading-[0.98] tracking-[-0.03em] text-ink">
                Six genres, finished.
              </h2>
              <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-muted">
                Each of these is generated by the same engine you are about to use. Open one as a starting
                point, then edit it in plain language.
              </p>
            </div>
            <Link
              href="/templates"
              className="chip flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] text-muted"
            >
              All templates
              <ArrowUpRight size={13} />
            </Link>
          </Reveal>
          <TemplatesGrid limit={6} />
        </section>

        <section className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
          <Reveal className="mb-10 max-w-xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-faint">Under the hood</span>
            <h2 className="mt-3 font-display text-[clamp(36px,4.6vw,58px)] leading-[0.98] tracking-[-0.03em] text-ink">
              Premium by default.
              <br />
              Honest by design.
            </h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 0.04}>
                <SpotlightCard {...feature} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-3xl border border-white/[0.07] bg-white/[0.02] px-5 py-4 text-[12px] text-faint sm:flex-row sm:items-center">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-fern" />
                The local engine is deterministic and needs no API key. A Claude-backed generator can be
                swapped in at the same seam.
              </span>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em]">v0.9 · prototype</span>
            </div>
          </Reveal>
        </section>

        <section id="pricing" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Reveal className="mb-10 max-w-xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-faint">Credits</span>
            <h2 className="mt-3 font-display text-[clamp(36px,4.6vw,58px)] leading-[0.98] tracking-[-0.03em] text-ink">
              Pay for the work,
              <br />
              not the seat.
            </h2>
            <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-muted">
              A build costs 12 credits. An edit costs 2. Credits map to real model calls in production —
              in this prototype every plan is simulated, so nothing is charged.
            </p>
          </Reveal>
          <div className="grid gap-4 lg:grid-cols-3">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.06}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl border p-6 ${
                    plan.popular
                      ? "border-ember/30 bg-gradient-to-b from-ember/[0.08] to-white/[0.02] shadow-[0_30px_80px_-50px_rgba(255,106,61,.55)]"
                      : "border-white/[0.08] bg-white/[0.02]"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute right-5 top-5 rounded-full bg-ember/15 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-ember">
                      Most chosen
                    </span>
                  )}
                  <span className="text-[12px] uppercase tracking-[0.16em] text-faint">{plan.name}</span>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-display text-[44px] leading-none tracking-[-0.03em] text-ink">{plan.price}</span>
                    {plan.cadence && <span className="text-[12px] text-faint">{plan.cadence}</span>}
                  </div>
                  <p className="mt-2 text-[12.5px] text-muted">{plan.blurb}</p>
                  <div className="my-5 h-px bg-white/[0.07]" />
                  <ul className="space-y-2.5 text-[12.5px] text-muted">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ember/80" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    {plan.anchor ? (
                      <a
                        href={plan.anchor}
                        className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[12.5px] font-medium text-ink transition hover:bg-white/[0.06]"
                      >
                        {plan.cta}
                        <ArrowRight size={13} />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => buyCredits(plan.credits)}
                        className={`flex h-10 w-full items-center justify-center gap-1.5 rounded-full text-[12.5px] font-semibold transition ${
                          plan.popular
                            ? "btn-ember"
                            : "border border-white/10 bg-white/[0.03] text-ink hover:bg-white/[0.06]"
                        }`}
                      >
                        {plan.cta}
                      </button>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-faint">
            Billing is simulated in this prototype: choosing a paid plan adds demo credits to your local
            workspace. No payment details are collected.
          </p>
        </section>

        <section className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
          <Reveal>
            <div className="ember-border panel relative overflow-hidden rounded-[32px] px-6 py-14 text-center sm:px-14 sm:py-20">
              <div className="grain absolute inset-0 opacity-40" />
              <div className="relative">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-faint">
                  The next sentence is yours
                </span>
                <h2 className="mx-auto mt-3 max-w-3xl font-display text-[clamp(38px,5vw,66px)] leading-[0.98] tracking-[-0.03em] text-ink">
                  Your next site is
                  <br />
                  <span className="text-gradient-ember">one sentence away.</span>
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-[14px] leading-relaxed text-muted">
                  Describe it, approve the plan, watch six agents build it. Then keep changing it by talking.
                </p>
                <div className="mt-7 flex justify-center">
                  <a
                    href="#prompt"
                    className="btn-ember flex h-11 items-center gap-2 rounded-full px-6 text-[13.5px] font-semibold"
                  >
                    Start with a brief
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <footer className="border-t border-white/[0.06]">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-sm">
              <Logo />
              <p className="mt-3 text-[12px] leading-relaxed text-faint">
                A working prototype of a prompt-to-site studio. Brands, copy, imagery and metrics inside
                generated sites are fictional.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 text-[12px] sm:grid-cols-3">
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] uppercase tracking-[0.16em] text-faint">Product</span>
                <a href="#studio" className="text-muted hover:text-ink">Studio</a>
                <a href="#templates" className="text-muted hover:text-ink">Templates</a>
                <a href="#pricing" className="text-muted hover:text-ink">Credits</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] uppercase tracking-[0.16em] text-faint">Workspace</span>
                <Link href="/dashboard" className="text-muted hover:text-ink">Projects</Link>
                <Link href="/templates" className="text-muted hover:text-ink">Gallery</Link>
                <a href="#prompt" className="text-muted hover:text-ink">Start a build</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] uppercase tracking-[0.16em] text-faint">Notes</span>
                <span className="text-muted">Local engine</span>
                <span className="text-muted">No API keys</span>
                <span className="text-muted">Fictional content</span>
              </div>
            </div>
          </div>
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-5 pb-8 text-[10.5px] text-faint sm:px-8">
            <span>© 2026 Atelier. A prototype, built with care.</span>
            <span className="font-mono">describe → approve → ship</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
