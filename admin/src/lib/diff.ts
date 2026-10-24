export type DiffLine = { kind: 'same' | 'add' | 'remove'; text: string }
export type DiffRow = DiffLine | { kind: 'skip'; count: number }

/** A line diff by longest common subsequence; the site's files are a few hundred lines. */
export function diffLines(before: string, after: string): DiffLine[] {
  const a = before.split('\n')
  const b = after.split('\n')
  const table = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1))
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1])
    }
  }
  const lines: DiffLine[] = []
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      lines.push({ kind: 'same', text: a[i] })
      i++
      j++
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      lines.push({ kind: 'remove', text: a[i++] })
    } else {
      lines.push({ kind: 'add', text: b[j++] })
    }
  }
  while (i < a.length) lines.push({ kind: 'remove', text: a[i++] })
  while (j < b.length) lines.push({ kind: 'add', text: b[j++] })
  return lines
}

/** Only the changes, with `context` unchanged lines around each. */
export function hunks(lines: DiffLine[], context = 3): DiffRow[] {
  const near = lines.map((_, index) => lines.slice(Math.max(0, index - context), index + context + 1).some(line => line.kind !== 'same'))
  const rows: DiffRow[] = []
  lines.forEach((line, index) => {
    if (near[index]) {
      rows.push(line)
      return
    }
    const last = rows[rows.length - 1]
    if (last?.kind === 'skip') last.count++
    else rows.push({ kind: 'skip', count: 1 })
  })
  return rows
}
