import { BuiltSite, FONT_LINK, esc, pick, rng, runtimeJs } from "../base";
import { Theme, renderTokens, withRadius } from "../theme";

type Opts = { seed: string; palette: number; radius: number; sections: string[] };

const BRANDS = ["Marlowe", "Lumen", "Halo", "Aura", "Fable"];

type Post = {
  id: string;
  user: string;
  name: string;
  tone: string;
  place: string;
  caption: string;
  seed: string;
  likes: number;
  comments: { user: string; text: string }[];
  at: string;
};

const POSTS: Post[] = [
  {
    id: "p1",
    user: "mara.vale",
    name: "Mara Vale",
    tone: "#B4553A",
    place: "Bell Street Studio",
    caption: "Morning light in the studio, before anyone else arrives. The best forty minutes of the day.",
    seed: "social-studio",
    likes: 284,
    comments: [
      { user: "theo.finch", text: "That window is doing all the work and it knows it." },
      { user: "juneandjuly", text: "The quietest kind of productive." },
    ],
    at: "2 hours ago",
  },
  {
    id: "p2",
    user: "theo.finch",
    name: "Theo Finch",
    tone: "#3F6B5A",
    place: "Cove Point",
    caption: "Six rolls, one keeper. That's the deal I made with myself this year.",
    seed: "social-coast",
    likes: 1204,
    comments: [
      { user: "northlight", text: "Worth the wait. The grain is perfect." },
      { user: "saltandstone", text: "One keeper is generous. I usually get zero." },
    ],
    at: "5 hours ago",
  },
  {
    id: "p3",
    user: "atelierdesoie",
    name: "Atelier de Soie",
    tone: "#9A6B3F",
    place: "Courtyard, Arles",
    caption: "Silk scarves drying in the courtyard. Three weeks of dye tests for this exact terracotta.",
    seed: "social-silk",
    likes: 412,
    comments: [{ user: "mara.vale", text: "That third shade — the one at the edge. Unreal." }],
    at: "Yesterday",
  },
  {
    id: "p4",
    user: "juneandjuly",
    name: "June & July",
    tone: "#B57A4A",
    place: "Home",
    caption: "Sunday table. Nothing complicated: tomatoes, bread, too much olive oil.",
    seed: "social-table",
    likes: 738,
    comments: [
      { user: "slowkitchen", text: "Too much olive oil is a myth." },
      { user: "theo.finch", text: "Saving this for next weekend." },
    ],
    at: "Yesterday",
  },
  {
    id: "p5",
    user: "northlight",
    name: "North Light",
    tone: "#4E6B7A",
    place: "Hvalfjörður",
    caption: "Fog rolled in at 6:12 and stayed until noon. We didn't say much.",
    seed: "social-fog",
    likes: 1902,
    comments: [{ user: "atelierdesoie", text: "This is a painting." }],
    at: "2 days ago",
  },
  {
    id: "p6",
    user: "saltandstone",
    name: "Salt & Stone",
    tone: "#8A6A5A",
    place: "Trastevere",
    caption: "A wall that has been patched seven times. I love it more each time.",
    seed: "social-wall",
    likes: 356,
    comments: [{ user: "juneandjuly", text: "Seven is the right number for walls." }],
    at: "3 days ago",
  },
];

const STORIES = [
  { user: "mara.vale", tone: "#B4553A", seed: "story-mara", label: "studio light" },
  { user: "theo.finch", tone: "#3F6B5A", seed: "story-theo", label: "cove point" },
  { user: "atelierdesoie", tone: "#9A6B3F", seed: "story-silk", label: "dye day" },
  { user: "northlight", tone: "#4E6B7A", seed: "story-fog", label: "fog" },
  { user: "juneandjuly", tone: "#B57A4A", seed: "story-table", label: "sunday" },
  { user: "saltandstone", tone: "#8A6A5A", seed: "story-wall", label: "walls" },
  { user: "rook.av", tone: "#6B5A8A", seed: "story-rook", label: "night walk" },
];

function palettesFor(): Theme[] {
  const base: Theme = {
    bg: "#FBF8F3",
    surface: "#FFFFFF",
    surface2: "#F4EEE4",
    text: "#191410",
    muted: "#766E64",
    line: "#ECE4D7",
    accent: "#C0502E",
    accentInk: "#ffffff",
    accentSoft: "#FBEAE3",
    radius: 16,
    max: "1000px",
    display: '"Instrument Serif", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    displayWeight: 400,
    displayTracking: "-0.02em",
    fontsLink: FONT_LINK("family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700"),
  };
  return [
    base,
    { ...base, accent: "#2F6B4F", accentSoft: "#E7F2EB", surface2: "#F1F3EA" },
    { ...base, accent: "#2B3A55", accentSoft: "#E9EDF4" },
  ];
}

const icons = {
  home: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/></svg>`,
  explore: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></svg>`,
  reels: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3.5" y="4" width="17" height="16" rx="4"/><path d="m3.5 9 17-3M9 4l2.5 5M15 4l2.5 5"/><path d="m11 12 4 2.5-4 2.5z" fill="currentColor" stroke="none"/></svg>`,
  msg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M21 11.5c0 4.4-4 8-9 8-1.1 0-2.2-.2-3.1-.5L4 21l1.3-4A7.9 7.9 0 0 1 3 11.5c0-4.4 4-8 9-8s9 3.6 9 8z"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10z"/></svg>`,
  heartFill: `<svg viewBox="0 0 24 24" width="23" height="23" fill="currentColor" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10z"/></svg>`,
  comment: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20.5 11.5c0 4.1-3.8 7.5-8.5 7.5-1 0-2-.2-2.9-.4L5 20l1.2-3.7a7 7 0 0 1-1.7-4.8C4.5 7.4 8.3 4 13 4s7.5 3.4 7.5 7.5z"/></svg>`,
  share: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M21 3 10.5 13.5M21 3l-6.5 18-4-8-8-4z"/></svg>`,
  save: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 4h12v16l-6-4-6 4z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>`,
  close: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
};

function initials(name: string) {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function buildSocial(opts: Opts): BuiltSite {
  const pal = palettesFor()[opts.palette % 3];
  const r = rng(opts.seed);
  const t = withRadius(pal, opts.radius);
  const brand = pick(BRANDS, r);
  const tagline = pick(
    ["A slower kind of social.", "For the things worth keeping.", "Small moments, carefully kept."],
    r,
  );

  const avatar = (name: string, tone: string, size = 38) =>
    `<span class="avatar" style="--tone:${tone};width:${size}px;height:${size}px;font-size:${Math.round(
      size * 0.32,
    )}px">${initials(name)}</span>`;

  const postMarkup = (p: Post) => `
    <article class="post" data-post="${p.id}">
      <header class="post-head">
        <button class="post-user" data-profile-open>${avatar(p.name, p.tone, 38)}
          <span><strong>${esc(p.user)}</strong><small>${esc(p.place)}</small></span>
        </button>
        <button class="dots" aria-label="Post options">•••</button>
      </header>
      <div class="post-img" data-like-area>
        <img src="https://picsum.photos/seed/atelier-${encodeURIComponent(
          p.seed,
        )}/900/1080" alt="${esc(p.caption)}" loading="lazy" />
        <span class="burst" aria-hidden="true">${icons.heartFill}</span>
      </div>
      <div class="post-body">
        <div class="post-actions">
          <button class="act like" data-like aria-label="Like post" aria-pressed="false">${icons.heart}</button>
          <button class="act" aria-label="Comment">${icons.comment}</button>
          <button class="act" aria-label="Share">${icons.share}</button>
          <button class="act save" data-save aria-label="Save post">${icons.save}</button>
        </div>
        <p class="likes"><strong data-likes>${p.likes.toLocaleString("en-US")}</strong> likes</p>
        <p class="caption"><strong>${esc(p.user)}</strong> ${esc(p.caption)}</p>
        <div class="comments" data-comments="${p.id}">
          ${p.comments
            .map(
              (c) =>
                `<p><strong>${esc(c.user)}</strong> ${esc(c.text)}</p>`,
            )
            .join("")}
        </div>
        <p class="post-time">${esc(p.at)}</p>
        <form class="add-comment" data-comment-form="${p.id}">
          <input type="text" placeholder="Add a comment…" aria-label="Add a comment" />
          <button type="submit">Post</button>
        </form>
      </div>
    </article>`;

  const storyMarkup = STORIES.map(
    (s, i) => `<button class="story" data-story="${i}" aria-label="Open ${esc(s.user)}'s story">
      <span class="story-ring"><span class="story-av" style="--tone:${s.tone}">${initials(s.user)}</span></span>
      <span class="story-name">${esc(s.user.split(".")[0])}</span>
    </button>`,
  ).join("");

  const exploreTiles = POSTS.concat(POSTS.slice(0, 3))
    .map(
      (p, i) => `<button class="tile" data-profile-open aria-label="View post by ${esc(p.user)}">
        <img src="https://picsum.photos/seed/atelier-${encodeURIComponent(p.seed)}-ex${i}/500/500" alt="${esc(
          p.caption,
        )}" loading="lazy" />
        <span class="tile-overlay"><span>♥ ${(p.likes + 40).toLocaleString("en-US")}</span><span>💬 ${p.comments.length + 2}</span></span>
      </button>`,
    )
    .join("");

  const suggestions = [
    { user: "atlas.notes", name: "Atlas Notes", tone: "#4E7C8C", note: "Followed by theo.finch" },
    { user: "slow.kitchen", name: "Slow Kitchen", tone: "#B5544A", note: "New to Marlowe" },
    { user: "rook.av", name: "Rook Ahn", tone: "#6B5A8A", note: "Followed by northlight" },
    { user: "saltandstone", name: "Salt & Stone", tone: "#8A6A5A", note: "Followed by juneandjuly" },
  ];

  const body = `
  <a class="skip" href="#feed">Skip to feed</a>
  <header class="snav">
    <div class="snav-inner">
      <a class="slogo" href="#" data-feed>${esc(brand)}</a>
      <label class="ssearch">${icons.search}<input type="search" placeholder="Search people, places, tags" aria-label="Search" /></label>
      <nav class="sicons" aria-label="Primary">
        <button class="sicon is-active" data-feed aria-label="Home">${icons.home}</button>
        <button class="sicon" data-explore aria-label="Explore">${icons.explore}</button>
        <button class="sicon" data-explore aria-label="Reels">${icons.reels}</button>
        <button class="sicon" aria-label="Messages">${icons.msg}</button>
        <button class="savatar" data-profile-open aria-label="Your profile">${avatar(
          "June Halloway",
          "#2F3A36",
          30,
        )}</button>
      </nav>
    </div>
  </header>

  <main class="smain">
    <section class="sview is-active" data-view="feed" id="feed">
      <div class="layout">
        <div class="feed-col">
          <div class="stories" aria-label="Stories">${storyMarkup}</div>
          <div class="composer">
            <button class="composer-user" data-profile-open>${avatar("June Halloway", "#2F3A36", 38)}</button>
            <button class="composer-input" data-compose>Share a quiet moment…</button>
            <button class="composer-photo" aria-label="Add photo">🖼</button>
          </div>
          <div class="feed">${POSTS.map(postMarkup).join("")}</div>
          <div class="feed-end"><span>You're all caught up</span><p>Sorted by people you actually follow. No infinite loop.</p></div>
        </div>
        <aside class="rail">
          <div class="rail-profile">
            ${avatar("June Halloway", "#2F3A36", 52)}
            <div><strong>juneandjuly</strong><span>June Halloway</span></div>
            <button class="rail-switch">Switch</button>
          </div>
          <div class="rail-block">
            <div class="rail-head"><h2>Suggested for you</h2><button>See all</button></div>
            ${suggestions
              .map(
                (s) => `<div class="sugg">
                  ${avatar(s.name, s.tone, 36)}
                  <div class="sugg-text"><strong>${esc(s.user)}</strong><span>${esc(s.note)}</span></div>
                  <button class="follow" data-follow>Follow</button>
                </div>`,
              )
              .join("")}
          </div>
          <div class="rail-block">
            <div class="rail-head"><h2>Today's small trends</h2></div>
            <ul class="trends">
              <li><span>#terracotta</span><small>1,204 posts</small></li>
              <li><span>#9amlight</span><small>886 posts</small></li>
              <li><span>#slowtable</span><small>512 posts</small></li>
              <li><span>#patchedwalls</span><small>274 posts</small></li>
            </ul>
          </div>
          <p class="rail-foot">About · Help · Press · API · Jobs · Privacy · Terms<br><span>© 2026 ${esc(
            brand,
          )} — a demonstration feed.</span></p>
        </aside>
      </div>
    </section>

    <section class="sview" data-view="explore">
      <div class="page-head">
        <h1 class="display">Explore</h1>
        <p>Photographs from people you might not follow yet.</p>
      </div>
      <div class="tiles">${exploreTiles}</div>
    </section>

    <section class="sview" data-view="profile">
      <div class="profile">
        <div class="profile-top">
          ${avatar("June Halloway", "#2F3A36", 96)}
          <div class="profile-info">
            <div class="profile-row"><h1>juneandjuly</h1><button class="btn btn--ghost btn--sm">Edit profile</button><button class="btn btn--sm btn--primary">Share profile</button></div>
            <div class="profile-stats"><span><strong>412</strong> posts</span><span><strong>18.4k</strong> followers</span><span><strong>391</strong> following</span></div>
            <div class="profile-bio"><strong>June Halloway</strong><p>Food, light, and the occasional very long lunch. South coast → the city. Recipes in highlights.</p><a href="#">juneandjuly.studio</a></div>
          </div>
        </div>
        <div class="highlights">
          <button class="highlight"><span class="hl-ring">🥖</span><small>bread</small></button>
          <button class="highlight"><span class="hl-ring">🍅</span><small>summer</small></button>
          <button class="highlight"><span class="hl-ring">🏡</span><small>kitchen</small></button>
          <button class="highlight"><span class="hl-ring">📖</span><small>reads</small></button>
        </div>
        <div class="profile-tabs"><button class="is-on">Posts</button><button>Saved</button><button>Tagged</button></div>
        <div class="tiles tiles--profile">${exploreTiles}</div>
      </div>
    </section>
  </main>

  <div class="story-modal" data-close-on-esc role="dialog" aria-modal="true" aria-label="Story viewer">
    <div class="story-backdrop" data-story-close></div>
    <div class="story-card">
      <div class="story-progress"><i data-story-progress></i></div>
      <div class="story-head"><span class="story-av" data-story-av style="--tone:#B4553A">MV</span><strong data-story-user></strong><span data-story-time>4h</span><button class="story-x" data-story-close aria-label="Close story">${icons.close}</button></div>
      <img data-story-img src="" alt="" />
      <div class="story-foot"><span data-story-label></span><button class="story-reply">Send a message</button></div>
    </div>
  </div>

  <style>
    .skip{position:absolute;left:16px;top:-48px;z-index:200;background:var(--text);color:#fff;padding:10px 16px;border-radius:8px;font-weight:600;transition:top .2s}
    .skip:focus{top:14px}
    .snav{position:fixed;top:0;left:0;right:0;z-index:80;background:rgba(251,248,243,.9);backdrop-filter:blur(16px);border-bottom:1px solid var(--line)}
    .snav-inner{max-width:1000px;margin:0 auto;display:flex;align-items:center;gap:18px;height:60px;padding:0 20px}
    .slogo{font-family:var(--font-display);font-size:27px;letter-spacing:-.03em;line-height:1;padding-bottom:3px}
    .ssearch{flex:1;max-width:300px;display:flex;align-items:center;gap:8px;height:36px;padding:0 12px;border-radius:10px;background:var(--surface2);color:var(--muted);transition:background .25s,box-shadow .25s}
    .ssearch:focus-within{background:#fff;box-shadow:0 0 0 3px var(--accent-soft)}
    .ssearch input{border:0;outline:0;background:none;width:100%;font-size:12.5px;color:var(--text)}
    .sicons{margin-left:auto;display:flex;align-items:center;gap:16px}
    .sicon{color:var(--text);opacity:.7;transition:.25s;display:grid;place-items:center}
    .sicon:hover{opacity:1;transform:translateY(-1px)}
    .sicon.is-active{opacity:1;color:var(--accent)}
    .savatar{display:grid;place-items:center;border-radius:50%;transition:.25s}
    .savatar:hover{box-shadow:0 0 0 2px var(--accent)}
    .smain{padding-top:76px;padding-bottom:60px}
    .layout{max-width:1000px;margin:0 auto;display:grid;grid-template-columns:minmax(0,600px) 300px;gap:52px;padding:0 20px}
    .stories{display:flex;gap:16px;overflow-x:auto;padding:4px 2px 18px;scrollbar-width:none}
    .stories::-webkit-scrollbar{display:none}
    .story{display:flex;flex-direction:column;align-items:center;gap:7px;flex:none}
    .story-ring{width:64px;height:64px;border-radius:50%;padding:2.5px;background:conic-gradient(from 200deg,var(--accent),#E3A33C,#C0502E,var(--accent));transition:transform .35s var(--ease)}
    .story:hover .story-ring{transform:scale(1.05)}
    .story-av{display:grid;place-items:center;width:100%;height:100%;border-radius:50%;background:var(--tone);color:#fff;font-size:14px;font-weight:600;border:3px solid var(--bg)}
    .story-name{font-size:10.5px;color:var(--muted);max-width:64px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .composer{display:flex;align-items:center;gap:11px;padding:12px 14px;background:#fff;border:1px solid var(--line);border-radius:14px;margin-bottom:16px}
    .composer-input{flex:1;text-align:left;font-size:12.5px;color:var(--muted);padding:8px 0}
    .composer-input:hover{color:var(--text)}
    .composer-photo{font-size:16px;opacity:.7;transition:.2s}
    .composer-photo:hover{opacity:1}
    .post{background:#fff;border:1px solid var(--line);border-radius:18px;overflow:hidden;margin-bottom:20px;box-shadow:0 20px 40px -36px rgba(25,20,16,.5)}
    .post-head{display:flex;align-items:center;justify-content:space-between;padding:13px 15px}
    .post-user{display:flex;align-items:center;gap:10px;text-align:left}
    .post-user span{display:flex;flex-direction:column;line-height:1.3}
    .post-user strong{font-size:12.5px;font-weight:600}
    .post-user small{font-size:10.5px;color:var(--muted)}
    .dots{color:var(--muted);letter-spacing:2px;padding:4px 8px;font-size:13px}
    .post-img{position:relative;background:var(--surface2);aspect-ratio:5/6;overflow:hidden;user-select:none}
    .post-img img{width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease)}
    .post:hover .post-img img{transform:scale(1.015)}
    .burst{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(0);color:#fff;}
    .burst svg{width:90px;height:90px;filter:drop-shadow(0 12px 26px rgba(0,0,0,.4));opacity:0;pointer-events:none}
    .burst.go{animation:burst .9s var(--ease) forwards}
    @keyframes burst{0%{transform:translate(-50%,-50%) scale(0);opacity:0}20%{transform:translate(-50%,-50%) scale(1.12);opacity:1}55%{transform:translate(-50%,-50%) scale(1);opacity:1}100%{transform:translate(-50%,-50%) scale(1.18);opacity:0}}
    .post-body{padding:11px 15px 13px}
    .post-actions{display:flex;align-items:center;gap:14px}
    .act{color:var(--text);transition:transform .2s var(--ease),color .2s}
    .act:hover{transform:scale(1.08)}
    .act.like.is-on{color:var(--accent)}
    .act.like.is-on svg{fill:currentColor}
    .act.save{margin-left:auto}
    .act.save.is-on{color:var(--accent);fill:currentColor}
    .act.save.is-on svg{fill:currentColor}
    .likes{font-size:12.5px;margin-top:9px}
    .likes strong{font-weight:600}
    .caption{font-size:12.5px;line-height:1.55;margin-top:6px}
    .caption strong{font-weight:600;margin-right:4px}
    .comments{margin-top:8px;display:flex;flex-direction:column;gap:4px}
    .comments p{font-size:12px;line-height:1.5;color:#4d463d}
    .comments strong{font-weight:600;color:var(--text);margin-right:4px}
    .post-time{font-size:9.5px;text-transform:uppercase;letter-spacing:.09em;color:var(--muted);margin-top:9px}
    .add-comment{display:flex;align-items:center;gap:8px;border-top:1px solid var(--line);margin-top:11px;padding-top:9px}
    .add-comment input{flex:1;border:0;outline:0;background:none;font-size:12px}
    .add-comment button{font-size:11px;font-weight:700;color:var(--accent);opacity:0;pointer-events:none;transition:.2s}
    .add-comment.has-text button{opacity:1;pointer-events:auto}
    .feed-end{text-align:center;padding:24px 0 10px;color:var(--muted)}
    .feed-end span{font-family:var(--font-display);font-size:21px;color:var(--text)}
    .feed-end p{font-size:11px;margin-top:5px}
    .rail{position:sticky;top:84px;height:max-content;padding-top:8px}
    .rail-profile{display:flex;align-items:center;gap:11px;margin-bottom:22px}
    .rail-profile div{display:flex;flex-direction:column;line-height:1.3;flex:1}
    .rail-profile strong{font-size:12.5px}
    .rail-profile span{font-size:10.5px;color:var(--muted)}
    .rail-switch{font-size:11px;font-weight:600;color:var(--accent)}
    .rail-block{margin-bottom:22px}
    .rail-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:11px}
    .rail-head h2{font-size:12.5px;color:var(--muted);font-weight:600}
    .rail-head button{font-size:10.5px;font-weight:600}
    .sugg{display:flex;align-items:center;gap:9px;margin-bottom:12px}
    .sugg-text{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.3}
    .sugg-text strong{font-size:11.5px}
    .sugg-text span{font-size:10px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .follow{font-size:10.5px;font-weight:700;color:var(--accent)}
    .follow.is-on{color:var(--muted)}
    .trends{display:flex;flex-direction:column;gap:10px}
    .trends li{display:flex;justify-content:space-between;align-items:baseline;gap:10px;font-size:12px}
    .trends small{font-size:9.5px;color:var(--muted)}
    .rail-foot{font-size:9.5px;line-height:1.9;color:#A79E92;margin-top:30px}
    .rail-foot span{display:inline-block;margin-top:6px}
    .page-head{max-width:1000px;margin:0 auto;padding:18px 20px 26px}
    .page-head h1{font-size:clamp(34px,5vw,48px)}
    .page-head p{font-size:12.5px;color:var(--muted);margin-top:6px}
    .tiles{max-width:1000px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:0 20px}
    .tile{position:relative;aspect-ratio:1;overflow:hidden;background:var(--surface2)}
    .tile img{width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease)}
    .tile-overlay{position:absolute;inset:0;background:rgba(20,16,12,.38);color:#fff;display:flex;align-items:center;justify-content:center;gap:20px;font-size:13px;font-weight:600;opacity:0;transition:opacity .3s}
    .tile:hover .tile-overlay{opacity:1}
    .tile:hover img{transform:scale(1.04)}
    .tiles--profile{padding:0}
    .profile{max-width:1000px;margin:0 auto;padding:10px 20px 30px}
    .profile-top{display:flex;gap:clamp(20px,4vw,54px);align-items:center;padding:18px 8px 26px;border-bottom:1px solid var(--line)}
    .profile-info{flex:1}
    .profile-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .profile-row h1{font-family:var(--font-display);font-size:30px;font-weight:400;letter-spacing:-.02em;margin-right:6px}
    .profile-stats{display:flex;gap:22px;margin:14px 0;font-size:12.5px;color:var(--muted)}
    .profile-stats strong{color:var(--text);font-weight:600}
    .profile-bio{font-size:12.5px;line-height:1.65;color:var(--muted)}
    .profile-bio strong{color:var(--text);font-weight:600}
    .profile-bio a{color:var(--accent);font-weight:500}
    .highlights{display:flex;gap:22px;padding:20px 10px;border-bottom:1px solid var(--line);overflow-x:auto}
    .highlight{display:flex;flex-direction:column;align-items:center;gap:6px}
    .hl-ring{display:grid;place-items:center;width:60px;height:60px;border-radius:50%;border:1px solid var(--line);background:#fff;font-size:23px;transition:.3s}
    .highlight:hover .hl-ring{box-shadow:0 0 0 2px var(--accent)}
    .highlight small{font-size:10.5px}
    .profile-tabs{display:flex;justify-content:center;gap:30px;padding:14px 0;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);border-bottom:1px solid var(--line);margin-bottom:4px}
    .profile-tabs button{padding-bottom:8px;border-bottom:1px solid transparent}
    .profile-tabs .is-on{color:var(--text);border-color:var(--text)}
    .story-modal{position:fixed;inset:0;z-index:130;display:grid;place-items:center;opacity:0;visibility:hidden;transition:.35s var(--ease)}
    .story-modal.is-open{opacity:1;visibility:visible}
    .story-backdrop{position:absolute;inset:0;background:rgba(16,12,9,.82);backdrop-filter:blur(12px)}
    .story-card{position:relative;width:min(380px,92vw);height:min(660px,88vh);border-radius:18px;overflow:hidden;background:#111;box-shadow:0 40px 100px rgba(0,0,0,.5);transform:scale(.97);transition:transform .4s var(--ease)}
    .story-modal.is-open .story-card{transform:none}
    .story-card img{width:100%;height:100%;object-fit:cover;opacity:.92}
    .story-progress{position:absolute;top:10px;left:10px;right:10px;height:2.5px;background:rgba(255,255,255,.28);border-radius:99px;z-index:3;overflow:hidden}
    .story-progress i{display:block;height:100%;width:0;background:#fff;border-radius:99px}
    .story-modal.is-open .story-progress i{animation:storybar 6s linear forwards}
    @keyframes storybar{to{width:100%}}
    .story-head{position:absolute;top:22px;left:12px;right:12px;display:flex;align-items:center;gap:9px;color:#fff;z-index:3}
    .story-head .story-av{width:30px;height:30px;border:2px solid rgba(255,255,255,.4);font-size:11px}
    .story-head strong{font-size:12px}
    [data-story-time]{font-size:10px;opacity:.65}
    .story-x{margin-left:auto;width:30px;height:30px;display:grid;place-items:center;border-radius:50%;background:rgba(0,0,0,.3);color:#fff}
    .story-foot{position:absolute;left:12px;right:12px;bottom:16px;display:flex;align-items:center;gap:9px;color:#fff;z-index:3}
    .story-foot > span{font-size:11px;opacity:.8;flex:1}
    .story-reply{height:36px;padding:0 14px;border-radius:99px;border:1px solid rgba(255,255,255,.4);font-size:11px;background:rgba(0,0,0,.22);backdrop-filter:blur(6px)}
    @media (max-width:900px){
      .layout{grid-template-columns:1fr;max-width:600px;gap:0}
      .rail{display:none}
      .ssearch{display:none}
      .smain{padding-top:70px}
    }
    @media (max-width:600px){
      .snav-inner{padding:0 14px;gap:10px}
      .slogo{font-size:24px}
      .sicons{gap:13px}
      .sicons .sicon:nth-child(3){display:none}
      .layout{padding:0}
      .stories{padding:4px 14px 14px}
      .composer{margin:0 12px 14px;border-radius:12px}
      .post{border-radius:0;border-left:0;border-right:0;margin-bottom:12px}
      .post-img{aspect-ratio:4/5}
      .profile-top{flex-direction:column;align-items:flex-start;gap:18px}
      .profile-row h1{font-size:24px}
      .tiles{padding:0 2px;gap:2px}
      .story-card{height:86vh;border-radius:14px}
    }
  </style>`;

  const storiesForJs = STORIES.map((s) => ({
    user: s.user,
    tone: s.tone,
    seed: s.seed,
    label: s.label,
  }));

  const js = `${runtimeJs}
(function(){
  var STORIES=${JSON.stringify(storiesForJs)};
  function view(name){
    document.querySelectorAll('[data-view]').forEach(function(v){v.classList.toggle('is-active',v.getAttribute('data-view')===name)});
    window.scrollTo(0,0);
  }
  document.querySelectorAll('[data-feed]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();view('feed')})});
  document.querySelectorAll('[data-explore]').forEach(function(b){b.addEventListener('click',function(){view('explore')})});
  document.querySelectorAll('[data-profile-open]').forEach(function(b){b.addEventListener('click',function(){view('profile')})});
  function fmt(n){return n.toLocaleString('en-US')}
  document.querySelectorAll('[data-post]').forEach(function(post){
    var like=post.querySelector('[data-like]');
    var area=post.querySelector('[data-like-area]');
    var count=post.querySelector('[data-likes]');
    var burst=post.querySelector('.burst');
    var base=parseInt((count.textContent||'0').replace(/,/g,''),10);
    var on=false;
    function setLike(next){
      if(next===on)return;
      on=next;
      post.setAttribute('data-liked',on?'1':'0');
      like.classList.toggle('is-on',on);
      like.setAttribute('aria-pressed',on?'true':'false');
      count.textContent=fmt(base+(on?1:0));
      if(on&&burst&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
        burst.classList.remove('go');void burst.offsetWidth;burst.classList.add('go');
      }
    }
    if(like)like.addEventListener('click',function(){setLike(!on)});
    if(area){
      var taps=0,timer=null;
      area.addEventListener('click',function(){
        taps++;
        clearTimeout(timer);
        timer=setTimeout(function(){taps=0},320);
        if(taps===2){setLike(true);taps=0}
      });
    }
    var save=post.querySelector('[data-save]');
    if(save)save.addEventListener('click',function(){save.classList.toggle('is-on')});
    var form=post.querySelector('[data-comment-form]');
    var input=form.querySelector('input');
    input.addEventListener('input',function(){form.classList.toggle('has-text',input.value.trim().length>0)});
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var text=input.value.trim();if(!text)return;
      var p=document.createElement('p');
      var strong=document.createElement('strong');
      strong.textContent='juneandjuly';
      p.appendChild(strong);
      p.appendChild(document.createTextNode(' '+text));
      post.querySelector('[data-comments]').appendChild(p);
      input.value='';form.classList.remove('has-text');
    });
  });
  document.querySelectorAll('[data-follow]').forEach(function(b){
    b.addEventListener('click',function(){
      var on=b.classList.toggle('is-on');
      b.textContent=on?'Following':'Follow';
    });
  });
  var modal=document.querySelector('.story-modal');
  var img=document.querySelector('[data-story-img]');
  var userEl=document.querySelector('[data-story-user]');
  var labelEl=document.querySelector('[data-story-label]');
  var avEl=document.querySelector('[data-story-av]');
  var progress=document.querySelector('[data-story-progress]');
  var storyTimer=null;
  function openStory(i){
    var s=STORIES[i];if(!s)return;
    img.src='https://picsum.photos/seed/atelier-'+encodeURIComponent(s.seed)+'/500/880';
    img.alt='Story by '+s.user;
    userEl.textContent=s.user;
    labelEl.textContent='“'+s.label+'” — tap through at your own pace.';
    avEl.textContent=s.user.split('.').map(function(w){return w[0]}).join('').slice(0,2).toUpperCase();
    avEl.style.setProperty('--tone',s.tone);
    progress.style.animation='none';void progress.offsetWidth;progress.style.animation='';
    modal.classList.add('is-open');
    document.body.style.overflow='hidden';
    clearTimeout(storyTimer);
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      storyTimer=setTimeout(function(){closeStory()},6000);
    }
  }
  function closeStory(){
    modal.classList.remove('is-open');
    document.body.style.overflow='';
    clearTimeout(storyTimer);
  }
  document.querySelectorAll('[data-story]').forEach(function(b){
    b.addEventListener('click',function(){openStory(Number(b.getAttribute('data-story')))});
  });
  document.querySelectorAll('[data-story-close]').forEach(function(b){b.addEventListener('click',closeStory)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeStory()});
  document.querySelector('[data-story-close]').addEventListener('click',closeStory);
  var composer=document.querySelector('[data-compose]');
  if(composer)composer.addEventListener('click',function(){
    var first=document.querySelector('[data-post] [data-comment-form] input');
    if(first){first.focus();first.scrollIntoView({block:'center',behavior:'smooth'})}
  });
})();`;

  return {
    brand: { name: brand, tagline, monogram: brand.charAt(0) },
    html: body,
    css: "",
    tokens: renderTokens(t),
    js,
    fonts: { display: "Instrument Serif", body: "Inter", link: t.fontsLink },
    mood: "Warm, editorial, unhurried. Cream paper, terracotta accent, serif wordmark. Photography is the only loud element.",
    motion: [
      "Stories ring uses a conic gradient that scales on hover",
      "Double-tap triggers a 900ms heart burst",
      "Story viewer auto-advances with a 6s progress bar",
      "Likes and saves change state without layout shift",
    ],
    components: [
      { name: "StoryRail", note: "Gradient rings, opens a timed viewer" },
      { name: "PostCard", note: "Double-tap like, comment composer, save" },
      { name: "ExploreGrid", note: "3-up square grid with hover counts" },
      { name: "ProfileHeader", note: "Avatar, stats, bio, highlights, tabs" },
      { name: "SuggestionRail", note: "Follow toggles, trends, quiet footer" },
      { name: "ComposerRow", note: "Focuses the nearest comment field" },
    ],
    pages: [
      { name: "Feed", route: "/", sections: ["Stories", "Composer", "Posts", "Suggestions"] },
      { name: "Explore", route: "/explore", sections: ["Grid", "Hover counts"] },
      { name: "Profile", route: "/:handle", sections: ["Header", "Highlights", "Tabs", "Grid"] },
      { name: "Story viewer", route: "/stories/:id", sections: ["Progress", "Author", "Reply"] },
    ],
    features: [
      "Working double-tap likes",
      "Comment composer on every post",
      "Timed story viewer",
      "Explore and profile views",
      "Follow toggles",
      "Save / bookmark state",
    ],
    database: [
      {
        table: "posts",
        columns: [
          { name: "id", type: "uuid" },
          { name: "author_id", type: "uuid" },
          { name: "caption", type: "text" },
          { name: "image_url", type: "text" },
          { name: "likes", type: "int" },
          { name: "created_at", type: "timestamptz" },
        ],
      },
      {
        table: "comments",
        columns: [
          { name: "id", type: "uuid" },
          { name: "post_id", type: "uuid" },
          { name: "author_id", type: "uuid" },
          { name: "body", type: "text" },
        ],
      },
      {
        table: "likes",
        columns: [
          { name: "user_id", type: "uuid" },
          { name: "post_id", type: "uuid" },
          { name: "created_at", type: "timestamptz" },
        ],
      },
      {
        table: "follows",
        columns: [
          { name: "follower_id", type: "uuid" },
          { name: "following_id", type: "uuid" },
        ],
      },
    ],
  };
}
