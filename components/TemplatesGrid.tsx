"use client";

import { ArrowUpRight } from "lucide-react";
import { MiniSite } from "@/components/previews/MiniSite";
import { useCreateProject } from "@/lib/use-create-project";
import { GENRE_LABEL } from "@/lib/engine/detect";
import { TEMPLATES, type Template } from "@/lib/templates";
import { cn } from "@/lib/utils";

function Card({ template }: { template: Template }) {
  const { create, busy } = useCreateProject();
  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => create(template.prompt, template.genre)}
      className="group relative flex flex-col overflow-hidden rounded-[22px] border border-white/[0.08] bg-white/[0.02] p-2.5 text-left transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.16] hover:bg-white/[0.035] hover:shadow-[0_30px_70px_-40px_rgba(0,0,0,.9)] disabled:opacity-60"
    >
      <div className="overflow-hidden rounded-[15px]">
        <MiniSite
          genre={template.genre}
          className="transition-transform duration-700 group-hover:scale-[1.015]"
        />
      </div>
      <div className="flex items-start justify-between gap-3 px-2 pb-1.5 pt-3.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[13.5px] font-medium text-ink">{template.name}</span>
            <span className="rounded-full border border-white/[0.08] px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] text-faint">
              {GENRE_LABEL[template.genre]}
            </span>
          </div>
          <p className="mt-1 text-[11.5px] text-muted">{template.tagline}</p>
        </div>
        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-faint transition-all duration-300 group-hover:border-ember/40 group-hover:text-ember">
          <ArrowUpRight size={13} />
        </span>
      </div>
      <div className="pointer-events-none absolute inset-x-2.5 top-2.5 flex justify-end opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="rounded-full bg-black/65 px-2.5 py-1 text-[10px] text-white/85 backdrop-blur">
          {busy ? "Opening…" : "Use this template"}
        </span>
      </div>
    </button>
  );
}

export function TemplatesGrid({ limit, className }: { limit?: number; className?: string }) {
  const list = typeof limit === "number" ? TEMPLATES.slice(0, limit) : TEMPLATES;
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {list.map((template) => (
        <Card key={template.id} template={template} />
      ))}
    </div>
  );
}
