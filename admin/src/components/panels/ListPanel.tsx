import { ArrowDown, ArrowUp, Pencil, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import type { ListPanel as ListPanelType } from '@shared/collections'
import { Notice } from '@/components/admin/Notice'
import { Thumbnail } from '@/components/admin/Thumbnail'
import { EntryDialog } from '@/components/editor/EntryDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useContent } from '@/hooks/contentContext'
import { display, getIn, toFormValue } from '@/lib/content'
import { errorMessage } from '@/services/api'
import { PanelCard } from './PanelCard'

type Editing = { index: number | null; key: number }

/** A list of entries: a table to scan, a dialog to edit one. */
export function ListPanel({ panel }: { panel: ListPanelType }) {
  const { files, change } = useContent()
  const [editing, setEditing] = useState<Editing | null>(null)
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const raw = getIn(files[panel.file].data, panel.path)
  const items = Array.isArray(raw) ? raw : []
  const columns = panel.columns.map(key => panel.fields.find(field => field.key === key)!).filter(Boolean)
  const imageField = panel.fields.find(field => field.type === 'image')
  const needle = query.trim().toLowerCase()
  const rows = items
    .map((item, index) => ({ item: item as Record<string, unknown>, index }))
    .filter(({ item }) => !needle || columns.some(column => display(item?.[column.key]).toLowerCase().includes(needle)))
  const noun = panel.itemLabel

  async function move(index: number, to: number) {
    setError(null)
    try {
      await change(panel.id, { op: 'move', index, to })
    } catch (caught) {
      setError(errorMessage(caught))
    }
  }

  const openNew = () => setEditing({ index: null, key: Date.now() })

  return (
    <PanelCard
      id={panel.id}
      title={panel.title}
      description={panel.description}
      actions={<Button size="sm" variant="primary" onClick={openNew}><Plus /> Add {noun}</Button>}
    >
      {error && <Notice tone="error" className="mb-4">{error}</Notice>}
      {items.length > 8 && (
        <div className="relative mb-4 max-w-sm">
          <Search className="pointer-events-none absolute top-3 left-3 size-4 text-muted" />
          <Input value={query} onChange={event => setQuery(event.target.value)} placeholder={`Search ${items.length} ${panel.title.toLowerCase()}`} className="pl-9" aria-label={`Search ${panel.title}`} />
        </div>
      )}
      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">Nothing here yet. Add the first {noun}.</p>
      ) : (
        <div className="-mx-5 overflow-x-auto">
          <table className="w-full min-w-xl border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                {columns.map(column => <th key={column.key} className="px-5 py-2 font-medium">{column.label}</th>)}
                <th className="w-32 px-5 py-2"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ item, index }) => {
                const image = imageField && typeof item?.[imageField.key] === 'string' ? (item[imageField.key] as string) : undefined
                return (
                  <tr key={index} className="border-b border-line-soft last:border-0 hover:bg-surface/70">
                    {columns.map((column, position) => (
                      <td key={column.key} className="max-w-xs px-5 py-2.5 align-middle">
                        {position === 0 ? (
                          <button type="button" onClick={() => setEditing({ index, key: Date.now() })} className="flex cursor-pointer items-center gap-3 text-left font-semibold hover:text-accent">
                            {imageField && <Thumbnail path={image} />}
                            <span className="line-clamp-2">{display(item?.[column.key]) || <span className="text-muted">Untitled</span>}</span>
                          </button>
                        ) : column.type === 'color' && typeof item?.[column.key] === 'string' ? (
                          <span className="inline-flex items-center gap-2 font-mono text-xs"><span className="size-3 rounded-full" style={{ background: item[column.key] as string }} />{item[column.key] as string}</span>
                        ) : (
                          <span className="line-clamp-2 text-body">{display(item?.[column.key])}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-5 py-2.5 text-right whitespace-nowrap">
                      <Button variant="ghost" size="icon" aria-label="Move up" disabled={index === 0 || Boolean(needle)} onClick={() => void move(index, index - 1)}><ArrowUp /></Button>
                      <Button variant="ghost" size="icon" aria-label="Move down" disabled={index === items.length - 1 || Boolean(needle)} onClick={() => void move(index, index + 1)}><ArrowDown /></Button>
                      <Button variant="ghost" size="icon" aria-label={`Edit ${display(item?.[columns[0]?.key])}`} onClick={() => setEditing({ index, key: Date.now() })}><Pencil /></Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <EntryDialog
          key={editing.key}
          open
          onOpenChange={open => !open && setEditing(null)}
          title={editing.index === null ? `New ${noun}` : `Edit ${noun}`}
          fields={panel.fields}
          initial={editing.index === null ? {} : toFormValue(panel.fields, items[editing.index])}
          onSave={value => change(panel.id, editing.index === null ? { op: 'create', value } : { op: 'update', index: editing.index, value })}
          onDelete={editing.index === null ? undefined : () => change(panel.id, { op: 'delete', index: editing.index! })}
        />
      )}
    </PanelCard>
  )
}
