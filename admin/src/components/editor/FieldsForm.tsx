import type { Field } from '@shared/collections'
import type { FieldErrors } from '@shared/validate'
import type { FormValue } from '@/lib/content'
import { cn } from '@/lib/utils'
import { FieldInput } from './FieldInput'

const WIDE = new Set(['textarea', 'group', 'list', 'strings'])

type Props = {
  fields: readonly Field[]
  value: FormValue
  onChange: (value: FormValue) => void
  errors: FieldErrors
  /** Where these fields sit in the error map: `links.`, `actions.0.`. */
  prefix?: string
}

/** A form for one object, laid out from its fields: short ones in pairs, long ones full width. */
export function FieldsForm({ fields, value, onChange, errors, prefix = '' }: Props) {
  return (
    <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
      {fields.map(field => (
        <div key={field.key} className={cn(WIDE.has(field.type) && 'sm:col-span-2')}>
          <FieldInput
            field={field}
            value={value[field.key]}
            onChange={next => onChange({ ...value, [field.key]: next })}
            errors={errors}
            path={`${prefix}${field.key}`}
          />
        </div>
      ))}
    </div>
  )
}
