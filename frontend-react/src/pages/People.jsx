import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { FaLinkedin } from "react-icons/fa";
import { NavbarDefault } from "../components/Navbar";
import { FooterWithSocialLinks } from "../components/Footer";
import people from "../data/people.yml";
import { asset } from "../lib/asset";

// Swaps a missing or broken photo for people.yml's `defaultPhoto`, once.
function showDefaultPhoto(e) {
  const img = e.currentTarget;
  if (!people.defaultPhoto || img.dataset.fallback) return;
  img.dataset.fallback = "true";
  img.src = asset(people.defaultPhoto);
}

function MemberCard({ member }) {
  return (
    <Card className="bg-[#0f1c2e4b] text-center rounded-xl border-t-4 border-yellow-400 overflow-hidden">
      <div className="relative">
        <img
          src={asset(member.photo ?? people.defaultPhoto)}
          alt={member.name ?? ""}
          className="w-full h-64 object-cover"
          onError={showDefaultPhoto}
        />
        {member.linkedin && (
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            <a href={member.linkedin} target="_blank" rel="noreferrer">
              <FaLinkedin className="text-yellow-400 bg-black rounded-full p-2 w-10 h-10" />
            </a>
          </div>
        )}
      </div>
      <CardBody>
        {member.role && (
          <Typography variant="small" className="text-yellow-400 font-bold">
            {String(member.role).toUpperCase()}
          </Typography>
        )}
        <Typography variant="h6" className="text-white">
          {member.name}
        </Typography>
      </CardBody>
    </Card>
  );
}

function MemberGrid({ members }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-center">
      {members.map((member, i) => (
        <MemberCard key={member.name ?? i} member={member} />
      ))}
    </div>
  );
}

// Compact cards for people who have moved on; role and tenure are optional.
function PastGrid({ members }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
      {members.map((past, i) => (
        <Card key={past.name ?? i} className="bg-[#0f1c2e4b] text-center p-6 border border-gray-500 rounded-lg">
          <Typography variant="h6" className="text-white mb-2">
            {past.name}
          </Typography>
          {past.role && (
            <Typography variant="small" className="text-gray-300">
              {past.role}
            </Typography>
          )}
          {past.tenure && (
            <Typography variant="small" className="text-gray-300">
              Tenure: {past.tenure}
            </Typography>
          )}
        </Card>
      ))}
    </div>
  );
}

// A titled group of people; hidden when the section is missing or empty.
function Section({ section, grid }) {
  const members = section?.members?.filter(Boolean) ?? [];
  if (!members.length) return null;
  const Grid = grid;
  return (
    <>
      {section.title && (
        <h1 className="text-4xl font-bold text-center mb-12">{section.title}</h1>
      )}
      <Grid members={members} />
    </>
  );
}

export default function People() {
  const { coreTeam, collaborators, volunteers, pastMembers, pastCollaborators } = people;

  return (
    <>
        <NavbarDefault />
    <div className="bg-[#001f3f4b] bg-opacity-25 py-16 px-4 text-black min-h-screen">
      <Section section={coreTeam} grid={MemberGrid} />
   <br/>
      <Section section={collaborators} grid={MemberGrid} />

 <div className="bg-[#b4bdc7] bg-opacity-25 py-16 px-4 text-black min-h-screen">
      <Section section={volunteers} grid={MemberGrid} />

    <br/>
  <div>
    <Section section={pastMembers} grid={PastGrid} />
    <br/>
    <Section section={pastCollaborators} grid={PastGrid} />
    </div>
    </div>
    </div>
     <div>
        <br/>
     </div>
    <FooterWithSocialLinks />
    </>
  );
}
