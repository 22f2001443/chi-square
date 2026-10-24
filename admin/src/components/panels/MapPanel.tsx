import { Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import type { MapPanel as MapPanelType } from '@shared/collections'
import { isObject } from '@shared/validate'
import { EntryDialog } from '@/components/editor/EntryDialog'
import { Button } from '@/components/ui/button'
import { useContent } from '@/hooks/contentContext'
import { display, getIn, toFormValue } from '@/lib/content'
import { PanelCard } from './PanelCard'

type Editing = { key: string | null; id: number }

/** Entries keyed by a code, like the series events refer to. */
export function MapPanel({ panel }: { panel: MapPanelType }) {
  const { files, change } = useContent()
  const [editing, setEditing] = useState<Editing | null>(null)
  const raw = getIn(files[panel.file].data, panel.path)
  const entries = isObject(raw) ? Object.entries(raw) : []
  const columns = panel.columns.map(key => panel.fields.find(field => field.key === key)!).filter(Boolean)

  return (
    <PanelCard
      id={panel.id}
      title={panel.title}
      description={panel.description}
      actions={<Button size="sm" variant="primary" onClick={() => setEditing({ key: null, id: Date.now() })}><Plus /> Add {panel.itemLabel}</Button>}
    >
      <div className="-mx-5 overflow-x-auto">
        <table className="w-full min-w-md border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
              <th className="px-5 py-2 font-medium">{panel.keyLabel}</th>
              {columns.map(column => <th key={column.key} className="px-5 py-2 font-medium">{column.label}</th>)}
              <th className="w-16 px-5 py-2"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([key, item]) => (
              <tr key={key} className="border-b border-line-soft last:border-0 hover:bg-surface/70">
                <td className="px-5 py-2.5">
                  <button type="button" onClick={() => setEditing({ key, id: Date.now() })} className="cursor-pointer font-mono text-[13px] font-semibold hover:text-accent">{key}</button>
                </td>
                {columns.map(column => <td key={column.key} className="px-5 py-2.5 text-body">{display(isObject(item) ? item[column.key] : undefined)}</td>)}
                <td className="px-5 py-2.5 text-right">
                  <Button variant="ghost" size="icon" aria-label={`Edit ${key}`} onClick={() => setEditing({ key, id: Date.now() })}><Pencil /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <EntryDialog
          key={editing.id}
          open
          onOpenChange={open => !open && setEditing(null)}
          title={editing.key === null ? `New ${panel.itemLabel}` : `Edit ${panel.itemLabel} ${editing.key}`}
          fields={panel.fields}
          keyField={{ label: panel.keyLabel, help: panel.keyHelp, initial: editing.key ?? '' }}
          initial={editing.key === null ? {} : toFormValue(panel.fields, (raw as Record<string, unknown>)[editing.key])}
          onSave={(value, key) => change(panel.id, editing.key === null ? { op: 'create', key, value } : { op: 'update', key: editing.key, newKey: key, value })}
          onDelete={editing.key === null ? undefined : () => change(panel.id, { op: 'delete', key: editing.key! })}
        />
      )}
    </PanelCard>
  )
}
