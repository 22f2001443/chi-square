// A list of past members: name, role and tenure in columns, stacked on phones
// (where a missing role or tenure is left out rather than shown as "—").
// Hidden when the section is missing, empty or switched off.
export default function AlumniList({ section }) {
  if (!section?.members.length) return null;
  const optional = (value) => (value ? "" : "hidden sm:block");
  return (
    <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-2.5">
      {section.title && <h3 className="text-[15px] font-semibold">{section.title}</h3>}
      <ul className="divide-y divide-line-soft rounded-xl border border-line bg-paper text-[13px]">
        {section.members.map((m, i) => (
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
