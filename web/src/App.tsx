import { useEffect, useMemo, useState } from "react";
import type { Launch } from "./types";
import CadenceChart from "./components/CadenceChart";
import Filters, { type FilterState } from "./components/Filters";
import LaunchCard from "./components/LaunchCard";
import DetailDrawer from "./components/DetailDrawer";

const EMPTY: FilterState = {
  search: "",
  vehicle: null,
  missionType: null,
  site: null,
  successOnly: false,
};

const PAGE_SIZE = 48;

export default function App() {
  const [all, setAll] = useState<Launch[] | null>(null);
  const [filters, setFilters] = useState<FilterState>(EMPTY);
  const [year, setYear] = useState<string | null>(null);
  const [open, setOpen] = useState<Launch | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    fetch("/launches.json")
      .then((r) => r.json())
      .then(setAll)
      .catch(() => setAll([]));
  }, []);

  const filtered = useMemo(() => {
    if (!all) return [];
    const q = filters.search.trim().toLowerCase();
    return all.filter((l) => {
      if (year && l.year !== year) return false;
      if (filters.vehicle && l.vehicle !== filters.vehicle) return false;
      if (filters.missionType && l.missionType !== filters.missionType) return false;
      if (filters.site && l.site !== filters.site) return false;
      if (filters.successOnly && !(l.status === "final" && l.success)) return false;
      if (q && !(`${l.title} ${l.description}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [all, filters, year]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters, year]);

  const visibleLaunches = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  const stats = useMemo(() => {
    if (!all) return null;
    const finals = all.filter((l) => l.status === "final");
    const ok = finals.filter((l) => l.success).length;
    return {
      total: all.length,
      rate: finals.length ? Math.round((ok / finals.length) * 1000) / 10 : 0,
      starlink: all.filter((l) => l.missionType === "starlink").length,
      crewed: all.filter((l) => l.astronauts).length,
    };
  }, [all]);

  if (!all) return <div className="loading">Loading launch data…</div>;

  return (
    <div className="app">
      <header className="masthead">
        <div>
          <h1>
            Space<span>X</span> Launch Explorer
          </h1>
          <p>{stats!.total} missions · 2006–2026 · Falcon, Falcon Heavy & Starship</p>
        </div>
        <div className="stats">
          <div className="stat">
            <div className="num">{stats!.total}</div>
            <div className="lbl">Launches</div>
          </div>
          <div className="stat">
            <div className="num">{stats!.rate}%</div>
            <div className="lbl">Success</div>
          </div>
          <div className="stat">
            <div className="num">{stats!.starlink}</div>
            <div className="lbl">Starlink</div>
          </div>
          <div className="stat">
            <div className="num">{stats!.crewed}</div>
            <div className="lbl">Crewed</div>
          </div>
        </div>
      </header>

      <CadenceChart launches={all} activeYear={year} onYear={setYear} />

      <div className="layout">
        <Filters all={all} state={filters} setState={setFilters} />

        <main>
          <div className="gridhead">
            <span>
              Showing {visibleLaunches.length} of {filtered.length}{" "}
              {filtered.length === 1 ? "mission" : "missions"}
              {year ? ` in ${year}` : ""}
            </span>
            {year && (
              <button className="chip" onClick={() => setYear(null)}>
                Clear year {year} ×
              </button>
            )}
          </div>
          <div className="grid">
            {filtered.length === 0 ? (
              <div className="empty">No missions match these filters.</div>
            ) : (
              visibleLaunches.map((l) => (
                <LaunchCard key={l.id} launch={l} onOpen={setOpen} />
              ))
            )}
          </div>
          {visibleLaunches.length < filtered.length && (
            <button
              className="loadmore"
              onClick={() =>
                setVisibleCount((count) => Math.min(count + PAGE_SIZE, filtered.length))
              }
            >
              Load more missions
            </button>
          )}
        </main>
      </div>

      {open && <DetailDrawer launch={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
