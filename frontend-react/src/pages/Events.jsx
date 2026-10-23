import { useState } from "react";
import Layout from "../components/Layout";
import EventLinks from "../components/EventLinks";
import Icon from "../components/Icon";
import SmartLink from "../components/SmartLink";
import { Eyebrow } from "../components/ui";
import { asset } from "../lib/asset";
import {
  dateRange,
  events,
  groupByTerm,
  hasEventLinks,
  journeyPage as page,
  kinds,
  withAlpha,
} from "../lib/events";
import { pageOn } from "../lib/features";

// Shared timeline grid: the line, then the cards. From md up a date column
// comes first; on phones the date moves into the card.
const ROW = "grid grid-cols-[24px_minmax(0,1fr)] gap-x-3 md:grid-cols-[84px_32px_minmax(0,1fr)]";

function FilterBar({ filter, setFilter }) {
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

// A small card: kind, series, name and any guest speaker, judge or co-host.
// The rest unfolds on hover, keyboard focus or a tap (see .ev in index.css).
function TimelineEvent({ event }) {
  const [open, setOpen] = useState(false);
  const { kind } = event;
  const showFooter = event.attendance || hasEventLinks(event.links);
  const partner = event.collaborator;
  return (
    <div className={`${ROW} items-start`}>
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
            <div className="ev-panel flex flex-col gap-1.5 border-t border-line-soft px-4 pt-3 pb-3.5">
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
          </div>
        </div>
      </article>
    </div>
  );
}

export default function Events() {
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? events : events.filter((e) => e.type === filter);
  const terms = groupByTerm(visible);
  const seriesCount = new Set(events.map((e) => e.series).filter(Boolean)).size;
  const termCount = new Set(events.map((e) => e.term).filter(Boolean)).size;
  const range = dateRange();

  return (
    <Layout>
      <div className="tl-progress" aria-hidden="true" />

      <section aria-labelledby="page-title" className="bg-ink text-on-ink">
        <div className="mx-auto flex max-w-300 flex-col gap-3 px-6 pt-10 pb-8">
          <Eyebrow tone="onInk">Our journey{range && ` · ${range}`}</Eyebrow>
          <h1
            id="page-title"
            className="max-w-[22em] text-[clamp(28px,3.4vw,40px)] leading-[1.1] font-semibold tracking-[-0.02em]"
          >
            {page.title ?? "Our Journey"}
          </h1>
          {page.lede && <p className="max-w-[44em] text-[15px] leading-relaxed text-on-ink-soft">{page.lede}</p>}
          <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[13px] text-on-ink-muted">
            {[
              ["events", events.length],
              ["series", seriesCount],
              ["academic terms", termCount],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-row-reverse items-baseline gap-1.5">
                <dt>{label}</dt>
                <dd className="text-lg font-medium text-on-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <FilterBar filter={filter} setFilter={setFilter} />

      <section aria-label="Timeline of events" className="bg-paper">
        <div className="tl-wrap relative mx-auto max-w-240 px-6 pt-6 pb-16">
          <div
            aria-hidden="true"
            className="tl-line absolute top-0 bottom-0 left-[35px] w-0.5 bg-line md:left-[135px]"
          >
            <div className="tl-fill absolute inset-0 bg-ink" />
          </div>

          {page.upNext && pageOn("/events/upcomings") && (
            <div className={`${ROW} relative items-center pb-3`}>
              <span className="hidden md:block" />
              <span
                aria-hidden="true"
                className="size-4 justify-self-center rounded-full bg-accent shadow-[0_0_0_5px_#fff]"
              />
              <SmartLink
                href="/events/upcomings"
                className="inline-flex min-h-11 items-center gap-2 justify-self-start font-mono text-xs font-medium uppercase tracking-[0.06em] text-accent hover:text-accent-strong"
              >
                {page.upNext}
                <Icon name="arrowRight" />
              </SmartLink>
            </div>
          )}

          {terms.length === 0 && (
            <p className="relative py-12 text-center text-muted">No events of this kind yet.</p>
          )}

          {terms.map((group) => (
            <section key={group.term} aria-label={group.label} className="relative flex flex-col gap-2.5 pb-6">
              <div className={`${ROW} sticky top-13 z-5 items-center bg-paper py-2`}>
                <span className="hidden md:block" />
                <span
                  aria-hidden="true"
                  className="size-3 justify-self-center rounded-full border-[3px] border-ink bg-paper"
                />
                <h2 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[17px] leading-tight font-semibold tracking-[-0.01em]">
                  {group.label}
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
                    {group.items.length} {group.items.length === 1 ? "event" : "events"}
                  </span>
                </h2>
              </div>
              {group.items.map((event) => (
                <TimelineEvent key={`${event.name}-${event.sortKey}`} event={event} />
              ))}
            </section>
          ))}

          {page.beginning && filter === "all" && (
            <div className={`${ROW} relative items-start pt-1`}>
              <span className="hidden md:block" />
              <span
                aria-hidden="true"
                className="flex size-8 items-center justify-center justify-self-center rounded-full bg-ink font-mono text-xs text-on-ink shadow-[0_0_0_5px_#fff]"
              >
                χ²
              </span>
              <div className="flex flex-col gap-1 pt-1">
                <h2 className="text-[17px] leading-tight font-semibold tracking-[-0.01em]">
                  {page.beginning.title}
                </h2>
                {page.beginning.text && (
                  <p className="max-w-[40em] text-sm leading-relaxed text-muted">{page.beginning.text}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
