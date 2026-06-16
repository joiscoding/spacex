import type { TeslaData } from "../types";
import { fmtFull } from "../lib";

interface Props {
  data: TeslaData;
  activeYear: number | null;
  onYear: (y: number | null) => void;
}

export default function ProductionChart({ data, activeYear, onYear }: Props) {
  const { annual, meta } = data;
  const max = Math.max(...annual.map((a) => Math.max(a.production, a.deliveries)), 1);

  return (
    <div className="cadence">
      <div className="head">
        <h2>Annual production & deliveries</h2>
        <div className="legend">
          <span><i style={{ background: "#ffffff" }} />Production</span>
          <span><i style={{ background: "#555555" }} />Deliveries</span>
        </div>
      </div>
      <div className="bars annual">
        {annual.map((a) => (
          <div
            key={a.year}
            className={"barcol" + (activeYear === a.year ? " active" : "")}
            onClick={() => onYear(activeYear === a.year ? null : a.year)}
            title={`${a.year}: ${fmtFull(a.production)} produced · ${fmtFull(a.deliveries)} delivered`}
          >
            <div className="barpair">
              <div
                className="barstack prod"
                style={{ height: `${(a.production / max) * 120}px` }}
              />
              <div
                className="barstack del"
                style={{ height: `${(a.deliveries / max) * 120}px` }}
              />
            </div>
            <span className="yr">{String(a.year).slice(2)}</span>
          </div>
        ))}
      </div>
      <p className="chartnote">
        {meta.firstQuarter} – {meta.lastQuarter} · click a year to filter quarters
      </p>
    </div>
  );
}
