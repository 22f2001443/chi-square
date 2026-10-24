import { useId, useState } from "react";

export default function Tabs({ tabs }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const current = tabs[active] ?? tabs[0];
  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" aria-label="Event information" className="flex flex-wrap gap-1 self-start rounded-[10px] bg-surface p-1">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            onClick={() => setActive(i)}
            className={`min-h-11 cursor-pointer rounded-lg px-4 text-[13px] font-semibold ${
              i === active ? "bg-paper text-ink shadow-[0_1px_2px_rgba(15,17,21,0.12)]" : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        className="leading-relaxed text-body"
      >
        {current?.content}
      </p>
    </div>
  );
}
