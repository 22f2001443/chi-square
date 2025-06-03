import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { NavbarDefault } from "../components/Navbar";
import { FooterWithSocialLinks } from "../components/Footer";

const PAST_EVENTS_CSV_URL ="https://docs.google.com/spreadsheets/d/e/2PACX-1vRdccnsHaKg9Qlx8hOfpAIx4d7GLI_qKpoAjAPy470FHYjM_CEtEnqdWjz2APvXwPmkG74RsOajDs21/pub?gid=0&single=true&output=csv"
export default function Events() {
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    fetch(PAST_EVENTS_CSV_URL)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            setPastEvents(results.data);
          },
        });
      });
  }, []);

  // Example hardcoded upcoming events
  const upcomingEvents = [
    {
      title: "Upcoming Event Title",
      description: "Short description of the upcoming event goes here.",
      date: "2025-06-10",
      link: "#",
    },
    // Add more upcoming events here if you want
  ];

  return (
    <>
      <NavbarDefault />
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Upcoming Events */}
        <h1 className="text-4xl font-bold underline underline-offset-4 decoration-black text-center mb-8 text-blue-gray-900">
          Upcoming Events
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {upcomingEvents.map((event) => (
            <div
              key={event.title}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-700 mb-4">{event.description}</p>
                <p className="text-sm text-gray-500 mb-4">{event.date}</p>
              </div>
              <a
                href={event.link}
                className="text-blue-500 hover:underline self-start"
              >
                Learn More
              </a>
            </div>
          ))}
        </div>

        {/* Past Events */}
        <h1 className="text-4xl font-bold underline underline-offset-4 decoration-black text-center mb-8 text-blue-gray-900">
          Past Events
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents
            .sort((a, b) => {
              const dateA = Date.parse(a.Event_Date);
              const dateB = Date.parse(b.Event_Date);
              return dateB - dateA;
            })
            .map((event) => (
              <div
                key={event.Event_Name}
                className="relative bg-white shadow-md rounded-lg overflow-hidden"
              >
                <div className="group relative">
                  <img
                    src={`${import.meta.env.BASE_URL}/Posters/${event.Event_Code}.png` || "https://via.placeholder.com/400x250?text=No+Image"}
                    alt={event.Event_Name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={event.materialLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-black py-2 px-4 rounded mb-2 hover:bg-gray-200"
                    >
                      Event's Material
                    </a>
                    <a
                      href={event.youtubeLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-black py-2 px-4 rounded hover:bg-gray-200"
                    >
                      YouTube Link
                    </a>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-1">{event.Event_Name}</h3>
                  <p className="text-sm text-gray-500">Term: {event.Term}</p>
                  <p className="text-sm text-gray-500">{event.Type}</p>
                  <p className="text-sm text-gray-500">{event.Event_Date}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
      <FooterWithSocialLinks />
    </>
  );
}