import { Actions, Container } from "@/components/ui";
import home from "@/data/home.yml";

export default function JoinSection() {
  const { join } = home;
  if (!join) return null;

  return (
    <section aria-labelledby="join-title" className="bg-accent text-white">
      <Container className="flex flex-wrap items-center justify-between gap-8 py-12">
        <div className="flex flex-[1_1_480px] flex-col gap-3">
          <h2 id="join-title" className="text-[32px] leading-tight font-semibold tracking-[-0.02em]">
            {join.title}
          </h2>
          {join.text && <p className="max-w-[36em] text-[15px] leading-relaxed text-accent-tint">{join.text}</p>}
        </div>
        <Actions actions={join.actions} on="accent" />
      </Container>
    </section>
  );
}
