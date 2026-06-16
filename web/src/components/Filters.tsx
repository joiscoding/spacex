import type { Launch } from "../types";
import { counts, missionLabel } from "../lib";

export interface FilterState {
  search: string;
  vehicle: string | null;
  missionType: string | null;
  site: string | null;
  successOnly: boolean;
}

interface Props {
  all: Launch[];
  state: FilterState;
  setState: (s: FilterState) => void;
}

export default function Filters({ all, state, setState }: Props) {
  const vehicles = counts(all, "vehicle");
  const missions = counts(all, "missionType");
  const sites = counts(all, "site");

  const toggle = (key: "vehicle" | "missionType" | "site", val: string) =>
    setState({ ...state, [key]: state[key] === val ? null : val });

  const active =
    state.vehicle || state.missionType || state.site || state.search || state.successOnly;

  return (
    <aside className="filters">
      <input
        className="searchbox"
        placeholder="Search missions…"
        value={state.search}
        onChange={(e) => setState({ ...state, search: e.target.value })}
      />

      <div className="fgroup">
        <h3>Vehicle</h3>
        {vehicles.map(([v, c]) => (
          <button
            key={v}
            className={"chip" + (state.vehicle === v ? " on" : "")}
            onClick={() => toggle("vehicle", v)}
          >
            {v} <span className="ct">{c}</span>
          </button>
        ))}
      </div>

      <div className="fgroup">
        <h3>Mission type</h3>
        {missions.map(([v, c]) => (
          <button
            key={v}
            className={"chip" + (state.missionType === v ? " on" : "")}
            onClick={() => toggle("missionType", v)}
          >
            {missionLabel(v)} <span className="ct">{c}</span>
          </button>
        ))}
      </div>

      <div className="fgroup">
        <h3>Launch site</h3>
        {sites.map(([v, c]) => (
          <button
            key={v}
            className={"chip" + (state.site === v ? " on" : "")}
            onClick={() => toggle("site", v)}
          >
            {v} <span className="ct">{c}</span>
          </button>
        ))}
      </div>

      <div className="fgroup">
        <h3>Outcome</h3>
        <button
          className={"chip" + (state.successOnly ? " on" : "")}
          onClick={() => setState({ ...state, successOnly: !state.successOnly })}
        >
          Successful only
        </button>
      </div>

      {active && (
        <button
          className="clearbtn"
          onClick={() =>
            setState({
              search: "",
              vehicle: null,
              missionType: null,
              site: null,
              successOnly: false,
            })
          }
        >
          Clear all filters
        </button>
      )}
    </aside>
  );
}
