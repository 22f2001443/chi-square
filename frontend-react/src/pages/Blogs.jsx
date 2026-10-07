import React, { useState } from "react";
import { NavbarDefault } from "../components/Navbar";
import { FooterWithSocialLinks } from "../components/Footer";
import blogs from "../data/blogs.yml";
import { asset } from "../lib/asset";

export default function Blogs() {
  const allBlogs = blogs.posts;

  const [visibleCount, setVisibleCount] = useState(blogs.pageSize);
  const visibleBlogs = allBlogs.slice(0, visibleCount);
  const showMore = () => setVisibleCount((prev) => prev + blogs.pageSize);

  return (
    <>
      <NavbarDefault />
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="w-full text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 leading-[3.25rem] mb-5">
              {blogs.title} <span className="text-indigo-600">{blogs.titleHighlight}</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {blogs.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {visibleBlogs.map((blog, index) => (
              <a
                key={index}
                href={blog.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white shadow-lg rounded-xl overflow-hidden relative block hover:shadow-2xl hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="relative">
                  <img src={asset(blog.image)} alt={blog.title} className="w-full h-64 object-cover" />
                  <div className="absolute top-2 right-2 bg-white/80 p-1 shadow-md">
                    <img
                      src={asset("li.png")}
                      alt="LinkedIn"
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                    <p className="text-sm">{blog.readTime} — {blog.date}</p>
                    <h3 className="font-semibold text-lg mt-1">{blog.title}</h3>
                    <p className="text-sm mt-2">{blogs.byline}</p>
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
