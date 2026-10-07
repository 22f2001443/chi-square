import React from "react";
import { NavbarDefault } from "../components/Navbar";
import { FooterWithSocialLinks } from "../components/Footer";
import SmartLink from "../components/SmartLink";
import about from "../data/about.yml";

const ACTION_STYLES = {
  primary: "bg-white text-black font-semibold px-6 py-3 rounded hover:bg-gray-100 transition",
  secondary: "border-2 border-white text-white font-semibold px-6 py-3 rounded hover:bg-white hover:text-black transition",
};

export default function SocietyMessage() {
  const { mission, approach, structure, benefits, testimonials } = about;

  return (
    <>
      <NavbarDefault />
      <div className="relative bg-white py-16 px-4">
        {/* Background Title */}
        <h1 className="text-[36px] sm:text-[60px] md:text-[72px] lg:text-[96px] xl:text-[108px] tracking-wide text-center font-bold absolute inset-x-0 top-1 sm:-top-4 bg-gradient-to-b from-black to-slate-50 inline-block text-transparent bg-clip-text opacity-10 pointer-events-none uppercase whitespace-nowrap overflow-x-auto px-2">
          {about.title}
        </h1>

        {/* Main Heading */}
        <div className="flex justify-center items-center py-6 xs:py-3 xl:py-8 md:py-5 border-b-2 border-black relative z-10">
          <h1 className="text-[24px] sm:text-[36px] md:text-[44px] lg:text-[56px] xl:text-[64px] font-medium uppercase whitespace-nowrap overflow-x-auto px-2">
            {about.title}
          </h1>
        </div>

        {/* OUR MISSION */}
        <section className="max-w-7xl w-[90%] mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <h2 className="text-5xl font-bold text-blue-gray-900 whitespace-nowrap">
              {mission.title}
            </h2>
            <div className="border-l-4 border-teal-950 pl-6 text-justify text-lg text-gray-700">
              {mission.body}
            </div>
          </div>
        </section>
        <hr className="border-gray-300 my-8" />

        {/* HOW WE DO? */}
        <section className="max-w-7xl w-[90%] mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row-reverse items-start gap-6">
            <h2 className="text-5xl font-bold text-blue-gray-900 whitespace-nowrap">
              {approach.title}
            </h2>
            <div className="border-r-4 border-teal-950 pr-6 text-justify text-lg text-gray-700">
              {approach.body}
            </div>
          </div>
        </section>
        <hr className="border-gray-300 my-8" />

        {/* SOCIETY'S STRUCTURE */}
        <section className="max-w-7xl mx-auto px-4 py-12 bg-gray-100 rounded-lg shadow-inner">
          <h2 className="text-3xl font-bold text-center border-b-4 border-yellow-500 inline-block mb-8 px-4">
            {structure.title}
          </h2>
          <div className="text-lg text-gray-800 px-4 space-y-4">
            <p>{structure.intro}</p>
            {structure.points.map((point) => (
              <p key={point.label}><strong>{point.label}:</strong> {point.text}</p>
            ))}
            <p><strong>{structure.teamsLabel}:</strong></p>
            <ul className="list-disc list-inside pl-4">
              {structure.teams.map((team) => (
                <li key={team.name}><strong>{team.name}:</strong> {team.text}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* BENEFITS OF JOINING US */}
        <section className="w-[90%] mx-auto px-6 py-10 bg-black text-white rounded-3xl mt-12">
          <h2 className="text-3xl font-bold text-center mb-6 uppercase">{benefits.title}</h2>
          <p className="text-lg text-justify leading-relaxed">
            {benefits.body}
          </p>
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            {benefits.actions.map((action) => (
              <SmartLink key={action.label} href={action.href} className={ACTION_STYLES[action.style] ?? ACTION_STYLES.primary}>
                {action.label}
              </SmartLink>
            ))}
          </div>
        </section>
      </div>

      {/* TESTIMONIALS */}
      <section className="w-[90%] mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-10 uppercase border-l-4 border-black pl-4">{testimonials.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.items.map((t) => (
            <div key={t.author} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
              <p className="text-gray-700 italic mb-4">
                “{t.quote}”
              </p>
              <div className="text-sm font-semibold text-gray-900">— {t.author}</div>
            </div>
          ))}
        </div>
      </section>
          <hr className="border-gray-300 my-8" />

      <FooterWithSocialLinks />
    </>
  );
}
