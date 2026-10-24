import Notice from "@/components/Notice";
import site from "@/data/site.yml";

export default function NotFound() {
  return <Notice title={site.notFound?.title ?? "Page not found"} message={site.notFound?.message} />;
}
