import Layout from "../components/Layout";
import Icon from "../components/Icon";
import SmartLink from "../components/SmartLink";
import { ButtonLink, Container, Eyebrow, PageHeader } from "../components/ui";
import people from "../data/people.yml";
import { asset } from "../lib/asset";

// Swaps a missing or broken photo for people.yml's `defaultPhoto`, once.
function showDefaultPhoto(e) {
  const img = e.currentTarget;
  if (!people.defaultPhoto || img.dataset.fallback) return;
  img.dataset.fallback = "true";
  img.src = asset(people.defaultPhoto);
}

const membersOf = (section) => section?.members?.filter(Boolean) ?? [];

function MemberCard({ member }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[14px] border border-line bg-paper">
      <img
        src={asset(member.photo ?? people.defaultPhoto)}
        alt={member.photo ? (member.name ?? "") : ""}
        onError={showDefaultPhoto}
        className="block aspect-4/5 w-full bg-surface object-cover"
      />
      <div className="flex items-start justify-between gap-3 px-5 pt-4.5 pb-5">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h3 className="text-[17px] leading-snug font-semibold">{member.name}</h3>
          {member.role && (
            <p className="font-mono text-xs leading-normal uppercase tracking-[0.06em] text-muted">
              {member.role}
            </p>
          )}
        </div>
        {member.linkedin && (
          <SmartLink
            href={member.linkedin}
            aria-label={`${member.name} on LinkedIn`}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-line text-ink hover:border-ink"
          >
            <Icon name="linkedin" size={20} />
          </SmartLink>
        )}
      </div>
    </article>
  );
}

// A titled grid of photo cards; hidden when the section is missing or empty.
function MemberSection({ section }) {
  const members = membersOf(section);
  if (!members.length) return null;
  return (
    <section aria-label={section.title} className="bg-paper">
      <Container className="flex flex-col gap-7 border-b border-line py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          {section.title && (
            <h2 className="text-[27px] leading-tight font-semibold tracking-[-0.015em]">{section.title}</h2>
          )}
          {section.blurb && <p className="max-w-[32em] text-sm text-muted">{section.blurb}</p>}
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
          {members.map((member, i) => (
            <MemberCard key={member.name ?? i} member={member} />
          ))}
        </div>
      </Container>
    </section>
  );
}

// A table of past members; hidden when the section is missing or empty.
function AlumniTable({ section }) {
  const members = membersOf(section);
  if (!members.length) return null;
  const head = "border-b border-line px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted";
  const cell = "border-b border-line-soft px-4 py-3.5";
  return (
    <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-3">
      {section.title && <h3 className="text-lg font-semibold">{section.title}</h3>}
      <div className="overflow-x-auto rounded-xl border border-line bg-paper">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th scope="col" className={head}>Name</th>
              <th scope="col" className={head}>Role</th>
              <th scope="col" className={head}>Tenure</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={m.name ?? i}>
                <th scope="row" className={`${cell} text-left font-semibold`}>{m.name}</th>
                <td className={`${cell} text-body`}>{m.role ?? "—"}</td>
                <td className={`${cell} font-mono text-xs whitespace-nowrap text-muted`}>{m.tenure ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function People() {
  const { page = {}, coreTeam, collaborators, volunteers, alumni = {}, pastMembers, pastCollaborators, join } = people;
  const hasAlumni = membersOf(pastMembers).length > 0 || membersOf(pastCollaborators).length > 0;

  return (
    <Layout>
      <PageHeader eyebrow={page.eyebrow} title={page.title ?? "People"} lede={page.lede} className="pb-6" />

      <MemberSection section={coreTeam} />
      <MemberSection section={collaborators} />
      <MemberSection section={volunteers} />

      {hasAlumni && (
        <section aria-labelledby="alumni-title" className="bg-surface">
          <Container className="flex flex-col gap-8 py-14">
            <div className="flex flex-col gap-2.5">
              {alumni.eyebrow && <Eyebrow>{alumni.eyebrow}</Eyebrow>}
              <h2 id="alumni-title" className="text-[31px] leading-tight font-semibold tracking-[-0.02em]">
                {alumni.title ?? "Alumni"}
              </h2>
            </div>
            <div className="flex flex-wrap gap-8">
              <AlumniTable section={pastMembers} />
              <AlumniTable section={pastCollaborators} />
            </div>
          </Container>
        </section>
      )}

      {join && (
        <section aria-labelledby="join-title" className="bg-accent text-white">
          <Container className="flex flex-wrap items-center justify-between gap-6 py-12">
            <div className="flex flex-[1_1_420px] flex-col gap-2.5">
              <h2 id="join-title" className="text-[27px] leading-tight font-semibold tracking-[-0.015em]">
                {join.title}
              </h2>
              {join.text && <p className="max-w-[34em] leading-relaxed text-accent-tint">{join.text}</p>}
            </div>
            {join.action && (
              <ButtonLink href={join.action.href} variant="inverse">
                {join.action.label}
              </ButtonLink>
            )}
          </Container>
        </section>
      )}
    </Layout>
  );
}
