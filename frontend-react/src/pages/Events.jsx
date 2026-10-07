import React from "react";
import { NavbarDefault } from "../components/Navbar";
import { FooterWithSocialLinks } from "../components/Footer";
import eventData from "../data/events.yml";
import site from "../data/site.yml";
import { asset } from "../lib/asset";

// Event link icons in display order; only links present in events.yml show.
const LINK_ICONS = [
  { key: "youtube", image: "yt.png", alt: "Visit Youtube" },
  { key: "linkedin", image: "li.png", alt: "Visit LinkedIn" },
  { key: "material", image: "folder.svg", alt: "Access Slides" },
  { key: "instagram", image: "instagram.jpeg", alt: "Visit Instagram" },
];

function showPlaceholder(e) {
  e.currentTarget.onerror = null;
  e.currentTarget.src = asset(site.placeholderImage);
}

function Detail({ label, value }) {
  if (value == null) return null;
  return <p className="text-sm text-gray-500">{label}: {value}</p>;
}

function LinkIcons({ links }) {
  const present = LINK_ICONS.filter(({ key }) => links?.[key]);
  if (!present.length) return null;
  return (
    <div className="flex gap-4 mt-3">
      {present.map(({ key, image, alt }) => (
        <a
          key={key}
          href={links[key]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-1"
        >
          <img src={asset(image)} alt={alt} className="h-6 w-6 object-contain" />
        </a>
      ))}
    </div>
  );
}

function Logos({ logos }) {
  return (
    <div className="flex justify-center mt-4 gap-2">
      {logos?.map((logo) => (
        <img key={logo} src={asset(logo)} alt="" className="h-8 w-8 object-contain" />
      ))}
    </div>
  );
}

// Wide card: poster beside the full event details.
function FeatureCard({ event, logos }) {
  return (
    <div
      className="flex flex-col lg:flex-row items-center bg-white shadow-md rounded-lg overflow-hidden mb-12 mx-auto min-h-[300px]"
      style={{ width: "85%" }}
    >
      <div className="w-full lg:w-1/2 h-full">
        <img
          src={asset(event.poster)}
          alt={event.name}
          className="w-full h-80 object-scale-down"
          onError={showPlaceholder}
        />
      </div>
      <div className="w-full lg:w-1/2 p-6 flex flex-col justify-center h-full">
        <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
        <div>
          {event.date && <p className="text-sm text-gray-500">{event.date}</p>}
          <Detail label="Term" value={event.term} />
          <Detail label="Series" value={event.series} />
          <Detail label="Episode" value={event.episode} />
          <Detail label="Topic" value={event.topic} />
          {event.guestSpeaker && (
            <p className="text-sm text-gray-500">
              Guest Speaker: <br /> &nbsp; &nbsp;{event.guestSpeaker}
            </p>
          )}
          {event.hosts && (
            <>
              <p className="text-sm text-gray-500">Host:</p>
              <ul className="text-sm text-gray-500 pl-6">
                {event.hosts.map((host) => (
                  <li key={host}>{host}</li>
                ))}
              </ul>
            </>
          )}
          <LinkIcons links={event.links} />
        </div>
        <Logos logos={logos} />
      </div>
    </div>
  );
}

// Compact grid card; YouTube/material links appear over the poster on hover.
function GridCard({ event, logos }) {
  const { material, youtube, instagram } = event.links ?? {};
  return (
    <div className="relative bg-white shadow-md rounded-lg overflow-hidden">
      <div className="group relative">
        <img
          src={asset(event.poster)}
          alt={event.name}
          className="w-full h-64 object-cover"
          onError={showPlaceholder}
        />
        {(material || youtube) && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {material && (
              <a
                href={material}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black py-2 px-4 rounded mb-2 hover:bg-gray-200"
              >
                Event's Material
              </a>
            )}
            {youtube && (
              <a
                href={youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black py-2 px-4 rounded hover:bg-gray-200"
              >
                YouTube Link
              </a>
            )}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-1">{event.name}</h3>
        <div className="flex justify-between items-start">
          <div>
            <Detail label="Term" value={event.term} />
            <p className="text-sm text-gray-500">{event.type}</p>
            {event.date && <p className="text-sm text-gray-500">{event.date}</p>}
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1"
              >
                <img
                  src={asset("instagram.jpeg")}
                  alt="Visit Instagram"
                  className="h-6 w-6 object-contain"
                />
              </a>
            )}
          </div>
          <Logos logos={logos} />
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  return (
    <>
      <NavbarDefault />
      <div className="max-w-7xl mx-auto px-4 py-16">
        {eventData.sections.map((section, i) => {
          const events = eventData.events.filter((e) => e.type === section.type);
          const isCard = section.layout === "card";
          return (
            <React.Fragment key={section.title}>
              {i > 0 && <hr className="my-12 border-gray-300" />}
              <div className={isCard ? "" : "mx-auto mb-16"}>
                <h2 className="text-3xl font-bold text-blue-gray-900 mb-8 border-l-4 border-teal-950 pl-4">
                  {section.title}
                </h2>
                {isCard ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event, j) => (
                      <GridCard key={`${event.name}-${j}`} event={event} logos={section.logos} />
                    ))}
                  </div>
                ) : (
                  events.map((event, j) => (
                    <FeatureCard key={`${event.name}-${j}`} event={event} logos={section.logos} />
                  ))
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <FooterWithSocialLinks />
    </>
  );
}
