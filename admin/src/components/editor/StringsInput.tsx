import { Plus, X } from 'lucide-react'
import type { Field } from '@shared/collections'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = { id: string; field: Field; value: string[]; onChange: (value: string[]) => void; options?: string[] }

/**
 * A list of short strings. With choices read from content (kinds of event)
 * it's a set of checkboxes, keeping any value the file has that is no longer a
 * choice; otherwise one input per item.
 */
export function StringsInput({ id, field, value, onChange, options }: Props) {
  if (options) {
    const choices = [...options, ...value.filter(item => !options.includes(item))]
    return (
      <div id={id} className="flex flex-wrap gap-2">
        {choices.map(option => {
          const checked = value.includes(option)
          return (
            <label key={option} className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-full border border-field px-3 text-[13px] has-checked:border-accent has-checked:bg-accent-soft has-checked:text-accent-strong">
              <input type="checkbox" className="accent-accent" checked={checked} onChange={() => onChange(checked ? value.filter(item => item !== option) : [...value, option])} />
              {option}
            </label>
          )
        })}
      </div>
    )
  }
  return (
    <div id={id} className="flex flex-col gap-2">
      {value.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input value={item} aria-label={`${field.label} ${index + 1}`} onChange={event => onChange(value.map((other, i) => (i === index ? event.target.value : other)))} />
          <Button variant="ghost" size="icon" className="mt-1" aria-label={`Remove ${item || 'item'}`} onClick={() => onChange(value.filter((_, i) => i !== index))}>
            <X />
          </Button>
        </div>
      ))}
      <Button size="sm" className="self-start" onClick={() => onChange([...value, ''])}>
        <Plus /> Add
      </Button>
    </div>
  )
}
