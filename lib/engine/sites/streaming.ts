import {
  BuiltSite,
  FONT_LINK,
  esc,
  initialsAvatar,
  photo,
  pick,
  rng,
  runtimeJs,
  shuffle,
} from "../base";
import { Theme, renderTokens, withRadius } from "../theme";

type Opts = { seed: string; palette: number; radius: number; sections: string[] };

const BRANDS = ["Solstice", "Umbra House", "Kinema", "Northstar", "Cinder"];

const TITLES = [
  {
    t: "The Quiet Orbit",
    y: 2026,
    k: "Limited series",
    g: "Sci-fi drama",
    r: "8 episodes",
    s: "8.7",
    d: "A salvage pilot wakes from cryosleep to find her crew gone — and the station orbiting a star that shouldn't exist.",
    cast: ["Mara Oyelaran", "Jonas Reeve", "Ise Adeyemi"],
    seed: "quiet-orbit",
    mark: "Original",
  },
  {
    t: "Salt & Static",
    y: 2025,
    k: "Series",
    g: "Mystery",
    r: "6 episodes",
    s: "8.4",
    d: "Two rival late-night radio hosts in a fading coastal town start receiving calls from a year that hasn't happened yet.",
    cast: ["Ines Calder", "Rook Ahn", "Tilda Brann"],
    seed: "salt-static",
    mark: "New season",
  },
  {
    t: "Northbound",
    y: 2026,
    k: "Film",
    g: "Drama",
    r: "1h 52m",
    s: "8.1",
    d: "A father and his estranged daughter drive fourteen hundred miles to return a borrowed piano before winter closes the pass.",
    cast: ["Dev Malhotra", "June Halloway", "Piet Visser"],
    seed: "northbound",
    mark: "Award winner",
  },
  {
    t: "Paper Lions",
    y: 2024,
    k: "Film",
    g: "Thriller",
    r: "2h 06m",
    s: "8.5",
    d: "In 1974 Lisbon, a forger is hired to print the revolution — and discovers the ink is worth more than the money.",
    cast: ["Ana Ferreira", "Luca Serra", "Milo Dax"],
    seed: "paper-lions",
    mark: "Critics' pick",
  },
  {
    t: "The Glasshouse Rule",
    y: 2025,
    k: "Series",
    g: "Drama",
    r: "7 episodes",
    s: "8.2",
    d: "A botanist inherits a failing greenhouse, a mountain of debt, and the family secret buried under the orchid beds.",
    cast: ["Elin Ward", "Sam Okafor", "Greta Lind"],
    seed: "glasshouse",
    mark: "",
  },
  {
    t: "Low Tide, High Wire",
    y: 2026,
    k: "Film",
    g: "Drama",
    r: "1h 44m",
    s: "7.9",
    d: "A retired tightrope walker agrees to train a circus kid, then discovers the kid is afraid of heights.",
    cast: ["Bram de Wit", "Noor Haddad", "Kai Mercer"],
    seed: "low-tide",
    mark: "",
  },
  {
    t: "Signal Fires",
    y: 2025,
    k: "Limited series",
    g: "Thriller",
    r: "5 episodes",
    s: "8.6",
    d: "Six strangers on a remote ridge see a light answer back. By morning, one of them has disappeared.",
    cast: ["Priya Nair", "Owen Slate", "Hana Mori"],
    seed: "signal-fires",
    mark: "Original",
  },
  {
    t: "Velvet Machinery",
    y: 2024,
    k: "Film",
    g: "Noir",
    r: "1h 58m",
    s: "8.0",
    d: "A factory foreman in post-war Milan takes a second job as a nightclub pianist. Both jobs turn out to be the same job.",
    cast: ["Renzo Vitale", "Clara Moreau", "Ivo Bassi"],
    seed: "velvet-machinery",
    mark: "",
  },
  {
    t: "The Longest Tuesday",
    y: 2026,
    k: "Film",
    g: "Comedy",
    r: "1h 39m",
    s: "7.7",
    d: "A wedding planner relives the same Tuesday until she gets one impossible client's wedding exactly right.",
    cast: ["Sofia Renn", "Arlo Beck", "Mimi Zhang"],
    seed: "longest-tuesday",
    mark: "",
  },
  {
    t: "Kestrel",
    y: 2025,
    k: "Series",
    g: "Spy thriller",
    r: "8 episodes",
    s: "8.8",
    d: "An analyst who has never left the building is suddenly the only person who knows where the building went.",
    cast: ["Nadia Venn", "Thomas Ives", "Bilal Farouk"],
    seed: "kestrel",
    mark: "Returning",
  },
  {
    t: "Static Bloom",
    y: 2026,
    k: "Film",
    g: "Horror",
    r: "1h 47m",
    s: "7.6",
    d: "A sound engineer restoring a lost album starts hearing a ninth track that was never recorded.",
    cast: ["Etta Lune", "Cormac Vale", "Yara Sadeghi"],
    seed: "static-bloom",
    mark: "",
  },
  {
    t: "Blue Hour Hotel",
    y: 2024,
    k: "Series",
    g: "Drama",
    r: "10 episodes",
    s: "8.3",
    d: "The overnight staff of a once-grand hotel keep the lights on for guests who may never check out.",
    cast: ["Lena Kovac", "Hugo Reyes", "Mabel Achebe"],
    seed: "blue-hour",
    mark: "",
  },
];

function palettesFor(): Theme[] {
  const base: Theme = {
    bg: "#08080a",
    surface: "#111116",
    surface2: "#191920",
    text: "#f7f3ec",
    muted: "#a49d92",
    line: "rgba(255,255,255,0.09)",
    accent: "#e3a342",
    accentInk: "#1a1205",
    accentSoft: "rgba(227,163,66,0.13)",
    radius: 12,
    max: "1280px",
    display: '"Sora", system-ui, sans-serif',
    body: '"Manrope", system-ui, sans-serif',
    displayWeight: 600,
    displayTracking: "-0.035em",
    fontsLink: FONT_LINK("family=Manrope:wght@400;500;600;700&family=Sora:wght@500;600;700"),
  };
  return [
    base,
    {
      ...base,
      accent: "#ff7a59",
      accentInk: "#1c0903",
      accentSoft: "rgba(255,122,89,0.14)",
      bg: "#09080a",
    },
    {
      ...base,
      accent: "#aebcff",
      accentInk: "#0c1030",
      accentSoft: "rgba(174,188,255,0.14)",
    },
  ];
}

const icons = {
  play: `<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M8 5.4v13.2L19 12z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`,
  chevron: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>`,
  search: `<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>`,
  close: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
};

function monogramSvg(accent: string) {
  return `<svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true"><circle cx="14" cy="14" r="12" fill="none" stroke="${accent}" stroke-width="1.3" opacity=".55"/><path d="M18.4 8.2a7.6 7.6 0 1 0 0 11.6 8.8 8.8 0 0 1 0-11.6z" fill="${accent}"/></svg>`;
}

export function buildStreaming(opts: Opts): BuiltSite {
  const pal = palettesFor()[opts.palette % 3];
  const r = rng(opts.seed);
  const t = withRadius(pal, opts.radius);
  const brand = pick(BRANDS, r);
  const tagline = pick(
    ["Stories after dark.", "Cinema, without the queue.", "A quieter kind of epic."],
    r,
  );
  const titles = shuffle(TITLES, r);
  const heroes = titles.slice(0, 3);
  const rest = titles.slice(3);
  const hasTop10 = opts.sections.includes("top10");
  const hasCollection = opts.sections.includes("collection");

  const poster = (x: (typeof TITLES)[number], i: number, extra = "") => `
      <button class="poster ${extra}" data-open="${titles.indexOf(x)}" aria-label="Open ${esc(x.t)}">
        <span class="poster-art"><img src="${photo(x.seed, 420, 630, true)}" alt="Poster for ${esc(
          x.t,
        )}" loading="lazy" />
          <span class="poster-shade"></span>
          <span class="poster-meta"><span class="poster-play">${icons.play}</span></span>
        </span>
        <span class="poster-title">${esc(x.t)}</span>
        <span class="poster-sub">${x.y} · ${esc(x.g)} · ★ ${x.s}</span>
      </button>`;

  const wide = (x: (typeof TITLES)[number], pct: number) => `
      <button class="wcard" data-open="${titles.indexOf(x)}" aria-label="Play ${esc(x.t)}">
        <span class="wcard-art img-zoom"><img src="${photo(x.seed + "-wide", 640, 360)}" alt="Still from ${esc(
          x.t,
        )}" loading="lazy" />
          <span class="wcard-scrim"></span>
          <span class="wcard-play">${icons.play}</span>
          ${
            pct
              ? `<span class="wprogress" aria-hidden="true"><i style="width:${pct}%"></i></span>`
              : ""
          }
        </span>
        <span class="wcard-body">
          <span class="wcard-title">${esc(x.t)}</span>
          <span class="wcard-sub">${pct ? `${pct}% watched · ${esc(x.r)}` : `${x.y} · ${esc(x.g)}`}</span>
        </span>
      </button>`;

  const heroSlides = heroes
    .map(
      (x, i) => `
      <article class="hero-slide ${i === 0 ? "is-active" : ""}" data-slide="${i}" aria-hidden="${
        i === 0 ? "false" : "true"
      }">
        <img class="hero-bg" src="${photo(x.seed + "-hero", 1700, 960)}" alt="Key art for ${esc(
          x.t,
        )}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} />
        <div class="hero-scrim"></div>
        <div class="hero-inner container">
          <p class="hero-kicker"><span class="dot"></span> ${esc(brand)} ${esc(
            x.mark || "Original",
          )} <span class="hero-sep">·</span> ${esc(x.k)}</p>
          <h1 class="display hero-title">${esc(x.t)}</h1>
          <div class="hero-meta"><span class="rating">★ ${x.s}</span><span>${x.y}</span><span>${esc(
            x.g,
          )}</span><span>${esc(x.r)}</span><span class="tag">HDR</span></div>
          <p class="hero-desc">${esc(x.d)}</p>
          <div class="hero-actions">
            <button class="btn btn--primary" data-open="${titles.indexOf(x)}">${icons.play} Play ${
              x.k === "Film" ? "film" : "episode 1"
            }</button>
            <button class="btn btn--ghost" data-list>${icons.plus} My list</button>
            <span class="hero-hint">Press <kbd>P</kbd> to play</span>
          </div>
        </div>
      </article>`,
    )
    .join("");

  const dots = heroes
    .map(
      (x, i) =>
        `<button class="hero-dot ${i === 0 ? "is-active" : ""}" data-dot="${i}" aria-label="Show ${esc(
          x.t,
        )}"><span>${esc(x.t)}</span></button>`,
    )
    .join("");

  const top10 = hasTop10
    ? `<section class="row container reveal">
        <div class="row-head"><h2 class="display">Top 10 in your country today</h2><a class="row-link" href="#top">See the list ${icons.chevron}</a></div>
        <div class="rail rail--rank">
          ${rest
            .slice(0, 8)
            .map(
              (x, i) => `<div class="rank-item"><span class="rank-num" aria-hidden="true">${
                i + 1
              }</span>${poster(x, i)}</div>`,
            )
            .join("")}
        </div>
      </section>`
    : "";

  const collection = hasCollection
    ? `<section class="container reveal">
        <div class="collection">
          <img class="collection-bg" src="${photo(
            "collection-quiet-thrillers",
            1600,
            600,
          )}" alt="Fog rolling over a coastal road at dusk" loading="lazy" />
          <div class="collection-scrim"></div>
          <div class="collection-body">
            <p class="eyebrow">Curated by the Solstice editors</p>
            <h2 class="display collection-title">Quiet thrillers for a loud week.</h2>
            <p class="collection-copy">Six films that prefer a held breath to a car chase. Watch in order, lights low.</p>
            <button class="btn btn--ghost" data-open="${titles.indexOf(
              titles[7],
            )}">Enter the collection ${icons.chevron}</button>
          </div>
          <div class="collection-stack">
            ${titles
              .slice(7, 10)
              .map(
                (x) => `<button class="stack-poster" data-open="${titles.indexOf(
                  x,
                )}" aria-label="${esc(x.t)}"><img src="${photo(
                  x.seed,
                  200,
                  300,
                  true,
                )}" alt="Poster for ${esc(x.t)}" loading="lazy" /></button>`,
              )
              .join("")}
          </div>
        </div>
      </section>`
    : "";

  const profiles = ["Alex", "Noor", "Kids"]
    .map(
      (p, i) =>
        `<button class="profile-row" data-profile="${i}">${initialsAvatar(
          p,
          ["#c98a3c", "#5b6ec9", "#3c9b76"][i],
          30,
        )}<span>${p}</span>${i === 0 ? '<span class="profile-current">Current</span>' : ""}</button>`,
    )
    .join("");

  const body = `
  <a class="skip" href="#main">Skip to content</a>
  <header class="nav" data-header>
    <div class="nav-inner container">
      <a class="brand" href="#top" aria-label="${esc(brand)} home">
        ${monogramSvg(t.accent)}
        <span class="brand-word">${esc(brand).toUpperCase()}</span>
      </a>
      <nav class="nav-links" aria-label="Primary">
        <a href="#main">Films</a><a href="#trending">Series</a><a href="#collection">Collections</a><a href="#footer">My list</a>
      </nav>
      <div class="nav-right">
        <button class="icon-btn" aria-label="Search">${icons.search}</button>
        <div class="profile-wrap">
          <button class="profile-btn" aria-label="Switch profile" aria-expanded="false" data-profile-toggle>
            ${initialsAvatar("Alex", "#c98a3c", 28)}
            <span class="avatar-caret" aria-hidden="true">▾</span>
          </button>
          <div class="profile-menu" role="menu">${profiles}<span class="profile-note">Profiles are stored locally in this preview.</span></div>
        </div>
      </div>
    </div>
  </header>

  <main id="main">
    <section class="hero" id="top">
      <div class="hero-slides">${heroSlides}</div>
      <div class="hero-dots" role="tablist" aria-label="Featured titles">${dots}</div>
    </section>

    <div class="rows">
      <section class="row container reveal" id="continue">
        <div class="row-head"><h2 class="display">Continue watching</h2><span class="row-sub">${esc(
          heroes[0].t,
        )} · S1 E4</span></div>
        <div class="rail rail--wide">${rest
          .slice(0, 6)
          .map((x, i) => wide(x, [68, 32, 81, 14, 47, 22][i]))
          .join("")}</div>
      </section>

      <section class="row container reveal" id="trending">
        <div class="row-head"><h2 class="display">Trending this week</h2><a class="row-link" href="#top">See all ${icons.chevron}</a></div>
        <div class="rail">${titles.slice(0, 7).map((x, i) => poster(x, i)).join("")}</div>
      </section>

      ${top10}

      <section class="row container reveal" id="collection">
        <div class="row-head"><h2 class="display">New from ${esc(brand)}</h2><span class="row-sub">Added this week</span></div>
        <div class="rail rail--wide">${rest
          .slice(6, 11)
          .map((x) => wide(x, 0))
          .join("")}</div>
      </section>

      ${collection}

      <section class="row container reveal">
        <div class="row-head"><h2 class="display">Because you watched <em>Northbound</em></h2><span class="row-sub">Quiet dramas, long drives</span></div>
        <div class="rail">${rest
          .slice(2, 9)
          .map((x, i) => poster(x, i))
          .join("")}</div>
      </section>
    </div>
  </main>

  <footer class="footer" id="footer">
    <div class="container footer-grid">
      <div>
        <div class="brand brand--footer">${monogramSvg(t.accent)}<span class="brand-word">${esc(
          brand,
        ).toUpperCase()}</span></div>
        <p class="footer-copy">${esc(
          tagline,
        )} A fictional streaming service generated with Atelier. All titles, people and studios are invented.</p>
      </div>
      <nav aria-label="Footer"><p class="footer-head">Browse</p><a href="#main">Films</a><a href="#trending">Series</a><a href="#collection">Collections</a></nav>
      <nav aria-label="Account"><p class="footer-head">Account</p><a href="#footer">My list</a><a href="#footer">Profiles</a><a href="#footer">Settings</a></nav>
      <nav aria-label="Legal"><p class="footer-head">Legal</p><a href="#footer">Terms</a><a href="#footer">Privacy</a><a href="#footer">Accessibility</a></nav>
    </div>
    <div class="container footer-bottom"><span>© 2026 ${esc(
      brand,
    )} Media. A demonstration site.</span><span class="mono">built with atelier</span></div>
  </footer>

  <div class="modal" id="title-modal" data-close-on-esc role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-backdrop" data-close></div>
    <div class="modal-card">
      <div class="modal-hero"><img id="modal-img" src="" alt="" /><div class="modal-scrim"></div>
        <button class="modal-close" data-close aria-label="Close details">${icons.close}</button>
      </div>
      <div class="modal-body">
        <p class="eyebrow" id="modal-kicker"></p>
        <h2 class="display modal-title" id="modal-title"></h2>
        <div class="modal-meta" id="modal-meta"></div>
        <p class="modal-desc" id="modal-desc"></p>
        <div class="modal-cast" id="modal-cast"></div>
        <div class="modal-actions">
          <button class="btn btn--primary">${icons.play} Play</button>
          <button class="btn btn--ghost">${icons.plus} My list</button>
          <span class="modal-note">Preview only — playback is simulated.</span>
        </div>
      </div>
    </div>
  </div>

  <style>
    .skip{position:absolute;left:16px;top:-48px;z-index:200;background:var(--accent);color:var(--accent-ink);padding:10px 16px;border-radius:8px;font-weight:600;transition:top .2s}
    .skip:focus{top:14px}
    .nav{position:fixed;inset:0 0 auto;z-index:60;padding:20px 0;transition:padding .4s var(--ease),background .4s var(--ease),border-color .4s}
    .nav.is-stuck{padding:10px 0;background:rgba(8,8,10,.78);backdrop-filter:blur(18px) saturate(130%);border-bottom:1px solid var(--line)}
    .nav-inner{display:flex;align-items:center;gap:34px}
    .brand{display:inline-flex;align-items:center;gap:10px}
    .brand-word{font-size:11.5px;font-weight:700;letter-spacing:.32em}
    .nav-links{display:flex;gap:26px;font-size:13px;color:var(--muted)}
    .nav-links a{position:relative;padding:4px 0;transition:color .25s}
    .nav-links a:hover{color:var(--text)}
    .nav-links a::after{content:"";position:absolute;left:0;right:100%;bottom:0;height:1px;background:var(--accent);transition:right .35s var(--ease)}
    .nav-links a:hover::after{right:0}
    .nav-right{margin-left:auto;display:flex;align-items:center;gap:10px}
    .icon-btn{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;border:1px solid transparent;color:var(--muted);transition:.25s}
    .icon-btn:hover{color:var(--text);border-color:var(--line);background:var(--surface)}
    .profile-wrap{position:relative}
    .profile-btn{display:flex;align-items:center;gap:6px;padding:4px;border-radius:99px;border:1px solid var(--line);transition:.25s}
    .profile-btn:hover{border-color:var(--accent)}
    .avatar-caret{font-size:9px;color:var(--muted);padding-right:4px}
    .profile-menu{position:absolute;right:0;top:calc(100% + 10px);width:210px;padding:8px;border-radius:14px;background:#101014;border:1px solid var(--line);box-shadow:0 30px 60px -20px rgba(0,0,0,.9);opacity:0;visibility:hidden;transform:translateY(-6px);transition:.3s var(--ease)}
    .profile-menu.is-open{opacity:1;visibility:visible;transform:none}
    .profile-row{display:flex;align-items:center;gap:10px;width:100%;padding:8px;border-radius:9px;font-size:13px;text-align:left}
    .profile-row:hover{background:var(--surface)}
    .profile-current{margin-left:auto;font-size:10px;color:var(--accent)}
    .profile-note{display:block;padding:8px 8px 4px;font-size:10px;color:var(--muted);border-top:1px solid var(--line);margin-top:4px;line-height:1.45}
    .hero{position:relative;height:min(88vh,860px);min-height:620px;overflow:hidden;background:#000}
    .hero-slides{position:absolute;inset:0}
    .hero-slide{position:absolute;inset:0;opacity:0;transition:opacity 1.1s var(--ease);pointer-events:none}
    .hero-slide.is-active{opacity:1;pointer-events:auto}
    .hero-bg{width:100%;height:100%;object-fit:cover;transform:scale(1.02);animation:heroDrift 18s var(--ease) forwards}
    @keyframes heroDrift{to{transform:scale(1.09)}}
    .hero-scrim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(6,6,8,.94) 0%,rgba(6,6,8,.6) 42%,rgba(6,6,8,.1) 72%),linear-gradient(0deg,var(--bg) 2%,rgba(8,8,10,.4) 30%,transparent 62%)}
    .hero-inner{position:absolute;left:50%;bottom:clamp(84px,14vh,140px);transform:translateX(-50%);max-width:1280px;width:calc(100% - 44px)}
    .hero-kicker{display:flex;align-items:center;gap:9px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#e9e1d4;font-weight:600;margin-bottom:18px}
    .hero-kicker .dot{width:6px;height:6px;border-radius:50%;background:var(--accent);box-shadow:0 0 12px var(--accent)}
    .hero-sep{opacity:.5}
    .hero-title{font-size:clamp(44px,6.4vw,88px);max-width:15ch;text-shadow:0 20px 60px rgba(0,0,0,.45)}
    .hero-meta{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-top:18px;font-size:13px;color:#cfc8bd}
    .hero-meta .rating{color:var(--accent);font-weight:700}
    .tag{border:1px solid rgba(255,255,255,.28);border-radius:4px;padding:2px 6px;font-size:10px;letter-spacing:.08em}
    .hero-desc{max-width:52ch;margin-top:16px;font-size:15.5px;line-height:1.6;color:#cfc8bd}
    .hero-actions{display:flex;align-items:center;gap:12px;margin-top:28px;flex-wrap:wrap}
    .hero-hint{font-size:11px;color:rgba(255,255,255,.45);margin-left:6px}
    .hero-hint kbd{border:1px solid rgba(255,255,255,.2);border-radius:4px;padding:2px 5px;font-family:inherit;font-size:10px}
    .hero-dots{position:absolute;right:max(22px,calc((100vw - 1280px)/2));bottom:128px;display:flex;flex-direction:column;gap:10px;z-index:3;align-items:flex-end}
    .hero-dot{font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.32);display:flex;align-items:center;gap:10px;transition:color .3s}
    .hero-dot::before{content:"";width:16px;height:1px;background:currentColor;transition:width .4s var(--ease)}
    .hero-dot.is-active{color:var(--text)}
    .hero-dot.is-active::before{width:34px;background:var(--accent)}
    .rows{position:relative;z-index:5;margin-top:-64px;padding-bottom:40px;background:linear-gradient(180deg,transparent,var(--bg) 140px)}
    .row{margin-bottom:62px}
    .row-head{display:flex;align-items:baseline;gap:16px;margin-bottom:18px}
    .row-head h2{font-size:clamp(19px,2vw,25px);letter-spacing:-.02em}
    .row-head em{font-style:normal;color:var(--accent)}
    .row-link{margin-left:auto;display:inline-flex;align-items:center;gap:4px;font-size:12px;color:var(--muted);transition:color .25s}
    .row-link:hover{color:var(--text)}
    .row-sub{margin-left:auto;font-size:11.5px;color:var(--muted)}
    .rail{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 0 14px;scrollbar-width:none}
    .rail::-webkit-scrollbar{display:none}
    .poster{flex:0 0 clamp(148px,16.5vw,198px);scroll-snap-align:start;text-align:left}
    .poster-art{position:relative;display:block;aspect-ratio:2/3;border-radius:var(--radius);overflow:hidden;background:var(--surface);border:1px solid rgba(255,255,255,.07);transition:transform .5s var(--ease),border-color .4s,box-shadow .5s}
    .poster-art img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.06) brightness(.92);transition:transform .8s var(--ease),filter .5s}
    .poster-shade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.72),transparent 46%)}
    .poster-meta{position:absolute;left:0;right:0;bottom:0;padding:12px;display:flex;justify-content:flex-end}
    .poster-play{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.92);color:#111;opacity:0;transform:translateY(6px);transition:.4s var(--ease)}
    .poster:hover .poster-art{transform:translateY(-5px);border-color:color-mix(in srgb,var(--accent) 55%,transparent);box-shadow:0 24px 48px -22px rgba(0,0,0,.9)}
    .poster:hover .poster-art img{transform:scale(1.05);filter:grayscale(.35) contrast(1.05) brightness(.98)}
    .poster:hover .poster-play{opacity:1;transform:none}
    .poster-title{display:block;margin-top:11px;font-size:13.5px;font-weight:600;letter-spacing:-.01em}
    .poster-sub{display:block;margin-top:3px;font-size:11px;color:var(--muted)}
    .wcard{flex:0 0 clamp(230px,25vw,312px);scroll-snap-align:start;text-align:left}
    .wcard-art{position:relative;display:block;aspect-ratio:16/9;border-radius:var(--radius);overflow:hidden;border:1px solid rgba(255,255,255,.07);background:var(--surface)}
    .wcard-art img{width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease),filter .4s}
    .wcard-scrim{position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.55),transparent 60%)}
    .wcard-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-46%);display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:rgba(255,255,255,.92);color:#111;opacity:0;transition:.4s var(--ease)}
    .wcard:hover .wcard-play{opacity:1;transform:translate(-50%,-50%)}
    .wcard:hover .wcard-art img{transform:scale(1.05)}
    .wprogress{position:absolute;left:12px;right:12px;bottom:10px;height:3px;border-radius:99px;background:rgba(255,255,255,.25);overflow:hidden}
    .wprogress i{display:block;height:100%;background:var(--accent)}
    .wcard-title{display:block;margin-top:10px;font-size:13.5px;font-weight:600}
    .wcard-sub{display:block;margin-top:2px;font-size:11px;color:var(--muted)}
    .rail--rank{gap:2px;align-items:flex-end;padding-bottom:8px}
    .rank-item{display:flex;align-items:flex-end;flex:0 0 auto;scroll-snap-align:start}
    .rank-num{font-family:var(--font-display);font-size:clamp(80px,9vw,120px);line-height:.72;font-weight:700;color:transparent;-webkit-text-stroke:1.5px rgba(255,255,255,.22);margin-right:-30px;margin-bottom:46px;z-index:1;letter-spacing:-.08em}
    .rank-item .poster{flex-basis:clamp(132px,14vw,172px)}
    .collection{position:relative;overflow:hidden;border-radius:calc(var(--radius) * 1.8);border:1px solid var(--line);min-height:320px;display:flex;align-items:center;margin-bottom:62px;isolation:isolate}
    .collection-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
    .collection-scrim{position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(8,8,10,.95),rgba(8,8,10,.62) 52%,rgba(8,8,10,.18))}
    .collection-body{max-width:520px;padding:clamp(28px,4vw,52px)}
    .collection-title{font-size:clamp(28px,3.4vw,44px);margin:12px 0 12px}
    .collection-copy{color:#cfc8bd;font-size:14.5px;line-height:1.6;margin-bottom:22px}
    .collection-stack{position:absolute;right:clamp(20px,4vw,60px);bottom:-24px;display:flex;gap:12px;transform:rotate(-4deg)}
    .stack-poster{width:clamp(90px,10vw,132px);aspect-ratio:2/3;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,.16);box-shadow:0 24px 40px -18px #000;transition:transform .5s var(--ease)}
    .stack-poster img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) brightness(.9)}
    .stack-poster:hover{transform:translateY(-8px)}
    .footer{border-top:1px solid var(--line);padding:56px 0 26px;background:linear-gradient(180deg,transparent,rgba(255,255,255,.02))}
    .footer-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:32px}
    .brand--footer{margin-bottom:14px}
    .footer-copy{font-size:12.5px;line-height:1.7;color:var(--muted);max-width:38ch}
    .footer-head{font-size:11px;text-transform:uppercase;letter-spacing:.16em;color:var(--faint,#6b6b70);margin-bottom:12px}
    .footer nav{display:flex;flex-direction:column;gap:9px;font-size:13px;color:var(--muted)}
    .footer nav a:hover{color:var(--text)}
    .footer-bottom{display:flex;justify-content:space-between;gap:16px;margin-top:44px;padding-top:20px;border-top:1px solid var(--line);font-size:11px;color:#6f6a62}
    .modal{position:fixed;inset:0;z-index:120;display:grid;place-items:center;padding:20px;opacity:0;visibility:hidden;transition:opacity .35s var(--ease),visibility .35s}
    .modal.is-open{opacity:1;visibility:visible}
    .modal-backdrop{position:absolute;inset:0;background:rgba(4,4,6,.72);backdrop-filter:blur(10px)}
    .modal-card{position:relative;width:min(880px,100%);max-height:90vh;overflow-y:auto;border-radius:calc(var(--radius) * 1.6);background:#0f0f13;border:1px solid var(--line);box-shadow:0 40px 100px -30px #000;transform:translateY(18px) scale(.985);transition:transform .45s var(--ease)}
    .modal.is-open .modal-card{transform:none}
    .modal-hero{position:relative;height:min(44vh,340px)}
    .modal-hero img{width:100%;height:100%;object-fit:cover}
    .modal-scrim{position:absolute;inset:0;background:linear-gradient(0deg,#0f0f13,transparent 78%)}
    .modal-close{position:absolute;top:16px;right:16px;width:38px;height:38px;display:grid;place-items:center;border-radius:50%;background:rgba(10,10,13,.6);border:1px solid var(--line);backdrop-filter:blur(8px);transition:.25s}
    .modal-close:hover{background:rgba(255,255,255,.12)}
    .modal-body{padding:0 clamp(22px,4vw,44px) 34px;margin-top:-34px;position:relative}
    .modal-title{font-size:clamp(30px,4vw,46px);margin:8px 0 12px}
    .modal-meta{display:flex;flex-wrap:wrap;gap:13px;font-size:12.5px;color:var(--muted);margin-bottom:16px}
    .modal-desc{font-size:14.5px;line-height:1.65;color:#d6cfc5;max-width:62ch}
    .modal-cast{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
    .modal-cast span{font-size:11.5px;padding:5px 10px;border:1px solid var(--line);border-radius:99px;color:var(--muted)}
    .modal-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:26px}
    .modal-note{font-size:10.5px;color:#6f6a62;margin-left:4px}
    .lock{overflow:hidden}
    @media (max-width:900px){
      .nav-links{display:none}
      .hero{min-height:560px;height:82vh}
      .hero-dots{bottom:auto;top:96px;right:22px;flex-direction:row;gap:6px}
      .hero-dot span{display:none}
      .hero-dot::before{width:18px}
      .hero-dot.is-active::before{width:30px}
      .hero-inner{bottom:72px}
      .hero-desc{display:none}
      .rows{margin-top:-30px}
      .collection-stack{display:none}
      .footer-grid{grid-template-columns:1fr 1fr;gap:26px}
    }
    @media (max-width:600px){
      .hero{height:78vh;min-height:520px}
      .hero-title{font-size:clamp(36px,11vw,52px)}
      .hero-meta{font-size:12px;gap:10px}
      .hero-actions .hero-hint{display:none}
      .row{margin-bottom:44px}
      .poster{flex-basis:136px}
      .wcard{flex-basis:220px}
      .rank-num{font-size:74px;margin-bottom:34px;margin-right:-22px}
      .footer-grid{grid-template-columns:1fr}
      .footer-bottom{flex-direction:column;gap:6px}
      .modal{place-items:end center;padding:0}
      .modal-card{max-height:92vh;border-radius:20px 20px 0 0}
    }
  </style>`;

  const data = titles.map((x) => ({
    t: x.t,
    y: x.y,
    k: x.k,
    g: x.g,
    r: x.r,
    s: x.s,
    d: x.d,
    cast: x.cast,
    seed: x.seed,
  }));

  const js = `${runtimeJs}
(function(){
  var TITLES=${JSON.stringify(data)};
  var slides=[].slice.call(document.querySelectorAll('[data-slide]'));
  var dots=[].slice.call(document.querySelectorAll('[data-dot]'));
  var current=0;
  function go(n){
    current=n;
    slides.forEach(function(s,i){s.classList.toggle('is-active',i===n);s.setAttribute('aria-hidden',i===n?'false':'true')});
    dots.forEach(function(d,i){d.classList.toggle('is-active',i===n)});
  }
  if(slides.length>1){
    var timer=setInterval(function(){go((current+1)%slides.length)},7000);
    dots.forEach(function(d,i){d.addEventListener('click',function(){clearInterval(timer);go(i);timer=setInterval(function(){go((current+1)%slides.length)},7000)})});
  }
  var toggle=document.querySelector('[data-profile-toggle]');
  var menu=document.querySelector('.profile-menu');
  if(toggle&&menu){
    toggle.addEventListener('click',function(e){
      e.stopPropagation();
      var open=menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded',open?'true':'false');
    });
    document.addEventListener('click',function(){menu.classList.remove('is-open');toggle.setAttribute('aria-expanded','false')});
  }
  var modal=document.getElementById('title-modal');
  function openTitle(i){
    var t=TITLES[i];if(!t)return;
    document.getElementById('modal-kicker').textContent='${esc(brand)} '+t.k;
    document.getElementById('modal-title').textContent=t.t;
    document.getElementById('modal-meta').innerHTML='<span style="color:var(--accent);font-weight:700">★ '+t.s+'</span><span>'+t.y+'</span><span>'+t.g+'</span><span>'+t.r+'</span><span>HDR</span>';
    document.getElementById('modal-desc').textContent=t.d;
    document.getElementById('modal-cast').innerHTML=t.cast.map(function(c){return '<span>'+c+'</span>'}).join('');
    document.getElementById('modal-img').src='https://picsum.photos/seed/atelier-'+encodeURIComponent(t.seed)+'-hero/1200/700';
    document.getElementById('modal-img').alt='Key art for '+t.t;
    modal.classList.add('is-open');
    document.body.classList.add('lock');
  }
  function closeModal(){
    modal.classList.remove('is-open');
    document.body.classList.remove('lock');
  }
  document.querySelectorAll('[data-open]').forEach(function(el){
    el.addEventListener('click',function(){openTitle(Number(el.getAttribute('data-open')))});
  });
  document.querySelectorAll('[data-close]').forEach(function(el){el.addEventListener('click',closeModal)});
  document.querySelectorAll('[data-list]').forEach(function(b){
    b.addEventListener('click',function(){
      var on=b.getAttribute('data-on')==='1';
      b.setAttribute('data-on',on?'0':'1');
      b.textContent=on?'+ My list':'✓ In my list';
    });
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='p'&&!modal.classList.contains('is-open')&&document.activeElement.tagName!=='INPUT'){openTitle(0)}
  });
})();`;

  return {
    brand: { name: brand, tagline, monogram: brand.charAt(0) },
    html: body,
    css: "",
    tokens: renderTokens(t),
    js,
    fonts: {
      display: "Sora",
      body: "Manrope",
      link: t.fontsLink,
    },
    mood: "Cinematic, low-light, editorial. Gold accent reserved for action and rating; photography graded monochrome so titles carry the colour.",
    motion: [
      "Hero crossfades every 7s with a slow 1.1s opacity transition",
      "Poster rails use native momentum + snap",
      "Cards lift 5px and un-grayscale on hover",
      "Detail modal rises 18px with backdrop blur",
    ],
    components: [
      { name: "HeroRotator", note: "3 key arts, dot navigation, 7s auto-advance" },
      { name: "PosterRail", note: "Monochrome poster cards with hover play affordance" },
      { name: "WideRail", note: "16:9 continue-watching cards with progress bar" },
      { name: "RankRow", note: "Outlined top-10 numerals behind posters" },
      { name: "TitleModal", note: "Detail overlay, cast chips, focus-safe close" },
      { name: "ProfileMenu", note: "Local profile switcher in the nav" },
    ],
    pages: [
      { name: "Home", route: "/", sections: ["Hero rotator", "Continue watching", "Trending", "Top 10", "Collection"] },
      { name: "Title detail", route: "/title/:slug", sections: ["Key art", "Synopsis", "Cast", "Play / My list"] },
      { name: "Search", route: "/search", sections: ["Search field", "Result grid"] },
      { name: "My list", route: "/my-list", sections: ["Saved titles"] },
    ],
    features: [
      "Auto-rotating cinematic hero",
      "Hover-preview rails with progress",
      "Top 10 ranked row",
      "Title detail overlay",
      "Profile switcher",
      "Monochrome poster art direction",
    ],
    database: [
      {
        table: "titles",
        columns: [
          { name: "id", type: "uuid" },
          { name: "slug", type: "text" },
          { name: "title", type: "text" },
          { name: "kind", type: "enum" },
          { name: "runtime", type: "text" },
          { name: "rating", type: "numeric" },
        ],
      },
      {
        table: "watch_progress",
        columns: [
          { name: "profile_id", type: "uuid" },
          { name: "title_id", type: "uuid" },
          { name: "seconds", type: "int" },
          { name: "percent", type: "int" },
        ],
      },
      {
        table: "my_list",
        columns: [
          { name: "profile_id", type: "uuid" },
          { name: "title_id", type: "uuid" },
          { name: "added_at", type: "timestamptz" },
        ],
      },
      {
        table: "profiles",
        columns: [
          { name: "id", type: "uuid" },
          { name: "name", type: "text" },
          { name: "tone", type: "text" },
        ],
      },
    ],
  };
}
