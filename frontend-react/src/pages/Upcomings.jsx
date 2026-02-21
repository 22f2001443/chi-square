import React, { useState } from "react";
import { NavbarDefault } from "../components/Navbar";
import { FooterWithSocialLinks } from "../components/Footer";
import { FaGlobe, FaFileAlt, FaQuestionCircle, FaInfoCircle } from "react-icons/fa";


const CardsPage = () => {
  const [activeTab, setActiveTab] = useState("event-details");

  const tabs = [
    {
      key: "event-details",
      icon: <FaInfoCircle />,
      label: "Event Details",
      title: "Website Review Check Text",
      content:
        "Because it's about motivating the doers. Because I'm here to follow my dreams and inspire other people to follow their dreams, too.",
    },
    {
      key: "speaker",
      icon: <FaFileAlt />,
      label: "Speaker",
      title: "The place is close to Barceloneta",
      content:
        "The reading of all good books is like a conversation with the finest minds of past centuries. Follow my dreams and inspire other people.",
    },
    {
      key: "more-info",
      icon: <FaQuestionCircle />,
      label: "More Info",
      title: "Close to Barceloneta",
      content:
        "Comparing yourself to others is the thief of joy. The reading of all good books is like a conversation.",
    },
  ];

  const imageUrls = [
    `${import.meta.env.BASE_URL}/ROIFS_1.0.1.png`,
    "https://images.unsplash.com/photo-1583337130417-3346a1d3a5fd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=800&q=80",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavbarDefault />

      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imageUrls.map((url, index) => (
            <div
              key={index}
              className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-full h-[500px] flex-grow"
            >
              {/* Image at the top */}
              <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
                <img
                  src={url}
                  alt={`card-${index}`}
                  className="object-cover w-full h-full rounded-md"
                />
              </div>

              {/* Tabs */}
              <ul
                className="relative flex flex-wrap justify-around px-2 py-1 list-none rounded-md bg-slate-100 mx-2"
                role="tablist"
              >
                {tabs.map((tab) => (
                  <li key={tab.key} className="flex-auto text-center">
                    <button
                      className={`flex items-center justify-center gap-1 w-full px-1 py-2 text-sm rounded-md transition-all ${
                        activeTab === tab.key
                          ? "bg-slate-300 text-slate-800 font-medium"
                          : "bg-slate-100 text-slate-600"
                      }`}
                      onClick={() => setActiveTab(tab.key)}
                      role="tab"
                    >
                      {tab.icon} {tab.label}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Text below tabs */}
              <div className="flex flex-col flex-grow p-4">
                <div>
                  <h5 className="mb-2 text-slate-800 text-lg font-semibold">
                    {tabs.find((t) => t.key === activeTab).title}
                  </h5>
                  <p className="text-slate-600 leading-normal font-light">
                    {tabs.find((t) => t.key === activeTab).content}
                  </p>
                </div>
                <div className="mt-auto">
                  <button className="mt-4 px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800">
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <FooterWithSocialLinks />
    </div>
  );
};

export default CardsPage;