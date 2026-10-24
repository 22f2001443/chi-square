/**
 * The admin's map of the site: every file it may edit, and every part of each
 * file it knows how to edit. The browser builds its pages and forms from this
 * table; the server uses the same table to decide where a change may land. A
 * request names a panel, never a path, so nothing outside this table can be
 * written — and the site's GitHub token can write anywhere in the repository,
 * so this table is what keeps an edit inside frontend-react's data files.
 */

export const files = {
  site: 'frontend-react/src/data/site.yml',
  navigation: 'frontend-react/src/data/navigation.yml',
  home: 'frontend-react/src/data/home.yml',
  events: 'frontend-react/src/data/events.yml',
  series: 'frontend-react/src/data/series.yml',
  upcoming: 'frontend-react/src/data/upcoming.yml',
  people: 'frontend-react/src/data/people.yml',
  about: 'frontend-react/src/data/about.yml',
  courses: 'frontend-react/src/data/courses.yml',
  blogs: 'frontend-react/src/data/blogs.yml',
  features: 'frontend-react/src/config/features.yml',
} as const

export type FileId = keyof typeof files
export const fileIds = Object.keys(files) as FileId[]

/** Images in the site's YAML are relative to this folder. */
export const publicRoot = 'frontend-react/public'

export type YamlPath = readonly string[]

/**
 * - text, textarea: a string; text is one line
 * - link: a page on the site (`/events`) or a full URL
 * - url: a full URL
 * - image: a path relative to frontend-react/public, or a full URL
 * - number: a whole number, zero or more
 * - color: `#RRGGBB`
 * - select: one of `options`, or of the values `optionsFrom` reads from content
 * - strings: a list of strings
 * - group: an object with its own `fields`
 * - list: a list of objects with `fields`
 */
export type FieldType = 'text' | 'textarea' | 'link' | 'url' | 'image' | 'number' | 'color' | 'select' | 'strings' | 'group' | 'list'

/** Where a select's choices come from: a field of each item in a list, or a map's keys. */
export type OptionSource = { file: FileId; path: YamlPath; field?: string }

export type Field = {
  key: string
  label: string
  type: FieldType
  help?: string
  required?: boolean
  /**
   * Older spellings of the key that the site also reads. The value shows
   * whichever is present, and a save keeps the spelling the entry already
   * uses, so `to:` stays `to:` rather than turning into a second key.
   */
  aliases?: readonly string[]
  options?: readonly string[]
  optionsFrom?: OptionSource
  fields?: readonly Field[]
  /** For `list`: what one item is called ("button", "link"). */
  itemLabel?: string
}

type PanelBase = { id: string; title: string; description?: string }

/** One object in a file, edited as a form. Keys the form does not list are left alone. */
export type FieldsPanel = PanelBase & { kind: 'fields'; file: FileId; path: YamlPath; fields: readonly Field[] }

/** A list of entries, each edited in a dialog. */
export type ListPanel = PanelBase & {
  kind: 'list'
  file: FileId
  path: YamlPath
  fields: readonly Field[]
  itemLabel: string
  /** Fields shown as table columns; the first names the entry in summaries. */
  columns: readonly string[]
}

/** Entries keyed by a code, like series.yml. */
export type MapPanel = PanelBase & {
  kind: 'map'
  file: FileId
  path: YamlPath
  fields: readonly Field[]
  itemLabel: string
  keyLabel: string
  keyHelp?: string
  columns: readonly string[]
}

export type Flag = { path: YamlPath; label: string; help?: string }

/** On/off switches in config/features.yml. Anything not listed there is on. */
export type FlagsPanel = PanelBase & { kind: 'flags'; flags: readonly Flag[] }

export type Panel = FieldsPanel | ListPanel | MapPanel | FlagsPanel

export type Section = {
  id: string
  label: string
  description: string
  /** The page on the site this section edits. */
  sitePath?: string
  group: 'Pages' | 'Site'
  panels: readonly Panel[]
}

/** A YAML key that matches the site's own key pattern. */
export const MAP_KEY = /^[A-Za-z0-9_-]{1,40}$/

const actions: Field = {
  key: 'actions',
  label: 'Buttons',
  type: 'list',
  itemLabel: 'button',
  fields: [
    { key: 'label', label: 'Label', type: 'text', required: true },
    { key: 'href', label: 'Link', type: 'link', required: true, aliases: ['to'] },
    { key: 'style', label: 'Style', type: 'select', options: ['primary', 'secondary'] },
  ],
}

const eventKinds: OptionSource = { file: 'events', path: ['kinds'], field: 'type' }
const seriesCodes: OptionSource = { file: 'series', path: [] }
const collaboratorNames: OptionSource = { file: 'site', path: ['collaborators'], field: 'name' }

const pageText = (extra: readonly Field[] = []): Field[] => [
  { key: 'eyebrow', label: 'Eyebrow', type: 'text', help: 'The small label above the title.' },
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'lede', label: 'Introduction', type: 'textarea' },
  ...extra,
]

const PAGE_FLAG_HELP = 'When off, the page drops out of the navbar, footer and buttons, and its address shows the "being built" notice.'
const pageFlag = (page: string, label: string): Flag => ({ path: ['pages', page], label, help: PAGE_FLAG_HELP })

const memberFields: Field[] = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'role', label: 'Role', type: 'text' },
  { key: 'team', label: 'Team', type: 'text', help: 'Kept for the roster; not shown on the site.' },
  { key: 'house', label: 'House', type: 'text', help: 'Kept for the roster; not shown on the site.' },
  { key: 'photo', label: 'Photo', type: 'image', help: 'Leave empty to show the default photo.' },
  { key: 'linkedin', label: 'LinkedIn', type: 'url' },
]

const pastMemberFields: Field[] = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'role', label: 'Role', type: 'text' },
  { key: 'tenure', label: 'Tenure', type: 'text', help: 'Like "2023 – 2025".' },
]

const homeFlags: Flag[] = [
  { path: ['home', 'latest'], label: 'Latest events' },
  { path: ['home', 'formats'], label: 'What we do' },
  { path: ['home', 'partners'], label: 'Partners' },
  { path: ['home', 'join'], label: 'Join band' },
]

const peopleFlags: Flag[] = [
  { path: ['people', 'coreTeam'], label: 'Core team' },
  { path: ['people', 'collaborators'], label: 'Collaborators' },
  { path: ['people', 'volunteers'], label: 'Volunteers' },
  { path: ['people', 'pastMembers'], label: 'Past core members' },
  { path: ['people', 'pastCollaborators'], label: 'Past collaborators' },
  { path: ['people', 'join'], label: 'Join band' },
]

const pageFlags: Flag[] = [
  pageFlag('/events/upcomings', 'Upcoming events'),
  pageFlag('/events', 'Our Journey'),
  pageFlag('/people', 'People'),
  pageFlag('/abouts', 'About us'),
  pageFlag('/resources/course-materials', 'Course materials'),
  pageFlag('/resources/books', 'Books'),
  pageFlag('/resources/research-papers', 'Research papers'),
  pageFlag('/blogs', 'Blogs'),
]

export const sections: readonly Section[] = [
  {
    id: 'home',
    label: 'Home',
    description: 'The hero, stats and the bands below them. The big title comes from Site settings.',
    sitePath: '/',
    group: 'Pages',
    panels: [
      { kind: 'fields', id: 'home.hero', title: 'Hero', file: 'home', path: ['hero'], fields: [
        { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
        { key: 'lede', label: 'Introduction', type: 'textarea' },
        actions,
      ] },
      { kind: 'list', id: 'home.stats', title: 'Stats', file: 'home', path: ['stats'], itemLabel: 'stat', columns: ['value', 'label'], fields: [
        { key: 'value', label: 'Value', type: 'text', required: true, help: 'Like "600+".' },
        { key: 'label', label: 'Label', type: 'text', required: true },
      ] },
      { kind: 'fields', id: 'home.latest', title: 'Latest events', description: 'The newest events from Our Journey.', file: 'home', path: ['latest'], fields: [
        { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'count', label: 'How many', type: 'number' },
        { key: 'types', label: 'Kinds shown', type: 'strings', optionsFrom: eventKinds, help: 'Leave empty to show every kind.' },
      ] },
      { kind: 'fields', id: 'home.formats', title: 'What we do', file: 'home', path: ['formats'], fields: [
        { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
      ] },
      { kind: 'list', id: 'home.formats.items', title: 'What we do: cards', description: 'One card per kind of event; its count is worked out from Our Journey.', file: 'home', path: ['formats', 'items'], itemLabel: 'card', columns: ['type', 'text'], fields: [
        { key: 'type', label: 'Kind of event', type: 'select', optionsFrom: eventKinds, required: true },
        { key: 'title', label: 'Title', type: 'text', help: "Leave empty to use the kind's plural name." },
        { key: 'text', label: 'Text', type: 'textarea' },
      ] },
      { kind: 'fields', id: 'home.partners', title: 'Partners', description: 'The partners themselves are the collaborators in Site settings.', file: 'home', path: ['partners'], fields: [
        { key: 'title', label: 'Title', type: 'text' },
      ] },
      { kind: 'fields', id: 'home.join', title: 'Join band', file: 'home', path: ['join'], fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'text', label: 'Text', type: 'textarea' },
        actions,
      ] },
      { kind: 'flags', id: 'home.visibility', title: 'Visibility', flags: homeFlags },
    ],
  },
  {
    id: 'events',
    label: 'Our Journey',
    description: 'Every past event, the kinds of event and the series they belong to.',
    sitePath: '/events',
    group: 'Pages',
    panels: [
      { kind: 'list', id: 'events.events', title: 'Events', description: 'The site sorts them newest first and groups them by term.', file: 'events', path: ['events'], itemLabel: 'event', columns: ['name', 'type', 'date', 'term'], fields: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'type', label: 'Kind', type: 'select', optionsFrom: eventKinds, required: true },
        { key: 'series', label: 'Series', type: 'select', optionsFrom: seriesCodes },
        { key: 'episode', label: 'Episode', type: 'number' },
        { key: 'date', label: 'Date', type: 'text', help: 'Like "November 11, 2023". Leave empty for a contest that runs over weeks.' },
        { key: 'endDate', label: 'End date', type: 'text', help: 'The last day, for an event over several days of one month.' },
        { key: 'time', label: 'Time', type: 'text' },
        { key: 'duration', label: 'Duration', type: 'text', help: 'Like "1:30:00".' },
        { key: 'mode', label: 'Mode', type: 'text', help: 'Like "Online".' },
        { key: 'term', label: 'Term', type: 'text', required: true, help: 'The academic term, like "January 2025".' },
        { key: 'topic', label: 'Topic', type: 'textarea' },
        { key: 'hosts', label: 'Hosts', type: 'strings' },
        { key: 'prHost', label: 'PR host', type: 'text' },
        { key: 'guestSpeaker', label: 'Guest speaker', type: 'text' },
        { key: 'judge', label: 'Judge', type: 'text' },
        { key: 'coHost', label: 'Co-host', type: 'text' },
        { key: 'collaboration', label: 'In collaboration with', type: 'select', optionsFrom: collaboratorNames },
        { key: 'participants', label: 'Participants', type: 'number', help: 'Or fill in registered and attended instead.' },
        { key: 'registered', label: 'Registered', type: 'number' },
        { key: 'attended', label: 'Attended', type: 'number' },
        { key: 'poster', label: 'Poster', type: 'image' },
        { key: 'links', label: 'Links', type: 'group', fields: [
          { key: 'youtube', label: 'YouTube', type: 'url' },
          { key: 'material', label: 'Slides & material', type: 'url' },
          { key: 'linkedin', label: 'LinkedIn post', type: 'url' },
          { key: 'instagram', label: 'Instagram post', type: 'url' },
        ] },
      ] },
      { kind: 'map', id: 'events.series', title: 'Series', file: 'series', path: [], itemLabel: 'series', keyLabel: 'Code', keyHelp: 'Events refer to a series by this code, like S01P01.', columns: ['name', 'topic'], fields: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'topic', label: 'Topic', type: 'text' },
      ] },
      { kind: 'list', id: 'events.kinds', title: 'Kinds of event', description: 'In filter order. Events and the home page cards refer to a kind by its type.', file: 'events', path: ['kinds'], itemLabel: 'kind', columns: ['type', 'label', 'color'], fields: [
        { key: 'type', label: 'Type', type: 'text', required: true },
        { key: 'label', label: 'Label', type: 'text', help: 'One event, like "Workshop".' },
        { key: 'plural', label: 'Plural', type: 'text' },
        { key: 'color', label: 'Colour', type: 'color' },
      ] },
      { kind: 'fields', id: 'events.page', title: 'Page text', file: 'events', path: ['page'], fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'lede', label: 'Introduction', type: 'textarea' },
        { key: 'upNext', label: '"Up next" link', type: 'text' },
        { key: 'beginning', label: 'Where it began', type: 'group', fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'text', label: 'Text', type: 'textarea' },
        ] },
      ] },
      { kind: 'flags', id: 'events.visibility', title: 'Visibility', flags: [pageFlag('/events', 'Our Journey page')] },
    ],
  },
  {
    id: 'upcoming',
    label: 'Upcoming events',
    description: 'Announced events, each with its own featured card.',
    sitePath: '/events/upcomings',
    group: 'Pages',
    panels: [
      { kind: 'list', id: 'upcoming.events', title: 'Upcoming events', description: 'Only the title is required; leave out anything not known yet.', file: 'upcoming', path: ['events'], itemLabel: 'event', columns: ['title', 'status', 'date'], fields: [
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'series', label: 'Series', type: 'select', optionsFrom: seriesCodes },
        { key: 'status', label: 'Status', type: 'text', help: 'Shown as a badge, like "Registration open".' },
        { key: 'date', label: 'Date', type: 'text' },
        { key: 'time', label: 'Time', type: 'text' },
        { key: 'where', label: 'Where', type: 'text' },
        { key: 'speaker', label: 'Speaker', type: 'text' },
        { key: 'poster', label: 'Poster', type: 'image' },
        { key: 'registerLink', label: 'Registration link', type: 'url' },
        { key: 'calendarLink', label: 'Calendar link', type: 'url' },
        { key: 'tabs', label: 'Tabs', type: 'list', itemLabel: 'tab', fields: [
          { key: 'label', label: 'Label', type: 'text', required: true },
          { key: 'content', label: 'Content', type: 'textarea' },
        ] },
      ] },
      { kind: 'fields', id: 'upcoming.page', title: 'Page text', file: 'upcoming', path: ['page'], fields: pageText() },
      { kind: 'fields', id: 'upcoming.follow', title: 'Follow band', file: 'upcoming', path: ['follow'], fields: [
        { key: 'title', label: 'Title', type: 'text', help: 'Shown when events are scheduled.' },
        { key: 'emptyTitle', label: 'Title with nothing scheduled', type: 'text' },
        { key: 'text', label: 'Text', type: 'textarea' },
      ] },
      { kind: 'fields', id: 'upcoming.recent', title: 'Recently concluded', file: 'upcoming', path: ['recent'], fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'count', label: 'How many', type: 'number' },
      ] },
      { kind: 'flags', id: 'upcoming.visibility', title: 'Visibility', flags: [pageFlag('/events/upcomings', 'Upcoming events page')] },
    ],
  },
  {
    id: 'people',
    label: 'People',
    description: 'The team, collaborators, volunteers and alumni. Never add email addresses, phone numbers or roll numbers.',
    sitePath: '/people',
    group: 'Pages',
    panels: [
      { kind: 'list', id: 'people.coreTeam', title: 'Core team', file: 'people', path: ['coreTeam', 'members'], itemLabel: 'member', columns: ['name', 'role'], fields: memberFields },
      { kind: 'list', id: 'people.collaborators', title: 'Collaborators', file: 'people', path: ['collaborators', 'members'], itemLabel: 'collaborator', columns: ['name', 'role'], fields: memberFields },
      { kind: 'list', id: 'people.volunteers', title: 'Volunteers', file: 'people', path: ['volunteers', 'members'], itemLabel: 'volunteer', columns: ['name', 'role'], fields: memberFields },
      { kind: 'list', id: 'people.pastMembers', title: 'Past core members', file: 'people', path: ['pastMembers', 'members'], itemLabel: 'past member', columns: ['name', 'role', 'tenure'], fields: pastMemberFields },
      { kind: 'list', id: 'people.pastCollaborators', title: 'Past collaborators', file: 'people', path: ['pastCollaborators', 'members'], itemLabel: 'past collaborator', columns: ['name', 'role', 'tenure'], fields: pastMemberFields },
      { kind: 'fields', id: 'people.page', title: 'Page text', file: 'people', path: [], fields: [
        { key: 'page', label: 'Header', type: 'group', fields: pageText() },
        { key: 'defaultPhoto', label: 'Default photo', type: 'image', help: 'Shown when a member has no photo, or theirs fails to load.' },
      ] },
      { kind: 'fields', id: 'people.headings', title: 'Section headings', file: 'people', path: [], fields: [
        { key: 'coreTeam', label: 'Core team', type: 'group', fields: [{ key: 'title', label: 'Heading', type: 'text' }] },
        { key: 'collaborators', label: 'Collaborators', type: 'group', fields: [{ key: 'title', label: 'Heading', type: 'text' }] },
        { key: 'volunteers', label: 'Volunteers', type: 'group', fields: [{ key: 'title', label: 'Heading', type: 'text' }] },
        { key: 'alumni', label: 'Alumni', type: 'group', fields: [
          { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
          { key: 'title', label: 'Heading', type: 'text' },
        ] },
        { key: 'pastMembers', label: 'Past core members', type: 'group', fields: [{ key: 'title', label: 'Heading', type: 'text' }] },
        { key: 'pastCollaborators', label: 'Past collaborators', type: 'group', fields: [{ key: 'title', label: 'Heading', type: 'text' }] },
      ] },
      { kind: 'fields', id: 'people.join', title: 'Join band', file: 'people', path: ['join'], fields: [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'text', label: 'Text', type: 'textarea' },
        { key: 'action', label: 'Button', type: 'group', fields: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'href', label: 'Link', type: 'link' },
        ] },
      ] },
      { kind: 'flags', id: 'people.visibility', title: 'Visibility', flags: [pageFlag('/people', 'People page'), ...peopleFlags] },
    ],
  },
  {
    id: 'about',
    label: 'About us',
    description: 'Mission, structure, benefits and testimonials. %SITE_NAME% inserts the site name.',
    sitePath: '/abouts',
    group: 'Pages',
    panels: [
      { kind: 'fields', id: 'about.hero', title: 'Header', file: 'about', path: ['hero'], fields: pageText() },
      { kind: 'fields', id: 'about.mission', title: 'Mission & approach', file: 'about', path: [], fields: [
        { key: 'mission', label: 'Mission', type: 'group', fields: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'body', label: 'Text', type: 'textarea' },
        ] },
        { key: 'approach', label: 'Approach', type: 'group', fields: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'body', label: 'Text', type: 'textarea' },
        ] },
      ] },
      { kind: 'fields', id: 'about.structure', title: 'Structure', file: 'about', path: ['structure'], fields: [
        { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'intro', label: 'Introduction', type: 'textarea' },
        { key: 'teamsTitle', label: 'Teams heading', type: 'text' },
      ] },
      { kind: 'list', id: 'about.points', title: 'Structure points', file: 'about', path: ['structure', 'points'], itemLabel: 'point', columns: ['label', 'text'], fields: [
        { key: 'label', label: 'Label', type: 'text', required: true },
        { key: 'text', label: 'Text', type: 'textarea' },
      ] },
      { kind: 'list', id: 'about.teams', title: 'Teams', file: 'about', path: ['structure', 'teams'], itemLabel: 'team', columns: ['code', 'name'], fields: [
        { key: 'code', label: 'Badge', type: 'text', help: 'The short label in the badge, like "CR".' },
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'text', label: 'Text', type: 'textarea' },
      ] },
      { kind: 'fields', id: 'about.benefits', title: 'Benefits', file: 'about', path: ['benefits'], fields: [
        { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'body', label: 'Text', type: 'textarea' },
        actions,
      ] },
      { kind: 'fields', id: 'about.testimonials', title: 'Testimonials heading', file: 'about', path: ['testimonials'], fields: [
        { key: 'title', label: 'Title', type: 'text' },
      ] },
      { kind: 'list', id: 'about.quotes', title: 'Testimonials', file: 'about', path: ['testimonials', 'items'], itemLabel: 'testimonial', columns: ['author', 'quote'], fields: [
        { key: 'quote', label: 'Quote', type: 'textarea', required: true },
        { key: 'author', label: 'Author', type: 'text', required: true },
      ] },
      { kind: 'flags', id: 'about.visibility', title: 'Visibility', flags: [pageFlag('/abouts', 'About us page')] },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    description: 'Course materials and the library.',
    sitePath: '/resources/course-materials',
    group: 'Pages',
    panels: [
      { kind: 'list', id: 'resources.courses', title: 'Courses', file: 'courses', path: ['courses'], itemLabel: 'course', columns: ['title', 'courseId', 'level'], fields: [
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'courseId', label: 'Course code', type: 'text' },
        { key: 'level', label: 'Level', type: 'text' },
        { key: 'image', label: 'Image', type: 'image' },
        { key: 'links', label: 'Links', type: 'group', fields: [
          { key: 'youtube', label: 'YouTube playlist', type: 'url' },
          { key: 'notes', label: 'Course notes', type: 'url' },
          { key: 'pyqs', label: 'Previous-year questions', type: 'url' },
          { key: 'web', label: 'Official course page', type: 'url' },
        ] },
      ] },
      { kind: 'list', id: 'resources.library', title: 'Library shelves', file: 'courses', path: ['library'], itemLabel: 'shelf', columns: ['title', 'status'], fields: [
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'status', label: 'Status', type: 'text', help: 'Shown as a badge, like "In progress".' },
        { key: 'text', label: 'Text', type: 'textarea' },
        { key: 'to', label: 'Page', type: 'link', help: 'Add once the shelf has a page of its own.' },
      ] },
      { kind: 'fields', id: 'resources.page', title: 'Page text', file: 'courses', path: [], fields: [
        { key: 'page', label: 'Header', type: 'group', fields: pageText() },
        { key: 'coursesTitle', label: 'Courses heading', type: 'text' },
        { key: 'libraryTitle', label: 'Library heading', type: 'text' },
      ] },
      { kind: 'flags', id: 'resources.visibility', title: 'Visibility', flags: [
        pageFlag('/resources/course-materials', 'Course materials page'),
        pageFlag('/resources/books', 'Books page'),
        pageFlag('/resources/research-papers', 'Research papers page'),
      ] },
    ],
  },
  {
    id: 'blogs',
    label: 'Blogs',
    description: 'Posts shown on the Blogs page and at the bottom of Resources.',
    sitePath: '/blogs',
    group: 'Pages',
    panels: [
      { kind: 'list', id: 'blogs.posts', title: 'Posts', file: 'blogs', path: ['posts'], itemLabel: 'post', columns: ['title', 'date'], fields: [
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'date', label: 'Date', type: 'text' },
        { key: 'readTime', label: 'Read time', type: 'text', help: 'Like "3 min read".' },
        { key: 'image', label: 'Image', type: 'image' },
        { key: 'link', label: 'Link', type: 'url', required: true },
      ] },
      { kind: 'fields', id: 'blogs.page', title: 'Page text', file: 'blogs', path: [], fields: [
        { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'intro', label: 'Introduction', type: 'textarea' },
        { key: 'allPosts', label: '"All posts" link', type: 'group', fields: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'href', label: 'Link', type: 'url' },
        ] },
        { key: 'pageSize', label: 'Posts before "Show more"', type: 'number' },
      ] },
      { kind: 'flags', id: 'blogs.visibility', title: 'Visibility', flags: [pageFlag('/blogs', 'Blogs page')] },
    ],
  },
  {
    id: 'site',
    label: 'Site settings',
    description: 'Name, navigation, footer, social links and collaborators.',
    group: 'Site',
    panels: [
      { kind: 'fields', id: 'site.identity', title: 'Identity', file: 'site', path: [], fields: [
        { key: 'name', label: 'Name', type: 'text', required: true, help: '%SITE_NAME% in any other text inserts this.' },
        { key: 'shortName', label: 'Short name', type: 'text', help: 'The first line of the home page title.' },
        { key: 'tagline', label: 'Tagline', type: 'text', help: 'The second line of the home page title.' },
        { key: 'description', label: 'Description', type: 'textarea', help: 'For search engines and link previews.' },
        { key: 'logo', label: 'Logo', type: 'image' },
        { key: 'favicon', label: 'Favicon', type: 'image' },
      ] },
      { kind: 'list', id: 'site.navigation', title: 'Navigation bar', file: 'navigation', path: ['items'], itemLabel: 'link', columns: ['label', 'to'], fields: [
        { key: 'label', label: 'Label', type: 'text', required: true },
        { key: 'to', label: 'Page', type: 'link', required: true },
      ] },
      { kind: 'list', id: 'site.socials', title: 'Social links', file: 'site', path: ['socials'], itemLabel: 'link', columns: ['label', 'href'], fields: [
        { key: 'label', label: 'Label', type: 'text', required: true },
        { key: 'href', label: 'Link', type: 'url', required: true },
      ] },
      { kind: 'list', id: 'site.collaborators', title: 'Collaborators', description: 'Shown on the home page; an event links to one by its exact name.', file: 'site', path: ['collaborators'], itemLabel: 'collaborator', columns: ['name', 'role'], fields: [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'role', label: 'Role', type: 'text' },
        { key: 'logo', label: 'Logo', type: 'image' },
        { key: 'href', label: 'Link', type: 'url' },
      ] },
      { kind: 'fields', id: 'site.footer', title: 'Footer', file: 'site', path: ['footer'], fields: [
        { key: 'hostedBy', label: 'Hosted by', type: 'text' },
        { key: 'institution', label: 'Institution', type: 'text' },
        { key: 'location', label: 'Location', type: 'text' },
        { key: 'programme', label: 'Programme', type: 'group', fields: [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'role', label: 'Role', type: 'text' },
          { key: 'logo', label: 'Logo', type: 'image' },
          { key: 'href', label: 'Link', type: 'url' },
        ] },
        { key: 'flagCounter', label: 'Visitor counter', type: 'group', fields: [
          { key: 'href', label: 'Details link', type: 'url' },
          { key: 'image', label: 'Badge image', type: 'url' },
        ] },
      ] },
      { kind: 'list', id: 'site.linkGroups', title: 'Footer link groups', description: 'Links to pages that are switched off are hidden.', file: 'site', path: ['footer', 'linkGroups'], itemLabel: 'group', columns: ['title'], fields: [
        { key: 'title', label: 'Title', type: 'text', required: true },
        { key: 'links', label: 'Links', type: 'list', itemLabel: 'link', fields: [
          { key: 'label', label: 'Label', type: 'text', required: true },
          { key: 'href', label: 'Link', type: 'link', required: true },
        ] },
      ] },
      { kind: 'fields', id: 'site.notices', title: 'Notices', file: 'site', path: [], fields: [
        { key: 'maintenance', label: 'Page being built', type: 'group', fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'message', label: 'Message', type: 'textarea' },
        ] },
        { key: 'notFound', label: 'Page not found', type: 'group', fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'message', label: 'Message', type: 'textarea' },
        ] },
      ] },
    ],
  },
  {
    id: 'visibility',
    label: 'Visibility',
    description: 'Switch a page or a section off without deleting it.',
    group: 'Site',
    panels: [
      { kind: 'flags', id: 'visibility.pages', title: 'Pages', flags: pageFlags },
      { kind: 'flags', id: 'visibility.home', title: 'Home page sections', flags: homeFlags },
      { kind: 'flags', id: 'visibility.people', title: 'People page sections', flags: peopleFlags },
    ],
  },
]

const panelIndex = new Map<string, Panel>(sections.flatMap(section => section.panels.map(panel => [panel.id, panel] as const)))

export function findPanel(id: string): Panel | undefined {
  return panelIndex.get(id)
}

export function findSection(id: string): Section | undefined {
  return sections.find(section => section.id === id)
}

export function findSectionOfPanel(panelId: string): Section | undefined {
  return sections.find(section => section.panels.some(panel => panel.id === panelId))
}

/** The file a panel writes to; flags always live in features.yml. */
export function panelFile(panel: Panel): FileId {
  return panel.kind === 'flags' ? 'features' : panel.file
}

export function fileIdForPath(path: string): FileId | undefined {
  return fileIds.find(id => files[id] === path)
}
