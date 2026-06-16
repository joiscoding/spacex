import type { Launch } from "../types";
import { fmtDate, missionLabel } from "../lib";

interface Props {
  launch: Launch;
  onOpen: (l: Launch) => void;
}

export default function LaunchCard({ launch, onOpen }: Props) {
  const img = launch.images[0]?.url;
  return (
    <div className="card" onClick={() => onOpen(launch)}>
      <div className={"thumb" + (img ? "" : " noimg")}>
        {img ? (
          <img src={img} alt={launch.title} loading="lazy" />
        ) : (
          <span>🚀</span>
        )}
        {launch.status !== "final" && (
          <span className={"badge " + launch.status}>{launch.status}</span>
        )}
      </div>
      <div className="cardbody">
        <div className="ttl">{launch.title}</div>
        <span className="date">
          {fmtDate(launch.launchDate)} · {launch.site || "—"}
        </span>
        <div className="meta">
          <span className="tag">{launch.vehicle}</span>
          <span className="tag">{missionLabel(launch.missionType)}</span>
          {launch.status === "final" && (
            <span className={"tag " + (launch.success ? "ok" : "fail")}>
              {launch.success ? "Success" : "Failure"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
