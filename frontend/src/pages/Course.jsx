import React from "react";
import { NavbarDefault } from "../components/Navbar";
import { FooterWithSocialLinks } from "../components/Footer";
import { FaYoutube, FaFileAlt, FaQuestionCircle, FaGlobe } from "react-icons/fa";

export default function CourseMaterial() {
  const courses = [
    {
      title: "Statistics for Data Science I",
      courseId: "BSMA1002",
      level: "Foundation",
      youtube: "https://youtube.com/playlist?list=PLZ2ps__7DhBYrMs3zybOqr1DzMFCX49xG&si=PCfPl7V2H3ksTn5R",
      image: `${import.meta.env.BASE_URL}/c/stst1.jpg`, // or a URL
      notes: "https://drive.google.com/drive/folders/1FrecYyDxfFbCj2RVEsTWX4KWF1xTcIA4?usp=sharing",
      pyqs: "https://drive.google.com/drive/folders/1wDnw3n0rOe0mS8C5vWPFMFp8Dt6ODA4P?usp=drive_link",
      web:"https://study.iitm.ac.in/ds/course_pages/BSMA1002.html",
    },
    {
      title: "Statistics for Data Science II",
      courseId: "BSMA1004",
      level: "Foundation",
      youtube: "https://youtube.com/playlist?list=PLZ2ps__7DhBbLZ6RdNTIXvFdaMpvqagt0&si=0gwtSHl8KXae1uT7",
      notes: "#",
      image: `${import.meta.env.BASE_URL}/c/c.png`, // or a URL
      pyqs: "#",
      web:"https://study.iitm.ac.in/ds/course_pages/BSMA1004.html"
    },
    
  ];

  return (
    <>
      <NavbarDefault />
     <div className="flex flex-col items-start px-4 bg-gray-50 min-h-screen w-[90%] mx-auto mt-6">
        <h2 className="text-3xl font-bold text-blue-gray-900 mb-8 border-l-4 border-teal-950 pl-4 text-left pt-4">            Get help with courses
          </h2>
<div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">    
        {courses.map((course, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6 text-center">
                <img
  src={course.image}
  alt={course.title}
  className="w-full h-40 object-cover rounded-md mb-4"
/>
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-700 mb-1">Course ID: {course.courseId}</p>
              <p className="text-gray-700 mb-4">Level: {course.level}</p>
              <div className="flex justify-center gap-6 mt-4 text-2xl text-blue-600">
                <a href={course.youtube} target="_blank" rel="noopener noreferrer" title="YouTube Playlist">
                  <FaYoutube />
                </a>
                <a href={course.notes} target="_blank" rel="noopener noreferrer" title="Course Notes">
                  <FaFileAlt />
                </a>
                <a href={course.pyqs} target="_blank" rel="noopener noreferrer" title="Previous Year Questions">
                  <FaQuestionCircle />
                </a>
                <a href={course.web} target="_blank" rel="noopener noreferrer" title="Course Page">
                  <FaGlobe/>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FooterWithSocialLinks />
    </>
  );
}
