import { useEffect, useState } from 'react'
import type { Activity as ActivityEntry, ActivityResponse } from '@shared/api'
import { Notice } from '@/components/admin/Notice'
import { PageHeader } from '@/components/admin/PageHeader'
import { formatTime } from '@/lib/utils'
import { api, errorMessage } from '@/services/api'

export default function Activity() {
  const [activity, setActivity] = useState<ActivityEntry[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api<ActivityResponse>('/api/activity').then(result => setActivity(result.activity)).catch(caught => setError(errorMessage(caught)))
  }, [])

  return (
    <>
      <PageHeader eyebrow="Workspace" title="Activity" description="Every edit, publish and membership change, newest first." />
      {error && <Notice tone="error">{error}</Notice>}
      {activity && activity.length === 0 && <p className="text-sm text-muted">Nothing has happened yet.</p>}
      {activity && activity.length > 0 && (
        <ul className="divide-y divide-line-soft rounded-xl border border-line bg-paper">
          {activity.map(entry => (
            <li key={entry.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3 text-sm">
              <span>
                <strong className="font-semibold">{entry.login}</strong>{' '}
                <span className="text-body">{entry.summary}</span>
              </span>
              <span className="font-mono text-xs text-muted">{formatTime(entry.at)}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
