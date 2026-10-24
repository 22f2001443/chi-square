import { useState } from "react";
import { asset } from "@/lib/asset";

// An event's poster, or its series code on ink when there is none (or it
// fails to load).
export default function PosterOrCode({ event }) {
  const [failed, setFailed] = useState(false);
  if (event.poster && !failed) {
    return (
      <img
        src={asset(event.poster)}
        alt={`Poster: ${event.name}`}
        onError={() => setFailed(true)}
        className="block h-60 w-full bg-surface object-cover object-top"
      />
    );
  }
  return (
    <div className="flex h-60 flex-col justify-end gap-1.5 bg-ink p-6 text-on-ink">
      <span className="font-mono text-[43px] font-medium tracking-[-0.02em]">{event.series}</span>
      <span className="font-mono text-xs uppercase tracking-[0.08em] text-on-ink-muted">
        {event.seriesLabel}
      </span>
    </div>
  );
}
