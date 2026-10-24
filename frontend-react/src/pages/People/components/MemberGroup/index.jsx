import MemberCard from "./components/MemberCard";

// A titled group of photo cards; hidden when the section is missing, empty
// or switched off. Groups sit side by side while they fit.
export default function MemberGroup({ section }) {
  if (!section?.members.length) return null;
  const { members } = section;
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
