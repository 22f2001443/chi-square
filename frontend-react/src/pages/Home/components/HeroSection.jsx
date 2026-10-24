import ChiCurves from "@/components/ChiCurves";
import { Actions, Container, Eyebrow } from "@/components/ui";
import home from "@/data/home.yml";
import site from "@/data/site.yml";

export default function HeroSection() {
  const { hero = {}, stats = [] } = home;

  return (
    <section aria-labelledby="hero-title" className="bg-ink text-on-ink">
      <Container className="flex flex-wrap items-center gap-10 pt-14 pb-12">
        <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-6">
          {hero.eyebrow && <Eyebrow tone="onInk">{hero.eyebrow}</Eyebrow>}
          <h1
            id="hero-title"
            className="text-[clamp(40px,5.4vw,68px)] leading-[1.02] font-semibold tracking-[-0.025em]"
          >
            {site.shortName ?? site.name}
            {site.tagline && (
              <span className="block font-medium text-on-ink-muted">{site.tagline}</span>
            )}
          </h1>
          {hero.lede && (
            <p className="max-w-[34em] text-[17px] leading-relaxed text-on-ink-soft">{hero.lede}</p>
          )}
          <div className="pt-2">
            <Actions actions={hero.actions} on="ink" />
          </div>
        </div>
        <ChiCurves className="flex-[1_1_420px]" />
      </Container>
      {stats.length > 0 && (
        <div className="border-t border-ink-line">
          <Container>
            <dl className="flex flex-wrap">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-[1_1_140px] flex-col-reverse gap-1 py-5">
                  <dt className="text-[13px] text-on-ink-muted">{stat.label}</dt>
                  <dd className="font-mono text-[40px] font-medium tracking-[-0.02em] text-on-ink">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      )}
    </section>
  );
}
