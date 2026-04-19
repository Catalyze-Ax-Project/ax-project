import { ProposalsList } from '@/components/proposal/ProposalsList'

export default function ProposalsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Proposals</h2>
        <p className="text-sm text-muted-foreground">
          전사 변경 제안 리스트입니다. 상태로 필터링해 검토 대기중인 제안을 우선 확인하세요.
        </p>
      </div>
      <ProposalsList />
    </div>
  )
}
