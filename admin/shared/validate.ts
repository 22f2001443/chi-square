import { MAP_KEY, type Field } from './collections.js'

export type Plain = string | number | boolean | Plain[] | { [key: string]: Plain }
export type PlainObject = { [key: string]: Plain }

/** Messages keyed by where they apply: `title`, `links.youtube`, `actions.0.label`. */
export type FieldErrors = Record<string, string>

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9-]+(\.[A-Z0-9-]+)*\.[A-Z]{2,}/i
const FULL_URL = /^https?:\/\/[^\s]+$/i
const SITE_PAGE = /^\/[^\s]*$/
const COLOR = /^#[0-9a-f]{6}$/i
const MAX_TEXT = 5000

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === ''
    || (Array.isArray(value) && value.length === 0)
    || (isObject(value) && Object.keys(value).length === 0)
}

// Everything in these files ships in the site's JavaScript, so an address
// written here is published to anyone who opens the page source.
function checkText(text: string, multiline: boolean): string | undefined {
  if (text.length > MAX_TEXT) return `Keep this under ${MAX_TEXT} characters.`
  if (!multiline && /[\r\n]/.test(text)) return 'This takes one line.'
  if (EMAIL.test(text)) return 'Email addresses can’t go here: everything in these files is published.'
  return undefined
}

function checkImage(path: string): string | undefined {
  if (FULL_URL.test(path)) return undefined
  if (path.startsWith('/') || path.includes('\\') || path.split('/').includes('..') || /^[a-z]+:/i.test(path)) {
    return 'Use a path inside frontend-react/public, like "team/photo.jpg", or a full URL.'
  }
  return undefined
}

function cleanScalar(field: Field, raw: unknown): { value?: Plain; error?: string } {
  if (field.type === 'number') {
    const text = typeof raw === 'number' ? String(raw) : typeof raw === 'string' ? raw.trim() : undefined
    if (text === undefined) return { error: 'Enter a number.' }
    if (text === '') return {}
    if (!/^\d{1,9}$/.test(text)) return { error: 'Enter a whole number.' }
    return { value: Number(text) }
  }
  if (typeof raw !== 'string' && typeof raw !== 'number') return { error: 'Enter text.' }
  const text = String(raw).trim()
  if (text === '') return {}
  const textError = checkText(text, field.type === 'textarea')
  if (textError) return { error: textError }
  switch (field.type) {
    case 'link':
      return SITE_PAGE.test(text) || FULL_URL.test(text) ? { value: text } : { error: 'Use a page on the site, like "/events", or a full URL.' }
    case 'url':
      return FULL_URL.test(text) ? { value: text } : { error: 'Use a full URL starting with https://.' }
    case 'image': {
      const error = checkImage(text)
      return error ? { error } : { value: text }
    }
    case 'color':
      return COLOR.test(text) ? { value: text.toUpperCase() } : { error: 'Use a colour like #2F4BD8.' }
    case 'select':
      return field.options && !field.options.includes(text) ? { error: `Choose one of: ${field.options.join(', ')}.` } : { value: text }
    default:
      return { value: text }
  }
}

/**
 * Cleans a form's value against its fields: trims text, turns numbers typed as
 * text into numbers, and drops anything empty, so an emptied field removes its
 * key instead of writing `key: ""`. Keys the fields don't name are dropped:
 * nothing reaches a file unless the registry describes it.
 */
export function cleanObject(fields: readonly Field[], value: unknown, prefix = ''): { value: PlainObject; errors: FieldErrors } {
  const source = isObject(value) ? value : {}
  const cleaned: PlainObject = {}
  const errors: FieldErrors = {}

  for (const field of fields) {
    const at = `${prefix}${field.key}`
    const raw = source[field.key]
    let result: Plain | undefined

    if (isEmpty(raw)) {
      result = undefined
    } else if (field.type === 'group') {
      const nested = cleanObject(field.fields ?? [], raw, `${at}.`)
      Object.assign(errors, nested.errors)
      result = isEmpty(nested.value) ? undefined : nested.value
    } else if (field.type === 'list') {
      if (!Array.isArray(raw)) {
        errors[at] = 'Expected a list.'
        continue
      }
      const items: PlainObject[] = []
      raw.forEach((item, index) => {
        const nested = cleanObject(field.fields ?? [], item, `${at}.${index}.`)
        Object.assign(errors, nested.errors)
        if (!isEmpty(nested.value)) items.push(nested.value)
      })
      result = items.length ? items : undefined
    } else if (field.type === 'strings') {
      if (!Array.isArray(raw)) {
        errors[at] = 'Expected a list.'
        continue
      }
      const items: string[] = []
      raw.forEach((item, index) => {
        const text = typeof item === 'string' ? item.trim() : ''
        if (!text) return
        const error = checkText(text, false)
        if (error) errors[`${at}.${index}`] = error
        else items.push(text)
      })
      result = items.length ? items : undefined
    } else {
      const scalar = cleanScalar(field, raw)
      if (scalar.error) errors[at] = scalar.error
      result = scalar.value
    }

    if (result === undefined) {
      if (field.required && !errors[at]) errors[at] = 'Required.'
    } else {
      cleaned[field.key] = result
    }
  }
  return { value: cleaned, errors }
}

export function checkMapKey(key: unknown): string | undefined {
  if (typeof key !== 'string' || !MAP_KEY.test(key)) return 'Use letters, digits, - or _ (up to 40).'
  return undefined
}
