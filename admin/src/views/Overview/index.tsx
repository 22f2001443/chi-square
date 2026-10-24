import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Activity, ActivityResponse } from '@shared/api'
import { sections } from '@shared/collections'
import { PageHeader } from '@/components/admin/PageHeader'
import { sectionIcons } from '@/config/navigation'
import { useContent } from '@/hooks/contentContext'
import { useSession } from '@/hooks/sessionContext'
import { getIn } from '@/lib/content'
import { formatTime } from '@/lib/utils'
import { api } from '@/services/api'

export default function Overview() {
  const { user } = useSession()
  const { files, repository, pendingCount } = useContent()
  const [activity, setActivity] = useState<Activity[]>([])

  useEffect(() => {
    api<ActivityResponse>('/api/activity').then(result => setActivity(result.activity.slice(0, 6))).catch(() => undefined)
  }, [])

  // Each section's headline number: the entries in its first list.
  const counts = Object.fromEntries(sections.map(section => {
    const list = section.panels.find(panel => panel.kind === 'list')
    const items = list && list.kind === 'list' ? getIn(files[list.file].data, list.path) : undefined
    return [section.id, Array.isArray(items) ? `${items.length} ${list!.kind === 'list' ? list!.itemLabel : ''}${items.length === 1 ? '' : 's'}` : undefined]
  }))

  return (
    <>
      <PageHeader eyebrow="Overview" title={`Hello, ${user.name?.split(' ')[0] ?? user.login}`} description={repository.kind === 'local' ? 'You’re editing the files on this computer. Publishing writes them to disk for you to commit with git.' : `Edits are held here until an owner publishes them to ${repository.label}, and Vercel redeploys the site.`} />

      <Link to="/publishing" className="mb-8 flex items-center justify-between gap-4 rounded-xl border border-line bg-paper px-5 py-4 hover:border-ink">
        <span className="flex flex-col gap-1">
          <span className="font-semibold">{pendingCount ? `${pendingCount} ${pendingCount === 1 ? 'file has' : 'files have'} changes waiting to publish` : 'Nothing waiting to publish'}</span>
          <span className="text-sm text-muted">{pendingCount ? 'Review them, then publish in one go.' : 'Edits you save anywhere in the admin collect here.'}</span>
        </span>
        <ArrowRight className="size-5 shrink-0 text-muted" />
      </Link>

      <h2 className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.1em] text-muted">Edit the site</h2>
      <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(section => {
          const Icon = sectionIcons[section.id]
          return (
            <Link key={section.id} to={`/sections/${section.id}`} className="flex flex-col gap-2 rounded-xl border border-line bg-paper p-5 hover:border-ink">
              <span className="flex items-center gap-2 font-semibold">{Icon && <Icon className="size-4 text-accent" />}{section.label}</span>
              <span className="line-clamp-2 text-sm text-muted">{section.description}</span>
              {counts[section.id] && <span className="mt-auto font-mono text-xs text-body">{counts[section.id]}</span>}
            </Link>
          )
        })}
      </div>

      {activity.length > 0 && (
        <>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-mono text-xs font-medium uppercase tracking-[0.1em] text-muted">Recent activity</h2>
            <Link to="/activity" className="text-sm font-semibold text-accent hover:text-accent-strong">All activity</Link>
          </div>
          <ul className="divide-y divide-line-soft rounded-xl border border-line bg-paper">
            {activity.map(entry => (
              <li key={entry.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3 text-sm">
                <span><strong className="font-semibold">{entry.login}</strong> <span className="text-body">{entry.summary}</span></span>
                <span className="font-mono text-xs text-muted">{formatTime(entry.at)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}
