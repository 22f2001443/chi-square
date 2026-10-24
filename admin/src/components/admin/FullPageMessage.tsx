import type { ReactNode } from 'react'

export function FullPageMessage({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <main className="grid min-h-svh place-items-center bg-surface px-4">
      <div className="w-full max-w-md rounded-xl border border-line bg-paper p-8">
        <img src="/favicon.png" alt="" className="mb-5 size-10 rounded-full bg-ink" />
        <h1 className="text-xl font-semibold tracking-[-0.01em]">{title}</h1>
        {children && <div className="mt-3 text-sm leading-relaxed text-body">{children}</div>}
      </div>
    </main>
  )
}
