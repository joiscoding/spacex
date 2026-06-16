import type { Quarter, TeslaData } from "../types";
import { factoryColor, fmtFull, modelColor } from "../lib";

interface Props {
  quarter: Quarter;
  data: TeslaData;
  kind: "models" | "factories";
}

export default function BreakdownChart({ quarter, data, kind }: Props) {
  const keys = kind === "models" ? data.meta.modelOrder : data.meta.factoryOrder;
  const entries = keys.map((k) => ({
    key: k,
    val:
      kind === "models"
        ? quarter.models[k as keyof typeof quarter.models] ?? 0
        : quarter.factories[k as keyof typeof quarter.factories] ?? 0,
  }));
  const total = entries.reduce((s, e) => s + e.val, 0);
  const max = Math.max(...entries.map((e) => e.val), 1);
  const label = kind === "models" ? "Deliveries by model" : "Production by factory";
  const color = kind === "models" ? modelColor : factoryColor;

  return (
    <div className="breakdown">
      <div className="head">
        <h2>{label}</h2>
        <span className="sub">{quarter.quarter}</span>
      </div>
      <div className="bdrows">
        {entries.map((e) => (
          <div key={e.key} className="bdrow">
            <div className="bdlabel">
              <span>{e.key}</span>
              <span className="bdval">{fmtFull(e.val)}</span>
            </div>
            <div className="bdtrack">
              <div
                className="bdfill"
                style={{
                  width: `${(e.val / max) * 100}%`,
                  background: color(e.key),
                }}
              />
            </div>
            {total > 0 && (
              <span className="bdpct">{Math.round((e.val / total) * 100)}%</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
