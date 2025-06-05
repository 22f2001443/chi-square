import React, { useState } from "react";
import { NavbarDefault } from "../components/Navbar";
import { FooterWithSocialLinks } from "../components/Footer";

export default function Blogs() {
  const allBlogs = [
    {
      id: 1,
      title: "Improved Pre-trained models for Sanskrit NLU",
      date: "18th April 2025",
      readTime: "1 min read",
      image: "https://your-image-url.com/sanskrit.png",
      linkedinLink: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7335920963437346816",
    },
    {
      id: 2,
      title: "Improved Pre-trained models for Sanskrit NLU",
      date: "18th April 2025",
      readTime: "1 min read",
      image: "https://your-image-url.com/sanskrit.png",
      linkedinLink: "https://www.linkedin.com/feed/update/urn:li:share:XXXXXXX",
    },
    {
      id: 3,
      title: "Improved Pre-trained models for Sanskrit NLU",
      date: "18th April 2025",
      readTime: "1 min read",
      image: "https://your-image-url.com/sanskrit.png",
      linkedinLink: "https://www.linkedin.com/feed/update/urn:li:share:XXXXXXX",
    },
    {
      id: 4,
      title: "Improved Pre-trained models for Sanskrit NLU",
      date: "18th April 2025",
      readTime: "1 min read",
      image: "https://your-image-url.com/sanskrit.png",
      linkedinLink: "https://www.linkedin.com/feed/update/urn:li:share:XXXXXXX",
    },
    {
      id: 5,
      title: "Improved Pre-trained models for Sanskrit NLU",
      date: "18th April 2025",
      readTime: "1 min read",
      image: "https://your-image-url.com/sanskrit.png",
      linkedinLink: "https://www.linkedin.com/feed/update/urn:li:share:XXXXXXX",
    },
    {
      id: 6,
      title: "Improved Pre-trained models for Sanskrit NLU",
      date: "18th April 2025",
      readTime: "1 min read",
      image: "https://your-image-url.com/sanskrit.png",
      linkedinLink: "https://www.linkedin.com/feed/update/urn:li:share:XXXXXXX",
    },
    {
      id: 7,
      title: "Improved Pre-trained models for Sanskrit NLU",
      date: "18th April 2025",
      readTime: "1 min read",
      image: "https://your-image-url.com/sanskrit.png",
      linkedinLink: "https://www.linkedin.com/feed/update/urn:li:share:XXXXXXX",
    },
    {
      id: 8,
      title: "Improved Pre-trained models for Sanskrit NLU",
      date: "18th April 2025",
      readTime: "1 min read",
      image: "https://your-image-url.com/sanskrit.png",
      linkedinLink: "https://www.linkedin.com/feed/update/urn:li:share:XXXXXXX",
    },
    {
      id: 9,
      title: "Improved Pre-trained models for Sanskrit NLU",
      date: "18th April 2025",
      readTime: "1 min read",
      image: "https://your-image-url.com/sanskrit.png",
      linkedinLink: "https://www.linkedin.com/feed/update/urn:li:share:XXXXXXX",
    },
  ];

  const [visibleCount, setVisibleCount] = useState(6);
  const visibleBlogs = allBlogs.slice(0, visibleCount);
  const showMore = () => setVisibleCount((prev) => prev + 6);

  return (
    <>
      <NavbarDefault />
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="w-full text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 leading-[3.25rem] mb-5">
              Our latest <span className="text-indigo-600">blogs</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Welcome to our blog section, where knowledge meets inspiration. Explore insightful articles, expert tips, and the latest trends in our field.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {visibleBlogs.map((blog) => (
              <a
                key={blog.id}
                href={blog.linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white shadow-lg rounded-xl overflow-hidden relative block hover:shadow-2xl hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="relative">
                  <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover" />
                  <div className="absolute top-2 right-2 bg-white/80 p-1 shadow-md">
                    <img
                      src={`${import.meta.env.BASE_URL}/li.png`}
                      alt="LinkedIn"
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                    <p className="text-sm">{blog.readTime} — {blog.date}</p>
                    <h3 className="font-semibold text-lg mt-1">{blog.title}</h3>
                    <p className="text-sm mt-2">Chi: Squuare - Statitics Club</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {visibleCount < allBlogs.length && (
            <div className="flex justify-center mt-8">
              <button
                className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition"
                onClick={showMore}
              >
                Show More
              </button>
            </div>
          )}
        </div>
      </section>
      <FooterWithSocialLinks />
    </>
  );
}
