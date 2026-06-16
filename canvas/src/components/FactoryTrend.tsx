import type { Quarter, TeslaData } from "../types";
import { factoryColor } from "../lib";

interface Props {
  quarters: Quarter[];
  data: TeslaData;
}

export default function FactoryTrend({ quarters, data }: Props) {
  const { meta } = data;
  const recent = quarters.slice(-12);

  return (
    <div className="cadence">
      <div className="head">
        <h2>Factory production (last 12 quarters)</h2>
        <div className="legend">
          {meta.factoryOrder.map((f) => (
            <span key={f}>
              <i style={{ background: factoryColor(f) }} />
              {f}
            </span>
          ))}
        </div>
      </div>
      <div className="bars quarterly factory">
        {recent.map((q) => (
          <div
            key={q.quarter}
            className="barcol"
            title={q.quarter}
          >
            <div className="barstack stacked" style={{ height: "100px" }}>
              {meta.factoryOrder
                .filter((f) => q.factories[f as keyof typeof q.factories])
                .map((f) => {
                  const v = q.factories[f as keyof typeof q.factories];
                  return (
                    <div
                      key={f}
                      className="barseg"
                      style={{
                        flex: v,
                        background: factoryColor(f),
                      }}
                    />
                  );
                })}
            </div>
            <span className="yr">{q.quarter.replace(/^\d{4} /, "")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
