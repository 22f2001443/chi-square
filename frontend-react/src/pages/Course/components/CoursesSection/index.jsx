import { Container } from "@/components/ui";
import courseData from "@/data/courses.yml";
import CourseCard from "./components/CourseCard";

export default function CoursesSection() {
  const { courses = [] } = courseData;
  if (!courses.length) return null;

  return (
    <section aria-labelledby="courses-title" className="bg-paper">
      <Container className="flex flex-col gap-6 pt-6 pb-16">
        <h2 id="courses-title" className="text-[25px] leading-tight font-semibold tracking-[-0.015em]">
          {courseData.coursesTitle}
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-6">
          {courses.filter(Boolean).map((course) => (
            <CourseCard key={course.courseId ?? course.title} course={course} />
          ))}
        </div>
      </Container>
    </section>
  );
}
