// ============================================================================
// Catalyze Harness — Mock Data
// 시연용 더미 데이터. 실제 API 연동 전까지 모든 페이지가 이 파일을 import한다.
//
// Skill 데이터의 일부는 외부 plugin repo (Catalyze-Ax-Project/plugin) md 파일에서
// 빌드 시점에 동기화된다. lib/plugins-data.ts 참조.
// 본 파일의 plugins 배열에는 그 외부 skill들이 자동으로 포함된다 (파일 하단 참고).
// ============================================================================

import { externalSkills } from './plugins-data'
import { isWithinWeek } from './date-utils'

export type Team = 'common' | 'bd' | 'marketing' | 'dev-growth' | 'operations'
// kind 컨셉 (2026-05-13 개편):
//   client  — 고객사 맥락 저장소
//   context — 행사·캠페인·시즌 등 시간/주제 맥락 (신규)
//   action  — 재사용 작업 playbook (구 'skill')
//   common  — 전사 공통 가이드
//   agent   — 자동 실행 (미구현)
// Skill(대문자)은 더 이상 plugin kind가 아니라, 사용자가 plugin들을 즉석 조립한 레시피.
export type PluginKind = 'client' | 'context' | 'action' | 'agent' | 'common'
export type ProposalStatus = 'open' | 'in-review' | 'merged' | 'closed'
export type DiscussionStatus = 'open' | 'resolved'

export type Plugin = {
  id: string
  name: string
  kind: PluginKind
  team: Team
  description: string
  tags?: string[]
  updatedAt: string
  linkedClients?: string[]
  discussionsCount: number
  proposalsCount: number
  adoptionCount: number
  contentPreview: string
}

export type Discussion = {
  id: string
  pluginId: string
  title: string
  author: string
  createdAt: string
  status: DiscussionStatus
  commentsCount: number
  linkedProposalId?: string
}

export type Proposal = {
  id: string
  pluginId: string
  title: string
  author: string
  status: ProposalStatus
  createdAt: string
  description: string
  linkedDiscussionId?: string
}

export type Change = {
  id: string
  pluginId: string
  message: string
  author: string
  createdAt: string
}

export type Member = {
  id: string
  name: string
  team: Team
  role: string
  weeklyUsage: number
  avatarInitials: string
}

export type Combo = {
  id: string
  clientId: string
  skillId: string
  lastUsedAt: string
}

export const TEAM_LABEL: Record<Team, string> = {
  common: '전사 공통',
  bd: 'BD',
  marketing: 'Marketing',
  'dev-growth': 'Dev Growth',
  operations: 'Operations',
}

export const KIND_LABEL: Record<PluginKind, string> = {
  common: 'Common',
  client: 'Client',
  context: 'Context',
  action: 'Action',
  agent: 'Agent',
}

export const PROPOSAL_STATUS_LABEL: Record<ProposalStatus, string> = {
  open: '대기중',
  'in-review': '검토중',
  merged: '반영됨',
  closed: '닫힘',
}

export const DISCUSSION_STATUS_LABEL: Record<DiscussionStatus, string> = {
  open: '진행중',
  resolved: '반영 완료',
}

// ----------------------------------------------------------------------------
// Plugins
// - builtInPlugins: 클라이언트 3개만 더미로 유지 (Skill/Common 더미 모두 제거됨)
// - externalSkills (plugin repo)에서 가져온 Skill을 합쳐 최종 `plugins`로 export
// ----------------------------------------------------------------------------

const builtInPlugins: Plugin[] = [
  {
    id: 'client-ripple',
    name: 'Ripple',
    kind: 'client',
    team: 'operations',
    description: '',
    tags: ['클라이언트', 'Ripple', 'Payments'],
    updatedAt: '2026-04-17T15:24:00.000Z',
    discussionsCount: 0,
    proposalsCount: 0,
    adoptionCount: 0,
    contentPreview: '# Client: Ripple\n\n- 톤: 전문적/격식. 금융 기관 대상 커뮤니케이션 기본값.\n- 용어: XRP Ledger, RLUSD (USD 스테이블), Interledger Protocol, Ripple Payments.\n- 최근 로드맵: RLUSD 확장, 기관용 custody, 유럽 결제 라이선스.\n',
  },
  {
    id: 'client-squid',
    name: 'Squid',
    kind: 'client',
    team: 'operations',
    description: '',
    tags: ['클라이언트', 'Squid'],
    updatedAt: '2026-04-10T05:55:00.000Z',
    discussionsCount: 0,
    proposalsCount: 0,
    adoptionCount: 0,
    contentPreview: '# Client: Squid\n\n크로스체인 리퀴디티 라우터. Axelar 기반.\n',
  },
  {
    id: 'client-midnight',
    name: 'Midnight',
    kind: 'client',
    team: 'operations',
    description: '',
    tags: ['클라이언트', 'Midnight', 'Privacy'],
    updatedAt: '2026-04-12T07:30:00.000Z',
    discussionsCount: 0,
    proposalsCount: 0,
    adoptionCount: 0,
    contentPreview: '# Client: Midnight\n\n- 톤: 기술적/간결. 개발자 대상 기본값.\n- 용어: shielded transactions, Compact DSL, Kachina 프로토콜.\n- 최근 로드맵: 메인넷 런칭, Glacier Drop, SDK 공개.\n',
  },
]

// linked_clients 정규화: plugin md에 short id("ripple")로 적혀 있어도
// 우리 내부 표기는 "client-ripple". 자동 prefix.
function normalizeClientId(raw: string): string {
  return raw.startsWith('client-') ? raw : `client-${raw}`
}

// External plugins sourced from Catalyze-Ax-Project/plugin repo.
// 카운트는 아래에서 discussions/proposals/changes 길이로 다시 계산해 채움.
const externalSkillsAsPlugins: Plugin[] = externalSkills.map((s) => ({
  id: s.id,
  name: s.name,
  // frontmatter kind는 외부에서 가져온 그대로지만, plugin md의 kind 갱신 전까지는
  // 'skill' 값이 들어올 수 있으니 action으로 대체.
  kind: ((s as { kind: string }).kind === 'skill'
    ? 'action'
    : ((s as { kind: string }).kind as PluginKind)) ?? 'action',
  team: s.team,
  description: s.core_value,
  tags: s.tags ?? [],
  updatedAt: s.updated_at,
  linkedClients: (s.linked_clients ?? []).map(normalizeClientId),
  discussionsCount: 0,
  proposalsCount: 0,
  adoptionCount: 0,
  contentPreview: s.body,
}))

const rawPlugins: Plugin[] = [...builtInPlugins, ...externalSkillsAsPlugins]

// ----------------------------------------------------------------------------
// Discussions / Proposals / Changes — globalThis 기반 mutable 저장소.
// 체험자가 한 바퀴를 직접 돌릴 수 있도록 3개 plugin에 서로 다른 진입 상태를
// 둔다. 새로고침/재시작 시 시드로 리셋.
//
//   • slack-brief : 이미 한 바퀴 끝난 참조 사례 (d-001 → p-001 → c-001)
//   • tg-brief    : open discussion 1건 → 체험자는 "제안 만들기 → 머지" 체험
//   • hq-report   : 빈 상태 → 체험자는 "의견 등록 → 제안 → 머지" 풀 사이클 체험
// ----------------------------------------------------------------------------

type AxState = {
  discussions: Discussion[]
  proposals: Proposal[]
  changes: Change[]
}

const SEED_DISCUSSIONS: Discussion[] = [
  {
    id: 'd-001',
    pluginId: 'slack-brief',
    title: '슬랙 요약 시 발화자 톤이 너무 평탄하게 정리됨',
    author: 'Jay Park',
    createdAt: '2026-05-11T02:30:00.000Z',
    status: 'resolved',
    commentsCount: 2,
    linkedProposalId: 'p-001',
  },
  {
    id: 'd-002',
    pluginId: 'tg-brief',
    title: '텔레그램 핸들이 한글 닉네임일 때 인물 맵 매칭이 실패',
    author: 'Jake Ku',
    createdAt: '2026-05-12T06:00:00.000Z',
    status: 'open',
    commentsCount: 1,
  },
]

const SEED_PROPOSALS: Proposal[] = [
  {
    id: 'p-001',
    pluginId: 'slack-brief',
    title: 'Slack Brief: 발화자별 톤 보존 규칙 추가',
    author: 'Harry Park',
    status: 'merged',
    createdAt: '2026-05-12T08:15:00.000Z',
    description:
      'd-001 의견 반영. 발화자별 어투(존댓말/반말/이모지 등)를 요약 결과에 보존하도록 출력 템플릿과 분석 규칙 보강.',
    linkedDiscussionId: 'd-001',
  },
]

const SEED_CHANGES: Change[] = [
  {
    id: 'c-001',
    pluginId: 'slack-brief',
    message: 'Slack Brief: 발화자별 톤 보존 룰 반영 (p-001)',
    author: 'Jun Lee',
    createdAt: '2026-05-13T01:00:00.000Z',
  },
]

const _g = globalThis as unknown as { __ax?: AxState }
if (!_g.__ax) {
  _g.__ax = {
    discussions: [...SEED_DISCUSSIONS],
    proposals: [...SEED_PROPOSALS],
    changes: [...SEED_CHANGES],
  }
}

export const discussions: Discussion[] = _g.__ax.discussions
export const proposals: Proposal[] = _g.__ax.proposals
export const changes: Change[] = _g.__ax.changes

// ----------------------------------------------------------------------------
// 플러그인 카운트 재계산 — discussions/proposals/changes 길이로 채움.
// adoptionCount는 changes(머지된 반영) 수를 채택 지표로 사용.
// ----------------------------------------------------------------------------

export const plugins: Plugin[] = rawPlugins.map((p) => ({
  ...p,
  discussionsCount: discussions.filter((d) => d.pluginId === p.id).length,
  proposalsCount: proposals.filter((pr) => pr.pluginId === p.id).length,
  adoptionCount: changes.filter((c) => c.pluginId === p.id).length,
}))

// ----------------------------------------------------------------------------
// Members (5명).
// ----------------------------------------------------------------------------

export const members: Member[] = [
  { id: 'u-jay', name: 'Jay Lee', team: 'operations', role: 'Co-Founder', weeklyUsage: 9, avatarInitials: 'JL' },
  { id: 'u-harry', name: 'Harry Park', team: 'operations', role: 'Operation Manager', weeklyUsage: 14, avatarInitials: 'HP' },
  { id: 'u-jayp', name: 'Jay Park', team: 'bd', role: 'BD Lead', weeklyUsage: 11, avatarInitials: 'JP' },
  { id: 'u-jake', name: 'Jake Ku', team: 'dev-growth', role: 'Head of growth', weeklyUsage: 6, avatarInitials: 'JK' },
  { id: 'u-jun', name: 'Jun Lee', team: 'dev-growth', role: 'Research Analyst', weeklyUsage: 12, avatarInitials: 'JL' },
]

// ----------------------------------------------------------------------------
// Combos — 최근 사용 + 추천 조합 (Overview 카드용)
// ----------------------------------------------------------------------------

export const combos: Combo[] = []

// ----------------------------------------------------------------------------
// 집계 통계 (Overview Hero용)
// ----------------------------------------------------------------------------

export const weeklyStats = {
  mergedChanges: changes.filter((c) => isWithinWeek(c.createdAt)).length,
  openDiscussions: discussions.filter((d) => d.status === 'open').length,
  openProposals: proposals.filter((p) => p.status === 'open' || p.status === 'in-review').length,
  staleDiscussions: 0,
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

export const getPluginById = (id: string) => plugins.find((p) => p.id === id)
export const getDiscussionsByPlugin = (pluginId: string) => discussions.filter((d) => d.pluginId === pluginId)
export const getProposalsByPlugin = (pluginId: string) => proposals.filter((p) => p.pluginId === pluginId)
export const getChangesByPlugin = (pluginId: string) => changes.filter((c) => c.pluginId === pluginId)
export const getMemberByName = (name: string) => members.find((m) => m.name === name)
export const getMemberById = (id: string) => members.find((m) => m.id === id)

export const actionPlugins = plugins.filter((p) => p.kind === 'action')
export const contextPlugins = plugins.filter((p) => p.kind === 'context')
export const clientPlugins = plugins.filter((p) => p.kind === 'client')

// 특정 client에 귀속되는 plugin (linkedClients 기반).
export function getPluginsLinkedToClient(clientId: string): Plugin[] {
  return plugins.filter((p) => p.linkedClients?.includes(clientId))
}

// ----------------------------------------------------------------------------
// Client metadata — 플러그인 형식 이상의 "고객사 세팅" 정보.
// ----------------------------------------------------------------------------

export type ClientMeta = {
  pluginId: string
  ownerId: string
  onboardedAt: string
  linkedSkillIds: string[]
  tagline: string
}

export const clientMetas: Record<string, ClientMeta> = {
  'client-ripple': {
    pluginId: 'client-ripple',
    ownerId: 'u-jake',
    onboardedAt: '2026-01-15T00:00:00.000Z',
    linkedSkillIds: [],
    tagline: 'Global Payments · XRP Ledger',
  },
  'client-midnight': {
    pluginId: 'client-midnight',
    ownerId: 'u-jayp',
    onboardedAt: '2026-04-10T00:00:00.000Z',
    linkedSkillIds: [],
    tagline: 'Privacy Sidechain · Cardano 계열',
  },
  'client-squid': {
    pluginId: 'client-squid',
    ownerId: 'u-jayp',
    onboardedAt: '2026-03-25T00:00:00.000Z',
    linkedSkillIds: [],
    tagline: 'Cross-chain Router · Axelar 기반',
  },
}

export const getClientMeta = (pluginId: string) => clientMetas[pluginId]

// ----------------------------------------------------------------------------
// Member → 담당 프로젝트 매핑.
// 프로젝트는 클라이언트 플러그인 id이거나, 아래 internalProjects 중 하나.
// 나중에 Admin 모드에서 직접 편집 가능하게 열 예정.
// ----------------------------------------------------------------------------

export const internalProjects: { id: string; name: string }[] = [
  { id: 'catalyze-operations', name: 'Catalyze Operation' },
]

export const memberAssignments: Record<string, string[]> = {
  'u-jay': ['catalyze-operations'],
  'u-harry': ['catalyze-operations'],
  'u-jayp': ['client-midnight', 'client-squid'],
  'u-jake': ['client-ripple'],
  'u-jun': ['client-ripple', 'client-midnight'],
}

export type ProjectRef = {
  id: string
  name: string
  href?: string
}

export function getProjectRef(id: string): ProjectRef | undefined {
  const plugin = getPluginById(id)
  if (plugin && plugin.kind === 'client') {
    return { id, name: plugin.name, href: `/clients/${id}` }
  }
  const internal = internalProjects.find((p) => p.id === id)
  if (internal) return { id, name: internal.name }
  return undefined
}

export function getMemberProjects(memberId: string): ProjectRef[] {
  const ids = memberAssignments[memberId] ?? []
  return ids
    .map((id) => getProjectRef(id))
    .filter((p): p is ProjectRef => !!p)
}

// kind-aware 라우팅 헬퍼.
// client는 전용 세팅 허브(/clients/[id])로, 그 외 plugin은 /plugins/[id] 공용 상세로.
// (이전엔 skill kind가 /skills/[id]로 갔으나 /skills는 크래프트 테이블로 재정의됨)
export function getPluginHref(pluginOrId: Plugin | string | undefined): string {
  const plugin =
    typeof pluginOrId === 'string' ? getPluginById(pluginOrId) : pluginOrId
  if (!plugin) return '/plugins'
  if (plugin.kind === 'client') return `/clients/${plugin.id}`
  return `/plugins/${plugin.id}`
}
