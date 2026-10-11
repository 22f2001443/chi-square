import { useId, useState } from "react";
import Layout from "../components/Layout";
import Icon from "../components/Icon";
import { ArrowLink, ButtonLink, Container, PageHeader } from "../components/ui";
import upcoming from "../data/upcoming.yml";
import site from "../data/site.yml";
import seriesData from "../data/series.yml";
import { asset } from "../lib/asset";
import { events } from "../lib/events";

const DETAILS = [
  ["date", "Date"],
  ["time", "Time"],
  ["where", "Where"],
  ["speaker", "Speaker"],
];

function Tabs({ tabs }) {
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

function FeaturedEvent({ event }) {
  const series = seriesData[event.series];
  const details = DETAILS.filter(([key]) => event[key]);
  const tabs = (event.tabs ?? []).filter((t) => t?.label);
  return (
    <article className="flex flex-wrap overflow-hidden rounded-2xl border border-line">
      <div className="flex min-h-105 flex-[1_1_380px] flex-col justify-between gap-6 bg-ink p-6 text-on-ink">
        {event.series && (
          <span className="self-start rounded-full border border-ink-edge px-2.5 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-on-ink-link">
            {event.series}
          </span>
        )}
        {event.poster ? (
          <img src={asset(event.poster)} alt={`Poster: ${event.title}`} className="w-full rounded-lg object-contain" />
        ) : (
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[65px] leading-none font-medium tracking-[-0.03em]">χ²</span>
            {series && <span className="text-sm text-on-ink-muted">{series.name} · {series.topic}</span>}
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-[1.4_1_460px] flex-col gap-6 p-8">
        {event.status && (
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-accent-soft px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-accent-strong">
            <span className="size-2 rounded-full bg-accent" />
            {event.status}
          </span>
        )}
        <h2 className="text-[31px] leading-tight font-semibold tracking-[-0.02em]">{event.title}</h2>
        {details.length > 0 && (
          <dl className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-6 gap-y-4">
            {details.map(([key, label]) => (
              <div key={key} className="flex flex-col gap-1">
                <dt className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{label}</dt>
                <dd className="text-[15px] font-medium">{event[key]}</dd>
              </div>
            ))}
          </dl>
        )}
        {tabs.length > 0 && <Tabs tabs={tabs} />}
        {(event.registerLink || event.calendarLink) && (
          <div className="mt-auto flex flex-wrap gap-3">
            {event.registerLink && <ButtonLink href={event.registerLink}>Register</ButtonLink>}
            {event.calendarLink && (
              <ButtonLink href={event.calendarLink} variant="secondary">
                <Icon name="calendar" size={18} />
                Add to calendar
              </ButtonLink>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Upcomings() {
  const { page = {}, follow = {}, recent = {} } = upcoming;
  const scheduled = (upcoming.events ?? []).filter((e) => e?.title);
  const recentEvents = events.slice(0, recent.count ?? 3);

  return (
    <Layout>
      <PageHeader eyebrow={page.eyebrow} title={page.title ?? "Upcoming Events"} lede={page.lede} />

      {scheduled.length > 0 && (
        <section aria-label="Upcoming events" className="bg-paper">
          <Container className="flex flex-col gap-8 pt-6 pb-16">
            {scheduled.map((event) => (
              <FeaturedEvent key={event.title} event={event} />
            ))}
          </Container>
        </section>
      )}

      <section aria-labelledby="follow-title" className="bg-surface">
        <Container className="flex flex-wrap items-center justify-between gap-x-12 gap-y-6 py-12">
          <div className="flex flex-[1_1_420px] flex-col gap-2.5">
            <h2 id="follow-title" className="text-[25px] leading-tight font-semibold tracking-[-0.015em]">
              {scheduled.length > 0 ? follow.title : (follow.emptyTitle ?? follow.title)}
            </h2>
            {follow.text && <p className="leading-relaxed text-muted">{follow.text}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            {(site.socials ?? [])
              .filter((s) => s && s.label !== "GitHub")
              .map((s) => (
                <ButtonLink key={s.label} href={s.href} variant="secondary" className="bg-paper">
                  {s.label}
                </ButtonLink>
              ))}
          </div>
        </Container>
      </section>

      {recentEvents.length > 0 && (
        <section aria-labelledby="recent-title" className="bg-paper">
          <Container className="flex flex-col gap-8 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="recent-title" className="text-[29px] leading-tight font-semibold tracking-[-0.02em]">
                {recent.title}
              </h2>
              <ArrowLink href="/events">See our full journey</ArrowLink>
            </div>
            <ol className="border-t border-line">
              {recentEvents.map((e) => (
                <li
                  key={`${e.name}-${e.sortKey}`}
                  className="flex flex-wrap items-baseline gap-x-8 gap-y-2 border-b border-line py-6"
                >
                  <span className="flex-[0_0_140px] font-mono text-[13px] text-muted">{e.dateLabel}</span>
                  <span className="flex min-w-0 flex-[1_1_360px] flex-col gap-1">
                    <span className="text-base font-semibold">{e.name}</span>
                    {(e.guestSpeaker || e.hosts.length > 0) && (
                      <span className="text-sm text-muted">
                        {e.guestSpeaker ?? `Hosted by ${e.hosts.join(", ")}`}
                      </span>
                    )}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-surface px-2.5 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-body">
                    <span className="size-2 rounded-full" style={{ background: e.kind.color }} />
                    {e.kind.label}
                  </span>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}
    </Layout>
  );
}
