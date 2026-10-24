import Icon from "@/components/Icon";
import SmartLink from "@/components/SmartLink";
import people from "@/data/people.yml";
import { asset } from "@/lib/asset";

// Swaps a missing or broken photo for people.yml's `defaultPhoto`, once.
function showDefaultPhoto(e) {
  const img = e.currentTarget;
  if (!people.defaultPhoto || img.dataset.fallback) return;
  img.dataset.fallback = "true";
  img.src = asset(people.defaultPhoto);
}

export default function MemberCard({ member }) {
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
