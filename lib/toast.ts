"use client";

import { create } from "zustand";

export type Toast = { id: string; text: string; tone: "default" | "success" | "error" };

type ToastState = {
  toasts: Toast[];
  push: (text: string, tone?: Toast["tone"]) => void;
  dismiss: (id: string) => void;
};

const uid = () => Math.random().toString(36).slice(2, 9);

export const useToast = create<ToastState>()((set, get) => ({
  toasts: [],
  push(text, tone = "default") {
    const id = uid();
    set((s) => ({ toasts: [...s.toasts, { id, text, tone }].slice(-4) }));
    setTimeout(() => get().dismiss(id), 4200);
  },
  dismiss(id) {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));

export const toast = (text: string, tone: Toast["tone"] = "default") => useToast.getState().push(text, tone);
