import { useState } from 'react'
import type { Field } from '@shared/collections'
import { checkMapKey, cleanObject, type FieldErrors } from '@shared/validate'
import { Notice } from '@/components/admin/Notice'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { FormValue } from '@/lib/content'
import { ApiError, errorMessage } from '@/services/api'
import { FieldsForm } from './FieldsForm'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  fields: readonly Field[]
  initial: FormValue
  /** For entries keyed by a code (series): the key and how to label it. */
  keyField?: { label: string; help?: string; initial: string }
  onSave: (value: FormValue, key?: string) => Promise<unknown>
  onDelete?: () => Promise<unknown>
}

/**
 * Edits one entry. The same rules the server applies run here first, so most
 * mistakes are pointed out before anything is sent; the server's answer has the
 * final word and its messages land on the same fields.
 */
export function EntryDialog({ open, onOpenChange, title, fields, initial, keyField, onSave, onDelete }: Props) {
  const [value, setValue] = useState(initial)
  const [key, setKey] = useState(keyField?.initial ?? '')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function run(action: () => Promise<unknown>) {
    setBusy(true)
    setMessage(null)
    try {
      await action()
      onOpenChange(false)
    } catch (error) {
      if (error instanceof ApiError && error.body.errors) setErrors(error.body.errors)
      setMessage(errorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  function save() {
    const found = { ...cleanObject(fields, value).errors }
    const keyError = keyField ? checkMapKey(key.trim()) : undefined
    if (keyError) found.key = keyError
    setErrors(found)
    if (Object.keys(found).length) {
      setMessage('Some fields need attention.')
      return
    }
    void run(() => onSave(value, keyField ? key.trim() : undefined))
  }

  function remove() {
    if (onDelete && window.confirm(`Remove this entry? It disappears from the site when the change is published.`)) void run(onDelete)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      footer={(
        <>
          {onDelete && <Button variant="danger" onClick={remove} disabled={busy}>Remove</Button>}
          <span className="flex-1" />
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save'}</Button>
        </>
      )}
    >
      <form onSubmit={event => { event.preventDefault(); save() }} className="flex flex-col gap-5">
        {message && <Notice tone="error">{message}</Notice>}
        {keyField && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="entry-key" className="text-[13px] font-semibold">{keyField.label}<span className="text-danger"> *</span></label>
            <Input id="entry-key" value={key} onChange={event => setKey(event.target.value)} className="max-w-56 font-mono" aria-invalid={Boolean(errors.key)} />
            {keyField.help && <p className="text-xs text-muted">{keyField.help}</p>}
            {errors.key && <p className="text-xs font-medium text-danger">{errors.key}</p>}
          </div>
        )}
        <FieldsForm fields={fields} value={value} onChange={setValue} errors={errors} />
        <button type="submit" hidden />
      </form>
    </Dialog>
  )
}
