import SmartLink from "@/components/SmartLink";
import { Container } from "@/components/ui";
import home from "@/data/home.yml";
import site from "@/data/site.yml";
import { asset } from "@/lib/asset";

export default function PartnersSection() {
  const { partners = {} } = home;
  if (!site.collaborators?.length) return null;

  return (
    <section aria-labelledby="partners-title" className="border-t border-line bg-paper">
      <Container className="flex flex-wrap items-center gap-x-12 gap-y-6 py-10">
        <h2
          id="partners-title"
          className="font-mono text-xs font-medium uppercase tracking-widest text-muted"
        >
          {partners.title}
        </h2>
        <div className="flex flex-wrap gap-x-10 gap-y-6">
          {site.collaborators.filter(Boolean).map((c) => (
            <SmartLink key={c.name} href={c.href} className="flex items-center gap-3 text-ink hover:text-accent">
              {c.logo ? (
                <img src={asset(c.logo)} alt="" className="block size-11 shrink-0 rounded-full" />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-surface font-mono text-sm font-semibold text-muted"
                >
                  {c.name[0]}
                </span>
              )}
              <span className="flex flex-col gap-0.5">
                <span className="text-lg font-semibold">{c.name}</span>
                {c.role && <span className="text-[13px] text-muted">{c.role}</span>}
              </span>
            </SmartLink>
          ))}
        </div>
      </Container>
    </section>
  );
}
