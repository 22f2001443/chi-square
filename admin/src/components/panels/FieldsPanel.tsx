import { useMemo, useState } from 'react'
import type { FieldsPanel as FieldsPanelType } from '@shared/collections'
import { cleanObject, type FieldErrors } from '@shared/validate'
import { Notice } from '@/components/admin/Notice'
import { FieldsForm } from '@/components/editor/FieldsForm'
import { Button } from '@/components/ui/button'
import { useContent } from '@/hooks/contentContext'
import { getIn, toFormValue } from '@/lib/content'
import { ApiError, errorMessage } from '@/services/api'
import { PanelCard } from './PanelCard'

/** One object in a file, edited in place and saved as one change. */
export function FieldsPanel({ panel }: { panel: FieldsPanelType }) {
  const { files, change } = useContent()
  const saved = useMemo(() => toFormValue(panel.fields, getIn(files[panel.file].data, panel.path)), [files, panel])
  const savedKey = JSON.stringify(saved)
  const [value, setValue] = useState(saved)
  const [baseline, setBaseline] = useState(savedKey)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const dirty = JSON.stringify(value) !== baseline

  // Another panel of the same file saving changes this one's data too; take it
  // in unless there are unsaved edits here. (Adjusted during render, as React
  // recommends for state derived from props.)
  if (savedKey !== baseline) {
    if (!dirty) setValue(saved)
    setBaseline(savedKey)
  }

  async function save() {
    const found = cleanObject(panel.fields, value).errors
    setErrors(found)
    if (Object.keys(found).length) {
      setStatus({ tone: 'error', text: 'Some fields need attention.' })
      return
    }
    setBusy(true)
    setStatus(null)
    try {
      await change(panel.id, { op: 'update', value })
      setStatus({ tone: 'success', text: 'Saved. It goes live when an owner publishes.' })
    } catch (error) {
      if (error instanceof ApiError && error.body.errors) setErrors(error.body.errors)
      setStatus({ tone: 'error', text: errorMessage(error) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <PanelCard
      id={panel.id}
      title={panel.title}
      description={panel.description}
      actions={dirty ? <Button size="sm" variant="ghost" onClick={() => { setValue(saved); setErrors({}); setStatus(null) }}>Undo changes</Button> : undefined}
    >
      <form onSubmit={event => { event.preventDefault(); void save() }} className="flex flex-col gap-5">
        <FieldsForm fields={panel.fields} value={value} onChange={next => { setValue(next); setStatus(null) }} errors={errors} />
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" variant="primary" disabled={!dirty || busy}>{busy ? 'Saving…' : 'Save'}</Button>
          {status && <Notice tone={status.tone} className="py-2">{status.text}</Notice>}
        </div>
      </form>
    </PanelCard>
  )
}
