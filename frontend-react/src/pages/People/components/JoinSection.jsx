import { ButtonLink, Container } from "@/components/ui";
import people from "@/data/people.yml";

export default function JoinSection() {
  const { join } = people;
  if (!join) return null;

  return (
    <section aria-labelledby="join-title" className="bg-accent text-white">
      <Container className="flex flex-wrap items-center justify-between gap-5 py-8">
        <div className="flex flex-[1_1_420px] flex-col gap-1.5">
          <h2 id="join-title" className="text-[21px] leading-tight font-semibold tracking-[-0.015em]">
            {join.title}
          </h2>
          {join.text && <p className="max-w-[40em] text-sm leading-relaxed text-accent-tint">{join.text}</p>}
        </div>
        {join.action && (
          <ButtonLink href={join.action.href} variant="inverse">
            {join.action.label}
          </ButtonLink>
        )}
      </Container>
    </section>
  );
}
