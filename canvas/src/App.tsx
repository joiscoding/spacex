import { useEffect, useMemo, useState } from "react";
import type { Quarter, TeslaData } from "./types";
import ProductionChart from "./components/ProductionChart";
import QuarterlyChart from "./components/QuarterlyChart";
import FactoryTrend from "./components/FactoryTrend";
import Filters, { type FilterState } from "./components/Filters";
import QuarterCard from "./components/QuarterCard";
import QuarterDrawer from "./components/QuarterDrawer";
import BreakdownChart from "./components/BreakdownChart";
import { fmt } from "./lib";

const EMPTY: FilterState = { year: null };

export default function App() {
  const [data, setData] = useState<TeslaData | null>(null);
  const [filters, setFilters] = useState<FilterState>(EMPTY);
  const [year, setYear] = useState<number | null>(null);
  const [selected, setSelected] = useState<Quarter | null>(null);
  const [drawer, setDrawer] = useState<Quarter | null>(null);

  useEffect(() => {
    fetch("/tesla.json")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    const y = year ?? filters.year;
    if (!y) return data.quarters;
    return data.quarters.filter((q) => q.year === y);
  }, [data, year, filters.year]);

  const priorMap = useMemo(() => {
    if (!data) return new Map<string, Quarter | null>();
    const m = new Map<string, Quarter | null>();
    for (let i = 0; i < data.quarters.length; i++) {
      const q = data.quarters[i];
      const prior = data.quarters.find(
        (x, j) => j < i && x.year === q.year - 1 && x.quarter.slice(-1) === q.quarter.slice(-1)
      );
      m.set(q.quarter, prior ?? null);
    }
    return m;
  }, [data]);

  const focus = selected ?? filtered[filtered.length - 1] ?? null;

  if (!data) {
    return <div className="loading">Loading Tesla production data…</div>;
  }

  const { meta } = data;
  const activeYear = year ?? filters.year;

  return (
    <div className="app">
      <header className="masthead">
        <div>
          <h1>
            Tesla <span>Production</span> Canvas
          </h1>
          <p>
            {meta.quarterCount} quarters · {meta.firstQuarter} – {meta.lastQuarter}
          </p>
        </div>
        <div className="stats">
          <div className="stat">
            <div className="num">{fmt(meta.totalProduction)}</div>
            <div className="lbl">Total produced</div>
          </div>
          <div className="stat">
            <div className="num">{fmt(meta.totalDeliveries)}</div>
            <div className="lbl">Total delivered</div>
          </div>
          <div className="stat">
            <div className="num">{fmt(meta.latestProduction)}</div>
            <div className="lbl">Latest quarter prod</div>
          </div>
          <div className="stat">
            <div className="num">{fmt(meta.latestDeliveries)}</div>
            <div className="lbl">Latest quarter del</div>
          </div>
        </div>
      </header>

      <ProductionChart data={data} activeYear={year} onYear={setYear} />

      <FactoryTrend quarters={data.quarters} data={data} />

      <div className="layout">
        <Filters data={data} state={filters} setState={setFilters} />

        <main>
          <QuarterlyChart
            quarters={filtered}
            selected={selected}
            onSelect={(q) => {
              setSelected(q);
              setDrawer(q);
            }}
          />

          {focus && (
            <div className="focusbreakdowns">
              <BreakdownChart quarter={focus} data={data} kind="models" />
              <BreakdownChart quarter={focus} data={data} kind="factories" />
            </div>
          )}

          <div className="gridhead">
            <span>
              {filtered.length} {filtered.length === 1 ? "quarter" : "quarters"}
              {activeYear ? ` in ${activeYear}` : ""}
            </span>
            {(year || filters.year) && (
              <button
                className="chip"
                onClick={() => {
                  setYear(null);
                  setFilters(EMPTY);
                }}
              >
                Clear filters ×
              </button>
            )}
          </div>
          <div className="grid">
            {filtered.length === 0 ? (
              <div className="empty">No quarters match these filters.</div>
            ) : (
              filtered
                .slice()
                .reverse()
                .map((q) => (
                  <QuarterCard
                    key={q.quarter}
                    quarter={q}
                    prior={priorMap.get(q.quarter) ?? null}
                    onOpen={setDrawer}
                    selected={selected?.quarter === q.quarter}
                  />
                ))
            )}
          </div>
        </main>
      </div>

      {drawer && (
        <QuarterDrawer
          quarter={drawer}
          prior={priorMap.get(drawer.quarter) ?? null}
          data={data}
          onClose={() => setDrawer(null)}
        />
      )}
    </div>
  );
}
