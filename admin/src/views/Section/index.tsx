import { ExternalLink } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { findSection } from '@shared/collections'
import { PageHeader } from '@/components/admin/PageHeader'
import { PanelView } from '@/components/panels/PanelView'
import { siteLink } from '@/config/navigation'
import NotFound from '@/views/NotFound'

/** One part of the site: every panel the registry lists for it, in order. */
export default function Section() {
  const { sectionId = '' } = useParams()
  const section = findSection(sectionId)
  if (!section) return <NotFound />

  return (
    <>
      <PageHeader
        eyebrow={section.group}
        title={section.label}
        description={section.description}
        actions={section.sitePath && (
          <a href={siteLink(section.sitePath)} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-lg border border-field bg-paper px-4 text-sm font-semibold hover:border-ink">
            View on site <ExternalLink className="size-4" />
          </a>
        )}
      />
      {section.panels.length > 3 && (
        <nav aria-label="On this page" className="mb-6 flex flex-wrap gap-2">
          {section.panels.map(panel => (
            <a key={panel.id} href={`#${panel.id}`} className="rounded-full border border-line bg-paper px-3 py-1 text-[13px] text-body hover:border-ink hover:text-ink">{panel.title}</a>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-6">
        {section.panels.map(panel => <PanelView key={panel.id} panel={panel} />)}
      </div>
    </>
  )
}
