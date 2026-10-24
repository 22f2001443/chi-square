import { Container, Eyebrow } from "@/components/ui";
import people from "@/data/people.yml";
import AlumniList from "./components/AlumniList";

// Past members and past collaborators; hidden when both lists are empty.
export default function AlumniSection({ pastMembers, pastCollaborators }) {
  const { alumni = {} } = people;
  if (!pastMembers?.members.length && !pastCollaborators?.members.length) return null;

  return (
    <section aria-labelledby="alumni-title" className="bg-surface">
      <Container className="flex flex-col gap-6 py-10">
        <div className="flex flex-col gap-2">
          {alumni.eyebrow && <Eyebrow>{alumni.eyebrow}</Eyebrow>}
          <h2 id="alumni-title" className="text-[21px] leading-tight font-semibold tracking-[-0.015em]">
            {alumni.title ?? "Alumni"}
          </h2>
        </div>
        <div className="flex flex-wrap gap-6">
          <AlumniList section={pastMembers} />
          <AlumniList section={pastCollaborators} />
        </div>
      </Container>
    </section>
  );
}
