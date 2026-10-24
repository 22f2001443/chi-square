import { createContext, useContext } from 'react'
import type { ChangeRequest, ChangeResponse, RepositoryInfo } from '@shared/api'
import type { Files } from '@/lib/content'

export type ContentValue = {
  files: Files
  repository: RepositoryInfo
  /** How many files have changes waiting to be published. */
  pendingCount: number
  /** Sends one edit; the file's new state replaces the old one. Throws ApiError. */
  change: (panelId: string, change: Omit<ChangeRequest, 'hash'>) => Promise<ChangeResponse>
  reload: () => Promise<void>
}

export const ContentContext = createContext<ContentValue | null>(null)

export function useContent(): ContentValue {
  const value = useContext(ContentContext)
  if (!value) throw new Error('useContent outside ContentProvider')
  return value
}
