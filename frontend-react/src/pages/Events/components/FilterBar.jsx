import { events, kinds } from "@/lib/events";

export default function FilterBar({ filter, setFilter }) {
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
    <div className="sticky top-0 z-20 border-b border-line bg-paper/95">
      <div
        role="group"
        aria-label="Filter events by format"
        className="mx-auto flex max-w-240 gap-2 overflow-x-auto px-6 py-2"
      >
        {options.map((o) => {
          const active = o.type === filter;
          return (
            <button
              key={o.type}
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
          );
        })}
      </div>
    </div>
  );
}
