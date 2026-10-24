import { isMap, isScalar, isSeq, Scalar, YAMLMap, YAMLSeq, type Document, type Node, type Pair } from 'yaml'
import type { ChangeRequest } from '../../shared/api.js'
import { findSectionOfPanel, type Field, type FieldsPanel, type FlagsPanel, type ListPanel, type MapPanel, type Panel, type YamlPath } from '../../shared/collections.js'
import { checkMapKey, cleanObject, type Plain, type PlainObject } from '../../shared/validate.js'
import { HttpError } from '../http.js'

/**
 * One change from the browser, applied to one parsed file. Every operation is
 * reached through a registry panel, so the path it writes to comes from the
 * registry and the value is cleaned against the panel's fields first. Returns a
 * one-line summary for the pending list and the activity log.
 */
export function applyChange(doc: Document, panel: Panel, change: ChangeRequest): string {
  switch (panel.kind) {
    case 'fields': return editFields(doc, panel, change)
    case 'list': return editList(doc, panel, change)
    case 'map': return editMap(doc, panel, change)
    case 'flags': return editFlag(doc, panel, change)
  }
}

function clean(fields: readonly Field[], value: unknown): PlainObject {
  const { value: cleaned, errors } = cleanObject(fields, value)
  if (Object.keys(errors).length) throw new HttpError(422, 'invalid', 'Some fields need attention.', { errors })
  return cleaned
}

function where(panel: Panel) {
  const section = findSectionOfPanel(panel.id)
  return section && section.label !== panel.title ? `${section.label} › ${panel.title}` : panel.title
}

function nodeAt(doc: Document, path: YamlPath): unknown {
  return path.length ? doc.getIn(path, true) : doc.contents
}

/** The node at `path` as a map, creating it (and its parents) if it is absent or empty. */
function mapAt(doc: Document, path: YamlPath): YAMLMap {
  const node = nodeAt(doc, path)
  if (isMap(node)) return node
  if (node !== undefined && node !== null && !(isScalar(node) && node.value === null)) {
    throw new HttpError(409, 'unexpected_shape', `Expected an object at ${path.join('.') || 'the top of the file'}.`)
  }
  const map = doc.createNode({}) as YAMLMap
  if (path.length) doc.setIn(path, map)
  else doc.contents = map as unknown as Document['contents']
  return map
}

/**
 * The node at `path` as a list. A list whose entries are all commented out
 * reads as an empty value carrying those comments; it becomes a real list with
 * the comments kept above its first entry.
 */
function seqAt(doc: Document, path: YamlPath, create: boolean): YAMLSeq | undefined {
  const node = nodeAt(doc, path)
  if (isSeq(node)) return node
  const empty = node === undefined || node === null || (isScalar(node) && node.value === null)
  if (!empty) throw new HttpError(409, 'unexpected_shape', `Expected a list at ${path.join('.')}.`)
  if (!create) return undefined
  const seq = new YAMLSeq()
  if (isScalar(node) && node.comment) seq.commentBefore = node.comment
  doc.setIn(path, seq)
  return seq
}

// Where a new key goes: before the first key the fields list after it, so a
// field added later lands where it would have been written by hand.
function insertPair(doc: Document, map: YAMLMap, fields: readonly Field[], field: Field, key: string, node: unknown) {
  const order = (name: unknown) => fields.findIndex(f => f.key === name || f.aliases?.includes(String(name)))
  const own = order(field.key)
  const position = map.items.findIndex(pair => order(isScalar(pair.key) ? pair.key.value : pair.key) > own)
  const pair = doc.createPair(key, node) as Pair
  if (position < 0) map.items.push(pair)
  else map.items.splice(position, 0, pair)
}

const LONG_TEXT = 72

function createValueNode(doc: Document, field: Field, value: Plain): Node {
  const node = doc.createNode(value) as Node
  // New long text is written the way the files write it: as a folded block.
  if (field.type === 'textarea' && isScalar(node) && typeof value === 'string' && value.length > LONG_TEXT) node.type = 'BLOCK_FOLDED'
  return node
}

/**
 * Writes `value` into an existing map, field by field. Scalars are changed in
 * place so their quoting, block style and comments survive; keys the fields do
 * not name are never touched; an emptied field removes its key.
 */
function writeObject(doc: Document, map: YAMLMap, fields: readonly Field[], value: PlainObject) {
  for (const field of fields) {
    const spellings = [field.key, ...(field.aliases ?? [])]
    const present = spellings.filter(key => map.has(key))
    const key = present[0] ?? field.key
    for (const extra of present.slice(1)) map.delete(extra)
    const next = value[field.key]

    if (field.type === 'group') {
      // Recursing even when the group was emptied: it may hold keys the form
      // doesn't show (a section's `members` beside its `title`).
      const existing: unknown = map.get(key, true)
      let group: YAMLMap
      if (isMap(existing)) {
        group = existing
      } else {
        if (next === undefined) continue
        group = doc.createNode({}) as YAMLMap
        insertPair(doc, map, fields, field, key, group)
      }
      writeObject(doc, group, field.fields ?? [], (next ?? {}) as PlainObject)
      if (!group.items.length) map.delete(key)
      continue
    }

    if (next === undefined) {
      map.delete(key)
      continue
    }
    const existing: unknown = map.get(key, true)
    if (field.type === 'list') {
      const seq = isSeq(existing) ? existing : new YAMLSeq()
      writeList(doc, seq, field.fields ?? [], next as PlainObject[])
      if (!isSeq(existing)) {
        if (map.has(key)) map.set(key, seq)
        else insertPair(doc, map, fields, field, key, seq)
      }
      continue
    }
    if (isScalar(existing) && typeof next !== 'object') {
      if (existing.value !== next) existing.value = next
      continue
    }
    const node = createValueNode(doc, field, next)
    if (map.has(key)) map.set(key, node)
    else insertPair(doc, map, fields, field, key, node)
  }
}

function newEntry(doc: Document, fields: readonly Field[], value: PlainObject): YAMLMap {
  const map = doc.createNode({}) as YAMLMap
  writeObject(doc, map, fields, value)
  return map
}

// A list inside an entry (buttons, tabs, links) is merged item by item, so each
// item keeps its spelling of a key, its unknown keys and its comments.
function writeList(doc: Document, seq: YAMLSeq, fields: readonly Field[], items: PlainObject[]) {
  seq.flow = false
  items.forEach((item, index) => {
    const current = seq.items[index]
    if (isMap(current)) writeObject(doc, current, fields, item)
    else seq.items[index] = newEntry(doc, fields, item)
  })
  seq.items.splice(items.length)
}

function entryName(doc: Document, panel: ListPanel | MapPanel, node: unknown, fallback: string): string {
  const data = node && typeof (node as Node).toJSON === 'function' ? (node as Node).toJSON(doc) : node
  const name = data && typeof data === 'object' ? (data as Record<string, unknown>)[panel.columns[0]] : undefined
  return typeof name === 'string' || typeof name === 'number' ? `“${String(name)}”` : fallback
}

function editFields(doc: Document, panel: FieldsPanel, change: ChangeRequest) {
  if (change.op !== 'update') throw new HttpError(400, 'invalid_op')
  writeObject(doc, mapAt(doc, panel.path), panel.fields, clean(panel.fields, change.value))
  return `Updated ${where(panel)}`
}

function indexIn(seq: YAMLSeq | undefined, index: unknown, allowEnd = false): number {
  const length = seq?.items.length ?? 0
  if (!Number.isInteger(index) || (index as number) < 0 || (index as number) > (allowEnd ? length : length - 1)) {
    throw new HttpError(409, 'entry_not_found', 'That entry is no longer there. Reload to see the latest.')
  }
  return index as number
}

function editList(doc: Document, panel: ListPanel, change: ChangeRequest) {
  const label = panel.itemLabel
  if (change.op === 'create') {
    const value = clean(panel.fields, change.value)
    const seq = seqAt(doc, panel.path, true)!
    seq.flow = false
    const index = change.index === undefined ? seq.items.length : indexIn(seq, change.index, true)
    const entry = newEntry(doc, panel.fields, value)
    seq.items.splice(index, 0, entry)
    const name = entryName(doc, panel, entry, '')
    return `Added ${label}${name ? ` ${name}` : ''} to ${where(panel)}`
  }
  const seq = seqAt(doc, panel.path, false)
  const index = indexIn(seq, change.index)
  const item = seq!.items[index]
  const name = entryName(doc, panel, item, `#${index + 1}`)

  if (change.op === 'update') {
    if (!isMap(item)) throw new HttpError(409, 'unexpected_shape', 'That entry is not an object.')
    writeObject(doc, item, panel.fields, clean(panel.fields, change.value))
    return `Updated ${label} ${entryName(doc, panel, item, name)} in ${where(panel)}`
  }
  if (change.op === 'delete') {
    const [removed] = seq!.items.splice(index, 1) as Node[]
    // A comment above a middle entry usually introduces what follows it.
    if (removed?.commentBefore && seq!.items[index]) {
      const next = seq!.items[index] as Node
      next.commentBefore = [removed.commentBefore, next.commentBefore].filter(Boolean).join('\n')
    }
    // An emptied list goes back to the commented-out form it may have started as.
    if (!seq!.items.length) {
      const empty = new Scalar(null)
      if (seq!.commentBefore) empty.comment = seq!.commentBefore
      doc.setIn(panel.path, empty)
    }
    return `Removed ${label} ${name} from ${where(panel)}`
  }
  if (change.op === 'move') {
    const to = indexIn(seq, change.to)
    const [moved] = seq!.items.splice(index, 1)
    seq!.items.splice(to, 0, moved)
    return `Moved ${label} ${name} in ${where(panel)}`
  }
  throw new HttpError(400, 'invalid_op')
}

function findPair(map: YAMLMap, key: string) {
  return map.items.find(pair => (isScalar(pair.key) ? pair.key.value : pair.key) === key)
}

function editMap(doc: Document, panel: MapPanel, change: ChangeRequest) {
  const map = mapAt(doc, panel.path)
  const label = panel.itemLabel
  if (change.op === 'create') {
    const keyError = checkMapKey(change.key)
    if (keyError) throw new HttpError(422, 'invalid', keyError, { errors: { key: keyError } })
    if (findPair(map, change.key!)) throw new HttpError(422, 'invalid', `${change.key} already exists.`, { errors: { key: 'Already in use.' } })
    map.items.push(doc.createPair(change.key, newEntry(doc, panel.fields, clean(panel.fields, change.value))) as Pair)
    return `Added ${label} ${change.key} to ${where(panel)}`
  }
  const pair = typeof change.key === 'string' ? findPair(map, change.key) : undefined
  if (!pair) throw new HttpError(409, 'entry_not_found', 'That entry is no longer there. Reload to see the latest.')

  if (change.op === 'update') {
    const value = clean(panel.fields, change.value)
    let summary = `Updated ${label} ${change.key} in ${where(panel)}`
    if (change.newKey !== undefined && change.newKey !== change.key) {
      const keyError = checkMapKey(change.newKey)
      if (keyError) throw new HttpError(422, 'invalid', keyError, { errors: { key: keyError } })
      if (findPair(map, change.newKey)) throw new HttpError(422, 'invalid', `${change.newKey} already exists.`, { errors: { key: 'Already in use.' } })
      if (isScalar(pair.key)) pair.key.value = change.newKey
      else pair.key = doc.createNode(change.newKey)
      summary = `Renamed ${label} ${change.key} to ${change.newKey} in ${where(panel)}`
    }
    if (!isMap(pair.value)) pair.value = doc.createNode({})
    writeObject(doc, pair.value as YAMLMap, panel.fields, value)
    return summary
  }
  if (change.op === 'delete') {
    const index = map.items.indexOf(pair)
    map.items.splice(index, 1)
    const next = map.items[index]
    const removedComment = (pair.key as Node | null)?.commentBefore
    if (removedComment && next && isScalar(next.key)) next.key.commentBefore = [removedComment, next.key.commentBefore].filter(Boolean).join('\n')
    return `Removed ${label} ${change.key} from ${where(panel)}`
  }
  throw new HttpError(400, 'invalid_op')
}

function editFlag(doc: Document, panel: FlagsPanel, change: ChangeRequest) {
  const flag = Number.isInteger(change.flag) ? panel.flags[change.flag!] : undefined
  if (change.op !== 'set' || !flag || typeof change.value !== 'boolean') throw new HttpError(400, 'invalid_op')
  const existing = doc.getIn(flag.path, true)
  if (isScalar(existing)) existing.value = change.value
  else doc.setIn(flag.path, change.value)
  return `Turned ${change.value ? 'on' : 'off'} ${flag.label}${panel.title === 'Visibility' ? '' : ` (${panel.title})`}`
}
