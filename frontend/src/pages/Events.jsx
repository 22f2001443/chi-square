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


  return (
    <>
      <NavbarDefault />
      <div className="max-w-7xl mx-auto px-4 py-16">

        <div className="mx-auto mb-16">
          <h2 className="text-3xl font-bold text-blue-gray-900 mb-8 border-l-4 border-teal-950 pl-4">
            Workshops/BootCamps
          </h2>
          {pastEvents
            .filter((event) => event.Type === "Bootcamp / Workshops")
            .map((event) => (
              <div
                key={event.Event_Name}
                className="flex flex-col lg:flex-row items-center bg-white shadow-md rounded-lg overflow-hidden mb-12 mx-auto min-h-[300px]"
                style={{ width: "85%" }}
              >
                <div className="w-full lg:w-1/2 h-full">
                  <img
                    src={`${import.meta.env.BASE_URL}/Posters/${event.Event_Code}.png`}
                    alt={event.Event_Name}
                    className="w-full h-80 object-scale-down"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/600x400?text=No+Image";
                    }}
                  />
                </div>
                <div className="w-full lg:w-1/2 p-6 flex flex-col justify-center h-full">
                  <h3 className="text-2xl font-bold mb-2">{event.Event_Name}</h3>
                  <div>
                        <p className="text-sm text-gray-500">{event.Event_Date}</p>
                      <p className="text-sm text-gray-500">Term: {event.Term}</p>
                      <p className="text-sm text-gray-500">Series: {event.Series}</p>
                      <p className="text-sm text-gray-500">Episode: {event.Ep}</p>
                      <p className="text-sm text-gray-500">Topic: {event.Topic}</p>
                      {event.Guest_Speaker && event.Guest_Speaker.trim() !== "" && (
    <p className="text-sm text-gray-500">
      Guest Speaker: <br /> &nbsp; &nbsp;{event.Guest_Speaker}
    </p>
  )}
                      <p className="text-sm text-gray-500">Host: <br/> &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp;{event.Host_1_name}<br/> &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp; {event.Host_2_name}<br/> &nbsp; &nbsp;&nbsp;&nbsp; &nbsp; &nbsp;{event.Host_3_name}<br/> &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;{event.Host_4_name}</p>
                     <br/> <div><a
                        href={event.youtubeLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-1"
                      >
                        <img
                          src={`${import.meta.env.BASE_URL}/yt.png`}
                          alt="Visit Youtube"
                          className="h-6 w-6 object-contain"
                        />
                      </a>
                      &nbsp; &nbsp;
                      <a
                        href={event.LiLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-1"
                      >
                        <img
                          src={`${import.meta.env.BASE_URL}/li.png`}
                          alt="Visit LinkedIn"
                          className="h-6 w-6 object-contain"
                        />
                      </a>
                      &nbsp; &nbsp;
                      <a
                        href={event.materialLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-1"
                      >
                        <img
                          src={`${import.meta.env.BASE_URL}/folder.svg`}
                          alt="Access Slides"
                          className="h-6 w-6 object-contain"
                        />
                      </a>
                      </div>
                    </div>
                    {/* Logos */}
  <div className="flex justify-center mt-4 gap-2">
    <img
      src={`${import.meta.env.BASE_URL}/logo_t.png`}
      alt="Logo 1"
      className="h-8 w-8 object-contain"
    />

    <img
      src={`${import.meta.env.BASE_URL}/nil.png`}
      alt="Logo 2"
      className="h-8 w-8 object-contain"
    />
  </div>
                </div>
              </div>
            ))}
        </div>
        <hr className="my-12 border-gray-300" />
        
        <div className="mx-auto mb-16">
          <h2 className="text-3xl font-bold text-blue-gray-900 mb-8 border-l-4 border-teal-950 pl-4">
            Academic Talks
          </h2>
          {pastEvents
            .filter((event) => event.Type === "Academic Talks")
            .map((event) => (
              <div
                key={event.Event_Name}
                className="flex flex-col lg:flex-row items-center bg-white shadow-md rounded-lg overflow-hidden mb-12 mx-auto min-h-[300px]"
                style={{ width: "85%" }}
              >
                <div className="w-full lg:w-1/2 h-full">
                  <img
                    src={`${import.meta.env.BASE_URL}/Posters/${event.Event_Code}.png`}
                    alt={event.Event_Name}
                    className="w-full h-80 object-scale-down"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/600x400?text=No+Image";
                    }}
                  />
                </div>
                <div className="w-full lg:w-1/2 p-6 flex flex-col justify-center h-full">
                  <h3 className="text-2xl font-bold mb-2">{event.Event_Name}</h3>
                  <div>
                        <p className="text-sm text-gray-500">{event.Event_Date}</p>
                      <p className="text-sm text-gray-500">Term: {event.Term}</p>
                      <p className="text-sm text-gray-500">Series: {event.Series}</p>
                      <p className="text-sm text-gray-500">Episode: {event.Ep}</p>
                      <p className="text-sm text-gray-500">Topic: {event.Topic}</p>
                      {event.Guest_Speaker && event.Guest_Speaker.trim() !== "" && (
    <p className="text-sm text-gray-500">
      Guest Speaker: <br /> &nbsp; &nbsp;{event.Guest_Speaker}
    </p>
  )}
                      <p className="text-sm text-gray-500">Host: <br/> &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;{event.Host_1_name}<br/> &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; {event.Host_2_name}<br/> &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; {event.Host_3_name}<br/> &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; {event.Host_4_name}</p>
                      <a
                        href={event.youtubeLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-1"
                      >
                        <img
                          src={`${import.meta.env.BASE_URL}/yt.png`}
                          alt="Visit Youtube"
                          className="h-6 w-6 object-contain"
                        />
                      </a>
                      &nbsp; &nbsp;
                      <a
                        href={event.materialLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-1"
                      >
                        <img
                          src={`${import.meta.env.BASE_URL}/folder.svg`}
                          alt="Access Slides"
                          className="h-6 w-6 object-contain"
                        />
                      </a>
                    </div>
                    {/* Logos */}
  <div className="flex justify-center mt-4 gap-2">
    <img
      src={`${import.meta.env.BASE_URL}/logo_t.png`}
      alt="Logo 1"
      className="h-8 w-8 object-contain"
    />
    <img
      src={`${import.meta.env.BASE_URL}/nil.png`}
      alt="Logo 2"
      className="h-8 w-8 object-contain"
    />
  </div>
                </div>
              </div>
            ))}
        </div>
        <hr className="my-12 border-gray-300" />
        <h2 className="text-3xl font-bold text-blue-gray-900 mb-8 border-l-4 border-teal-950 pl-4">
          Revision Sessions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents
            .filter((event) => event.Type === "Revision Session")
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
                  <div className="flex justify-between items-start">
                    <div>

                      <p className="text-sm text-gray-500">Term: {event.Term}</p>
                      <p className="text-sm text-gray-500">{event.Type}</p>
                      <p className="text-sm text-gray-500">{event.Event_Date}</p>
                    </div>
                    <div className="flex justify-center mt-4 gap-2">
                      <img
                        src={`${import.meta.env.BASE_URL}/logo_t.png`}
                        alt="Logo 1"
                        className="h-8 w-8 object-contain"
                      />
                      <img
                        src={`${import.meta.env.BASE_URL}/nil.png`}
                        alt="Logo 2"
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <hr className="my-12 border-gray-300" />
        <h2 className="text-3xl font-bold text-blue-gray-900 mb-8 border-l-4 border-teal-950 pl-4">
          competitions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents
            .filter((event) => event.Type === "Contests")
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
                  
                </div>
                <div className="p-4">
                    <h3 className="text-xl font-bold mb-1">{event.Event_Name}</h3>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Term: {event.Term}</p>
                      <p className="text-sm text-gray-500">{event.Type}</p>
                      <a
                        href={event.youtubeLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-1"
                      >
                        <img
                          src={`${import.meta.env.BASE_URL}/instagram.jpeg`}
                          alt="Visit Instagram"
                          className="h-6 w-6 object-contain"
                        />
                      </a>
                    </div>
                    <div className="flex justify-center mt-4 gap-2">
                      <img
                        src={`${import.meta.env.BASE_URL}/logo_t.png`}
                        alt="Logo 1"
                        className="h-8 w-8 object-contain"
                      />
                      
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <FooterWithSocialLinks />
    </>
  );
}