import { Link } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import SmartLink from "./SmartLink";
import site from "../data/site.yml";

const currentYear = new Date().getFullYear();

export function FooterWithSocialLinks() {
  const { footer, socials } = site;

  return (
    <footer className="relative w-full">
      <div className="mx-auto w-full max-w-7xl px-8">
        <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2">
          <div>
            <Typography
              as={Link}
              to="/"
              className="cursor-pointer font-bold text-2xl text-blue-gray-900"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              {site.name}
            </Typography>
            <br />
            <Typography
              as="a"
              href="#"
              className="cursor-pointer text-sm text-blue-gray-700"
              style={{ fontFamily: "sans-serif" }}
            >
              Hosted by <b>{footer.hostedBy}</b>
            </Typography>
            <br />
            <Typography
              as="a"
              href="#"
              className="cursor-pointer text-sm text-blue-gray-700"
              style={{ fontFamily: "sans-serif" }}
            >
              <b>{footer.institution}</b>
              <br />
              {footer.location}
            </Typography>
          </div>

          <div className="grid grid-cols-4 justify-between gap-4">
            {footer.linkGroups.map(({ title, links }) => (
              <ul key={title}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-3 font-medium opacity-40"
                >
                  {title}
                </Typography>
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Typography
                      as={SmartLink}
                      href={href}
                      color="gray"
                      className="py-1.5 font-normal transition-colors hover:text-blue-gray-900"
                    >
                      {label}
                    </Typography>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <div className="mt-12 flex w-full flex-col items-center justify-center border-t border-blue-gray-50 py-4 md:flex-row md:justify-between">
          <Typography
            variant="small"
            className="mb-4 text-center font-normal text-blue-gray-900 md:mb-0"
          >
            &copy; {currentYear} {site.name}. All Rights Reserved.
          </Typography>
          <div className="flex gap-4 text-blue-gray-900 sm:justify-center">
            {socials.map(({ label, href, icon }) => (
              <Typography
                key={label}
                as={SmartLink}
                href={href}
                className="opacity-80 transition-opacity hover:opacity-100"
              >
                <img src={icon} alt={label} className="h-5 w-5" />
              </Typography>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
