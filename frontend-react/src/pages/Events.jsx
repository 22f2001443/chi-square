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

// Shared timeline grid: a date column, the line, then the cards. On phones
// the line moves to the left edge and the date sits above each card.
const ROW = "grid grid-cols-[24px_minmax(0,1fr)] gap-x-4 md:grid-cols-[120px_40px_minmax(0,1fr)]";

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
        className="mx-auto flex max-w-240 gap-2 overflow-x-auto px-6 py-3"
      >
        {options.map((o) => {
          const active = o.type === filter;
          return (
            <button
              key={o.type}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(o.type)}
              className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold ${
                active ? "border-ink bg-ink text-white" : "border-field bg-paper text-ink hover:border-ink"
              }`}
            >
              {o.color && (
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full"
                  style={{ background: o.color, boxShadow: active ? "0 0 0 2px #fff" : "none" }}
                />
              )}
              {o.label}
              <span className="font-mono text-xs font-medium opacity-75">{o.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TimelineEvent({ event }) {
  const { kind } = event;
  const showFooter = event.attendance || hasEventLinks(event.links);
  return (
    <div className={`${ROW} items-start gap-y-2`}>
      <div className="tl-date col-start-2 row-start-1 flex items-baseline gap-2 md:col-start-1 md:flex-col md:items-end md:gap-0.5 md:pt-5 md:text-right">
        <span className="font-mono text-[30px] leading-none font-medium tracking-[-0.02em]">
          {event.day ?? "—"}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
          {event.monthYear ?? event.duration ?? event.term}
        </span>
      </div>
      <div
        aria-hidden="true"
        className="tl-node col-start-1 row-span-2 row-start-1 mt-1.5 size-4 justify-self-center rounded-full md:col-start-2 md:row-span-1 md:mt-6"
        style={{
          background: kind.color,
          boxShadow: `0 0 0 4px #fff, 0 0 0 7px ${withAlpha(kind.color, 0.25)}`,
        }}
      />
      <article className="tl-card col-start-2 row-start-2 flex flex-col gap-2.5 rounded-[14px] border border-line bg-paper px-6 py-5.5 md:col-start-3 md:row-start-1">
        <p className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.06em] text-muted">
          <span className="size-2 rounded-full" style={{ background: kind.color }} />
          {kind.label}
          {event.series && <> · {event.series}</>}
        </p>
        <h3 className="text-[21px] leading-snug font-semibold tracking-[-0.01em]">{event.name}</h3>
        {event.seriesLabel && <p className="text-sm text-muted">{event.seriesLabel}</p>}
        {event.topic && <p className="text-[15px] leading-relaxed text-body">{event.topic}</p>}
        {event.guestSpeaker && (
          <p className="text-[15px] leading-relaxed text-body">
            <strong className="font-semibold">Speaker:</strong> {event.guestSpeaker}
          </p>
        )}
        {event.hosts.length > 0 && (
          <p className="text-[15px] leading-relaxed text-body">
            <strong className="font-semibold">Hosted by</strong> {event.hosts.join(", ")}
          </p>
        )}
        {showFooter && (
          <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-line-soft pt-1.5">
            {event.attendance && (
              <span className="rounded-full bg-surface px-2.5 py-1 font-mono text-xs text-body">
                {event.attendance}
              </span>
            )}
            <EventLinks links={event.links} />
          </div>
        )}
        {event.collaborator && (
          <p className="mt-1 flex flex-wrap items-center justify-end gap-2.5 border-t border-line-soft pt-3.5 text-[13px] text-muted">
            In collaboration with
            {event.collaborator.logo && (
              <img
                src={asset(event.collaborator.logo)}
                alt=""
                className="block size-8 rounded-full bg-ink"
              />
            )}
            <strong className="font-semibold text-ink">{event.collaborator.name}</strong>
          </p>
        )}
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
        <div className="mx-auto flex max-w-300 flex-col gap-6 px-6 pt-24 pb-18">
          <Eyebrow tone="onInk">Our journey{range && ` · ${range}`}</Eyebrow>
          <h1
            id="page-title"
            className="max-w-[14em] text-[clamp(44px,6vw,80px)] leading-[1.02] font-semibold tracking-[-0.03em]"
          >
            {page.title ?? "Our Journey"}
          </h1>
          {page.lede && <p className="max-w-[40em] text-[19px] leading-relaxed text-on-ink-soft">{page.lede}</p>}
          <dl className="mt-4 flex flex-wrap gap-x-14 gap-y-6">
            {[
              ["Events", events.length],
              ["Series", seriesCount],
              ["Academic terms", termCount],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col-reverse gap-0.5">
                <dt className="text-sm text-on-ink-muted">{label}</dt>
                <dd className="font-mono text-[40px] font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          {page.scrollHint && (
            <p className="tl-hint mt-6 inline-flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-[0.08em] text-on-ink-muted">
              <Icon name="arrowDown" size={18} />
              {page.scrollHint}
            </p>
          )}
        </div>
      </section>

      <FilterBar filter={filter} setFilter={setFilter} />

      <section aria-label="Timeline of events" className="bg-paper">
        <div className="tl-wrap relative mx-auto max-w-240 px-6 pt-12 pb-30">
          <div
            aria-hidden="true"
            className="tl-line absolute top-0 bottom-0 left-[35px] w-0.5 bg-line md:left-[179px]"
          >
            <div className="tl-fill absolute inset-0 bg-ink" />
          </div>

          {page.upNext && (
            <div className={`${ROW} relative items-center pb-10`}>
              <span className="hidden md:block" />
              <span
                aria-hidden="true"
                className="col-start-1 size-5 justify-self-center rounded-full bg-accent shadow-[0_0_0_6px_#fff] md:col-start-2"
              />
              <SmartLink
                href="/events/upcomings"
                className="col-start-2 inline-flex min-h-11 items-center gap-2.5 justify-self-start font-mono text-[13px] font-medium uppercase tracking-[0.06em] text-accent hover:text-accent-strong md:col-start-3"
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
            <section key={group.term} aria-label={group.term} className="relative flex flex-col gap-7 pb-14">
              <div className={`${ROW} sticky top-17 z-5 items-center bg-paper py-3.5`}>
                <span className="hidden md:block" />
                <span
                  aria-hidden="true"
                  className="col-start-1 size-3.5 justify-self-center rounded-full border-4 border-ink bg-paper md:col-start-2"
                />
                <h2 className="col-start-2 flex flex-wrap items-baseline gap-x-3.5 gap-y-1 text-[26px] leading-tight font-semibold tracking-[-0.015em] md:col-start-3">
                  {group.term}
                  <span className="font-mono text-[13px] font-medium uppercase tracking-[0.06em] text-muted">
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
            <div className={`${ROW} relative items-start pt-2`}>
              <span className="hidden md:block" />
              <span
                aria-hidden="true"
                className="col-start-1 flex size-10 items-center justify-center justify-self-center rounded-full bg-ink font-mono text-[15px] text-on-ink shadow-[0_0_0_6px_#fff] md:col-start-2"
              >
                χ²
              </span>
              <div className="col-start-2 flex flex-col gap-2 pt-1.5 md:col-start-3">
                <h2 className="text-[26px] leading-tight font-semibold tracking-[-0.015em]">
                  {page.beginning.title}
                </h2>
                {page.beginning.text && (
                  <p className="max-w-[34em] leading-relaxed text-muted">{page.beginning.text}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
