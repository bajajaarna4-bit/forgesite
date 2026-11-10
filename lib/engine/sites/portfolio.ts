import { BuiltSite, FONT_LINK, esc, pick, rng, runtimeJs } from "../base";
import { Theme, renderTokens, withRadius } from "../theme";

type Opts = { seed: string; palette: number; radius: number; sections: string[] };

const BRANDS = ["Mira Solberg", "Ivo Marchetti", "Elin Ward", "Atelier Voss", "Noor Haddad"];
const ROLES = ["Furniture & object designer", "Independent designer", "Furniture maker & designer"];

type Project = {
  n: string;
  title: string;
  cat: string;
  year: string;
  note: string;
  seed: string;
};

const PROJECTS: Project[] = [
  { n: "01", title: "Kastanie Bench", cat: "Seating", year: "2025", note: "Solid oak, hand-finished. Made for a hallway that gets a lot of light.", seed: "bench-kastanie" },
  { n: "02", title: "Hald Chair", cat: "Seating", year: "2024", note: "A low chair in ash and paper cord, built to be repaired rather than replaced.", seed: "chair-hald" },
  { n: "03", title: "Værk Table", cat: "Tables", year: "2024", note: "A work table for a small studio. Two metres, one drawer, no fuss.", seed: "table-vaerk" },
  { n: "04", title: "Lys Series", cat: "Lighting", year: "2023", note: "Three lamps in brushed aluminium, each named after the hour it is best used.", seed: "light-lys" },
  { n: "05", title: "Fold Shelving", cat: "Storage", year: "2022", note: "A shelf that ships flat and assembles without tools or instructions.", seed: "shelf-fold" },
];

const SERVICES = [
  { n: "01", t: "Furniture design", d: "From first sketch to production drawings. Small runs, honest materials, no plastic veneers." },
  { n: "02", t: "Objects & lighting", d: "One-off pieces and small series, made with a network of four workshops across Jutland." },
  { n: "03", t: "Spatial consulting", d: "Rooms that need one good piece, not eleven adequate ones. Usually a two-week engagement." },
];

const CLIENTS = ["Nordhavn Studio", "Hald House", "Plinth", "Atelier Lys", "Form & Co", "Mesa Interiors", "Kanten"];

function palettesFor(): Theme[] {
  const base: Theme = {
    bg: "#F2EEE5",
    surface: "#FBF8F1",
    surface2: "#E8E1D2",
    text: "#16130f",
    muted: "#6E685D",
    line: "#DCD5C5",
    accent: "#A8492E",
    accentInk: "#ffffff",
    accentSoft: "#F3E3DC",
    radius: 6,
    max: "1120px",
    display: '"Instrument Serif", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    displayWeight: 400,
    displayTracking: "-0.02em",
    fontsLink: FONT_LINK("family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600"),
  };
  return [
    base,
    { ...base, bg: "#F4F1EA", accent: "#3E5B45", accentSoft: "#E4EBE2" },
    { ...base, bg: "#F1EDE6", accent: "#2F3A55", accentSoft: "#E4E7EE" },
  ];
}

export function buildPortfolio(opts: Opts): BuiltSite {
  const pal = palettesFor()[opts.palette % 3];
  const r = rng(opts.seed);
  const t = withRadius(pal, opts.radius);
  const brand = pick(BRANDS, r);
  const role = pick(ROLES, r);

  const rows = PROJECTS.map(
    (p) => `<a class="work-row" href="#contact" data-img="https://picsum.photos/seed/atelier-${encodeURIComponent(
      p.seed,
    )}/700/900" data-title="${esc(p.title)}">
      <span class="w-num">${p.n}</span>
      <span class="w-title display">${esc(p.title)}</span>
      <span class="w-cat">${esc(p.cat)}</span>
      <span class="w-year">${p.year}</span>
      <span class="w-arrow" aria-hidden="true">↗</span>
    </a>`,
  ).join("");

  const body = `
  <a class="skip" href="#work">Skip to work</a>
  <header class="nav" data-header>
    <a class="brand" href="#top">${esc(brand)}</a>
    <nav aria-label="Primary">
      <a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a>
    </nav>
    <span class="avail"><i></i> Booking Q2 2026</span>
  </header>

  <main id="main">
    <section class="hero container" id="top">
      <p class="hero-meta"><span>${esc(role)}</span><span>Copenhagen, DK</span><span>Est. 2016</span></p>
      <h1 class="display">Objects for<br><em>quiet</em> rooms.</h1>
      <div class="hero-foot">
        <p>I design furniture and small objects that age well — in oak, ash, linen and the occasional piece of surplus aluminium. Made close to home, in runs of ten to forty.</p>
        <a class="scroll-cue" href="#work">Selected work <span>↓</span></a>
      </div>
    </section>

    <section class="work container" id="work">
      <div class="sec-label"><span>Selected work</span><span>2022 — 2025</span></div>
      <div class="work-list">
        ${rows}
      </div>
      <p class="work-note">Five pieces from the archive. Full catalogue and prices on request.</p>
    </section>

    <section class="about container" id="about">
      <div class="about-grid">
        <div>
          <p class="sec-label"><span>About</span></p>
          <h2 class="display">A small practice with a long bench.</h2>
          <p class="about-copy">I trained as a cabinetmaker before studying design, which means most of my ideas are tested by making them. The studio is one room, two machines, and a wall of offcuts I refuse to throw away.</p>
          <p class="about-copy">Work is produced with four workshops in Jutland. Everything is designed to be repaired, re-oiled, and eventually handed down — not replaced.</p>
          <div class="about-facts">
            <div><strong>2016</strong><span>Studio founded</span></div>
            <div><strong>3</strong><span>People, including the dog</span></div>
            <div><strong>4</strong><span>Partner workshops</span></div>
          </div>
        </div>
        <div class="material-panel" aria-label="Material samples">
          <div class="mat mat--oak"><span>Oak</span><em>Smoked, oiled</em></div>
          <div class="mat mat--linen"><span>Linen</span><em>Natural, 340g</em></div>
          <div class="mat mat--alu"><span>Aluminium</span><em>Brushed, recycled</em></div>
          <p class="mat-note">Material studies, spring 2025</p>
        </div>
      </div>
    </section>

    <section class="services container">
      <div class="sec-label"><span>What I do</span><span>Commissions open</span></div>
      <div class="service-list">
        ${SERVICES.map(
          (s) =>
            `<div class="service"><span class="s-num">${s.n}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`,
        ).join("")}
      </div>
    </section>

    <section class="clients">
      <div class="marquee" aria-label="Selected clients">
        <div class="marquee-track">
          ${CLIENTS.map((c) => `<span>${esc(c)}</span><i>·</i>`).join("")}
          ${CLIENTS.map((c) => `<span>${esc(c)}</span><i>·</i>`).join("")}
        </div>
      </div>
    </section>

    <section class="contact container" id="contact">
      <p class="sec-label"><span>Contact</span></p>
      <h2 class="display">Have a room that needs one good piece?</h2>
      <a class="email" href="mailto:studio@mira-solberg.dk">studio@mira-solberg.dk <span>↗</span></a>
      <div class="contact-meta">
        <span>Copenhagen · CET</span>
        <span>Commissions from €4,000</span>
        <span>Lead time 8–12 weeks</span>
      </div>
    </section>
  </main>

  <footer class="footer container">
    <span>© 2026 ${esc(brand)}</span>
    <span>${esc(role)}</span>
    <div class="foot-links"><a href="#">Instagram</a><a href="#">Are.na</a><a href="#">Newsletter</a></div>
  </footer>

  <div class="cursor-preview" aria-hidden="true"><img src="" alt="" /><span></span></div>

  <style>
    .skip{position:absolute;left:16px;top:-48px;z-index:200;background:var(--text);color:#fff;padding:10px 16px;border-radius:6px;font-weight:600;transition:top .2s}
    .skip:focus{top:14px}
    .nav{position:fixed;top:0;left:0;right:0;z-index:60;display:flex;align-items:center;gap:32px;padding:18px max(22px,calc((100vw - 1120px)/2));transition:background .35s,border-color .35s,padding .35s}
    .nav.is-stuck{background:rgba(242,238,229,.9);backdrop-filter:blur(14px);border-bottom:1px solid var(--line);padding-top:12px;padding-bottom:12px}
    .brand{font-family:var(--font-display);font-size:21px;letter-spacing:-.02em}
    .nav nav{display:flex;gap:24px;font-size:12px;color:var(--muted);margin-left:auto}
    .nav nav a{position:relative;padding:3px 0}
    .nav nav a::after{content:"";position:absolute;left:0;right:100%;bottom:0;height:1px;background:var(--accent);transition:right .35s var(--ease)}
    .nav nav a:hover{color:var(--text)}
    .nav nav a:hover::after{right:0}
    .avail{display:inline-flex;align-items:center;gap:6px;font-size:10px;letter-spacing:.04em;border:1px solid var(--line);border-radius:99px;padding:5px 9px;color:var(--muted);white-space:nowrap}
    .avail i{width:5px;height:5px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
    .hero{padding-top:clamp(130px,18vh,190px);padding-bottom:clamp(50px,8vw,90px)}
    .hero-meta{display:flex;flex-wrap:wrap;gap:24px;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:30px}
    .hero h1{font-size:clamp(58px,11vw,140px);line-height:.86;letter-spacing:-.035em}
    .hero h1 em{font-style:italic;color:var(--accent)}
    .hero-foot{display:flex;justify-content:space-between;gap:40px;align-items:flex-end;margin-top:44px;padding-top:24px;border-top:1px solid var(--line)}
    .hero-foot p{max-width:46ch;font-size:13px;line-height:1.7;color:var(--muted)}
    .scroll-cue{font-size:11px;letter-spacing:.1em;text-transform:uppercase;display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
    .scroll-cue span{display:inline-grid;place-items:center;width:26px;height:26px;border:1px solid var(--line);border-radius:50%;transition:.3s}
    .scroll-cue:hover span{background:var(--accent);border-color:var(--accent);color:#fff;transform:translateY(2px)}
    .sec-label{display:flex;justify-content:space-between;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);border-top:1px solid var(--line);padding-top:12px;margin-bottom:20px}
    .work{padding-bottom:clamp(50px,8vw,100px)}
    .work-list{border-top:1px solid var(--line)}
    .work-row{display:grid;grid-template-columns:52px 1fr 150px 70px 34px;align-items:center;gap:18px;padding:24px 4px;border-bottom:1px solid var(--line);position:relative;transition:padding .4s var(--ease),background .3s}
    .w-num{font-size:10px;color:var(--muted);font-variant-numeric:tabular-nums}
    .w-title{font-size:clamp(24px,3.4vw,38px);letter-spacing:-.025em;transition:transform .45s var(--ease),color .3s}
    .w-cat,.w-year{font-size:11px;color:var(--muted)}
    .w-arrow{font-size:15px;opacity:.35;transition:.35s var(--ease);justify-self:end}
    .work-row:hover{background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent)}
    .work-row:hover .w-title{transform:translateX(10px);color:var(--accent)}
    .work-row:hover .w-arrow{opacity:1;transform:translate(2px,-2px)}
    .work-note{font-size:11px;color:var(--muted);margin-top:18px}
    .cursor-preview{position:fixed;top:0;left:0;width:260px;height:330px;pointer-events:none;z-index:40;opacity:0;transform:translate(-50%,-50%) rotate(-2deg) scale(.96);transition:opacity .25s,transform .3s var(--ease);border:1px solid var(--line);background:var(--surface2);border-radius:4px;overflow:hidden;box-shadow:0 30px 60px -30px rgba(22,19,15,.5)}
    .cursor-preview.is-on{opacity:1;transform:translate(-50%,-50%) rotate(-2deg) scale(1)}
    .cursor-preview img{width:100%;height:100%;object-fit:cover;filter:grayscale(.25) sepia(.12) contrast(1.02)}
    .cursor-preview span{position:absolute;left:0;right:0;bottom:0;padding:10px 12px;background:linear-gradient(0deg,rgba(22,19,15,.72),transparent);color:#fff;font-size:11px;letter-spacing:.02em}
    .about{padding:clamp(50px,8vw,100px) 0}
    .about-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:clamp(30px,6vw,80px);align-items:start}
    .about h2{font-size:clamp(30px,4.4vw,52px);line-height:1;margin:8px 0 24px;max-width:14ch}
    .about-copy{font-size:13px;line-height:1.75;color:var(--muted);max-width:48ch;margin-bottom:14px}
    .about-facts{display:flex;gap:36px;margin-top:30px;padding-top:20px;border-top:1px solid var(--line);flex-wrap:wrap}
    .about-facts strong{display:block;font-family:var(--font-display);font-size:28px;letter-spacing:-.02em}
    .about-facts span{font-size:10px;color:var(--muted)}
    .material-panel{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .mat{height:150px;border-radius:3px;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:12px;font-size:10.5px;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.35)}
    .mat span{font-weight:600;letter-spacing:.02em}
    .mat em{font-style:normal;font-size:9px;opacity:.72}
    .mat--oak{background:repeating-linear-gradient(90deg,#A98056 0 2px,#B48A60 2px 7px,#9F774E 7px 9px,#AF855A 9px 14px);grid-column:1/-1;height:210px}
    .mat--linen{background:repeating-linear-gradient(45deg,#C9BFA8 0 1px,#D3C9B2 1px 4px,#C4B9A1 4px 5px,#D0C6AF 5px 9px)}
    .mat--alu{background:repeating-linear-gradient(0deg,#8E9398 0 1px,#A2A7AC 1px 3px,#989DA2 3px 4px,#A8ADB2 4px 7px)}
    .mat-note{grid-column:1/-1;font-size:9.5px;color:var(--muted);letter-spacing:.03em;margin-top:2px}
    .services{padding:clamp(40px,6vw,70px) 0}
    .service-list{border-top:1px solid var(--line)}
    .service{display:grid;grid-template-columns:52px 1fr 1.1fr;gap:18px;align-items:start;padding:22px 4px;border-bottom:1px solid var(--line)}
    .s-num{font-size:10px;color:var(--muted);padding-top:4px}
    .service h3{font-size:15px;font-weight:500;letter-spacing:-.01em}
    .service p{font-size:12px;line-height:1.65;color:var(--muted)}
    .clients{border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:18px 0;overflow:hidden;margin:20px 0 clamp(50px,8vw,90px)}
    .marquee{overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
    .marquee-track{display:flex;align-items:center;gap:26px;width:max-content;animation:marq 38s linear infinite}
    .marquee-track span{font-family:var(--font-display);font-size:19px;color:#8A8478;white-space:nowrap}
    .marquee-track i{font-style:normal;color:var(--accent);font-size:13px}
    @keyframes marq{to{transform:translateX(-50%)}}
    .contact{padding:clamp(20px,4vw,60px) 0 clamp(50px,8vw,90px)}
    .contact h2{font-size:clamp(30px,5vw,62px);line-height:1.02;max-width:16ch;margin:8px 0 26px}
    .email{display:inline-flex;align-items:center;gap:12px;font-family:var(--font-display);font-size:clamp(22px,3.6vw,40px);letter-spacing:-.02em;border-bottom:1px solid var(--line);padding-bottom:6px;transition:.3s var(--ease)}
    .email span{transition:transform .3s var(--ease)}
    .email:hover{color:var(--accent);border-color:var(--accent)}
    .email:hover span{transform:translate(3px,-3px)}
    .contact-meta{display:flex;gap:26px;flex-wrap:wrap;margin-top:30px;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
    .footer{display:flex;align-items:center;gap:20px;padding:22px 0 30px;border-top:1px solid var(--line);font-size:10.5px;color:var(--muted);flex-wrap:wrap}
    .foot-links{margin-left:auto;display:flex;gap:16px}
    .foot-links a:hover{color:var(--text)}
    @media (max-width:900px){
      .nav nav{gap:16px}
      .nav .avail{display:none}
      .about-grid{grid-template-columns:1fr;gap:34px}
      .work-row{grid-template-columns:34px 1fr 70px 24px;gap:12px}
      .w-cat{display:none}
      .work-row:hover .w-title{transform:none}
      .cursor-preview{display:none}
      .service{grid-template-columns:34px 1fr;gap:12px}
      .service p{grid-column:2}
    }
    @media (max-width:640px){
      .nav{padding:12px 16px;gap:14px}
      .nav.is-stuck{padding:10px 16px}
      .brand{font-size:18px}
      .nav nav{font-size:11px;gap:13px}
      .hero{padding-top:110px}
      .hero h1{font-size:clamp(50px,16vw,84px)}
      .hero-meta{gap:14px;font-size:9px}
      .hero-foot{flex-direction:column;align-items:flex-start;gap:22px}
      .work-row{grid-template-columns:1fr 26px;padding:20px 2px}
      .w-num,.w-year{display:none}
      .w-arrow{grid-column:2;grid-row:1}
      .material-panel{grid-template-columns:1fr 1fr}
      .mat{height:120px}
      .mat--oak{height:160px}
      .footer{flex-direction:column;align-items:flex-start;gap:10px}
      .foot-links{margin-left:0}
    }
  </style>`;

  const js = `${runtimeJs}
(function(){
  var preview=document.querySelector('.cursor-preview');
  var img=preview?preview.querySelector('img'):null;
  var label=preview?preview.querySelector('span'):null;
  var raf=null,tx=0,ty=0,cx=0,cy=0,active=false;
  function tick(){
    cx+=(tx-cx)*.16;cy+=(ty-cy)*.16;
    preview.style.left=cx+'px';preview.style.top=cy+'px';
    if(active)raf=requestAnimationFrame(tick);
  }
  if(preview&&window.matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('.work-row').forEach(function(row){
      row.addEventListener('mouseenter',function(){
        img.src=row.getAttribute('data-img');
        label.textContent=row.getAttribute('data-title');
        preview.classList.add('is-on');
      });
      row.addEventListener('mouseleave',function(){
        preview.classList.remove('is-on');
        active=false;if(raf)cancelAnimationFrame(raf);raf=null;
      });
    });
    window.addEventListener('mousemove',function(e){
      tx=e.clientX;ty=e.clientY;
      if(!active){active=true;cx=tx;cy=ty;raf=requestAnimationFrame(tick)}
    },{passive:true});
  }
  window.addEventListener('scroll',function(){
    var h=document.querySelector('[data-header]');
    if(h)h.classList.toggle('is-stuck',window.scrollY>10);
  },{passive:true});
})();`;

  return {
    brand: { name: brand, tagline: role, monogram: brand.charAt(0) },
    html: body,
    css: "",
    tokens: renderTokens(t),
    js,
    fonts: { display: "Instrument Serif", body: "Inter", link: t.fontsLink },
    mood: "Gallery-like stillness. Bone paper, a single rust accent, oversized serif and generous empty space. Content is the ornament.",
    motion: [
      "Project preview follows the cursor with a 0.16 lerp",
      "Work titles slide 10px and turn rust on hover",
      "Client names scroll in a 38s marquee",
      "Sections reveal with a 22px rise",
    ],
    components: [
      { name: "WorkIndex", note: "Numbered rows with cursor-following preview" },
      { name: "MaterialPanel", note: "CSS material swatches, no photography" },
      { name: "ServiceList", note: "Three-column editorial rows" },
      { name: "ClientMarquee", note: "Infinite text ribbon with edge mask" },
      { name: "ContactBlock", note: "Oversized mail link with hover lift" },
      { name: "Nav", note: "Availability badge and underline links" },
    ],
    pages: [
      { name: "Index", route: "/", sections: ["Hero", "Selected work", "About", "Services", "Clients", "Contact"] },
      { name: "Project", route: "/work/:slug", sections: ["Gallery", "Details", "Process"] },
      { name: "About", route: "/about", sections: ["Bio", "Studio", "Materials"] },
      { name: "Contact", route: "/contact", sections: ["Email", "Availability"] },
    ],
    features: [
      "Cursor-following project preview",
      "Editorial type scale",
      "CSS material studies",
      "Infinite client marquee",
      "Availability indicator",
      "Fully responsive index",
    ],
    database: [
      {
        table: "projects",
        columns: [
          { name: "id", type: "uuid" },
          { name: "title", type: "text" },
          { name: "category", type: "text" },
          { name: "year", type: "int" },
          { name: "cover_url", type: "text" },
          { name: "notes", type: "text" },
        ],
      },
      {
        table: "inquiries",
        columns: [
          { name: "id", type: "uuid" },
          { name: "name", type: "text" },
          { name: "email", type: "text" },
          { name: "message", type: "text" },
          { name: "created_at", type: "timestamptz" },
        ],
      },
    ],
  };
}
