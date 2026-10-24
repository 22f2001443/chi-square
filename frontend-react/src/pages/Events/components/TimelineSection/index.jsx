import Icon from "@/components/Icon";
import SmartLink from "@/components/SmartLink";
import { journeyPage as page } from "@/lib/events";
import { pageOn } from "@/config/featureFlags";
import TimelineEvent from "./components/TimelineEvent";
import TimelineRow from "./components/TimelineRow";

// The vertical timeline: an "up next" link, the events grouped by term, and
// where it all began (shown only with the "All events" filter).
export default function TimelineSection({ terms, showBeginning, filterHeight }) {
  return (
    <section aria-label="Timeline of events" className="bg-paper">
      <div className="tl-wrap relative mx-auto max-w-300 px-6 pt-6 pb-16">
        <div
          aria-hidden="true"
          className="tl-line absolute top-0 bottom-0 left-[35px] w-0.5 bg-line md:left-[135px]"
        >
          <div className="tl-fill absolute inset-0 bg-ink" />
        </div>

        {page.upNext && pageOn("/events/upcomings") && (
          <TimelineRow className="relative items-center pb-3">
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
          </TimelineRow>
        )}

        {terms.length === 0 && (
          <p className="relative py-12 text-center text-muted">No events of this kind yet.</p>
        )}

        {terms.map((group) => (
          <section key={group.term} aria-label={group.label} className="relative flex flex-col gap-2.5 pb-6">
            <TimelineRow className="sticky z-5 items-center bg-paper py-2" style={{ top: filterHeight }}>
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
            </TimelineRow>
            {group.items.map((event) => (
              <TimelineEvent key={`${event.name}-${event.sortKey}`} event={event} />
            ))}
          </section>
        ))}

        {page.beginning && showBeginning && (
          <TimelineRow className="relative items-start pt-1">
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
          </TimelineRow>
        )}
      </div>
    </section>
  );
}
