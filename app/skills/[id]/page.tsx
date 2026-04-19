import { notFound } from 'next/navigation'
import { PluginDetailLayout } from '@/components/plugin/PluginDetailLayout'
import { getPluginById } from '@/lib/mock-data'

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const plugin = getPluginById(id)
  if (!plugin || plugin.kind !== 'skill') notFound()

  return <PluginDetailLayout plugin={plugin} backHref="/skills" backLabel="Skills" />
}
