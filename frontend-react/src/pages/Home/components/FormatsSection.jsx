import SmartLink from "@/components/SmartLink";
import { Container, Eyebrow } from "@/components/ui";
import home from "@/data/home.yml";
import { countByType, kinds } from "@/lib/events";

export default function FormatsSection() {
  const { formats = {} } = home;
  if (!formats.items?.length) return null;
  const kindByType = Object.fromEntries(kinds.map((k) => [k.type, k]));

  return (
    <section aria-labelledby="formats-title" className="bg-surface">
      <Container className="flex flex-col gap-8 py-16">
        <div className="flex max-w-160 flex-col gap-2.5">
          {formats.eyebrow && <Eyebrow>{formats.eyebrow}</Eyebrow>}
          <h2 id="formats-title" className="text-4xl leading-[1.1] font-semibold tracking-[-0.02em]">
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
                className="flex min-w-0 flex-[1_1_250px] flex-col gap-3 rounded-xl border border-line bg-paper p-6 text-ink hover:border-field"
              >
                <span
                  className="font-mono text-4xl font-medium tracking-[-0.02em]"
                  style={{ color: kind?.color }}
                >
                  {String(countByType(item.type)).padStart(2, "0")}
                </span>
                <span className="text-[17px] font-semibold">{item.title ?? kind?.plural ?? item.type}</span>
                {item.text && <span className="text-sm leading-relaxed text-muted">{item.text}</span>}
              </SmartLink>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
