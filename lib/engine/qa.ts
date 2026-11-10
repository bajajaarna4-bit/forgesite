import type { FileMap, QaFinding } from "../types";

type Rule = {
  id: string;
  rule: string;
  severity: QaFinding["severity"];
};

const RULES = {
  copy: { id: "qa-copy", rule: "No placeholder copy", severity: "high" },
  alt: { id: "qa-alt", rule: "Images have text alternatives", severity: "high" },
  size: { id: "qa-size", rule: "Images reserve layout space", severity: "medium" },
  emptySrc: { id: "qa-empty-src", rule: "No empty image sources", severity: "medium" },
  lang: { id: "qa-lang", rule: "Document language declared", severity: "low" },
  viewport: { id: "qa-viewport", rule: "Responsive viewport declared", severity: "high" },
  description: { id: "qa-description", rule: "Meta description present", severity: "medium" },
  h1: { id: "qa-h1", rule: "A single page heading exists", severity: "high" },
  motion: { id: "qa-motion", rule: "Reduced motion respected", severity: "medium" },
  accentContrast: { id: "qa-accent-contrast", rule: "Action text meets contrast", severity: "high" },
  mutedContrast: { id: "qa-muted-contrast", rule: "Secondary text meets contrast", severity: "medium" },
} satisfies Record<string, Rule>;

const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

function finding(rule: Rule, detail: string, file: string): QaFinding {
  return { id: rule.id, rule: rule.rule, severity: rule.severity, detail, file, fixed: false };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function channel(c: number) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

export function contrastRatio(a: string, b: string): number | null {
  const la = luminance(a);
  const lb = luminance(b);
  if (la === null || lb === null) return null;
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

function mixHex(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  if (!ca || !cb) return a;
  const to = (x: number, y: number) => Math.round(x + (y - x) * t);
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${hex(to(ca.r, cb.r))}${hex(to(ca.g, cb.g))}${hex(to(ca.b, cb.b))}`;
}

function parseTokens(css: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of css.matchAll(/--([\w-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

function hasImages(files: FileMap): string[] {
  return Object.keys(files).filter((path) => /\.(html|js)$/.test(path) && /<img\b/i.test(files[path]));
}

function collectTags(files: FileMap, re: RegExp): { count: number; file: string } {
  let count = 0;
  let file = "index.html";
  Object.entries(files).forEach(([path, content]) => {
    const matches = content.match(re);
    if (matches) {
      count += matches.length;
      if (file === "index.html" || path === "index.html") file = path;
    }
  });
  return { count, file };
}

export function runQa(files: FileMap): QaFinding[] {
  const out: QaFinding[] = [];
  const html = files["index.html"] ?? "";
  const all = Object.values(files).join("\n");

  if (/\blorem ipsum\b|\bproduct\s*1\b|\bdolor sit amet\b|\bTODO\b|\{\{[^}]+\}\}/i.test(all)) {
    out.push(
      finding(RULES.copy, "Placeholder text slipped into the copy. Every line should read as if a human wrote it.", "index.html"),
    );
  }

  const imgFiles = hasImages(files);
  const tags: string[] = [];
  imgFiles.forEach((path) => {
    tags.push(...(files[path].match(/<img\b[^>]*>/gi) ?? []));
  });

  if (tags.length) {
    const missingAlt = tags.filter((t) => !/\balt\s*=/i.test(t)).length;
    if (missingAlt) {
      out.push(
        finding(RULES.alt, `${missingAlt} of ${tags.length} images have no text alternative for screen readers.`, imgFiles[0]),
      );
    }
    const unsized = tags.filter((t) => !/\bwidth\s*=/i.test(t) || !/\bheight\s*=/i.test(t)).length;
    if (unsized) {
      out.push(
        finding(
          RULES.size,
          `${unsized} of ${tags.length} images omit intrinsic width and height, so the layout shifts while they load.`,
          imgFiles[0],
        ),
      );
    }
    const empty = tags.filter((t) => /\bsrc\s*=\s*(""|'')/i.test(t)).length;
    if (empty) {
      out.push(finding(RULES.emptySrc, `${empty} image element${empty > 1 ? "s" : ""} point at an empty src, which re-requests the page.`, imgFiles[0]));
    }
  }

  if (!/<html[^>]*\blang\s*=/i.test(html)) {
    out.push(finding(RULES.lang, "The root element has no lang attribute, so assistive tech guesses the language.", "index.html"));
  }
  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) {
    out.push(finding(RULES.viewport, "No viewport meta tag — the page will render zoomed out on phones.", "index.html"));
  }
  if (!/<meta[^>]+name=["']description["']/i.test(html)) {
    out.push(finding(RULES.description, "No meta description, so search results have nothing to summarise.", "index.html"));
  }
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (h1Count === 0) {
    out.push(finding(RULES.h1, "The page has no h1, leaving the outline without a top-level heading.", "index.html"));
  } else if (h1Count > 1) {
    out.push(finding(RULES.h1, `${h1Count} h1 headings compete for the top of the outline.`, "index.html"));
  }
  const css = Object.entries(files)
    .filter(([p]) => p.endsWith(".css"))
    .map(([, c]) => c)
    .join("\n");
  if (css && !/prefers-reduced-motion/i.test(css)) {
    out.push(finding(RULES.motion, "Motion has no reduced-motion escape hatch for people who request one.", "styles/site.css"));
  }

  const tokens = parseTokens(files["styles/tokens.css"] ?? "");
  if (tokens.accent && tokens["accent-ink"]) {
    const ratio = contrastRatio(tokens.accent, tokens["accent-ink"]);
    if (ratio !== null && ratio < 4.5) {
      out.push(
        finding(
          RULES.accentContrast,
          `Text on the accent color measures ${ratio.toFixed(1)}:1. WCAG AA needs 4.5:1 for body-size text.`,
          "styles/tokens.css",
        ),
      );
    }
  }
  if (tokens.muted && tokens.bg) {
    const ratio = contrastRatio(tokens.muted, tokens.bg);
    if (ratio !== null && ratio < 4.5) {
      out.push(
        finding(
          RULES.mutedContrast,
          `Secondary text on the canvas measures ${ratio.toFixed(1)}:1 — too quiet to read comfortably.`,
          "styles/tokens.css",
        ),
      );
    }
  }

  return out;
}

function patchImages(files: FileMap, patcher: (tag: string) => string): FileMap {
  const next = { ...files };
  hasImages(files).forEach((path) => {
    next[path] = files[path].replace(/<img\b[^>]*>/gi, patcher);
  });
  return next;
}

export function fixQa(files: FileMap, findings: QaFinding[]): { files: FileMap; findings: QaFinding[] } {
  if (!findings.length) return { files, findings };
  let next: FileMap = { ...files };
  const ids = new Set(findings.map((f) => f.id));

  if (ids.has(RULES.size.id)) {
    next = patchImages(next, (tag) => {
      const known = tag.match(/\/seed\/[^/]+\/(\d{2,4})\/(\d{2,4})/);
      const w = known?.[1] ?? "1200";
      const h = known?.[2] ?? "800";
      let out = tag;
      if (!/\bwidth\s*=/i.test(out)) out = out.replace(/<img/i, `<img width="${w}"`);
      if (!/\bheight\s*=/i.test(out)) out = out.replace(/<img/i, `<img height="${h}"`);
      return out;
    });
  }

  if (ids.has(RULES.alt.id)) {
    next = patchImages(next, (tag) => (/\balt\s*=/i.test(tag) ? tag : tag.replace(/<img/i, '<img alt=""')));
  }

  if (ids.has(RULES.emptySrc.id)) {
    next = patchImages(next, (tag) => tag.replace(/\bsrc\s*=\s*(""|'')/i, `src="${TRANSPARENT_PIXEL}"`));
  }

  const html = next["index.html"] ?? "";
  if (html) {
    let patched = html;
    if (ids.has(RULES.lang.id) && !/<html[^>]*\blang\s*=/i.test(patched)) {
      patched = patched.replace(/<html\b/i, '<html lang="en"');
    }
    if (ids.has(RULES.viewport.id) && !/name=["']viewport["']/i.test(patched)) {
      patched = patched.replace(/<head>/i, '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1" />');
    }
    if (ids.has(RULES.description.id) && !/name=["']description["']/i.test(patched)) {
      const title = patched.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "A site built with Atelier";
      patched = patched.replace(/<\/head>/i, `  <meta name="description" content="${title.replace(/"/g, "&quot;")}" />\n</head>`);
    }
    if (ids.has(RULES.h1.id)) {
      const count = (patched.match(/<h1\b/gi) ?? []).length;
      if (count === 0) {
        const title = patched.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.split("—")[0]?.trim() || "Welcome";
        patched = patched.replace(/<body([^>]*)>/i, `<body$1>\n  <h1 class="sr-only">${title}</h1>`);
      } else if (count > 1) {
        let seen = 0;
        patched = patched.replace(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/gi, (m, attrs: string, inner: string) => {
          seen += 1;
          return seen === 1 ? m : `<h2${attrs}>${inner}</h2>`;
        });
      }
    }
    next["index.html"] = patched;
  }

  if (ids.has(RULES.motion.id)) {
    const css = next["styles/site.css"] ?? "";
    if (!/prefers-reduced-motion/i.test(css)) {
      next["styles/site.css"] =
        css +
        `\n@media (prefers-reduced-motion: reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important}
}
`;
    }
  }

  const tokensCss = next["styles/tokens.css"] ?? "";
  let tokensPatched = tokensCss;
  const tokens = parseTokens(tokensCss);

  if (ids.has(RULES.accentContrast.id) && tokens.accent) {
    const dark = contrastRatio(tokens.accent, "#0b0b0d") ?? 0;
    const light = contrastRatio(tokens.accent, "#ffffff") ?? 0;
    const ink = dark >= light ? "#0b0b0d" : "#ffffff";
    tokensPatched = tokensPatched.replace(/--accent-ink:\s*[^;]+;/, `--accent-ink:${ink};`);
  }

  if (ids.has(RULES.mutedContrast.id) && tokens.muted && tokens.bg && tokens.text) {
    let candidate = tokens.muted;
    for (let i = 1; i <= 10; i++) {
      if ((contrastRatio(candidate, tokens.bg) ?? 0) >= 4.5) break;
      candidate = mixHex(tokens.muted, tokens.text, i / 10);
    }
    tokensPatched = tokensPatched.replace(/--muted:\s*[^;]+;/, `--muted:${candidate};`);
  }

  if (tokensPatched !== tokensCss) next["styles/tokens.css"] = tokensPatched;

  const remaining = new Set(runQa(next).map((f) => f.id));
  return {
    files: next,
    findings: findings.map((f) => ({ ...f, fixed: !remaining.has(f.id) })),
  };
}

export function qaScore(findings: QaFinding[]): number {
  const penalty = findings
    .filter((f) => !f.fixed)
    .reduce((sum, f) => sum + (f.severity === "high" ? 12 : f.severity === "medium" ? 6 : 2), 0);
  return Math.max(0, Math.min(100, 100 - penalty));
}
