import type { Quarter } from "../types";
import { fmtFull, pctChange } from "../lib";

interface Props {
  quarter: Quarter;
  prior: Quarter | null;
  onOpen: (q: Quarter) => void;
  selected: boolean;
}

export default function QuarterCard({ quarter, prior, onOpen, selected }: Props) {
  const prodYoY = prior ? pctChange(quarter.production, prior.production) : null;
  const delYoY = prior ? pctChange(quarter.deliveries, prior.deliveries) : null;

  return (
    <div
      className={"card" + (selected ? " selected" : "")}
      onClick={() => onOpen(quarter)}
    >
      <div className="cardbody">
        <div className="ttl">{quarter.quarter}</div>
        <div className="metrics">
          <div className="metric">
            <span className="metriclbl">Production</span>
            <span className="metricval">{fmtFull(quarter.production)}</span>
            {prodYoY !== null && (
              <span className={"metricchg" + (prodYoY >= 0 ? " up" : " down")}>
                {prodYoY >= 0 ? "+" : ""}{prodYoY}% YoY
              </span>
            )}
          </div>
          <div className="metric">
            <span className="metriclbl">Deliveries</span>
            <span className="metricval">{fmtFull(quarter.deliveries)}</span>
            {delYoY !== null && (
              <span className={"metricchg" + (delYoY >= 0 ? " up" : " down")}>
                {delYoY >= 0 ? "+" : ""}{delYoY}% YoY
              </span>
            )}
          </div>
          <div className="metric">
            <span className="metriclbl">Inventory Δ</span>
            <span className="metricval">
              {quarter.inventoryDelta >= 0 ? "+" : ""}{fmtFull(quarter.inventoryDelta)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
