import { useState } from "react";
import Layout from "../components/Layout";
import ChiCurves from "../components/ChiCurves";
import Icon from "../components/Icon";
import SmartLink from "../components/SmartLink";
import { Actions, ArrowLink, Container, Eyebrow } from "../components/ui";
import home from "../data/home.yml";
import site from "../data/site.yml";
import { asset } from "../lib/asset";
import { countByType, events, kinds } from "../lib/events";

// An event's poster, or its series code on ink when there is none (or it
// fails to load).
function PosterOrCode({ event }) {
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
      <span className="font-mono text-5xl font-medium tracking-[-0.02em]">{event.series}</span>
      <span className="font-mono text-xs uppercase tracking-[0.08em] text-on-ink-muted">
        {event.seriesLabel}
      </span>
    </div>
  );
}

function EventCard({ event }) {
  const who = event.guestSpeaker
    ? `Speaker: ${event.guestSpeaker}`
    : event.hosts.length
      ? `Hosted by ${event.hosts.join(", ")}`
      : "";
  const detail = [who, event.attendance].filter(Boolean).join(" · ");
  return (
    <article className="flex min-w-0 flex-[1_1_320px] flex-col overflow-hidden rounded-xl border border-line bg-paper">
      <PosterOrCode event={event} />
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">
          {event.dateLabel} · {event.kind.label}
        </p>
        <h3 className="text-xl leading-snug font-semibold">{event.name}</h3>
        {detail && <p className="text-[15px] leading-relaxed text-muted">{detail}</p>}
        {event.links?.youtube && (
          <SmartLink
            href={event.links.youtube}
            className="mt-auto inline-flex min-h-11 items-center gap-2 font-semibold text-accent hover:text-accent-strong"
          >
            <Icon name="play" size={18} />
            Watch the recording
          </SmartLink>
        )}
      </div>
    </article>
  );
}

export default function Home() {
  const { hero = {}, stats = [], latest = {}, formats = {}, partners = {}, join } = home;
  const latestEvents = events.slice(0, latest.count ?? 3);
  const kindByType = Object.fromEntries(kinds.map((k) => [k.type, k]));

  return (
    <Layout>
      <section aria-labelledby="hero-title" className="bg-ink text-on-ink">
        <Container className="flex flex-wrap items-center gap-14 pt-20 pb-16">
          <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-6">
            {hero.eyebrow && <Eyebrow tone="onInk">{hero.eyebrow}</Eyebrow>}
            <h1
              id="hero-title"
              className="text-[clamp(44px,6vw,76px)] leading-[1.02] font-semibold tracking-[-0.025em]"
            >
              {site.shortName ?? site.name}
              {site.tagline && (
                <span className="block font-medium text-on-ink-muted">{site.tagline}</span>
              )}
            </h1>
            {hero.lede && (
              <p className="max-w-[34em] text-[19px] leading-relaxed text-on-ink-soft">{hero.lede}</p>
            )}
            <div className="pt-2">
              <Actions actions={hero.actions} on="ink" />
            </div>
          </div>
          <ChiCurves className="flex-[1_1_420px]" />
        </Container>
        {stats.length > 0 && (
          <div className="border-t border-ink-line">
            <Container>
              <dl className="flex flex-wrap">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-[1_1_140px] flex-col-reverse gap-1 py-7">
                    <dt className="text-sm text-on-ink-muted">{stat.label}</dt>
                    <dd className="font-mono text-[44px] font-medium tracking-[-0.02em] text-on-ink">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Container>
          </div>
        )}
      </section>

      {latestEvents.length > 0 && (
        <section aria-labelledby="latest-title" className="bg-paper">
          <Container className="flex flex-col gap-10 py-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-2.5">
                {latest.eyebrow && <Eyebrow>{latest.eyebrow}</Eyebrow>}
                <h2 id="latest-title" className="text-[40px] leading-[1.1] font-semibold tracking-[-0.02em]">
                  {latest.title}
                </h2>
              </div>
              <ArrowLink href="/events">All {events.length} events</ArrowLink>
            </div>
            <div className="flex flex-wrap gap-6">
              {latestEvents.map((event) => (
                <EventCard key={`${event.name}-${event.sortKey}`} event={event} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {formats.items?.length > 0 && (
        <section aria-labelledby="formats-title" className="bg-surface">
          <Container className="flex flex-col gap-10 py-24">
            <div className="flex max-w-160 flex-col gap-2.5">
              {formats.eyebrow && <Eyebrow>{formats.eyebrow}</Eyebrow>}
              <h2 id="formats-title" className="text-[40px] leading-[1.1] font-semibold tracking-[-0.02em]">
                {formats.title}
              </h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {formats.items.filter(Boolean).map((item) => {
                const kind = kindByType[item.type];
                return (
                  <SmartLink
                    key={item.type}
                    href="/events"
                    className="flex min-w-0 flex-[1_1_250px] flex-col gap-3 rounded-xl border border-line bg-paper p-7 text-ink hover:border-field"
                  >
                    <span
                      className="font-mono text-[40px] font-medium tracking-[-0.02em]"
                      style={{ color: kind?.color }}
                    >
                      {String(countByType(item.type)).padStart(2, "0")}
                    </span>
                    <span className="text-[19px] font-semibold">{item.title ?? kind?.plural ?? item.type}</span>
                    {item.text && <span className="text-[15px] leading-relaxed text-muted">{item.text}</span>}
                  </SmartLink>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {site.collaborators?.length > 0 && (
        <section aria-labelledby="partners-title" className="border-t border-line bg-paper">
          <Container className="flex flex-wrap items-center gap-x-16 gap-y-6 py-14">
            <h2
              id="partners-title"
              className="font-mono text-[13px] font-medium uppercase tracking-widest text-muted"
            >
              {partners.title}
            </h2>
            <div className="flex flex-wrap gap-x-14 gap-y-6">
              {site.collaborators.filter(Boolean).map((c) => (
                <SmartLink key={c.name} href={c.href} className="flex flex-col gap-0.5 text-ink hover:text-accent">
                  <span className="text-xl font-semibold">{c.name}</span>
                  {c.role && <span className="text-sm text-muted">{c.role}</span>}
                </SmartLink>
              ))}
            </div>
          </Container>
        </section>
      )}

      {join && (
        <section aria-labelledby="join-title" className="bg-accent text-white">
          <Container className="flex flex-wrap items-center justify-between gap-8 py-18">
            <div className="flex flex-[1_1_480px] flex-col gap-3">
              <h2 id="join-title" className="text-4xl leading-tight font-semibold tracking-[-0.02em]">
                {join.title}
              </h2>
              {join.text && <p className="max-w-[36em] text-[17px] leading-relaxed text-accent-tint">{join.text}</p>}
            </div>
            <Actions actions={join.actions} on="accent" />
          </Container>
        </section>
      )}
    </Layout>
  );
}
