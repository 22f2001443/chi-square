import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const tones = {
  info: 'border-accent/20 bg-accent-soft text-accent-strong',
  success: 'border-success/20 bg-success-soft text-success',
  warning: 'border-warn-ink/20 bg-warn-soft text-warn-ink',
  error: 'border-danger/20 bg-danger-soft text-danger',
}

export function Notice({ tone = 'info', children, className }: { tone?: keyof typeof tones; children: ReactNode; className?: string }) {
  return <div role={tone === 'error' ? 'alert' : 'status'} className={cn('rounded-lg border px-4 py-3 text-sm leading-relaxed', tones[tone], className)}>{children}</div>
}
