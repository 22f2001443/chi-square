import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { FaLinkedin } from "react-icons/fa";
import { NavbarDefault } from "../components/Navbar";
import { FooterWithSocialLinks } from "../components/Footer";
import people from "../data/people.yml";
import { asset } from "../lib/asset";

function MemberCard({ member }) {
  return (
    <Card className="bg-[#0f1c2e4b] text-center rounded-xl border-t-4 border-yellow-400 overflow-hidden">
      <div className="relative">
        <img
          src={asset(member.photo)}
          alt={member.name}
          className="w-full h-64 object-cover"
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
        <Typography variant="small" className="text-yellow-400 font-bold">
          {member.role.toUpperCase()}
        </Typography>
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
      {members.map((member) => (
        <MemberCard key={member.name} member={member} />
      ))}
    </div>
  );
}

// Compact cards for people who have moved on; role and tenure are optional.
function PastGrid({ members }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
      {members.map((past) => (
        <Card key={past.name} className="bg-[#0f1c2e4b] text-center p-6 border border-gray-500 rounded-lg">
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

export default function People() {
  const { coreTeam, collaborators, volunteers, pastMembers, pastCollaborators } = people;

  return (
    <>
        <NavbarDefault />
    <div className="bg-[#001f3f4b] bg-opacity-25 py-16 px-4 text-black min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-12">{coreTeam.title}</h1>
      <MemberGrid members={coreTeam.members} />
   <br/>
      <h1 className="text-4xl font-bold text-center mb-12">{collaborators.title}</h1>
      <MemberGrid members={collaborators.members} />

 <div className="bg-[#b4bdc7] bg-opacity-25 py-16 px-4 text-black min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-12">{volunteers.title}</h1>
      <MemberGrid members={volunteers.members} />

    <br/>
  <div>
    <h1 className="text-4xl font-bold text-center mb-12">{pastMembers.title}</h1>
    <PastGrid members={pastMembers.members} />
    <br/>
    <h1 className="text-4xl font-bold text-center mb-12">{pastCollaborators.title}</h1>
    <PastGrid members={pastCollaborators.members} />
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
