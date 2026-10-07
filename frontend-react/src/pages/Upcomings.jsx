import React, { useState } from "react";
import { NavbarDefault } from "../components/Navbar";
import { FooterWithSocialLinks } from "../components/Footer";
import { FaFileAlt, FaQuestionCircle, FaInfoCircle } from "react-icons/fa";
import upcoming from "../data/upcoming.yml";
import { asset } from "../lib/asset";

// Tab icons referenced by name from upcoming.yml.
const TAB_ICONS = {
  info: FaInfoCircle,
  file: FaFileAlt,
  question: FaQuestionCircle,
};

function EventCard({ event, index }) {
  const [activeTab, setActiveTab] = useState(0);
  const tab = event.tabs[activeTab];

  return (
    <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-full h-[500px] flex-grow">
      {/* Image at the top */}
      <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
        <img
          src={asset(event.image)}
          alt={`card-${index}`}
          className="object-cover w-full h-full rounded-md"
        />
      </div>

      {/* Tabs */}
      <ul
        className="relative flex flex-wrap justify-around px-2 py-1 list-none rounded-md bg-slate-100 mx-2"
        role="tablist"
      >
        {event.tabs.map((t, i) => {
          const Icon = TAB_ICONS[t.icon];
          return (
            <li key={t.label} className="flex-auto text-center">
              <button
                className={`flex items-center justify-center gap-1 w-full px-1 py-2 text-sm rounded-md transition-all ${
                  activeTab === i
                    ? "bg-slate-300 text-slate-800 font-medium"
                    : "bg-slate-100 text-slate-600"
                }`}
                onClick={() => setActiveTab(i)}
                role="tab"
              >
                {Icon && <Icon />} {t.label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Text below tabs */}
      <div className="flex flex-col flex-grow p-4">
        <div>
          <h5 className="mb-2 text-slate-800 text-lg font-semibold">
            {tab.title}
          </h5>
          <p className="text-slate-600 leading-normal font-light">
            {tab.content}
          </p>
        </div>
        <div className="mt-auto">
          <a
            href={event.registerLink}
            className="inline-block mt-4 px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800"
            {...(/^https?:\/\//.test(event.registerLink) && { target: "_blank", rel: "noopener noreferrer" })}
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
}

const CardsPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavbarDefault />

      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.events.map((event, index) => (
            <EventCard key={index} event={event} index={index} />
          ))}
        </div>
      </main>

      <FooterWithSocialLinks />
    </div>
  );
};

export default CardsPage;
