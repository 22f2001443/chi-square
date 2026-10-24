import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ChangeRequest, ChangeResponse, ContentResponse } from '@shared/api'
import { findPanel, panelFile } from '@shared/collections'
import { FullPageMessage } from '@/components/admin/FullPageMessage'
import { ContentContext } from '@/hooks/contentContext'
import { ApiError, api, errorMessage } from '@/services/api'

/**
 * All of the site's data files, loaded once and kept current: each edit
 * returns its file's new state, so no page ever re-fetches to see its own
 * change.
 */
export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    try {
      setContent(await api<ContentResponse>('/api/content'))
      setError(null)
    } catch (caught) {
      setError(errorMessage(caught))
    }
  }, [])

  useEffect(() => {
    api<ContentResponse>('/api/content').then(setContent).catch(caught => setError(errorMessage(caught)))
  }, [])

  const change = useCallback(async (panelId: string, request: Omit<ChangeRequest, 'hash'>) => {
    const panel = findPanel(panelId)
    if (!panel || !content) throw new Error('Unknown panel')
    const fileId = panelFile(panel)
    try {
      const response = await api<ChangeResponse>(`/api/content/${panelId}`, { method: 'POST', body: { ...request, hash: content.files[fileId].hash } })
      setContent(current => (current ? { ...current, files: { ...current.files, [response.fileId]: response.file } } : current))
      return response
    } catch (caught) {
      // Someone else changed the file: show their version so the next try
      // starts from it.
      const latest = caught instanceof ApiError ? caught.body.file : undefined
      if (latest) setContent(current => (current ? { ...current, files: { ...current.files, [fileId]: latest } } : current))
      throw caught
    }
  }, [content])

  const value = useMemo(() => content && {
    files: content.files,
    repository: content.repository,
    pendingCount: Object.values(content.files).filter(file => file.pending).length,
    change,
    reload,
  }, [content, change, reload])

  if (error && !content) return <FullPageMessage title="The site’s content couldn’t be loaded">{error}</FullPageMessage>
  if (!value) return <FullPageMessage title="Loading content…" />
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
