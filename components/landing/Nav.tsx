"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const LINKS = [
  { href: "#studio", label: "Studio" },
  { href: "#templates", label: "Templates" },
  { href: "#craft", label: "Craft" },
  { href: "#pricing", label: "Credits" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:pt-5">
      <header
        className="panel mx-auto flex items-center justify-between rounded-full transition-all duration-500"
        style={{
          maxWidth: scrolled ? 880 : 1120,
          padding: scrolled ? "8px 10px 8px 16px" : "11px 12px 11px 18px",
          background: scrolled ? "rgba(12,14,20,.82)" : "rgba(255,255,255,.035)",
          boxShadow: scrolled ? "0 22px 60px -30px rgba(0,0,0,.9)" : undefined,
        }}
      >
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-[12.5px] text-muted transition hover:bg-white/[0.05] hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <Link
            href="/dashboard"
            className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] text-muted transition hover:bg-white/[0.05] hover:text-ink sm:flex"
          >
            <LayoutGrid size={13} />
            Projects
          </Link>
          <a
            href="#prompt"
            className="btn-ember flex h-9 items-center gap-1.5 rounded-full px-4 text-[12.5px] font-semibold"
          >
            Start a build
            <ArrowRight size={13} />
          </a>
        </div>
      </header>
    </div>
  );
}
