import { useState } from "react";
import { eventPoster } from "@/lib/eventPoster";

// An event's poster, or its series code on ink when there is none (or it
// fails to load).
export default function PosterOrCode({ event }) {
  const poster = eventPoster(event);
  const [failedPoster, setFailedPoster] = useState(null);
  if (poster && failedPoster !== poster) {
    return (
      <img
        src={poster}
        alt={`Poster: ${event.name}`}
        onError={() => setFailedPoster(poster)}
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
