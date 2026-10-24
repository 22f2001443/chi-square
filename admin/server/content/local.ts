import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { HttpError } from '../http.js'
import type { CommitFile, RepoFile, Repository } from './repository.js'

// Git's own blob hash, so a file reads the same here as it would on GitHub.
function blobSha(text: string) {
  const bytes = Buffer.from(text, 'utf8')
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex')
}

/**
 * The working tree, for the local dev server: reads the site's files from disk
 * and "publishes" by writing them back, for you to review with git and commit.
 */
export class LocalRepository implements Repository {
  private root: string

  constructor(root: string) {
    this.root = root
  }

  info() {
    return { kind: 'local' as const, label: 'Files on this computer', assetBase: '/__site/' }
  }

  async readFiles(paths: readonly string[]) {
    const files: Record<string, RepoFile> = {}
    for (const path of paths) {
      const text = await readFile(join(this.root, path), 'utf8')
      files[path] = { text, sha: blobSha(text) }
    }
    return files
  }

  async commit(files: CommitFile[]) {
    const current = await this.readFiles(files.map(file => file.path))
    const conflicts = files.filter(file => current[file.path].sha !== file.baseSha).map(file => file.path)
    if (conflicts.length) {
      throw new HttpError(409, 'publish_conflict', 'These files changed on disk after they were edited here. Discard them and redo the edits.', { paths: conflicts })
    }
    for (const file of files) await writeFile(join(this.root, file.path), file.text)
    return { commit: 'working tree' }
  }
}
