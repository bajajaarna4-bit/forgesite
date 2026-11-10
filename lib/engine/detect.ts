import type { GenreId } from "../types";

export const GENRE_LABEL: Record<GenreId, string> = {
  commerce: "Quick commerce",
  streaming: "Streaming",
  video: "Video platform",
  social: "Social feed",
  saas: "SaaS landing",
  portfolio: "Portfolio",
};

const STRONG: Record<GenreId, string[]> = {
  commerce: ["grocery", "groceries", "blinkit", "instacart", "quick commerce", "supermarket", "produce", "delivery app"],
  streaming: ["netflix", "prime video", "streaming", "movie", "movies", "cinema", "tv series", "episodes"],
  video: ["youtube", "video platform", "video sharing", "shorts", "creators", "channels"],
  social: ["instagram", "photo-sharing", "photo sharing", "social app", "stories", "reels", "feed", "social network"],
  saas: ["saas", "landing page", "b2b", "dashboard", "analytics", "invoicing", "crm", "startup site", "software"],
  portfolio: ["portfolio", "designer", "photographer", "freelance", "personal site", "architect", "artist"],
};

const WEAK: Record<GenreId, string[]> = {
  commerce: [
    "grocery",
    "delivery",
    "cart",
    "shop",
    "store",
    "market",
    "products",
    "checkout",
    "orders",
    "coffee",
    "roastery",
    "roaster",
    "beans",
    "bakery",
    "chocolate",
    "skincare",
    "candle",
    "apparel",
    "clothing",
    "fashion",
    "retail",
    "boutique",
    "storefront",
    "subscription box",
    "subscriptions",
  ],
  streaming: ["film", "series", "watch", "streaming", "tv", "trailer", "titles"],
  video: ["video", "channel", "subscribe", "thumbnails", "comments", "views"],
  social: ["social", "post", "photos", "friends", "likes", "follow", "profile", "sharing"],
  saas: ["pricing", "product", "trial", "signup", "features", "app", "tool", "platform", "landing"],
  portfolio: ["work", "studio", "about", "design", "projects", "agency", "resume"],
};

export function detectGenre(prompt: string): GenreId {
  const p = ` ${prompt.toLowerCase()} `;
  const scores: Record<GenreId, number> = { commerce: 0, streaming: 0, video: 0, social: 0, saas: 0, portfolio: 0 };
  (Object.keys(STRONG) as GenreId[]).forEach((g) => {
    STRONG[g].forEach((kw) => {
      if (p.includes(kw)) scores[g] += 4;
    });
  });
  (Object.keys(WEAK) as GenreId[]).forEach((g) => {
    WEAK[g].forEach((kw) => {
      if (p.includes(kw)) scores[g] += 1;
    });
  });
  if (/movie|film|streaming|netflix/.test(p)) scores.video -= 0.5;
  let best: GenreId = "saas";
  let bestScore = 0;
  (Object.keys(scores) as GenreId[]).forEach((g) => {
    if (scores[g] > bestScore) {
      best = g;
      bestScore = scores[g];
    }
  });
  if (bestScore === 0) {
    if (/portfolio|resume|personal/.test(p)) best = "portfolio";
    else best = "saas";
  }
  return best;
}
