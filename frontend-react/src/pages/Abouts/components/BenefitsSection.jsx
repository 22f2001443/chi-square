import { Actions, Container, Eyebrow } from "@/components/ui";
import about from "@/data/about.yml";

export default function BenefitsSection() {
  const { benefits } = about;
  if (!benefits) return null;

  return (
    <section aria-labelledby="benefits-title" className="bg-ink text-on-ink">
      <Container className="flex flex-wrap items-start gap-x-12 gap-y-8 py-16">
        <div className="flex flex-[1_1_360px] flex-col gap-3">
          {benefits.eyebrow && <Eyebrow tone="onInk">{benefits.eyebrow}</Eyebrow>}
          <h2 id="benefits-title" className="text-4xl leading-[1.1] font-semibold tracking-[-0.02em]">
            {benefits.title}
          </h2>
        </div>
        <div className="flex flex-[1.4_1_480px] flex-col gap-7">
          {benefits.body && <p className="text-base leading-[1.7] text-on-ink-soft">{benefits.body}</p>}
          <Actions actions={benefits.actions} on="inkInverse" />
        </div>
      </Container>
    </section>
  );
}
