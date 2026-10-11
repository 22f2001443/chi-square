import Layout from "../components/Layout";
import BlogCard from "../components/BlogCard";
import Icon from "../components/Icon";
import SmartLink from "../components/SmartLink";
import { ArrowLink, Container, Eyebrow, PageHeader } from "../components/ui";
import courseData from "../data/courses.yml";
import blogs from "../data/blogs.yml";
import { asset } from "../lib/asset";

// Link keys allowed in courses.yml, in display order.
const LINK_TYPES = [
  ["youtube", "YouTube playlist"],
  ["notes", "Course notes"],
  ["pyqs", "Previous-year questions"],
  ["web", "Official course page"],
];

function CourseCard({ course }) {
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
      <div className="flex min-w-0 flex-[1.4_1_240px] flex-col gap-3 p-7">
        <p className="flex flex-wrap gap-2 font-mono text-xs uppercase tracking-[0.06em]">
          {course.courseId && (
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent-strong">{course.courseId}</span>
          )}
          {course.level && <span className="rounded-full bg-surface px-2.5 py-1 text-body">{course.level}</span>}
        </p>
        <h3 className="text-[22px] leading-tight font-semibold">{course.title}</h3>
        {links.length > 0 && (
          <ul>
            {links.map(([key, label]) => (
              <li key={key} className="border-t border-line-soft">
                <SmartLink
                  href={course.links[key]}
                  className="flex min-h-12 items-center justify-between gap-3 text-[15px] font-semibold text-accent hover:text-accent-strong"
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

export default function CourseMaterial() {
  const { page = {}, courses = [], library = [] } = courseData;
  const posts = (blogs.posts ?? []).filter(Boolean).slice(0, 3);

  return (
    <Layout>
      <PageHeader eyebrow={page.eyebrow} title={page.title ?? "Resources"} lede={page.lede} />

      {courses.length > 0 && (
        <section aria-labelledby="courses-title" className="bg-paper">
          <Container className="flex flex-col gap-6 pt-6 pb-24">
            <h2 id="courses-title" className="text-[28px] leading-tight font-semibold tracking-[-0.015em]">
              {courseData.coursesTitle}
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-6">
              {courses.filter(Boolean).map((course) => (
                <CourseCard key={course.courseId ?? course.title} course={course} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {library.length > 0 && (
        <section aria-labelledby="library-title" className="bg-surface">
          <Container className="flex flex-col gap-6 py-20">
            <h2 id="library-title" className="text-[28px] leading-tight font-semibold tracking-[-0.015em]">
              {courseData.libraryTitle}
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
              {library.filter(Boolean).map((shelf) => {
                const body = (
                  <>
                    {shelf.status && (
                      <span className="self-start rounded-full bg-warn-soft px-2.5 py-1 font-mono text-xs uppercase tracking-[0.08em] text-warn-ink">
                        {shelf.status}
                      </span>
                    )}
                    <h3 className="text-xl font-semibold">{shelf.title}</h3>
                    {shelf.text && <p className="text-[15px] leading-relaxed text-muted">{shelf.text}</p>}
                  </>
                );
                const box = "flex flex-col gap-2.5 rounded-[14px] border border-line bg-paper p-7 text-ink";
                return shelf.to ? (
                  <SmartLink key={shelf.title} href={shelf.to} className={`${box} hover:border-field`}>
                    {body}
                  </SmartLink>
                ) : (
                  <div key={shelf.title} className={box}>
                    {body}
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {posts.length > 0 && (
        <section aria-labelledby="blogs-title" className="bg-paper">
          <Container className="flex flex-col gap-8 py-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-2.5">
                {blogs.eyebrow && <Eyebrow>{blogs.eyebrow}</Eyebrow>}
                <h2 id="blogs-title" className="text-4xl leading-[1.1] font-semibold tracking-[-0.02em]">
                  {blogs.title}
                </h2>
              </div>
              <ArrowLink href="/blogs">All blog posts</ArrowLink>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6">
              {posts.map((post, i) => (
                <BlogCard key={`${post.link}-${i}`} post={post} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </Layout>
  );
}
