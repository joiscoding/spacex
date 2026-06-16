import { useMemo } from "react";
import type { Launch } from "../types";
import { MISSION_TYPE_ORDER, missionLabel, missionTypeColor } from "../lib";

const CHART_HEIGHT = 168;

interface Props {
  launches: Launch[];
  activeYear: string | null;
  onYear: (y: string | null) => void;
}

export default function CadenceChart({ launches, activeYear, onYear }: Props) {
  const { years, byYear, max } = useMemo(() => {
    const byYear = new Map<string, Map<string, number>>();
    for (const l of launches) {
      if (!l.year) continue;
      if (!byYear.has(l.year)) byYear.set(l.year, new Map());
      const m = byYear.get(l.year)!;
      const missionType = l.missionType || "other";
      m.set(missionType, (m.get(missionType) ?? 0) + 1);
    }
    const years = [...byYear.keys()].sort();
    let max = 1;
    for (const m of byYear.values()) {
      const tot = [...m.values()].reduce((a, b) => a + b, 0);
      if (tot > max) max = tot;
    }
    return { years, byYear, max };
  }, [launches]);

  return (
    <div className="cadence">
      <div className="head">
        <h2>Launch cadence by mission type</h2>
        <div className="legend">
          {MISSION_TYPE_ORDER.map((m) => (
            <span key={m}>
              <i style={{ background: missionTypeColor(m) }} />
              {missionLabel(m)}
            </span>
          ))}
        </div>
      </div>
      <div className="bars">
        {years.map((y) => {
          const m = byYear.get(y)!;
          const total = [...m.values()].reduce((a, b) => a + b, 0);
          return (
            <div
              key={y}
              className={"barcol" + (activeYear === y ? " active" : "")}
              onClick={() => onYear(activeYear === y ? null : y)}
              title={`${y}: ${total} launches by mission type`}
            >
              <div className="barstack" style={{ height: `${(total / max) * CHART_HEIGHT}px` }}>
                {MISSION_TYPE_ORDER.filter((type) => m.get(type)).map((type) => (
                  <div
                    key={type}
                    className="barseg"
                    title={`${missionLabel(type)}: ${m.get(type)} launches`}
                    style={{
                      flex: m.get(type)!,
                      background: missionTypeColor(type),
                    }}
                  />
                ))}
              </div>
              <span className="yr">{y.slice(2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
