import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center px-6">
      <div className="aurora" aria-hidden="true" />
      <div className="panel relative z-10 max-w-md rounded-[26px] p-8 text-center">
        <Logo />
        <p className="mt-7 flex items-center justify-center gap-1.5 text-[10.5px] uppercase tracking-[0.2em] text-faint">
          <Compass size={12} /> 404
        </p>
        <h1 className="font-display mt-2 text-[36px] leading-tight">
          This room is <span className="text-gradient-ember">empty.</span>
        </h1>
        <p className="mt-3 text-[13px] leading-relaxed text-muted">
          The page you were looking for doesn&apos;t exist — or it moved while the agents were working.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            href="/"
            className="btn-ember inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-[12px] font-semibold"
          >
            <ArrowLeft size={13} /> Back to the studio
          </Link>
          <Link
            href="/dashboard"
            className="btn-ghost inline-flex h-10 items-center rounded-full px-4 text-[12px] text-muted hover:text-ink"
          >
            Your projects
          </Link>
        </div>
      </div>
    </main>
  );
}
