import Layout from "@/components/Layout";
import { Container, PageHeader } from "@/components/ui";
import { sectionOn } from "@/config/featureFlags";
import people from "@/data/people.yml";
import MemberGroup from "./components/MemberGroup";
import AlumniSection from "./components/AlumniSection";
import JoinSection from "./components/JoinSection";

// A people.yml section with its blank members dropped, or null when it's
// switched off in config/features.yml.
function sectionFor(key) {
  const section = sectionOn("people", key) ? people[key] : null;
  return section && { ...section, members: section.members?.filter(Boolean) ?? [] };
}

export default function People() {
  const { page = {} } = people;

  return (
    <Layout>
      <PageHeader eyebrow={page.eyebrow} title={page.title ?? "People"} lede={page.lede} />

      <Container className="flex flex-wrap gap-x-12 gap-y-8 pt-2 pb-12">
        <MemberGroup section={sectionFor("coreTeam")} />
        <MemberGroup section={sectionFor("collaborators")} />
        <MemberGroup section={sectionFor("volunteers")} />
      </Container>

      <AlumniSection pastMembers={sectionFor("pastMembers")} pastCollaborators={sectionFor("pastCollaborators")} />
      {sectionOn("people", "join") && <JoinSection />}
    </Layout>
  );
}
