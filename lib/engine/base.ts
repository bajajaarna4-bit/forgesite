export const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rng(seed: string) {
  let a = hash(seed);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(list: T[], r: () => number): T {
  return list[Math.floor(r() * list.length)];
}

export function shuffle<T>(list: T[], r: () => number): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const photo = (seed: string, w: number, h: number, grayscale = false) =>
  `https://picsum.photos/seed/${encodeURIComponent("atelier-" + seed)}/${w}/${h}${
    grayscale ? "?grayscale" : ""
  }`;

export const imageTag = (
  seed: string,
  w: number,
  h: number,
  alt: string,
  cls = "",
  grayscale = false,
) =>
  `<img src="${photo(seed, w, h, grayscale)}" alt="${esc(alt)}" loading="lazy" decoding="async"${
    cls ? ` class="${cls}"` : ""
  } />`;

export function initialsAvatar(name: string, tone: string, size = 36) {
  const parts = name.trim().split(/\s+/);
  const ini = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  return `<span class="avatar" style="--tone:${tone};width:${size}px;height:${size}px;font-size:${Math.round(
    size * 0.36,
  )}px" aria-hidden="true">${esc(ini.toUpperCase())}</span>`;
}

export const money = (n: number) => `$${n.toFixed(2)}`;

export const baseCss = `
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--text);font-family:var(--font-body);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:hidden}
img{display:block;max-width:100%}
a{color:inherit;text-decoration:none}
button{font:inherit;color:inherit;border:0;background:none;cursor:pointer}
input,textarea,select{font:inherit;color:inherit}
h1,h2,h3,h4,p,figure{margin:0}
ul{margin:0;padding:0;list-style:none}
svg{display:block}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:6px}
::selection{background:var(--accent);color:var(--accent-ink)}
.container{width:min(100% - 44px,var(--max));margin-inline:auto}
.display{font-family:var(--font-display);font-weight:var(--display-weight,600);letter-spacing:var(--display-tracking,-0.025em);line-height:1.02}
.eyebrow{font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:600;color:var(--muted)}
.muted{color:var(--muted)}
.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 20px;height:44px;border-radius:calc(var(--radius) * .55);font-size:14px;font-weight:600;letter-spacing:-.01em;transition:transform .35s var(--ease),background .3s var(--ease),border-color .3s var(--ease),box-shadow .35s var(--ease);white-space:nowrap}
.btn:hover{transform:translateY(-1px)}
.btn:active{transform:translateY(0) scale(.985)}
.btn--primary{background:var(--accent);color:var(--accent-ink);box-shadow:0 10px 24px -14px var(--accent)}
.btn--primary:hover{box-shadow:0 16px 34px -14px var(--accent)}
.btn--ghost{border:1px solid var(--line);background:var(--surface);color:var(--text)}
.btn--ghost:hover{border-color:var(--accent);background:var(--surface-2)}
.btn--sm{height:36px;padding:0 14px;font-size:13px;border-radius:calc(var(--radius) * .45)}
.badge{display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 9px;border-radius:99px;font-size:11px;font-weight:600;letter-spacing:.02em;background:var(--surface-2);color:var(--muted);border:1px solid var(--line)}
.avatar{display:inline-grid;place-items:center;border-radius:50%;background:var(--tone,#333);color:#fff;font-weight:600;letter-spacing:.02em;flex:none;overflow:hidden}
.reveal{opacity:0;transform:translateY(22px);transition:opacity .85s var(--ease),transform .85s var(--ease)}
.reveal.in{opacity:1;transform:none}
.stagger > .reveal{transition-delay:calc(var(--i,0) * 70ms)}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.cover{width:100%;height:100%;object-fit:cover}
.hover-lift{transition:transform .45s var(--ease),box-shadow .45s var(--ease)}
.hover-lift:hover{transform:translateY(-4px)}
.img-zoom{overflow:hidden}
.img-zoom img{transition:transform .8s var(--ease)}
.img-zoom:hover img{transform:scale(1.05)}
.skeleton{background:linear-gradient(100deg,var(--surface) 20%,var(--surface-2) 38%,var(--surface) 56%);background-size:220% 100%;animation:sk 1.6s linear infinite}
@keyframes sk{to{background-position:-220% 0}}
@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@media (max-width:640px){
  .container{width:calc(100% - 32px)}
  .btn{height:42px}
}
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .reveal{opacity:1;transform:none;transition:none}
  *{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important}
}
`;

export const runtimeJs = `
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els=document.querySelectorAll('.reveal');
  if(reduce||!('IntersectionObserver' in window)){
    els.forEach(function(el){el.classList.add('in')});
  }else{
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
      });
    },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(el){io.observe(el)});
  }
  var hdr=document.querySelector('[data-header]');
  if(hdr){
    var onScroll=function(){hdr.classList.toggle('is-stuck',window.scrollY>14)};
    onScroll();window.addEventListener('scroll',onScroll,{passive:true});
  }
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape')return;
    document.querySelectorAll('.is-open[data-close-on-esc]').forEach(function(el){
      el.classList.remove('is-open');document.body.classList.remove('lock');
    });
  });
})();
`;

export const moneyJs = `
function money(n){return '$'+n.toFixed(2)}
`;

export type BuiltSite = {
  brand: { name: string; tagline: string; monogram: string };
  html: string;
  css: string;
  tokens: string;
  js: string;
  fonts: { display: string; body: string; link: string };
  mood: string;
  motion: string[];
  components: { name: string; note: string }[];
  pages: { name: string; route: string; sections: string[] }[];
  features: string[];
  database: { table: string; columns: { name: string; type: string; note?: string }[] }[];
};

export const FONT_LINK = (families: string) =>
  `https://fonts.googleapis.com/css2?${families}&display=swap`;
