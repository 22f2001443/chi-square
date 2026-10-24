import { BookOpen, CalendarClock, CloudUpload, Eye, History, House, Info, LayoutDashboard, Newspaper, Route, Settings, UserRound, Users, type LucideIcon } from 'lucide-react'
import { sections } from '@shared/collections'

export type NavItem = { to: string; label: string; icon: LucideIcon }
export type NavGroup = { label: string; items: NavItem[] }

export const sectionIcons: Record<string, LucideIcon> = {
  home: House,
  events: Route,
  upcoming: CalendarClock,
  people: UserRound,
  about: Info,
  resources: BookOpen,
  blogs: Newspaper,
  site: Settings,
  visibility: Eye,
}

// The sidebar: the workspace tools, then one entry per section of the registry
// in shared/collections.ts, so a section added there shows up here.
export const navigation: NavGroup[] = [
  {
    label: 'Workspace',
    items: [
      { to: '/', label: 'Overview', icon: LayoutDashboard },
      { to: '/publishing', label: 'Publishing', icon: CloudUpload },
      { to: '/members', label: 'Members', icon: Users },
      { to: '/activity', label: 'Activity', icon: History },
    ],
  },
  ...(['Pages', 'Site'] as const).map(group => ({
    label: group,
    items: sections.filter(section => section.group === group).map(section => ({ to: `/sections/${section.id}`, label: section.label, icon: sectionIcons[section.id] ?? Settings })),
  })),
]

export const SITE_URL = 'https://chi-square.vercel.app'

/** A page on the live site, which routes with a hash. */
export function siteLink(path: string) {
  return `${SITE_URL}/#${path}`
}
