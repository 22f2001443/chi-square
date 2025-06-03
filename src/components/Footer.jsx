import { Typography } from "@material-tailwind/react";

const LINKS = [
  {
    title: "Quick Links",
    items: [
      { label: "IIT Madras BS Degree", href: "https://study.iitm.ac.in/ds/" },
      { label: "Nilgiri House", href: "https://sites.google.com/ds.study.iitm.ac.in/nilgirihouse" },
      { label: "RaSoR Society", href: "https://rasoriitm.vercel.app/" },
    ],
  },
  {
    title: "Club",
    items: [
      { label: "About us", href: "#" },
      { label: "People", href: "#" },
      { label: "Resources", href: "#" },
      { label: "News", href: "#" },
    ],
  },
  {
    title: "Resource",
    items: [
      { label: "Blog", href: "#" },
      { label: "Newsletter", href: "#" },
      { label: "Events", href: "/events" },
      { label: "Help center", href: "#" },
    ],
  },
];

const currentYear = new Date().getFullYear();

export function FooterWithSocialLinks() {
  return (
    <footer className="relative w-full">
      <div className="mx-auto w-full max-w-7xl px-8">
        <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2">
          <div>
            <Typography
              as="a"
              href="/"
              className="cursor-pointer font-bold text-2xl text-blue-gray-900"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Chi-Square: Statistics Club
            </Typography>
            <br />
            <Typography
              as="a"
              href="#"
              className="cursor-pointer text-sm text-blue-gray-700"
              style={{ fontFamily: "sans-serif" }}
            >
              Hosted by <b>NILGIRI HOUSE</b>
            </Typography>
            <br />
            <Typography
              as="a"
              href="#"
              className="cursor-pointer text-sm text-blue-gray-700"
              style={{ fontFamily: "sans-serif" }}
            >
              <b>BS Degree, Indian Institute of Technology Madras</b>
              <br />
              Chennai, Tamil Nadu
            </Typography>
          </div>

          <div className="grid grid-cols-3 justify-between gap-4">
            {LINKS.map(({ title, items }) => (
              <ul key={title}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-3 font-medium opacity-40"
                >
                  {title}
                </Typography>
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Typography
                      as="a"
                      href={href}
                      color="gray"
                      className="py-1.5 font-normal transition-colors hover:text-blue-gray-900"
                      target={href.startsWith("http") ? "_blank" : "_self"}
                      rel={href.startsWith("http") ? "noopener noreferrer" : ""}
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
            &copy; {currentYear} Chi-Square: Statistics Club. All Rights Reserved.
          </Typography>
          <div className="flex gap-4 text-blue-gray-900 sm:justify-center">
            <Typography
              as="a"
              href="https://www.linkedin.com/company/chi-square-statistics-club/"
              target="_blank"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                alt="LinkedIn"
                className="h-5 w-5"
              />
            </Typography>
            <Typography
              as="a"
              href="https://www.instagram.com/chisquare_iitmbs/"
              target="_blank"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                alt="Instagram"
                className="h-5 w-5"
              />
            </Typography>
            <Typography
              as="a"
              href="https://www.youtube.com/watch?v=lTGWGsamhxg&list=PLdPxneWYhyUP2lsZWjhkRYM8KB_Rg8wln"
              target="_blank"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
                alt="YouTube"
                className="h-5 w-5"
              />
            </Typography>
            <Typography
              as="a"
              href="https://github.com/22f2001443/chi-square"
              target="_blank"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                alt="GitHub"
                className="h-5 w-5"
              />
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
}