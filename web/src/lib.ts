import type { Launch } from "./types";

export const MISSION_TYPE_ORDER = [
  "starlink",
  "commercialSatellite",
  "resupply",
  "nssl",
  "rideshare",
  "hsf",
  "science",
  "starship",
  "other",
];

export const MISSION_TYPE_COLORS: Record<string, string> = {
  starlink: "#f5f5f5",
  commercialSatellite: "#d9d9d9",
  resupply: "#bfbfbf",
  nssl: "#a6a6a6",
  rideshare: "#8c8c8c",
  hsf: "#737373",
  science: "#5a5a5a",
  starship: "#424242",
  other: "#2f2f2f",
};

const MISSION_LABELS: Record<string, string> = {
  starlink: "Starlink",
  commercialSatellite: "Commercial",
  resupply: "Resupply",
  nssl: "NSSL",
  rideshare: "Rideshare",
  hsf: "Human Spaceflight",
  science: "Science",
  starship: "Starship",
  other: "Other",
};

export function missionLabel(m: string): string {
  return MISSION_LABELS[m] ?? (m || "Other");
}

export function missionTypeColor(m: string): string {
  return MISSION_TYPE_COLORS[m] ?? "#303030";
}

export function fallbackImageForLaunch(launch: Pick<Launch, "vehicle" | "missionType">): string {
  if (launch.vehicle === "Starship" || launch.missionType === "starship") {
    return "/assets/thumbnail-placeholder-starship.svg";
  }
  return "/assets/thumbnail-placeholder-orbit.svg";
}

export function fmtDate(d: string): string {
  if (!d) return "TBD";
  const dt = new Date(d + "T00:00:00");
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function counts(launches: Launch[], key: keyof Launch): [string, number][] {
  const m = new Map<string, number>();
  for (const l of launches) {
    const k = String(l[key] || "—");
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}
