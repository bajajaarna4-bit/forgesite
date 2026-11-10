import type { GenreId } from "./types";

export type Template = {
  id: string;
  name: string;
  genre: GenreId;
  tagline: string;
  prompt: string;
  swatch: string[];
};

export const GENRE_CHIPS: { id: GenreId; label: string; hint: string }[] = [
  { id: "commerce", label: "Quick commerce", hint: "Grocery delivery with a live cart" },
  { id: "streaming", label: "Streaming", hint: "Cinematic catalogue and title modal" },
  { id: "video", label: "Video platform", hint: "Creator channels, watch page, comments" },
  { id: "social", label: "Social feed", hint: "Stories, posts, likes, profiles" },
  { id: "saas", label: "SaaS landing", hint: "Dashboard hero, pricing, FAQ" },
  { id: "portfolio", label: "Portfolio", hint: "Editorial work index, about, contact" },
];

export const TYPEWRITER = [
  "a 10-minute grocery store with a live cart…",
  "a moody streaming service for independent films…",
  "a creator video platform with watch pages and comments…",
  "a calm photo-sharing app with stories and profiles…",
  "an invoicing SaaS with a dashboard and clear pricing…",
  "a furniture designer's portfolio with an oversized hero…",
];

export const TEMPLATES: Template[] = [
  {
    id: "verdant",
    name: "Verdant",
    genre: "commerce",
    tagline: "10-minute produce, flowers and bread",
    prompt:
      "A quick commerce grocery store called Verdant that delivers fresh produce, bread and flowers in 10 minutes, with a live cart, category browsing and a slide-out checkout.",
    swatch: ["#FFFCF4", "#FFD447", "#14382A", "#F5EFD9"],
  },
  {
    id: "nocturne",
    name: "Nocturne",
    genre: "streaming",
    tagline: "Independent cinema, curated nightly",
    prompt:
      "A moody streaming service for independent cinema and world film, with a rotating cinematic hero, continue-watching rail, top ten and a full title modal with episodes.",
    swatch: ["#08080A", "#E3A342", "#191A1D", "#ECECEC"],
  },
  {
    id: "signal",
    name: "Signal",
    genre: "video",
    tagline: "A video platform for makers",
    prompt:
      "A creator video platform called Signal with channels, a watch page, comments, likes, subscriptions, shorts and a searchable browse view.",
    swatch: ["#FFFFFF", "#E4572E", "#1B1B1F", "#F2F2F0"],
  },
  {
    id: "marlow",
    name: "Marlow",
    genre: "social",
    tagline: "A slower photo-sharing feed",
    prompt:
      "A calm photo-sharing social app with stories, a feed, likes, comments, saved posts, profiles and an explore grid. Quiet, warm and editorial.",
    swatch: ["#FBF8F3", "#C0502E", "#2A2622", "#EDE4D7"],
  },
  {
    id: "ledgerline",
    name: "Ledgerline",
    genre: "saas",
    tagline: "Invoicing that explains itself",
    prompt:
      "A SaaS landing page for an invoicing tool called Ledgerline, with a live dashboard preview, three feature cards, how it works, pricing with a yearly toggle and an FAQ.",
    swatch: ["#FAF8F3", "#0E6B4E", "#17150F", "#E8E2D4"],
  },
  {
    id: "voss",
    name: "Atelier Voss",
    genre: "portfolio",
    tagline: "Furniture and objects, quietly made",
    prompt:
      "A designer's portfolio for a furniture and object studio: oversized editorial hero, numbered work index, about with material swatches, services, clients and a large contact email.",
    swatch: ["#F2EEE5", "#A8492E", "#22201B", "#DCD4C4"],
  },
];

export const BRAND_NAME = "Atelier";
