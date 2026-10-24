import { ButtonLink, Container } from "@/components/ui";
import site from "@/data/site.yml";
import upcoming from "@/data/upcoming.yml";

// Where to follow the club; the title changes when nothing is scheduled.
export default function FollowSection({ hasScheduled }) {
  const { follow = {} } = upcoming;

  return (
    <section aria-labelledby="follow-title" className="bg-surface">
      <Container className="flex flex-wrap items-center justify-between gap-x-12 gap-y-6 py-12">
        <div className="flex flex-[1_1_420px] flex-col gap-2.5">
          <h2 id="follow-title" className="text-[25px] leading-tight font-semibold tracking-[-0.015em]">
            {hasScheduled ? follow.title : (follow.emptyTitle ?? follow.title)}
          </h2>
          {follow.text && <p className="leading-relaxed text-muted">{follow.text}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          {(site.socials ?? [])
            .filter((s) => s && s.label !== "GitHub")
            .map((s) => (
              <ButtonLink key={s.label} href={s.href} variant="secondary" className="bg-paper">
                {s.label}
              </ButtonLink>
            ))}
        </div>
      </Container>
    </section>
  );
}
