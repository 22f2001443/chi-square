import Icon from "@/components/Icon";
import SmartLink from "@/components/SmartLink";
import PosterOrCode from "./PosterOrCode";

export default function EventCard({ event }) {
  const who = event.guestSpeaker
    ? `Speaker: ${event.guestSpeaker}`
    : event.judge
      ? `Judge: ${event.judge}`
      : event.coHost
        ? `Co-host: ${event.coHost}`
        : event.hosts.length
          ? `Hosted by ${event.hosts.join(", ")}`
          : "";
  const detail = who;
  return (
    <article className="flex min-w-0 flex-[1_1_320px] flex-col overflow-hidden rounded-xl border border-line bg-paper">
      <PosterOrCode event={event} />
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">
          {event.dateLabel} · {event.kind.label}
        </p>
        <h3 className="text-lg leading-snug font-semibold">{event.name}</h3>
        {detail && <p className="text-sm leading-relaxed text-muted">{detail}</p>}
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
