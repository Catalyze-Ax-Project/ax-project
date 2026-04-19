import { notFound } from 'next/navigation'
import { PluginDetailLayout } from '@/components/plugin/PluginDetailLayout'
import { ClientMetaCard } from '@/components/clients/ClientMetaCard'
import { getClientMeta, getPluginById } from '@/lib/mock-data'

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

  return (
    <PluginDetailLayout
      plugin={plugin}
      backHref="/clients"
      backLabel="Clients"
      headerSlot={<ClientMetaCard meta={meta} />}
    />
  )
}
