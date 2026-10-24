import { Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { Member, MembersResponse, Role } from '@shared/api'
import { Notice } from '@/components/admin/Notice'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/button'
import { Input, Select } from '@/components/ui/input'
import { useSession } from '@/hooks/sessionContext'
import { formatTime } from '@/lib/utils'
import { api, errorMessage } from '@/services/api'

export default function Members() {
  const { user } = useSession()
  const owner = user.role === 'owner'
  const [members, setMembers] = useState<Member[]>([])
  const [login, setLogin] = useState('')
  const [role, setRole] = useState<Role>('editor')
  const [status, setStatus] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)

  const load = useCallback(() => api<MembersResponse>('/api/members')
    .then(result => setMembers(result.members))
    .catch(error => setStatus({ tone: 'error', text: errorMessage(error) })), [])

  useEffect(() => {
    api<MembersResponse>('/api/members')
      .then(result => setMembers(result.members))
      .catch(error => setStatus({ tone: 'error', text: errorMessage(error) }))
  }, [])

  async function act(action: () => Promise<unknown>, success: string) {
    try {
      await action()
      setStatus({ tone: 'success', text: success })
      await load()
    } catch (error) {
      setStatus({ tone: 'error', text: errorMessage(error) })
    }
  }

  return (
    <>
      <PageHeader eyebrow="Workspace" title="Members" description="People who can sign in with GitHub. Editors edit and save changes; owners also publish them and manage this list." />
      {status && <Notice tone={status.tone} className="mb-6">{status.text}</Notice>}
      {owner && (
        <form
          onSubmit={event => {
            event.preventDefault()
            void act(() => api('/api/members', { method: 'POST', body: { login, role } }), `Added ${login}. They can sign in now.`).then(() => setLogin(''))
          }}
          className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-line bg-paper p-5"
        >
          <div className="flex min-w-56 flex-1 flex-col gap-1.5">
            <label htmlFor="member-login" className="text-[13px] font-semibold">GitHub username</label>
            <Input id="member-login" value={login} onChange={event => setLogin(event.target.value)} placeholder="octocat" autoComplete="off" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="member-role" className="text-[13px] font-semibold">Role</label>
            <Select id="member-role" value={role} onChange={event => setRole(event.target.value as Role)} className="w-36">
              <option value="editor">Editor</option>
              <option value="owner">Owner</option>
            </Select>
          </div>
          <Button type="submit" variant="primary" disabled={!login.trim()}>Add member</Button>
        </form>
      )}
      <div className="overflow-x-auto rounded-xl border border-line bg-paper">
        <table className="w-full min-w-xl border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
              <th className="px-5 py-2 font-medium">Member</th>
              <th className="px-5 py-2 font-medium">Role</th>
              <th className="px-5 py-2 font-medium">Last signed in</th>
              <th className="w-16 px-5 py-2"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => {
              const editable = owner && !member.locked && member.login !== user.login
              return (
                <tr key={member.login} className="border-b border-line-soft last:border-0">
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-3">
                      {member.avatarUrl ? <img src={member.avatarUrl} alt="" className="size-8 rounded-full" /> : <span className="grid size-8 place-items-center rounded-full bg-surface font-mono text-xs">{member.login[0]?.toUpperCase()}</span>}
                      <span className="flex flex-col">
                        <span className="font-semibold">{member.name ?? member.login}</span>
                        <span className="font-mono text-xs text-muted">@{member.login}{member.addedBy ? ` · added by ${member.addedBy}` : ''}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {editable ? (
                      <Select value={member.role} aria-label={`Role of ${member.login}`} className="h-8 w-32" onChange={event => void act(() => api(`/api/members/${encodeURIComponent(member.login)}`, { method: 'PATCH', body: { role: event.target.value } }), `${member.login} is now ${event.target.value}.`)}>
                        <option value="editor">Editor</option>
                        <option value="owner">Owner</option>
                      </Select>
                    ) : (
                      <span className="capitalize">{member.role}{member.locked && <span className="ml-2 font-mono text-xs text-muted normal-case">set in Vercel</span>}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted">{formatTime(member.lastSeenAt) || 'Never'}</td>
                  <td className="px-5 py-3 text-right">
                    {editable && (
                      <Button variant="ghost" size="icon" aria-label={`Remove ${member.login}`} onClick={() => window.confirm(`Remove ${member.login}? They are signed out at once.`) && void act(() => api(`/api/members/${encodeURIComponent(member.login)}`, { method: 'DELETE' }), `Removed ${member.login}.`)}>
                        <Trash2 />
                      </Button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
