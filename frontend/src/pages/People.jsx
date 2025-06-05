import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";
import { NavbarDefault } from "../components/Navbar";
import { FooterWithSocialLinks } from "../components/Footer";

const teamMembers = [
  {
    name: "Samyabrata Roy",
    role: "Founder",
    img: `${import.meta.env.BASE_URL}/team/sam.jpg`,
    linkedin: "https://www.linkedin.com/in/samyabrata23/",
    email: "22f2001443@ds.study.iitm.ac.in",
  },
  {
    name: "Sukanya S",
    role: "Core member [Content Team]",
    img: `${import.meta.env.BASE_URL}/team/s.jpeg`,
    linkedin: "https://www.linkedin.com/in/sukanya-s-04610a206/",
    email: "23ds1000045@ds.study.iitm.ac.in",
  },
  {
    name: "Shrabana Paul",
    role: "Core member [Content Team]",
    img: `${import.meta.env.BASE_URL}/team/paul.jpeg`,
    linkedin: "https://www.linkedin.com/in/shrabana-paul-461935275/",
    email: "23f3003958@ds.study.iitm.ac.in",
  },
  {
    name: "Sinu Maria Jeeson",
    role: "Core member    [Content Team]",
    img: `${import.meta.env.BASE_URL}/team/dummy.jpeg`,
    linkedin: "https://www.linkedin.com/in/sinu-maria-jeeson-8913951b9/",
    email: "21f1001608@ds.study.iitm.ac.in",
  },
  {
    name: "Writwik Das",
    role: "PR and Media Lead",
    img: `${import.meta.env.BASE_URL}/team/das.jpeg`,
    linkedin: "https://www.linkedin.com/in/writwik-das/",
    email: "24f2009043@ds.study.iitm.ac.in",
  },
];

const colaborators = [
  {
    name: "Somshankar Chakraborty",
    role: "Secretary, Nilgiri House",
    img: `${import.meta.env.BASE_URL}/team/Somsankar Chakraborty,jpg`,
    email: "volunteer1@iitm.ac.in",
  },
  {
    name: "Madhur Thareja",
    role: "Deputy Secretary, RaSoR",
    img: `${import.meta.env.BASE_URL}/team/MT.jpeg`,
    email: "volunteer2@iitm.ac.in",
  },
];

const volunteers = [
  {
    name: "John Doe",
   role: "Volunteer",
   img: `${import.meta.env.BASE_URL}/team/john.jpg`,
   email: "volunteer2@iitm.ac.in",
  },
];

const pastMembers = [
  {
    name: "Pratibha Srivastava",
    tenure: "Jan, 2024 – May, 2024",
  },
  {
    name: "Jay Naria",
    tenure: "Jan, 2024– Sept, 2024",
  },
];

export default function People() {
  return (
    <>
        <NavbarDefault />
    <div className="bg-[#001f3f4b] bg-opacity-25 py-16 px-4 text-black min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-12">CORE TEAM</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-center">
        {teamMembers.map((member, index) => (
          <Card
            key={index}
            className="bg-[#0f1c2e4b] text-center rounded-xl border-t-4 border-yellow-400 overflow-hidden"
          >
            <div className="relative">
              <img
                src={member.img}
                alt={member.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-2 left-2 flex flex-col gap-2">
                <a href={member.linkedin} target="_blank" rel="noreferrer">
                  <FaLinkedin className="text-yellow-400 bg-black rounded-full p-2 w-10 h-10" />
                </a>
                <a href={`mailto:${member.email}`}>
                  <FaEnvelope className="text-yellow-400 bg-black rounded-full p-2 w-10 h-10" />
                </a>
                
              </div>
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
        ))}
      </div>
   <br/>
      <h1 className="text-4xl font-bold text-center mb-12">Colaborators</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-center">
        {colaborators.map((c, index) => (
          <Card
            key={index}
            className="bg-[#0f1c2e4b] text-center rounded-xl border-t-4 border-yellow-400 overflow-hidden"
          >
            <div className="relative">
              <img
                src={c.img}
                alt={c.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-2 left-2 flex flex-col gap-2">
                
                <a href={`mailto:${c.email}`}>
                  <FaEnvelope className="text-yellow-400 bg-black rounded-full p-2 w-10 h-10" />
                </a>
                
              </div>
            </div>
            <CardBody>
              <Typography variant="small" className="text-yellow-400 font-bold">
                {c.role.toUpperCase()}
              </Typography>
              <Typography variant="h6" className="text-white">
                {c.name}
              </Typography>
            </CardBody>
          </Card>
        ))}
      </div>
    
 
 <div className="bg-[#b4bdc7] bg-opacity-25 py-16 px-4 text-black min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-12">Volenteers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-center">
        {volunteers.map((volunteer, index) => (
          <Card
            key={index}
            className="bg-[#0f1c2e4b] text-center rounded-xl border-t-4 border-yellow-400 overflow-hidden"
          >
            <div className="relative">
              <img
                src={volunteer.img}
                alt={volunteer.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-2 left-2 flex flex-col gap-2">
                
                <a href={`mailto:${volunteer.email}`}>
                  <FaEnvelope className="text-yellow-400 bg-black rounded-full p-2 w-10 h-10" />
                </a>
                
              </div>
            </div>
            <CardBody>
              <Typography variant="small" className="text-yellow-400 font-bold">
                {volunteer.role.toUpperCase()}
              </Typography>
              <Typography variant="h6" className="text-white">
                {volunteer.name}
              </Typography>
            </CardBody>
          </Card>
        ))}
      </div>
 
    <br/>
  <div>
    <h1 className="text-4xl font-bold text-center mb-12">Past Core Members</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
      {pastMembers.map((past, index) => (
        <Card key={index} className="bg-[#0f1c2e4b] text-center p-6 border border-gray-500 rounded-lg">
          <Typography variant="h6" className="text-white mb-2">
            {past.name}
          </Typography>
          <Typography variant="small" className="text-gray-300">
            Tenure: {past.tenure}
          </Typography>
        </Card>
      ))}
    </div>
  

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