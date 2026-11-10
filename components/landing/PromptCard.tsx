"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { GENRE_LABEL, detectGenre } from "@/lib/engine/detect";
import { GENRE_CHIPS, TEMPLATES, TYPEWRITER } from "@/lib/templates";
import { Magnetic } from "@/components/ui/Motion";

export function PromptCard() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [typed, setTyped] = useState("");
  const [focused, setFocused] = useState(false);
  const [busy, setBusy] = useState(false);
  const reduce = useReducedMotion();
  const areaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (reduce || text || focused) return;
    let phrase = 0;
    let char = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const target = TYPEWRITER[phrase];
      if (char <= target.length) {
        setTyped(target.slice(0, char));
        char += 1;
        timer = setTimeout(tick, 26 + Math.random() * 38);
      } else {
        timer = setTimeout(() => {
          char = 0;
          phrase = (phrase + 1) % TYPEWRITER.length;
          setTyped("");
          tick();
        }, 1800);
      }
    };
    tick();
    return () => clearTimeout(timer);
  }, [text, focused, reduce]);

  const genre = useMemo(() => (text.trim().length > 2 ? detectGenre(text) : null), [text]);

  const submit = () => {
    if (busy) return;
    const value = text.trim() || TYPEWRITER[Math.floor(Math.random() * TYPEWRITER.length)];
    setBusy(true);
    import("@/lib/store")
      .then(({ useAtelier }) => {
        const project = useAtelier.getState().createProject(value);
        router.push(`/plan/${project.id}`);
      })
      .catch(() => setBusy(false));
  };

  const applyTemplate = (genreId: string) => {
    const template = TEMPLATES.find((t) => t.genre === genreId);
    if (!template) return;
    setText(template.prompt);
    requestAnimationFrame(() => areaRef.current?.focus());
  };

  return (
    <div id="prompt" className="ember-border panel relative rounded-[28px] p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
          <Sparkles size={12} className="text-ember-soft" />
          Your brief
        </span>
        <AnimatePresence mode="wait">
          {genre ? (
            <motion.span
              key={genre}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-medium text-ink/80"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ember" />
              Reads as {GENRE_LABEL[genre]}
            </motion.span>
          ) : (
            <span className="hidden text-[10px] text-faint sm:block">One sentence is enough</span>
          )}
        </AnimatePresence>
      </div>

      <div className="relative">
        <label htmlFor="brief" className="sr-only">
          Describe the website or app you want Atelier to build
        </label>
        <textarea
          id="brief"
          ref={areaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              submit();
            }
          }}
          spellCheck={false}
          rows={3}
          className="relative z-10 w-full resize-none bg-transparent px-1 text-[17px] leading-[1.55] tracking-[-0.01em] text-ink caret-ember outline-none sm:text-[19px]"
          style={{ minHeight: 116 }}
        />
        {!text && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 px-1 text-[17px] leading-[1.55] tracking-[-0.01em] text-faint/80 sm:text-[19px]"
          >
            {reduce ? "Describe the site you want — genre, mood, and what it must do." : typed}
            <span className="ml-0.5 inline-block h-[1.05em] w-[1.5px] translate-y-[3px] animate-pulse bg-ember/80" />
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-white/[0.06] pt-3">
        <span className="mr-1 hidden text-[11px] text-faint sm:inline">Start from</span>
        {GENRE_CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => applyTemplate(chip.id)}
            className="chip rounded-full px-2.5 py-1 text-[11px] text-ink/70"
            title={chip.hint}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-[15rem] text-[11px] leading-relaxed text-faint">
          {busy ? "Opening the studio…" : "Plans first. Nothing is built until you approve it."}
        </p>
        <Magnetic>
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="btn-ember group flex h-11 items-center gap-2 whitespace-nowrap rounded-full pl-5 pr-4 text-[13.5px] font-semibold disabled:opacity-70"
          >
            {busy ? "Opening…" : "Craft my site"}
            <span className="grid h-6 w-6 place-items-center rounded-full bg-black/15">
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </button>
        </Magnetic>
      </div>
    </div>
  );
}
