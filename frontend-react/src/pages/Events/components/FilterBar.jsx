import { useEffect, useRef } from "react";
import Icon from "@/components/Icon";
import { events, kinds } from "@/lib/events";

export default function FilterBar({ filter, setFilter, series, setSeries, onHeightChange }) {
  const barRef = useRef(null);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      onHeightChange(Math.ceil(entry.target.getBoundingClientRect().height));
    });
    observer.observe(barRef.current);
    return () => observer.disconnect();
  }, [onHeightChange]);

  const showSeries = filter === "Academic Talks" || filter === "Contests";
  const seriesOptions = [...new Map(
    events
      .filter((event) => event.type === filter && event.series)
      .map((event) => [event.seriesFilter, event.seriesFilterLabel])
  )].sort((a, b) => a[1].localeCompare(b[1]));
  const options = [
    { type: "all", label: "All events", count: events.length },
    ...kinds.map((k) => ({
      type: k.type,
      label: k.plural,
      color: k.color,
      count: events.filter((e) => e.type === k.type).length,
    })),
  ];
  return (
    <div ref={barRef} className="sticky top-0 z-20 border-b border-line bg-paper/95">
      <div
        role="group"
        aria-label="Filter events by format"
        className="mx-auto flex max-w-300 flex-wrap items-center gap-2 px-6 py-2"
      >
        {options.map((o) => {
          const active = o.type === filter;
          return (
            <div key={o.type} className="flex max-w-full flex-wrap items-center gap-2">
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(o.type)}
                className={`inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-xs font-semibold ${
                  active ? "border-ink bg-ink text-white" : "border-field bg-paper text-ink hover:border-ink"
                }`}
              >
                {o.color && (
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full"
                    style={{ background: o.color, boxShadow: active ? "0 0 0 2px #fff" : "none" }}
                  />
                )}
                {o.label}
                <span className="font-mono font-medium opacity-75">{o.count}</span>
              </button>
              {active && showSeries && (
                <div className="relative min-w-0 max-w-full">
                  <select
                    aria-label={`Filter ${o.label.toLowerCase()} by series`}
                    value={series}
                    onChange={(event) => setSeries(event.target.value)}
                    className="min-h-9 w-full max-w-64 cursor-pointer appearance-none truncate rounded-full border border-accent bg-accent-soft py-2 pr-9 pl-3.5 text-xs font-semibold text-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <option value="all">All series</option>
                    {seriesOptions.map(([code, label]) => (
                      <option key={code} value={code}>{label}</option>
                    ))}
                  </select>
                  <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-accent-strong" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
