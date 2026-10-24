import { Container, Eyebrow } from "@/components/ui";
import about from "@/data/about.yml";

export default function StructureSection() {
  const { structure = {} } = about;
  const points = (structure.points ?? []).filter(Boolean);
  const teams = (structure.teams ?? []).filter(Boolean);
  if (!points.length && !teams.length) return null;

  return (
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
  );
}
