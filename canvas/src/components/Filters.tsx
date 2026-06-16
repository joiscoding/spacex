import type { TeslaData } from "../types";

interface FilterState {
  year: number | null;
}

interface Props {
  data: TeslaData;
  state: FilterState;
  setState: (s: FilterState) => void;
}

export default function Filters({ data, state, setState }: Props) {
  const years = [...new Set(data.quarters.map((q) => q.year))].sort();

  return (
    <aside className="filters">
      <div className="fgroup">
        <h3>Year</h3>
        {years.map((y) => (
          <button
            key={y}
            className={"chip" + (state.year === y ? " on" : "")}
            onClick={() => setState({ year: state.year === y ? null : y })}
          >
            {y}
          </button>
        ))}
      </div>
      {state.year && (
        <button className="clearbtn" onClick={() => setState({ year: null })}>
          Clear year filter
        </button>
      )}
    </aside>
  );
}

export type { FilterState };
