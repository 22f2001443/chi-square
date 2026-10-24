import { createContext, useContext } from 'react'
import type { SessionUser } from '@shared/api'

export type SessionValue = { user: SessionUser; signOut: () => Promise<void> }

export const SessionContext = createContext<SessionValue | null>(null)

export function useSession(): SessionValue {
  const value = useContext(SessionContext)
  if (!value) throw new Error('useSession outside SessionProvider')
  return value
}
