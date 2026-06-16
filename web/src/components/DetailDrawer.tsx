import { useEffect, useState } from "react";
import type { Launch } from "../types";
import { fmtDate, missionLabel } from "../lib";

interface Props {
  launch: Launch;
  onClose: () => void;
}

const PHASE_ORDER = ["pre_launch", "launch", "ascent", "landing", "post_launch"];

function webcastUrl(l: Launch): string | null {
  if (!l.webcastId) return null;
  if (l.webcastPlatform === "youtube") return `https://www.youtube.com/watch?v=${l.webcastId}`;
  if (l.webcastPlatform === "x.com") return `https://x.com/i/broadcasts/${l.webcastId}`;
  return null;
}

export default function DetailDrawer({ launch, onClose }: Props) {
  const [sel, setSel] = useState(0);

  useEffect(() => {
    setSel(0);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [launch, onClose]);

  const hero = launch.images[sel]?.url;
  const url = webcastUrl(launch);

  const timeline = [...launch.timeline].sort((a, b) => {
    const pa = PHASE_ORDER.indexOf(a.phase);
    const pb = PHASE_ORDER.indexOf(b.phase);
    return pa - pb;
  });

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="drawer">
        <div className="hero">
          {hero ? (
            <img src={hero} alt={launch.title} />
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 56,
              }}
            >
              🚀
            </div>
          )}
          <button className="closebtn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="dcontent">
          <h2>{launch.title}</h2>
          <span className="date">
            {fmtDate(launch.launchDate)}
            {launch.launchTime ? ` · ${launch.launchTime}` : ""} · {launch.site || "—"}
          </span>

          <div className="dmeta">
            <span className="tag">{launch.vehicle}</span>
            <span className="tag">{missionLabel(launch.missionType)}</span>
            {launch.status === "final" ? (
              <span className={"tag " + (launch.success ? "ok" : "fail")}>
                {launch.success ? "Success" : "Failure"}
              </span>
            ) : (
              <span className="tag">{launch.status}</span>
            )}
            {launch.hasLanding && <span className="tag">Booster landing</span>}
          </div>

          {launch.images.length > 1 && (
            <div className="thumbs">
              {launch.images.map((im, i) => (
                <img
                  key={i}
                  src={im.url}
                  className={i === sel ? "sel" : ""}
                  onClick={() => setSel(i)}
                  alt=""
                />
              ))}
            </div>
          )}

          {launch.astronauts && (
            <div className="crew">
              <h3>Crew</h3>
              <div>{launch.astronauts}</div>
            </div>
          )}

          {launch.description && <p className="desc">{launch.description}</p>}

          {url && (
            <a className="webcast" href={url} target="_blank" rel="noreferrer">
              Watch the webcast →
            </a>
          )}

          {timeline.length > 0 && (
            <div className="tl">
              <h3>Countdown timeline</h3>
              {timeline.map((e, i) => (
                <div className="tlitem" key={i}>
                  <div>
                    <div className="tltime">{e.time || "—"}</div>
                    <div className="tlphase">{e.phase.replace("_", " ")}</div>
                  </div>
                  <div className="tldesc">{e.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
