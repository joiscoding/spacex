import { useMemo } from "react";
import type { Quarter } from "../types";
import { fmtFull } from "../lib";

interface Props {
  quarters: Quarter[];
  selected: Quarter | null;
  onSelect: (q: Quarter) => void;
}

export default function QuarterlyChart({ quarters, selected, onSelect }: Props) {
  const max = useMemo(
    () => Math.max(...quarters.map((q) => Math.max(q.production, q.deliveries)), 1),
    [quarters]
  );

  return (
    <div className="cadence">
      <div className="head">
        <h2>Quarterly cadence</h2>
        <div className="legend">
          <span><i style={{ background: "#ffffff" }} />Production</span>
          <span><i style={{ background: "#555555" }} />Deliveries</span>
        </div>
      </div>
      <div className="bars quarterly scroll">
        {quarters.map((q) => (
          <div
            key={q.quarter}
            className={"barcol" + (selected?.quarter === q.quarter ? " active" : "")}
            onClick={() => onSelect(q)}
            title={`${q.quarter}: ${fmtFull(q.production)} produced · ${fmtFull(q.deliveries)} delivered`}
          >
            <div className="barpair">
              <div
                className="barstack prod"
                style={{ height: `${(q.production / max) * 100}px` }}
              />
              <div
                className="barstack del"
                style={{ height: `${(q.deliveries / max) * 100}px` }}
              />
            </div>
            <span className="yr">{q.quarter.replace(/^\d{4} /, "")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
