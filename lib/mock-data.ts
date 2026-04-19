// ============================================================================
// Catalyze Harness — Mock Data
// 시연용 더미 데이터. 실제 API 연동 전까지 모든 페이지가 이 파일을 import한다.
// ============================================================================

export type Team = 'common' | 'bd' | 'marketing' | 'dev-growth' | 'operations'
export type PluginKind = 'client' | 'skill' | 'agent' | 'common'
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
  skillsCount: number
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

export const currentUser: {
  id: string
  name: string
  team: Team
  role: string
} = {
  id: 'u-jun',
  name: 'Jun Lee',
  team: 'dev-growth',
  role: 'Researcher',
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
  skill: 'Skill',
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
// Plugins (12개 = common 1 + BD 3 + Marketing 3 + Dev Growth 2 + Client 3)
// ----------------------------------------------------------------------------

export const plugins: Plugin[] = [
  {
    id: 'common',
    name: 'common.md',
    kind: 'common',
    team: 'common',
    description: '카탈라이즈 전 구성원이 공통으로 사용하는 기본 프롬프트. 브랜드 톤, 회사 소개 및 기본 행동 지침을 포함합니다.',
    tags: ['전사', '기본'],
    updatedAt: '2026-04-15T09:12:00.000Z',
    skillsCount: 8,
    discussionsCount: 3,
    proposalsCount: 1,
    adoptionCount: 5,
    contentPreview: '# Catalyze Common\n\n카탈라이즈는 한국 기반 Web3 컨설팅 회사로, 해외 클라이언트를 주로 상대합니다. 모든 작업물은 아래 원칙을 공통으로 따릅니다.\n\n- 톤: 전문가적이지만 과장되지 않게\n- 언어: 국문/영문 혼용시 용어 일관성 유지\n- 클라이언트별 맥락은 `client-*` 플러그인을 참조할 것\n',
  },
  {
    id: 'skill-article-writing',
    name: 'skill-article-writing',
    kind: 'skill',
    team: 'bd',
    description: '리서치 노트를 바탕으로 마케팅 아티클 초안을 작성합니다.',
    tags: ['콘텐츠', '리서치'],
    updatedAt: '2026-04-17T04:30:00.000Z',
    skillsCount: 0,
    discussionsCount: 3,
    proposalsCount: 2,
    adoptionCount: 4,
    contentPreview: '# Skill: Article Writing\n\n## 목적\n리서치 노트 → 해외 매체 기고용 아티클 초안.\n\n## 입력\n- 리서치 노트 (bullet)\n- 타겟 매체명 (선택)\n- 타겟 독자 (선택)\n\n## 출력\n- 제목 후보 3개\n- 2,000자 내외 영문 초안\n',
  },
  {
    id: 'skill-cold-email',
    name: 'skill-cold-email',
    kind: 'skill',
    team: 'bd',
    description: '콜드 메일 작성용 플러그인. 소재, 수신자, 목적을 입력하면 3가지 톤으로 초안을 생성합니다.',
    tags: ['이메일', 'BD'],
    updatedAt: '2026-04-16T11:02:00.000Z',
    skillsCount: 0,
    discussionsCount: 2,
    proposalsCount: 1,
    adoptionCount: 3,
    contentPreview: '# Skill: Cold Email\n\n## 목적\n영문 콜드 이메일 초안 3종 (톤별).\n\n## 톤\n- Direct\n- Warm\n- Strategic\n',
  },
  {
    id: 'skill-meeting-prep',
    name: 'skill-meeting-prep',
    kind: 'skill',
    team: 'bd',
    description: '미팅 사전 준비 — 참석자 배경, 안건, 질문 리스트를 입력하면 초안을 생성합니다.',
    tags: ['미팅', 'BD'],
    updatedAt: '2026-04-14T08:45:00.000Z',
    skillsCount: 0,
    discussionsCount: 2,
    proposalsCount: 0,
    adoptionCount: 2,
    contentPreview: '# Skill: Meeting Prep\n\n## 산출물\n- 참석자 one-liner\n- 안건 정리\n- 질문 3~5개\n',
  },
  {
    id: 'skill-content-planning',
    name: 'skill-content-planning',
    kind: 'skill',
    team: 'marketing',
    description: '월간 콘텐츠 캘린더 초안. 주제, 채널, 포스팅 일정을 입력하면 초안을 제안합니다.',
    tags: ['콘텐츠', '플래닝'],
    updatedAt: '2026-04-12T07:20:00.000Z',
    skillsCount: 0,
    discussionsCount: 2,
    proposalsCount: 1,
    adoptionCount: 2,
    contentPreview: '# Skill: Content Planning\n\n채널별 월간 포스팅 캘린더를 초안으로 만든다.\n',
  },
  {
    id: 'skill-social-copy',
    name: 'skill-social-copy',
    kind: 'skill',
    team: 'marketing',
    description: 'X / LinkedIn / Telegram 소셜 카피 작성용 플러그인. 링크 소재, 톤, 해시태그를 조합해 플랫폼별로 분기합니다.',
    tags: ['콘텐츠', '소셜'],
    updatedAt: '2026-04-17T13:50:00.000Z',
    skillsCount: 0,
    discussionsCount: 3,
    proposalsCount: 1,
    adoptionCount: 3,
    contentPreview: '# Skill: Social Copy\n\nX / LinkedIn 플랫폼별로 카피 3안씩 생성.\n',
  },
  {
    id: 'skill-translate-ko-en',
    name: 'skill-translate-ko-en',
    kind: 'skill',
    team: 'marketing',
    description: '국문 → 영문 번역. Web3 전문용어 번역 시 맥락을 자연스럽게 유지합니다.',
    tags: ['번역'],
    updatedAt: '2026-04-13T06:10:00.000Z',
    skillsCount: 0,
    discussionsCount: 2,
    proposalsCount: 0,
    adoptionCount: 4,
    contentPreview: '# Skill: Translate KO → EN\n\nWeb3 용어 사전 기반 일관성 번역.\n',
  },
  {
    id: 'skill-research-summary',
    name: 'skill-research-summary',
    kind: 'skill',
    team: 'dev-growth',
    description: '리서치 문서(기사 및 아티클 링크 / PDF)를 요약하고 인용 가능한 형태로 정리합니다.',
    tags: ['리서치'],
    updatedAt: '2026-04-16T02:15:00.000Z',
    skillsCount: 0,
    discussionsCount: 2,
    proposalsCount: 1,
    adoptionCount: 4,
    contentPreview: '# Skill: Research Summary\n\n링크 / PDF 입력 → 핵심 요약 + 인용 출처.\n',
  },
  {
    id: 'skill-technical-article',
    name: 'skill-technical-article',
    kind: 'skill',
    team: 'dev-growth',
    description: '프로토콜 구조, 기술 스펙을 비개발자도 읽을 수 있는 레벨의 아티클로 변환합니다.',
    tags: ['콘텐츠', '기술'],
    updatedAt: '2026-04-11T10:40:00.000Z',
    skillsCount: 0,
    discussionsCount: 2,
    proposalsCount: 1,
    adoptionCount: 3,
    contentPreview: '# Skill: Technical Article\n\n기술 스펙 → 비개발자용 아티클.\n',
  },
  {
    id: 'client-ripple',
    name: 'Ripple',
    kind: 'client',
    team: 'operations',
    description: '',
    tags: ['클라이언트', 'Ripple', 'Payments'],
    updatedAt: '2026-04-17T15:24:00.000Z',
    skillsCount: 5,
    discussionsCount: 3,
    proposalsCount: 1,
    adoptionCount: 4,
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
    skillsCount: 3,
    discussionsCount: 2,
    proposalsCount: 0,
    adoptionCount: 2,
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
    skillsCount: 3,
    discussionsCount: 2,
    proposalsCount: 0,
    adoptionCount: 2,
    contentPreview: '# Client: Midnight\n\n- 톤: 기술적/간결. 개발자 대상 기본값.\n- 용어: shielded transactions, Compact DSL, Kachina 프로토콜.\n- 최근 로드맵: 메인넷 런칭, Glacier Drop, SDK 공개.\n',
  },
]

// ----------------------------------------------------------------------------
// Discussions — 플러그인당 2~3개. 적어도 한 개는 resolved + linkedProposalId.
// ----------------------------------------------------------------------------

export const discussions: Discussion[] = [
  // common.md
  { id: 'd-001', pluginId: 'common', title: '영문 작성시 “we” vs “Catalyze” 기본값은?', author: 'Jay Park', createdAt: '2026-04-10T06:20:00.000Z', status: 'open', commentsCount: 4 },
  { id: 'd-002', pluginId: 'common', title: '브랜드 톤 가이드에 "격식 수준" 명시 필요', author: 'Jake Ku', createdAt: '2026-04-12T08:00:00.000Z', status: 'resolved', commentsCount: 7, linkedProposalId: 'p-001' },
  { id: 'd-003', pluginId: 'common', title: '회사 소개 문단 길이 너무 김', author: 'Jake Ku', createdAt: '2026-04-15T10:40:00.000Z', status: 'open', commentsCount: 2 },

  // skill-article-writing  — 대표 demo 루프 (resolved → p-002)
  { id: 'd-004', pluginId: 'skill-article-writing', title: '해외 매체 기고시 1인칭 사용 기준 모호', author: 'Jay Lee', createdAt: '2026-04-09T03:15:00.000Z', status: 'resolved', commentsCount: 9, linkedProposalId: 'p-002' },
  { id: 'd-005', pluginId: 'skill-article-writing', title: '제목 후보 3개만 주는거 부족함', author: 'Jay Park', createdAt: '2026-04-14T09:22:00.000Z', status: 'open', commentsCount: 3 },
  { id: 'd-006', pluginId: 'skill-article-writing', title: '리서치 노트 포맷이 사람마다 달라 편차 큼', author: 'Jun Lee', createdAt: '2026-04-16T07:00:00.000Z', status: 'open', commentsCount: 5 },

  // skill-cold-email
  { id: 'd-007', pluginId: 'skill-cold-email', title: 'Direct 톤이 너무 공격적이라는 피드백 있음', author: 'Jay Park', createdAt: '2026-04-11T04:40:00.000Z', status: 'resolved', commentsCount: 6, linkedProposalId: 'p-003' },
  { id: 'd-008', pluginId: 'skill-cold-email', title: '서명(signature) 규칙은 어디에?', author: 'Jay Park', createdAt: '2026-04-14T12:10:00.000Z', status: 'open', commentsCount: 2 },

  // skill-meeting-prep
  { id: 'd-009', pluginId: 'skill-meeting-prep', title: '클라이언트 미팅 vs 내부 미팅 템플릿 분리', author: 'Jay Park', createdAt: '2026-04-13T05:30:00.000Z', status: 'open', commentsCount: 4 },
  { id: 'd-010', pluginId: 'skill-meeting-prep', title: '질문 3~5개 개수 너무 적음', author: 'Jay Lee', createdAt: '2026-04-15T07:45:00.000Z', status: 'open', commentsCount: 3 },

  // skill-content-planning
  { id: 'd-011', pluginId: 'skill-content-planning', title: '채널 우선순위가 달이 바뀌면 바뀌는데 반영 어떻게', author: 'Jake Ku', createdAt: '2026-04-10T11:00:00.000Z', status: 'resolved', commentsCount: 5, linkedProposalId: 'p-004' },
  { id: 'd-012', pluginId: 'skill-content-planning', title: '이벤트 시즌 캘린더 반영 자동화', author: 'Jake Ku', createdAt: '2026-04-14T04:20:00.000Z', status: 'open', commentsCount: 2 },

  // skill-social-copy
  { id: 'd-013', pluginId: 'skill-social-copy', title: 'LinkedIn 해시태그 개수 정책', author: 'Jake Ku', createdAt: '2026-04-12T13:00:00.000Z', status: 'open', commentsCount: 3 },
  { id: 'd-014', pluginId: 'skill-social-copy', title: 'X 이모지 허용 범위', author: 'Jake Ku', createdAt: '2026-04-15T02:30:00.000Z', status: 'open', commentsCount: 4 },
  { id: 'd-015', pluginId: 'skill-social-copy', title: '파트너 멘션 표기 통일안', author: 'Jake Ku', createdAt: '2026-04-16T09:10:00.000Z', status: 'open', commentsCount: 6 },

  // skill-translate-ko-en
  { id: 'd-016', pluginId: 'skill-translate-ko-en', title: '“검증자” 번역 validator vs verifier', author: 'Jun Lee', createdAt: '2026-04-11T08:00:00.000Z', status: 'resolved', commentsCount: 8, linkedProposalId: 'p-005' },
  { id: 'd-017', pluginId: 'skill-translate-ko-en', title: '스테이블코인 용어 대소문자 규칙', author: 'Jun Lee', createdAt: '2026-04-13T10:25:00.000Z', status: 'open', commentsCount: 3 },

  // skill-research-summary
  { id: 'd-018', pluginId: 'skill-research-summary', title: '출처 링크 포맷(번호 vs 각주)', author: 'Jake Ku', createdAt: '2026-04-09T06:00:00.000Z', status: 'open', commentsCount: 4 },
  { id: 'd-019', pluginId: 'skill-research-summary', title: 'PDF 표 데이터 요약 품질 이슈', author: 'Jun Lee', createdAt: '2026-04-14T11:40:00.000Z', status: 'open', commentsCount: 5 },

  // skill-technical-article
  { id: 'd-020', pluginId: 'skill-technical-article', title: '코드 블록 포함 여부 기준', author: 'Jake Ku', createdAt: '2026-04-12T05:15:00.000Z', status: 'open', commentsCount: 2 },
  { id: 'd-021', pluginId: 'skill-technical-article', title: '난이도 별 표기 통일', author: 'Jun Lee', createdAt: '2026-04-15T08:55:00.000Z', status: 'open', commentsCount: 3 },

  // client-ripple
  { id: 'd-022', pluginId: 'client-ripple', title: '최신 로드맵 문서 반영 필요', author: 'Jay Lee', createdAt: '2026-04-08T09:00:00.000Z', status: 'resolved', commentsCount: 6, linkedProposalId: 'p-006' },
  { id: 'd-023', pluginId: 'client-ripple', title: 'Interledger 용어 한글 표기 기준', author: 'Jay Park', createdAt: '2026-04-14T07:30:00.000Z', status: 'open', commentsCount: 4 },
  { id: 'd-024', pluginId: 'client-ripple', title: '커뮤니티 채널 목록 최신화', author: 'Jake Ku', createdAt: '2026-04-16T14:00:00.000Z', status: 'open', commentsCount: 2 },

  // client-squid
  { id: 'd-025', pluginId: 'client-squid', title: '지원 체인 목록 최신화', author: 'Jun Lee', createdAt: '2026-04-10T03:20:00.000Z', status: 'open', commentsCount: 3 },
  { id: 'd-026', pluginId: 'client-squid', title: 'Axelar 이벤트 시즌 플래그', author: 'Jake Ku', createdAt: '2026-04-13T06:50:00.000Z', status: 'open', commentsCount: 2 },

  // client-midnight
  { id: 'd-027', pluginId: 'client-midnight', title: '메인넷 런칭 일정 섹션 반영', author: 'Harry Park', createdAt: '2026-04-08T02:10:00.000Z', status: 'open', commentsCount: 5 },
  { id: 'd-028', pluginId: 'client-midnight', title: '프라이버시 프리미티브 설명 너무 압축적', author: 'Harry Park', createdAt: '2026-04-12T10:05:00.000Z', status: 'open', commentsCount: 3 },
]

// ----------------------------------------------------------------------------
// Proposals (8개, 상태 골고루). p-002는 demo 루프의 완결 지점.
// ----------------------------------------------------------------------------

export const proposals: Proposal[] = [
  {
    id: 'p-001',
    pluginId: 'common',
    title: '브랜드 톤 가이드 "격식 수준" 섹션 추가',
    author: 'Jake Ku',
    status: 'merged',
    createdAt: '2026-04-13T02:00:00.000Z',
    description: '톤 수준을 (1) 공식, (2) 세미-공식, (3) 캐주얼로 3단계로 나누고, 각 케이스별 예문을 추가합니다. 기존 "전문가적이지만 과장되지 않게"라는 추상적 문구를 대체합니다.',
    linkedDiscussionId: 'd-002',
  },
  {
    id: 'p-002',
    pluginId: 'skill-article-writing',
    title: '1인칭 사용 기준 명시 (매체별 분기)',
    author: 'Jay Lee',
    status: 'merged',
    createdAt: '2026-04-15T07:30:00.000Z',
    description: 'CoinDesk, The Defiant 등 매체별로 1인칭 사용 관습이 다르므로, 매체명이 입력되면 해당 매체의 기본 화자 스타일을 프롬프트에 주입하도록 수정합니다.',
    linkedDiscussionId: 'd-004',
  },
  {
    id: 'p-003',
    pluginId: 'skill-cold-email',
    title: 'Direct 톤 완화 + "Assertive" 톤 신설',
    author: 'Jay Park',
    status: 'in-review',
    createdAt: '2026-04-16T05:45:00.000Z',
    description: 'Direct 톤이 수신자 관점에서 공격적으로 해석되는 사례가 반복되어, 현재 Direct의 톤을 완화하고 "Assertive"(명확하되 도전적이지 않음) 톤을 별도 추가합니다.',
    linkedDiscussionId: 'd-007',
  },
  {
    id: 'p-004',
    pluginId: 'skill-content-planning',
    title: '채널 우선순위 월간 스위치 블록 추가',
    author: 'Jake Ku',
    status: 'in-review',
    createdAt: '2026-04-15T11:00:00.000Z',
    description: '월 초에 채널 우선순위 변경이 잦은 점을 반영해, 입력 파라미터에 "이번 달 우선순위 채널" 필드를 추가하고 프롬프트에서 이를 가중치로 사용합니다.',
    linkedDiscussionId: 'd-011',
  },
  {
    id: 'p-005',
    pluginId: 'skill-translate-ko-en',
    title: '용어 사전에 "검증자=validator" 고정',
    author: 'Jun Lee',
    status: 'merged',
    createdAt: '2026-04-12T13:30:00.000Z',
    description: '"검증자"를 validator로 고정. verifier는 ZK 맥락에 한정해 허용하고, 일반 L1/L2 맥락에서는 validator만 사용합니다.',
    linkedDiscussionId: 'd-016',
  },
  {
    id: 'p-006',
    pluginId: 'client-ripple',
    title: '2026 Q2 로드맵 3개 항목 반영',
    author: 'Jay Lee',
    status: 'open',
    createdAt: '2026-04-17T08:20:00.000Z',
    description: 'Ripple 2026 Q2 로드맵 발표에서 신규 프로그램 3개(개발자 그랜트, RLUSD 확장 파일럿, 유럽 결제 라이선스 취득)를 "최근 로드맵" 섹션에 추가합니다.',
    linkedDiscussionId: 'd-022',
  },
  {
    id: 'p-007',
    pluginId: 'skill-social-copy',
    title: 'X 이모지 화이트리스트 도입',
    author: 'Jake Ku',
    status: 'open',
    createdAt: '2026-04-17T10:00:00.000Z',
    description: 'X 포스트에서 이모지 남용 이슈가 있어, 허용 이모지 목록(🚀, 🧵, ↓, ✦ 등)만 쓰도록 규칙을 추가합니다.',
  },
  {
    id: 'p-008',
    pluginId: 'skill-research-summary',
    title: '출처 링크를 각주 포맷으로 통일',
    author: 'Jake Ku',
    status: 'closed',
    createdAt: '2026-04-09T09:40:00.000Z',
    description: '출처 표기를 번호형 각주로 통일하자는 제안이었으나, 리서치팀 내부 논의 결과 현행 인라인 링크를 유지하기로 하여 닫습니다.',
  },
]

// ----------------------------------------------------------------------------
// Changes — 플러그인당 3~5개. 반영된 Proposal과 연결되는 커밋도 포함.
// ----------------------------------------------------------------------------

export const changes: Change[] = [
  // common
  { id: 'c-001', pluginId: 'common', message: '초기 common 프롬프트 작성', author: 'Harry Park', createdAt: '2026-03-20T04:00:00.000Z' },
  { id: 'c-002', pluginId: 'common', message: '회사 소개 문단 압축', author: 'Jake Ku', createdAt: '2026-04-02T09:30:00.000Z' },
  { id: 'c-003', pluginId: 'common', message: '톤 가이드 "격식 수준" 3단계 추가 (제안 #001 반영)', author: 'Jake Ku', createdAt: '2026-04-14T06:00:00.000Z' },
  { id: 'c-004', pluginId: 'common', message: '영문 기본 자기호칭 예문 보강', author: 'Jay Lee', createdAt: '2026-04-15T08:40:00.000Z' },

  // skill-article-writing
  { id: 'c-005', pluginId: 'skill-article-writing', message: '초기 Skill 작성', author: 'Jay Lee', createdAt: '2026-03-22T04:15:00.000Z' },
  { id: 'c-006', pluginId: 'skill-article-writing', message: '출력 포맷 규격화', author: 'Jay Park', createdAt: '2026-04-03T07:20:00.000Z' },
  { id: 'c-007', pluginId: 'skill-article-writing', message: '리서치 노트 입력 템플릿 추가', author: 'Jay Park', createdAt: '2026-04-09T10:00:00.000Z' },
  { id: 'c-008', pluginId: 'skill-article-writing', message: '1인칭 사용 매체별 분기 추가 (제안 #002 반영)', author: 'Jay Lee', createdAt: '2026-04-17T04:30:00.000Z' },

  // skill-cold-email
  { id: 'c-009', pluginId: 'skill-cold-email', message: '초기 Skill 작성', author: 'Jay Park', createdAt: '2026-03-23T05:50:00.000Z' },
  { id: 'c-010', pluginId: 'skill-cold-email', message: '톤 3종 분리', author: 'Jay Park', createdAt: '2026-04-05T03:30:00.000Z' },
  { id: 'c-011', pluginId: 'skill-cold-email', message: '수신자 컨텍스트 주입 필드 추가', author: 'Jay Park', createdAt: '2026-04-12T06:40:00.000Z' },

  // skill-meeting-prep
  { id: 'c-012', pluginId: 'skill-meeting-prep', message: '초기 Skill 작성', author: 'Jay Park', createdAt: '2026-03-25T08:00:00.000Z' },
  { id: 'c-013', pluginId: 'skill-meeting-prep', message: '질문 개수 3~5개로 상한', author: 'Jay Lee', createdAt: '2026-04-06T09:00:00.000Z' },
  { id: 'c-014', pluginId: 'skill-meeting-prep', message: '참석자 정리 포맷 개선', author: 'Jay Park', createdAt: '2026-04-14T08:45:00.000Z' },

  // skill-content-planning
  { id: 'c-015', pluginId: 'skill-content-planning', message: '초기 Skill 작성', author: 'Jake Ku', createdAt: '2026-03-26T04:30:00.000Z' },
  { id: 'c-016', pluginId: 'skill-content-planning', message: '채널별 최소 발행 개수 기준 추가', author: 'Jake Ku', createdAt: '2026-04-07T10:50:00.000Z' },
  { id: 'c-017', pluginId: 'skill-content-planning', message: '캘린더 출력 포맷 정리', author: 'Jake Ku', createdAt: '2026-04-12T07:20:00.000Z' },

  // skill-social-copy
  { id: 'c-018', pluginId: 'skill-social-copy', message: '초기 Skill 작성', author: 'Jake Ku', createdAt: '2026-03-28T06:10:00.000Z' },
  { id: 'c-019', pluginId: 'skill-social-copy', message: 'LinkedIn 단락 길이 가이드', author: 'Jake Ku', createdAt: '2026-04-08T04:00:00.000Z' },
  { id: 'c-020', pluginId: 'skill-social-copy', message: 'X 3안 생성시 톤 분산', author: 'Jake Ku', createdAt: '2026-04-15T02:00:00.000Z' },
  { id: 'c-021', pluginId: 'skill-social-copy', message: '해시태그 템플릿 정비', author: 'Jake Ku', createdAt: '2026-04-17T13:50:00.000Z' },

  // skill-translate-ko-en
  { id: 'c-022', pluginId: 'skill-translate-ko-en', message: '초기 Skill 작성', author: 'Jun Lee', createdAt: '2026-03-24T05:00:00.000Z' },
  { id: 'c-023', pluginId: 'skill-translate-ko-en', message: 'Web3 용어 사전 초판', author: 'Jun Lee', createdAt: '2026-04-04T08:20:00.000Z' },
  { id: 'c-024', pluginId: 'skill-translate-ko-en', message: '검증자=validator 고정 (제안 #005 반영)', author: 'Jun Lee', createdAt: '2026-04-13T06:10:00.000Z' },

  // skill-research-summary
  { id: 'c-025', pluginId: 'skill-research-summary', message: '초기 Skill 작성', author: 'Jake Ku', createdAt: '2026-03-27T07:30:00.000Z' },
  { id: 'c-026', pluginId: 'skill-research-summary', message: '요약 섹션 구조화', author: 'Jun Lee', createdAt: '2026-04-06T10:00:00.000Z' },
  { id: 'c-027', pluginId: 'skill-research-summary', message: '인용 출처 블록 포맷 고정', author: 'Jake Ku', createdAt: '2026-04-16T02:15:00.000Z' },

  // skill-technical-article
  { id: 'c-028', pluginId: 'skill-technical-article', message: '초기 Skill 작성', author: 'Jake Ku', createdAt: '2026-03-29T04:50:00.000Z' },
  { id: 'c-029', pluginId: 'skill-technical-article', message: '비개발자 눈높이 체크리스트 추가', author: 'Jun Lee', createdAt: '2026-04-05T09:10:00.000Z' },
  { id: 'c-030', pluginId: 'skill-technical-article', message: '프로토콜 구조 설명 템플릿 정리', author: 'Jake Ku', createdAt: '2026-04-11T10:40:00.000Z' },

  // client-ripple
  { id: 'c-031', pluginId: 'client-ripple', message: '초기 Client 맥락 작성', author: 'Jay Lee', createdAt: '2026-03-21T03:00:00.000Z' },
  { id: 'c-032', pluginId: 'client-ripple', message: '파트너 / 용어 섹션 보강', author: 'Jay Park', createdAt: '2026-04-01T07:00:00.000Z' },
  { id: 'c-033', pluginId: 'client-ripple', message: 'RLUSD 관련 서술 업데이트', author: 'Jay Lee', createdAt: '2026-04-09T09:30:00.000Z' },
  { id: 'c-034', pluginId: 'client-ripple', message: 'Interledger Protocol 설명 추가', author: 'Jay Park', createdAt: '2026-04-17T15:24:00.000Z' },

  // client-squid
  { id: 'c-035', pluginId: 'client-squid', message: '초기 Client 맥락 작성', author: 'Jun Lee', createdAt: '2026-03-23T10:00:00.000Z' },
  { id: 'c-036', pluginId: 'client-squid', message: '지원 체인 목록 1차', author: 'Jake Ku', createdAt: '2026-04-02T04:00:00.000Z' },
  { id: 'c-037', pluginId: 'client-squid', message: '라우터 아키텍처 설명 보강', author: 'Jun Lee', createdAt: '2026-04-10T05:55:00.000Z' },

  // client-midnight
  { id: 'c-038', pluginId: 'client-midnight', message: '초기 Client 맥락 작성', author: 'Harry Park', createdAt: '2026-03-22T06:00:00.000Z' },
  { id: 'c-039', pluginId: 'client-midnight', message: 'Compact DSL 용어 섹션 추가', author: 'Harry Park', createdAt: '2026-04-01T09:20:00.000Z' },
  { id: 'c-040', pluginId: 'client-midnight', message: 'shielded transactions 설명 추가', author: 'Harry Park', createdAt: '2026-04-08T03:00:00.000Z' },
]

// ----------------------------------------------------------------------------
// Members (5명). currentUser = Jun Lee.
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

export const combos: Combo[] = [
  { id: 'combo-001', clientId: 'client-ripple', skillId: 'skill-cold-email', lastUsedAt: '2026-04-17T14:10:00.000Z' },
  { id: 'combo-002', clientId: 'client-ripple', skillId: 'skill-article-writing', lastUsedAt: '2026-04-16T09:00:00.000Z' },
  { id: 'combo-003', clientId: 'client-squid', skillId: 'skill-research-summary', lastUsedAt: '2026-04-15T06:30:00.000Z' },
  { id: 'combo-004', clientId: 'client-midnight', skillId: 'skill-meeting-prep', lastUsedAt: '2026-04-14T03:00:00.000Z' },
]

// ----------------------------------------------------------------------------
// 집계 통계 (Overview Hero용)
// ----------------------------------------------------------------------------

export const weeklyStats = {
  mergedChanges: 4,
  openDiscussions: discussions.filter((d) => d.status === 'open').length,
  openProposals: proposals.filter((p) => p.status === 'open' || p.status === 'in-review').length,
  staleDiscussions: 3,
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

export const skillPlugins = plugins.filter((p) => p.kind === 'skill')
export const clientPlugins = plugins.filter((p) => p.kind === 'client')

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
    linkedSkillIds: [
      'skill-article-writing',
      'skill-cold-email',
      'skill-translate-ko-en',
      'skill-meeting-prep',
      'skill-research-summary',
    ],
    tagline: 'Global Payments · XRP Ledger',
  },
  'client-midnight': {
    pluginId: 'client-midnight',
    ownerId: 'u-jayp',
    onboardedAt: '2026-04-10T00:00:00.000Z',
    linkedSkillIds: [
      'skill-technical-article',
      'skill-research-summary',
      'skill-translate-ko-en',
    ],
    tagline: 'Privacy Sidechain · Cardano 계열',
  },
  'client-squid': {
    pluginId: 'client-squid',
    ownerId: 'u-jayp',
    onboardedAt: '2026-03-25T00:00:00.000Z',
    linkedSkillIds: [
      'skill-research-summary',
      'skill-technical-article',
      'skill-translate-ko-en',
    ],
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

// kind-aware 라우팅 헬퍼 — 플러그인 종류별로 올바른 상세 URL 리턴.
export function getPluginHref(pluginOrId: Plugin | string | undefined): string {
  const plugin =
    typeof pluginOrId === 'string' ? getPluginById(pluginOrId) : pluginOrId
  if (!plugin) return '/plugins'
  if (plugin.kind === 'client') return `/clients/${plugin.id}`
  if (plugin.kind === 'skill') return `/skills/${plugin.id}`
  return `/plugins/${plugin.id}`
}
