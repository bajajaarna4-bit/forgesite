import { baseCss } from "./base";
import { GENRE_LABEL, detectGenre } from "./detect";
import type { BuildOptions, FileMap, GenreId, PaletteSwatch, Plan } from "../types";
import { buildCommerce } from "./sites/commerce";
import { buildStreaming } from "./sites/streaming";
import { buildVideo } from "./sites/video";
import { buildSocial } from "./sites/social";
import { buildSaas } from "./sites/saas";
import { buildPortfolio } from "./sites/portfolio";

export { GENRE_LABEL, detectGenre } from "./detect";

export const GENRE_ACCENTS: Record<GenreId, { name: string; hex: string }[]> = {
  commerce: [
    { name: "Citrus", hex: "#FFD447" },
    { name: "Lime", hex: "#C9F06B" },
    { name: "Apricot", hex: "#FFB4A2" },
  ],
  streaming: [
    { name: "Gold", hex: "#E3A342" },
    { name: "Ember", hex: "#FF7A59" },
    { name: "Moonlight", hex: "#AEBCFF" },
  ],
  video: [
    { name: "Signal orange", hex: "#E4572E" },
    { name: "Studio green", hex: "#1F7A63" },
    { name: "Electric", hex: "#3D5AFE" },
  ],
  social: [
    { name: "Terracotta", hex: "#C0502E" },
    { name: "Fern", hex: "#2F6B4F" },
    { name: "Indigo", hex: "#2B3A55" },
  ],
  saas: [
    { name: "Pine", hex: "#0E6B4E" },
    { name: "Indigo", hex: "#2E3A8C" },
    { name: "Clay", hex: "#A3472A" },
  ],
  portfolio: [
    { name: "Rust", hex: "#A8492E" },
    { name: "Moss", hex: "#3E5B45" },
    { name: "Slate", hex: "#2F3A55" },
  ],
};

export const GENRE_DEFAULT_RADIUS: Record<GenreId, number> = {
  commerce: 16,
  streaming: 12,
  video: 14,
  social: 16,
  saas: 14,
  portfolio: 6,
};

export function defaultOptions(genre: GenreId): BuildOptions {
  return {
    palette: 0,
    radius: GENRE_DEFAULT_RADIUS[genre],
    sections: genre === "streaming" ? ["top10", "collection"] : [],
  };
}

type Site = ReturnType<typeof buildStreaming>;

function extractInlineStyles(html: string): { body: string; css: string } {
  const blocks: string[] = [];
  const body = html.replace(/<style>([\s\S]*?)<\/style>/g, (_m, css: string) => {
    blocks.push(css);
    return "";
  });
  return { body, css: blocks.join("\n") };
}

function tokenizeSurfaces(css: string): string {
  return css
    .replace(/background:#fff\b/gi, "background:var(--surface)")
    .replace(/background:#FCFBF8\b/gi, "background:var(--surface)")
    .replace(/background:rgba\(255,252,244,\.9\d?\)/g, "background:var(--surface)")
    .replace(/background:rgba\(255,255,255,\.8\)/g, "background:var(--surface)")
    .replace(/#dcd5c4/gi, "var(--line)")
    .replace(/#D8D2C4/gi, "var(--line)")
    .replace(/#F4F1E9/gi, "var(--line)")
    .replace(/#FFFCF4/gi, "var(--surface)")
    .replace(/color:#3d4a40/gi, "color:var(--muted)");
}

function parseTokens(tokens: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of tokens.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

export function paletteFromFiles(files: FileMap): PaletteSwatch[] {
  const tokens = parseTokens(files["styles/tokens.css"] ?? "");
  return [
    { name: "Canvas", hex: tokens["bg"] ?? "#ffffff", role: "Background" },
    { name: "Surface", hex: tokens["surface"] ?? "#f5f5f5", role: "Cards and panels" },
    { name: "Ink", hex: tokens["text"] ?? "#111111", role: "Primary text" },
    { name: "Muted", hex: tokens["muted"] ?? "#666666", role: "Secondary text" },
    { name: "Accent", hex: tokens["accent"] ?? "#e36a3d", role: "Action and emphasis" },
  ];
}

export function buildSite(prompt: string, genre: GenreId, options: BuildOptions, seedSalt = ""): { site: Site; files: FileMap; plan: Plan } {
  const seed = `${prompt}::${seedSalt}`;
  const factory =
    genre === "commerce"
      ? buildCommerce
      : genre === "streaming"
        ? buildStreaming
        : genre === "video"
          ? buildVideo
          : genre === "social"
            ? buildSocial
            : genre === "saas"
              ? buildSaas
              : buildPortfolio;
  const site = factory({
    seed,
    palette: options.palette,
    radius: options.radius,
    sections: options.sections,
  });

  const requested = requestedBrand(prompt);
  if (requested && requested.toLowerCase() !== site.brand.name.toLowerCase()) {
    const pattern = new RegExp(escapeRegex(site.brand.name), "gi");
    const swap = (value: string) => value.replace(pattern, requested);
    site.html = swap(site.html);
    site.js = swap(site.js);
    site.brand = {
      ...site.brand,
      name: requested,
      monogram:
        requested.split(/\s+/).length > 1
          ? (requested.split(/\s+/)[0][0] + requested.split(/\s+/)[1][0]).toUpperCase()
          : requested.slice(0, 2).toUpperCase(),
    };
  }

  const extracted = extractInlineStyles(site.html);
  extracted.css = tokenizeSurfaces(extracted.css);
  const files: FileMap = {
    "index.html": `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${site.brand.name} — ${site.brand.tagline}</title>
  <meta name="description" content="${site.brand.name}: ${site.brand.tagline} Generated with Atelier." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${site.fonts.link}" rel="stylesheet" />
  <link rel="stylesheet" href="styles/tokens.css" />
  <link rel="stylesheet" href="styles/site.css" />
</head>
<body>
${extracted.body}
<script src="app.js"></script>
</body>
</html>
`,
    "styles/tokens.css": `/* ${site.brand.name} — design tokens */\n${site.tokens}\n${baseCss}`,
    "styles/site.css": `/* ${site.brand.name} — ${GENRE_LABEL[genre]} layout */\n${extracted.css}`,
    "app.js": `/* ${site.brand.name} — interaction layer */\n${site.js}`,
    "README.md": `# ${site.brand.name}

${site.brand.tagline}

A ${GENRE_LABEL[genre].toLowerCase()} website generated with Atelier. No build step, no runtime dependencies.

## Run it

Open \`index.html\` in a browser, or serve the folder:

\`\`\`bash
npx serve .
\`\`\`

## Files

- \`index.html\` — document and markup
- \`styles/tokens.css\` — palette, type scale, base primitives
- \`styles/site.css\` — layout and components
- \`app.js\` — interaction layer

## Notes

- Photography is loaded from picsum.photos and is replaceable.
- All copy, names and prices are fictional.
- Respects \`prefers-reduced-motion\`.
`,
  };

  const plan: Plan = {
    brand: site.brand,
    genre,
    positioning: `${site.brand.name} is a ${GENRE_LABEL[genre].toLowerCase()} concept: ${prompt.trim().replace(/\.$/, "")}.`,
    pages: site.pages,
    components: site.components,
    features: site.features,
    design: {
      palette: paletteFromFiles(files),
      fonts: { display: site.fonts.display, body: site.fonts.body },
      radius: options.radius,
      mood: site.mood,
      motion: site.motion,
    },
    database: site.database,
    stack: [
      "Semantic HTML5",
      "Modern CSS + custom properties",
      "Vanilla ES2020 interactions",
      "Responsive 360 → 1440",
      "No runtime dependencies",
    ],
  };

  return { site, files, plan };
}

function requestedBrand(prompt: string): string | null {
  const match = prompt.match(
    /\b(?:called|named)\s+["“']?([A-Z][\p{L}\d&'’.+-]*(?:\s+[A-Z][\p{L}\d&'’.+-]*){0,3})/u,
  );
  if (!match) return null;
  const name = match[1].replace(/[.,;:!?]+$/, "").trim();
  return name.length >= 2 ? name : null;
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function assembleSite(files: FileMap): string {
  let html = files["index.html"] ?? "";
  Object.entries(files).forEach(([path, content]) => {
    if (path.endsWith(".css")) {
      html = html.replace(
        new RegExp(`<link[^>]*href="${escapeRegex(path)}"[^>]*>`),
        () => `<style>\n${content}\n</style>`,
      );
    } else if (path.endsWith(".js")) {
      html = html.replace(
        new RegExp(`<script[^>]*src="${escapeRegex(path)}"[^>]*></script>`),
        () => `<script>\n${content}\n</script>`,
      );
    }
  });
  return html;
}

export function fileSize(content: string): string {
  const bytes = new TextEncoder().encode(content).length;
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function fileTree(files: FileMap): string[] {
  return Object.keys(files).sort((a, b) => {
    if (a === "index.html") return -1;
    if (b === "index.html") return 1;
    return a.localeCompare(b);
  });
}
