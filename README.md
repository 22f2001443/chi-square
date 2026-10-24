# Chi-Square: Statistics Interest Group

Official website of the Chi-Square: Statistics Interest Group (earlier known as Chi-Square Statistics Club), IIT Madras BS Degree Program.

🌐 Live Website: https://chi-square.vercel.app

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
| `series.yml` | Shared series names, topics and dropdown groups, referenced from `events.yml` and `upcoming.yml` |
| `upcoming.yml` | Upcoming events (with a template to copy) |
| `people.yml` | Core team, collaborators, volunteers and alumni |
| `about.yml` | About Us page |
| `courses.yml` | Resources page: course materials and library |
| `blogs.yml` | Blog posts |

To switch a page or a section off without deleting it, set it to `false` in
`frontend-react/src/config/features.yml`.

Image paths are relative to `frontend-react/public/`; full URLs also work.
Links starting with `/` (e.g. `/people`) are pages on this site.

Keep individual event details in `events.yml` or `upcoming.yml`. Their optional
`series` field must match a key in `series.yml`; several events can share that
key. In `series.yml`, `name` and `topic` supply the event card's series label.
Academic talks and Contests have series dropdowns, each showing only series
used by that event format. Set the same `group` text on related series to combine
them: `GE01`, `GE02` and `PP101` all use `group: Guest lectures`.
Without a group, a series gets its own dropdown option. Keep an event's unique
`id` separate from its shared `series` code.

For event posters hosted in Vercel Blob, set `posterBaseUrl` once in
`site.yml`. Give each event a unique, stable `id` (for example,
`probability-session-2027`) and upload its poster as
`poster/probability-session-2027.webp` to that store, without a random filename
suffix. Omit `poster` to use this convention. An explicit `poster` URL or local
path takes precedence, including for images with another extension. The same
helper handles past and upcoming events; missing images show the existing
fallback. Keep `series` for grouping related events and keep an event's `id`
when moving it from upcoming to past events. Upload image files from outside
the repository so only the YAML configuration goes into Git.

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
│   │   ├── config/        ← feature flags (features.yml) and their helpers
│   │   ├── components/    ← Layout, Navbar, Footer and shared UI
│   │   ├── lib/           ← event and asset helpers
│   │   ├── pages/         ← one folder per page (see below)
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

### Pages

A page with parts of its own is a folder: `index.jsx` lays the page out, and
`components/` holds its sections. A part used by only one section lives inside
that section's folder, the same way down:

```
pages/
├── Home/
│   ├── index.jsx                    ← which sections show, in order
│   └── components/
│       ├── HeroSection.jsx
│       ├── LatestSection/
│       │   ├── index.jsx
│       │   └── components/
│       │       ├── EventCard.jsx
│       │       └── PosterOrCode.jsx
│       └── ...
├── Blogs.jsx                        ← a page with no parts stays one file
└── NotFound.jsx
```

Each section reads its own YAML from `src/data/` and renders nothing when
that content is empty; the page's `index.jsx` only applies the feature flags.
Components shared by several pages stay in `src/components/`. Import from
`src/` with `@/` (e.g. `@/components/Layout`) rather than `../../..`.
