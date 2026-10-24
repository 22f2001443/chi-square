import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import type { SessionResponse } from '@shared/api'
import { ContentProvider } from '@/components/admin/ContentProvider'
import { FullPageMessage } from '@/components/admin/FullPageMessage'
import { SessionContext } from '@/hooks/sessionContext'
import { ApiError, api, errorMessage, setCsrfToken } from '@/services/api'

type State =
  | { status: 'loading' }
  | { status: 'signed-in'; session: SessionResponse }
  | { status: 'signed-out' }
  | { status: 'not-configured'; missing: string[] }
  | { status: 'error'; message: string }

/** Everything past the sign-in page needs a session; this fetches it once. */
export function SessionProvider() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    api<SessionResponse>('/api/session')
      .then(session => {
        setCsrfToken(session.csrfToken)
        setState({ status: 'signed-in', session })
      })
      .catch(error => {
        if (error instanceof ApiError && error.status === 401) setState({ status: 'signed-out' })
        else if (error instanceof ApiError && error.body.error === 'not_configured') setState({ status: 'not-configured', missing: error.body.missing ?? [] })
        else setState({ status: 'error', message: errorMessage(error) })
      })
  }, [])

  const signOut = useCallback(async () => {
    await api('/api/auth/logout', { method: 'POST' }).catch(() => undefined)
    setState({ status: 'signed-out' })
  }, [])

  const value = useMemo(() => (state.status === 'signed-in' ? { user: state.session.user, signOut } : null), [state, signOut])

  if (state.status === 'loading') return <FullPageMessage title="Loading…" />
  if (state.status === 'signed-out') return <Navigate to="/sign-in" replace />
  if (state.status === 'not-configured') {
    return (
      <FullPageMessage title="This admin isn’t set up yet">
        <p>These settings are missing in the Vercel project:</p>
        <ul className="mt-2 list-disc pl-5 font-mono text-sm">{state.missing.map(name => <li key={name}>{name}</li>)}</ul>
        <p className="mt-3">See admin/README.md for what each one is.</p>
      </FullPageMessage>
    )
  }
  if (state.status === 'error') return <FullPageMessage title="The admin couldn’t start">{state.message}</FullPageMessage>

  return (
    <SessionContext.Provider value={value}>
      <ContentProvider>
        <Outlet />
      </ContentProvider>
    </SessionContext.Provider>
  )
}
