import type { Quarter, TeslaData } from "../types";
import BreakdownChart from "./BreakdownChart";
import { fmtFull, pctChange } from "../lib";

interface Props {
  quarter: Quarter;
  prior: Quarter | null;
  data: TeslaData;
  onClose: () => void;
}

export default function QuarterDrawer({ quarter, prior, data, onClose }: Props) {
  const prodYoY = prior ? pctChange(quarter.production, prior.production) : null;
  const delYoY = prior ? pctChange(quarter.deliveries, prior.deliveries) : null;

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="drawer">
        <button className="closebtn" onClick={onClose} aria-label="Close">×</button>
        <div className="dcontent">
          <h2>{quarter.quarter}</h2>
          <p className="drawersub">Quarterly production & delivery report</p>

          <div className="dmeta">
            <div className="dstat">
              <div className="dstatval">{fmtFull(quarter.production)}</div>
              <div className="dstatlbl">Production</div>
              {prodYoY !== null && (
                <div className={"dstatchg" + (prodYoY >= 0 ? " up" : " down")}>
                  {prodYoY >= 0 ? "+" : ""}{prodYoY}% vs prior year
                </div>
              )}
            </div>
            <div className="dstat">
              <div className="dstatval">{fmtFull(quarter.deliveries)}</div>
              <div className="dstatlbl">Deliveries</div>
              {delYoY !== null && (
                <div className={"dstatchg" + (delYoY >= 0 ? " up" : " down")}>
                  {delYoY >= 0 ? "+" : ""}{delYoY}% vs prior year
                </div>
              )}
            </div>
            <div className="dstat">
              <div className="dstatval">
                {quarter.inventoryDelta >= 0 ? "+" : ""}{fmtFull(quarter.inventoryDelta)}
              </div>
              <div className="dstatlbl">Inventory change</div>
              <div className="dstatnote">Production − deliveries</div>
            </div>
          </div>

          <div className="drawerbreakdowns">
            <BreakdownChart quarter={quarter} data={data} kind="models" />
            <BreakdownChart quarter={quarter} data={data} kind="factories" />
          </div>
        </div>
      </div>
    </>
  );
}
