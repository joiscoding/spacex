export const MODEL_COLORS: Record<string, string> = {
  "Model S/X": "#ffffff",
  "Model 3": "#888888",
  "Model Y": "#555555",
  Cybertruck: "#333333",
};

export const FACTORY_COLORS: Record<string, string> = {
  Fremont: "#ffffff",
  Shanghai: "#888888",
  Berlin: "#555555",
  Texas: "#333333",
};

export function modelColor(m: string): string {
  return MODEL_COLORS[m] ?? "#444444";
}

export function factoryColor(f: string): string {
  return FACTORY_COLORS[f] ?? "#444444";
}

export function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export function fmtFull(n: number): string {
  return n.toLocaleString("en-US");
}

export function pctChange(current: number, prior: number): number | null {
  if (!prior) return null;
  return Math.round(((current - prior) / prior) * 1000) / 10;
}

export function yoyQuarters(quarters: { quarter: string; year: number }[], idx: number): number | null {
  const q = quarters[idx];
  const prior = quarters.find(
    (x, i) => i < idx && x.year === q.year - 1 && x.quarter.endsWith(q.quarter.slice(-1))
  );
  return prior ? quarters.indexOf(prior) : null;
}
