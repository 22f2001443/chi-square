import { Container } from "@/components/ui";
import about from "@/data/about.yml";

export default function TestimonialsSection() {
  const { testimonials = {} } = about;
  const quotes = (testimonials.items ?? []).filter(Boolean);
  if (!quotes.length) return null;

  return (
    <section aria-labelledby="voices-title" className="bg-paper">
      <Container className="flex flex-col gap-8 py-16">
        <h2 id="voices-title" className="text-[31px] leading-tight font-semibold tracking-[-0.02em]">
          {testimonials.title}
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
          {quotes.map((q) => (
            <figure key={q.author} className="flex flex-col gap-5 rounded-2xl border border-line p-6">
              <blockquote className="text-[19px] leading-normal font-medium">“{q.quote}”</blockquote>
              <figcaption className="font-mono text-xs tracking-[0.04em] text-muted">— {q.author}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
