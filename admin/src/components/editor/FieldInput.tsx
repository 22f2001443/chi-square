import { useId } from 'react'
import type { Field } from '@shared/collections'
import type { FieldErrors } from '@shared/validate'
import { Thumbnail } from '@/components/admin/Thumbnail'
import { Input, Select, Textarea } from '@/components/ui/input'
import { useContent } from '@/hooks/contentContext'
import { optionsFor, type FormValue } from '@/lib/content'
import { ObjectListInput } from './ObjectListInput'
import { StringsInput } from './StringsInput'
import { FieldsForm } from './FieldsForm'

type Props = {
  field: Field
  value: unknown
  onChange: (value: unknown) => void
  errors: FieldErrors
  /** This field's key in the error map. */
  path: string
}

const PLACEHOLDERS: Partial<Record<Field['type'], string>> = {
  link: '/events or https://…',
  url: 'https://…',
  image: 'Posters/S01P01/01.png or https://…',
  color: '#2F4BD8',
}

export function FieldInput({ field, value, onChange, errors, path }: Props) {
  const id = useId()
  const { files } = useContent()
  const error = errors[path]
  const text = typeof value === 'string' ? value : ''
  const describedBy = [field.help && `${id}-help`, error && `${id}-error`].filter(Boolean).join(' ') || undefined

  if (field.type === 'group') {
    return (
      <fieldset className="rounded-lg border border-line p-4">
        <legend className="px-1 text-sm font-semibold">{field.label}</legend>
        {field.help && <p className="mb-3 text-xs text-muted">{field.help}</p>}
        <FieldsForm fields={field.fields ?? []} value={(value ?? {}) as FormValue} onChange={onChange} errors={errors} prefix={`${path}.`} />
      </fieldset>
    )
  }

  let control
  switch (field.type) {
    case 'textarea':
      control = <Textarea id={id} value={text} onChange={event => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={describedBy} rows={Math.min(8, Math.max(3, Math.ceil(text.length / 70)))} />
      break
    case 'number':
      control = <Input id={id} inputMode="numeric" value={text} onChange={event => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={describedBy} className="max-w-40" />
      break
    case 'select': {
      const options = field.options ?? (field.optionsFrom ? optionsFor(field.optionsFrom, files) : [])
      const choices = text && !options.includes(text) ? [text, ...options] : options
      control = (
        <Select id={id} value={text} onChange={event => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={describedBy}>
          <option value="">{field.required ? 'Choose…' : '—'}</option>
          {choices.map(option => <option key={option} value={option}>{option}</option>)}
        </Select>
      )
      break
    }
    case 'color':
      control = (
        <div className="flex items-center gap-2">
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(text) ? text : '#000000'} onChange={event => onChange(event.target.value.toUpperCase())} className="h-10 w-12 cursor-pointer rounded-lg border border-field bg-paper p-1" aria-label={`${field.label} picker`} />
          <Input id={id} value={text} onChange={event => onChange(event.target.value)} placeholder={PLACEHOLDERS.color} aria-invalid={Boolean(error)} aria-describedby={describedBy} className="max-w-36 font-mono" />
        </div>
      )
      break
    case 'image':
      control = (
        <div className="flex items-start gap-3">
          <Input id={id} value={text} onChange={event => onChange(event.target.value)} placeholder={PLACEHOLDERS.image} aria-invalid={Boolean(error)} aria-describedby={describedBy} />
          {text && <Thumbnail path={text.trim()} className="size-10" />}
        </div>
      )
      break
    case 'strings':
      control = <StringsInput id={id} field={field} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} options={field.optionsFrom ? optionsFor(field.optionsFrom, files) : undefined} />
      break
    case 'list':
      control = <ObjectListInput field={field} value={Array.isArray(value) ? (value as FormValue[]) : []} onChange={onChange} errors={errors} path={path} />
      break
    default:
      control = <Input id={id} value={text} onChange={event => onChange(event.target.value)} placeholder={PLACEHOLDERS[field.type]} aria-invalid={Boolean(error)} aria-describedby={describedBy} />
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-ink">
        {field.label}
        {field.required && <span className="text-danger"> *</span>}
      </label>
      {control}
      {field.help && <p id={`${id}-help`} className="text-xs leading-relaxed text-muted">{field.help}</p>}
      {error && <p id={`${id}-error`} className="text-xs font-medium text-danger">{error}</p>}
    </div>
  )
}
