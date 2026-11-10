"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { GenreId } from "./types";

export function useCreateProject() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const create = async (prompt: string, genre?: GenreId) => {
    if (busy) return;
    setBusy(true);
    try {
      const { useAtelier } = await import("./store");
      const project = useAtelier.getState().createProject(prompt, genre);
      router.push(`/plan/${project.id}`);
    } catch {
      setBusy(false);
    }
  };

  return { busy, create };
}
