import { Eyebrow } from "@/components/ui";
import { dateRange, events, journeyPage as page } from "@/lib/events";

export default function HeroSection() {
  const seriesCount = new Set(events.map((e) => e.series).filter(Boolean)).size;
  const termCount = new Set(events.map((e) => e.term).filter(Boolean)).size;
  const range = dateRange();

  return (
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
  );
}
