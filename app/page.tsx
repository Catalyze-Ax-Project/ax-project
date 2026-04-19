import { HeroBanner } from '@/components/overview/HeroBanner'
import { MyToday } from '@/components/overview/MyToday'
import { QuickStart } from '@/components/overview/QuickStart'
import { AdminWidgets } from '@/components/overview/AdminWidgets'

export default function OverviewPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <HeroBanner />
      <MyToday />
      <QuickStart />
      <AdminWidgets />
    </div>
  )
}
