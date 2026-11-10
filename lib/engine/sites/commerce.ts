import { BuiltSite, FONT_LINK, esc, pick, rng, runtimeJs, shuffle } from "../base";
import { Theme, renderTokens, withRadius } from "../theme";

type Opts = { seed: string; palette: number; radius: number; sections: string[] };

const BRANDS = ["Zest", "Kart", "Nimble", "Petal Market", "Basket"];

type Product = {
  id: string;
  name: string;
  unit: string;
  price: number;
  mrp?: number;
  emoji: string;
  tint: string;
  cat: string;
  tag?: string;
};

const PRODUCTS: Product[] = [
  { id: "avocado", name: "Hass Avocados", unit: "2 pcs · ripe", price: 2.4, mrp: 3.1, emoji: "🥑", tint: "#EAF4E3", cat: "produce", tag: "Organic" },
  { id: "mango", name: "Alphonso Mangoes", unit: "1 kg · boxed", price: 6.8, mrp: 8, emoji: "🥭", tint: "#FFF0D2", cat: "produce", tag: "Seasonal" },
  { id: "tomato", name: "Cherry Tomatoes", unit: "250 g · vine", price: 2.1, mrp: 2.6, emoji: "🍅", tint: "#FFE8E0", cat: "produce", tag: "Bestseller" },
  { id: "spinach", name: "Baby Spinach", unit: "120 g · washed", price: 2.65, emoji: "🥬", tint: "#E7F3DE", cat: "produce" },
  { id: "banana", name: "Bananas", unit: "6 pcs · fairtrade", price: 1.35, emoji: "🍌", tint: "#FFF6CE", cat: "produce" },
  { id: "blueberry", name: "Blueberries", unit: "125 g · punnet", price: 3.4, mrp: 4.2, emoji: "🫐", tint: "#EAE9FB", cat: "produce", tag: "New" },
  { id: "eggs", name: "Free-Range Eggs", unit: "6 pcs · large", price: 3.2, mrp: 3.8, emoji: "🥚", tint: "#FFF4E2", cat: "dairy", tag: "Bestseller" },
  { id: "yogurt", name: "Greek Yogurt", unit: "400 g · 5% fat", price: 4.1, emoji: "🥣", tint: "#F3F1EC", cat: "dairy" },
  { id: "oatmilk", name: "Barista Oat Milk", unit: "1 L · chilled", price: 3.6, mrp: 4.2, emoji: "🥛", tint: "#F6F1E4", cat: "dairy" },
  { id: "butter", name: "Salted Butter", unit: "250 g · churned", price: 4.8, emoji: "🧈", tint: "#FFF7D6", cat: "dairy" },
  { id: "cheddar", name: "Aged Cheddar", unit: "200 g · 18 month", price: 5.4, emoji: "🧀", tint: "#FFF2C9", cat: "dairy" },
  { id: "sourdough", name: "Sourdough Boule", unit: "1 loaf · baked today", price: 4.5, emoji: "🥖", tint: "#F7E9D5", cat: "bakery", tag: "Bestseller" },
  { id: "croissant", name: "Butter Croissants", unit: "4 pcs · all-butter", price: 5.2, emoji: "🥐", tint: "#FBEBD2", cat: "bakery" },
  { id: "babka", name: "Cinnamon Babka", unit: "1 loaf · small batch", price: 6.4, emoji: "🍞", tint: "#F5E3CE", cat: "bakery", tag: "New" },
  { id: "chocolate", name: "Dark Chocolate 70%", unit: "100 g · single origin", price: 3.3, emoji: "🍫", tint: "#EFE3DA", cat: "snacks", tag: "Bestseller" },
  { id: "crisps", name: "Sea Salt Crisps", unit: "150 g · kettle", price: 2.75, emoji: "🍿", tint: "#FFF3D9", cat: "snacks" },
  { id: "coldbrew", name: "Cold Brew Coffee", unit: "750 ml · slow steeped", price: 5.1, mrp: 5.9, emoji: "🧋", tint: "#E9DFD6", cat: "drinks", tag: "Bestseller" },
  { id: "sparkling", name: "Sparkling Water", unit: "6 × 330 ml", price: 4.4, emoji: "🫧", tint: "#E3F1F6", cat: "drinks" },
  { id: "orange", name: "Cold-Pressed Orange", unit: "1 L · no sugar", price: 4.2, emoji: "🧃", tint: "#FFEDD6", cat: "drinks" },
  { id: "pesto", name: "Basil Pesto", unit: "190 g · Ligurian", price: 4.9, emoji: "🫙", tint: "#E8F1DA", cat: "pantry" },
];

const CATS = [
  { id: "produce", label: "Fruits & veg", emoji: "🥦", tint: "#E8F4DF" },
  { id: "dairy", label: "Dairy & eggs", emoji: "🥛", tint: "#FFF3DE" },
  { id: "bakery", label: "Bakery", emoji: "🥐", tint: "#F9EAD8" },
  { id: "snacks", label: "Snacks", emoji: "🍫", tint: "#F3E7DF" },
  { id: "drinks", label: "Drinks", emoji: "🧃", tint: "#E6F0F6" },
  { id: "pantry", label: "Pantry", emoji: "🫙", tint: "#EAF1DD" },
  { id: "frozen", label: "Frozen", emoji: "🧊", tint: "#E8F2F8" },
  { id: "home", label: "Home", emoji: "🧴", tint: "#F1EEE7" },
];

function palettesFor(): Theme[] {
  const base: Theme = {
    bg: "#FFFCF4",
    surface: "#FFFFFF",
    surface2: "#FFF6E0",
    text: "#14231c",
    muted: "#65736b",
    line: "#E9E3D4",
    accent: "#FFD447",
    accentInk: "#14382a",
    accentSoft: "#FFF2BF",
    radius: 16,
    max: "1240px",
    display: '"Bricolage Grotesque", system-ui, sans-serif',
    body: '"DM Sans", system-ui, sans-serif',
    displayWeight: 700,
    displayTracking: "-0.035em",
    fontsLink: FONT_LINK("family=Bricolage+Grotesque:wght@500;600;700;800&family=DM+Sans:wght@400;500;600;700"),
  };
  return [
    base,
    {
      ...base,
      accent: "#C9F06B",
      accentInk: "#1B3213",
      accentSoft: "#EAF9C8",
      bg: "#FDFDF6",
    },
    {
      ...base,
      accent: "#FFB4A2",
      accentInk: "#3B1A12",
      accentSoft: "#FFE4DC",
    },
  ];
}

const icons = {
  pin: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>`,
  search: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>`,
  bag: `<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6 8h12l1.2 12H4.8L6 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="8.4"/><path d="M12 7.6V12l3 1.8"/></svg>`,
  leaf: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19c3-4 6-7 10-9"/></svg>`,
  close: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
};

function productCard(p: Product) {
  return `<article class="product" data-product="${p.id}">
    <div class="ptile" style="--tint:${p.tint}">
      <span class="pemoji" aria-hidden="true">${p.emoji}</span>
      ${p.tag ? `<span class="ptag">${esc(p.tag)}</span>` : ""}
      <div class="pctl" data-slot="${p.id}"><button class="padd" data-add="${p.id}" aria-label="Add ${esc(p.name)}">Add</button></div>
    </div>
    <div class="pbody">
      <p class="punit">${esc(p.unit)}</p>
      <h3>${esc(p.name)}</h3>
      <div class="prow"><span class="price">$${p.price.toFixed(2)}</span>${p.mrp ? `<s>$${p.mrp.toFixed(2)}</s>` : ""}</div>
    </div>
  </article>`;
}

export function buildCommerce(opts: Opts): BuiltSite {
  const pal = palettesFor()[opts.palette % 3];
  const r = rng(opts.seed);
  const t = withRadius(pal, opts.radius);
  const brand = pick(BRANDS, r);
  const tagline = pick(
    ["The nine-minute market.", "Fresh, fast, five streets away.", "Groceries at the speed of appetite."],
    r,
  );
  const shuffled = shuffle(PRODUCTS, r);
  const best = shuffled.slice(0, 8);
  const deals = shuffled.slice(8, 11);
  const groups = ["produce", "dairy", "bakery", "snacks", "drinks"];

  const categoryRail = CATS.map(
    (c) => `<button class="cattile" data-jump="${c.id}" aria-label="Browse ${esc(c.label)}">
      <span class="catcircle" style="background:${c.tint}" aria-hidden="true">${c.emoji}</span>
      <span>${esc(c.label)}</span>
    </button>`,
  ).join("");

  const dealCards = deals
    .map(
      (p, i) => `<article class="deal" style="--tint:${p.tint}">
        <div class="deal-copy">
          <span class="deal-off">${[20, 15, 25][i]}% off</span>
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.unit)}</p>
          <div class="deal-price">$${p.price.toFixed(2)} ${p.mrp ? `<s>$${p.mrp.toFixed(2)}</s>` : ""}</div>
          <button class="btn btn--primary btn--sm" data-add="${p.id}">Add to basket</button>
        </div>
        <span class="deal-emoji" aria-hidden="true">${p.emoji}</span>
      </article>`,
    )
    .join("");

  const catSections = groups
    .map((g) => {
      const items = (g === "produce" ? PRODUCTS : PRODUCTS).filter((p) => p.cat === g);
      if (!items.length) return "";
      const meta = CATS.find((c) => c.id === g)!;
      return `<section class="cat-section reveal" id="cat-${g}">
        <div class="sec-head">
          <div><p class="eyebrow">${items.length} items</p><h2 class="display">${esc(meta.label)}</h2></div>
          <a class="sec-link" href="#best">See all ${icons.arrow}</a>
        </div>
        <div class="pgrid">${items.map(productCard).join("")}</div>
      </section>`;
    })
    .join("");

  const body = `
  <a class="skip" href="#main">Skip to products</a>
  <div class="promo-strip">
    <div class="container strip-inner">
      <span>${icons.leaf} Free delivery over $25</span>
      <span class="strip-mid">Delivering to <strong>24 Alder Lane</strong> · ${icons.clock} 9 min average</span>
      <span>Rated 4.8 by 4,800 neighbours</span>
    </div>
  </div>

  <header class="header" data-header>
    <div class="container header-inner">
      <a class="brand" href="#top" aria-label="${esc(brand)} home">${esc(brand.toLowerCase())}<span class="brand-dot"></span></a>
      <button class="location" type="button">${icons.pin} <span>24 Alder Lane</span><span class="loc-caret">▾</span></button>
      <label class="search">
        <span class="sr-only">Search products</span>
        ${icons.search}
        <input type="search" id="search" placeholder="Search milk, mangoes, sourdough…" autocomplete="off" />
      </label>
      <button class="cart-btn" data-cart-open aria-label="Open basket">
        ${icons.bag}<span class="cart-label">Basket</span><span class="cart-count" data-count>0</span>
      </button>
    </div>
  </header>

  <main id="main">
    <section class="hero" id="top">
      <div class="container hero-grid">
        <div class="hero-copy">
          <p class="hero-kicker">${icons.clock} Delivering in <strong>9 minutes</strong></p>
          <h1 class="display">The market, at your door before the kettle boils.</h1>
          <p class="hero-sub">Hand-picked produce, cold-chain dairy and a bakery that still smells like the oven. Order in under a minute, unpack in nine.</p>
          <div class="hero-search">
            <label class="hero-field">
              <span class="sr-only">What do you need?</span>
              <input type="search" placeholder="Try “avocados” or “oat milk”" data-hero-search />
              <button class="btn btn--primary" type="button" data-hero-go>Shop now ${icons.arrow}</button>
            </label>
            <div class="hero-chips">
              <span>Popular:</span>
              <button data-add="avocado">Avocados</button>
              <button data-add="sourdough">Sourdough</button>
              <button data-add="coldbrew">Cold brew</button>
            </div>
          </div>
          <div class="hero-proof">
            <div class="faces" aria-hidden="true"><span style="background:#D9EAD3">M</span><span style="background:#FFE0B2">J</span><span style="background:#D6E4F0">A</span><span style="background:#F5D6D6">R</span></div>
            <p><strong>4.8 ★</strong> from 4,800 neighbours · avg. 8m 40s</p>
          </div>
        </div>
        <div class="hero-art" aria-hidden="true">
          <div class="art-glow"></div>
          <article class="art-card art-card--a">
            <span class="art-emoji">🥑</span>
            <div><strong>Hass Avocados</strong><span>2 pcs · $2.40</span></div>
            <span class="art-tick">✓</span>
          </article>
          <article class="art-card art-card--b">
            <span class="art-emoji">🥖</span>
            <div><strong>Sourdough Boule</strong><span>Baked 6:40am</span></div>
            <span class="art-badge">Fresh</span>
          </article>
          <article class="art-card art-card--c">
            <span class="art-emoji">🫐</span>
            <div><strong>Blueberries</strong><span>125 g · $3.40</span></div>
            <span class="art-tick">✓</span>
          </article>
          <div class="art-eta">
            <span class="eta-num">9<span>min</span></span>
            <span class="eta-label">to your door</span>
            <span class="eta-bar"><i></i></span>
          </div>
          <div class="art-card art-card--d">
            <span class="art-emoji">🥛</span>
            <div><strong>Oat Milk</strong><span>Chilled · 1 L</span></div>
            <span class="art-badge art-badge--soft">Cold</span>
          </div>
        </div>
      </div>
    </section>

    <section class="categories container reveal" aria-label="Categories">
      <div class="catrail">${categoryRail}</div>
    </section>

    <section class="best container reveal" id="best">
      <div class="sec-head">
        <div><p class="eyebrow">Everyone is buying</p><h2 class="display">Bestsellers this week</h2></div>
        <span class="sec-note">Restocked at 6am</span>
      </div>
      <div class="pgrid pgrid--best">${best.map(productCard).join("")}</div>
    </section>

    <section class="container reveal">
      <div class="sec-head"><div><p class="eyebrow">Today only</p><h2 class="display">Good prices, short clock</h2></div></div>
      <div class="deals">${dealCards}</div>
    </section>

    <div class="container">${catSections}</div>

    <section class="promise reveal">
      <div class="container promise-grid">
        <div><span class="promise-emoji">⚡</span><h3>Nine minutes, not ninety</h3><p>Three dark stores inside the ring road. Your order is picked before the kettle clicks.</p></div>
        <div><span class="promise-emoji">🧊</span><h3>Cold chain, end to end</h3><p>Dairy and produce travel in separate insulated totes, packed at 4°C.</p></div>
        <div><span class="promise-emoji">💬</span><h3>A human, in 40 seconds</h3><p>Missing an item? Chat opens with a person, not a menu. Refunds land same day.</p></div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer-grid">
      <div>
        <div class="brand brand--footer">${esc(brand.toLowerCase())}<span class="brand-dot"></span></div>
        <p class="footer-copy">${esc(tagline)} A fictional neighbourhood grocer, generated with Atelier. Prices and delivery times are illustrative.</p>
        <div class="app-badges"><span>Download on the App Store</span><span>Get it on Google Play</span></div>
      </div>
      <nav aria-label="Shop"><p class="footer-head">Shop</p><a href="#best">Bestsellers</a><a href="#cat-produce">Fruits & veg</a><a href="#cat-dairy">Dairy & eggs</a><a href="#cat-bakery">Bakery</a></nav>
      <nav aria-label="Company"><p class="footer-head">Company</p><a href="#top">Our stores</a><a href="#top">Careers</a><a href="#top">Sustainability</a><a href="#top">Press</a></nav>
      <nav aria-label="Help"><p class="footer-head">Help</p><a href="#top">Delivery areas</a><a href="#top">Refunds</a><a href="#top">Contact</a><a href="#top">Terms</a></nav>
    </div>
    <div class="container footer-bottom"><span>© 2026 ${esc(brand)}${/market/i.test(brand) ? "" : " Market"} Ltd. A demonstration storefront.</span><span class="mono">built with atelier</span></div>
  </footer>

  <aside class="cartbar" data-cart-bar>
    <button class="cartbar-btn" data-cart-open><span data-bar-count>0 items</span><span>View basket ${icons.arrow}</span></button>
  </aside>

  <div class="drawer-wrap" data-close-on-esc>
    <div class="drawer-backdrop" data-cart-close></div>
    <aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <header class="drawer-head">
        <div><p class="eyebrow">Arriving in 9 min</p><h2 class="display" id="cart-title">Your basket</h2></div>
        <button class="drawer-close" data-cart-close aria-label="Close basket">${icons.close}</button>
      </header>
      <div class="drawer-body" data-cart-body></div>
      <footer class="drawer-foot" data-cart-foot></footer>
    </aside>
  </div>

  <style>
    .skip{position:absolute;left:16px;top:-48px;z-index:200;background:var(--accent-ink);color:#fff;padding:10px 16px;border-radius:8px;font-weight:600;transition:top .2s}
    .skip:focus{top:14px}
    .promo-strip{background:var(--accent-ink);color:#eef7ea;font-size:11.5px;letter-spacing:.02em}
    .strip-inner{display:flex;align-items:center;justify-content:space-between;gap:16px;height:38px}
    .strip-inner span{display:inline-flex;align-items:center;gap:6px;opacity:.85}
    .strip-mid{opacity:1 !important}
    .strip-mid strong{color:var(--accent)}
    .header{position:sticky;top:0;z-index:50;background:rgba(255,252,244,.92);backdrop-filter:blur(14px);border-bottom:1px solid var(--line);transition:box-shadow .3s}
    .header.is-stuck{box-shadow:0 12px 30px -24px rgba(20,35,28,.6)}
    .header-inner{display:flex;align-items:center;gap:16px;height:72px}
    .brand{display:inline-flex;align-items:flex-end;gap:2px;font-family:var(--font-display);font-weight:800;font-size:27px;letter-spacing:-.055em;line-height:1;padding-bottom:3px}
    .brand-dot{width:8px;height:8px;border-radius:50%;background:var(--accent);margin-bottom:4px;box-shadow:0 0 0 3px var(--accent-soft)}
    .location{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:var(--muted);padding:8px 12px;border-radius:99px;border:1px solid var(--line);background:#fff;white-space:nowrap;transition:.25s}
    .location:hover{border-color:var(--accent-ink);color:var(--text)}
    .loc-caret{font-size:9px;opacity:.6}
    .search{flex:1;display:flex;align-items:center;gap:9px;height:44px;padding:0 16px;background:#fff;border:1px solid var(--line);border-radius:99px;color:var(--muted);transition:border-color .25s,box-shadow .25s}
    .search:focus-within{border-color:var(--accent-ink);box-shadow:0 0 0 4px var(--accent-soft)}
    .search input{border:0;outline:0;background:none;width:100%;font-size:13.5px;color:var(--text)}
    .cart-btn{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 16px;border-radius:99px;background:var(--accent-ink);color:#fff;font-size:13px;font-weight:600;transition:transform .3s var(--ease),box-shadow .3s;position:relative}
    .cart-btn:hover{transform:translateY(-1px);box-shadow:0 12px 24px -12px rgba(20,56,42,.7)}
    .cart-count{display:grid;place-items:center;min-width:20px;height:20px;padding:0 5px;border-radius:99px;background:var(--accent);color:var(--accent-ink);font-size:11px;font-weight:700}
    .cart-count.is-bump{animation:bump .4s var(--ease)}
    @keyframes bump{0%{transform:scale(1)}40%{transform:scale(1.35)}100%{transform:scale(1)}}
    .hero{padding:clamp(28px,5vw,64px) 0 clamp(20px,3vw,36px);position:relative;overflow:hidden}
    .hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(24px,4vw,56px);align-items:center}
    .hero-kicker{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:.02em;background:#fff;border:1px solid var(--line);border-radius:99px;padding:7px 13px;margin-bottom:20px;box-shadow:0 6px 18px -14px rgba(20,35,28,.4)}
    .hero-kicker strong{color:#0f7a4f}
    .hero h1{font-size:clamp(38px,5vw,64px);letter-spacing:-.04em;line-height:1.02;max-width:13ch}
    .hero-sub{margin-top:18px;max-width:46ch;color:var(--muted);font-size:15px;line-height:1.65}
    .hero-search{margin-top:26px}
    .hero-field{display:flex;align-items:center;gap:6px;padding:6px;background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 20px 40px -30px rgba(20,35,28,.5);transition:box-shadow .3s,border-color .3s}
    .hero-field:focus-within{border-color:var(--accent-ink);box-shadow:0 0 0 4px var(--accent-soft)}
    .hero-field input{flex:1;border:0;outline:0;background:none;padding:0 14px;font-size:14px;min-width:0}
    .hero-field .btn{border-radius:13px;height:46px}
    .hero-chips{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-top:12px;font-size:11.5px;color:var(--muted)}
    .hero-chips button{padding:5px 10px;border-radius:99px;background:#fff;border:1px solid var(--line);font-size:11.5px;transition:.25s}
    .hero-chips button:hover{border-color:var(--accent-ink);background:var(--accent-soft)}
    .hero-proof{display:flex;align-items:center;gap:12px;margin-top:26px}
    .faces{display:flex}
    .faces span{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:10px;font-weight:700;color:#2b3a31;border:2px solid #FFFCF4;margin-left:-8px}
    .faces span:first-child{margin-left:0}
    .hero-proof p{font-size:11.5px;color:var(--muted)}
    .hero-proof strong{color:var(--text)}
    .hero-art{position:relative;height:440px}
    .art-glow{position:absolute;inset:8% 4%;background:radial-gradient(circle at 60% 40%,var(--accent-soft),transparent 62%);filter:blur(10px);border-radius:50%}
    .art-card{position:absolute;display:flex;align-items:center;gap:11px;padding:11px 14px;background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 24px 50px -30px rgba(20,35,28,.55);animation:floaty 7s ease-in-out infinite}
    .art-card strong{display:block;font-size:12.5px}
    .art-card span{display:block;font-size:10.5px;color:var(--muted)}
    .art-emoji{font-size:26px;line-height:1;filter:drop-shadow(0 3px 4px rgba(0,0,0,.12))}
    .art-card--a{top:8%;left:2%;animation-delay:-1s;transform:rotate(-3deg)}
    .art-card--b{top:34%;right:0;animation-delay:-3s;transform:rotate(2.5deg)}
    .art-card--c{bottom:20%;left:6%;animation-delay:-5s;transform:rotate(1.5deg)}
    .art-card--d{bottom:2%;right:10%;animation-delay:-2s;transform:rotate(-2deg)}
    @keyframes floaty{0%,100%{translate:0 0}50%{translate:0 -10px}}
    .art-tick{display:grid !important;place-items:center;width:20px;height:20px;border-radius:50%;background:#E3F4E8;color:#177A46 !important;font-size:10px !important;margin-left:4px}
    .art-badge{font-size:9.5px !important;font-weight:700;padding:3px 7px;border-radius:99px;background:var(--accent);color:var(--accent-ink) !important}
    .art-badge--soft{background:#E3F1F6;color:#2b5b6e !important}
    .art-eta{position:absolute;top:46%;left:50%;transform:translate(-50%,-50%);background:var(--accent-ink);color:#fff;border-radius:24px;padding:20px 24px;text-align:center;box-shadow:0 30px 60px -26px rgba(20,56,42,.7);z-index:2}
    .eta-num{display:block;font-family:var(--font-display);font-size:44px;line-height:.9;color:var(--accent)}
    .eta-num span{font-size:14px;margin-left:3px;font-weight:600}
    .eta-label{display:block;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;opacity:.7;margin-top:6px}
    .eta-bar{display:block;width:100px;height:4px;border-radius:99px;background:rgba(255,255,255,.18);margin:12px auto 0;overflow:hidden}
    .eta-bar i{display:block;height:100%;width:72%;background:var(--accent);border-radius:99px;animation:eta 3.4s var(--ease) infinite}
    @keyframes eta{0%{width:18%}60%,100%{width:88%}}
    .categories{padding:6px 0 8px}
    .catrail{display:grid;grid-template-columns:repeat(8,1fr);gap:8px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:18px 0}
    .cattile{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:11.5px;font-weight:600;color:var(--text);padding:6px 2px;border-radius:14px;transition:transform .3s var(--ease)}
    .cattile:hover{transform:translateY(-3px)}
    .catcircle{display:grid;place-items:center;width:52px;height:52px;border-radius:50%;font-size:24px;transition:box-shadow .3s}
    .cattile:hover .catcircle{box-shadow:0 0 0 3px #fff,0 0 0 5px var(--accent)}
    .best{padding-top:clamp(30px,5vw,56px)}
    .sec-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:18px}
    .sec-head h2{font-size:clamp(23px,2.6vw,32px);margin-top:7px}
    .sec-link{font-size:12px;color:var(--muted);display:inline-flex;align-items:center;gap:5px}
    .sec-link:hover{color:var(--text)}
    .sec-note{font-size:11.5px;color:var(--muted)}
    .pgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
    .pgrid--best{grid-template-columns:repeat(4,1fr)}
    .product{background:#fff;border:1px solid var(--line);border-radius:calc(var(--radius) + 2px);padding:8px 8px 14px;transition:transform .35s var(--ease),box-shadow .35s,border-color .25s;position:relative}
    .product:hover{transform:translateY(-3px);border-color:#dcd5c4;box-shadow:0 22px 40px -32px rgba(20,35,28,.6)}
    .ptile{position:relative;display:grid;place-items:center;aspect-ratio:1/.92;border-radius:var(--radius);background:var(--tint);overflow:hidden}
    .pemoji{font-size:52px;line-height:1;filter:drop-shadow(0 8px 10px rgba(0,0,0,.14));transition:transform .45s var(--ease)}
    .product:hover .pemoji{transform:scale(1.08) rotate(-2deg)}
    .ptag{position:absolute;top:8px;left:8px;font-size:9px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:3px 7px;border-radius:99px;background:rgba(255,255,255,.8);backdrop-filter:blur(4px);color:#3d4a40}
    .pctl{position:absolute;right:7px;bottom:7px}
    .padd{height:30px;padding:0 12px;border-radius:9px;background:#fff;border:1px solid #dcd5c4;font-size:11.5px;font-weight:700;color:var(--accent-ink);box-shadow:0 6px 14px -10px rgba(0,0,0,.5);transition:.25s}
    .padd:hover{background:var(--accent);border-color:var(--accent)}
    .stepper{display:flex;align-items:center;gap:2px;background:#fff;border:1px solid #dcd5c4;border-radius:9px;height:30px;box-shadow:0 6px 14px -10px rgba(0,0,0,.5);animation:bump .35s var(--ease)}
    .stepper button{width:26px;height:28px;display:grid;place-items:center;font-size:15px;color:var(--accent-ink);font-weight:500;border-radius:8px}
    .stepper button:hover{background:var(--accent-soft)}
    .stepper span{min-width:16px;text-align:center;font-size:11.5px;font-weight:700}
    .pbody{padding:11px 5px 0}
    .punit{font-size:10.5px;color:var(--muted);letter-spacing:.01em;margin-bottom:3px}
    .pbody h3{font-size:13px;font-weight:600;letter-spacing:-.01em;line-height:1.3}
    .prow{display:flex;align-items:baseline;gap:7px;margin-top:7px}
    .price{font-family:var(--font-display);font-size:16.5px;font-weight:700;letter-spacing:-.02em}
    .prow s{font-size:11px;color:#9aa39c}
    .cat-section{padding-top:clamp(38px,5vw,60px)}
    .deals{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
    .deal{background:var(--accent-ink);border-radius:calc(var(--radius) + 6px);padding:22px;display:flex;align-items:center;justify-content:space-between;gap:12px;overflow:hidden;position:relative;color:#fff}
    .deal-copy{position:relative;z-index:2}
    .deal-off{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;background:var(--accent);color:var(--accent-ink);padding:4px 8px;border-radius:99px;margin-bottom:12px}
    .deal h3{font-family:var(--font-display);font-size:19px;letter-spacing:-.02em;line-height:1.15}
    .deal p{font-size:11px;opacity:.62;margin-top:4px}
    .deal-price{font-size:15px;font-weight:700;margin:10px 0 14px;color:var(--accent)}
    .deal-price s{font-size:11px;font-weight:400;color:rgba(255,255,255,.45);margin-left:6px}
    .deal .btn--primary{background:var(--accent);color:var(--accent-ink);box-shadow:none}
    .deal-emoji{font-size:84px;line-height:1;filter:drop-shadow(0 14px 18px rgba(0,0,0,.35));transform:rotate(-8deg);opacity:.95}
    .promise{padding:clamp(48px,7vw,84px) 0;margin-top:clamp(40px,6vw,70px);background:#F4F1E4;border-top:1px solid var(--line)}
    .promise-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
    .promise-emoji{font-size:22px;display:inline-grid;place-items:center;width:44px;height:44px;border-radius:14px;background:#fff;border:1px solid var(--line);margin-bottom:14px}
    .promise h3{font-size:15px;letter-spacing:-.01em;margin-bottom:6px}
    .promise p{font-size:12.5px;line-height:1.65;color:var(--muted);max-width:34ch}
    .footer{background:var(--accent-ink);color:#E8F2E4;padding:56px 0 24px;margin-top:0}
    .footer .brand{color:#fff}
    .footer-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:32px}
    .brand--footer{margin-bottom:14px;font-size:29px}
    .footer-copy{font-size:12.5px;line-height:1.7;color:rgba(232,242,228,.6);max-width:38ch}
    .footer-head{font-size:10.5px;text-transform:uppercase;letter-spacing:.16em;color:rgba(232,242,228,.45);margin-bottom:12px}
    .footer nav{display:flex;flex-direction:column;gap:9px;font-size:12.5px;color:rgba(232,242,228,.75)}
    .footer nav a:hover{color:#fff}
    .app-badges{display:flex;gap:8px;margin-top:18px;flex-wrap:wrap}
    .app-badges span{font-size:9.5px;padding:7px 10px;border:1px solid rgba(255,255,255,.2);border-radius:8px;line-height:1.2;max-width:110px}
    .footer-bottom{display:flex;justify-content:space-between;gap:16px;margin-top:42px;padding-top:20px;border-top:1px solid rgba(255,255,255,.12);font-size:10.5px;color:rgba(232,242,228,.45)}
    .cartbar{position:fixed;left:0;right:0;bottom:0;z-index:70;padding:10px 16px calc(10px + env(safe-area-inset-bottom));background:rgba(255,252,244,.9);backdrop-filter:blur(12px);border-top:1px solid var(--line);transform:translateY(110%);transition:transform .4s var(--ease)}
    .cartbar.is-on{transform:none}
    .cartbar-btn{width:100%;height:50px;border-radius:14px;background:var(--accent-ink);color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 18px;font-size:13px;font-weight:600}
    .drawer-wrap{position:fixed;inset:0;z-index:120;pointer-events:none}
    .drawer-backdrop{position:absolute;inset:0;background:rgba(16,28,22,.42);backdrop-filter:blur(4px);opacity:0;transition:opacity .4s}
    .drawer{position:absolute;top:0;right:0;bottom:0;width:min(420px,100%);background:#FFFCF4;box-shadow:-30px 0 80px rgba(16,28,22,.25);display:flex;flex-direction:column;transform:translateX(102%);transition:transform .45s var(--ease)}
    .drawer-wrap.is-open{pointer-events:auto}
    .drawer-wrap.is-open .drawer-backdrop{opacity:1}
    .drawer-wrap.is-open .drawer{transform:none}
    .drawer-head{display:flex;align-items:flex-start;justify-content:space-between;padding:22px 22px 16px;border-bottom:1px solid var(--line)}
    .drawer-head h2{font-size:24px;margin-top:5px}
    .drawer-close{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;border:1px solid var(--line);background:#fff;transition:.25s}
    .drawer-close:hover{background:var(--accent-soft);border-color:var(--accent-ink)}
    .drawer-body{flex:1;overflow-y:auto;padding:16px 22px}
    .cart-empty{text-align:center;padding:48px 18px;color:var(--muted)}
    .cart-empty span{font-size:42px;display:block;margin-bottom:14px}
    .cart-empty h3{font-size:16px;color:var(--text);margin-bottom:6px}
    .cart-empty p{font-size:12.5px;max-width:24ch;margin:0 auto;line-height:1.6}
    .cart-item{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--line)}
    .ci-tile{width:46px;height:46px;border-radius:12px;background:var(--tint);display:grid;place-items:center;font-size:23px;flex:none}
    .ci-main{flex:1;min-width:0}
    .ci-main strong{display:block;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .ci-main span{font-size:10.5px;color:var(--muted)}
    .ci-price{font-size:12.5px;font-weight:700;min-width:48px;text-align:right}
    .ci-ctl{display:flex;align-items:center;gap:2px;border:1px solid var(--line);border-radius:8px;background:#fff}
    .ci-ctl button{width:25px;height:25px;display:grid;place-items:center;font-size:14px}
    .ci-ctl span{min-width:16px;text-align:center;font-size:11px;font-weight:700}
    .drawer-foot{padding:16px 22px calc(18px + env(safe-area-inset-bottom));border-top:1px solid var(--line);background:#fff}
    .bill{display:flex;flex-direction:column;gap:7px;font-size:12px;color:var(--muted);margin-bottom:12px}
    .bill div{display:flex;justify-content:space-between}
    .bill .total{font-size:14px;font-weight:700;color:var(--text);padding-top:8px;border-top:1px dashed var(--line)}
    .bill .free{color:#0F7A4F;font-weight:600}
    .checkout{width:100%;height:48px;border-radius:13px;background:var(--accent-ink);color:#fff;display:flex;align-items:center;justify-content:center;gap:8px;font-size:13px;font-weight:700;transition:.3s}
    .checkout:hover{transform:translateY(-1px);box-shadow:0 14px 28px -14px rgba(20,56,42,.8)}
    .free-note{text-align:center;font-size:10.5px;color:var(--muted);margin-top:9px}
    .ordered{text-align:center;padding:30px 10px}
    .ordered .big{font-size:46px;margin-bottom:16px;display:block}
    .ordered h3{font-family:var(--font-display);font-size:24px;margin-bottom:8px;letter-spacing:-.02em}
    .ordered p{font-size:12.5px;color:var(--muted);line-height:1.65;max-width:30ch;margin:0 auto 18px}
    .ordered .eta-pill{display:inline-flex;align-items:center;gap:7px;padding:9px 14px;border-radius:99px;background:var(--accent-soft);font-size:12px;font-weight:600;color:var(--accent-ink)}
    @media (max-width:1000px){
      .hero-grid{grid-template-columns:1fr;gap:26px}
      .hero-art{height:330px;max-width:520px;width:100%;margin:0 auto}
      .catrail{grid-template-columns:repeat(4,1fr);gap:14px;row-gap:18px}
      .pgrid,.pgrid--best{grid-template-columns:repeat(3,1fr)}
      .deals{grid-template-columns:1fr;gap:10px}
      .deal{padding:18px}
      .deal-emoji{font-size:64px}
      .promise-grid{grid-template-columns:1fr;gap:22px}
      .footer-grid{grid-template-columns:1fr 1fr;gap:26px}
      .search{display:none}
    }
    @media (max-width:700px){
      .promo-strip .strip-inner span:not(.strip-mid){display:none}
      .strip-inner{justify-content:center}
      .header-inner{height:64px;gap:10px}
      .brand{font-size:24px}
      .location span:not(.loc-caret){display:none}
      .location{padding:9px 11px}
      .cart-label{display:none}
      .hero{padding-top:22px}
      .hero h1{font-size:clamp(32px,10vw,44px)}
      .hero-sub{font-size:13.5px}
      .hero-field .btn{padding:0 14px;font-size:12.5px}
      .hero-art{height:280px}
      .art-card{padding:9px 11px}
      .art-eta{padding:14px 18px}
      .eta-num{font-size:36px}
      .pgrid,.pgrid--best{grid-template-columns:repeat(2,1fr);gap:10px}
      .pemoji{font-size:44px}
      .catrail{padding:14px 0}
      .catcircle{width:46px;height:46px;font-size:21px}
      .cattile{font-size:10.5px}
      .promise{padding-bottom:80px}
      .footer-grid{grid-template-columns:1fr}
      .footer-bottom{flex-direction:column;gap:6px}
      body{padding-bottom:78px}
    }
  </style>`;

  const cartData = PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    unit: p.unit,
    price: p.price,
    emoji: p.emoji,
    tint: p.tint,
  }));

  const js = `${runtimeJs}
(function(){
  var PRODUCTS=${JSON.stringify(cartData)};
  var byId={};PRODUCTS.forEach(function(p){byId[p.id]=p});
  var cart={};
  var wrap=document.querySelector('.drawer-wrap');
  var drawerBody=document.querySelector('[data-cart-body]');
  var drawerFoot=document.querySelector('[data-cart-foot]');
  var countEls=[].slice.call(document.querySelectorAll('[data-count]'));
  var barCount=document.querySelector('[data-bar-count]');
  var bar=document.querySelector('[data-cart-bar]');
  var lastEl=null;
  function count(){var n=0;for(var k in cart)n+=cart[k];return n}
  function subtotal(){var s=0;for(var k in cart)s+=byId[k].price*cart[k];return s}
  function money(n){return '$'+n.toFixed(2)}
  function render(){
    var n=count();
    countEls.forEach(function(el){el.textContent=n;el.classList.remove('is-bump');void el.offsetWidth;el.classList.add('is-bump')});
    if(barCount)barCount.textContent=n+(n===1?' item':' items');
    if(bar)bar.classList.toggle('is-on',n>0);
    document.querySelectorAll('[data-slot]').forEach(function(slot){
      var id=slot.getAttribute('data-slot');
      var q=cart[id]||0;
      if(q===0){slot.innerHTML='<button class="padd" data-add="'+id+'" aria-label="Add">Add</button>'}
      else{slot.innerHTML='<div class="stepper"><button data-dec="'+id+'" aria-label="Remove one">−</button><span>'+q+'</span><button data-inc="'+id+'" aria-label="Add one">+</button></div>'}
    });
    if(!drawerBody)return;
    if(n===0){
      drawerBody.innerHTML='<div class="cart-empty"><span>🧺</span><h3>Your basket is empty</h3><p>Add a few things — most baskets are packed in under nine minutes.</p></div>';
      drawerFoot.innerHTML='';
      return;
    }
    var rows='';
    for(var k in cart){
      var p=byId[k];
      rows+='<div class="cart-item"><div class="ci-tile" style="--tint:'+p.tint+'">'+p.emoji+'</div><div class="ci-main"><strong>'+p.name+'</strong><span>'+p.unit+'</span></div><div class="ci-ctl"><button data-dec="'+k+'" aria-label="Remove one">−</button><span>'+cart[k]+'</span><button data-inc="'+k+'" aria-label="Add one">+</button></div><span class="ci-price">'+money(p.price*cart[k])+'</span></div>';
    }
    drawerBody.innerHTML=rows;
    var sub=subtotal();
    var delivery=sub>=25?0:2.99;
    drawerFoot.innerHTML='<div class="bill"><div><span>Subtotal</span><span>'+money(sub)+'</span></div><div><span>Delivery</span><span class="'+(delivery===0?'free':'')+'">'+(delivery===0?'Free':money(delivery))+'</span></div><div class="total"><span>Total</span><span>'+money(sub+delivery)+'</span></div></div><button class="checkout" data-checkout>Place order · 9 min</button><p class="free-note">'+(delivery===0?'Free delivery applied.':'Add '+money(25-sub)+' for free delivery.')+'</p>';
  }
  function openCart(){wrap.classList.add('is-open');document.body.style.overflow='hidden'}
  function closeCart(){wrap.classList.remove('is-open');document.body.style.overflow='';}
  document.addEventListener('click',function(e){
    var add=e.target.closest('[data-add]');
    var inc=e.target.closest('[data-inc]');
    var dec=e.target.closest('[data-dec]');
    var open=e.target.closest('[data-cart-open]');
    var close=e.target.closest('[data-cart-close]');
    if(add){
      var id=add.getAttribute('data-add');
      cart[id]=(cart[id]||0)+1;
      if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)fly(add,id);
      render();
    } else if(inc){
      var iid=inc.getAttribute('data-inc');cart[iid]=(cart[iid]||0)+1;render();
    } else if(dec){
      var did=dec.getAttribute('data-dec');cart[did]=(cart[did]||0)-1;if(cart[did]<=0)delete cart[did];render();
    } else if(open){
      openCart();
    } else if(close){
      closeCart();
    }
  });
  function fly(from,id){
    var p=byId[id];if(!p)return;
    var r=from.getBoundingClientRect();
    var cartBtn=document.querySelector('.cart-btn');
    if(!cartBtn)return;
    var c=cartBtn.getBoundingClientRect();
    var el=document.createElement('span');
    el.textContent=p.emoji;
    el.style.cssText='position:fixed;z-index:200;font-size:24px;left:'+(r.left+r.width/2-12)+'px;top:'+(r.top+r.height/2-12)+'px;pointer-events:none;transition:transform .7s cubic-bezier(.32,.72,0,1),opacity .7s;will-change:transform';
    document.body.appendChild(el);
    requestAnimationFrame(function(){
      var dx=c.left+c.width/2-12-(r.left+r.width/2-12);
      var dy=c.top+c.height/2-12-(r.top+r.height/2-12);
      el.style.transform='translate('+dx+'px,'+dy+'px) scale(.35)';
      el.style.opacity='.1';
    });
    setTimeout(function(){el.remove()},760);
  }
  document.addEventListener('click',function(e){
    if(e.target.closest('[data-checkout]')){
      drawerBody.innerHTML='<div class="ordered"><span class="big">🛍️</span><h3>Order placed</h3><p>Four items are being picked at the Alder Lane store. We will knock quietly.</p><span class="eta-pill">⏱ Arriving in 9 minutes</span></div>';
      drawerFoot.innerHTML='<button class="checkout" data-close-order>Keep browsing</button>';
      cart={};countEls.forEach(function(el){el.textContent='0'});bar.classList.remove('is-on');
      document.querySelectorAll('[data-slot]').forEach(function(slot){slot.innerHTML='<button class="padd" data-add="'+slot.getAttribute('data-slot')+'" aria-label="Add">Add</button>'});
    }
    if(e.target.closest('[data-close-order]')){closeCart();render()}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeCart()});
  var input=document.getElementById('search');
  function filter(q){
    q=(q||'').trim().toLowerCase();
    document.querySelectorAll('.product').forEach(function(card){
      var name=card.querySelector('h3').textContent.toLowerCase();
      card.style.display=!q||name.indexOf(q)>-1?'':'none';
    });
    document.querySelectorAll('.cat-section, .best').forEach(function(sec){
      var visible=[].slice.call(sec.querySelectorAll('.product')).some(function(c){return c.style.display!=='none'});
      sec.style.display=visible?'':'none';
    });
  }
  if(input)input.addEventListener('input',function(){filter(input.value)});
  var heroSearch=document.querySelector('[data-hero-search]');
  var heroGo=document.querySelector('[data-hero-go]');
  if(heroGo&&heroSearch)heroGo.addEventListener('click',function(){
    if(input){input.value=heroSearch.value;filter(heroSearch.value)}
    document.getElementById('best').scrollIntoView({behavior:'smooth'});
    heroSearch.blur();
  });
  if(heroSearch)heroSearch.addEventListener('keydown',function(e){if(e.key==='Enter'&&heroGo)heroGo.click()});
  document.querySelectorAll('[data-jump]').forEach(function(b){
    b.addEventListener('click',function(){
      var id=b.getAttribute('data-jump');
      var target=document.getElementById('cat-'+id);
      if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
      else document.getElementById('best').scrollIntoView({behavior:'smooth'});
    });
  });
  render();
})();`;

  return {
    brand: { name: brand, tagline, monogram: brand.charAt(0) },
    html: body,
    css: "",
    tokens: renderTokens(t),
    js,
    fonts: { display: "Bricolage Grotesque", body: "DM Sans", link: t.fontsLink },
    mood: "Bright, dense and friendly. Cream canvas, citrus accent, deep-green ink. Product tiles do the talking; photography is deliberately absent.",
    motion: [
      "Hero product cards float on staggered 7s loops",
      "Add-to-basket emoji flies into the cart button",
      "Quantity steppers pop with a 400ms spring curve",
      "Drawer slides 420px with a blurred backdrop",
    ],
    components: [
      { name: "CategoryRail", note: "8 emoji category tiles with jump-to-section" },
      { name: "ProductCard", note: "Tinted tile, price/MRP, add → stepper" },
      { name: "CartDrawer", note: "Live totals, free-delivery threshold, checkout confirmation" },
      { name: "DeliveryBadge", note: "9-minute ETA with animated progress bar" },
      { name: "SearchBar", note: "Filters products and hides empty sections" },
      { name: "DealCard", note: "Dark-green promo cards with oversized product mark" },
    ],
    pages: [
      { name: "Home", route: "/", sections: ["Delivery strip", "Hero", "Categories", "Bestsellers", "Deals", "Category grids"] },
      { name: "Category", route: "/c/:slug", sections: ["Filter bar", "Product grid"] },
      { name: "Basket", route: "/basket", sections: ["Line items", "Bill summary", "Checkout"] },
      { name: "Order tracking", route: "/orders/:id", sections: ["ETA", "Picking status", "Support"] },
    ],
    features: [
      "Nine-minute delivery framing",
      "Live search that filters the grid",
      "Quantity stepper on every product",
      "Sticky basket bar on mobile",
      "Free-delivery threshold logic",
      "Working checkout confirmation",
    ],
    database: [
      {
        table: "products",
        columns: [
          { name: "id", type: "uuid" },
          { name: "name", type: "text" },
          { name: "unit", type: "text" },
          { name: "price", type: "numeric" },
          { name: "category_id", type: "uuid" },
          { name: "stock", type: "int" },
        ],
      },
      {
        table: "categories",
        columns: [
          { name: "id", type: "uuid" },
          { name: "slug", type: "text" },
          { name: "label", type: "text" },
          { name: "tint", type: "text" },
        ],
      },
      {
        table: "orders",
        columns: [
          { name: "id", type: "uuid" },
          { name: "customer_id", type: "uuid" },
          { name: "status", type: "enum" },
          { name: "eta_minutes", type: "int" },
          { name: "total", type: "numeric" },
        ],
      },
      {
        table: "order_items",
        columns: [
          { name: "order_id", type: "uuid" },
          { name: "product_id", type: "uuid" },
          { name: "quantity", type: "int" },
          { name: "unit_price", type: "numeric" },
        ],
      },
    ],
  };
}
