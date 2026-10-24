import { LogOut, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useContent } from '@/hooks/contentContext'
import { useSession } from '@/hooks/sessionContext'
import { cn } from '@/lib/utils'

export function Topbar({ onOpenNavigation }: { onOpenNavigation: () => void }) {
  const { user, signOut } = useSession()
  const { repository, pendingCount } = useContent()
  const local = repository.kind === 'local'

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-paper/95 px-4 sm:px-8">
      <Button variant="ghost" size="icon" onClick={onOpenNavigation} className="lg:hidden" aria-label="Open navigation">
        <Menu />
      </Button>
      <span className="hidden min-w-0 items-center gap-2 truncate rounded-full border border-line px-3 py-1 font-mono text-xs text-muted sm:inline-flex" title={local ? 'Publishing writes the files on this computer' : 'Publishing commits to GitHub'}>
        <span className={cn('size-2 shrink-0 rounded-full', local ? 'bg-warn-ink' : 'bg-success')} />
        <span className="truncate">{repository.label}</span>
      </span>
      <div className="ml-auto flex items-center gap-2">
        {pendingCount > 0 && (
          <Link to="/publishing" className="inline-flex h-8 items-center gap-2 rounded-full bg-accent-soft px-3 text-[13px] font-semibold text-accent-strong hover:bg-accent hover:text-white">
            {pendingCount} {pendingCount === 1 ? 'file' : 'files'} to publish
          </Link>
        )}
        <span className="hidden items-center gap-2 pl-2 sm:flex">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="size-7 rounded-full" />
          ) : (
            <span className="grid size-7 place-items-center rounded-full bg-ink font-mono text-xs text-on-ink">{user.login[0]?.toUpperCase()}</span>
          )}
          <span className="flex flex-col leading-tight">
            <span className="text-[13px] font-semibold">{user.name ?? user.login}</span>
            <span className="font-mono text-[11px] text-muted">{user.role}</span>
          </span>
        </span>
        <Button variant="ghost" size="icon" onClick={() => void signOut()} aria-label="Sign out" title="Sign out">
          <LogOut />
        </Button>
      </div>
    </header>
  )
}
