"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Globe, X } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { toast } from "@/lib/toast";
import type { Project } from "@/lib/types";

const CONFETTI = ["#ff6a3d", "#ffb020", "#ff3d5a", "#8b93ff", "#3ddc97", "#f2f3f5"];

export function DeployModal({
  open,
  onClose,
  project,
  url,
  subdomain,
}: {
  open: boolean;
  onClose: () => void;
  project: Project;
  url: string | null;
  subdomain: string | null;
}) {
  const reduce = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        id: i,
        left: 6 + Math.random() * 88,
        x: (Math.random() - 0.5) * 140,
        rotate: Math.random() * 720 - 360,
        delay: Math.random() * 0.45,
        duration: 1.7 + Math.random() * 1.1,
        color: CONFETTI[i % CONFETTI.length],
        size: 5 + Math.random() * 6,
      })),
    [],
  );

  const copy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${url}`);
      toast("Preview link copied", "success");
    } catch {
      toast("Clipboard is blocked in this browser.", "error");
    }
  };

  return (
    <AnimatePresence>
      {open && url && (
        <div className="fixed inset-0 z-[80] grid place-items-center p-4">
          <motion.button
            aria-label="Close deploy dialog"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-md"
          />
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {!reduce &&
              pieces.map((p) => (
                <motion.span
                  key={p.id}
                  className="absolute top-0 rounded-[2px]"
                  style={{ left: `${p.left}%`, width: p.size, height: p.size * 1.6, background: p.color }}
                  initial={{ y: -40, opacity: 0, rotate: 0 }}
                  animate={{ y: 460, x: p.x, opacity: [0, 1, 1, 0], rotate: p.rotate }}
                  transition={{ duration: p.duration, delay: p.delay, ease: [0.16, 0.8, 0.4, 1] }}
                />
              ))}
          </div>

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="deploy-title"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="panel-solid relative w-full max-w-md overflow-hidden rounded-[24px] border border-white/10 p-6 shadow-[0_50px_120px_-40px_rgba(0,0,0,.95)]"
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-white/10 hover:text-ink"
              aria-label="Close"
            >
              <X size={15} />
            </button>

            <div className="flex items-center gap-2.5">
              <LogoMark size={34} />
              <span className="flex items-center gap-1 rounded-full border border-fern/30 bg-fern/[0.08] px-2 py-0.5 text-[10px] text-fern">
                <Check size={10} /> Published
              </span>
            </div>

            <h2 id="deploy-title" className="font-display mt-4 text-[34px] leading-none tracking-tight">
              It&apos;s <span className="text-gradient-ember">live.</span>
            </h2>
            <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
              {project.plan.brand.name} is published to{" "}
              <span className="font-mono text-[11.5px] text-ink">{subdomain}.atelier.site</span>. Share the
              preview link — it opens the real generated site.
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 p-1.5 pl-3">
              <Globe size={13} className="flex-none text-faint" />
              <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted">{url}</span>
              <button
                onClick={() => void copy()}
                className="flex flex-none items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10.5px] text-muted transition hover:text-ink"
              >
                <Copy size={11} /> Copy
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href={url}
                target="_blank"
                className="btn-ember flex h-10 items-center justify-center gap-1.5 rounded-full text-[12px] font-semibold"
              >
                Open preview <ArrowUpRight size={13} />
              </Link>
              <button
                onClick={onClose}
                className="btn-ghost flex h-10 items-center justify-center rounded-full text-[12px] text-muted hover:text-ink"
              >
                Keep editing
              </button>
            </div>

            <p className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[10px] leading-relaxed text-faint">
              Honest note: this link is served from this browser using your local project. Connect a host and the same
              static files deploy as-is.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
