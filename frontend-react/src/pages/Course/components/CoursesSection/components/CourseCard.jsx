import Icon from "@/components/Icon";
import SmartLink from "@/components/SmartLink";
import { asset } from "@/lib/asset";

// Link keys allowed in courses.yml, in display order.
const LINK_TYPES = [
  ["youtube", "YouTube playlist"],
  ["notes", "Course notes"],
  ["pyqs", "Previous-year questions"],
  ["web", "Official course page"],
];

export default function CourseCard({ course }) {
  const links = LINK_TYPES.filter(([key]) => course.links?.[key]);
  return (
    <article className="flex flex-wrap overflow-hidden rounded-2xl border border-line">
      {course.image && (
        <img
          src={asset(course.image)}
          alt=""
          className="block max-h-80 min-h-55 w-full flex-[1_1_180px] bg-surface object-cover"
        />
      )}
      <div className="flex min-w-0 flex-[1.4_1_240px] flex-col gap-3 p-6">
        <p className="flex flex-wrap gap-2 font-mono text-xs uppercase tracking-[0.06em]">
          {course.courseId && (
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent-strong">{course.courseId}</span>
          )}
          {course.level && <span className="rounded-full bg-surface px-2.5 py-1 text-body">{course.level}</span>}
        </p>
        <h3 className="text-xl leading-tight font-semibold">{course.title}</h3>
        {links.length > 0 && (
          <ul>
            {links.map(([key, label]) => (
              <li key={key} className="border-t border-line-soft">
                <SmartLink
                  href={course.links[key]}
                  className="flex min-h-12 items-center justify-between gap-3 text-sm font-semibold text-accent hover:text-accent-strong"
                >
                  {label}
                  <Icon name="arrowUpRight" />
                </SmartLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
