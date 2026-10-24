import { useState } from 'react'
import type { FlagsPanel as FlagsPanelType } from '@shared/collections'
import { Notice } from '@/components/admin/Notice'
import { Switch } from '@/components/ui/switch'
import { useContent } from '@/hooks/contentContext'
import { getIn } from '@/lib/content'
import { errorMessage } from '@/services/api'
import { PanelCard } from './PanelCard'

/** Switches in config/features.yml. Anything not listed there is on, as on the site. */
export function FlagsPanel({ panel }: { panel: FlagsPanelType }) {
  const { files, change } = useContent()
  const [busy, setBusy] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function toggle(index: number, value: boolean) {
    setBusy(index)
    setError(null)
    try {
      await change(panel.id, { op: 'set', flag: index, value })
    } catch (caught) {
      setError(errorMessage(caught))
    } finally {
      setBusy(null)
    }
  }

  return (
    <PanelCard id={panel.id} title={panel.title} description={panel.description ?? 'Changes here wait for publishing, like any other edit.'}>
      {error && <Notice tone="error" className="mb-4">{error}</Notice>}
      <ul className="divide-y divide-line-soft">
        {panel.flags.map((flag, index) => {
          const on = getIn(files.features.data, flag.path) !== false
          const id = `${panel.id}-${index}`
          return (
            <li key={flag.path.join('/')} className="flex items-start justify-between gap-6 py-3 first:pt-0 last:pb-0">
              <label htmlFor={id} className="flex cursor-pointer flex-col gap-0.5">
                <span className="text-sm font-semibold">{flag.label}</span>
                {flag.help && <span className="text-xs leading-relaxed text-muted">{flag.help}</span>}
              </label>
              <span className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted">{on ? 'On' : 'Off'}</span>
                <Switch id={id} checked={on} disabled={busy !== null} onCheckedChange={value => void toggle(index, value)} />
              </span>
            </li>
          )
        })}
      </ul>
    </PanelCard>
  )
}
