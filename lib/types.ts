export type GenreId = "commerce" | "streaming" | "video" | "social" | "saas" | "portfolio";

export type FileMap = Record<string, string>;

export type PaletteSwatch = { name: string; hex: string; role: string };

export type Plan = {
  brand: { name: string; tagline: string; monogram: string };
  genre: GenreId;
  positioning: string;
  pages: { name: string; route: string; sections: string[] }[];
  components: { name: string; note: string }[];
  features: string[];
  design: {
    palette: PaletteSwatch[];
    fonts: { display: string; body: string };
    radius: number;
    mood: string;
    motion: string[];
  };
  database: { table: string; columns: { name: string; type: string; note?: string }[] }[];
  stack: string[];
};

export type AgentId = "planner" | "designer" | "frontend" | "backend" | "qa" | "reviewer";

export type AgentState = {
  id: AgentId;
  status: "queued" | "working" | "done";
  detail: string;
  logs: string[];
  ms: number;
  progress: number;
};

export type QaFinding = {
  id: string;
  rule: string;
  severity: "high" | "medium" | "low";
  detail: string;
  file: string;
  fixed: boolean;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  at: number;
  changed?: string[];
  kind?: "build" | "edit" | "info";
};

export type Version = {
  id: string;
  label: string;
  at: number;
  files: FileMap;
  note: string;
};

export type EngineSettings = {
  model: "atelier-1" | "atelier-1-pro" | "atelier-1-fast";
  temperature: number;
  creativity: "precise" | "balanced" | "expressive";
  systemPrompt: string;
};

export type BuildOptions = {
  palette: number;
  radius: number;
  sections: string[];
};

export type Project = {
  id: string;
  name: string;
  prompt: string;
  genre: GenreId;
  plan: Plan;
  files: FileMap;
  options: BuildOptions;
  seedSalt: string;
  stage: "plan" | "building" | "ready";
  messages: ChatMessage[];
  versions: Version[];
  qa: QaFinding[];
  activity: AgentState[];
  settings: EngineSettings;
  creditsSpent: number;
  deployed?: { url: string; subdomain: string; at: number };
  createdAt: number;
  updatedAt: number;
};

export type SelectionInfo = {
  selector: string;
  tag: string;
  classes: string;
  text: string;
};

export type EditOutcome = {
  files: FileMap;
  summary: string;
  changed: string[];
  addedSection?: string;
  brandName?: string;
  accent?: string;
  radius?: number;
  mode?: "dark" | "light";
};
