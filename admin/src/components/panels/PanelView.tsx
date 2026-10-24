import type { Panel } from '@shared/collections'
import { FieldsPanel } from './FieldsPanel'
import { FlagsPanel } from './FlagsPanel'
import { ListPanel } from './ListPanel'
import { MapPanel } from './MapPanel'

export function PanelView({ panel }: { panel: Panel }) {
  switch (panel.kind) {
    case 'fields': return <FieldsPanel panel={panel} />
    case 'list': return <ListPanel panel={panel} />
    case 'map': return <MapPanel panel={panel} />
    case 'flags': return <FlagsPanel panel={panel} />
  }
}
