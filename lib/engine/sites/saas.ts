import { BuiltSite, FONT_LINK, esc, pick, rng, runtimeJs } from "../base";
import { Theme, renderTokens, withRadius } from "../theme";

type Opts = { seed: string; palette: number; radius: number; sections: string[] };

const BRANDS = ["Ledgerline", "Fathom", "Northwind", "Plinth", "Fieldnote"];
const TAGLINES = [
  "Revenue clarity for teams of two to fifty.",
  "The books, without the black box.",
  "Close the month before the month closes you.",
];

const icons = {
  check: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  spark: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 17 9 11l4 3 7-8"/><path d="M15 6h5v5"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="8.4"/><path d="M12 7.5V12l3.2 1.8"/></svg>`,
  doc: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3 5 6v6c0 4.4 3 7.4 7 9 4-1.6 7-4.6 7-9V6z"/><path d="m9 12 2 2 4-4"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  wallet: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M16 14.5h2"/></svg>`,
};

function palettesFor(): Theme[] {
  const base: Theme = {
    bg: "#FAF8F3",
    surface: "#FFFFFF",
    surface2: "#F3EFE5",
    text: "#111613",
    muted: "#68706A",
    line: "#E6E1D5",
    accent: "#0E6B4E",
    accentInk: "#ffffff",
    accentSoft: "#E3F1E9",
    radius: 14,
    max: "1180px",
    display: '"Fraunces", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    displayWeight: 500,
    displayTracking: "-0.03em",
    fontsLink: FONT_LINK("family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700"),
  };
  return [
    base,
    { ...base, accent: "#2E3A8C", accentSoft: "#E8EAF7", surface2: "#F0F0E8" },
    { ...base, accent: "#A3472A", accentSoft: "#F8E8E1", surface2: "#F4EDE4" },
  ];
}

export function buildSaas(opts: Opts): BuiltSite {
  const pal = palettesFor()[opts.palette % 3];
  const r = rng(opts.seed);
  const t = withRadius(pal, opts.radius);
  const brand = pick(BRANDS, r);
  const tagline = pick(TAGLINES, r);

  const bars = [38, 46, 41, 55, 49, 63, 58, 72, 66, 78, 85, 92];
  const months = ["N", "D", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O"];

  const logo = `<svg viewBox="0 0 26 26" width="24" height="24" aria-hidden="true"><rect x="2" y="2" width="22" height="22" rx="7" fill="var(--accent)"/><path d="M8 17V9h2.4l2.6 4.4L15.6 9H18v8h-2.2v-4.3L13.3 17h-1.6l-2.5-4.3V17z" fill="#fff"/></svg>`;

  const pricing = [
    {
      name: "Starter",
      price: 0,
      annual: 0,
      blurb: "For the first invoice and the first spreadsheet you'll never open again.",
      feats: ["1 workspace", "50 invoices / month", "Bank sync (2 accounts)", "Monthly close checklist"],
      cta: "Start free",
      hot: false,
    },
    {
      name: "Studio",
      price: 24,
      annual: 19,
      blurb: "For small teams who need the numbers to be right, every Friday.",
      feats: ["3 seats included", "Unlimited invoices", "Runway + scenario planner", "Approval flows", "Priority support"],
      cta: "Start 14-day trial",
      hot: true,
    },
    {
      name: "Scale",
      price: 59,
      annual: 47,
      blurb: "For finance leads who are tired of being the reporting department.",
      feats: ["10 seats included", "Multi-entity consolidation", "Custom revenue rules", "SSO + audit log", "Dedicated onboarding"],
      cta: "Talk to us",
      hot: false,
    },
  ];

  const faqs = [
    {
      q: "Do you replace our accountant?",
      a: "No — we make their life easier. Ledgerline produces a clean, reconciled export and a month-end pack your accountant can sign off without a single follow-up email.",
    },
    {
      q: "How long does setup take?",
      a: "Most teams are live in under twenty minutes: connect a bank feed, import customers, and map two or three revenue rules. We pre-fill the rules for common SaaS and services models.",
    },
    {
      q: "Where does the data live?",
      a: "EU-hosted, encrypted at rest and in transit, with read-only bank connections. You can export everything as CSV at any time, no support ticket required.",
    },
    {
      q: "What happens after the trial?",
      a: "You keep read-only access to everything you imported. No card is taken up front, and we never auto-upgrade you into a paid plan.",
    },
  ];

  const body = `
  <a class="skip" href="#main">Skip to content</a>
  <header class="nav" data-header>
    <div class="container nav-inner">
      <a class="brand" href="#top" aria-label="${esc(brand)} home">${logo}<span>${esc(brand)}</span></a>
      <nav class="nav-links" aria-label="Primary">
        <a href="#product">Product</a><a href="#how">How it works</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a>
      </nav>
      <div class="nav-cta">
        <a class="link-quiet" href="#pricing">Sign in</a>
        <a class="btn btn--primary btn--sm" href="#pricing">Start free ${icons.arrow}</a>
        <button class="nav-toggle" aria-label="Open menu">${icons.menu}</button>
      </div>
    </div>
  </header>

  <main id="main">
    <section class="hero" id="top">
      <div class="container hero-grid">
        <div class="hero-copy">
          <p class="hero-eyebrow"><span class="dot"></span> Built for teams of 2–50</p>
          <h1 class="display">Know exactly where the money went.</h1>
          <p class="hero-sub">${esc(
            tagline,
          )} Ledgerline reconciles your bank, invoices and subscriptions into one honest number — then tells you what to do about it.</p>
          <div class="hero-actions">
            <a class="btn btn--primary" href="#pricing">Start free for 14 days</a>
            <a class="btn btn--ghost" href="#product">See the product ${icons.arrow}</a>
          </div>
          <div class="hero-proof">
            <span>${icons.shield} No card required</span>
            <span>${icons.check} Live in 20 minutes</span>
            <span>${icons.check} Export anytime</span>
          </div>
        </div>
        <div class="hero-visual" aria-label="Product preview">
          <div class="dash">
            <div class="dash-rail" aria-hidden="true">
              <span class="rail-logo"></span>
              <span class="rail-item is-on"></span><span class="rail-item"></span><span class="rail-item"></span><span class="rail-item"></span>
              <span class="rail-av">JL</span>
            </div>
            <div class="dash-main">
              <div class="dash-top"><strong>Overview</strong><span class="dash-pill">October · live</span></div>
              <div class="kpis">
                <div class="kpi"><span>MRR</span><strong>$48,290</strong><em class="up">+12.4%</em></div>
                <div class="kpi"><span>Net burn</span><strong>$9,140</strong><em class="down">−6.1%</em></div>
                <div class="kpi"><span>Runway</span><strong>22 mo</strong><em class="flat">steady</em></div>
              </div>
              <div class="chart-card">
                <div class="chart-head"><span>Revenue</span><span class="legend"><i></i> Recognised</span><span class="chart-range">12 months</span></div>
                <div class="chart">
                  ${bars
                    .map(
                      (h, i) =>
                        `<span class="bar ${i === bars.length - 1 ? "is-now" : ""}" style="--h:${h}%"><i></i></span>`,
                    )
                    .join("")}
                </div>
                <div class="chart-axis">${months
                  .map((m) => `<span>${m}</span>`)
                  .join("")}</div>
              </div>
              <div class="dash-bottom">
                <div class="inv-card">
                  <div class="inv-head"><span>Recent invoices</span><span>View all</span></div>
                  <div class="inv-row"><span class="inv-co">Ardent Studio</span><span class="inv-num">$4,800</span><span class="st st--paid">Paid</span></div>
                  <div class="inv-row"><span class="inv-co">Mesa Labs</span><span class="inv-num">$2,150</span><span class="st st--due">Due</span></div>
                  <div class="inv-row"><span class="inv-co">Fieldnote</span><span class="inv-num">$980</span><span class="st st--late">Overdue</span></div>
                </div>
                <div class="spark-card">
                  <span class="spark-label">Cash on hand</span>
                  <strong>$186,400</strong>
                  <svg viewBox="0 0 120 46" preserveAspectRatio="none" aria-hidden="true"><path d="M2 36 C18 30 24 32 34 26 S54 30 64 20 84 22 96 12 110 14 118 6" fill="none" stroke="var(--accent)" stroke-width="2"/><path d="M2 36 C18 30 24 32 34 26 S54 30 64 20 84 22 96 12 110 14 118 6 V46 H2Z" fill="var(--accent)" opacity=".08"/></svg>
                </div>
              </div>
            </div>
          </div>
          <div class="float-note fn-a"><span class="fn-ico">✓</span><div><strong>Books reconciled</strong><span>2 minutes ago</span></div></div>
          <div class="float-note fn-b"><span class="fn-ico fn-ico--amber">!</span><div><strong>3 invoices overdue</strong><span>$3,140 · sent reminders</span></div></div>
        </div>
      </div>
      <div class="container logo-strip reveal">
        <span class="logo-label">Keeping the books for</span>
        <div class="logo-row">
          <span>Ardent</span><span>Fieldnote</span><span>Mesa Labs</span><span>Plinth</span><span>Cobalt</span><span>Northwind</span>
        </div>
      </div>
    </section>

    <section class="section container" id="product">
      <div class="sec-head reveal">
        <p class="eyebrow">The product</p>
        <h2 class="display">Three things, done properly.</h2>
        <p>No dashboards nobody opens. No 40-page reports. Just the numbers you need on the day you need them.</p>
      </div>
      <div class="feature-grid">
        <article class="feature reveal" style="--i:0">
          <span class="f-ico">${icons.clock}</span>
          <h3>Close the month in an afternoon</h3>
          <p>Bank feeds reconcile against invoices automatically. Anything ambiguous lands in a short, numbered review queue.</p>
          <div class="f-visual f-visual--queue">
            <span class="queue-row"><i class="ok">✓</i> Stripe payout <b>$4,120</b></span>
            <span class="queue-row"><i class="ok">✓</i> Figma <b>−$45</b></span>
            <span class="queue-row is-review"><i>?</i> Transfer to savings <b>−$2,000</b></span>
          </div>
        </article>
        <article class="feature reveal" style="--i:1">
          <span class="f-ico">${icons.spark}</span>
          <h3>Runway you can trust</h3>
          <p>Scenario-plan a hire, a price change or a bad quarter. Every number is traceable back to a transaction.</p>
          <div class="f-visual f-visual--runway">
            <div class="rw-row"><span>Today</span><b>22 months</b></div>
            <div class="rw-bar"><i style="width:62%"></i><em style="left:62%"></em></div>
            <div class="rw-row rw-row--ghost"><span>+ one hire</span><b>17 months</b></div>
            <div class="rw-bar rw-bar--ghost"><i style="width:47%"></i></div>
          </div>
        </article>
        <article class="feature reveal" style="--i:2">
          <span class="f-ico">${icons.doc}</span>
          <h3>Invoices that chase themselves</h3>
          <p>Polite reminders, escalating tone, payment links. You approve the sequence once; the rest is quiet.</p>
          <div class="f-visual f-visual--invoice">
            <div class="inv-chip"><span>INV-2041</span><b>$4,800</b></div>
            <span class="reminder">Reminder 2 sent → Ardent Studio</span>
            <span class="reminder reminder--muted">Opened 2 times · paid 1h later</span>
          </div>
        </article>
      </div>
    </section>

    <section class="section container" id="how">
      <div class="how-grid">
        <div class="sec-head sec-head--left reveal">
          <p class="eyebrow">How it works</p>
          <h2 class="display">From messy to reconciled, in three moves.</h2>
          <p>Most teams skip straight to the happy part: knowing the number without opening a spreadsheet.</p>
        </div>
        <div class="steps">
          <div class="step reveal"><span class="step-num">01</span><div><h3>Connect the accounts</h3><p>Two bank feeds, your invoicing tool, and Stripe. Read-only, revocable in one click.</p></div></div>
          <div class="step reveal"><span class="step-num">02</span><div><h3>Confirm the rules</h3><p>We propose revenue rules from your history. You correct anything that looks wrong — usually two or three lines.</p></div></div>
          <div class="step reveal"><span class="step-num">03</span><div><h3>Read one number</h3><p>MRR, burn, runway — with the transactions behind each figure one click away. Close, and go home.</p></div></div>
        </div>
      </div>
    </section>

    <section class="quote-band">
      <div class="container quote-grid">
        <blockquote class="reveal">
          <p class="quote-mark">“</p>
          <p class="display">We stopped arguing about the numbers and started arguing about the plan. That alone was worth the subscription.</p>
          <footer><span class="avatar" style="--tone:#0E6B4E;width:40px;height:40px;font-size:13px">LM</span><div><strong>Lena Marsh</strong><span>Finance lead, Ardent Studio</span></div></footer>
        </blockquote>
        <div class="quote-stats reveal">
          <div><strong>4.5h</strong><span>saved on every month-end close</span></div>
          <div><strong>0</strong><span>spreadsheets maintained</span></div>
          <div><strong>22</strong><span>months of runway visibility</span></div>
        </div>
      </div>
    </section>

    <section class="section container" id="pricing">
      <div class="sec-head reveal">
        <p class="eyebrow">Pricing</p>
        <h2 class="display">Honest pricing, like the numbers.</h2>
        <div class="billing-toggle" role="group" aria-label="Billing period">
          <button class="is-on" data-billing="month">Monthly</button>
          <button data-billing="year">Yearly <span class="save-badge">−20%</span></button>
        </div>
      </div>
      <div class="price-grid">
        ${pricing
          .map(
            (p) => `<article class="price-card ${p.hot ? "is-hot" : ""} reveal">
              ${p.hot ? '<span class="hot-tag">Most teams start here</span>' : ""}
              <h3>${esc(p.name)}</h3>
              <p class="price-blurb">${esc(p.blurb)}</p>
              <div class="price-amount"><span class="cur">$</span><strong data-month="${p.price}" data-year="${p.annual}">${p.price}</strong><span class="per">/ month</span></div>
              <p class="price-billed" data-billed>${p.price === 0 ? "Free forever" : "Billed monthly"}</p>
              <a class="btn ${p.hot ? "btn--primary" : "btn--ghost"}" href="#pricing">${esc(p.cta)}</a>
              <ul class="price-feats">${p.feats
                .map((f) => `<li>${icons.check}<span>${esc(f)}</span></li>`)
                .join("")}</ul>
            </article>`,
          )
          .join("")}
      </div>
      <p class="pricing-note reveal">All plans include EU hosting, unlimited exports, and a real human on support. Prices in USD, excluding tax.</p>
    </section>

    <section class="section container" id="faq">
      <div class="faq-grid">
        <div class="sec-head sec-head--left reveal"><p class="eyebrow">Questions</p><h2 class="display">Asked before signing up.</h2></div>
        <div class="faq-list reveal">
          ${faqs
            .map(
              (f, i) => `<details class="faq" ${i === 0 ? "open" : ""}>
                <summary>${esc(f.q)}<span class="faq-plus" aria-hidden="true">+</span></summary>
                <p>${esc(f.a)}</p>
              </details>`,
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="container cta-inner reveal">
        <p class="eyebrow">Ready when you are</p>
        <h2 class="display">Your books, finally on speaking terms with your bank.</h2>
        <div class="cta-actions">
          <a class="btn btn--primary" href="#pricing">Start free for 14 days</a>
          <a class="btn btn--ghost" href="#faq">Read the FAQ</a>
        </div>
        <p class="cta-note">No card. No sales call. Cancel with one click.</p>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer-grid">
      <div>
        <a class="brand brand--foot" href="#top">${logo}<span>${esc(brand)}</span></a>
        <p class="foot-copy">${esc(tagline)} A fictional finance product, generated with Atelier. Numbers on this page are illustrative.</p>
        <span class="status"><i></i> All systems operational</span>
      </div>
      <nav aria-label="Product"><p>Product</p><a href="#product">Reconciliation</a><a href="#product">Runway</a><a href="#pricing">Pricing</a><a href="#top">Changelog</a></nav>
      <nav aria-label="Company"><p>Company</p><a href="#top">About</a><a href="#top">Careers</a><a href="#top">Customers</a><a href="#top">Press</a></nav>
      <nav aria-label="Resources"><p>Resources</p><a href="#faq">Help centre</a><a href="#top">API docs</a><a href="#top">Security</a><a href="#top">Status</a></nav>
    </div>
    <div class="container foot-bottom"><span>© 2026 ${esc(brand)} Inc.</span><span>Privacy · Terms · DPA</span></div>
  </footer>

  <style>
    .skip{position:absolute;left:16px;top:-48px;z-index:200;background:var(--accent);color:#fff;padding:10px 16px;border-radius:8px;font-weight:600;transition:top .2s}
    .skip:focus{top:14px}
    .nav{position:fixed;top:0;left:0;right:0;z-index:80;padding:16px 0;transition:padding .35s,background .35s,box-shadow .35s}
    .nav.is-stuck{padding:10px 0;background:rgba(250,248,243,.9);backdrop-filter:blur(16px);box-shadow:0 1px 0 var(--line)}
    .nav-inner{display:flex;align-items:center;gap:34px}
    .brand{display:inline-flex;align-items:center;gap:9px;font-family:var(--font-display);font-size:20px;letter-spacing:-.03em;font-weight:600}
    .nav-links{display:flex;gap:26px;font-size:13px;color:var(--muted)}
    .nav-links a:hover{color:var(--text)}
    .nav-cta{margin-left:auto;display:flex;align-items:center;gap:16px}
    .link-quiet{font-size:13px;color:var(--muted)}
    .link-quiet:hover{color:var(--text)}
    .nav-toggle{display:none}
    .hero{padding:clamp(120px,15vh,170px) 0 30px;position:relative;overflow:hidden}
    .hero::before{content:"";position:absolute;top:-10%;right:-10%;width:60vw;height:60vw;background:radial-gradient(circle,rgba(14,107,78,.07),transparent 62%);border-radius:50%;pointer-events:none}
    .hero-grid{display:grid;grid-template-columns:1.02fr 1fr;gap:clamp(30px,5vw,64px);align-items:center}
    .hero-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:11.5px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--accent);background:var(--accent-soft);border-radius:99px;padding:7px 12px;margin-bottom:22px}
    .hero-eyebrow .dot{width:5px;height:5px;border-radius:50%;background:var(--accent)}
    .hero h1{font-size:clamp(42px,5.6vw,74px);line-height:.98;max-width:13ch;letter-spacing:-.035em}
    .hero-sub{margin-top:22px;max-width:46ch;font-size:15px;line-height:1.65;color:var(--muted)}
    .hero-actions{display:flex;gap:10px;margin-top:30px;flex-wrap:wrap}
    .hero-proof{display:flex;flex-wrap:wrap;gap:18px;margin-top:26px;font-size:11px;color:var(--muted)}
    .hero-proof span{display:inline-flex;align-items:center;gap:5px}
    .hero-proof svg{color:var(--accent)}
    .hero-visual{position:relative}
    .dash{background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 50px 90px -50px rgba(17,22,19,.45),0 18px 30px -24px rgba(17,22,19,.2);display:flex;overflow:hidden;transform:rotate(.6deg);transition:transform .6s var(--ease)}
    .dash:hover{transform:rotate(0)}
    .dash-rail{width:42px;border-right:1px solid var(--line);padding:12px 0;display:flex;flex-direction:column;align-items:center;gap:15px;background:#FCFBF8}
    .rail-logo{width:18px;height:18px;border-radius:6px;background:var(--accent)}
    .rail-item{width:15px;height:15px;border-radius:4px;background:#E7E2D6}
    .rail-item.is-on{background:var(--accent)}
    .rail-av{margin-top:auto;width:22px;height:22px;border-radius:50%;background:#E4EDE8;color:var(--accent);display:grid;place-items:center;font-size:8px;font-weight:700}
    .dash-main{flex:1;min-width:0;padding:14px}
    .dash-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
    .dash-top strong{font-size:12px}
    .dash-pill{font-size:8.5px;color:var(--muted);border:1px solid var(--line);border-radius:99px;padding:3px 8px;background:#FCFBF8}
    .kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px}
    .kpi{border:1px solid var(--line);border-radius:9px;padding:9px 10px;background:#FCFBF8}
    .kpi span{font-size:8px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted)}
    .kpi strong{display:block;font-size:14px;letter-spacing:-.03em;margin:3px 0 2px}
    .kpi em{font-style:normal;font-size:8.5px;font-weight:600}
    .kpi .up{color:#0E7A4F}.kpi .down{color:#B4553A}.kpi .flat{color:var(--muted)}
    .chart-card{border:1px solid var(--line);border-radius:10px;padding:10px 11px 7px;margin-bottom:10px}
    .chart-head{display:flex;align-items:center;gap:8px;font-size:9px;margin-bottom:9px}
    .chart-head > span:first-child{font-weight:600;font-size:10px}
    .legend{margin-left:auto;display:inline-flex;align-items:center;gap:4px;color:var(--muted);font-size:8px}
    .legend i{width:6px;height:6px;border-radius:2px;background:var(--accent)}
    .chart-range{font-size:8px;color:var(--muted);border-left:1px solid var(--line);padding-left:7px}
    .chart{display:flex;align-items:flex-end;gap:5px;height:82px;padding-top:6px;background:repeating-linear-gradient(0deg,transparent,transparent 20px,#F4F1E9 20px,#F4F1E9 21px)}
    .bar{flex:1;display:flex;align-items:flex-end;height:100%}
    .bar i{display:block;width:100%;height:var(--h);border-radius:3px 3px 1px 1px;background:#D9E5DF;transition:height .6s var(--ease)}
    .bar.is-now i{background:var(--accent)}
    .chart-axis{display:flex;gap:5px;margin-top:5px}
    .chart-axis span{flex:1;text-align:center;font-size:6.5px;color:#A7AEA8}
    .dash-bottom{display:grid;grid-template-columns:1.35fr 1fr;gap:8px}
    .inv-card,.spark-card{border:1px solid var(--line);border-radius:10px;padding:9px 10px;background:#fff}
    .inv-head{display:flex;justify-content:space-between;font-size:8px;color:var(--muted);margin-bottom:6px}
    .inv-head span:first-child{font-weight:600;color:var(--text);font-size:9px}
    .inv-row{display:flex;align-items:center;gap:6px;font-size:8px;padding:5px 0;border-top:1px solid #F4F1E9}
    .inv-co{flex:1;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .inv-num{font-weight:600}
    .st{font-size:6.5px;padding:2px 5px;border-radius:99px;font-weight:700}
    .st--paid{background:#E4F2E9;color:#0E7A4F}
    .st--due{background:#FBF1DC;color:#8A6414}
    .st--late{background:#FAE7E1;color:#A3472A}
    .spark-label{font-size:8px;color:var(--muted)}
    .spark-card strong{display:block;font-size:12px;margin:2px 0 4px}
    .spark-card svg{width:100%;height:38px}
    .float-note{position:absolute;display:flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--line);border-radius:11px;padding:9px 12px;box-shadow:0 18px 40px -24px rgba(17,22,19,.4);font-size:9.5px;animation:floaty 8s ease-in-out infinite}
    .float-note strong{display:block;font-size:9.5px}
    .float-note span{font-size:8px;color:var(--muted)}
    .fn-a{left:-26px;bottom:16%;animation-delay:-2s}
    .fn-b{right:-14px;top:-20px;animation-delay:-5s}
    .fn-ico{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:#E4F2E9;color:#0E7A4F;font-size:9px;font-weight:800}
    .fn-ico--amber{background:#FBF1DC;color:#8A6414}
    @keyframes floaty{0%,100%{translate:0 0}50%{translate:0 -8px}}
    .logo-strip{display:flex;align-items:center;gap:26px;margin-top:clamp(48px,7vw,80px);padding-top:26px;border-top:1px solid var(--line);flex-wrap:wrap}
    .logo-label{font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:var(--muted)}
    .logo-row{display:flex;gap:clamp(18px,3.4vw,44px);flex-wrap:wrap;align-items:center;margin-left:auto}
    .logo-row span{font-family:var(--font-display);font-size:17px;letter-spacing:-.02em;color:#8B8F88;opacity:.85}
    .section{padding:clamp(60px,9vw,110px) 0}
    .sec-head{max-width:640px;margin:0 auto clamp(32px,5vw,52px);text-align:center}
    .sec-head--left{margin:0 0 30px;text-align:left}
    .sec-head h2{font-size:clamp(30px,4vw,44px);margin:10px 0 14px;letter-spacing:-.03em;line-height:1.05}
    .sec-head p{font-size:14px;line-height:1.65;color:var(--muted);max-width:52ch;margin-inline:auto}
    .sec-head--left p{margin-inline:0}
    .feature-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
    .feature{border:1px solid var(--line);border-radius:18px;padding:24px 22px 0;background:#fff;overflow:hidden;transition:transform .45s var(--ease),box-shadow .45s}
    .feature:hover{transform:translateY(-4px);box-shadow:0 30px 60px -48px rgba(17,22,19,.5)}
    .f-ico{display:grid;place-items:center;width:40px;height:40px;border-radius:11px;background:var(--accent-soft);color:var(--accent);margin-bottom:16px}
    .feature h3{font-size:16.5px;letter-spacing:-.02em;margin-bottom:8px}
    .feature p{font-size:12.5px;line-height:1.65;color:var(--muted);min-height:64px}
    .f-visual{margin-top:18px;border-top:1px solid var(--line);background:#FCFBF8;margin-inline:-22px;padding:14px 22px 18px}
    .queue-row{display:flex;align-items:center;gap:8px;font-size:10.5px;padding:6px 0}
    .queue-row i{width:16px;height:16px;border-radius:50%;display:grid;place-items:center;font-size:8px;font-style:normal;background:#E4F2E9;color:#0E7A4F}
    .queue-row b{margin-left:auto;font-weight:600}
    .queue-row.is-review{color:#8A6414}
    .queue-row.is-review i{background:#FBF1DC;color:#8A6414}
    .rw-row{display:flex;justify-content:space-between;font-size:10px;margin-bottom:5px}
    .rw-row b{font-weight:600}
    .rw-row--ghost{color:var(--muted);margin-top:11px}
    .rw-bar{height:6px;border-radius:99px;background:#EDE9DF;position:relative}
    .rw-bar i{display:block;height:100%;border-radius:99px;background:var(--accent)}
    .rw-bar em{position:absolute;top:-3px;width:1px;height:12px;background:var(--text)}
    .rw-bar--ghost i{background:#B9C8C1}
    .inv-chip{display:flex;justify-content:space-between;align-items:center;border:1px dashed #D8D2C4;border-radius:8px;padding:9px 11px;font-size:10.5px;background:#fff}
    .reminder{display:block;margin-top:8px;font-size:9.5px;color:var(--accent)}
    .reminder--muted{color:var(--muted);margin-top:4px}
    .how-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(30px,6vw,80px)}
    .steps{display:flex;flex-direction:column}
    .step{display:flex;gap:18px;padding:20px 0;border-top:1px solid var(--line)}
    .step:last-child{border-bottom:1px solid var(--line)}
    .step-num{font-family:var(--font-display);font-size:13px;color:var(--accent);padding-top:3px;font-variant-numeric:tabular-nums}
    .step h3{font-size:15px;margin-bottom:5px;letter-spacing:-.01em}
    .step p{font-size:12.5px;line-height:1.65;color:var(--muted);max-width:44ch}
    .quote-band{background:#111613;color:#F5F2EA;padding:clamp(54px,8vw,90px) 0}
    .quote-grid{display:grid;grid-template-columns:1.4fr .8fr;gap:50px;align-items:center}
    .quote-mark{font-family:var(--font-display);font-size:68px;line-height:.6;color:var(--accent);opacity:.9;margin-bottom:6px}
    .quote-grid blockquote .display{font-size:clamp(24px,3.2vw,36px);line-height:1.25;letter-spacing:-.025em;max-width:22ch}
    .quote-grid blockquote footer{display:flex;align-items:center;gap:11px;margin-top:24px}
    .quote-grid footer div{display:flex;flex-direction:column;font-size:12px}
    .quote-grid footer span{color:#9AA39C;font-size:11px}
    .quote-stats{border-left:1px solid rgba(255,255,255,.14);padding-left:38px;display:flex;flex-direction:column;gap:26px}
    .quote-stats strong{display:block;font-family:var(--font-display);font-size:30px;letter-spacing:-.03em;color:#F5F2EA}
    .quote-stats span{font-size:11.5px;color:#9AA39C;line-height:1.5}
    .billing-toggle{display:inline-flex;padding:4px;border-radius:99px;border:1px solid var(--line);background:#fff;gap:2px;margin-top:20px}
    .billing-toggle button{height:32px;padding:0 14px;border-radius:99px;font-size:11.5px;font-weight:600;color:var(--muted);transition:.25s;display:flex;align-items:center;gap:6px}
    .billing-toggle .is-on{background:var(--text);color:#fff}
    .save-badge{font-size:9px;background:var(--accent-soft);color:var(--accent);padding:2px 5px;border-radius:99px}
    .billing-toggle .is-on .save-badge{background:rgba(255,255,255,.16);color:#fff}
    .price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;align-items:start}
    .price-card{border:1px solid var(--line);border-radius:18px;padding:26px 24px;background:#fff;position:relative}
    .price-card.is-hot{border-color:var(--accent);box-shadow:0 28px 60px -46px rgba(14,107,78,.6)}
    .hot-tag{position:absolute;top:-11px;left:24px;background:var(--accent);color:#fff;font-size:9.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:4px 9px;border-radius:99px}
    .price-card h3{font-size:14px;letter-spacing:-.01em}
    .price-blurb{font-size:11.5px;line-height:1.6;color:var(--muted);margin:7px 0 20px;min-height:56px}
    .price-amount{display:flex;align-items:baseline;gap:2px}
    .price-amount .cur{font-size:16px;color:var(--muted)}
    .price-amount strong{font-family:var(--font-display);font-size:42px;letter-spacing:-.04em;line-height:1}
    .price-amount .per{font-size:11px;color:var(--muted)}
    .price-billed{font-size:10px;color:var(--muted);margin:7px 0 18px}
    .price-card .btn{width:100%}
    .price-feats{margin-top:20px;padding-top:17px;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:9px}
    .price-feats li{display:flex;gap:7px;font-size:11.5px;color:#4A514B}
    .price-feats svg{color:var(--accent);flex:none;margin-top:1px}
    .pricing-note{text-align:center;font-size:10.5px;color:var(--muted);margin-top:22px}
    .faq-grid{display:grid;grid-template-columns:.8fr 1.2fr;gap:clamp(30px,6vw,80px)}
    .faq-list{border-top:1px solid var(--line)}
    .faq{border-bottom:1px solid var(--line)}
    .faq summary{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:18px 2px;cursor:pointer;font-size:13.5px;font-weight:500;list-style:none}
    .faq summary::-webkit-details-marker{display:none}
    .faq-plus{font-size:18px;color:var(--muted);transition:transform .3s var(--ease)}
    .faq[open] .faq-plus{transform:rotate(45deg);color:var(--accent)}
    .faq p{font-size:12.5px;line-height:1.7;color:var(--muted);padding:0 30px 18px 2px;max-width:60ch}
    .cta-band{background:var(--accent);color:#fff}
    .cta-inner{padding:clamp(54px,8vw,86px) 0;text-align:center}
    .cta-band .eyebrow{color:rgba(255,255,255,.72)}
    .cta-band h2{font-size:clamp(28px,4vw,46px);letter-spacing:-.03em;line-height:1.08;max-width:18ch;margin:10px auto 26px}
    .cta-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
    .cta-band .btn--primary{background:#fff;color:var(--accent);box-shadow:0 12px 30px -14px rgba(0,0,0,.4)}
    .cta-band .btn--ghost{border-color:rgba(255,255,255,.4);background:transparent;color:#fff}
    .cta-band .btn--ghost:hover{background:rgba(255,255,255,.12);border-color:#fff}
    .cta-note{font-size:10.5px;color:rgba(255,255,255,.7);margin-top:14px}
    .footer{padding:52px 0 22px;background:#FCFBF8;border-top:1px solid var(--line)}
    .footer-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:30px}
    .brand--foot{margin-bottom:12px}
    .foot-copy{font-size:11.5px;line-height:1.7;color:var(--muted);max-width:34ch}
    .status{display:inline-flex;align-items:center;gap:6px;margin-top:16px;font-size:10px;color:var(--muted);border:1px solid var(--line);border-radius:99px;padding:5px 10px;background:#fff}
    .status i{width:6px;height:6px;border-radius:50%;background:#0E7A4F;box-shadow:0 0 0 3px #E4F2E9}
    .footer nav{display:flex;flex-direction:column;gap:9px}
    .footer nav p{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:var(--muted);margin-bottom:4px}
    .footer nav a{font-size:12px;color:#4A514B}
    .footer nav a:hover{color:var(--accent)}
    .foot-bottom{display:flex;justify-content:space-between;gap:16px;margin-top:38px;padding-top:18px;border-top:1px solid var(--line);font-size:10px;color:var(--muted)}
    @media (max-width:1000px){
      .hero-grid{grid-template-columns:1fr;gap:46px}
      .hero h1{max-width:16ch}
      .hero-visual{max-width:620px}
      .fn-a{left:6px}.fn-b{right:6px}
      .feature-grid{grid-template-columns:1fr}
      .feature p{min-height:0}
      .how-grid,.faq-grid{grid-template-columns:1fr;gap:26px}
      .quote-grid{grid-template-columns:1fr;gap:34px}
      .quote-stats{border-left:0;border-top:1px solid rgba(255,255,255,.14);padding-left:0;padding-top:26px;flex-direction:row;gap:30px;flex-wrap:wrap}
      .price-grid{grid-template-columns:1fr}
      .price-card.is-hot{order:-1}
      .price-blurb{min-height:0}
      .footer-grid{grid-template-columns:1fr 1fr;gap:26px}
    }
    @media (max-width:700px){
      .nav-links,.link-quiet{display:none}
      .nav-toggle{display:grid;place-items:center;width:36px;height:36px;border-radius:9px;border:1px solid var(--line)}
      .nav-cta .btn{padding:0 12px;font-size:11.5px}
      .nav{padding:12px 0}
      .hero{padding-top:104px}
      .hero h1{font-size:clamp(36px,10.5vw,52px)}
      .kpis{grid-template-columns:1fr 1fr}
      .kpi:nth-child(3){display:none}
      .dash-bottom{grid-template-columns:1fr}
      .float-note{display:none}
      .logo-row{gap:16px}
      .logo-row span{font-size:14px}
      .hero-proof{gap:12px}
      .quote-grid blockquote .display{font-size:22px}
      .footer-grid{grid-template-columns:1fr}
      .foot-bottom{flex-direction:column;gap:6px}
    }
  </style>`;

  const js = `${runtimeJs}
(function(){
  var toggle=document.querySelectorAll('[data-billing]');
  function setBilling(mode){
    toggle.forEach(function(b){b.classList.toggle('is-on',b.getAttribute('data-billing')===mode)});
    document.querySelectorAll('[data-month]').forEach(function(el){
      var m=el.getAttribute('data-month');
      var y=el.getAttribute('data-year');
      el.textContent=mode==='year'?y:m;
    });
    document.querySelectorAll('[data-billed]').forEach(function(el){
      var price=el.parentElement.querySelector('[data-month]');
      var free=price.getAttribute('data-month')==='0';
      el.textContent=free?'Free forever':(mode==='year'?'Billed yearly · save 20%':'Billed monthly');
    });
  }
  toggle.forEach(function(b){
    b.addEventListener('click',function(){setBilling(b.getAttribute('data-billing'))});
  });
  var nav=document.querySelector('[data-header]');
  window.addEventListener('scroll',function(){if(nav)nav.classList.toggle('is-stuck',window.scrollY>10)},{passive:true});
})();`;

  return {
    brand: { name: brand, tagline, monogram: brand.charAt(0) },
    html: body,
    css: "",
    tokens: renderTokens(t),
    js,
    fonts: { display: "Fraunces", body: "Inter", link: t.fontsLink },
    mood: "Warm paper, deep green, editorial serif. Numbers presented with restraint; no gradients competing with the data.",
    motion: [
      "Dashboard tilts .6° at rest and straightens on hover",
      "Floating status notes drift on an 8s loop",
      "Pricing toggle swaps monthly and yearly figures",
      "FAQ rows open without layout jump",
    ],
    components: [
      { name: "HeroDashboard", note: "KPI cards, bar chart, invoice table, sparkline" },
      { name: "FeatureGrid", note: "Three problems, each with a miniature UI" },
      { name: "PricingTable", note: "Monthly / yearly toggle with discount" },
      { name: "FAQ", note: "Native details/summary, one open by default" },
      { name: "QuoteBand", note: "Dark editorial testimonial with stats" },
      { name: "Nav", note: "Transparent → blurred on scroll" },
    ],
    pages: [
      { name: "Landing", route: "/", sections: ["Hero", "Logos", "Features", "How it works", "Testimonial", "Pricing", "FAQ", "CTA"] },
      { name: "Pricing", route: "/pricing", sections: ["Tiers", "Billing toggle", "FAQ"] },
      { name: "Sign up", route: "/signup", sections: ["Email", "Workspace name", "Trial"] },
      { name: "Docs", route: "/docs", sections: ["Quickstart", "API reference"] },
    ],
    features: [
      "Live pricing toggle (monthly / yearly)",
      "Working FAQ accordion",
      "Product dashboard mockup in pure CSS",
      "Scroll-aware navigation",
      "Editorial testimonial band",
      "Responsive pricing cards",
    ],
    database: [
      {
        table: "organizations",
        columns: [
          { name: "id", type: "uuid" },
          { name: "name", type: "text" },
          { name: "plan", type: "enum" },
          { name: "trial_ends_at", type: "timestamptz" },
        ],
      },
      {
        table: "invoices",
        columns: [
          { name: "id", type: "uuid" },
          { name: "org_id", type: "uuid" },
          { name: "customer", type: "text" },
          { name: "amount", type: "numeric" },
          { name: "status", type: "enum" },
        ],
      },
      {
        table: "transactions",
        columns: [
          { name: "id", type: "uuid" },
          { name: "account_id", type: "uuid" },
          { name: "amount", type: "numeric" },
          { name: "category", type: "text" },
          { name: "reconciled", type: "boolean" },
        ],
      },
      {
        table: "subscriptions",
        columns: [
          { name: "id", type: "uuid" },
          { name: "org_id", type: "uuid" },
          { name: "seats", type: "int" },
          { name: "interval", type: "enum" },
        ],
      },
    ],
  };
}
