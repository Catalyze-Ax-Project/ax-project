import { notFound } from 'next/navigation'
import { PluginDetailLayout } from '@/components/plugin/PluginDetailLayout'
import { ClientMetaCard } from '@/components/clients/ClientMetaCard'
import { LinkedPluginsSection } from '@/components/clients/LinkedPluginsSection'
import {
  getClientMeta,
  getPluginById,
  getPluginsLinkedToClient,
} from '@/lib/mock-data'

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const plugin = getPluginById(id)
  if (!plugin || plugin.kind !== 'client') notFound()
  const meta = getClientMeta(id)
  if (!meta) notFound()

  const linked = getPluginsLinkedToClient(id)

  return (
    <PluginDetailLayout
      plugin={plugin}
      backHref="/clients"
      backLabel="Clients"
      headerSlot={
        <div className="space-y-4">
          <ClientMetaCard meta={meta} />
          <LinkedPluginsSection plugins={linked} />
        </div>
      }
    />
  )
}
