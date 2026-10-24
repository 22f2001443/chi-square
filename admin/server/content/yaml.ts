import { isDeepStrictEqual } from 'node:util'
import jsyaml from 'js-yaml'
import { parseDocument, visit, type Document, type Scalar } from 'yaml'
import { HttpError } from '../http.js'

/**
 * Reading and writing the site's YAML without disturbing it.
 *
 * Edits go through the `yaml` Document API rather than parse-to-JSON-and-dump,
 * because the files carry comments that explain the content, an order someone
 * chose, and keys the admin knows nothing about. Changing one node leaves the
 * rest in place.
 *
 * Two things the library would otherwise rewrite on every save are kept:
 * - `lineWidth: 0`, so long plain strings are never re-wrapped;
 * - folded `>-` blocks, which the files wrap by hand. A block whose text is
 *   unchanged is written back exactly as it was; an edited one is re-wrapped
 *   to the same width.
 */

const RENDER = { lineWidth: 0 } as const
/** The width the site's folded blocks are wrapped to, indentation included. */
const FOLD_WIDTH = 80

type StringStringify = (item: Scalar, ctx: { indent: string }, onComment?: () => void, onChompKeep?: () => void) => string

export type ParsedYaml = {
  doc: Document
  /** Each folded block's text, mapped to its header and lines as written. */
  folded: Map<string, { header: string; lines: string[] }>
}

export function parseYaml(text: string): ParsedYaml {
  const doc = parseDocument(text)
  if (doc.errors.length) throw new HttpError(422, 'yaml_invalid', `This file has a YAML error: ${doc.errors[0].message}`)
  const folded: ParsedYaml['folded'] = new Map()
  visit(doc, {
    Scalar(_, node) {
      if (node.type !== 'BLOCK_FOLDED' || !node.range || typeof node.value !== 'string') return
      const [header, ...body] = text.slice(node.range[0], node.range[2]).split('\n')
      while (body.length && !body[body.length - 1].trim()) body.pop()
      const indent = Math.min(...body.filter(line => line.trim()).map(line => line.length - line.trimStart().length))
      folded.set(node.value, { header: /^>[-+]?\d?/.exec(header)?.[0] ?? '>-', lines: body.map(line => line.slice(indent)) })
    },
  })
  return { doc, folded }
}

/**
 * Greedy wrap at single spaces. In a folded block a line break reads back as
 * one space, so breaking only where there is exactly one space keeps the text
 * identical; anything else is left to the library.
 */
function wrapFolded(value: string, indent: string): string[] | undefined {
  if (!value || /\n|\s\s|^\s|\s$/.test(value)) return undefined
  const width = Math.max(FOLD_WIDTH - indent.length, 20)
  const lines: string[] = []
  let line = ''
  for (const word of value.split(' ')) {
    if (line && line.length + 1 + word.length > width) {
      lines.push(line)
      line = word
    } else {
      line = line ? `${line} ${word}` : word
    }
  }
  lines.push(line)
  return lines
}

// js-yaml, which builds the site, reads some plain strings as other types that
// `yaml`'s core schema leaves alone (dates like 2025-01-31, `1_000`, `<<`).
function readsBackAsText(rendered: string, value: string) {
  try {
    return (jsyaml.load(`k: ${rendered}`) as { k?: unknown }).k === value
  } catch {
    return false
  }
}

export function renderYaml({ doc, folded }: ParsedYaml): string {
  const tags = doc.schema.tags as unknown as { tag: string; stringify?: StringStringify }[]
  const index = tags.findIndex(tag => tag.tag === 'tag:yaml.org,2002:str')
  const original = tags[index]
  const stringify: StringStringify = (item, ctx, onComment, onChompKeep) => {
    const value = String(item.value)
    if (item.type === 'BLOCK_FOLDED') {
      const indent = ctx.indent || '  '
      const kept = folded.get(value)
      if (kept) return `${kept.header}\n${kept.lines.map(line => (line ? indent + line : '')).join('\n')}`
      const lines = wrapFolded(value, indent)
      if (lines) return `>-\n${lines.map(line => indent + line).join('\n')}`
    }
    const rendered = original.stringify!(item, ctx, onComment, onChompKeep)
    if (/^["'|>]/.test(rendered) || readsBackAsText(rendered, value)) return rendered
    return original.stringify!(Object.assign(Object.create(Object.getPrototypeOf(item)), item, { type: 'QUOTE_DOUBLE' }), ctx, onComment, onChompKeep)
  }
  tags[index] = { ...original, stringify }
  try {
    return doc.toString(RENDER)
  } finally {
    tags[index] = original
  }
}

const normalise = (value: unknown) => JSON.parse(JSON.stringify(value ?? null))

/**
 * The last check before anything is stored: the text must read back, with the
 * site's own parser, as exactly the content that was edited. A file that would
 * build into something different from what the editor saw is never written.
 */
export function verifyYaml(text: string, doc: Document) {
  let parsed: unknown
  try {
    parsed = jsyaml.load(text)
  } catch (error) {
    throw new HttpError(500, 'yaml_unreadable', `The edited file would not parse: ${error instanceof Error ? error.message : error}`)
  }
  if (!isDeepStrictEqual(normalise(parsed), normalise(doc.toJS()))) {
    throw new HttpError(500, 'yaml_mismatch', 'The edited file would not read back as intended, so it was not saved.')
  }
}

/** What the site gets from a file: js-yaml's reading of it. */
export function readData(text: string): unknown {
  return normalise(jsyaml.load(text))
}
