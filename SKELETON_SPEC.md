# Catalyze Harness — Skeleton 구현 요청

## 배경

Catalyze는 한국 기반 **Web3 컨설팅 회사**로, 해외 클라이언트(XRPL Korea, Squid 같은 블록체인 프로젝트)를 주로 상대한다. 팀은 BD / Marketing / Dev Growth 3개 축으로 구성되며, **구성원 대다수가 비개발자**다.

사내 AX(AI Transformation) 프로젝트의 일환으로, 구성원별 AI 활용 역량 편차를 좁히고 조직의 암묵지를 자산화하는 플랫폼을 만든다. 이 플랫폼의 이름이 **Harness**.

## 핵심 개념

- **Plugin** = AI에게 먹일 마스터 프롬프트 (CLAUDE.md / SKILL.md 같은 md 파일). git repo 단위로 관리된다.
- **Clients** = 클라이언트별 맥락 저장소 (예: XRPL Korea의 톤매너, 최근 로드맵, 주요 용어)
- **Skills** = 재사용 가능한 작업 playbook (예: "기술 아티클 작성", "영문 콜드 이메일")
- **사용 흐름**: 구성원이 Clients × Skills를 조합해서 복사한 뒤, 본인이 쓰는 AI 에이전트(Claude, ChatGPT 등)에 붙여넣어 작업
- **축적 루프**: Discussions(의견 교환) → Proposals(변경 제안) → 반영 → Skill/Client 업데이트

## 구현 범위

**이번 Skeleton에 포함**
- 라우팅, 사이드바 네비게이션, 페이지 레이아웃
- Overview 대시보드 (더미 데이터로 실제처럼 채워 보여주기)
- 각 페이지의 리스트/상세 화면 뼈대
- 플러그인 상세 페이지의 5탭 구조
- Admin 모드 토글 (UI 상태만 전환, 권한 체크 없음)

**이번에 만들지 않을 것**
- 실제 GitHub API 연동
- 실제 편집·저장·커밋 기능
- 인증·로그인
- 다크 모드

모든 데이터는 `lib/mock-data.ts`에 타입과 함께 더미로 작성하고 각 페이지가 import해서 사용.

**시연 일정: 다음주 월요일.** 화려함보다 명료함 우선.

## 기술 스택

- Next.js 14+ (App Router, TypeScript)
- Tailwind CSS
- shadcn/ui (컴포넌트 라이브러리)
- lucide-react (아이콘)
- recharts (차트)

초기화: `npx shadcn@latest init` 후 필요한 컴포넌트만 add.

## 언어 및 용어 규칙

- **UI 텍스트는 한국어**로 작성
- **파일명, 변수명, 플러그인명 등 식별자는 영어** 유지 (예: `skill-article-writing`, `client-xrpl-korea`, `cst-research`)
- **비개발자 중심 용어** 사용. 개발자 용어 직접 노출 금지:

| 개발자 용어 | UI 표기 |
|---|---|
| Commit | 변경 / 변경 이력 |
| Pull Request | 제안 (Proposal) |
| Review | 검토 |
| Issue | 의견 / 논의 |
| Merge | 반영 |
| Repository | 플러그인 |

## 정보 구조

### 사이드바

```
[로고 자리 — 상단, 이미지는 Jun이 추후 삽입]
[Admin 모드 토글]

활동
├─ Plugins        /plugins
└─ Proposals      /proposals

Harness
├─ Overview       /
├─ Clients        /clients
├─ Skills         /skills
└─ Agents         /agents       (Coming soon)

조직
├─ Teams          /teams
└─ Members        /members
```

### 라우팅 맵

- `/` → Overview 대시보드
- `/plugins` → 플러그인 전체 리스트 (팀별 그룹핑)
- `/plugins/[id]` → 플러그인 상세 (5탭)
- `/proposals` → 변경 제안 리스트
- `/proposals/[id]` → 제안 상세
- `/clients` → 클라이언트 리스트
- `/clients/[id]` → 클라이언트 상세 (5탭 구조 재사용)
- `/skills` → Skills 리스트
- `/skills/[id]` → Skill 상세 (5탭 구조 재사용)
- `/agents` → Coming soon 플레이스홀더
- `/teams`, `/members` → 조직 뷰

## 페이지 명세

### 1. Overview 대시보드 (가장 중요)

6개 섹션이 위에서 아래로 배치된다. 비개발자가 들어왔을 때 *"지금 뭘 할 수 있지?"*, *"조직이 어떻게 진화하고 있지?"*를 한눈에 느끼게 만드는 게 목적.

**① 히어로 — 축적 루프의 작동 증거**
- 상단 큰 배너: "이번 주 N개의 개선이 조직 자산으로 축적됐어요"
- 서브 수치: Discussions N개, Proposals N개, 반영된 Changes N개
- 이 섹션이 가장 먼저 **조직 전체가 살아있다**는 느낌을 줘야 함

**② 빠른 시작 (3개 카드)**
- 카드 1: "최근 쓴 조합" — 마지막 복사한 Clients × Skills 조합 1개 + "다시 사용" 버튼
- 카드 2: "추천 조합" — 사용자 역할(하드코딩: BD) 기반 추천 1개
- 카드 3: "새 조합 만들기" → `/skills`로 이동

**③ 업데이트 피드 + 클라이언트 온도 (2열)**
- 좌: 업데이트 피드 4~5개. "XX Skill 업데이트됨 (2시간 전)", "Client-XRPL 맥락 변경됨 (어제)". 클릭 시 상세로
- 우: 클라이언트별 활동 온도. 클라이언트명 + 이번 주 활동량을 색 바/히트로

**④ 전사 활용 현황**
- 구성원별 "이번 주 플러그인 조합 복사 횟수" 분포 (히트맵 or 막대)
- 개인 식별보다 **분포 형태** 강조. "전사 평균 N회, 최소 N, 최대 N" 요약
- 현재 사용자(하드코딩) 위치 표시

**⑤ Plugin Marketplace + Adoption**
- 좌: 도넛 차트 "Plugin Adoption" — 예: `common.md` 28/30, `client-xrpl` 12/30, `skill-article-writing` 18/30, `skill-cold-email` 15/30
- 우: 카운트 카드 4개 — Plugins N / Skills N / Clients N / Agents 0 (Coming soon)

**⑥ Admin 위젯 (Admin 모드 켜진 경우에만)**
- 리뷰 대기 Proposals 개수 + Top 3 리스트
- 7일간 답변 없는 Discussions 경고

### 2. Plugins (`/plugins`)

팀별 그룹핑으로 플러그인 카드 나열.

- 상단 요약: 그룹별 개수 (전사 공통 / BD / Marketing / Dev Growth)
- 각 카드: 플러그인명(영어), 그룹 라벨, **S**(Skills) / **D**(Discussions) / **P**(Proposals) 배지, 최근 업데이트
- 클릭 → `/plugins/[id]`

### 3. Plugin 상세 (`/plugins/[id]`)

5개 탭:

- **Overview**: README, 최근 활동 로그, 채택자 수
- **Content**: md 파일 내용 프리뷰 (Admin 모드면 "편집" 버튼 노출)
- **Discussions**: 의견 스레드 리스트. 스레드 상세에 "이 의견을 반영한 제안 만들기" 버튼 (클릭 시 토스트만)
- **Proposals**: 이 플러그인에 열린 변경 제안 리스트
- **History**: 변경 이력 타임라인 (용어는 "변경 이력")

**핵심 루프 시각화**: Discussions 더미 중 1~2개는 linkedProposalId를 가진 `resolved` 상태로. 상세에서 "이 의견은 Proposal #N으로 반영되었습니다" 배지가 보이게 해서 루프 완결성을 시연에서 보여줄 것.

### 4. Proposals (`/proposals`)

- 전사 제안 리스트. 상태 필터: 대기중 / 검토중 / 반영됨 / 닫힘
- 각 행: 제목, 대상 플러그인, 작성자, 상태 배지, 작성 시간
- 상세(`/proposals/[id]`): 제목, 본문, 변경 diff 자리(더미 코드 블록), 의견, "반영" 버튼(Admin 모드에서만)

### 5. Clients (`/clients`), Skills (`/skills`)

플러그인 리스트의 특화 뷰.

- **Clients**: `client-xrpl-korea`, `client-squid`, `client-catalyze-internal` — 각 카드에 클라이언트명, 한 줄 소개, 관련 Skills 개수, 최근 업데이트
- **Skills**: `skill-article-writing`, `skill-cold-email`, `skill-research-summary`, `skill-translate-ko-en`, `skill-meeting-prep` 등 — 태그(리서치/콘텐츠/이메일/번역/미팅), 사용 빈도
- 상세 페이지는 Plugin 상세의 5탭 구조 재사용

### 6. Agents (`/agents`)

Coming soon 플레이스홀더. 중앙에 "Agents는 다음 단계에서 지원됩니다" + 짧은 용도 설명. 일러스트 없이 깔끔하게.

### 7. Teams, Members

- **Teams**: BD / Marketing / Dev Growth / Internal 4개 팀 카드. 멤버 수, 채택 플러그인 수
- **Members**: 테이블. 이름, 팀, 역할, 이번 주 활용 횟수, 아바타(이니셜)

## Admin 모드

- 사이드바 상단 또는 헤더 우측에 토글 스위치 ("Admin 모드")
- 켜지면:
  - Overview에 **⑥ Admin 위젯** 섹션 노출
  - Plugin/Skill/Client 상세 **Content 탭에 "편집" 버튼** 노출
  - Proposal 상세에 **"반영" 버튼** 노출
  - Discussion 상세에 **"이 의견을 반영한 제안 만들기" 버튼** 강조 표시
- 상태는 React Context로 전역 관리. **localStorage 사용 금지.**

## 디자인 가이드

- DeSpread Harness 대시보드 레이아웃을 참고하되, 카탈의 **비개발자 중심** 감각을 반영
- 좌측 사이드바(약 240px 고정) + 상단 헤더 + 메인 컨텐츠
- 카드·탭·배지 중심의 깔끔한 정보 밀도
- shadcn 기본 팔레트 유지. 강조색 하나만 브랜드 톤(파란 계열)으로 지정
- 여백 넉넉히, 타이포그래피 명확하게
- 아이콘 lucide-react 통일
- 차트 recharts (도넛 + 막대 정도면 충분)

## 더미 데이터 구조 (`lib/mock-data.ts`)

```typescript
type Team = 'common' | 'bd' | 'marketing' | 'dev-growth' | 'internal'
type PluginKind = 'client' | 'skill' | 'agent' | 'common'
type ProposalStatus = 'open' | 'in-review' | 'merged' | 'closed'
type DiscussionStatus = 'open' | 'resolved'

type Plugin = {
  id: string            // 예: 'skill-article-writing'
  name: string          // 영어 식별자
  kind: PluginKind
  team: Team
  description: string   // 한국어 한 줄 소개
  tags?: string[]
  updatedAt: string     // ISO
  skillsCount: number
  discussionsCount: number
  proposalsCount: number
  adoptionCount: number // N/30
  contentPreview: string // md 내용 일부
}

type Discussion = {
  id: string
  pluginId: string
  title: string
  author: string
  createdAt: string
  status: DiscussionStatus
  commentsCount: number
  linkedProposalId?: string
}

type Proposal = {
  id: string
  pluginId: string
  title: string
  author: string
  status: ProposalStatus
  createdAt: string
  description: string
  linkedDiscussionId?: string
}

type Change = {
  id: string
  pluginId: string
  message: string       // 한국어
  author: string
  createdAt: string
}

type Member = {
  id: string
  name: string
  team: Team
  role: string          // 'BD' | 'Researcher' | 'Marketer' | ...
  weeklyUsage: number   // 이번 주 조합 복사 횟수
  avatarInitials: string
}

type Combo = {
  id: string
  clientId: string
  skillId: string
  lastUsedAt: string
}

const currentUser = {
  id: 'u-jay',
  name: 'Jay Lee',
  team: 'bd',
  role: 'BD'
}
```

**엔티티 최소 개수**
- Plugins: 12 (common 1, BD 3, Marketing 3, Dev Growth 3, client 2)
- Skills 전용: 8
- Clients 전용: 3 (xrpl-korea, squid, catalyze-internal)
- Members: 12
- Discussions: 플러그인당 2~3, 그중 1개는 `resolved` + `linkedProposalId` 채워짐
- Proposals: 8 (상태 골고루)
- Changes: 플러그인당 3~5

## 파일 구조

```
app/
  layout.tsx
  page.tsx                    # Overview
  plugins/
    page.tsx
    [id]/page.tsx
  proposals/
    page.tsx
    [id]/page.tsx
  clients/
    page.tsx
    [id]/page.tsx
  skills/
    page.tsx
    [id]/page.tsx
  agents/page.tsx
  teams/page.tsx
  members/page.tsx
components/
  layout/
    Sidebar.tsx
    Header.tsx
    AdminToggle.tsx
  overview/
    HeroBanner.tsx
    QuickStart.tsx
    UpdateFeed.tsx
    ClientTemperature.tsx
    UsageHeatmap.tsx
    AdoptionDonut.tsx
    MarketplaceCounts.tsx
    AdminWidgets.tsx
  plugin/
    PluginCard.tsx
    PluginTabs.tsx             # Overview/Content/Discussions/Proposals/History
    DiscussionThread.tsx
    ProposalItem.tsx
    ChangeTimeline.tsx
  ui/                          # shadcn 생성 컴포넌트
lib/
  mock-data.ts
  admin-context.tsx
```

## 작업 순서

1. Next.js + Tailwind + shadcn/ui 초기화
2. `lib/mock-data.ts` 작성 (모든 타입 + 더미 데이터)
3. `admin-context.tsx` 세팅
4. 레이아웃 (Sidebar + Header + AdminToggle)
5. Overview 대시보드 6개 섹션
6. Plugins 리스트 + 상세 (5탭)
7. 나머지 페이지 (Proposals, Clients, Skills, Agents, Teams, Members)
8. 반응형: 데스크톱 우선, 모바일은 사이드바 접힘 정도면 OK

## 최종 체크리스트

- [ ] 모든 UI 텍스트 한국어
- [ ] 플러그인/파일/변수명은 영어 유지
- [ ] 개발자 용어 대신 비개발자 친화 용어
- [ ] Admin 모드 토글 동작 확인
- [ ] **Discussion → Proposal → 반영 → resolved 루프가 더미 데이터로 한 사이클 완결**되어 시연에서 보여지는가
- [ ] 모든 페이지 이동 끊김 없는가
- [ ] 더미 데이터만으로도 "실제 운영 중인 것처럼" 느껴지는가
