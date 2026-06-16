import type { Launch } from "../types";
import { fallbackImageForLaunch, fmtDate, missionLabel } from "../lib";

interface Props {
  launch: Launch;
  onOpen: (l: Launch) => void;
}

export default function LaunchCard({ launch, onOpen }: Props) {
  const img = launch.images[0]?.url;
  const fallback = fallbackImageForLaunch(launch);
  return (
    <div className="card" onClick={() => onOpen(launch)}>
      <div className="thumb">
        <img
          src={img ?? fallback}
          alt={img ? launch.title : `${launch.title} placeholder`}
          loading="lazy"
          decoding="async"
          className={img ? "" : "asset-fallback"}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallback;
            event.currentTarget.classList.add("asset-fallback");
          }}
        />
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
