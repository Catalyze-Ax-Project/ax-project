import { PluginsMarket } from '@/components/plugin/PluginsMarket'
import { plugins } from '@/lib/mock-data'

export default function PluginsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Plugins</h2>
        <p className="text-sm text-muted-foreground">
          모든 plugin의 마켓플레이스입니다. Client·Context·Action 종류와 태그로
          탐색하세요. 조합해서 쓰려면{' '}
          <span className="font-medium text-foreground">Skills</span> 탭에서.
        </p>
      </div>
      <PluginsMarket plugins={plugins} />
    </div>
  )
}
