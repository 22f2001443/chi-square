import { useState } from "react";
import EventLinks from "@/components/EventLinks";
import Icon from "@/components/Icon";
import { asset } from "@/lib/asset";
import { eventPoster } from "@/lib/eventPoster";
import { hasEventLinks, withAlpha } from "@/lib/events";
import TimelineRow from "./TimelineRow";

// A small card: kind, series, name and any guest speaker, judge or co-host.
// The rest unfolds on hover, keyboard focus or a tap (see .ev in index.css).
export default function TimelineEvent({ event }) {
  const [open, setOpen] = useState(false);
  const poster = eventPoster(event);
  const [failedPoster, setFailedPoster] = useState(null);
  const showPoster = poster && failedPoster !== poster;
  const { kind } = event;
  const showFooter = event.attendance || hasEventLinks(event.links);
  const partner = event.collaborator;
  return (
    <TimelineRow className="items-start">
      <div className="tl-date hidden flex-col items-end gap-0.5 pt-3 text-right md:flex">
        <span className="font-mono text-lg leading-none font-medium tracking-[-0.02em]">
          {event.day ?? "—"}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
          {event.monthYear ?? event.duration ?? event.termLabel}
        </span>
      </div>
      <div
        aria-hidden="true"
        className="tl-node mt-3.5 size-3 justify-self-center rounded-full"
        style={{
          background: kind.color,
          boxShadow: `0 0 0 3px #fff, 0 0 0 6px ${withAlpha(kind.color, 0.25)}`,
        }}
      />
      <article data-open={open || undefined} className="tl-card ev relative rounded-xl border border-line bg-paper">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left"
        >
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="flex flex-wrap gap-x-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
              <span className="md:hidden">{event.date ? event.dateLabel : event.duration ?? event.termLabel} ·</span>
              {kind.label}
              {event.series && <span className="hidden md:inline">· {event.series}</span>}
            </span>
            <span className="text-[15px] leading-snug font-semibold tracking-[-0.01em]">{event.name}</span>
            {[
              ["Speaker", event.guestSpeaker],
              ["Judge", event.judge],
              ["Co-host", event.coHost],
            ].map(
              ([label, who]) =>
                who && (
                  <span key={label} className="text-[13px] leading-snug text-body">
                    <strong className="font-semibold">{label}:</strong> {who}
                  </span>
                ),
            )}
          </span>
          <Icon name="chevronDown" size={18} className="ev-chevron mt-2.5 shrink-0 text-muted" />
        </button>
        <div className="ev-more">
          <div>
            <div className={`ev-panel grid grid-cols-1 gap-4 border-t border-line-soft px-4 pt-3 pb-3.5 ${showPoster ? "md:grid-cols-[minmax(0,1fr)_minmax(0,var(--ev-poster))]" : ""}`}>
              <div className="flex min-w-0 flex-col gap-1.5">
                {event.seriesLabel && <p className="text-[13px] text-muted">{event.seriesLabel}</p>}
                {event.topic && <p className="text-sm leading-relaxed text-body">{event.topic}</p>}
                {event.hosts.length > 0 && (
                  <p className="text-sm leading-relaxed text-body">
                    <strong className="font-semibold">Hosted by</strong> {event.hosts.join(", ")}
                  </p>
                )}
                {showFooter && (
                  <div className="flex flex-wrap items-center gap-x-5">
                    {event.attendance && (
                      <span className="rounded-full bg-surface px-2.5 py-1 font-mono text-xs text-body">
                        {event.attendance}
                      </span>
                    )}
                    <EventLinks links={event.links} />
                  </div>
                )}
                {partner && (
                  <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
                    In collaboration with
                    {partner.logo && (
                      <img src={asset(partner.logo)} alt="" className="block size-6 rounded-full bg-ink" />
                    )}
                    <strong className="font-semibold text-ink">{partner.name}</strong>
                  </p>
                )}
              </div>
              {showPoster && (
                <a href={poster} target="_blank" rel="noopener noreferrer" className="block min-w-0 self-start rounded-lg">
                  <img
                    src={poster}
                    alt={`Poster for ${event.name}`}
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailedPoster(poster)}
                    className="max-h-96 w-full rounded-lg bg-surface object-contain"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </TimelineRow>
  );
}
