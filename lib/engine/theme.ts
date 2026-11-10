export type Theme = {
  bg: string;
  surface: string;
  surface2: string;
  text: string;
  muted: string;
  line: string;
  accent: string;
  accentInk: string;
  accentSoft: string;
  radius: number;
  max: string;
  display: string;
  body: string;
  displayWeight?: number;
  displayTracking?: string;
  fontsLink: string;
};

export const theme = (partial: Partial<Theme> & Theme): Theme => partial;

export function renderTokens(t: Theme): string {
  return `:root{
--bg:${t.bg};
--surface:${t.surface};
--surface-2:${t.surface2};
--text:${t.text};
--muted:${t.muted};
--line:${t.line};
--accent:${t.accent};
--accent-ink:${t.accentInk};
--accent-soft:${t.accentSoft};
--radius:${t.radius}px;
--max:${t.max};
--font-display:${t.display};
--font-body:${t.body};
--display-weight:${t.displayWeight ?? 600};
--display-tracking:${t.displayTracking ?? "-0.025em"};
--ease:cubic-bezier(.16,1,.3,1);
}
`;
}

export function withRadius(t: Theme, radius: number): Theme {
  return { ...t, radius };
}
