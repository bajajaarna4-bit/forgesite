import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const LINKS = [
  { href: "/", label: "Studio", id: "studio" },
  { href: "/templates", label: "Templates", id: "templates" },
  { href: "/dashboard", label: "Projects", id: "projects" },
];

export function PageNav({ active }: { active?: string }) {
  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3 sm:px-5">
      <nav className="panel mx-auto flex max-w-[1200px] items-center gap-2 rounded-2xl px-3 py-2">
        <Logo />
        <div className="ml-2 hidden items-center gap-0.5 sm:flex">
          {LINKS.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              className={`rounded-lg px-2.5 py-1.5 text-[12px] transition ${
                active === l.id
                  ? "bg-white/[0.07] text-ink"
                  : "text-muted hover:bg-white/[0.04] hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/#prompt"
            className="btn-ember flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[11.5px] font-semibold"
          >
            New brief <ArrowRight size={12} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
