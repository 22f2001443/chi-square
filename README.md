# Nilgiri House Statistics Community

Official website of the Nilgiri House Statistics Community (earlier known as Chi-Square Statistics Club), IIT Madras BS Degree Program.

🌐 Live Website: https://22f2001443.github.io/chi-square/

Description

## 🚀 Features

- Event announcements
- Past event archives
- Member profiles
- Resources section
- Contact form

## 🛠 Tech Stack

- React
- Tailwind CSS
- GitHub Pages (static hosting)

## ✏️ Editing Content

All text, links, people and events live in YAML files under
`frontend-react/src/data/`. To update the site, edit these files; no JSX
changes are needed.

| File | What it controls |
| --- | --- |
| `site.yml` | Site name, logo, footer links, social links, maintenance message |
| `navigation.yml` | Top navigation bar and dropdowns |
| `home.yml` | Home page flyer, stats, announcements, backers |
| `about.yml` | About Us page text, joining buttons, testimonials |
| `people.yml` | Core team, collaborators, volunteers, past members |
| `events.yml` | Past events and how they are grouped on the Events page |
| `upcoming.yml` | Upcoming event cards |
| `courses.yml` | Course material links |
| `blogs.yml` | Blog posts |

Image paths are relative to `frontend-react/public/`; full URLs also work.
Links starting with `/` (e.g. `/people`) are pages on this site.

Everything in these files is published, so never add email addresses, phone
numbers or API keys to them.

## 📁 Project Structure

```
.
├── frontend-react/
│   ├── public/
│   │   └── ...
│   ├── src/
│   │   ├── data/          ← all site content (YAML)
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── SmartLink.jsx
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── 404.html
│   ├── BUGS.md
│   ├── postcss.config.cjs
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── package.json
│   └── package-lock.json
└── README.md
```
