import React from "react";
import { Link } from "react-router-dom";
import { NavbarDefault } from "../components/Navbar";
import { FooterWithSocialLinks } from "../components/Footer";
import home from "../data/home.yml";
import { asset } from "../lib/asset";

function Home() {
  return (
    <>
<NavbarDefault />
      <main className="p-0">
        <div className="my-0">
          <img src={asset(home.hero.image)} alt={home.hero.alt} className="w-full h-auto rounded-none shadow-none" />
        </div>
<section className="w-full bg-white text-gray-800 py-16">
  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-16 px-4 justify-center items-center text-center place-items-center">
    {home.stats.map((stat) => (
      <div key={stat.label} className="flex items-center gap-6">
        <h2 className="text-6xl font-bold  text-teal-950 border-r-4 border-teal-950 pr-4">{stat.value}</h2>
        <p className="text-xl font-medium leading-tight whitespace-pre-line">
          {stat.label}
        </p>
      </div>
    ))}
  </div>
</section>
<section className="w-full bg-white text-gray-800 py-16">
  <div className="max-w-6xl mx-auto px-4 text-center">
    <h2 className="text-3xl font-bold mb-10 text-teal-950">{home.announcements.title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
      {home.announcements.items.map((item) => (
        <div key={item.image} className="group relative w-full max-w-sm">
          <img src={asset(item.image)} alt={item.alt} className="w-full border-4 border-white shadow-lg" />
          {item.to && (
            <Link to={item.to} className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-teal-950 text-white py-2 px-4 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.cta}
            </Link>
          )}
        </div>
      ))}
    </div>
  </div>
</section>
      <section className="w-full bg-gray-50 text-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10 text-teal-950">{home.backers.title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 justify-items-center place-items-center">
            {home.backers.logos.map((logo) => (
              <img key={logo.image} src={asset(logo.image)} alt={logo.alt} className="mx-auto h-20 object-contain" />
            ))}
          </div>
        </div>
      </section>
      </main>
      <FooterWithSocialLinks/>
    </>

  );
}

export default Home;
