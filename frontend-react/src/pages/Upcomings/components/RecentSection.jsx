import { ArrowLink, Container } from "@/components/ui";
import upcoming from "@/data/upcoming.yml";
import { events } from "@/lib/events";

export default function RecentSection() {
  const { recent = {} } = upcoming;
  const recentEvents = events.slice(0, recent.count ?? 3);
  if (!recentEvents.length) return null;

  return (
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
  );
}
