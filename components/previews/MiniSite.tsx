import type { GenreId } from "@/lib/types";

const THEME: Record<GenreId, { bg: string; ink: string; accent: string; soft: string; line: string }> = {
  commerce: { bg: "#FFFCF4", ink: "#14382A", accent: "#FFD447", soft: "#F3EDD8", line: "rgba(20,56,42,.14)" },
  streaming: { bg: "#08080A", ink: "#F2F0EB", accent: "#E3A342", soft: "#191A1E", line: "rgba(255,255,255,.12)" },
  video: { bg: "#FFFFFF", ink: "#1B1B1F", accent: "#E4572E", soft: "#F2F2F0", line: "rgba(27,27,31,.12)" },
  social: { bg: "#FBF8F3", ink: "#2A2622", accent: "#C0502E", soft: "#EFE7DA", line: "rgba(42,38,34,.13)" },
  saas: { bg: "#FAF8F3", ink: "#17150F", accent: "#0E6B4E", soft: "#EDE7DA", line: "rgba(23,21,15,.13)" },
  portfolio: { bg: "#F2EEE5", ink: "#22201B", accent: "#A8492E", soft: "#E2DACB", line: "rgba(34,32,27,.16)" },
};

const serif = "var(--font-display)";

function Chrome({ bg, line, url }: { bg: string; line: string; url: string }) {
  return (
    <div
      className="flex items-center gap-[2.4cqw] px-[2.6cqw]"
      style={{ height: "6.4%", background: bg, borderBottom: `1px solid ${line}` }}
    >
      <div className="flex gap-[1.1cqw]">
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} className="rounded-full opacity-70" style={{ width: "1.5cqw", height: "1.5cqw", background: c }} />
        ))}
      </div>
      <div
        className="flex-1 rounded-full px-[2cqw]"
        style={{
          height: "3.4cqw",
          background: "rgba(127,127,127,.1)",
          color: line,
          fontSize: "1.7cqw",
          lineHeight: "3.4cqw",
          letterSpacing: ".02em",
        }}
      >
        {url}
      </div>
    </div>
  );
}

function CommercePreview() {
  const t = THEME.commerce;
  return (
    <div className="flex h-full flex-col" style={{ background: t.bg, color: t.ink }}>
      <div
        className="flex items-center justify-between px-[4cqw]"
        style={{ height: "8%", background: "#14382A", color: "#F7F2DF", fontSize: "1.9cqw" }}
      >
        <span style={{ fontWeight: 700, fontSize: "2.5cqw", letterSpacing: "-.02em" }}>Verdant</span>
        <span className="rounded-full px-[2cqw]" style={{ background: "rgba(255,255,255,.12)", paddingBlock: ".5cqw" }}>
          10 min · Koramangala
        </span>
        <span>🛒 3</span>
      </div>
      <div className="flex flex-1 gap-[3cqw] px-[4cqw] pt-[3.4cqw]">
        <div className="flex w-[52%] flex-col justify-center">
          <span style={{ fontSize: "1.7cqw", fontWeight: 700, letterSpacing: ".16em", color: t.accent }}>FRESH IN 10</span>
          <div style={{ fontFamily: serif, fontSize: "7.4cqw", lineHeight: 0.94, letterSpacing: "-.035em", marginTop: "1.4cqw" }}>
            Groceries,
            <br />
            <em style={{ color: t.accent }}>in minutes.</em>
          </div>
          <div style={{ fontSize: "2cqw", opacity: 0.65, marginTop: "1.6cqw", maxWidth: "90%" }}>
            Produce picked this morning, at your door before the kettle boils.
          </div>
          <div
            className="mt-[2.2cqw] inline-flex w-fit items-center gap-[1.4cqw] rounded-full px-[2.6cqw]"
            style={{ background: "#14382A", color: "#FFFCF4", fontSize: "1.9cqw", fontWeight: 600, height: "4.6cqw" }}
          >
            Start shopping <span>→</span>
          </div>
        </div>
        <div className="relative flex-1">
          <div
            className="absolute inset-[6%_2%_10%_6%] rounded-[3cqw]"
            style={{ background: t.accent, boxShadow: "0 2cqw 5cqw -2cqw rgba(20,56,42,.4)" }}
          />
          <div
            className="absolute left-[14%] top-[9%] grid place-items-center rounded-full"
            style={{ width: "11cqw", height: "11cqw", background: "#FFFCF4", fontSize: "5cqw" }}
          >
            🍊
          </div>
          <div
            className="absolute right-[10%] top-[38%] grid place-items-center rounded-full"
            style={{ width: "9cqw", height: "9cqw", background: "#F7F2DF", fontSize: "4.2cqw" }}
          >
            🥖
          </div>
          <div
            className="absolute bottom-[13%] left-[20%] grid place-items-center rounded-full"
            style={{ width: "8cqw", height: "8cqw", background: "#F7F2DF", fontSize: "3.8cqw" }}
          >
            🌷
          </div>
        </div>
      </div>
      <div className="flex gap-[2cqw] px-[4cqw] pb-[3cqw] pt-[2cqw]">
        {[
          ["🍓", "Berries"],
          ["🥬", "Greens"],
          ["🥛", "Dairy"],
          ["🍞", "Bakery"],
        ].map(([e, n]) => (
          <div key={n} className="flex-1 rounded-[1.8cqw] px-[1.6cqw] py-[1.4cqw]" style={{ background: t.soft }}>
            <div style={{ fontSize: "3.4cqw" }}>{e}</div>
            <div style={{ fontSize: "1.6cqw", fontWeight: 600, marginTop: ".4cqw" }}>{n}</div>
            <div style={{ fontSize: "1.4cqw", opacity: 0.55 }}>from $2</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StreamingPreview() {
  const t = THEME.streaming;
  return (
    <div className="flex h-full flex-col" style={{ background: t.bg, color: t.ink }}>
      <div className="flex items-center justify-between px-[4cqw]" style={{ height: "8%", fontSize: "1.9cqw" }}>
        <span style={{ letterSpacing: ".34em", fontWeight: 600, fontSize: "2.1cqw" }}>NOCTURNE</span>
        <div className="flex items-center gap-[2.6cqw]" style={{ opacity: 0.7 }}>
          <span>Films</span>
          <span>Series</span>
          <span>Collections</span>
        </div>
        <span
          className="grid place-items-center rounded-full"
          style={{ width: "3cqw", height: "3cqw", background: t.accent, color: "#1a1205", fontSize: "1.5cqw", fontWeight: 700 }}
        >
          N
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 78% 18%, rgba(227,163,66,.34), transparent 56%), linear-gradient(115deg,#2b2420 0%,#141416 52%,#08080a 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg,#08080a 12%,rgba(8,8,10,.45) 48%,transparent 74%)" }}
        />
        <div className="absolute left-[4.4cqw] top-[14%] flex w-[56%] flex-col">
          <span style={{ color: t.accent, fontSize: "1.6cqw", letterSpacing: ".24em", fontWeight: 700 }}>NEW THIS WEEK</span>
          <div style={{ fontFamily: serif, fontSize: "8.2cqw", lineHeight: 0.92, marginTop: "1.2cqw", letterSpacing: "-.02em" }}>
            The Long
            <br />
            Night
          </div>
          <div className="mt-[1.4cqw] flex items-center gap-[1.6cqw]" style={{ fontSize: "1.7cqw", opacity: 0.72 }}>
            <span>2026</span>
            <span>·</span>
            <span>Limited series</span>
            <span>·</span>
            <span style={{ color: t.accent }}>★★★★★</span>
          </div>
          <div className="mt-[2.4cqw] flex items-center gap-[1.6cqw]">
            <span
              className="inline-flex items-center gap-[1.2cqw] rounded-full px-[2.4cqw]"
              style={{ background: t.accent, color: "#1a1205", height: "4.4cqw", fontSize: "1.9cqw", fontWeight: 700 }}
            >
              ▶ Play
            </span>
            <span
              className="inline-flex items-center gap-[1.2cqw] rounded-full px-[2.2cqw]"
              style={{ background: "rgba(255,255,255,.12)", height: "4.4cqw", fontSize: "1.8cqw" }}
            >
              + My list
            </span>
          </div>
        </div>
        <div className="absolute bottom-[7%] left-[4.4cqw] right-[4.4cqw]">
          <div style={{ fontSize: "1.6cqw", letterSpacing: ".18em", opacity: 0.6, marginBottom: "1.2cqw" }}>CONTINUE WATCHING</div>
          <div className="flex gap-[1.8cqw]">
            {[
              ["#3A2D24", "Ep. 4", 42],
              ["#232A31", "Ep. 2", 18],
              ["#32242A", "Ep. 6", 72],
            ].map(([bg, ep, p]) => (
              <div key={String(ep)} className="flex-1">
                <div className="relative overflow-hidden rounded-[1.2cqw]" style={{ aspectRatio: "16/9", background: bg }}>
                  <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 70% 30%, rgba(227,163,66,.28), transparent 60%)" }} />
                  <span
                    className="absolute right-[6%] top-[8%] rounded-full"
                    style={{ background: "rgba(0,0,0,.5)", padding: ".2cqw 1cqw", fontSize: "1.3cqw" }}
                  >
                    48m
                  </span>
                  <div className="absolute bottom-0 left-0 h-[.5cqw]" style={{ width: `${p}%`, background: t.accent }} />
                </div>
                <div style={{ fontSize: "1.5cqw", marginTop: ".6cqw", opacity: 0.7 }}>{ep}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoPreview() {
  const t = THEME.video;
  return (
    <div className="flex h-full flex-col" style={{ background: t.bg, color: t.ink }}>
      <div className="flex items-center gap-[2.4cqw] px-[3.6cqw]" style={{ height: "8%", borderBottom: `1px solid ${t.line}` }}>
        <span className="flex items-center gap-[1cqw]" style={{ fontSize: "2.4cqw", fontWeight: 700 }}>
          <span className="grid place-items-center rounded-[1cqw]" style={{ width: "3.4cqw", height: "3.4cqw", background: t.accent, color: "#fff", fontSize: "1.7cqw" }}>
            ▶
          </span>
          Signal
        </span>
        <span
          className="ml-[2cqw] flex flex-1 items-center rounded-full px-[2cqw]"
          style={{ height: "3.4cqw", background: t.soft, fontSize: "1.7cqw", color: "rgba(27,27,31,.45)" }}
        >
          Search makers, films, talks…
        </span>
        <span className="rounded-full" style={{ width: "3cqw", height: "3cqw", background: "linear-gradient(135deg,#F2B279,#B4553A)" }} />
      </div>
      <div className="flex flex-1 gap-[2.6cqw] px-[3.6cqw] py-[2.6cqw]">
        <div className="flex w-[63%] flex-col">
          <div className="relative overflow-hidden rounded-[1.6cqw]" style={{ aspectRatio: "16/9", background: "linear-gradient(135deg,#2b3a4a,#465d55 55%,#b98d5f)" }}>
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(circle at 30% 40%, rgba(255,255,255,.18), transparent 55%)" }}
            />
            <span
              className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
              style={{ width: "7.6cqw", height: "7.6cqw", background: "rgba(255,255,255,.92)", color: t.accent, fontSize: "2.8cqw" }}
            >
              ▶
            </span>
            <div className="absolute bottom-[6%] right-[4%] rounded-[.6cqw] px-[1cqw]" style={{ background: "rgba(0,0,0,.6)", color: "#fff", fontSize: "1.4cqw" }}>
              14:22
            </div>
          </div>
          <div style={{ fontSize: "2.6cqw", fontWeight: 650, marginTop: "1.6cqw", letterSpacing: "-.02em" }}>
            A quiet workshop, a loud idea
          </div>
          <div className="mt-[1cqw] flex items-center gap-[1.4cqw]" style={{ fontSize: "1.6cqw", opacity: 0.6 }}>
            <span className="rounded-full" style={{ width: "2.2cqw", height: "2.2cqw", background: "#2F6B57" }} />
            <span>Field Notes · 184K views · 2 days ago</span>
          </div>
          <div className="mt-[1.6cqw] flex gap-[1.2cqw]">
            {["👍 12K", "↗ Share", "＋ Subscribe"].map((label) => (
              <span
                key={label}
                className="rounded-full px-[1.8cqw]"
                style={{
                  background: label.startsWith("＋") ? t.accent : t.soft,
                  color: label.startsWith("＋") ? "#fff" : t.ink,
                  fontSize: "1.5cqw",
                  height: "3.2cqw",
                  lineHeight: "3.2cqw",
                  fontWeight: 600,
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-[1.8cqw]">
          <div style={{ fontSize: "1.5cqw", letterSpacing: ".14em", fontWeight: 700, opacity: 0.5 }}>UP NEXT</div>
          {[
            ["#384A5C", "Making a chair from one plank"],
            ["#5C4438", "The sound of a quiet room"],
            ["#2F4A41", "Tools I would buy again"],
          ].map(([bg, title]) => (
            <div key={title} className="flex gap-[1.4cqw]">
              <div className="relative w-[42%] shrink-0 overflow-hidden rounded-[.9cqw]" style={{ aspectRatio: "16/9", background: bg }} />
              <div style={{ fontSize: "1.55cqw", lineHeight: 1.25, fontWeight: 550 }}>{title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SocialPreview() {
  const t = THEME.social;
  return (
    <div className="flex h-full flex-col" style={{ background: t.bg, color: t.ink }}>
      <div className="relative flex items-center justify-center px-[4cqw]" style={{ height: "9%" }}>
        <span style={{ fontFamily: serif, fontSize: "4.2cqw", letterSpacing: "-.02em" }}>Marlow</span>
        <span className="absolute right-[4cqw] flex gap-[2.4cqw]" style={{ fontSize: "2.4cqw", opacity: 0.7 }}>
          <span>⌕</span>
          <span>♡</span>
        </span>
      </div>
      <div className="flex gap-[1.8cqw] px-[3.6cqw] pb-[2.2cqw]">
        {["#B55A3B", "#3F5E4A", "#7E6A8C", "#C58F55"].map((tone, i) => (
          <div key={tone} className="flex flex-col items-center gap-[.7cqw]">
            <span
              className="rounded-full"
              style={{
                width: "6cqw",
                height: "6cqw",
                padding: ".5cqw",
                background: `conic-gradient(${t.accent} 0 72%, ${t.line} 72% 100%)`,
              }}
            >
              <span className="block h-full w-full rounded-full border-[2px]" style={{ background: tone, borderColor: t.bg }} />
            </span>
            <span style={{ fontSize: "1.25cqw", opacity: i === 0 ? 0.9 : 0.55 }}>{["you", "ada", "ivo", "noor"][i]}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-1 justify-center gap-[2.4cqw] px-[4cqw]">
        <div className="w-[58%] overflow-hidden rounded-[2cqw]" style={{ border: `1px solid ${t.line}`, background: "#fff" }}>
          <div className="flex items-center gap-[1.2cqw] px-[2cqw] py-[1.6cqw]">
            <span className="rounded-full" style={{ width: "3.4cqw", height: "3.4cqw", background: "#B55A3B" }} />
            <span style={{ fontSize: "1.65cqw", fontWeight: 650 }}>ada.whitfield</span>
            <span className="ml-auto" style={{ fontSize: "1.8cqw", opacity: 0.5 }}>
              ···
            </span>
          </div>
          <div
            className="relative"
            style={{
              aspectRatio: "1/1",
              background: "radial-gradient(circle at 32% 28%, #e7c9a6, #bd7f58 46%, #6f4531 100%)",
            }}
          >
            <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, transparent 40%, rgba(30,20,14,.3))" }} />
            <span
              className="absolute bottom-[6%] left-[6%] rounded-full px-[1.4cqw] py-[.4cqw]"
              style={{ background: "rgba(251,248,243,.9)", fontSize: "1.3cqw", fontWeight: 600 }}
            >
              ◷ morning light
            </span>
          </div>
          <div className="px-[2cqw] pb-[2cqw] pt-[1.4cqw]">
            <div className="flex gap-[1.6cqw]" style={{ fontSize: "2.4cqw" }}>
              <span style={{ color: t.accent }}>♥</span>
              <span>◯</span>
              <span>↗</span>
              <span className="ml-auto">⌘</span>
            </div>
            <div style={{ fontSize: "1.5cqw", fontWeight: 650, marginTop: "1cqw" }}>2,418 likes</div>
            <div style={{ fontSize: "1.45cqw", marginTop: ".6cqw", opacity: 0.72, lineHeight: 1.35 }}>
              <b>ada.whitfield</b> Slow start, long table, nothing urgent.
            </div>
          </div>
        </div>
        <div className="hidden w-[30%] flex-col gap-[1.6cqw] pt-[1cqw] md:flex">
          <div className="flex items-center gap-[1.2cqw]">
            <span className="rounded-full" style={{ width: "4cqw", height: "4cqw", background: "#3F5E4A" }} />
            <div>
              <div style={{ fontSize: "1.5cqw", fontWeight: 650 }}>juneandjuly</div>
              <div style={{ fontSize: "1.3cqw", opacity: 0.55 }}>June Halloway</div>
            </div>
          </div>
          {["#7E6A8C", "#C58F55", "#4A6370"].map((tone, i) => (
            <div key={tone} className="flex items-center gap-[1.1cqw]">
              <span className="rounded-full" style={{ width: "3.2cqw", height: "3.2cqw", background: tone }} />
              <div className="flex-1">
                <div style={{ fontSize: "1.35cqw", fontWeight: 600 }}>{["ivo.marchetti", "noor.haddad", "atelier.voss"][i]}</div>
                <div style={{ fontSize: "1.15cqw", opacity: 0.5 }}>Suggested for you</div>
              </div>
              <span style={{ fontSize: "1.3cqw", color: t.accent, fontWeight: 600 }}>Follow</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SaasPreview() {
  const t = THEME.saas;
  return (
    <div className="flex h-full flex-col" style={{ background: t.bg, color: t.ink }}>
      <div className="flex items-center justify-between px-[4cqw]" style={{ height: "8%", fontSize: "1.8cqw" }}>
        <span className="flex items-center gap-[1cqw]" style={{ fontWeight: 700, fontSize: "2.2cqw" }}>
          <span className="rounded-[.6cqw]" style={{ width: "2.6cqw", height: "2.6cqw", background: t.accent }} />
          Ledgerline
        </span>
        <div className="flex gap-[2.4cqw]" style={{ opacity: 0.6 }}>
          <span>Product</span>
          <span>Pricing</span>
          <span>Customers</span>
        </div>
        <span className="rounded-full px-[1.8cqw]" style={{ border: `1px solid ${t.ink}`, height: "3.2cqw", lineHeight: "3.1cqw", fontWeight: 600 }}>
          Start free
        </span>
      </div>
      <div className="flex flex-1 gap-[3.4cqw] px-[4cqw] pt-[2.8cqw]">
        <div className="flex w-[44%] flex-col justify-center">
          <span style={{ fontSize: "1.55cqw", letterSpacing: ".2em", fontWeight: 700, color: t.accent }}>INVOICING, SORTED</span>
          <div style={{ fontFamily: serif, fontSize: "6.6cqw", lineHeight: 0.98, letterSpacing: "-.03em", marginTop: "1.2cqw" }}>
            Know exactly
            <br />
            where the money
            <br />
            went.
          </div>
          <div style={{ fontSize: "1.85cqw", opacity: 0.62, marginTop: "1.6cqw", maxWidth: "94%", lineHeight: 1.4 }}>
            One clear ledger for invoices, payouts and the month ahead.
          </div>
          <div className="mt-[2.2cqw] flex gap-[1.2cqw]">
            <span className="rounded-full px-[2cqw]" style={{ background: t.accent, color: "#fff", fontSize: "1.7cqw", height: "4cqw", lineHeight: "4cqw", fontWeight: 600 }}>
              Start free
            </span>
            <span className="rounded-full px-[2cqw]" style={{ border: `1px solid ${t.line}`, fontSize: "1.7cqw", height: "4cqw", lineHeight: "3.9cqw" }}>
              See the demo
            </span>
          </div>
        </div>
        <div className="relative flex-1">
          <div
            className="absolute inset-x-0 top-[4%] flex overflow-hidden rounded-[2cqw]"
            style={{ background: "#fff", border: `1px solid ${t.line}`, boxShadow: "0 2.4cqw 6cqw -3cqw rgba(23,21,15,.35)", height: "86%" }}
          >
            <div className="flex w-[16%] flex-col gap-[2.2cqw] px-[1.2cqw] py-[2cqw]" style={{ background: "#12251D" }}>
              <span className="rounded-full" style={{ width: "2.2cqw", height: "2.2cqw", background: "rgba(255,255,255,.3)" }} />
              {[1, 2, 3, 4].map((i) => (
                <span key={i} className="rounded-[.4cqw]" style={{ height: ".9cqw", width: `${60 + i * 6}%`, background: `rgba(255,255,255,${i === 1 ? 0.55 : 0.2})` }} />
              ))}
            </div>
            <div className="flex flex-1 flex-col px-[2cqw] py-[1.8cqw]">
              <div className="flex items-center justify-between" style={{ fontSize: "1.7cqw", fontWeight: 650 }}>
                <span>This month</span>
                <span style={{ opacity: 0.45 }}>Oct 2026</span>
              </div>
              <div className="mt-[1.4cqw] grid grid-cols-3 gap-[1.2cqw]">
                {[
                  ["Revenue", "$48.2k", "+12%"],
                  ["Outstanding", "$6.1k", "−4%"],
                  ["Runway", "9.4 mo", "+1"],
                ].map(([k, v, d]) => (
                  <div key={k} className="rounded-[1cqw] px-[1.2cqw] py-[1cqw]" style={{ background: t.bg, border: `1px solid ${t.line}` }}>
                    <div style={{ fontSize: "1.25cqw", opacity: 0.55 }}>{k}</div>
                    <div style={{ fontSize: "2.3cqw", fontWeight: 650, letterSpacing: "-.02em", marginTop: ".3cqw" }}>{v}</div>
                    <div style={{ fontSize: "1.05cqw", color: t.accent }}>{d}</div>
                  </div>
                ))}
              </div>
              <div className="mt-[1.6cqw] flex-1 rounded-[1cqw] px-[1.4cqw] pb-[1.2cqw] pt-[1.2cqw]" style={{ border: `1px solid ${t.line}` }}>
                <div style={{ fontSize: "1.25cqw", opacity: 0.55 }}>Cashflow</div>
                <div className="flex h-[62%] items-end gap-[.9cqw] pt-[1.4cqw]">
                  {[34, 52, 40, 66, 48, 74, 58, 88, 70, 92, 76, 96].map((h, i) => (
                    <span
                      key={i}
                      className="flex-1 rounded-t-[.3cqw]"
                      style={{ height: `${h}%`, background: i === 11 ? t.accent : "rgba(14,107,78,.22)" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute bottom-[2%] left-[-8%] rounded-[1.2cqw] px-[1.6cqw] py-[1.1cqw]"
            style={{ background: "#12251D", color: "#EAF3EE", fontSize: "1.4cqw", boxShadow: "0 1.4cqw 3cqw -1.4cqw rgba(0,0,0,.5)" }}
          >
            <span style={{ opacity: 0.6 }}>Invoice #2241</span> paid · $2,480
          </div>
        </div>
      </div>
      <div className="flex items-center gap-[4cqw] px-[4cqw] pb-[2.4cqw] pt-[1cqw]" style={{ opacity: 0.35, fontSize: "1.7cqw", letterSpacing: ".08em", fontWeight: 650 }}>
        <span>ARDENT</span>
        <span>FOLD</span>
        <span>PURL</span>
        <span>TALLGRASS</span>
        <span>NOOK</span>
      </div>
    </div>
  );
}

function PortfolioPreview() {
  const t = THEME.portfolio;
  return (
    <div className="flex h-full flex-col" style={{ background: t.bg, color: t.ink }}>
      <div className="flex items-center justify-between px-[4cqw]" style={{ height: "8%", fontSize: "1.7cqw" }}>
        <span style={{ fontWeight: 600, letterSpacing: ".04em" }}>Elin Ward</span>
        <div className="flex gap-[2.6cqw]" style={{ opacity: 0.6 }}>
          <span>Work</span>
          <span>About</span>
          <span>Contact</span>
        </div>
        <span className="flex items-center gap-[.8cqw]" style={{ fontSize: "1.4cqw", opacity: 0.75 }}>
          <span className="rounded-full" style={{ width: "1cqw", height: "1cqw", background: t.accent }} />
          Available for commissions
        </span>
      </div>
      <div className="flex flex-1 flex-col px-[4.4cqw] pt-[3.4cqw]">
        <div style={{ fontFamily: serif, fontSize: "9.6cqw", lineHeight: 0.9, letterSpacing: "-.03em" }}>
          Objects for
          <br />
          <em>quiet</em> rooms.
        </div>
        <div className="mt-[1.8cqw] flex items-start justify-between">
          <div style={{ fontSize: "1.85cqw", opacity: 0.62, maxWidth: "48%", lineHeight: 1.45 }}>
            Furniture and objects made slowly in a small workshop outside Oslo.
          </div>
          <div className="flex gap-[.8cqw]">
            {["#B58A5C", "#D8CDBB", "#9FA5A8"].map((c) => (
              <span key={c} className="rounded-[.8cqw]" style={{ width: "4.6cqw", height: "4.6cqw", background: c }} />
            ))}
          </div>
        </div>
        <div className="mt-[2.6cqw] flex flex-col">
          {[
            ["01", "Oak side table", "2026"],
            ["02", "Linen lounge chair", "2025"],
            ["03", "Aluminium vessel", "2025"],
          ].map(([n, name, y], i) => (
            <div
              key={n}
              className="flex items-center gap-[2.4cqw] py-[1.6cqw]"
              style={{ borderTop: `1px solid ${t.line}`, borderBottom: i === 2 ? `1px solid ${t.line}` : "none", fontSize: "2.2cqw" }}
            >
              <span style={{ opacity: 0.45, fontSize: "1.4cqw", width: "5%" }}>{n}</span>
              <span style={{ flex: 1, fontFamily: serif, fontSize: "3cqw" }}>{name}</span>
              <span style={{ opacity: 0.45, fontSize: "1.4cqw" }}>{y}</span>
              <span style={{ opacity: 0.5 }}>↗</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between px-[4.4cqw] pb-[2.6cqw]" style={{ fontSize: "1.5cqw", opacity: 0.5 }}>
        <span>Oslo, Norway</span>
        <span>hello@elinward.studio</span>
      </div>
    </div>
  );
}

export function MiniSite({
  genre,
  className = "",
  url,
}: {
  genre: GenreId;
  className?: string;
  url?: string;
}) {
  const hostnames: Record<GenreId, string> = {
    commerce: "verdant.market",
    streaming: "nocturne.film",
    video: "signal.video",
    social: "marlow.app",
    saas: "ledgerline.com",
    portfolio: "elinward.studio",
  };
  const content =
    genre === "commerce" ? (
      <CommercePreview />
    ) : genre === "streaming" ? (
      <StreamingPreview />
    ) : genre === "video" ? (
      <VideoPreview />
    ) : genre === "social" ? (
      <SocialPreview />
    ) : genre === "saas" ? (
      <SaasPreview />
    ) : (
      <PortfolioPreview />
    );

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        containerType: "inline-size",
        aspectRatio: "16 / 10",
        borderRadius: "3.6%",
        boxShadow: "0 30px 90px -30px rgba(0,0,0,.85), 0 0 0 1px rgba(255,255,255,.08)",
        background: THEME[genre].bg,
      }}
      aria-hidden="true"
    >
      <div className="flex h-full flex-col">
        <Chrome bg={THEME[genre].bg} line={THEME[genre].line} url={url ?? hostnames[genre]} />
        <div className="min-h-0 flex-1">{content}</div>
      </div>
    </div>
  );
}
