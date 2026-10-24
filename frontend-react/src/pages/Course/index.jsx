import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui";
import courseData from "@/data/courses.yml";
import CoursesSection from "./components/CoursesSection";
import LibrarySection from "./components/LibrarySection";
import BlogsSection from "./components/BlogsSection";

// Each section reads its YAML itself and renders nothing when it has no
// content.
export default function CourseMaterial() {
  const { page = {} } = courseData;

  return (
    <Layout>
      <PageHeader eyebrow={page.eyebrow} title={page.title ?? "Resources"} lede={page.lede} />
      <CoursesSection />
      <LibrarySection />
      <BlogsSection />
    </Layout>
  );
}
