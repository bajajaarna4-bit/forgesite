import { BuiltSite, FONT_LINK, esc, pick, rng, runtimeJs } from "../base";
import { Theme, renderTokens, withRadius } from "../theme";

type Opts = { seed: string; palette: number; radius: number; sections: string[] };

const BRANDS = ["Kite", "Fable", "Fathom", "Rill", "Mosaic"];

type Video = {
  id: string;
  title: string;
  channel: string;
  tone: string;
  views: number;
  ago: string;
  duration: string;
  cat: string;
  seed: string;
  desc: string;
  chapters: string[];
  likes: number;
  comments: { name: string; tone: string; at: string; text: string; likes: number }[];
};

const CHANNELS: Record<string, { tone: string; subs: number }> = {
  "Fold Studio": { tone: "#C97B4A", subs: 412000 },
  "Quiet Craft": { tone: "#4C7A6B", subs: 1200000 },
  "Mara Builds": { tone: "#7C5CB8", subs: 286000 },
  Northline: { tone: "#3D6E9E", subs: 2100000 },
  "Slow Kitchen": { tone: "#B5544A", subs: 890000 },
  "The Cutting Room": { tone: "#8A6A3F", subs: 1600000 },
  "Atlas Notes": { tone: "#4E7C8C", subs: 3400000 },
};

const COMMENT_POOL = [
  { name: "Elena Ortiz", tone: "#B5544A", at: "2 days ago", text: "The part about negative space at 6:12 completely changed how I think about this. Bookmarking for the next project.", likes: 412 },
  { name: "Sam Whitfield", tone: "#4C7A6B", at: "1 week ago", text: "Came for the build, stayed for the editing. That transition at the end is doing a lot of quiet work.", likes: 187 },
  { name: "Priya Raman", tone: "#7C5CB8", at: "3 days ago", text: "Finally someone who explains the why before the how. More of this please.", likes: 236 },
  { name: "Tomas Lindqvist", tone: "#3D6E9E", at: "5 days ago", text: "I tried this on a smaller scale last weekend and it held up surprisingly well. The measurements in the description helped.", likes: 94 },
  { name: "Noor Haddad", tone: "#C97B4A", at: "2 weeks ago", text: "The sound design deserves its own video. Headphones recommended.", likes: 308 },
  { name: "Ben Carver", tone: "#4E7C8C", at: "6 days ago", text: "Chapter 4 is the one I keep sending to people. Clear, patient, and no fluff.", likes: 152 },
  { name: "Maya Chen", tone: "#8A6A3F", at: "4 days ago", text: "As someone six months into this craft, this is the most useful twenty minutes I've spent all month.", likes: 271 },
  { name: "Rook Ahn", tone: "#B5544A", at: "1 week ago", text: "That closing shot is doing something I can't explain but I feel it. Great work.", likes: 119 },
];

const VIDEOS: Video[] = [
  {
    id: "studio-400",
    title: "I rebuilt my studio for $400",
    channel: "Fold Studio",
    tone: "#C97B4A",
    views: 184000,
    ago: "2 weeks ago",
    duration: "14:22",
    cat: "Design",
    seed: "studio-400",
    desc: "A full teardown of a cramped spare room into a working studio: lighting, acoustics, and the three purchases that actually mattered. Everything else was built from offcuts.",
    chapters: ["00:00 The problem", "02:14 Light first", "05:40 Acoustic panels from scrap", "09:12 The $84 desk", "12:30 What I'd change"],
    likes: 12400,
    comments: [],
  },
  {
    id: "joinery",
    title: "The quiet craft of Japanese joinery",
    channel: "Quiet Craft",
    tone: "#4C7A6B",
    views: 2100000,
    ago: "1 month ago",
    duration: "18:05",
    cat: "Craft",
    seed: "joinery-1",
    desc: "Three joints, one chisel, no screws. A visit to a workshop in Takayama where a 74-year-old carpenter explains why the wood should be allowed to move.",
    chapters: ["00:00 A workshop in Takayama", "03:20 The first joint", "08:05 Why no glue", "13:40 The apprentice's mistake"],
    likes: 98400,
    comments: [],
  },
  {
    id: "css-slow",
    title: "Why your CSS feels slow",
    channel: "Mara Builds",
    tone: "#7C5CB8",
    views: 96000,
    ago: "5 days ago",
    duration: "11:47",
    cat: "Code",
    seed: "css-slow",
    desc: "Layout thrash, expensive selectors, and the one animation property most teams still get wrong. A practical audit you can run in ten minutes.",
    chapters: ["00:00 The 3 slow spots", "02:05 Layout vs paint", "05:30 Animating the wrong thing", "08:40 A ten-minute audit"],
    likes: 7300,
    comments: [],
  },
  {
    id: "lisbon-lens",
    title: "A week in Lisbon with one lens",
    channel: "Northline",
    tone: "#3D6E9E",
    views: 412000,
    ago: "3 weeks ago",
    duration: "21:30",
    cat: "Travel",
    seed: "lisbon-lens",
    desc: "One body, one 35mm, seven days. A short film about walking uphill, eating late, and learning to leave the camera down.",
    chapters: ["00:00 Alfama at 6am", "04:40 The tram that isn't worth it", "11:20 A bakery with no name", "17:05 Why one lens"],
    likes: 31200,
    comments: [],
  },
  {
    id: "sourdough",
    title: "Sourdough without a scale",
    channel: "Slow Kitchen",
    tone: "#B5544A",
    views: 738000,
    ago: "2 months ago",
    duration: "09:18",
    cat: "Cooking",
    seed: "sourdough-1",
    desc: "You do not need a scale, a proofing box, or a starter with a name. A cup, a bowl, an oven, and the willingness to fail twice.",
    chapters: ["00:00 The case against precision", "01:50 Building the starter", "04:30 The fold", "07:10 Baking in a home oven"],
    likes: 42100,
    comments: [],
  },
  {
    id: "synth",
    title: "The synth that scored the '80s",
    channel: "The Cutting Room",
    tone: "#8A6A3F",
    views: 1200000,
    ago: "4 months ago",
    duration: "16:54",
    cat: "Music",
    seed: "synth-1",
    desc: "One machine, twelve films, and a sound that outlived its decade. We trace the patch that became shorthand for 'the future'.",
    chapters: ["00:00 A sound you know", "03:40 The patch", "08:15 Why it stuck", "12:00 Recreating it today"],
    likes: 76400,
    comments: [],
  },
  {
    id: "maps-lie",
    title: "How maps lie to you",
    channel: "Atlas Notes",
    tone: "#4E7C8C",
    views: 3400000,
    ago: "7 months ago",
    duration: "23:12",
    cat: "Ideas",
    seed: "maps-lie",
    desc: "Every map is an argument. A tour of projection, omission, and the quiet politics of what gets drawn at the edge.",
    chapters: ["00:00 The impossible rectangle", "05:10 What gets left out", "12:30 Borders as design", "18:45 Better lies"],
    likes: 187000,
    comments: [],
  },
  {
    id: "cabin-30",
    title: "Building a cabin in 30 days",
    channel: "Northline",
    tone: "#3D6E9E",
    views: 890000,
    ago: "1 year ago",
    duration: "27:41",
    cat: "Craft",
    seed: "cabin-1",
    desc: "Six friends, one plot of land, thirty days before the snow. What went right, what went sideways, and the cost breakdown nobody puts in the thumbnail.",
    chapters: ["00:00 Day one", "06:30 The foundation mistake", "14:20 Raising walls", "22:10 The last night"],
    likes: 58200,
    comments: [],
  },
  {
    id: "traffic",
    title: "The mathematics of traffic",
    channel: "Fold Studio",
    tone: "#C97B4A",
    views: 267000,
    ago: "1 month ago",
    duration: "12:03",
    cat: "Ideas",
    seed: "traffic-1",
    desc: "Why adding a lane makes traffic worse, and why the fix is usually boring. A gentle tour of induced demand and flow.",
    chapters: ["00:00 The counterintuitive lane", "03:10 Flow vs capacity", "07:40 What actually works"],
    likes: 18900,
    comments: [],
  },
  {
    id: "editor",
    title: "What a film editor actually does",
    channel: "The Cutting Room",
    tone: "#8A6A3F",
    views: 560000,
    ago: "2 weeks ago",
    duration: "19:26",
    cat: "Film",
    seed: "editor-1",
    desc: "It is not cutting on the beat. A working editor walks through three scenes and the version of each that the audience never sees.",
    chapters: ["00:00 The invisible craft", "04:20 Scene one, four ways", "11:05 The cut that saved the film", "16:30 Notes for directors"],
    likes: 34900,
    comments: [],
  },
  {
    id: "font",
    title: "Designing a font from scratch",
    channel: "Mara Builds",
    tone: "#7C5CB8",
    views: 143000,
    ago: "6 days ago",
    duration: "15:38",
    cat: "Design",
    seed: "font-1",
    desc: "From a napkin sketch to a variable axis: the unglamorous middle of type design, including the 40 versions of the lowercase 'a'.",
    chapters: ["00:00 Start with three letters", "04:10 Spacing is the work", "09:30 The variable axis", "13:00 Shipping it"],
    likes: 11200,
    comments: [],
  },
  {
    id: "night-trains",
    title: "Night trains across Europe",
    channel: "Northline",
    tone: "#3D6E9E",
    views: 1800000,
    ago: "5 months ago",
    duration: "25:09",
    cat: "Travel",
    seed: "night-trains",
    desc: "Six borders, four sleeper cars, and one very small coffee. A practical guide to crossing a continent while asleep.",
    chapters: ["00:00 Why night trains", "05:30 Booking the right berth", "12:40 The border at 3am", "19:00 What it costs"],
    likes: 96300,
    comments: [],
  },
];

const SHORTS = [
  { t: "One tool, five uses", v: "1.4M views", seed: "short-tool", emoji: "🪚" },
  { t: "The 30-second fold", v: "890K views", seed: "short-fold", emoji: "🥖" },
  { t: "A trick for sharp corners", v: "2.1M views", seed: "short-corner", emoji: "📐" },
  { t: "Night market, one take", v: "640K views", seed: "short-market", emoji: "🏮" },
  { t: "Three chords, one hit", v: "3.2M views", seed: "short-chords", emoji: "🎹" },
  { t: "The perfect pour", v: "410K views", seed: "short-pour", emoji: "☕" },
];

function palettesFor(): Theme[] {
  const base: Theme = {
    bg: "#FFFFFF",
    surface: "#F7F7F2",
    surface2: "#EFEFE8",
    text: "#101110",
    muted: "#5F6461",
    line: "#E4E4DC",
    accent: "#E4572E",
    accentInk: "#ffffff",
    accentSoft: "#FDEDE7",
    radius: 14,
    max: "1460px",
    display: '"Sora", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    displayWeight: 600,
    displayTracking: "-0.03em",
    fontsLink: FONT_LINK("family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700"),
  };
  return [
    base,
    { ...base, accent: "#1F7A63", accentSoft: "#E5F5EF", surface: "#F6F8F4" },
    { ...base, accent: "#3D5AFE", accentSoft: "#EAEDFC" },
  ];
}

const icons = {
  menu: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  search: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>`,
  play: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8 5.4v13.2L19 12z"/></svg>`,
  home: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/></svg>`,
  shorts: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="7" y="3.5" width="10" height="17" rx="3"/><path d="m11 9 4 3-4 3z" fill="currentColor"/></svg>`,
  subs: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3.5" y="6" width="17" height="13" rx="2.5"/><path d="m9 3 3 3 3-3"/></svg>`,
  history: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 1.8"/></svg>`,
  playlist: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 7h11M4 12h11M4 17h7"/><path d="m16.5 15.5 4-2.4-4-2.4z" fill="currentColor"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6.5 4.5h11l-1 15h-9z"/><path d="M12 8v4.5"/></svg>`,
  like: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M7 21V9.5l4.6-6a1.6 1.6 0 0 1 2.6 1.7L12.8 9H19a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 17.6 20H7z"/><path d="M7 9.5H4v11.5h3"/></svg>`,
  dislike: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M17 3v11.5l-4.6 6a1.6 1.6 0 0 1-2.6-1.7l1.4-3.8H5a2 2 0 0 1-2-2.4l1.4-7A2 2 0 0 1 6.4 4H17z"/><path d="M17 11.5h3V3h-3"/></svg>`,
  share: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M12 15V3M8 7l4-4 4 4"/></svg>`,
  save: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6 4h12v16l-6-4-6 4z"/></svg>`,
  mic: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>`,
  dots: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>`,
};

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1).replace(".0", "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1).replace(".0", "") + "K";
  return String(n);
}

export function buildVideo(opts: Opts): BuiltSite {
  const pal = palettesFor()[opts.palette % 3];
  const r = rng(opts.seed);
  const t = withRadius(pal, opts.radius);
  const brand = pick(BRANDS, r);
  const tagline = pick(
    ["Watch something worth the twenty minutes.", "Long-form, made by people who care.", "A quieter corner of the internet."],
    r,
  );
  const videos = VIDEOS.map((v, i) => ({
    ...v,
    comments: [0, 3, 5].map((k) => COMMENT_POOL[(i * 2 + k) % COMMENT_POOL.length]),
  }));
  const featured = videos[0];

  const sidebar = `
    <aside class="sidebar" data-sidebar>
      <nav aria-label="Browse">
        <a class="side-item is-active" href="#" data-home>${icons.home}<span>Home</span></a>
        <a class="side-item" href="#shorts">${icons.shorts}<span>Shorts</span></a>
        <a class="side-item" href="#subs">${icons.subs}<span>Subscriptions</span></a>
      </nav>
      <div class="side-group">
        <p class="side-head">You</p>
        <a class="side-item" href="#you">${icons.history}<span>History</span></a>
        <a class="side-item" href="#you">${icons.playlist}<span>Playlists</span></a>
        <a class="side-item" href="#you">${icons.clock}<span>Watch later</span></a>
        <a class="side-item" href="#you">${icons.like}<span>Liked videos</span></a>
      </div>
      <div class="side-group">
        <p class="side-head">Subscriptions</p>
        ${Object.keys(CHANNELS)
          .slice(0, 5)
          .map(
            (c, i) =>
              `<a class="side-item side-item--chan" href="#subs"><span class="avatar" style="--tone:${
                CHANNELS[c].tone
              };width:24px;height:24px;font-size:9px">${esc(
                c
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2),
              )}</span><span>${esc(c)}</span>${i === 0 ? '<span class="live-dot" title="New upload"></span>' : ""}</a>`,
          )
          .join("")}
      </div>
      <div class="side-group side-group--foot">
        <p class="side-head">About</p>
        <a href="#">Press</a><a href="#">Creators</a><a href="#">Advertise</a><a href="#">Contact</a>
        <p class="side-legal">© 2026 ${esc(brand)}. A demonstration video platform.</p>
      </div>
    </aside>`;

  const card = (v: Video) => `
    <article class="vcard" data-video="${v.id}" tabindex="0" role="button" aria-label="Watch ${esc(v.title)}">
      <div class="thumb img-zoom">
        <img src="https://picsum.photos/seed/atelier-${encodeURIComponent(v.seed)}/640/360" alt="${esc(
          v.title,
        )}" loading="lazy" />
        <span class="dur">${v.duration}</span>
        <span class="thumb-play">${icons.play}</span>
      </div>
      <div class="vbody">
        <span class="avatar" style="--tone:${v.tone};width:34px;height:34px;font-size:11px">${esc(
          v.channel
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2),
        )}</span>
        <div class="vtext">
          <h3>${esc(v.title)}</h3>
          <p class="vchan">${esc(v.channel)}</p>
          <p class="vmeta">${fmt(v.views)} views · ${esc(v.ago)}</p>
        </div>
        <button class="icon-dots" aria-label="More actions">${icons.dots}</button>
      </div>
    </article>`;

  const chips = ["All", "Design", "Code", "Craft", "Cooking", "Travel", "Music", "Film", "Ideas"]
    .map(
      (c, i) =>
        `<button class="chipf ${i === 0 ? "is-on" : ""}" data-chip="${c === "All" ? "*" : c}">${c}</button>`,
    )
    .join("");

  const shorts = SHORTS.map(
    (s) => `<button class="short" data-video="${videos[5].id}">
      <img src="https://picsum.photos/seed/atelier-${encodeURIComponent(s.seed)}/300/520" alt="${esc(
        s.t,
      )}" loading="lazy" />
      <span class="short-scrim"></span>
      <span class="short-play">${icons.play}</span>
      <span class="short-emoji" aria-hidden="true">${s.emoji}</span>
      <span class="short-body"><strong>${esc(s.t)}</strong><span>${esc(s.v)}</span></span>
    </button>`,
  ).join("");

  const body = `
  <a class="skip" href="#main">Skip to content</a>
  <header class="topbar">
    <div class="topbar-left">
      <button class="icon-btn" data-side-toggle aria-label="Toggle sidebar">${icons.menu}</button>
      <a class="vbrand" href="#" data-home aria-label="${esc(brand)} home">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 8.6v6.8l5.6-3.4z" fill="currentColor"/></svg>
        <span>${esc(brand.toLowerCase())}</span>
      </a>
    </div>
    <form class="vsearch" role="search" data-search-form>
      <span class="sr-only">Search videos</span>
      ${icons.search}
      <input type="search" id="vsearch" placeholder="Search videos, channels, crafts…" autocomplete="off" />
      <button class="mic" type="button" aria-label="Search by voice">${icons.mic}</button>
    </form>
    <div class="topbar-right">
      <button class="btn btn--ghost btn--sm create">Create</button>
      <button class="avatar-btn" aria-label="Your account"><span class="avatar" style="--tone:#2F3A36;width:32px;height:32px;font-size:11px">YO</span></button>
    </div>
  </header>

  <div class="shell" data-shell>
    ${sidebar}
    <div class="scrim" data-side-toggle></div>
    <main class="content" id="main">
      <section class="view is-active" data-view="home">
        <div class="chips">${chips}</div>

        <article class="featured" data-video="${featured.id}" tabindex="0" role="button" aria-label="Watch ${esc(
          featured.title,
        )}">
          <div class="feat-thumb img-zoom">
            <img src="https://picsum.photos/seed/atelier-${encodeURIComponent(
              featured.seed,
            )}-wide/1100/620" alt="${esc(featured.title)}" />
            <span class="feat-badge">Editor's pick</span>
            <span class="dur">${featured.duration}</span>
            <span class="thumb-play thumb-play--big">${icons.play}</span>
          </div>
          <div class="feat-copy">
            <span class="avatar" style="--tone:${featured.tone};width:38px;height:38px;font-size:12px">FS</span>
            <div>
              <h1 class="display">${esc(featured.title)}</h1>
              <p class="feat-meta">${esc(featured.channel)} · ${fmt(
                featured.views,
              )} views · ${esc(featured.ago)}</p>
              <p class="feat-desc">${esc(featured.desc.split(".")[0])}.</p>
            </div>
          </div>
        </article>

        <div class="sec-row">
          <h2 class="display">Latest</h2>
          <span class="sec-hint">Sorted by freshness</span>
        </div>
        <div class="vgrid" data-grid>${videos.slice(1).map(card).join("")}</div>
        <p class="no-results" data-no-results hidden>No videos match that search. Try a channel or a craft.</p>

        <div class="sec-row" id="shorts">
          <h2 class="display">Shorts</h2>
          <a class="sec-link" href="#shorts">See all</a>
        </div>
        <div class="shorts">${shorts}</div>

        <section class="subs-band" id="subs">
          <div>
            <p class="eyebrow">Subscriptions</p>
            <h2 class="display">From channels you follow</h2>
            <p class="subs-copy">Five new uploads this week, led by ${esc(featured.channel)}. No autoplay, no countdown.</p>
          </div>
          <div class="subs-chips">
            ${Object.keys(CHANNELS)
              .slice(0, 5)
              .map(
                (c) =>
                  `<span class="sub-chip"><span class="avatar" style="--tone:${
                    CHANNELS[c].tone
                  };width:22px;height:22px;font-size:8px">${esc(
                    c
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2),
                  )}</span>${esc(c)}</span>`,
              )
              .join("")}
          </div>
        </section>
      </section>

      <section class="view" data-view="watch">
        <button class="back-btn" data-home>← Back to home</button>
        <div class="watch-grid">
          <div class="watch-main">
            <div class="player">
              <img id="player-poster" src="" alt="" />
              <span class="player-scrim"></span>
              <button class="player-big" aria-label="Play video">${icons.play}</button>
              <div class="player-bar">
                <span class="pbar"><i style="width:38%"></i></span>
                <span class="ptime mono">4:12 / 14:22</span>
                <span class="pctrl" aria-hidden="true">CC · 1080p · ⛶</span>
              </div>
            </div>
            <h1 class="watch-title display" id="watch-title"></h1>
            <div class="watch-meta" id="watch-meta"></div>
            <div class="watch-actions">
              <div class="like-pill">
                <button data-like aria-label="Like this video">${icons.like}<span data-like-count></span></button>
                <span class="pill-sep"></span>
                <button aria-label="Dislike this video">${icons.dislike}</button>
              </div>
              <button class="pill-btn">${icons.share} Share</button>
              <button class="pill-btn">${icons.save} Save</button>
            </div>
            <div class="channel-box">
              <span class="avatar" id="watch-avatar" style="--tone:#C97B4A;width:42px;height:42px;font-size:13px"></span>
              <div class="chan-main"><strong id="watch-channel"></strong><span id="watch-subs"></span></div>
              <button class="btn btn--primary btn--sm" data-sub>Subscribe</button>
            </div>
            <div class="desc-box">
              <p id="watch-desc"></p>
              <div class="chapters" id="watch-chapters"></div>
              <button class="desc-toggle" data-desc-toggle>Show more ▾</button>
            </div>
            <section class="comments">
              <div class="comments-head"><h2>${"Comments"}</h2><span id="comment-count"></span></div>
              <div class="comment-form">
                <span class="avatar" style="--tone:#2F3A36;width:34px;height:34px;font-size:11px">YO</span>
                <input type="text" placeholder="Add a thoughtful comment…" data-comment-input aria-label="Add a comment" />
                <button class="btn btn--primary btn--sm" data-comment-send>Comment</button>
              </div>
              <div id="comment-list"></div>
            </section>
          </div>
          <aside class="upnext">
            <div class="upnext-head"><h2>Up next</h2><button class="autoplay">Autoplay <span class="switch is-on" aria-hidden="true"></span></button></div>
            <div id="upnext-list"></div>
          </aside>
        </div>
      </section>
    </main>
  </div>

  <style>
    .skip{position:absolute;left:16px;top:-48px;z-index:200;background:var(--text);color:#fff;padding:10px 16px;border-radius:8px;font-weight:600;transition:top .2s}
    .skip:focus{top:14px}
    .topbar{position:fixed;top:0;left:0;right:0;height:62px;z-index:80;display:flex;align-items:center;gap:14px;padding:0 18px;background:rgba(255,255,255,.94);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
    .topbar-left{display:flex;align-items:center;gap:8px;min-width:170px}
    .icon-btn{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;color:var(--text);transition:background .25s}
    .icon-btn:hover{background:var(--surface)}
    .vbrand{display:inline-flex;align-items:center;gap:8px;color:var(--accent);margin-left:4px}
    .vbrand span{font-family:var(--font-display);font-size:19px;font-weight:700;letter-spacing:-.045em;color:var(--text)}
    .vsearch{flex:1;max-width:620px;margin:0 auto;display:flex;align-items:center;gap:9px;height:40px;padding:0 7px 0 16px;border:1px solid var(--line);border-radius:99px;background:#fff;color:var(--muted);transition:border-color .25s,box-shadow .25s}
    .vsearch:focus-within{border-color:#c9c9c0;box-shadow:0 0 0 4px var(--surface)}
    .vsearch input{flex:1;border:0;outline:0;background:none;font-size:13.5px;color:var(--text);min-width:0}
    .mic{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--surface);color:var(--text);transition:background .25s}
    .mic:hover{background:var(--surface-2)}
    .topbar-right{display:flex;align-items:center;gap:10px;min-width:170px;justify-content:flex-end}
    .create{height:34px;font-size:12.5px}
    .avatar-btn{display:grid;place-items:center}
    .shell{display:flex;padding-top:62px;min-height:100vh}
    .sidebar{width:238px;flex:none;height:calc(100vh - 62px);position:sticky;top:62px;overflow-y:auto;padding:16px 14px 26px;scrollbar-width:none;transition:width .35s var(--ease);background:#fff}
    .sidebar::-webkit-scrollbar{display:none}
    .side-item{display:flex;align-items:center;gap:14px;height:40px;padding:0 12px;border-radius:10px;font-size:13px;color:var(--text);transition:background .2s;margin-bottom:2px;white-space:nowrap;overflow:hidden}
    .side-item:hover{background:var(--surface)}
    .side-item.is-active{background:var(--surface-2);font-weight:600}
    .side-item.is-active svg{color:var(--accent)}
    .side-item svg{color:var(--muted);flex:none}
    .side-group{margin-top:22px;padding-top:18px;border-top:1px solid var(--line)}
    .side-head{font-size:10.5px;text-transform:uppercase;letter-spacing:.14em;color:var(--muted);padding:0 12px;margin-bottom:8px}
    .side-item--chan{gap:10px;height:36px;font-size:12.5px}
    .side-item--chan .avatar{flex:none}
    .live-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);margin-left:auto}
    .side-group--foot{font-size:11.5px;color:var(--muted);display:flex;flex-direction:column;gap:8px;padding-bottom:10px}
    .side-group--foot a{padding:0 12px}
    .side-group--foot a:hover{color:var(--text)}
    .side-legal{font-size:10px;line-height:1.5;padding:10px 12px 0;color:#9a9d98}
    .shell.is-collapsed .sidebar{width:76px}
    .shell.is-collapsed .side-item span:not(.avatar){display:none}
    .shell.is-collapsed .side-item{justify-content:center;padding:0}
    .shell.is-collapsed .side-head,.shell.is-collapsed .side-group--foot,.shell.is-collapsed .live-dot{display:none}
    .shell.is-collapsed .side-group{padding-top:14px}
    .content{flex:1;min-width:0;padding:22px clamp(18px,3vw,34px) 60px;transition:padding .3s}
    .view{display:none;animation:fade .35s var(--ease)}
    .view.is-active{display:block}
    .chips{display:flex;gap:8px;overflow-x:auto;padding:2px 0 18px;scrollbar-width:none}
    .chips::-webkit-scrollbar{display:none}
    .chipf{flex:none;height:34px;padding:0 14px;border-radius:9px;background:var(--surface);border:1px solid transparent;font-size:12.5px;font-weight:500;color:var(--text);transition:.25s}
    .chipf:hover{background:var(--surface-2)}
    .chipf.is-on{background:var(--text);color:#fff}
    .featured{display:grid;grid-template-columns:1.45fr .8fr;gap:24px;align-items:center;padding:18px;border:1px solid var(--line);border-radius:calc(var(--radius) + 8px);background:linear-gradient(120deg,#FBFAF5,#fff 60%);margin-bottom:34px;cursor:pointer;transition:box-shadow .4s,border-color .3s}
    .featured:hover{box-shadow:0 26px 60px -46px rgba(0,0,0,.6);border-color:#d8d8cd}
    .feat-thumb{position:relative;aspect-ratio:16/9;border-radius:var(--radius);overflow:hidden;background:var(--surface-2)}
    .feat-thumb img{width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease)}
    .featured:hover .feat-thumb img{transform:scale(1.04)}
    .feat-badge{position:absolute;top:12px;left:12px;background:rgba(255,255,255,.93);backdrop-filter:blur(6px);color:var(--text);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:5px 9px;border-radius:99px}
    .dur{position:absolute;right:9px;bottom:9px;background:rgba(12,12,12,.82);color:#fff;font-size:10.5px;font-weight:600;padding:3px 6px;border-radius:5px;letter-spacing:.02em}
    .thumb-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-44%);width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.94);color:#111;opacity:0;transition:.35s var(--ease);box-shadow:0 10px 24px rgba(0,0,0,.25)}
    .vcard:hover .thumb-play,.featured:hover .thumb-play{opacity:1;transform:translate(-50%,-50%)}
    .thumb-play--big{width:62px;height:62px;opacity:.96;transform:translate(-50%,-50%)}
    .feat-copy{display:flex;gap:13px;align-items:flex-start;padding-right:8px}
    .feat-copy h1{font-size:clamp(22px,2.4vw,32px);margin-bottom:7px;line-height:1.08}
    .feat-meta{font-size:11.5px;color:var(--muted)}
    .feat-desc{font-size:12.5px;line-height:1.6;color:var(--muted);margin-top:9px;max-width:36ch}
    .sec-row{display:flex;align-items:baseline;gap:14px;margin:6px 0 16px}
    .sec-row h2{font-size:21px}
    .sec-hint,.sec-link{margin-left:auto;font-size:11.5px;color:var(--muted)}
    .sec-link:hover{color:var(--text)}
    .vgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px 16px;margin-bottom:38px}
    .vcard{cursor:pointer;min-width:0}
    .thumb{position:relative;aspect-ratio:16/9;border-radius:var(--radius);overflow:hidden;background:var(--surface-2)}
    .thumb img{width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease),filter .3s}
    .vcard:hover .thumb img{transform:scale(1.04)}
    .vbody{display:flex;gap:10px;padding-top:11px}
    .vtext{min-width:0;flex:1}
    .vtext h3{font-size:13.5px;font-weight:600;line-height:1.35;letter-spacing:-.01em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .vchan{font-size:11.5px;color:var(--muted);margin-top:5px}
    .vmeta{font-size:11px;color:var(--muted);margin-top:1px}
    .vcard:hover .vchan{color:var(--text)}
    .icon-dots{width:26px;height:26px;flex:none;display:grid;place-items:center;border-radius:50%;color:var(--muted);opacity:0;transition:.25s}
    .vcard:hover .icon-dots{opacity:1}
    .icon-dots:hover{background:var(--surface)}
    .no-results{padding:40px 0;font-size:13px;color:var(--muted)}
    .shorts{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:46px}
    .short{position:relative;aspect-ratio:9/16;border-radius:var(--radius);overflow:hidden;text-align:left;background:var(--surface-2)}
    .short img{width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease)}
    .short:hover img{transform:scale(1.05)}
    .short-scrim{position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.78),transparent 52%)}
    .short-play{position:absolute;left:10px;top:10px;width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.9);color:#111;display:grid;place-items:center;transform:scale(.9)}
    .short-emoji{position:absolute;right:10px;bottom:54px;font-size:18px;opacity:.9}
    .short-body{position:absolute;left:12px;right:12px;bottom:11px;color:#fff}
    .short-body strong{display:block;font-size:11.5px;font-weight:600;line-height:1.3}
    .short-body span{font-size:10px;opacity:.7}
    .subs-band{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:center;padding:26px 28px;border:1px solid var(--line);border-radius:calc(var(--radius) + 6px);background:var(--surface)}
    .subs-band h2{font-size:clamp(20px,2.3vw,27px);margin:7px 0 8px}
    .subs-copy{font-size:12.5px;line-height:1.6;color:var(--muted);max-width:44ch}
    .subs-chips{display:flex;flex-wrap:wrap;gap:7px}
    .sub-chip{display:inline-flex;align-items:center;gap:7px;padding:6px 10px 6px 6px;border-radius:99px;background:#fff;border:1px solid var(--line);font-size:11.5px}
    .back-btn{font-size:12px;color:var(--muted);margin-bottom:14px;transition:color .2s}
    .back-btn:hover{color:var(--text)}
    .watch-grid{display:grid;grid-template-columns:minmax(0,1fr) 356px;gap:26px;max-width:1500px}
    .player{position:relative;aspect-ratio:16/9;border-radius:var(--radius);overflow:hidden;background:#0b0b0b}
    .player img{width:100%;height:100%;object-fit:cover;opacity:.9}
    .player-scrim{position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.55),transparent 46%)}
    .player-big{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:66px;height:66px;border-radius:50%;background:rgba(255,255,255,.94);color:#111;display:grid;place-items:center;box-shadow:0 16px 40px rgba(0,0,0,.35);transition:transform .3s}
    .player-big:hover{transform:translate(-50%,-50%) scale(1.06)}
    .player-bar{position:absolute;left:14px;right:14px;bottom:10px;display:flex;align-items:center;gap:12px;color:#fff;font-size:10.5px}
    .pbar{flex:1;height:4px;border-radius:99px;background:rgba(255,255,255,.28);overflow:hidden}
    .pbar i{display:block;height:100%;background:var(--accent);border-radius:99px}
    .ptime{opacity:.85}
    .pctrl{opacity:.65}
    .watch-title{font-size:clamp(20px,2.3vw,28px);margin:18px 0 8px;line-height:1.16;letter-spacing:-.025em}
    .watch-meta{font-size:12px;color:var(--muted);margin-bottom:16px}
    .watch-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:16px}
    .like-pill{display:flex;align-items:center;height:38px;border:1px solid var(--line);border-radius:99px;background:#fff;overflow:hidden}
    .like-pill button{display:flex;align-items:center;gap:7px;height:100%;padding:0 14px;font-size:12px;font-weight:600;transition:background .2s}
    .like-pill button:hover{background:var(--surface)}
    .like-pill button.is-liked{color:var(--accent)}
    .pill-sep{width:1px;height:18px;background:var(--line)}
    .pill-btn{display:inline-flex;align-items:center;gap:7px;height:38px;padding:0 14px;border:1px solid var(--line);border-radius:99px;background:#fff;font-size:12px;font-weight:500;transition:.2s}
    .pill-btn:hover{background:var(--surface)}
    .channel-box{display:flex;align-items:center;gap:12px;padding:14px 16px;border:1px solid var(--line);border-radius:var(--radius);margin-bottom:14px;background:#fff}
    .chan-main{flex:1;min-width:0}
    .chan-main strong{display:block;font-size:13.5px}
    .chan-main span{font-size:11px;color:var(--muted)}
    .chan-main .subscribed{color:var(--accent)}
    .desc-box{background:var(--surface);border-radius:var(--radius);padding:16px 18px;font-size:12.5px;line-height:1.7}
    .desc-box p{white-space:pre-line}
    .chapters{display:grid;gap:5px;margin-top:12px;padding-top:12px;border-top:1px solid var(--line);font-size:11.5px;color:var(--muted)}
    .chapters b{color:var(--text);font-family:ui-monospace,monospace;font-size:10.5px;margin-right:8px}
    .desc-toggle{margin-top:10px;font-size:11px;font-weight:600;color:var(--text);display:none}
    .desc-box.is-long .desc-toggle{display:inline}
    .comments{margin-top:30px}
    .comments-head{display:flex;align-items:baseline;gap:10px;margin-bottom:16px}
    .comments-head h2{font-size:18px;font-family:var(--font-display);letter-spacing:-.02em}
    .comments-head span{font-size:11.5px;color:var(--muted)}
    .comment-form{display:flex;align-items:center;gap:10px;margin-bottom:20px}
    .comment-form input{flex:1;height:38px;border:0;border-bottom:1px solid var(--line);background:none;outline:0;font-size:12.5px}
    .comment-form input:focus{border-color:var(--text)}
    .comment{display:flex;gap:11px;padding:12px 0}
    .comment-main{min-width:0;flex:1}
    .comment-top{display:flex;align-items:baseline;gap:7px}
    .comment-top strong{font-size:12px}
    .comment-top span{font-size:10.5px;color:var(--muted)}
    .comment p{font-size:12.5px;line-height:1.6;margin-top:4px}
    .comment-foot{display:flex;gap:14px;margin-top:7px;font-size:10.5px;color:var(--muted)}
    .comment-foot button:hover{color:var(--text)}
    .upnext-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
    .upnext-head h2{font-size:16px;font-family:var(--font-display);letter-spacing:-.02em}
    .autoplay{display:flex;align-items:center;gap:6px;font-size:10.5px;color:var(--muted)}
    .switch{width:26px;height:15px;border-radius:99px;background:#d5d5cc;position:relative;display:inline-block;transition:.25s}
    .switch::after{content:"";position:absolute;top:2px;left:2px;width:11px;height:11px;border-radius:50%;background:#fff;transition:.25s}
    .switch.is-on{background:var(--accent)}
    .switch.is-on::after{left:13px}
    .up-card{display:flex;gap:9px;padding:7px 0;cursor:pointer;border-radius:9px;transition:background .2s}
    .up-card:hover{background:var(--surface)}
    .up-thumb{position:relative;flex:0 0 148px;aspect-ratio:16/9;border-radius:9px;overflow:hidden;background:var(--surface-2)}
    .up-thumb img{width:100%;height:100%;object-fit:cover}
    .up-card h4{font-size:12px;font-weight:600;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .up-card p{font-size:10.5px;color:var(--muted);margin-top:4px;line-height:1.4}
    .scrim{display:none}
    @media (max-width:1280px){
      .vgrid{grid-template-columns:repeat(3,1fr)}
      .shorts{grid-template-columns:repeat(4,1fr)}
      .featured{grid-template-columns:1.3fr .9fr}
      .watch-grid{grid-template-columns:minmax(0,1fr) 310px}
    }
    @media (max-width:1024px){
      .sidebar{position:fixed;left:0;top:62px;bottom:0;z-index:70;width:238px;height:auto;transform:translateX(-102%);transition:transform .35s var(--ease);box-shadow:30px 0 60px rgba(0,0,0,.12)}
      .shell.is-collapsed .sidebar{width:238px}
      .shell.is-collapsed .side-item span:not(.avatar){display:inline}
      .shell.is-collapsed .side-item{justify-content:flex-start;padding:0 12px}
      .shell.is-collapsed .side-head,.shell.is-collapsed .side-group--foot,.shell.is-collapsed .live-dot{display:block}
      .sidebar.is-mobile-open{transform:none}
      .scrim{display:block;position:fixed;inset:62px 0 0;background:rgba(0,0,0,.35);z-index:65;opacity:0;visibility:hidden;transition:.3s}
      .shell.is-mobile-open .scrim{opacity:1;visibility:visible}
      .topbar-left{min-width:auto}
      .topbar-right{min-width:auto}
      .create{display:none}
      .watch-grid{grid-template-columns:1fr}
      .upnext{margin-top:10px}
      .upnext #upnext-list{display:grid;grid-template-columns:1fr 1fr;gap:0 14px}
    }
    @media (max-width:860px){
      .featured{grid-template-columns:1fr}
      .feat-copy{padding:0 4px 6px}
      .vgrid{grid-template-columns:repeat(2,1fr)}
      .shorts{grid-template-columns:repeat(3,1fr)}
      .subs-band{grid-template-columns:1fr}
      .vsearch{max-width:none}
    }
    @media (max-width:600px){
      .topbar{padding:0 12px;gap:8px}
      .vbrand span{display:none}
      .vsearch .mic{display:none}
      .vgrid{grid-template-columns:1fr;gap:18px}
      .shorts{grid-template-columns:repeat(2,1fr)}
      .content{padding:16px 14px 60px}
      .featured{padding:12px;border-radius:18px}
      .upnext #upnext-list{grid-template-columns:1fr}
      .watch-actions{font-size:11px}
      .pill-btn{padding:0 10px}
    }
  </style>`;

  const videosForJs = videos.map((v) => ({
    id: v.id,
    title: v.title,
    channel: v.channel,
    tone: v.tone,
    views: v.views,
    ago: v.ago,
    duration: v.duration,
    seed: v.seed,
    desc: v.desc,
    chapters: v.chapters,
    likes: v.likes,
    comments: v.comments,
  }));

  const js = `${runtimeJs}
(function(){
  var VIDEOS=${JSON.stringify(videosForJs)};
  var CHANNELS=${JSON.stringify(
    Object.fromEntries(Object.entries(CHANNELS).map(([k, v]) => [k, v])),
  )};
  var shell=document.querySelector('[data-shell]');
  var sidebar=document.querySelector('[data-sidebar]');
  document.querySelectorAll('[data-side-toggle]').forEach(function(b){
    b.addEventListener('click',function(){
      if(window.innerWidth<=1024){shell.classList.toggle('is-mobile-open');sidebar.classList.toggle('is-mobile-open')}
      else{shell.classList.toggle('is-collapsed')}
    });
  });
  function fmt(n){
    if(n>=1000000)return (n/1000000).toFixed(1).replace('.0','')+'M';
    if(n>=1000)return (n/1000).toFixed(1).replace('.0','')+'K';
    return String(n);
  }
  function initials(name){return name.split(' ').map(function(w){return w[0]}).join('').slice(0,2).toUpperCase()}
  function view(name){
    document.querySelectorAll('[data-view]').forEach(function(v){v.classList.toggle('is-active',v.getAttribute('data-view')===name)});
    document.querySelectorAll('.side-item').forEach(function(s){s.classList.remove('is-active')});
    var homeLink=document.querySelector('[data-home].side-item');
    if(homeLink)homeLink.classList.add('is-active');
    shell.classList.remove('is-mobile-open');sidebar.classList.remove('is-mobile-open');
    window.scrollTo(0,0);
  }
  document.querySelectorAll('[data-home]').forEach(function(b){
    b.addEventListener('click',function(e){e.preventDefault();view('home');});
  });
  var current=VIDEOS[0];
  var liked=false;
  function renderWatch(v){
    current=v;
    document.getElementById('player-poster').src='https://picsum.photos/seed/atelier-'+encodeURIComponent(v.seed)+'-wide/1200/675';
    document.getElementById('player-poster').alt='Still from '+v.title;
    document.getElementById('watch-title').textContent=v.title;
    document.getElementById('watch-meta').textContent=fmt(v.views)+' views · '+v.ago+' · '+v.duration;
    document.getElementById('watch-channel').textContent=v.channel;
    var subs=CHANNELS[v.channel]?fmt(CHANNELS[v.channel].subs)+' subscribers':'128K subscribers';
    document.getElementById('watch-subs').textContent=subs;
    var av=document.getElementById('watch-avatar');
    av.textContent=initials(v.channel);av.style.setProperty('--tone',v.tone);
    document.getElementById('watch-desc').textContent=v.desc;
    document.getElementById('watch-chapters').innerHTML=v.chapters.map(function(c){
      var parts=c.split(' ');
      var time=parts.shift();
      return '<span><b>'+time+'</b>'+parts.join(' ')+'</span>';
    }).join('');
    var likeBtn=document.querySelector('[data-like]');
    likeBtn.classList.remove('is-liked');
    likeBtn.querySelector('[data-like-count]').textContent=fmt(v.likes);
    liked=false;
    document.getElementById('comment-count').textContent=v.comments.length+' comments';
    document.getElementById('comment-list').innerHTML=v.comments.map(function(c){
      return '<div class="comment"><span class="avatar" style="--tone:'+c.tone+';width:32px;height:32px;font-size:11px">'+initials(c.name)+'</span><div class="comment-main"><div class="comment-top"><strong>'+c.name+'</strong><span>'+c.at+'</span></div><p>'+c.text+'</p><div class="comment-foot"><button>👍 '+c.likes+'</button><button>Reply</button></div></div></div>';
    }).join('');
    var others=VIDEOS.filter(function(x){return x.id!==v.id}).slice(0,7);
    document.getElementById('upnext-list').innerHTML=others.map(function(o){
      return '<div class="up-card" data-video="'+o.id+'"><div class="up-thumb"><img src="https://picsum.photos/seed/atelier-'+encodeURIComponent(o.seed)+'/320/180" alt="" loading="lazy" /><span class="dur">'+o.duration+'</span></div><div><h4>'+o.title+'</h4><p>'+o.channel+'<br>'+fmt(o.views)+' views · '+o.ago+'</p></div></div>';
    }).join('');
    bindVideos();
  }
  function openVideo(id){
    var v=VIDEOS.filter(function(x){return x.id===id})[0];
    if(!v)return;
    renderWatch(v);
    view('watch');
  }
  function bindVideos(){
    document.querySelectorAll('[data-video]').forEach(function(el){
      if(el.getAttribute('data-bound'))return;
      el.setAttribute('data-bound','1');
      el.addEventListener('click',function(){openVideo(el.getAttribute('data-video'))});
      el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openVideo(el.getAttribute('data-video'))}});
    });
  }
  bindVideos();
  var subBtn=document.querySelector('[data-sub]');
  if(subBtn)subBtn.addEventListener('click',function(){
    var on=subBtn.getAttribute('data-on')==='1';
    subBtn.setAttribute('data-on',on?'0':'1');
    subBtn.textContent=on?'Subscribe':'Subscribed';
    subBtn.classList.toggle('btn--primary',on);
    subBtn.classList.toggle('btn--ghost',!on);
  });
  var likeBtn=document.querySelector('[data-like]');
  if(likeBtn)likeBtn.addEventListener('click',function(){
    liked=!liked;
    likeBtn.classList.toggle('is-liked',liked);
    likeBtn.querySelector('[data-like-count]').textContent=fmt(current.likes+(liked?1:0));
  });
  var grid=document.querySelector('[data-grid]');
  var input=document.getElementById('vsearch');
  var activeChip='*';
  function applyFilter(){
    var q=(input.value||'').trim().toLowerCase();
    var shown=0;
    document.querySelectorAll('[data-grid] .vcard').forEach(function(card){
      var id=card.getAttribute('data-video');
      var v=VIDEOS.filter(function(x){return x.id===id})[0];
      if(!v)return;
      var okQ=!q||v.title.toLowerCase().indexOf(q)>-1||v.channel.toLowerCase().indexOf(q)>-1;
      var okC=activeChip==='*'||v.cat===activeChip;
      var show=okQ&&okC;
      card.style.display=show?'':'none';
      if(show)shown++;
    });
    var nr=document.querySelector('[data-no-results]');
    if(nr)nr.hidden=shown>0;
    if(q||activeChip!=='*'){
      document.querySelector('.featured').style.display='none';
      document.querySelector('.shorts').style.display='none';
      var subs=document.querySelector('.subs-band');if(subs)subs.style.display='none';
    }else{
      document.querySelector('.featured').style.display='';
      document.querySelector('.shorts').style.display='';
      var subs2=document.querySelector('.subs-band');if(subs2)subs2.style.display='';
    }
  }
  if(input){
    input.addEventListener('input',function(){view('home');applyFilter()});
    document.querySelector('[data-search-form]').addEventListener('submit',function(e){e.preventDefault();applyFilter()});
  }
  document.querySelectorAll('[data-chip]').forEach(function(c){
    c.addEventListener('click',function(){
      document.querySelectorAll('[data-chip]').forEach(function(x){x.classList.remove('is-on')});
      c.classList.add('is-on');
      activeChip=c.getAttribute('data-chip');
      applyFilter();
    });
  });
  document.querySelector('[data-comment-send]').addEventListener('click',function(){
    var inp=document.querySelector('[data-comment-input]');
    var text=(inp.value||'').trim();if(!text)return;
    var list=document.getElementById('comment-list');
    var el=document.createElement('div');
    el.className='comment';
    el.innerHTML='<span class="avatar" style="--tone:#2F3A36;width:32px;height:32px;font-size:11px">YO</span><div class="comment-main"><div class="comment-top"><strong>You</strong><span>just now</span></div><p></p><div class="comment-foot"><button>👍 0</button><button>Reply</button></div></div>';
    el.querySelector('p').textContent=text;
    list.prepend(el);
    current.comments.unshift({name:'You',tone:'#2F3A36',at:'just now',text:text,likes:0});
    document.getElementById('comment-count').textContent=current.comments.length+' comments';
    inp.value='';
  });
  document.querySelector('[data-desc-toggle]').addEventListener('click',function(){
    var box=document.querySelector('.desc-box');
    box.classList.toggle('is-long');
    this.textContent=box.classList.contains('is-long')?'Show less ▴':'Show more ▾';
  });
})();`;

  return {
    brand: { name: brand, tagline, monogram: brand.charAt(0) },
    html: body,
    css: "",
    tokens: renderTokens(t),
    js,
    fonts: { display: "Sora", body: "Inter", link: t.fontsLink },
    mood: "Daylight, utilitarian, editorial. White canvas, orange accent used only for brand and state. Thumbnails carry the colour; typography stays quiet.",
    motion: [
      "Sidebar collapses from 238px to a 76px icon rail",
      "Thumbnails zoom 4% with a play affordance on hover",
      "View switches cross-fade in 350ms",
      "Subscribe and like states pop without layout shift",
    ],
    components: [
      { name: "SideRail", note: "Collapsible navigation with channel list" },
      { name: "VideoCard", note: "Thumbnail, duration, avatar, 2-line clamp" },
      { name: "WatchPlayer", note: "Simulated player with progress and controls" },
      { name: "CommentThread", note: "Working composer prepends new comments" },
      { name: "ChipFilter", note: "Filters grid by category" },
      { name: "UpNext", note: "Contextual recommendations beside the player" },
    ],
    pages: [
      { name: "Home", route: "/", sections: ["Category chips", "Featured", "Latest grid", "Shorts", "Subscriptions band"] },
      { name: "Watch", route: "/watch/:id", sections: ["Player", "Actions", "Channel", "Description", "Comments", "Up next"] },
      { name: "Search", route: "/results", sections: ["Query", "Filtered grid"] },
      { name: "Channel", route: "/@channel", sections: ["Header", "Uploads"] },
    ],
    features: [
      "Collapsible sidebar / mobile drawer",
      "Working search across titles and channels",
      "Category chip filtering",
      "Watch page with comments composer",
      "Subscribe and like state",
      "Shorts shelf",
    ],
    database: [
      {
        table: "videos",
        columns: [
          { name: "id", type: "uuid" },
          { name: "title", type: "text" },
          { name: "channel_id", type: "uuid" },
          { name: "duration", type: "interval" },
          { name: "views", type: "bigint" },
          { name: "published_at", type: "timestamptz" },
        ],
      },
      {
        table: "channels",
        columns: [
          { name: "id", type: "uuid" },
          { name: "name", type: "text" },
          { name: "subscribers", type: "bigint" },
          { name: "tone", type: "text" },
        ],
      },
      {
        table: "comments",
        columns: [
          { name: "id", type: "uuid" },
          { name: "video_id", type: "uuid" },
          { name: "author", type: "text" },
          { name: "body", type: "text" },
          { name: "likes", type: "int" },
        ],
      },
      {
        table: "subscriptions",
        columns: [
          { name: "user_id", type: "uuid" },
          { name: "channel_id", type: "uuid" },
          { name: "created_at", type: "timestamptz" },
        ],
      },
    ],
  };
}
