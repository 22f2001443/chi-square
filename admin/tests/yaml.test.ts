import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import jsyaml from 'js-yaml'
import type { ChangeRequest } from '../shared/api.js'
import { files, findPanel, type FileId } from '../shared/collections.js'
import { applyChange } from '../server/content/edit.js'
import { parseYaml, renderYaml, verifyYaml } from '../server/content/yaml.js'
import { HttpError } from '../server/http.js'

const site = (id: FileId) => readFileSync(new URL(`../../${files[id]}`, import.meta.url), 'utf8')

function edit(text: string, panelId: string, change: Omit<ChangeRequest, 'hash'>) {
  const parsed = parseYaml(text)
  const summary = applyChange(parsed.doc, findPanel(panelId)!, { hash: '', ...change })
  const out = renderYaml(parsed)
  verifyYaml(out, parsed.doc)
  return { out, summary, data: jsyaml.load(out) as Record<string, any> }
}

/** Lines of `after` that are not in `before`, and the reverse. */
function changedLines(before: string, after: string) {
  const a = before.split('\n')
  const b = after.split('\n')
  return { added: b.filter(line => !a.includes(line)), removed: a.filter(line => !b.includes(line)) }
}

test('every site file renders back byte for byte when nothing changes', () => {
  for (const id of Object.keys(files) as FileId[]) {
    const text = site(id)
    assert.equal(renderYaml(parseYaml(text)), text, id)
  }
})

test('editing one field changes only that line', () => {
  const before = site('home')
  const { out, data, summary } = edit(before, 'home.latest', { op: 'update', value: { eyebrow: 'Our journey', title: 'New title', count: '4', types: ['Academic Talks', 'Contests'] } })
  assert.equal(data.latest.title, 'New title')
  assert.equal(data.latest.count, 4)
  assert.deepEqual(changedLines(before, out), { added: ['  title: New title', '  count: 4'], removed: ['  title: Latest from Chi-Square', '  count: 3'] })
  assert.equal(summary, 'Updated Home › Latest events')
})

test('an edited folded block stays folded and wraps; untouched blocks keep their wrapping', () => {
  const before = site('home')
  const lede = 'A much longer introduction that will certainly not fit on one line of the file, so it has to wrap onto the next lines of the block.'
  const { out, data } = edit(before, 'home.hero', { op: 'update', value: { eyebrow: 'IIT Madras · BS Degree · Since 2023', lede, actions: [
    { label: 'See upcoming events', href: '/events/upcomings', style: 'primary' },
    { label: 'Explore our journey', href: '/events', style: 'secondary' },
  ] } })
  assert.equal(data.hero.lede, lede)
  assert.match(out, /lede: >-\n {4}A much longer/)
  assert.ok(out.split('\n').every(line => line.length <= 100), 'no line runs on')
  // The join band's folded text was not edited, so it is exactly as written.
  assert.ok(out.includes('    Get hands-on exposure to data, research, and analytical thinking through\n    revision sessions, academic talks, and collaborative projects.'))
})

test('a button written with `to:` keeps `to:`', () => {
  const { out, data } = edit(site('home'), 'home.hero', { op: 'update', value: { lede: 'Short.', actions: [{ label: 'Go', href: '/events', style: 'primary' }] } })
  assert.equal(data.hero.actions[0].to, '/events')
  assert.ok(!('href' in data.hero.actions[0]))
  assert.ok(!out.includes('href: /events\n      style'))
})

test('list entries can be added, updated, moved and removed', () => {
  const start = site('events')
  const count = (jsyaml.load(start) as any).events.length
  const added = edit(start, 'events.events', { op: 'create', index: 0, value: { name: 'New talk', type: 'Academic Talks', term: 'January 2027', hosts: ['A', ' ', 'B'], links: { youtube: 'https://youtu.be/x' } } })
  assert.equal(added.data.events.length, count + 1)
  assert.deepEqual(added.data.events[0], { name: 'New talk', type: 'Academic Talks', term: 'January 2027', hosts: ['A', 'B'], links: { youtube: 'https://youtu.be/x' } })
  assert.equal(added.summary, 'Added event “New talk” to Our Journey › Events')

  const updated = edit(added.out, 'events.events', { op: 'update', index: 0, value: { name: 'Renamed talk', type: 'Contests', term: 'January 2027' } })
  assert.deepEqual(updated.data.events[0], { name: 'Renamed talk', type: 'Contests', term: 'January 2027' })

  const moved = edit(updated.out, 'events.events', { op: 'move', index: 0, to: 2 })
  assert.equal(moved.data.events[2].name, 'Renamed talk')

  const removed = edit(moved.out, 'events.events', { op: 'delete', index: 2 })
  assert.equal(removed.data.events.length, count)
  assert.equal(removed.out, start)
})

test('keys the form does not know about are left alone', () => {
  const text = 'events:\n  - name: A\n    type: Contests\n    term: May 2025\n    secretNote: keep me # and my comment\n'
  const { out } = edit(text, 'events.events', { op: 'update', index: 0, value: { name: 'B', type: 'Contests', term: 'May 2025' } })
  assert.equal(out, 'events:\n  - name: B\n    type: Contests\n    term: May 2025\n    secretNote: keep me # and my comment\n')
})

test('a new key lands in field order, not at the end', () => {
  const text = 'events:\n  - name: A\n    type: Contests\n    term: May 2025\n'
  const { out } = edit(text, 'events.events', { op: 'update', index: 0, value: { name: 'A', type: 'Contests', series: 'S01P01', term: 'May 2025' } })
  assert.equal(out, 'events:\n  - name: A\n    type: Contests\n    series: S01P01\n    term: May 2025\n')
})

test('emptying a section heading keeps the section’s members', () => {
  const { data } = edit(site('people'), 'people.headings', { op: 'update', value: { coreTeam: {}, alumni: { title: 'Alumni' } } })
  assert.equal(data.coreTeam.title, undefined)
  assert.ok(data.coreTeam.members.length > 0, 'a section whose heading was removed keeps its members')
  assert.ok(Array.isArray(data.collaborators.members))
})

test('the commented-out template above a list survives removing every entry and adding one back', () => {
  const before = site('people')
  const members = (jsyaml.load(before) as any).coreTeam.members.length
  let text = before
  for (let i = 0; i < members; i++) text = edit(text, 'people.coreTeam', { op: 'delete', index: 0 }).out
  assert.ok(text.includes('#   role: Founder & Club Administrator'))
  assert.equal((jsyaml.load(text) as any).coreTeam.members, null)
  const { out, data } = edit(text, 'people.coreTeam', { op: 'create', value: { name: 'New Person', role: 'Member' } })
  assert.deepEqual(data.coreTeam.members, [{ name: 'New Person', role: 'Member' }])
  assert.ok(out.includes('#   role: Founder & Club Administrator'))
})

test('adding to an empty flow list writes a block list', () => {
  const { out, data } = edit(site('upcoming'), 'upcoming.events', { op: 'create', value: { title: 'Paradox 2027', tabs: [{ label: 'Details', content: 'All about it.' }] } })
  assert.deepEqual(data.events, [{ title: 'Paradox 2027', tabs: [{ label: 'Details', content: 'All about it.' }] }])
  assert.match(out, /events:\n {2}- title: Paradox 2027\n {4}tabs:\n {6}- label: Details/)
})

test('series can be added, renamed and removed by code', () => {
  const start = site('series')
  const added = edit(start, 'events.series', { op: 'create', key: 'GE03', value: { name: 'Guest Series 03', topic: 'Bayesian thinking' } })
  assert.deepEqual(added.data.GE03, { name: 'Guest Series 03', topic: 'Bayesian thinking' })
  const renamed = edit(added.out, 'events.series', { op: 'update', key: 'GE03', newKey: 'GE04', value: { name: 'Guest Series 04' } })
  assert.deepEqual(renamed.data.GE04, { name: 'Guest Series 04' })
  assert.equal(renamed.data.GE03, undefined)
  assert.equal(edit(renamed.out, 'events.series', { op: 'delete', key: 'GE04' }).out, start)
  assert.throws(() => edit(start, 'events.series', { op: 'create', key: 'S01P01', value: { name: 'Dup' } }), (error: HttpError) => error.status === 422)
})

test('flags switch pages and sections', () => {
  const pages = findPanel('visibility.pages')!
  const blogs = pages.kind === 'flags' ? pages.flags.findIndex(flag => flag.path[1] === '/blogs') : -1
  const { data, summary } = edit(site('features'), 'visibility.pages', { op: 'set', flag: blogs, value: true })
  assert.equal(data.pages['/blogs'], true)
  assert.equal(summary, 'Turned on Blogs (Pages)')
})

test('text the site would read as something else is quoted', () => {
  const { out, data } = edit(site('blogs'), 'blogs.posts', { op: 'create', value: { title: '2025-01-31', date: '1_000', link: 'https://example.com/post' } })
  assert.equal(data.posts.at(-1).title, '2025-01-31')
  assert.equal(data.posts.at(-1).date, '1_000')
  assert.match(out, /title: "2025-01-31"/)
})

test('values are checked against their fields', () => {
  const invalid = (panel: string, change: Omit<ChangeRequest, 'hash'>) => {
    try {
      edit(site('people'), panel, change)
    } catch (error) {
      assert.ok(error instanceof HttpError)
      return (error.extra.errors ?? {}) as Record<string, string>
    }
    assert.fail('expected the change to be refused')
  }
  assert.match(invalid('people.coreTeam', { op: 'create', value: { name: 'X', role: 'Write to me at someone@example.com' } }).role, /Email/)
  assert.equal(invalid('people.coreTeam', { op: 'create', value: { role: 'No name' } }).name, 'Required.')
  assert.match(invalid('people.coreTeam', { op: 'create', value: { name: 'X', linkedin: 'linkedin.com/in/x' } }).linkedin, /https/)
  assert.match(invalid('people.coreTeam', { op: 'create', value: { name: 'X', photo: '../../secrets.png' } }).photo, /public/)
  assert.throws(() => edit(site('people'), 'people.coreTeam', { op: 'update', index: 999, value: { name: 'X' } }), (error: HttpError) => error.status === 409)
})
