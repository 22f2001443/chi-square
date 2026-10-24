import Layout from "@/components/Layout";
import { sectionOn } from "@/config/featureFlags";
import HeroSection from "./components/HeroSection";
import LatestSection from "./components/LatestSection";
import FormatsSection from "./components/FormatsSection";
import PartnersSection from "./components/PartnersSection";
import JoinSection from "./components/JoinSection";

// Each section reads home.yml itself and renders nothing when it has no
// content; the flags in config/features.yml switch them off here.
export default function Home() {
  return (
    <Layout>
      <HeroSection />
      {sectionOn("home", "latest") && <LatestSection />}
      {sectionOn("home", "formats") && <FormatsSection />}
      {sectionOn("home", "partners") && <PartnersSection />}
      {sectionOn("home", "join") && <JoinSection />}
    </Layout>
  );
}
