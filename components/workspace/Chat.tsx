"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUp,
  FileCode2,
  Info,
  Loader2,
  MousePointerClick,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { EDIT_SUGGESTIONS } from "@/lib/engine/edit";
import { LogoMark } from "@/components/ui/Logo";
import { toast } from "@/lib/toast";
import { timeAgo } from "@/lib/utils";
import type { ChatMessage, Project, SelectionInfo } from "@/lib/types";

function KindIcon({ kind }: { kind?: ChatMessage["kind"] }) {
  if (kind === "edit") return <Wand2 size={12} className="text-ember-soft" />;
  if (kind === "build") return <Sparkles size={12} className="text-ember-soft" />;
  return <Info size={12} className="text-faint" />;
}

function Message({ msg }: { msg: ChatMessage }) {
  if (msg.role === "system") {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[11.5px] text-faint">
        {msg.text}
      </div>
    );
  }
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[92%] rounded-2xl rounded-br-md border border-white/10 bg-white/[0.07] px-3.5 py-2.5">
          <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-ink">{msg.text}</p>
          <p className="mt-1 text-right text-[9.5px] text-faint">{timeAgo(msg.at)}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2.5">
      <LogoMark size={24} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-muted">Atelier</span>
          <KindIcon kind={msg.kind} />
          <span className="text-[9.5px] text-faint">{timeAgo(msg.at)}</span>
        </div>
        <p className="mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-ink/90">{msg.text}</p>
        {msg.changed && msg.changed.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {msg.changed.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1 rounded-md border border-white/[0.07] bg-white/[0.025] px-1.5 py-0.5 font-mono text-[9.5px] text-faint"
              >
                <FileCode2 size={9} /> {f}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Chat({
  project,
  onApply,
  selection,
  onClearSelection,
}: {
  project: Project;
  onApply: (
    text: string,
    selection: SelectionInfo | null,
  ) => { ok: boolean; message?: string };
  selection: SelectionInfo | null;
  onClearSelection: () => void;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const reduce = useReducedMotion();
  const ready = project.stage === "ready";
  const building = project.stage === "building";

  useEffect(() => {
    const el = endRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" });
  }, [project.messages.length, building, reduce]);

  const send = async (value?: string) => {
    const instruction = (value ?? text).trim();
    if (!instruction || !ready || sending) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 220));
    const result = onApply(instruction, selection);
    setSending(false);
    if (!result.ok) {
      toast(result.message ?? "That edit could not be applied.", "error");
      return;
    }
    setText("");
    onClearSelection();
    inputRef.current?.focus();
  };

  const shown = project.messages.slice(-40);
  const suggestions = EDIT_SUGGESTIONS.filter((s) => s !== text).slice(0, 4);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">Studio chat</span>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[9.5px] text-faint">
            {project.settings.model}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className={`absolute inline-flex h-full w-full rounded-full ${ready ? "bg-fern" : "bg-ember"} opacity-50 ${building ? "animate-ping" : ""}`} />
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${ready ? "bg-fern" : "bg-ember"}`} />
          </span>
          <span className="text-[10px] text-faint">{building ? "building" : ready ? "live" : "plan"}</span>
        </div>
      </div>

      <div className="scroll-thin min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {shown.length === 0 && (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-[13px] font-medium">Your studio is listening.</p>
            <p className="mt-1 text-[12px] leading-relaxed text-faint">
              Describe a change in plain language. The engine resolves it to the fewest files possible — palette,
              type, sections or a single selected element.
            </p>
          </div>
        )}

        {shown.map((m) => (
          <Message key={m.id} msg={m} />
        ))}

        <AnimatePresence>
          {building && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 rounded-xl border border-ember/20 bg-ember/[0.06] px-3 py-2.5"
            >
              <Loader2 size={13} className="animate-spin text-ember-soft" />
              <div>
                <p className="text-[12px] font-medium text-ember-soft">The agents are building.</p>
                <p className="text-[10.5px] text-faint">Chat unlocks the moment the reviewer signs off.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <div className="border-t border-white/[0.06] p-3">
        {selection && (
          <div className="mb-2 flex items-center gap-2 rounded-xl border border-iris/30 bg-iris/[0.08] px-2.5 py-1.5">
            <MousePointerClick size={12} className="flex-none text-iris" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-[10px] text-iris">{selection.selector}</p>
              {selection.text && <p className="truncate text-[10.5px] text-faint">“{selection.text}”</p>}
            </div>
            <button
              onClick={onClearSelection}
              className="grid h-5 w-5 flex-none place-items-center rounded-full text-faint hover:bg-white/10 hover:text-ink"
              aria-label="Clear selection"
            >
              <X size={11} />
            </button>
          </div>
        )}

        <div className="scroll-thin mb-2 flex gap-1.5 overflow-x-auto pb-0.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setText(s);
                inputRef.current?.focus();
              }}
              disabled={!ready}
              className="chip flex-none rounded-full px-2.5 py-1 text-[10.5px] text-muted disabled:opacity-40"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-2 transition focus-within:border-ember/45">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                void send();
              }
            }}
            rows={2}
            disabled={!ready || sending}
            placeholder={ready ? "Ask for a change — e.g. make the accent orange" : "The composer unlocks when the build finishes"}
            className="max-h-32 w-full resize-none bg-transparent px-1.5 py-1 text-[13px] leading-relaxed text-ink outline-none placeholder:text-faint disabled:cursor-not-allowed"
          />
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-[9.5px] text-faint">
              {selection ? "Scoped to selection" : "2 credits · ⌘↵ to send"}
            </span>
            <button
              onClick={() => void send()}
              disabled={!ready || !text.trim() || sending}
              className="btn-ember grid h-7 w-7 place-items-center rounded-full disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send instruction"
            >
              {sending ? <Loader2 size={13} className="animate-spin" /> : <ArrowUp size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
