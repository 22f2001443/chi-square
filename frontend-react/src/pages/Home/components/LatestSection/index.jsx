import { ArrowLink, Container, Eyebrow } from "@/components/ui";
import home from "@/data/home.yml";
import { events } from "@/lib/events";
import EventCard from "./components/EventCard";

export default function LatestSection() {
  const { latest = {} } = home;
  const latestEvents = events
    .filter((e) => !latest.types?.length || latest.types.includes(e.type))
    .slice(0, latest.count ?? 3);
  if (!latestEvents.length) return null;

  return (
    <section aria-labelledby="latest-title" className="bg-paper">
      <Container className="flex flex-col gap-8 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            {latest.eyebrow && <Eyebrow>{latest.eyebrow}</Eyebrow>}
            <h2 id="latest-title" className="text-4xl leading-[1.1] font-semibold tracking-[-0.02em]">
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
  );
}
