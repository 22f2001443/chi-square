import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { NavbarDefault } from "../components/Navbar";
import { FooterWithSocialLinks } from "../components/Footer";

export default function SocietyMessage() {
  return (
    <>
      <NavbarDefault />
      <div className="relative bg-white py-16 px-4">
        {/* Background Title */}
        <h1 className="text-[36px] sm:text-[60px] md:text-[72px] lg:text-[96px] xl:text-[108px] tracking-wide text-center font-bold absolute inset-x-0 top-1 sm:-top-4 bg-gradient-to-b from-black to-slate-50 inline-block text-transparent bg-clip-text opacity-10 pointer-events-none uppercase whitespace-nowrap overflow-x-auto px-2">
          society's message
        </h1>

        {/* Main Heading */}
        <div className="flex justify-center items-center py-6 xs:py-3 xl:py-8 md:py-5 border-b-2 border-[#861e1d] relative z-10">
          <h1 className="text-[24px] sm:text-[36px] md:text-[44px] lg:text-[56px] xl:text-[64px] font-medium uppercase whitespace-nowrap overflow-x-auto px-2">
            society's message
          </h1>
        </div>

        {/* Example Message Section */}
        <div className="max-w-4xl mx-auto mt-12 text-center relative z-10">
          <p className="text-lg text-gray-700 leading-relaxed">
            Welcome to the Chi-Square Statistics Club. Our mission is to cultivate statistical curiosity and empower students through data-driven initiatives, academic discussions, and collaborative events. Whether you're new to statistics or already immersed in it, our society welcomes you to grow, connect, and contribute.
          </p>
        </div>
      </div>
      <FooterWithSocialLinks />
    </>
  );
}