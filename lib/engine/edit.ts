import { esc, rng } from "./base";
import type { BuildOptions, EditOutcome, FileMap, GenreId, Plan, SelectionInfo } from "../types";

type EditContext = {
  files: FileMap;
  plan: Plan;
  options: BuildOptions;
  genre: GenreId;
};

export const EDIT_SUGGESTIONS = [
  "Make the accent orange",
  "Switch to dark mode",
  "Rounder corners",
  "Add a testimonials section",
  "Add an FAQ",
  "Rewrite the headline to “Made for the way you actually live.”",
  "Add a newsletter signup",
  "Remove the pricing section",
];

const COLORS: { word: RegExp; hex: string; name: string }[] = [
  { word: /\b(orange|tangerine|apricot|warm)\b/i, hex: "#E4572E", name: "orange" },
  { word: /\b(red|crimson|scarlet)\b/i, hex: "#C43A32", name: "red" },
  { word: /\b(pink|rose|blush)\b/i, hex: "#D9557B", name: "rose" },
  { word: /\b(purple|violet|plum)\b/i, hex: "#7A5AD6", name: "violet" },
  { word: /\b(indigo|cool)\b/i, hex: "#4453C4", name: "indigo" },
  { word: /\b(blue|navy|cobalt)\b/i, hex: "#2F63D8", name: "blue" },
  { word: /\b(teal|turquoise|aqua)\b/i, hex: "#0E7C79", name: "teal" },
  { word: /\b(green|fern|forest|emerald)\b/i, hex: "#1F7A4E", name: "green" },
  { word: /\b(lime|chartreuse)\b/i, hex: "#9FC53D", name: "lime" },
  { word: /\b(yellow|citrus|sunshine)\b/i, hex: "#F0C33C", name: "yellow" },
  { word: /\b(gold|amber|mustard)\b/i, hex: "#C9992E", name: "gold" },
  { word: /\b(black|charcoal|near-black)\b/i, hex: "#16161A", name: "charcoal" },
  { word: /\b(white|ivory|bone)\b/i, hex: "#F6F1E7", name: "ivory" },
];

const SECTION_WORDS: { kind: string; label: string; re: RegExp }[] = [
  { kind: "testimonials", label: "testimonials", re: /\btestimonials?\b|\breviews?\b|\bsocial proof\b/i },
  { kind: "pricing", label: "pricing", re: /\bpricing\b|\bplans?\b|\btiers?\b/i },
  { kind: "faq", label: "FAQ", re: /\bfaq\b|\bquestions\b|\bobjections\b/i },
  { kind: "contact", label: "contact", re: /\bcontact\b|\bget in touch\b|\benquiry\b|\binquiry\b/i },
  { kind: "newsletter", label: "newsletter", re: /\bnewsletter\b|\bemail list\b|\bsubscribe\b/i },
  { kind: "story", label: "story", re: /\bstory\b|\babout (?:us|the (?:studio|team|brand))\b|\bteam section\b/i },
];

function tokensOf(css: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of css.matchAll(/--([\w-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

function setToken(css: string, name: string, value: string): string {
  const re = new RegExp(`--${name}:\\s*[^;]+;`);
  if (re.test(css)) return css.replace(re, `--${name}:${value};`);
  return css;
}

function hexToRgb(hex: string) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

function srgb(c: number) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function lum(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return 0.2126 * srgb(rgb.r) + 0.7152 * srgb(rgb.g) + 0.0722 * srgb(rgb.b);
}

function ratio(a: string, b: string): number {
  const la = lum(a);
  const lb = lum(b);
  if (la === null || lb === null) return 0;
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

function bestInk(hex: string): string {
  return ratio(hex, "#0b0b0d") >= ratio(hex, "#ffffff") ? "#0b0b0d" : "#ffffff";
}

function mix(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  if (!ca || !cb) return a;
  const to = (x: number, y: number) => Math.round(x + (y - x) * t);
  const h = (n: number) => n.toString(16).padStart(2, "0");
  return `#${h(to(ca.r, cb.r))}${h(to(ca.g, cb.g))}${h(to(ca.b, cb.b))}`;
}

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "") || "studio";
}

function isDark(hex?: string): boolean {
  if (!hex) return false;
  const l = lum(hex);
  return l !== null && l < 0.22;
}

function sectionMarkup(kind: string, brand: string, seed: string): string {
  const r = rng(`${kind}::${brand}::${seed}`);
  const pickFrom = <T,>(list: T[]): T => list[Math.floor(r() * list.length)];
  const head = (eyebrow: string, title: string, intro: string) =>
    `<div class="xsec-head"><span class="eyebrow">${eyebrow}</span><h2 class="display">${title}</h2><p>${intro}</p></div>`;

  if (kind === "testimonials") {
    const quotes = [
      { q: "It feels like a place, not a template. Small details keep surprising me a week later.", n: "Ada Whitfield", r: "Product lead, Fold" },
      { q: "We shipped in an afternoon and it already reads like a brand twice our size.", n: "Marcus Ilan", r: "Founder, Purl" },
      { q: "The copy is honest and the pace is calm. That combination is rare.", n: "Sofia Reyes", r: "Editor, Tallgrass" },
      { q: "Every screen has one clear next step. Our support inbox noticed immediately.", n: "Nadia Okafor", r: "Operations, Nook" },
    ];
    const chosen = [pickFrom(quotes), pickFrom(quotes), pickFrom(quotes)].filter(
      (q, i, arr) => arr.findIndex((x) => x.n === q.n) === i,
    );
    while (chosen.length < 3) {
      const next = quotes.find((q) => !chosen.some((c) => c.n === q.n));
      if (!next) break;
      chosen.push(next);
    }
    return `<section class="xsec" data-section="testimonials">
  <div class="container">
    ${head("Kind words", "What people notice", "A few notes from the people who use it every day.")}
    <div class="xsec-grid xgrid-3">
      ${chosen
        .map(
          (q) => `<figure class="xcard xquote">
        <blockquote>“${q.q}”</blockquote>
        <figcaption><span class="xavatar">${q.n
          .split(" ")
          .map((p) => p[0])
          .join("")}</span><span><strong>${q.n}</strong><small>${q.r}</small></span></figcaption>
      </figure>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
  }

  if (kind === "pricing") {
    const tiers = [
      { name: "Starter", price: 9, note: "For one small idea", features: ["One project", "Core sections", "Community support"] },
      { name: "Studio", price: 24, note: "For working teams", features: ["Unlimited projects", "Custom palette", "Priority review"], featured: true },
      { name: "Atelier", price: 59, note: "For the long haul", features: ["Everything in Studio", "Shared libraries", "Named support"] },
    ];
    return `<section class="xsec" data-section="pricing">
  <div class="container">
    ${head("Pricing", "Simple plans, no theatre", "Start free where it makes sense. Move up when the work does.")}
    <div class="xsec-grid xgrid-3">
      ${tiers
        .map(
          (t) => `<article class="xcard xtier${t.featured ? " is-featured" : ""}">
        <div class="xtier-top"><h3>${t.name}</h3>${t.featured ? '<span class="xpill">Most chosen</span>' : ""}</div>
        <p class="xprice"><strong>$${t.price}</strong><span>/month</span></p>
        <p class="xtier-note">${t.note}</p>
        <ul class="xlist">${t.features.map((f) => `<li>${f}</li>`).join("")}</ul>
        <button class="btn ${t.featured ? "btn--primary" : "btn--ghost"}">Choose ${t.name}</button>
      </article>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
  }

  if (kind === "faq") {
    const items = [
      ["What is included from day one?", "The full site, the design tokens, and the interaction layer. Nothing waits behind a second purchase."],
      ["Can I change the design later?", "Yes. Palette, corners, copy, and whole sections are editable from the workspace chat."],
      ["Is this a template I will see elsewhere?", "No. The palette, type pairing, copy, and layout are composed for this brief."],
      ["How do I take it with me?", "Export a ZIP or push the files to a Git repository whenever you like."],
      ["Do you use tracking?", "No third-party analytics are added by default. Bring your own if you need them."],
    ];
    return `<section class="xsec" data-section="faq">
  <div class="container xfaq-wrap">
    ${head("Answers", "Questions, answered", "The short version, before you ask.")}
    <div class="xfaq">
      ${items
        .map(
          ([q, a], i) => `<details${i === 0 ? " open" : ""}><summary>${q}<span aria-hidden="true">+</span></summary><p>${a}</p></details>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
  }

  if (kind === "contact") {
    const email = `hello@${slug(brand)}.com`;
    return `<section class="xsec" data-section="contact">
  <div class="container xcontact">
    <div>${head("Contact", "Say hello", "Tell us what you are making. A real person answers.")}<p class="xemail"><a href="mailto:${email}">${email}</a></p></div>
    <form class="xcard xform" data-xform data-done="Message sent ✓">
      <label>Name<input type="text" name="name" placeholder="Ada Whitfield" required /></label>
      <label>Email<input type="email" name="email" placeholder="you@studio.com" required /></label>
      <label>What are you building?<textarea name="message" rows="3" placeholder="A calmer way to buy produce…"></textarea></label>
      <button class="btn btn--primary" type="submit">Send message</button>
    </form>
  </div>
</section>`;
  }

  if (kind === "newsletter") {
    return `<section class="xsec" data-section="newsletter">
  <div class="container xnews">
    <div><span class="eyebrow">Newsletter</span><h2 class="display">One quiet letter a month.</h2><p>New work, what we learned, and nothing else. Unsubscribe in one click.</p></div>
    <form class="xnews-form" data-xform data-done="You're on the list ✓">
      <input type="email" name="email" placeholder="you@studio.com" aria-label="Email address" required />
      <button class="btn btn--primary" type="submit">Join</button>
    </form>
  </div>
</section>`;
  }

  return `<section class="xsec" data-section="story">
  <div class="container xstory">
    <div>${head("Our story", "Made by a small team", "")}<p>We started ${brand} because the tools we used felt louder than the work. So we built something quieter: fewer screens, clearer words, and room for the details to breathe.</p><p>Today the team is small on purpose. Everyone who touches a project can see it from the first sketch to the final line of copy.</p></div>
    <div class="xstats">
      <div><strong>2019</strong><span>First project</span></div>
      <div><strong>12</strong><span>People, no more</span></div>
      <div><strong>40+</strong><span>Launches</span></div>
      <div><strong>6</strong><span>Time zones</span></div>
    </div>
  </div>
</section>`;
}

const SECTION_CSS = `
/* atelier: added sections */
.xsec{padding:88px 0;border-top:1px solid var(--line)}
.xsec-head{max-width:620px;margin-bottom:36px}
.xsec-head h2{font-size:clamp(30px,4vw,46px);margin:10px 0 12px}
.xsec-head p{color:var(--muted);margin:0;max-width:52ch}
.xsec-grid{display:grid;gap:16px}
.xgrid-3{grid-template-columns:repeat(3,1fr)}
.xcard{background:var(--surface);border:1px solid var(--line);border-radius:calc(var(--radius) * .9);padding:26px}
.xquote{display:flex;flex-direction:column;justify-content:space-between;gap:26px;margin:0}
.xquote blockquote{margin:0;font-size:16px;line-height:1.55}
.xquote figcaption{display:flex;align-items:center;gap:11px;font-size:13px}
.xquote figcaption span:last-child{display:flex;flex-direction:column;line-height:1.3}
.xquote small{color:var(--muted);font-size:12px}
.xavatar{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--accent);color:var(--accent-ink);font-size:11px;font-weight:700;flex:none}
.xtier{display:flex;flex-direction:column;gap:14px}
.xtier.is-featured{border-color:var(--accent);box-shadow:0 24px 60px -40px var(--accent)}
.xtier-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
.xtier-top h3{margin:0;font-size:17px}
.xpill{align-self:flex-start;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);background:var(--accent-soft);border-radius:99px;padding:4px 9px}
.xprice{display:flex;align-items:baseline;gap:4px;margin:0}
.xprice strong{font-family:var(--font-display);font-size:40px;line-height:1;letter-spacing:-.03em}
.xprice span{color:var(--muted);font-size:13px}
.xtier-note{color:var(--muted);font-size:13px;margin:0}
.xlist{display:grid;gap:8px;margin:0 0 8px;font-size:13px}
.xlist li{position:relative;padding-left:19px}
.xlist li::before{content:"";position:absolute;left:0;top:.48em;width:9px;height:5px;border-left:2px solid var(--accent);border-bottom:2px solid var(--accent);transform:rotate(-45deg)}
.xfaq-wrap{display:grid;grid-template-columns:.9fr 1.1fr;gap:48px;align-items:start}
.xfaq details{border-bottom:1px solid var(--line);padding:18px 0}
.xfaq summary{display:flex;justify-content:space-between;gap:16px;list-style:none;cursor:pointer;font-weight:600;font-size:15px}
.xfaq summary::-webkit-details-marker{display:none}
.xfaq summary span{color:var(--muted);transition:transform .3s var(--ease)}
.xfaq details[open] summary span{transform:rotate(45deg)}
.xfaq p{color:var(--muted);font-size:14px;margin:10px 0 0;max-width:56ch}
.xcontact,.xstory{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start}
.xemail{margin-top:22px;font-size:18px}
.xemail a{border-bottom:1px solid var(--accent);padding-bottom:2px}
.xform{display:grid;gap:14px}
.xform label{display:grid;gap:6px;font-size:12px;font-weight:600;letter-spacing:.02em}
.xform input,.xform textarea,.xnews-form input{width:100%;background:var(--bg);border:1px solid var(--line);border-radius:calc(var(--radius) * .5);padding:11px 13px;font-size:14px;resize:vertical}
.xform input:focus,.xform textarea:focus,.xnews-form input:focus{outline:2px solid var(--accent);outline-offset:1px}
.xform .btn{justify-self:start}
.xnews{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;flex-wrap:wrap}
.xnews h2{font-size:clamp(28px,3.6vw,42px);margin:10px 0 8px}
.xnews p{color:var(--muted);margin:0;max-width:44ch}
.xnews-form{display:flex;gap:8px;flex-wrap:wrap}
.xnews-form input{min-width:240px;background:var(--surface);height:44px}
.xstory p{color:var(--muted);max-width:52ch}
.xstats{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.xstats div{background:var(--surface);border:1px solid var(--line);border-radius:calc(var(--radius) * .8);padding:20px}
.xstats strong{display:block;font-family:var(--font-display);font-size:32px;line-height:1;letter-spacing:-.03em}
.xstats span{display:block;color:var(--muted);font-size:12px;margin-top:6px}
@media (max-width:900px){
  .xsec{padding:64px 0}
  .xgrid-3,.xfaq-wrap,.xcontact,.xstory{grid-template-columns:1fr;gap:28px}
}
@media (max-width:560px){
  .xnews{align-items:flex-start}
  .xnews-form input{min-width:0;width:100%}
  .xnews-form{width:100%}
  .xnews-form .btn{width:100%}
}
`;

const SECTION_JS = `
(function(){
  if(window.__atelierSections)return;window.__atelierSections=true;
  document.querySelectorAll('[data-xform]').forEach(function(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var btn=form.querySelector('button[type="submit"]')||form.querySelector('button');
      if(!btn||btn.disabled)return;
      var label=form.getAttribute('data-done')||'Sent';
      var old=btn.textContent;
      btn.textContent=label;btn.disabled=true;
      setTimeout(function(){btn.textContent=old;btn.disabled=false;form.reset()},2800);
    });
  });
})();
`;

function insertSection(html: string, block: string): string {
  const main = html.lastIndexOf("</main>");
  if (main >= 0) return `${html.slice(0, main)}${block}\n${html.slice(main)}`;
  const footer = html.lastIndexOf("<footer");
  if (footer >= 0) return `${html.slice(0, footer)}${block}\n${html.slice(footer)}`;
  return html.replace("</body>", `${block}\n</body>`);
}

function replaceHeadline(html: string, text: string): { html: string; ok: boolean } {
  const re = /(<h1\b[^>]*>)[\s\S]*?(<\/h1>)/i;
  if (!re.test(html)) return { html, ok: false };
  return { html: html.replace(re, `$1${esc(text)}$2`), ok: true };
}

function sanitizeSelector(selector: string): string {
  return selector.replace(/[{}<>;@]/g, "").trim();
}

function condense(text: string): string {
  const base = text.replace(/\s+/g, " ").trim();
  const clause = base.split(/\s+(?:before|because|while|when|which|that|so)\s+/i)[0];
  let out = (clause.length >= 12 ? clause : base).replace(/[,;:\-–—\s]+$/, "");
  const words = out.split(" ");
  if (words.length > 9) out = words.slice(0, 8).join(" ");
  out = out.replace(/\s+(?:the|a|an|and|or|of|at|to|in|for|with|by|before|your)$/i, "");
  if (out.length < 2) return base;
  return /[.!?]$/.test(out) ? out : `${out}.`;
}

function changedFiles(before: FileMap, after: FileMap): string[] {
  return Object.keys(after).filter((path) => before[path] !== after[path]);
}

export function applyEdit(ctx: EditContext, rawInstruction: string, selection?: SelectionInfo | null): EditOutcome {
  const instruction = rawInstruction.trim();
  const lower = instruction.toLowerCase();
  let files: FileMap = { ...ctx.files };
  const index = () => files["index.html"] ?? "";
  const tokensPath = "styles/tokens.css";
  const tokensCss = () => files[tokensPath] ?? "";
  const tokens = () => tokensOf(tokensCss());
  const brand = ctx.plan.brand.name;
  const quoted = instruction.match(/["“”']([^"“”']{2,140})["“”']/)?.[1]?.trim();

  const patchTokens = (patch: (css: string) => string) => {
    files[tokensPath] = patch(tokensCss());
  };

  const setAccent = (hex: string, label: string): EditOutcome => {
    const t = tokens();
    patchTokens((css) =>
      setToken(
        setToken(
          setToken(css, "accent", hex),
          "accent-ink",
          bestInk(hex),
        ),
        "accent-soft",
        mix(hex, t.bg ?? "#ffffff", 0.86),
      ),
    );
    return {
      files,
      summary: `Set the accent to ${label} (${hex}) and recalculated the ink so button text stays readable.`,
      changed: changedFiles(ctx.files, files),
      accent: hex,
    };
  };

  const headlineIntent = /\bheadline\b|\bhero title\b|\bh1\b/i.test(instruction);
  const brandIntent =
    /\b(rename|rebrand|call it|name it|brand name)\b/i.test(instruction) && !headlineIntent;

  if (brandIntent) {
    const candidate =
      quoted ||
      instruction.match(/(?:rename|rebrand|call|name)\s+(?:it|the (?:brand|site|company))\s+(?:to\s+|as\s+)?([A-Za-z][\w&'’ -]{1,28})/i)?.[1]?.trim();
    if (candidate && /^[A-Za-z0-9][A-Za-z0-9&'’ .-]*$/.test(candidate)) {
      const name = candidate.replace(/\s+/g, " ").trim();
      const words = name.split(" ");
      const monogram = (words.length > 1 ? words.slice(0, 2).map((w) => w[0]).join("") : name.slice(0, 2)).toUpperCase();
      files["index.html"] = index().split(brand).join(esc(name));
      files["README.md"] = (files["README.md"] ?? "").split(brand).join(name);
      return {
        files,
        summary: `Renamed the brand from ${brand} to ${name}. Updated the wordmark, page title, meta description, and README.`,
        changed: changedFiles(ctx.files, files),
        brandName: name,
      };
    }
  }

  if (headlineIntent) {
    const text =
      quoted ||
      instruction.match(/(?:headline|hero title|title)\s*(?:to|say|read|:)\s*(.+)$/i)?.[1]?.trim();
    if (text) {
      const next = replaceHeadline(index(), text);
      if (next.ok) {
        files["index.html"] = next.html;
        return {
          files,
          summary: `Rewrote the hero headline to “${text.replace(/[.!?]+$/, "")}”. Only index.html changed.`,
          changed: changedFiles(ctx.files, files),
        };
      }
    }
  }

  const sectionTarget = SECTION_WORDS.find((s) => s.re.test(instruction));
  const wantsRemove = /\b(remove|delete|hide|drop)\b/i.test(instruction);
  const wantsAdd = /\b(add|include|insert|give (?:it|me)|put)\b/i.test(instruction);

  if (sectionTarget && (wantsAdd || wantsRemove)) {
    const exists = new RegExp(`data-section=["']${sectionTarget.kind}["']`).test(index());
    if (wantsRemove) {
      if (!exists) {
        return {
          files,
          summary: `There is no ${sectionTarget.label} section in this build, so nothing was removed.`,
          changed: [],
        };
      }
      files["index.html"] = index().replace(
        new RegExp(`\\s*<section[^>]*data-section=["']${sectionTarget.kind}["'][\\s\\S]*?</section>`),
        "",
      );
      return {
        files,
        summary: `Removed the ${sectionTarget.label} section from index.html. No other files were touched.`,
        changed: changedFiles(ctx.files, files),
      };
    }
    if (exists) {
      return {
        files,
        summary: `This build already has a ${sectionTarget.label} section — tell me what to change inside it and I will edit that part.`,
        changed: [],
      };
    }
    files["index.html"] = insertSection(index(), sectionMarkup(sectionTarget.kind, brand, instruction));
    if (!/atelier: added sections/.test(files["styles/site.css"] ?? "")) {
      files["styles/site.css"] = `${files["styles/site.css"] ?? ""}\n${SECTION_CSS}`;
    }
    if (!/__atelierSections/.test(files["app.js"] ?? "")) {
      files["app.js"] = `${files["app.js"] ?? ""}\n${SECTION_JS}`;
    }
    return {
      files,
      summary: `Added a ${sectionTarget.label} section with real copy and a matching layout. index.html, styles/site.css, and app.js changed.`,
      changed: changedFiles(ctx.files, files),
      addedSection: sectionTarget.kind,
    };
  }

  if (selection) {
    if (selection.tag.toLowerCase() === "h1") {
      const wantsShorter = /\b(short(er)?|concise|punch(ier)?|tighter|rewrite|reword|direct(er)?)\b/i.test(instruction);
      const text = quoted ?? (wantsShorter ? condense(selection.text) : null);
      if (text && text !== selection.text) {
        const next = replaceHeadline(index(), text);
        if (next.ok) {
          files["index.html"] = next.html;
          return {
            files,
            summary: `Rewrote the selected ${selection.tag} to “${text.replace(/[.!?]+$/, "")}”. Only index.html changed.`,
            changed: changedFiles(ctx.files, files),
          };
        }
      }
    }

    const scoped =
      !/\b(site|page|everything|global|palette|accent|whole)\b/i.test(instruction) &&
      /\b(this|that|it|here|selected)\b|\b(bigger|larger|smaller|bolder|center|centre|rounder|hide|remove|color|colour|background)\b/i.test(
        instruction,
      );
    if (scoped) {
      const selector = sanitizeSelector(selection.selector);
      if (selector) {
        const props: string[] = [];
        const colorHit = COLORS.find((c) => c.word.test(instruction));
        if (/\b(hide|remove|delete)\b/i.test(instruction)) props.push("display:none");
        if (/\b(bigger|larger|big)\b/i.test(instruction)) props.push("font-size:1.28em");
        if (/\b(smaller|tiny)\b/i.test(instruction)) props.push("font-size:.85em");
        if (/\b(bolder|heavier|bold)\b/i.test(instruction)) props.push("font-weight:700");
        if (/\b(center|centre)\b/i.test(instruction)) props.push("text-align:center");
        if (/\b(rounder|rounded|pill)\b/i.test(instruction)) props.push("border-radius:calc(var(--radius) * 1.6)");
        if (/\b(more space|padding|breathing room)\b/i.test(instruction)) props.push("padding:26px");
        if (colorHit) {
          if (/\bbackground|bg\b/i.test(instruction)) props.push(`background:${colorHit.hex}`, `color:${bestInk(colorHit.hex)}`);
          else props.push(`color:${colorHit.hex}`);
        }
        if (props.length) {
          const css = `\n/* Atelier scoped edit — ${selection.tag} */\n${selector}{${props.join(";")}}\n`;
          files["styles/site.css"] = `${files["styles/site.css"] ?? ""}${css}`;
          return {
            files,
            summary: `Scoped a change to the ${selection.tag} you selected (${selector}): ${props.join("; ")}. Added to styles/site.css only.`,
            changed: changedFiles(ctx.files, files),
          };
        }
      }
    }
  }

  const hexHit = instruction.match(/#([0-9a-f]{6}|[0-9a-f]{3})\b/i)?.[0];
  const colorHit = COLORS.find((c) => c.word.test(instruction));
  const paletteIntent = /\b(colou?r|accent|palette|theme)\b/i.test(instruction) || Boolean(hexHit);

  if (hexHit) return setAccent(hexHit.toLowerCase(), "your hex value");
  if (colorHit && paletteIntent) return setAccent(colorHit.hex, colorHit.name);
  if (/\bmonochrome\b|\bblack and white\b|\bgrayscale\b/i.test(instruction)) {
    const t = tokens();
    return setAccent(isDark(t.bg) ? "#e9e6dd" : "#17171a", "monochrome");
  }

  if (/\b(dark mode|dark theme|night mode|make it dark|darker theme|go dark)\b/i.test(instruction)) {
    const t = tokens();
    if (isDark(t.bg)) {
      return { files, summary: "This build is already dark, so I left the palette alone. Say “light mode” to flip it.", changed: [] };
    }
    const accent = t.accent ?? "#E4572E";
    patchTokens((css) =>
      setToken(
        setToken(
          setToken(setToken(setToken(setToken(css, "bg", "#0b0c10"), "surface", "#14161c"), "surface-2", "#1d2029"),
            "text",
            "#f5f3ee",
          ),
          "muted",
          "#a7a9b2",
        ),
        "line",
        "rgba(255,255,255,.13)",
      )
        .replace(/--accent-ink:\s*[^;]+;/, `--accent-ink:${bestInk(accent)};`)
        .replace(/--accent-soft:\s*[^;]+;/, `--accent-soft:${mix(accent, "#0b0c10", 0.82)};`),
    );
    return {
      files,
      summary: "Flipped the site to a dark palette: new canvas, surfaces, ink, dividers, and a re-checked accent ink. Type and layout are untouched.",
      changed: changedFiles(ctx.files, files),
      mode: "dark",
    };
  }

  if (/\b(light mode|light theme|day mode|make it light|brighter theme|go light)\b/i.test(instruction)) {
    const t = tokens();
    if (!isDark(t.bg)) {
      return { files, summary: "This build already sits on a light canvas. Say “dark mode” to flip it.", changed: [] };
    }
    const accent = t.accent ?? "#E4572E";
    patchTokens((css) =>
      setToken(
        setToken(
          setToken(setToken(setToken(setToken(css, "bg", "#faf8f3"), "surface", "#ffffff"), "surface-2", "#f1ece2"),
            "text",
            "#17140f",
          ),
          "muted",
          "#5d584e",
        ),
        "line",
        "rgba(23,20,15,.14)",
      )
        .replace(/--accent-ink:\s*[^;]+;/, `--accent-ink:${bestInk(accent)};`)
        .replace(/--accent-soft:\s*[^;]+;/, `--accent-soft:${mix(accent, "#faf8f3", 0.85)};`),
    );
    return {
      files,
      summary: "Flipped the site to a warm light palette: paper canvas, white surfaces, dark ink, and a re-checked accent ink.",
      changed: changedFiles(ctx.files, files),
      mode: "light",
    };
  }

  const radiusNum = instruction.match(/\bradius\s*(?:to|=|of|at)?\s*(\d{1,2})\b/i)?.[1];
  const rounder = /\b(rounder|more rounded|softer corners|softer edges)\b/i.test(instruction);
  const sharper = /\b(sharper|square|less rounded|tight corners|sharper corners)\b/i.test(instruction);
  if (radiusNum || rounder || sharper) {
    const current = Number(tokens().radius?.replace("px", "")) || ctx.options.radius;
    const target = radiusNum
      ? Math.max(0, Math.min(32, Number(radiusNum)))
      : Math.max(0, Math.min(32, current + (rounder ? 6 : -6)));
    patchTokens((css) => setToken(css, "radius", `${target}px`));
    return {
      files,
      summary: `Set the corner radius to ${target}px. Cards, buttons, and inputs all follow the token.`,
      changed: changedFiles(ctx.files, files),
      radius: target,
    };
  }

  if (/\b(larger|bigger|increase|bump)\b.*\b(text|type|font)\b|\btype scale\b/i.test(instruction)) {
    const css = `\n/* Atelier type scale */\nbody{font-size:17px}\n`;
    files["styles/site.css"] = `${files["styles/site.css"] ?? ""}${css}`;
    return {
      files,
      summary: "Raised the base type size to 17px. Headings keep their relative scale.",
      changed: changedFiles(ctx.files, files),
    };
  }

  if (/\b(smaller|reduce|tighten)\b.*\b(text|type|font)\b/i.test(instruction)) {
    const css = `\n/* Atelier type scale */\nbody{font-size:15px}\n`;
    files["styles/site.css"] = `${files["styles/site.css"] ?? ""}${css}`;
    return {
      files,
      summary: "Lowered the base type size to 15px so more fits on screen. Headings keep their relative scale.",
      changed: changedFiles(ctx.files, files),
    };
  }

  if (/\bserif\b/i.test(instruction) && /\b(headline|display|heading|font|type)\b/i.test(instruction)) {
    patchTokens((css) => setToken(css, "font-display", '"Instrument Serif", Georgia, serif'));
    if (!/Instrument\+Serif/.test(index())) {
      files["index.html"] = index().replace(
        "</head>",
        '  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />\n</head>',
      );
    }
    return {
      files,
      summary: "Switched the display face to Instrument Serif and loaded it in the document head. Body copy is unchanged.",
      changed: changedFiles(ctx.files, files),
    };
  }

  if (/\b(wider|narrower)\b.*\b(container|layout|content|column)\b/i.test(instruction)) {
    const wider = /\bwider\b/i.test(instruction);
    patchTokens((css) => setToken(css, "max", wider ? "1280px" : "1040px"));
    return {
      files,
      summary: `Set the content container to ${wider ? "1280px" : "1040px"}.`,
      changed: changedFiles(ctx.files, files),
    };
  }

  const suggestions = EDIT_SUGGESTIONS.slice(0, 4).map((s) => `“${s}”`).join(", ");
  return {
    files,
    summary: `I could not map that to a safe, targeted change, so I left the code untouched. I can edit palette, mode, radius, type scale, headline copy, brand name, and add or remove whole sections. For example: ${suggestions}.`,
    changed: [],
  };
}
