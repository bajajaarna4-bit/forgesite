"use client";

import { useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { MiniSite } from "@/components/previews/MiniSite";
import { Reveal } from "@/components/ui/Motion";

function Wireframe() {
  return (
    <div className="flex h-full flex-col bg-[#101216] text-[#6d7480]">
      <div className="flex h-[9%] items-center justify-between px-[4%] text-[1.6cqw]" style={{ borderBottom: "1px solid rgba(255,255,255,.07)" }}>
        <span className="flex items-center gap-[1cqw]">
          <span className="rounded-[.4cqw] bg-[#2a2e36]" style={{ width: "2.4cqw", height: "2.4cqw" }} />
          <span className="rounded bg-[#2a2e36]" style={{ width: "9cqw", height: "1.4cqw" }} />
        </span>
        <span className="flex gap-[2cqw]">
          <span className="rounded bg-[#22262d]" style={{ width: "5cqw", height: "1.2cqw" }} />
          <span className="rounded bg-[#22262d]" style={{ width: "5cqw", height: "1.2cqw" }} />
          <span className="rounded bg-[#22262d]" style={{ width: "5cqw", height: "1.2cqw" }} />
        </span>
      </div>
      <div className="flex flex-1 flex-col px-[5%] pt-[5%]">
        <div className="flex items-end justify-between">
          <div>
            <div className="rounded bg-[#262b33]" style={{ width: "34cqw", height: "5cqw" }} />
            <div className="mt-[1.4cqw] rounded bg-[#22262d]" style={{ width: "24cqw", height: "1.4cqw" }} />
            <div className="mt-[.8cqw] rounded bg-[#1d2128]" style={{ width: "18cqw", height: "1.2cqw" }} />
            <div className="mt-[2cqw] rounded-[.6cqw] bg-[#3a3f48]" style={{ width: "9cqw", height: "3.2cqw" }} />
          </div>
          <div className="rounded-[1cqw] bg-[#1c2026]" style={{ width: "28cqw", height: "18cqw" }} />
        </div>
        <div className="mt-[3cqw] grid flex-1 grid-cols-3 gap-[1.6cqw]">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-[.8cqw] bg-[#191d23] p-[1.4cqw]">
              <div className="rounded bg-[#242932]" style={{ height: "6cqw" }} />
              <div className="mt-[1.2cqw] rounded bg-[#2a2f38]" style={{ width: "70%", height: "1.1cqw" }} />
              <div className="mt-[.6cqw] rounded bg-[#22262d]" style={{ width: "48%", height: "1cqw" }} />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between py-[2.4%] text-[1.4cqw] text-[#5b6270]">
          <span>Lorem ipsum dolor sit amet</span>
          <span>© 2026 Template</span>
        </div>
      </div>
    </div>
  );
}

export function BeforeAfter() {
  const [pos, setPos] = useState(58);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const update = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos(Math.max(6, Math.min(94, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <section id="craft" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-faint">The difference</span>
          <h2 className="mt-3 font-display text-[clamp(36px,4.6vw,58px)] leading-[0.98] tracking-[-0.03em] text-ink">
            Not a template
            <br />
            with new colors.
          </h2>
          <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-muted">
            Atelier starts from the genre, then composes type, spacing, copy and motion to match. Drag the
            handle to compare a generic template with a generated build.
          </p>
          <div className="mt-6 space-y-2.5 text-[12.5px] text-muted">
            {[
              "Real headlines, product names and prices — no lorem ipsum",
              "8px spacing rhythm and a deliberate type pairing",
              "Contrast, alt text and intrinsic sizes verified by QA",
            ].map((line) => (
              <div key={line} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ember" />
                {line}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            ref={ref}
            className="relative select-none overflow-hidden rounded-[22px]"
            style={{ aspectRatio: "16 / 10", touchAction: "pan-y" }}
            onPointerDown={(e) => {
              setDragging(true);
              e.currentTarget.setPointerCapture(e.pointerId);
              update(e.clientX);
            }}
            onPointerMove={(e) => {
              if (dragging) update(e.clientX);
            }}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
          >
            <div className="absolute inset-0" style={{ containerType: "inline-size" }}>
              <MiniSite genre="saas" />
            </div>
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, containerType: "inline-size" }}
            >
              <Wireframe />
            </div>

            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur">
              Generic template
            </span>
            <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur">
              Built with Atelier
            </span>

            <div
              className="pointer-events-none absolute inset-y-0 z-10 w-[2px] bg-white/80"
              style={{ left: `${pos}%`, boxShadow: "0 0 18px rgba(0,0,0,.5)" }}
            />
            <button
              type="button"
              role="slider"
              aria-label="Compare generic template with Atelier build"
              aria-valuemin={6}
              aria-valuemax={94}
              aria-valuenow={Math.round(pos)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") setPos((p) => Math.max(6, p - 4));
                if (e.key === "ArrowRight") setPos((p) => Math.min(94, p + 4));
              }}
              className="absolute top-1/2 z-20 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-[#12141a]/90 text-ink shadow-[0_12px_30px_rgba(0,0,0,.55)] backdrop-blur"
              style={{ left: `${pos}%`, cursor: dragging ? "grabbing" : "grab" }}
            >
              <ChevronsLeftRight size={16} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
