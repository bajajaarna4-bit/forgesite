"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Sparkles, X } from "lucide-react";
import { useToast } from "@/lib/toast";

export function Toaster() {
  const toasts = useToast((s) => s.toasts);
  const dismiss = useToast((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[120] flex flex-col items-center gap-2 px-4 sm:bottom-6">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = toast.tone === "error" ? AlertCircle : toast.tone === "success" ? CheckCircle2 : Sparkles;
          return (
            <motion.button
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              onClick={() => dismiss(toast.id)}
              className="panel pointer-events-auto flex max-w-md items-center gap-2.5 rounded-2xl px-4 py-3 text-left text-[13px] text-ink"
            >
              <Icon
                size={15}
                className={
                  toast.tone === "error" ? "text-[#ff7a76]" : toast.tone === "success" ? "text-fern" : "text-ember-soft"
                }
              />
              <span className="flex-1 leading-snug">{toast.text}</span>
              <X size={13} className="text-faint" />
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
