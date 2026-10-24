import Layout from "@/components/Layout";
import { Container, PageHeader } from "@/components/ui";
import upcoming from "@/data/upcoming.yml";
import FeaturedEvent from "./components/FeaturedEvent";
import FollowSection from "./components/FollowSection";
import RecentSection from "./components/RecentSection";

export default function Upcomings() {
  const { page = {} } = upcoming;
  const scheduled = (upcoming.events ?? []).filter((e) => e?.title);

  return (
    <Layout>
      <PageHeader eyebrow={page.eyebrow} title={page.title ?? "Upcoming Events"} lede={page.lede} />

      {scheduled.length > 0 && (
        <section aria-label="Upcoming events" className="bg-paper">
          <Container className="flex flex-col gap-8 pt-6 pb-16">
            {scheduled.map((event) => (
              <FeaturedEvent key={event.title} event={event} />
            ))}
          </Container>
        </section>
      )}

      <FollowSection hasScheduled={scheduled.length > 0} />
      <RecentSection />
    </Layout>
  );
}
