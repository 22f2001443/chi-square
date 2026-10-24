import { useCallback, useEffect, useState } from 'react'
import type { PendingEntry, PendingResponse, PublishResponse } from '@shared/api'
import { sections } from '@shared/collections'
import { Notice } from '@/components/admin/Notice'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useContent } from '@/hooks/contentContext'
import { useSession } from '@/hooks/sessionContext'
import { diffLines, hunks } from '@/lib/diff'
import { cn, formatTime } from '@/lib/utils'
import { api, errorMessage } from '@/services/api'

function Diff({ before, after }: { before: string; after: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-line bg-surface py-2 font-mono text-xs leading-5">
      {hunks(diffLines(before, after)).map((row, index) => (row.kind === 'skip' ? (
        <div key={index} className="px-3 py-0.5 text-muted">⋯ {row.count} unchanged {row.count === 1 ? 'line' : 'lines'}</div>
      ) : (
        <div key={index} className={cn('px-3 whitespace-pre', row.kind === 'add' && 'bg-success-soft text-success', row.kind === 'remove' && 'bg-danger-soft text-danger')}>
          {row.kind === 'add' ? '+ ' : row.kind === 'remove' ? '- ' : '  '}{row.text}
        </div>
      )))}
    </pre>
  )
}

function PendingFile({ entry, canDiscard, onDiscard }: { entry: PendingEntry; canDiscard: boolean; onDiscard: () => void }) {
  const [showDiff, setShowDiff] = useState(false)
  const section = sections.find(candidate => candidate.panels.some(panel => panel.kind !== 'flags' ? panel.file === entry.fileId : entry.fileId === 'features'))
  return (
    <li className="rounded-xl border border-line bg-paper p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold">{section?.label ?? entry.fileId} <span className="font-mono text-xs font-normal text-muted">{entry.path}</span></h3>
          <p className="text-xs text-muted">Last edited by {entry.updatedBy} · {formatTime(entry.updatedAt)} · {entry.editors.map(editor => editor.login).join(', ')}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowDiff(shown => !shown)}>{showDiff ? 'Hide changes' : 'Show changes'}</Button>
          {canDiscard && <Button size="sm" variant="danger" onClick={onDiscard}>Discard</Button>}
        </div>
      </div>
      <ul className="mt-3 list-disc pl-5 text-sm text-body">
        {entry.summaries.map((summary, index) => <li key={index}>{summary}</li>)}
      </ul>
      {showDiff && <div className="mt-4"><Diff before={entry.before} after={entry.after} /></div>}
    </li>
  )
}

export default function Publishing() {
  const { user } = useSession()
  const { reload, repository } = useContent()
  const [pending, setPending] = useState<PendingEntry[] | null>(null)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<{ tone: 'success' | 'error'; text: string; url?: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const owner = user.role === 'owner'

  const load = useCallback(() => api<PendingResponse>('/api/pending')
    .then(result => setPending(result.files))
    .catch(error => setStatus({ tone: 'error', text: errorMessage(error) })), [])

  useEffect(() => {
    api<PendingResponse>('/api/pending')
      .then(result => setPending(result.files))
      .catch(error => setStatus({ tone: 'error', text: errorMessage(error) }))
  }, [])

  async function discard(fileId?: string) {
    if (!window.confirm(fileId ? 'Throw away the changes to this file?' : 'Throw away every change waiting to publish?')) return
    try {
      await api(`/api/pending${fileId ? `?file=${fileId}` : ''}`, { method: 'DELETE' })
      setStatus(null)
      await Promise.all([load(), reload()])
    } catch (error) {
      setStatus({ tone: 'error', text: errorMessage(error) })
    }
  }

  async function publish() {
    setBusy(true)
    setStatus(null)
    try {
      const result = await api<PublishResponse>('/api/publish', { method: 'POST', body: { message } })
      setMessage('')
      setStatus({
        tone: 'success',
        text: repository.kind === 'local'
          ? `Wrote ${result.files} ${result.files === 1 ? 'file' : 'files'} to disk. Review them with git diff and commit.`
          : `Published ${result.files} ${result.files === 1 ? 'file' : 'files'}. Vercel will redeploy the site in a minute or two.`,
        url: result.url,
      })
      await Promise.all([load(), reload()])
    } catch (error) {
      setStatus({ tone: 'error', text: errorMessage(error) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader eyebrow="Workspace" title="Publishing" description={`Every saved edit waits here. Publishing ${repository.kind === 'local' ? 'writes them all to the files on this computer' : `commits them all to ${repository.label} in one commit`}.`} />
      {status && (
        <Notice tone={status.tone} className="mb-6">
          {status.text} {status.url && <a href={status.url} target="_blank" rel="noreferrer" className="font-semibold underline">See the commit</a>}
        </Notice>
      )}
      {pending === null ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : pending.length === 0 ? (
        <p className="rounded-xl border border-dashed border-field bg-paper px-5 py-10 text-center text-sm text-muted">Nothing is waiting to publish.</p>
      ) : (
        <>
          <ul className="mb-8 flex flex-col gap-4">
            {pending.map(entry => (
              <PendingFile
                key={entry.path}
                entry={entry}
                canDiscard={owner || entry.editors.every(editor => editor.login === user.login)}
                onDiscard={() => void discard(entry.fileId)}
              />
            ))}
          </ul>
          {owner ? (
            <form onSubmit={event => { event.preventDefault(); void publish() }} className="flex flex-col gap-3 rounded-xl border border-line bg-paper p-5">
              <label htmlFor="publish-message" className="text-[13px] font-semibold">What changed? <span className="font-normal text-muted">(optional, becomes the commit title)</span></label>
              <Input id="publish-message" value={message} onChange={event => setMessage(event.target.value)} placeholder="Update site content from the admin" maxLength={100} />
              <div className="flex flex-wrap gap-2">
                <Button type="submit" variant="primary" disabled={busy}>{busy ? 'Publishing…' : `Publish ${pending.length} ${pending.length === 1 ? 'file' : 'files'}`}</Button>
                <Button variant="danger" onClick={() => void discard()} disabled={busy}>Discard everything</Button>
              </div>
            </form>
          ) : (
            <Notice>An owner publishes these. Let them know your changes are ready.</Notice>
          )}
        </>
      )}
    </>
  )
}
