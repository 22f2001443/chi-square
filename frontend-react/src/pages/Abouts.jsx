import Layout from "../components/Layout";
import { Actions, Container, Eyebrow, PageHeader } from "../components/ui";
import about from "../data/about.yml";

export default function About() {
  const { hero = {}, mission, approach, structure = {}, benefits, testimonials = {} } = about;
  const points = (structure.points ?? []).filter(Boolean);
  const teams = (structure.teams ?? []).filter(Boolean);
  const quotes = (testimonials.items ?? []).filter(Boolean);

  return (
    <Layout>
      <PageHeader eyebrow={hero.eyebrow} title={hero.title ?? "About us"} lede={hero.lede} className="pb-10" />

      {(mission || approach) && (
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
      )}

      {(points.length > 0 || teams.length > 0) && (
        <section aria-labelledby="structure-title" className="bg-surface">
          <Container className="flex flex-col gap-8 py-16">
            <div className="flex max-w-180 flex-col gap-3">
              {structure.eyebrow && <Eyebrow>{structure.eyebrow}</Eyebrow>}
              <h2 id="structure-title" className="text-4xl leading-[1.1] font-semibold tracking-[-0.02em]">
                {structure.title}
              </h2>
              {structure.intro && <p className="text-[15px] leading-relaxed text-muted">{structure.intro}</p>}
            </div>
            {points.length > 0 && (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
                {points.map((p, i) => (
                  <div key={p.label} className="flex flex-col gap-3 rounded-[14px] border border-line bg-paper p-6">
                    <span className="font-mono text-[13px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-[17px] font-semibold">{p.label}</h3>
                    <p className="text-sm leading-relaxed text-body">{p.text}</p>
                  </div>
                ))}
              </div>
            )}
            {teams.length > 0 && (
              <div className="flex flex-col gap-4">
                {structure.teamsTitle && <h3 className="text-[22px] font-semibold">{structure.teamsTitle}</h3>}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
                  {teams.map((t) => (
                    <div key={t.name} className="flex items-start gap-4 rounded-[14px] border border-line bg-paper p-6">
                      {t.code && (
                        <span
                          aria-hidden="true"
                          className="inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-accent-soft font-mono text-[13px] font-medium text-accent-strong"
                        >
                          {t.code}
                        </span>
                      )}
                      <div className="flex flex-col gap-1.5">
                        <h4 className="text-[15px] font-semibold">{t.name}</h4>
                        {t.text && <p className="text-sm leading-relaxed text-muted">{t.text}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Container>
        </section>
      )}

      {benefits && (
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
      )}

      {quotes.length > 0 && (
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
      )}
    </Layout>
  );
}
