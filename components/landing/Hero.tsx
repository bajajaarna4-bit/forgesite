"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { PromptCard } from "./PromptCard";
import { MiniSite } from "@/components/previews/MiniSite";

const HEADLINE = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.1 } },
};

const WORD = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function Words({ text, className = "" }: { text: string; className?: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <motion.span key={`${word}-${i}`} variants={WORD} className={`inline-block ${className}`}>
          {word}
          {i < text.split(" ").length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 160, damping: 20 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 160, damping: 20 });

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-70" />
      <div
        className="pointer-events-none absolute -left-40 top-10 h-[36rem] w-[36rem] rounded-full opacity-60 blur-[110px]"
        style={{ background: "radial-gradient(circle, rgba(255,106,61,.18), transparent 62%)" }}
      />
      <div
        className="pointer-events-none absolute -right-32 top-32 h-[30rem] w-[30rem] rounded-full opacity-50 blur-[110px]"
        style={{ background: "radial-gradient(circle, rgba(139,147,255,.16), transparent 64%)" }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.06fr_.94fr] lg:gap-8">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[11px] text-muted"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fern opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-fern" />
            </span>
            A studio of six agents, listening
            <span className="ml-1 rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-faint">
              local engine
            </span>
          </motion.div>

          <motion.h1
            variants={HEADLINE}
            initial="hidden"
            animate="show"
            className="font-display text-[clamp(50px,7.4vw,88px)] leading-[0.94] tracking-[-0.03em] text-ink"
          >
            <span className="block">
              <Words text="Describe it." />
            </span>
            <span className="mt-1 block">
              <Word>We&apos;ll</Word>{" "}
              <Words text="craft" className="text-gradient-ember" />{" "}
              <Words text="it." />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-[34rem] text-[15.5px] leading-relaxed text-muted sm:text-base"
          >
            One sentence becomes a complete site: planned, designed, coded and tested by six
            specialists. You approve the direction before a single file is written.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <PromptCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-faint"
          >
            {["No API key needed", "Five real files", "Yours to export"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check size={12} className="text-fern" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        <div
          ref={stageRef}
          onPointerMove={onMove}
          onPointerLeave={() => {
            px.set(0);
            py.set(0);
          }}
          className="relative h-[360px] select-none sm:h-[460px] lg:h-[560px]"
          style={{ perspective: 1400 }}
        >
          <div
            className="pointer-events-none absolute inset-8 rounded-full opacity-70 blur-[80px]"
            style={{ background: "radial-gradient(circle, rgba(255,106,61,.14), transparent 65%)" }}
          />

          <motion.div className="absolute inset-0" style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}>
            <motion.div
              className="absolute left-0 top-[3%] z-10 w-[84%] sm:w-[82%]"
              style={{ rotate: -5, z: 10 }}
              animate={reduce ? undefined : { y: [0, -9, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            >
              <MiniSite genre="streaming" />
            </motion.div>

            <motion.div
              className="absolute bottom-[7%] right-0 z-20 w-[80%] sm:w-[76%]"
              style={{ rotate: 3.2, z: 60 }}
              animate={reduce ? undefined : { y: [0, 10, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            >
              <MiniSite genre="commerce" />
            </motion.div>

            <motion.div
              className="absolute right-[1%] top-[1%] z-30 w-[46%]"
              style={{ z: 90 }}
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            >
              <div className="panel rounded-2xl p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">Plan approved</span>
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-fern/15 text-fern">
                    <Check size={9} />
                  </span>
                </div>
                <div className="mt-2.5 flex gap-1">
                  {["#E3A342", "#2A2622", "#ECECEC", "#FFD447", "#14382A"].map((c) => (
                    <span key={c} className="h-4 flex-1 rounded-[5px]" style={{ background: c }} />
                  ))}
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted">
                  <span>Sora / Manrope</span>
                  <span>12px</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-[2%] left-[2%] z-30"
              style={{ z: 70 }}
              animate={reduce ? undefined : { y: [0, 7, 0] }}
              transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            >
              <div className="panel flex items-center gap-2 rounded-full py-1.5 pl-2 pr-3 text-[10.5px] text-ink/80">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-ember/15 text-ember">
                  <Sparkles size={11} />
                </span>
                QA signed off · 98/100
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Word({ children }: { children: React.ReactNode }) {
  return (
    <motion.span variants={WORD} className="inline-block">
      {children}
    </motion.span>
  );
}
