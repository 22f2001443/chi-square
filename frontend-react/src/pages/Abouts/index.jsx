import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui";
import about from "@/data/about.yml";
import MissionSection from "./components/MissionSection";
import StructureSection from "./components/StructureSection";
import BenefitsSection from "./components/BenefitsSection";
import TestimonialsSection from "./components/TestimonialsSection";

// Each section reads about.yml itself and renders nothing when it has no
// content.
export default function About() {
  const { hero = {} } = about;

  return (
    <Layout>
      <PageHeader eyebrow={hero.eyebrow} title={hero.title ?? "About us"} lede={hero.lede} className="pb-10" />
      <MissionSection />
      <StructureSection />
      <BenefitsSection />
      <TestimonialsSection />
    </Layout>
  );
}
