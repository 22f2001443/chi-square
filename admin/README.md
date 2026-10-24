# Chi-Square Admin

A separate React + Vite + TypeScript app for editing the site's content: the
YAML files in `frontend-react/src/data/` and the feature flags in
`frontend-react/src/config/features.yml`. It uses Tailwind CSS 4, Radix-based
components in the shadcn style and Lucide icons, with the site's own tokens
(ink and paper, IBM Plex, one blue accent).

Edits are saved as **pending changes**. Nothing reaches the site until an owner
**publishes**, which writes every changed file at once. The site then rebuilds
from them like any other commit.

## Using it on your computer

Use Node 22.12+ (Node 24 recommended). From `admin/`:

```sh
npm install
npm run dev
```

Open the address Vite prints. Locally there is no sign-in, database or GitHub:
you are signed in as a local owner, edits are held in memory until you publish,
and publishing **writes the site's YAML files on disk**. Review them with
`git diff`, check the site with `npm run dev` in `frontend-react/`, and commit
as usual. Restarting the admin's dev server drops anything not yet published.

## What it edits

Every page of the site has a section in the sidebar (Home, Our Journey, Upcoming
events, People, About us, Resources, Blogs), plus Site settings (name,
navigation, footer, social links, collaborators) and Visibility (every page and
section switch in `features.yml`).

Lists open each entry in a dialog; objects are edited as forms; series are
edited by code; switches apply as pending changes like any other edit.
Selects take their choices from the content itself: an event's kind comes from
the kinds of event, its series from `series.yml`, its collaborator from Site
settings.

Saving keeps each file the way it was written:

- comments, key order and keys the admin doesn't know about are left alone;
- a value is changed in place, so its quoting and `>-` block style survive;
- folded text that wasn't edited keeps its line breaks byte for byte, and an
  edited one is re-wrapped to the same width;
- every save is read back with `js-yaml`, the parser that builds the site, and
  refused if it would read differently from what was edited.

Values are checked before they are saved: required fields, full URLs, image
paths inside `frontend-react/public`, colours, whole numbers. Email addresses
are refused everywhere, since everything in these files is published.

## How it is organised

```text
admin/
  api/index.ts          The one Vercel Function; every /api/* request lands here
  server/               The backend, framework-free
    app.ts              Routes, the sign-in gate, Origin and CSRF checks
    auth/github.ts      Sign in with GitHub, sessions
    content/            YAML editing, pending changes, publishing
      github.ts         Reads files and commits through GitHub's GraphQL API
      local.ts          The files on disk, for `npm run dev`
    store/              Neon (production) and in-memory (tests, dev) storage
    dev/                The Vite plugin that serves /api locally
  shared/
    collections.ts      The registry: every editable file, panel and field
    validate.ts         The value rules, run in the browser and on the server
  src/                  The browser app
    components/         layout/, admin/, panels/, editor/, ui/
    config/             Sidebar navigation, built from the registry
    views/              One folder per page
  tests/                node:test suites for the server
```

`shared/collections.ts` is the single source of truth. The sidebar, every
form and every server write are built from it, and a request names a panel,
never a file path, so nothing outside the registry can be written.

### Editing something new

To make a new field editable, add it to its panel in `shared/collections.ts`
(`text`, `textarea`, `link`, `url`, `image`, `number`, `color`, `select`,
`strings`, `group` or `list`). For a new list or object, add a panel to the
section it belongs to. No other code changes are needed.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

## Deploying on Vercel (not set up yet)

The admin is built to run as its own Vercel project, but it isn't deployed.
Nothing below needs doing to use it locally.

**Address.** `admin.chi-square.vercel.app` isn't possible: Vercel only gives
out one level of `*.vercel.app`, and `chi-square.vercel.app` belongs to the
site's project. Use something like `chi-square-admin.vercel.app`, or an
`admin.` subdomain of a domain you own.

1. **Project.** Import the repository in Vercel as a new project with Root
   Directory `admin`. `vercel.json` sets the build, the rewrites and the
   security headers.
2. **Database.** Connect the Neon database to this project (Storage → Neon),
   which sets `DATABASE_URL`. Then create the tables once:
   `DATABASE_URL=… npm run db:setup`.
3. **Sign-in.** Create a GitHub OAuth App (Settings → Developer settings →
   OAuth Apps) with callback URL `https://<admin address>/api/auth/callback`,
   and set `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET`.
4. **Owners.** Set `ADMIN_OWNERS` to the GitHub usernames that are always
   owners (comma-separated). Everyone else is added on the Members page.
5. **Publishing.** Create a fine-grained token with access to only
   `22f2001443/chi-square`, permission Contents: read and write, and set
   `GITHUB_TOKEN`. A GitHub App works too (`GITHUB_APP_ID`,
   `GITHUB_APP_INSTALLATION_ID`, `GITHUB_APP_PRIVATE_KEY`). Set
   `PUBLISH_BRANCH` to the branch Vercel deploys the site from (default `main`).
6. **Origin.** Set `ADMIN_ORIGIN` to the admin's exact address, like
   `https://chi-square-admin.vercel.app`.

`.env.example` lists them all. Until every one is set the admin stays shut: each
request answers 503 and the page names what's missing. Never put any of them in
a `VITE_*` variable.

### Security model

- Only members sign in. GitHub only confirms who someone is; its OAuth token is
  used once to read their profile and never stored. Sessions are random
  cookies (`__Host-`, HttpOnly, Secure) and the database holds only their hash.
- Roles are read on every request, so removing a member signs them out at
  once. `ADMIN_OWNERS` always wins, so the deployment can recover the admin.
- Every change needs this admin's exact Origin and the session's CSRF token.
- The repository is fixed in `server/config.ts` and the branch in Vercel's
  settings; the browser can choose neither. Edits carry the hash of the file
  they started from, so two editors can't overwrite each other, and a publish
  is refused if a file changed on GitHub since it was edited here.
- Editors edit and stage changes; owners publish and manage members. A publish
  is one commit crediting every editor with a `Co-authored-by` line.
