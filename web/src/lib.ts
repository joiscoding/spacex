import type { Launch } from "./types";

export const VEHICLE_COLORS: Record<string, string> = {
  "Falcon 9": "#ffffff",
  Starship: "#666666",
  "Falcon Heavy": "#aaaaaa",
  "Falcon 1": "#333333",
};

export const VEHICLE_ORDER = ["Falcon 9", "Falcon Heavy", "Starship", "Falcon 1"];

export function vehicleColor(v: string): string {
  return VEHICLE_COLORS[v] ?? "#444444";
}

const MISSION_LABELS: Record<string, string> = {
  starlink: "Starlink",
  commercialSatellite: "Commercial",
  resupply: "Resupply",
  nssl: "NSSL",
  rideshare: "Rideshare",
  hsf: "Human Spaceflight",
  science: "Science",
  starship: "Starship",
};

export function missionLabel(m: string): string {
  return MISSION_LABELS[m] ?? (m || "Other");
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
