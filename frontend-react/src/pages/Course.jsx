import React from "react";
import { NavbarDefault } from "../components/Navbar";
import { FooterWithSocialLinks } from "../components/Footer";
import { FaYoutube, FaFileAlt, FaQuestionCircle, FaGlobe } from "react-icons/fa";
import courseData from "../data/courses.yml";
import { asset } from "../lib/asset";

// Link keys allowed in courses.yml, in display order.
const LINK_TYPES = [
  { key: "youtube", icon: FaYoutube, title: "YouTube Playlist" },
  { key: "notes", icon: FaFileAlt, title: "Course Notes" },
  { key: "pyqs", icon: FaQuestionCircle, title: "Previous Year Questions" },
  { key: "web", icon: FaGlobe, title: "Course Page" },
];

export default function CourseMaterial() {
  return (
    <>
      <NavbarDefault />
     <div className="flex flex-col items-start px-4 bg-gray-50 min-h-screen w-[90%] mx-auto mt-6">
        <h2 className="text-3xl font-bold text-blue-gray-900 mb-8 border-l-4 border-teal-950 pl-4 text-left pt-4">
          {courseData.title}
          </h2>
<div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {courseData.courses.map((course) => (
            <div key={course.courseId} className="bg-white shadow-md rounded-lg p-6 text-center">
                <img
  src={asset(course.image)}
  alt={course.title}
  className="w-full h-40 object-cover rounded-md mb-4"
/>
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-700 mb-1">Course ID: {course.courseId}</p>
              <p className="text-gray-700 mb-4">Level: {course.level}</p>
              <div className="flex justify-center gap-6 mt-4 text-2xl text-blue-600">
                {LINK_TYPES.filter(({ key }) => course.links?.[key]).map(({ key, icon, title }) => {
                  const Icon = icon;
                  return (
                    <a key={key} href={course.links[key]} target="_blank" rel="noopener noreferrer" title={title}>
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <FooterWithSocialLinks />
    </>
  );
}
