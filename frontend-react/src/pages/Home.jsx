import React from "react";
import { NavbarDefault } from "../components/Navbar";
import { FooterWithSocialLinks } from "../components/Footer";
import FloatingChat from "../components/FloatingHelpButton";

function Home() {
  return (
    <>
<NavbarDefault />
      <main className="p-0">
        <div className="my-0">
          <img src={`${import.meta.env.BASE_URL}/flyer.png`} alt="Chi-Square Flyer" className="w-full h-auto rounded-none shadow-none" />
        </div>
<section className="w-full bg-white text-gray-800 py-16">
  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-16 px-4 justify-center items-center text-center place-items-center">
    <div className="flex items-center gap-6">
      <h2 className="text-6xl font-bold  text-teal-950 border-r-4 border-teal-950 pr-4">2+ </h2>
      <p className="text-xl font-medium leading-tight">
        Years 
      </p>
    </div>
    <div className="flex items-center gap-6">
      <h2 className="text-6xl font-bold text-teal-950 border-r-4 border-teal-950 pr-4">380+</h2>
      <p className="text-xl font-medium leading-tight">
        Members <br /> 
      </p>
    </div>
    <div className="flex items-center gap-6">
      <h2 className="text-6xl font-bold  text-teal-950 border-r-4 border-teal-950 pr-4">15+</h2>
      <p className="text-xl font-medium leading-tight">
        Academic <br /> Events
      </p>
    </div>
    <div className="flex items-center gap-6">
      <h2 className="text-6xl font-bold  text-teal-950 border-r-4 border-teal-950 pr-4">400+ </h2>
      <p className="text-xl font-medium leading-tight">
        Active <br/>Participants
      </p>
    </div>
  </div>
</section>
<section className="w-full bg-white text-gray-800 py-16">
  <div className="max-w-6xl mx-auto px-4 text-center">
    <h2 className="text-3xl font-bold mb-10 text-teal-950">Announcements</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
      <div className="group relative w-full max-w-sm">
        <img src={`${import.meta.env.BASE_URL}/ROIFS_1.0.1.png`} alt="Research Summit" className="w-full border-4 border-white shadow-lg" />
        <button onClick={() => navigate('/events/upcomings')} className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-teal-950 text-white py-2 px-4 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Learn More
        </button>
      </div>
      {/* <div className="group relative w-full max-w-sm">
        <img src={`${import.meta.env.BASE_URL}/poster2.jpg`} alt="Research Carnival" className="w-full border-4 border-white shadow-lg" />
        <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-teal-950 text-white py-2 px-4 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Learn More
        </button>
      </div> */}
      {/* Uncomment the block below to add a third poster with hover button */}
      {/*
      <div className="group relative w-full max-w-sm">
        <img src="/poster3.jpg" alt="Upcoming Event" className="w-full border-4 border-white shadow-lg" />
        <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-teal-950 text-white py-2 px-4 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Learn More
        </button>
      </div>
      */}
    </div>
  </div>
</section>
      <section className="w-full bg-gray-50 text-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10 text-teal-950">Backed By</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 justify-items-center place-items-center">
            <img src="#" alt="" className="mx-auto h-20 object-contain" />
            <img src={`${import.meta.env.BASE_URL}/IIT_Madras_Logo.png`} alt="Collaborator 1" className="mx-auto h-20 object-contain" />
            <img src={`${import.meta.env.BASE_URL}/nil.png`} alt="Collaborator 3" className="mx-auto h-20 object-contain" />
            <img src="https://rasoriitm.vercel.app/logorasor.svg" alt="Collaborator 4" className="mx-auto h-20 object-contain" />
          </div>
        </div>
      </section>
      </main>
     <FloatingChat/>
      <FooterWithSocialLinks/>
    </>
    
  );
}

export default Home;