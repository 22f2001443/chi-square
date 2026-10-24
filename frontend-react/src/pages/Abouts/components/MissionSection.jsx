import { Container, Eyebrow } from "@/components/ui";
import about from "@/data/about.yml";

export default function MissionSection() {
  const { mission, approach } = about;
  if (!mission && !approach) return null;

  return (
    <section aria-label="Mission and approach" className="bg-paper">
      <Container className="flex flex-wrap gap-6 pb-16">
        {mission && (
          <div className="flex flex-[1_1_440px] flex-col gap-4 rounded-2xl bg-ink p-7 text-on-ink">
            <Eyebrow tone="onInk">01 · {mission.label}</Eyebrow>
            <p className="text-xl leading-normal font-medium">{mission.body}</p>
          </div>
        )}
        {approach && (
          <div className="flex flex-[1_1_440px] flex-col gap-4 rounded-2xl border border-line p-7">
            <Eyebrow tone="muted">02 · {approach.label}</Eyebrow>
            <p className="text-xl leading-normal font-medium">{approach.body}</p>
          </div>
        )}
      </Container>
    </section>
  );
}
