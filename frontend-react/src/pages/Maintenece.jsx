import React from "react";
import { NavbarDefault } from "../components/Navbar";
import { FooterWithSocialLinks } from "../components/Footer";
import { Typography } from "@material-tailwind/react";
import { Settings } from "iconoir-react";

export default function MaintenancePage() {
  return (
    <>
      <NavbarDefault />
      <section className="min-h-screen grid place-items-center bg-gray-50 px-4 py-24">
        <div className="container mx-auto">
          <div className="text-center">
            <Settings className="h-16 w-16 mx-auto text-indigo-600" />
            <Typography
              as="h2"
              type="h5"
              className="my-6 max-w-xl mx-auto text-gray-800 text-2xl sm:text-3xl font-semibold"
            >
              This page is currently undergoing maintenance to improve your experience.
            </Typography>
            <Typography
              type="lead"
              className="text-gray-600 max-w-xl mx-auto"
            >
              Please bear with us while we make these enhancements. We&apos;ll be back shortly. Thank you for your patience!
            </Typography>
          </div>
        </div>
      </section>
      <FooterWithSocialLinks />
    </>
  );
}