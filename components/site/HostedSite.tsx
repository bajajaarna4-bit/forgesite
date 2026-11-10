"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, PencilRuler } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { assembleSite } from "@/lib/engine/build";
import { useAtelier, useHydrated } from "@/lib/store";
import { GENRE_LABEL } from "@/lib/engine/detect";

export function HostedSite({ id }: { id: string }) {
  const hydrated = useHydrated();
  const project = useAtelier((s) => s.projects[id]);
  const html = useMemo(
    () => (project && project.stage === "ready" ? assembleSite(project.files) : ""),
    [project],
  );

  if (!hydrated) {
    return (
      <div className="grid h-[100dvh] place-items-center bg-canvas">
        <div className="shimmer h-8 w-40 rounded-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <main className="grid min-h-[100dvh] place-items-center px-6">
        <div className="panel max-w-md rounded-[24px] p-8 text-center">
          <LogoMark size={40} />
          <h1 className="font-display mt-5 text-3xl">This site isn&apos;t here.</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Published sites are stored in the browser that built them. Open the project there, or start a new brief.
          </p>
          <Link
            href="/"
            className="btn-ember mt-6 inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-[12px] font-semibold"
          >
            <ArrowLeft size={13} /> Back to Atelier
          </Link>
        </div>
      </main>
    );
  }

  if (project.stage !== "ready" || !html) {
    return (
      <main className="grid min-h-[100dvh] place-items-center px-6">
        <div className="panel max-w-md rounded-[24px] p-8 text-center">
          <LogoMark size={40} />
          <h1 className="font-display mt-5 text-3xl">
            {project.stage === "plan" ? "Still a plan." : "Still on the easel."}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {project.plan.brand.name} hasn&apos;t finished building. The preview appears here once the reviewer signs
            off.
          </p>
          <Link
            href={project.stage === "plan" ? `/plan/${project.id}` : `/workspace/${project.id}`}
            className="btn-ember mt-6 inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-[12px] font-semibold"
          >
            Open the {project.stage === "plan" ? "plan" : "build room"} <ArrowLeft size={13} className="rotate-180" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="fixed inset-0 bg-white">
      <iframe
        title={`${project.plan.brand.name} — ${GENRE_LABEL[project.genre]} site`}
        srcDoc={html}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        className="h-full w-full border-0"
      />
      <div className="pointer-events-none fixed inset-x-0 bottom-3 z-10 flex items-end justify-between gap-3 px-3">
        <Link
          href="/"
          className="panel pointer-events-auto flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[10.5px] text-muted shadow-lg backdrop-blur transition hover:text-ink"
          title="Made with Atelier"
        >
          <LogoMark size={18} />
          Made with Atelier
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="panel pointer-events-none hidden rounded-full px-2.5 py-1.5 font-mono text-[9.5px] text-faint sm:block">
            {project.deployed?.subdomain ?? "local"}.atelier.site
          </span>
          <Link
            href={`/workspace/${project.id}`}
            className="panel pointer-events-auto flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10.5px] text-muted shadow-lg backdrop-blur transition hover:text-ink"
          >
            <PencilRuler size={11} /> Edit in studio
          </Link>
        </div>
      </div>
    </div>
  );
}
