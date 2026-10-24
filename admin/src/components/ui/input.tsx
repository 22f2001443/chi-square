import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const field = 'w-full rounded-lg border border-field bg-paper px-3 text-sm text-ink placeholder:text-muted/70 hover:border-muted aria-invalid:border-danger disabled:bg-surface'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(field, 'h-10', className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(field, 'min-h-24 py-2 leading-relaxed', className)} {...props} />
}

export function Select({ className, ...props }: ComponentProps<'select'>) {
  return <select className={cn(field, 'h-10 cursor-pointer pr-8', className)} {...props} />
}
