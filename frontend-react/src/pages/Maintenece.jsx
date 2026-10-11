import Notice from "../components/Notice";
import site from "../data/site.yml";

export default function MaintenancePage() {
  return <Notice title={site.maintenance?.title} message={site.maintenance?.message} />;
}
