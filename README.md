# Chi-Square: Statistics Interest Group

Official website of the Chi-Square: Statistics Interest Group (earlier known as Chi-Square Statistics Club), IIT Madras BS Degree Program.

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
| `site.yml` | Site name (use `%SITE_NAME%` elsewhere to insert it), short name and tagline, description, logo, footer, social links, collaborators and their logos |
| `navigation.yml` | Top navigation bar |
| `home.yml` | Home page hero, stats, latest events, "What we do", partners, join band |
| `events.yml` | Our Journey timeline: every past event, plus the kinds of event and their colours |
| `series.yml` | Event series names and topics, referenced from `events.yml` |
| `upcoming.yml` | Upcoming events (with a template to copy) |
| `people.yml` | Core team, collaborators, volunteers and alumni |
| `about.yml` | About Us page |
| `courses.yml` | Resources page: course materials and library |
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
│   │   ├── components/    ← Layout, Navbar, Footer and shared UI
│   │   ├── lib/           ← event and asset helpers
│   │   ├── pages/
│   │   ├── styles/        ← Tailwind theme and timeline animation
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── 404.html
│   ├── BUGS.md
│   ├── postcss.config.cjs
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── package.json
│   └── package-lock.json
└── README.md
```
