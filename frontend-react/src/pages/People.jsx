import Layout from "../components/Layout";
import Icon from "../components/Icon";
import SmartLink from "../components/SmartLink";
import { ButtonLink, Container, Eyebrow, PageHeader } from "../components/ui";
import people from "../data/people.yml";
import { asset } from "../lib/asset";
import { sectionOn } from "../lib/features";

// Swaps a missing or broken photo for people.yml's `defaultPhoto`, once.
function showDefaultPhoto(e) {
  const img = e.currentTarget;
  if (!people.defaultPhoto || img.dataset.fallback) return;
  img.dataset.fallback = "true";
  img.src = asset(people.defaultPhoto);
}

const membersOf = (section) => section?.members?.filter(Boolean) ?? [];

// A people.yml section, or null when it's switched off in features.yml.
const sectionFor = (key) => (sectionOn("people", key) ? people[key] : null);

function MemberCard({ member }) {
  return (
    <article className="flex w-[calc(50%-0.5rem)] flex-col overflow-hidden rounded-xl border border-line bg-paper sm:w-44">
      <img
        src={asset(member.photo ?? people.defaultPhoto)}
        alt={member.photo ? (member.name ?? "") : ""}
        onError={showDefaultPhoto}
        className="block aspect-4/5 w-full bg-surface object-cover"
      />
      <div className="flex items-start justify-between gap-2 px-3 pt-2.5 pb-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-sm leading-snug font-semibold">{member.name}</h3>
          {member.role && (
            <p className="font-mono text-[11px] leading-normal uppercase tracking-[0.04em] text-muted">
              {member.role}
            </p>
          )}
        </div>
        {member.linkedin && (
          <SmartLink
            href={member.linkedin}
            aria-label={`${member.name} on LinkedIn`}
            className="-mr-1 inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface hover:text-ink"
          >
            <Icon name="linkedin" size={18} />
          </SmartLink>
        )}
      </div>
    </article>
  );
}

// A titled group of photo cards; hidden when the section is missing, empty
// or switched off. Groups sit side by side while they fit.
function MemberGroup({ section }) {
  const members = membersOf(section);
  if (!members.length) return null;
  return (
    <section aria-label={section.title} className="flex w-full flex-col gap-3 sm:w-auto">
      {section.title && (
        <h2 className="flex items-baseline gap-2.5 text-[17px] leading-tight font-semibold tracking-[-0.01em]">
          {section.title}
          <span className="font-mono text-[11px] font-medium text-muted">{members.length}</span>
        </h2>
      )}
      <div className="flex flex-wrap gap-4">
        {members.map((member, i) => (
          <MemberCard key={member.name ?? i} member={member} />
        ))}
      </div>
    </section>
  );
}

// A list of past members: name, role and tenure in columns, stacked on phones
// (where a missing role or tenure is left out rather than shown as "—").
// Hidden when the section is missing, empty or switched off.
function AlumniList({ section }) {
  const members = membersOf(section);
  if (!members.length) return null;
  const optional = (value) => (value ? "" : "hidden sm:block");
  return (
    <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-2.5">
      {section.title && <h3 className="text-[15px] font-semibold">{section.title}</h3>}
      <ul className="divide-y divide-line-soft rounded-xl border border-line bg-paper text-[13px]">
        {members.map((m, i) => (
          <li
            key={m.name ?? i}
            className="grid gap-x-4 gap-y-0.5 px-4 py-2.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_13em] sm:items-baseline"
          >
            <span className="font-semibold">{m.name}</span>
            <span className={`text-body ${optional(m.role)}`}>{m.role ?? "—"}</span>
            <span className={`font-mono text-xs text-muted ${optional(m.tenure)}`}>{m.tenure ?? "—"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function People() {
  const { page = {}, alumni = {} } = people;
  const pastMembers = sectionFor("pastMembers");
  const pastCollaborators = sectionFor("pastCollaborators");
  const join = sectionFor("join");
  const hasAlumni = membersOf(pastMembers).length > 0 || membersOf(pastCollaborators).length > 0;

  return (
    <Layout>
      <PageHeader eyebrow={page.eyebrow} title={page.title ?? "People"} lede={page.lede} />

      <Container className="flex flex-wrap gap-x-12 gap-y-8 pt-2 pb-12">
        <MemberGroup section={sectionFor("coreTeam")} />
        <MemberGroup section={sectionFor("collaborators")} />
        <MemberGroup section={sectionFor("volunteers")} />
      </Container>

      {hasAlumni && (
        <section aria-labelledby="alumni-title" className="bg-surface">
          <Container className="flex flex-col gap-6 py-10">
            <div className="flex flex-col gap-2">
              {alumni.eyebrow && <Eyebrow>{alumni.eyebrow}</Eyebrow>}
              <h2 id="alumni-title" className="text-[21px] leading-tight font-semibold tracking-[-0.015em]">
                {alumni.title ?? "Alumni"}
              </h2>
            </div>
            <div className="flex flex-wrap gap-6">
              <AlumniList section={pastMembers} />
              <AlumniList section={pastCollaborators} />
            </div>
          </Container>
        </section>
      )}

      {join && (
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
      )}
    </Layout>
  );
}
