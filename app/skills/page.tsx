import { CraftTable } from '@/components/skills/CraftTable'
import { plugins } from '@/lib/mock-data'

export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
        <p className="text-sm text-muted-foreground">
          Client + Context + Action plugin을 골라 즉석 조합으로 만드는 작업
          프롬프트입니다. 저장 단위가 아니라{' '}
          <span className="font-medium text-foreground">사용 단위</span>이며,
          관리·논의는 Plugin에서 합니다.
        </p>
      </div>
      <CraftTable plugins={plugins} />
    </div>
  )
}
