import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import type { Field } from '@shared/collections'
import type { FieldErrors } from '@shared/validate'
import { Button } from '@/components/ui/button'
import type { FormValue } from '@/lib/content'
import { FieldsForm } from './FieldsForm'

type Props = { field: Field; value: FormValue[]; onChange: (value: FormValue[]) => void; errors: FieldErrors; path: string }

/** A short list of objects edited in place: buttons, tabs, footer links. */
export function ObjectListInput({ field, value, onChange, errors, path }: Props) {
  const noun = field.itemLabel ?? 'item'
  const move = (from: number, to: number) => {
    const next = [...value]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-3">
      {value.map((item, index) => (
        <div key={index} className="rounded-lg border border-line bg-surface/60 p-4">
          <div className="mb-3 flex items-center gap-1">
            <span className="flex-1 font-mono text-xs uppercase tracking-[0.06em] text-muted">{noun} {index + 1}</span>
            <Button variant="ghost" size="icon" aria-label={`Move ${noun} ${index + 1} up`} disabled={index === 0} onClick={() => move(index, index - 1)}><ArrowUp /></Button>
            <Button variant="ghost" size="icon" aria-label={`Move ${noun} ${index + 1} down`} disabled={index === value.length - 1} onClick={() => move(index, index + 1)}><ArrowDown /></Button>
            <Button variant="ghost" size="icon" aria-label={`Remove ${noun} ${index + 1}`} onClick={() => onChange(value.filter((_, i) => i !== index))}><Trash2 /></Button>
          </div>
          <FieldsForm fields={field.fields ?? []} value={item} onChange={next => onChange(value.map((other, i) => (i === index ? next : other)))} errors={errors} prefix={`${path}.${index}.`} />
        </div>
      ))}
      <Button size="sm" className="self-start" onClick={() => onChange([...value, {}])}>
        <Plus /> Add {noun}
      </Button>
    </div>
  )
}
