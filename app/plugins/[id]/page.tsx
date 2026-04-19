import { notFound } from 'next/navigation'
import { PluginDetailLayout } from '@/components/plugin/PluginDetailLayout'
import { getPluginById } from '@/lib/mock-data'

export default async function PluginDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const plugin = getPluginById(id)
  if (!plugin) notFound()

  return <PluginDetailLayout plugin={plugin} backHref="/plugins" backLabel="Plugins" />
}
