import type { FileState } from '@shared/api'
import type { Field, FileId, OptionSource, YamlPath } from '@shared/collections'
import { isObject } from '@shared/validate'

export type Files = Record<FileId, FileState>
export type FormValue = Record<string, unknown>

export function getIn(data: unknown, path: YamlPath): unknown {
  let node = data
  for (const key of path) node = isObject(node) ? node[key] : undefined
  return node
}

/**
 * A YAML object as a form edits it: every value under its field's own key
 * (whichever spelling the file uses), numbers as text, nothing the fields don't
 * name.
 */
export function toFormValue(fields: readonly Field[], data: unknown): FormValue {
  const source = isObject(data) ? data : {}
  const value: FormValue = {}
  for (const field of fields) {
    const raw = [field.key, ...(field.aliases ?? [])].map(key => source[key]).find(item => item !== undefined && item !== null)
    if (raw === undefined) continue
    if (field.type === 'group') value[field.key] = toFormValue(field.fields ?? [], raw)
    else if (field.type === 'list') value[field.key] = Array.isArray(raw) ? raw.map(item => toFormValue(field.fields ?? [], item)) : []
    else if (field.type === 'strings') value[field.key] = Array.isArray(raw) ? raw.map(String) : []
    else value[field.key] = typeof raw === 'object' ? JSON.stringify(raw) : String(raw)
  }
  return value
}

/** A select's choices, read from the content it points at. */
export function optionsFor(source: OptionSource, files: Files): string[] {
  const node = getIn(files[source.file]?.data, source.path)
  if (source.field) {
    return Array.isArray(node) ? node.map(item => (isObject(item) ? item[source.field!] : undefined)).filter((item): item is string => typeof item === 'string') : []
  }
  return isObject(node) ? Object.keys(node) : []
}

export function display(value: unknown): string {
  if (value === undefined || value === null) return ''
  if (Array.isArray(value)) return value.map(display).join(', ')
  if (isObject(value)) return Object.values(value).map(display).filter(Boolean).join(' · ')
  return String(value)
}

export function imageUrl(path: string, assetBase: string) {
  return /^https?:\/\//.test(path) ? path : assetBase + path.split('/').map(encodeURIComponent).join('/')
}
