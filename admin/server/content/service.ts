import type { ChangeRequest, ChangeResponse, ContentResponse, Editor, FileState, PendingResponse, PublishResponse } from '../../shared/api.js'
import { fileIdForPath, fileIds, files, findPanel, panelFile, type FileId } from '../../shared/collections.js'
import { HttpError, sha256 } from '../http.js'
import type { Identity } from '../identity.js'
import type { Store } from '../store/types.js'
import { applyChange } from './edit.js'
import type { Repository } from './repository.js'
import { parseYaml, readData, renderYaml, verifyYaml } from './yaml.js'

const allPaths = fileIds.map(id => files[id])

function stateOf(text: string, pending: boolean): FileState {
  return { data: readData(text), hash: sha256(text), pending }
}

/**
 * Edits wait in the store until an owner publishes them. Each edit rewrites the
 * file's pending text, so the site's files only ever change in one commit per
 * publish, which can be reviewed as a whole or thrown away first.
 */
export class ContentService {
  private repository: Repository
  private store: Store

  constructor(repository: Repository, store: Store) {
    this.repository = repository
    this.store = store
  }

  async load(): Promise<ContentResponse> {
    const [repoFiles, pending] = await Promise.all([this.repository.readFiles(allPaths), this.store.listPending()])
    const pendingByPath = new Map(pending.map(file => [file.path, file]))
    const states = {} as Record<FileId, FileState>
    for (const id of fileIds) {
      const waiting = pendingByPath.get(files[id])
      states[id] = stateOf(waiting?.text ?? repoFiles[files[id]].text, Boolean(waiting))
    }
    return { files: states, repository: this.repository.info() }
  }

  async change(identity: Identity, panelId: string, change: ChangeRequest): Promise<ChangeResponse> {
    const panel = findPanel(panelId)
    if (!panel) throw new HttpError(404, 'panel_not_found')
    const fileId = panelFile(panel)
    const path = files[fileId]

    const pending = await this.store.readPending(path)
    const base = pending ? { text: pending.text, sha: pending.baseSha } : (await this.repository.readFiles([path]))[path]
    if (change.hash !== sha256(base.text)) {
      throw new HttpError(409, 'stale', 'Someone else changed this since you opened it. Your view has been refreshed; make the edit again.', { file: stateOf(base.text, Boolean(pending)) })
    }

    const parsed = parseYaml(base.text)
    const summary = applyChange(parsed.doc, panel, change)
    const text = renderYaml(parsed)
    verifyYaml(text, parsed.doc)

    const editor: Editor = { login: identity.login, id: identity.githubId }
    const editors = [...(pending?.editors ?? []).filter(other => other.login !== editor.login), editor]
    const written = await this.store.writePending({
      path,
      text,
      hash: sha256(text),
      baseSha: base.sha,
      summaries: [...(pending?.summaries ?? []), summary].slice(-100),
      editors,
      updatedBy: identity.login,
    }, pending?.hash ?? null)
    if (!written) throw new HttpError(409, 'stale', 'Someone else saved a change to this file at the same moment. Reload and try again.')

    await this.store.logActivity({ login: identity.login, action: 'edit', summary })
    return { fileId, file: stateOf(text, true), summary }
  }

  async pending(): Promise<PendingResponse> {
    const pending = await this.store.listPending()
    const before = pending.length ? await this.repository.readFiles(pending.map(file => file.path)) : {}
    return {
      files: pending.flatMap(file => {
        const fileId = fileIdForPath(file.path)
        if (!fileId) return []
        return [{
          fileId,
          path: file.path,
          summaries: file.summaries,
          editors: file.editors,
          updatedAt: file.updatedAt,
          updatedBy: file.updatedBy,
          before: before[file.path]?.text ?? '',
          after: file.text,
        }]
      }),
    }
  }

  /**
   * Throws pending changes away. Owners may discard anything; an editor only a
   * file nobody else has edited, so one person can't erase another's work.
   */
  async discard(identity: Identity, fileId?: FileId) {
    const pending = (await this.store.listPending()).filter(file => !fileId || file.path === files[fileId])
    if (!pending.length) return { discarded: 0 }
    if (identity.role !== 'owner' && pending.some(file => file.editors.some(editor => editor.login !== identity.login))) {
      throw new HttpError(403, 'forbidden', 'Others have edited this too; ask an owner to discard it.')
    }
    const discarded = await this.store.deletePending(pending.map(file => ({ path: file.path, hash: file.hash })))
    await this.store.logActivity({ login: identity.login, action: 'discard', summary: `Discarded changes to ${pending.map(file => fileIdForPath(file.path) ?? file.path).join(', ')}` })
    return { discarded }
  }

  async publish(identity: Identity, message?: string): Promise<PublishResponse> {
    if (identity.role !== 'owner') throw new HttpError(403, 'forbidden', 'Only owners can publish.')
    const pending = await this.store.listPending()
    if (!pending.length) throw new HttpError(409, 'nothing_to_publish', 'There are no changes to publish.')

    const headline = (message ?? '').trim().split('\n')[0].slice(0, 100) || 'Update site content from the admin'
    const changes = pending.flatMap(file => file.summaries.map(summary => `- ${summary}`))
    const editors = new Map(pending.flatMap(file => file.editors).map(editor => [editor.login, editor]))
    const trailers = [...editors.values()]
      .filter(editor => editor.id)
      .map(editor => `Co-authored-by: ${editor.login} <${editor.id}+${editor.login}@users.noreply.github.com>`)
    const body = [headline, '', ...changes, ...(trailers.length ? ['', ...trailers] : [])].join('\n')

    const result = await this.repository.commit(pending.map(file => ({ path: file.path, text: file.text, baseSha: file.baseSha })), body)
    // Only the text that was committed is cleared: an edit saved during the
    // publish stays pending for the next one.
    await this.store.deletePending(pending.map(file => ({ path: file.path, hash: file.hash })))
    const where = /^[0-9a-f]{40}$/.test(result.commit) ? ` (${result.commit.slice(0, 7)})` : ' to disk'
    await this.store.logActivity({ login: identity.login, action: 'publish', summary: `Published ${pending.length} file${pending.length === 1 ? '' : 's'}${where}` })
    return { ...result, files: pending.length }
  }
}
