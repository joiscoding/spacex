import { useMemo } from "react";
import type { Launch } from "../types";
import { VEHICLE_ORDER, vehicleColor } from "../lib";

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
      m.set(l.vehicle, (m.get(l.vehicle) ?? 0) + 1);
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
        <h2>Launch cadence by year</h2>
        <div className="legend">
          {VEHICLE_ORDER.map((v) => (
            <span key={v}>
              <i style={{ background: vehicleColor(v) }} />
              {v}
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
              title={`${y}: ${total} launches`}
            >
              <div className="barstack" style={{ height: `${(total / max) * 132}px` }}>
                {VEHICLE_ORDER.filter((v) => m.get(v)).map((v) => (
                  <div
                    key={v}
                    className="barseg"
                    style={{
                      flex: m.get(v)!,
                      background: vehicleColor(v),
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
