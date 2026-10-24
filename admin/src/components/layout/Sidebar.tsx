import { X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { navigation } from '@/config/navigation'
import { useContent } from '@/hooks/contentContext'
import { cn } from '@/lib/utils'

type Props = { isOpen: boolean; onClose: () => void }

export function Sidebar({ isOpen, onClose }: Props) {
  const { pendingCount } = useContent()

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={onClose} aria-hidden="true" />}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink text-on-ink transition-transform lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-ink-line px-4">
          <NavLink to="/" onClick={onClose} className="flex items-center gap-3">
            <img src="/favicon.png" alt="" className="size-8 rounded-full" />
            <span className="flex flex-col leading-tight">
              <strong className="text-sm font-semibold">Chi-Square</strong>
              <small className="font-mono text-[11px] uppercase tracking-[0.08em] text-on-ink-muted">Admin</small>
            </span>
          </NavLink>
          <button type="button" onClick={onClose} className="grid size-8 cursor-pointer place-items-center rounded-md hover:bg-white/10 lg:hidden" aria-label="Close navigation">
            <X className="size-4" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin">
          {navigation.map(group => (
            <div key={group.label} className="mb-5">
              <p className="mb-1.5 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-on-ink-muted">{group.label}</p>
              {group.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) => cn(
                    'flex h-9 items-center gap-3 rounded-md px-3 text-sm text-on-ink-muted hover:bg-white/5 hover:text-on-ink',
                    isActive && 'bg-white/10 text-on-ink',
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.to === '/publishing' && pendingCount > 0 && (
                    <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[11px] text-white">{pendingCount}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
