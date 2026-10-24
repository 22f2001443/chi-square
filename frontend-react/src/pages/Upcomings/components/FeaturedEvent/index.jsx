import Icon from "@/components/Icon";
import { ButtonLink } from "@/components/ui";
import seriesData from "@/data/series.yml";
import { asset } from "@/lib/asset";
import Tabs from "./components/Tabs";

const DETAILS = [
  ["date", "Date"],
  ["time", "Time"],
  ["where", "Where"],
  ["speaker", "Speaker"],
];

export default function FeaturedEvent({ event }) {
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
