import { ImageOff } from 'lucide-react'
import { useState } from 'react'
import { useContent } from '@/hooks/contentContext'
import { imageUrl } from '@/lib/content'
import { cn } from '@/lib/utils'

/** A small preview of an image path from the content, or a placeholder when there is none to show. */
export function Thumbnail({ path, className }: { path?: string; className?: string }) {
  const { repository } = useContent()
  const [failed, setFailed] = useState<string | null>(null)
  const box = cn('size-9 shrink-0 rounded-md border border-line bg-surface', className)
  if (!path || failed === path) {
    return (
      <span className={cn(box, 'grid place-items-center text-muted')} title={path ? `Not found: ${path}` : undefined}>
        {path && <ImageOff className="size-3.5" />}
      </span>
    )
  }
  return <img src={imageUrl(path, repository.assetBase)} alt="" onError={() => setFailed(path)} className={cn(box, 'object-cover')} />
}
