import Link from "next/link";

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <span
      className="relative grid place-items-center overflow-hidden rounded-[9px]"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(145deg,#1b1e26,#0b0d12)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.14), 0 6px 18px -8px rgba(0,0,0,.9)",
        border: "1px solid rgba(255,255,255,.1)",
      }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="atelier-mark" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff3d5a" />
            <stop offset=".52" stopColor="#ff6a3d" />
            <stop offset="1" stopColor="#ffb020" />
          </linearGradient>
        </defs>
        <path d="M5.6 19.4 12 4.9l6.4 14.5" stroke="url(#atelier-mark)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.5 14.4h7" stroke="url(#atelier-mark)" strokeWidth="1.9" strokeLinecap="round" />
        <circle cx="18.6" cy="5.6" r="1.5" fill="#ffb020" />
      </svg>
    </span>
  );
}

export function Logo({ href = "/", compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5" aria-label="Atelier home">
      <LogoMark />
      {!compact && (
        <span className="font-display text-[21px] leading-none tracking-[-0.02em] text-ink">
          Atelier
        </span>
      )}
    </Link>
  );
}
