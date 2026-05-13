import { PluginsMarket } from '@/components/plugin/PluginsMarket'
import { plugins } from '@/lib/mock-data'

export default function PluginsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Plugins</h2>
      </div>
      <PluginsMarket plugins={plugins} />
    </div>
  )
}
