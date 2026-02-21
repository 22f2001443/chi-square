import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { NavbarDefault } from "../components/Navbar";
import { FooterWithSocialLinks } from "../components/Footer";

export default function SocietyMessage() {
  return (
    <>
      <NavbarDefault />
      <div className="relative bg-white py-16 px-4">
        {/* Background Title */}
        <h1 className="text-[36px] sm:text-[60px] md:text-[72px] lg:text-[96px] xl:text-[108px] tracking-wide text-center font-bold absolute inset-x-0 top-1 sm:-top-4 bg-gradient-to-b from-black to-slate-50 inline-block text-transparent bg-clip-text opacity-10 pointer-events-none uppercase whitespace-nowrap overflow-x-auto px-2">
          club's message
        </h1>

        {/* Main Heading */}
        <div className="flex justify-center items-center py-6 xs:py-3 xl:py-8 md:py-5 border-b-2 border-black relative z-10">
          <h1 className="text-[24px] sm:text-[36px] md:text-[44px] lg:text-[56px] xl:text-[64px] font-medium uppercase whitespace-nowrap overflow-x-auto px-2">
            club's message
          </h1>
        </div>

        {/* OUR MISSION */}
        <section className="max-w-7xl w-[90%] mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <h2 className="text-5xl font-bold text-blue-gray-900 whitespace-nowrap">
              Our Mission
            </h2>
            <div className="border-l-4 border-teal-950 pl-6 text-justify text-lg text-gray-700">
              Welcome to the Chi-Square Statistics Club. Our mission is to cultivate statistical curiosity and empower students through data-driven initiatives, academic discussions, and collaborative events. Whether you're new to statistics or already immersed in it, our society welcomes you to grow, connect, and contribute.
            </div>
          </div>
        </section>
        <hr className="border-gray-300 my-8" />

        {/* HOW WE DO? */}
        <section className="max-w-7xl w-[90%] mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row-reverse items-start gap-6">
            <h2 className="text-5xl font-bold text-blue-gray-900 whitespace-nowrap">
              How We Do?
            </h2>
            <div className="border-r-4 border-teal-950 pr-6 text-justify text-lg text-gray-700">
              We host academic events, revision bootcamps, research talks, and workshops. We create opportunities for students to explore statistics beyond classrooms and connect with industry and academic mentors.
            </div>
          </div>
        </section>
        <hr className="border-gray-300 my-8" />

        {/* SOCIETY'S STRUCTURE */}
        <section className="max-w-7xl mx-auto px-4 py-12 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-3xl font-bold text-center border-b-4 border-yellow-500 inline-block mb-8 px-4">
            SOCIETY'S STRUCTURE
          </h2>
          <div className="text-lg text-gray-800 px-4 space-y-4">
            <p>
              The Chi-Square Statistics Club at IIT Madras BS is organized to promote collaborative learning, academic curiosity, and peer mentoring through a well-defined team structure.
            </p>
            <p><strong>Leadership:</strong> The club is led by student officers who manage operations, strategy, and event planning across all academic terms.</p>
            <p><strong>Group Structure:</strong> We operate through dedicated teams, each responsible for specific verticals such as content, research, and outreach.</p>
            <p><strong>Membership:</strong> Open to all enrolled BS students, encouraging participation through events and projects.</p>
            <p><strong>Faculty Involvement:</strong> While student-driven, we benefit from faculty guidance on vision and knowledge direction.</p>
            <p><strong>Our Teams:</strong></p>
            <ul className="list-disc list-inside pl-4">
              <li><strong>Content & Research Team:</strong> Crafts event materials and research briefs.</li>
              <li><strong>PN & Social Media Team:</strong> Manages outreach, branding, and engagement.</li>
              <li><strong>Design & Web Team:</strong> Maintains the website and visual identity of the club.</li>
            </ul>
          </div>
        </section>

        {/* BENEFITS OF JOINING US */}
        <section className="w-[90%] mx-auto px-6 py-10 bg-black text-white rounded-3xl mt-12">
          <h2 className="text-3xl font-bold text-center mb-6 uppercase">BENEFITS OF JOINING US</h2>
          <p className="text-lg text-justify leading-relaxed">
            Becoming a member of the Chi-Square Statistics Club offers you hands-on exposure to the world of data, research, and analytical thinking. You'll gain experience by participating in revision sessions, academic talks, and collaborative projects. Network with peers and mentors, enhance your academic profile, and build a foundation for a future in data science, statistics, or research. Whether you're exploring or already passionate about statistics, our club is the perfect platform to learn and grow.
          </p>
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <a href="/membership-form" className="bg-white text-black font-semibold px-6 py-3 rounded hover:bg-gray-100 transition">
              Become a Member
            </a>
            <a href="/core-team-application" className="border-2 border-white text-white font-semibold px-6 py-3 rounded hover:bg-white hover:text-black transition">
              Join Our Core Team
            </a>
          </div>
        </section>
      </div>

      {/* TESTIMONIALS */}
      <section className="w-[90%] mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-10 uppercase border-l-4 border-black pl-4">TESTIMONIALS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 italic mb-4">
              “Joining Chi-Square helped me find direction in the field of statistics and gave me the opportunity to work on real projects.”
            </p>
            <div className="text-sm font-semibold text-gray-900">— Aditi, BSc Statistics Student</div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 italic mb-4">
              “Being part of the core team improved my leadership skills and helped me connect with like-minded peers.”
            </p>
            <div className="text-sm font-semibold text-gray-900">— Ravi, Core Team Member</div>
          </div>
        </div>
      </section>
          <hr className="border-gray-300 my-8" />

      <FooterWithSocialLinks />
    </>
  );
}