# Catalyze AX Project — 요구사항 정의서 (PM Level)

> **문서 상태**: 초안 v0.1 / 2026-04-25
> **목적**: 현재 스켈레톤 상태와 다음 빌드 목표를 PM 레벨에서 정의. 본 문서는 후속 "기능 명세서(개발자 레벨)"의 입력이 된다.
> **대상 독자**: 파일럿 5명 (C-level, BD, Researcher, Operations, DevRel) + 향후 합류 멤버
> **소스**: SKELETON_SPEC.md(원 스펙) + 현재 코드베이스(2026-04-25 시점) 차이 반영

---

## 1. 제품 개요

### 1.1 비전
AI를 단순 도구가 아니라 *나의 확장*으로 활용하며, 100배 효율을 내는 개인과 조직.

### 1.2 해결하려는 문제
- 구성원 대다수가 비개발자 → AI 활용 역량 편차가 크다
- AI를 잘 쓰는 사람의 노하우(프롬프트, 워크플로우)가 **개인 안에 머물고 조직 자산화되지 못한다**
- 클라이언트별 맥락(Ripple/Midnight/Squid 각각의 톤·로드맵·용어)이 매번 새로 설명되어야 한다

### 1.3 핵심 가치 제안
**"클라이언트 맥락 × 작업 Skill을 조합 → AI 에이전트에 붙여넣기 → 결과물 → 그 과정에서 발견된 개선이 다시 조직 자산으로 축적"**

### 1.4 1차 사용자
| 페르소나 | 핵심 니즈 | 활용 빈도 |
|---|---|---|
| BD | 클라이언트별 콜드 메일·제안서 빠르게 | 주 다회 |
| Researcher | 리서치 요약·번역·정리 자동화 | 일 다회 |
| Marketing/DevRel | 기술 아티클·커뮤니티 응답 | 주 다회 |
| Operations | 정형 운영 업무 템플릿화 | 주 1~2회 |
| C-level | 조직 전체 활용도·축적 상태 모니터링 | 주 1회 |

### 1.5 성공 측정 지표 (KPI)
**현재 정의된 회사 목표 기준**
- 제안서 작성 시간 50% 단축
- 리서치 산출물 자동화 비율
- 커뮤니티 빌딩 자동화 비율
- 반복 업무 50% 이상 자동화 (전 구성원 기준)

> ⚠ 본 제품의 *활동 지표*(사용자 수, Combo 복사 횟수)는 보조 지표에 머물러야 함. 위 *성과 지표*가 본 KPI.

---

## 2. 도메인 개념 정의

### 2.1 핵심 엔티티

| 엔티티 | 정의 | 예시 |
|---|---|---|
| **Plugin** | AI에게 먹이는 마스터 프롬프트(md 단위) | `client-ripple`, `skill-cold-email` |
| **Client** | 클라이언트별 맥락 저장소 (Plugin의 한 종류) | Ripple, Midnight, Squid |
| **Skill** | 재사용 가능한 작업 playbook (Plugin의 한 종류) | "기술 아티클 작성", "영문 콜드 이메일" |
| **Common** | 전사 공통 프롬프트 (Plugin의 한 종류) | `common.md` |
| **Agent** | AI 에이전트 통합 (다음 단계) | (Coming soon) |
| **Combo** | Client × Skill 조합 (사용 단위) | `client-ripple` × `skill-cold-email` |
| **Discussion** | Plugin 단위로 열리는 의견·논의 | "이 톤이 너무 딱딱한 것 같다" |
| **Proposal** | Plugin 변경 제안 | "톤을 친근하게 수정" |
| **Change** | 반영된 변경 이력 | (커밋 = 한국어 "변경 이력") |
| **ClientMeta** | 클라이언트의 운영 메타 (담당자, 온보딩 일자, 연결 Skills) | — |

### 2.2 비개발자 용어 매핑 (UI 노출 규칙)

| 개발자 용어 | UI 표기 |
|---|---|
| Commit | 변경 / 변경 이력 |
| Pull Request | 제안 (Proposal) |
| Review | 검토 |
| Issue | 의견 / 논의 |
| Merge | 반영 |
| Repository | 플러그인 |

### 2.3 축적 루프 (제품의 핵심 메커니즘)
```
사용 → Discussion(의견 발생) → Proposal(변경 제안) → 검토 → 반영(Change) → 다음 사용
```
이 루프 한 사이클이 시연·문서·실제 운영 모두에서 *완결되어 보이는 것*이 1차 가치 증명.

---

## 3. 시스템 구조

### 3.1 정보 구조 (Sidebar)

```
[로고] Catalyze AX Project
[Admin 모드 토글]

활동
├─ Plugins        /plugins
└─ Proposals      /proposals

Harness
├─ Overview       /
├─ Clients        /clients
├─ Skills         /skills
└─ Agents         /agents       (Soon)

조직
├─ Teams          /teams
└─ Members        /members
```

### 3.2 Header
- 라우트별 자동 타이틀 ("Harness · {페이지명}")
- Admin 모드 토글 (우측)
- 현재 사용자 표시 (이름 + 역할)

### 3.3 권한 모델 (현재)
- **일반 사용자**: 모든 페이지 조회, Combo 복사
- **Admin**: 추가로 Content 편집 / Proposal 반영 / Discussion 우선 처리

> 권한 체크는 현재 UI 토글만. 실제 인증·권한 분리는 Phase 2.

---

## 4. 페이지별 요구사항 (현재 구현 + 다음 빌드)

### 4.1 Overview (`/`) — 비개발자가 가장 먼저 보는 화면

**현재 구성 (4섹션)**
1. **HeroBanner** — 축적 루프의 작동 증거 ("이번 주 N개 개선이 자산화됐어요")
2. **MyToday** — "오늘의 나" 컨텍스트 (개인 시작점)
3. **QuickStart** — 최근 조합 / 추천 조합 / 새 조합 만들기 3카드
4. **AdminWidgets** — Admin 모드에서만 노출 (대기 Proposals, 답변 없는 Discussions)

**현재 미사용(orphan) 컴포넌트** — 코드는 존재, 페이지에 미연결
- UpdateFeed (전사 활동 피드)
- ClientTemperature (주간 클라이언트별 활동도)
- UsageHeatmap (멤버별 사용 분포)
- AdoptionDonut (상위 5개 채택도)
- MarketplaceCounts (개수 카드)

**다음 빌드 결정 사항** ⚠ 미해결
- [ ] 5개 orphan 위젯을 (a) 활성화 (b) 삭제 (c) Admin 전용으로 이동 중 어느 쪽?
- [ ] "오늘의 나" 시점에서 *액션 가능한 것* 한 개를 명시할지 (예: "Ripple 콜드 메일 초안 만들기")

---

### 4.2 Plugins (`/plugins`)

**현재**
- 팀별 그룹핑 (Common / BD / Marketing / Dev Growth)
- 카드: 이름, 그룹, S/D/P 배지, 최근 업데이트

**다음 빌드**
- [ ] 검색·필터 (태그·팀·최신성)
- [ ] "내가 가장 많이 쓰는" 정렬 옵션

---

### 4.3 Plugin 상세 (`/plugins/[id]`) — 5탭 구조

**현재 — 5탭 모두 구현**
| 탭 | 내용 | 현재 한계 |
|---|---|---|
| Overview | README, 최근 활동, 채택자 수 | — |
| Content | md 프리뷰, Admin이면 "편집" 버튼 | 편집은 toast만 |
| Discussions | 의견 스레드 리스트 | 댓글 작성 불가 |
| Proposals | 이 플러그인 관련 제안 | — |
| History | 변경 이력 타임라인 | — |

**다음 빌드**
- [ ] Content 실제 편집 + 저장 (자체 저장소 or GitHub 연동)
- [ ] Discussion 댓글 작성·답변
- [ ] "이 의견을 반영한 제안 만들기" 실제 동작
- [ ] Proposal에서 변경 diff 실제 렌더링

---

### 4.4 Proposals (`/proposals`)

**현재**
- 전사 제안 리스트, 상태 필터 (대기/검토/반영/닫힘)
- 상세: 제목·본문·diff(더미)·의견 영역
- 상세 하단 "코멘트 스레드는 다음 단계에서 연결" 안내 명시

**다음 빌드**
- [ ] 작성자가 새 Proposal 직접 생성하는 플로우
- [ ] Admin "반영" 버튼 실제 동작 → Plugin Content에 머지
- [ ] 코멘트 스레드 활성화

---

### 4.5 Clients (`/clients`) — "Client Hub"로 진화

**스펙 대비 가장 큰 변형 영역.** 단순 리스트에서 운영 허브로 확장.

**현재**
- "고객사의 KPI, Roadmap, 연결 Skills, 담당자를 한 곳에서 관리" 표방
- ClientCard + ClientMetaCard + NewClientCta
- 2x 그리드 레이아웃, 카드별 담당자/온보딩일/연결 Skills 표시

**현재 데이터**: Ripple / Midnight / Squid 3개

**다음 빌드**
- [ ] **NewClientCta 실제 동작** (현재 placeholder) — 신규 클라이언트 온보딩 폼
- [ ] 클라이언트별 KPI 입력·표시 (현재는 메타만)
- [ ] Roadmap 마일스톤 표시
- [ ] 담당자 변경·이관 액션
- [ ] 클라이언트 ↔ 멤버 ↔ Skills 매핑 시각화

---

### 4.6 Client 상세 (`/clients/[id]`)
- 5탭 구조 재사용 + ClientMetaCard 헤더 슬롯
- 현재는 Plugin 상세와 동일 패턴

---

### 4.7 Skills (`/skills`, `/skills/[id]`)

**현재**
- 태그 필터링 (리서치/콘텐츠/이메일/번역/미팅 등)
- 상세는 Plugin 상세 5탭 재사용

**다음 빌드**
- [ ] Skill 추천 (사용자 역할 기반)
- [ ] Skill 사용 빈도 ranking 시각화

---

### 4.8 Agents (`/agents`)
- 현재 완전한 placeholder ("다음 단계에서 지원")
- **다음 빌드**: Phase 2 외 — 우선순위 마지막

---

### 4.9 Teams (`/teams`)

**현재**
- 4개 팀 카드 (BD / Marketing / Dev Growth / Internal)
- 멤버 수 + 채택 플러그인 수 표시
- 하단 "팀 구조 관리는 다음 단계" 안내 명시

**다음 빌드**
- [ ] 팀별 KPI 매핑 (회사 목표의 정량 지표 → 각 팀 분배)
- [ ] 팀별 활용 점수 추세

---

### 4.10 Members (`/members`)

**현재**
- 테이블: 이름·팀·역할·이번 주 사용·아바타
- 담당 프로젝트 매핑 표시

**다음 빌드**
- [ ] 멤버별 상세 페이지 (개인 활용 이력)
- [ ] 페어링 관계 시각화 (선임 ↔ 학습자) — Cho 글의 "페어링 모델" 반영용

---

## 5. Admin 모드 통합 요구사항

### 5.1 현재 동작
- Sidebar/Header에서 토글
- 켜지면:
  - Overview에 AdminWidgets 섹션 노출
  - Plugin/Skill/Client Content 탭에 "편집" 버튼 노출 (현재 toast만)
  - Proposal 상세에 "반영" 버튼 노출
  - Discussion 상세에 "이 의견을 반영한 제안 만들기" 강조
- React Context 전역 관리, localStorage 미사용

### 5.2 다음 빌드
- [ ] 토글 → 실제 권한 분리 (인증 도입 시)
- [ ] Admin이 누구인지 명시적 정의 (현재는 누구나 토글 가능)

---

## 6. 데이터 모델 (개념 수준)

### 6.1 현재 mock 데이터 규모
- Plugins 12개 (Common 1 / Skills 8 / Clients 3)
- Members 5명 (파일럿 5명)
- Discussions 28개
- Proposals 8개 (상태 다양)
- Combos 4개

### 6.2 핵심 관계
```
Plugin ─┬─ has many ─ Discussion ─┬─ resolved by ─ Proposal
        │                          │
        ├─ has many ─ Proposal ────┴─ when merged → Change
        │
        └─ has many ─ Change

Client (= Plugin of kind 'client')
  └─ has one ── ClientMeta (owner, onboardedAt, linkedSkillIds, tagline)

Member ─── belongs to ─── Team
       └── owns many ──── ClientMeta / Skill (간접)
```

### 6.3 다음 빌드용 신규 엔티티 후보
- [ ] **Notification** — Discussion 답변 알림, Proposal 상태 변경
- [ ] **Pairing** — 파일럿 ↔ 비파일럿 페어링 관계 (Cho 글 반영 시)
- [ ] **KPIRecord** — 팀별 정량 목표 추적용
- [ ] **AgentIntegration** — 외부 AI 에이전트(Claude/ChatGPT) 연동

---

## 7. 비기능 요구사항

### 7.1 언어·용어
- UI 텍스트: 한국어
- 식별자(파일·변수·Plugin id): 영어
- 개발자 용어 직접 노출 금지 (위 매핑 표 준수)

### 7.2 디자인
- 사이드바 240px 고정 + 상단 헤더 + 메인
- 카드·탭·배지 중심, 여백 넉넉히
- shadcn 기본 팔레트 + 강조색 1개 (파란 계열)
- 아이콘: lucide-react
- 차트: recharts (도넛 + 막대)

### 7.3 반응형
- 데스크톱 우선
- 모바일은 사이드바 접힘 (sidebar-context로 처리됨)

### 7.4 성능·접근성·국제화
- (Phase 2에서 정의)
- 다국어: 현재 한국어 단일 → 영어 클라이언트 자료 표시 시 검토 필요

---

## 8. 시연·수용 기준

### 8.1 핵심 시연 시나리오 (1분 데모)
1. Overview 진입 → 이번 주 축적 수치 노출
2. QuickStart "최근 조합" → Combo 복사
3. Plugin 상세 → Discussions 탭 → resolved Discussion 클릭
4. "이 의견은 Proposal #002로 반영됨" 배지 확인
5. Proposal #002 → 반영 → Change 이력 #c-008 확인
6. **루프 1사이클 완결 시연** (d-004 → p-002 → c-008)

### 8.2 수용 기준 (스켈레톤)
- [x] 모든 UI 텍스트 한국어
- [x] 식별자 영어 유지
- [x] 비개발자 친화 용어
- [x] Admin 모드 토글 동작
- [x] 축적 루프 1사이클 완결
- [x] 모든 페이지 이동 끊김 없음
- [x] 더미 데이터로 "운영 중" 느낌

---

## 9. 범위 외 (Out of Scope, 명시적으로 안 함)

**현재 단계**
- 실제 GitHub API 연동
- 인증·로그인
- 다크 모드
- 모바일 전용 UX 최적화
- 실시간 협업(동시 편집 등)

**향후 검토 후 결정**
- 외부 사용자(클라이언트 본인) 접근
- 결제·과금
- 다국어 (영어 UI)

---

## 10. 다음 빌드(Phase 2) 우선순위 후보 — PM 결정 필요 ⚠

다음 항목들은 *모두 후보*이며, 6월말 Phase 3 타임라인을 고려해 **3~4개로 압축**해야 함.

| # | 항목 | 임팩트 | 난이도 | 비고 |
|---|---|---|---|---|
| A | Plugin Content 실제 편집·저장 | 높음 | 중 | 자체 저장 vs GitHub 연동 결정 선행 |
| B | Discussion → Proposal → Change 실 동작 | 높음 | 중 | 축적 루프의 "진짜" 완결 |
| C | Clients 페이지 KPI·Roadmap 입력 | 높음 | 중 | Client Hub의 다음 단계 |
| D | NewClient 온보딩 플로우 | 중 | 낮 | placeholder 해결 |
| E | 팀별 KPI 매핑 (회사 목표 → 팀별) | 높음 | 중 | "성과 지표" 측정 기반 |
| F | Overview Orphan 위젯 처리 결정 | 중 | 낮 | 활성화·삭제·이동 |
| G | 인증·권한 분리 | 중 | 높 | Phase 2 후반 또는 Phase 3 |
| H | 알림 (Discussion·Proposal) | 중 | 중 | Slack 연동 시 임팩트↑ |
| I | Agents 통합 (Claude/ChatGPT) | 매우 높 | 매우 높 | Phase 3 이후 가능성 |
| J | 페어링 관계 모델 (Cho 모델) | 높음 | 중 | 노하우 전이 측정용 |

---

## 11. 미해결 의사결정 (PM 결정 필요)

### 제품 차원
1. **저장소 전략**: 자체 DB vs GitHub repo vs 하이브리드
2. **인증 시점**: Phase 2 진입과 동시? 아니면 Phase 3?
3. **외부 AI 에이전트 연동 범위**: 복사·붙여넣기 모델 유지 vs 직접 호출
4. **Agents 페이지의 실제 정의**: 무엇을 "Agent"로 부를 것인가

### 운영 차원
5. **누구를 Admin으로 지정할 것인가**
6. **클라이언트(Ripple/Midnight/Squid) 본인이 일부 영역에 접근하는가**
7. **회사 KPI(제안서 50% 단축 등)와 본 제품 지표를 어떻게 연결할 것인가** ← 가장 중요

### 조직 차원 (제품 외이지만 영향 큼)
8. **파일럿 5명 → 전사 전이 메커니즘**: 도구 배포 vs 페어링 동행
9. **파일럿 팀의 자기 소멸 조건 정의** (KPI 달성 시 해체?)

---

## 부록 A. 용어집
(2.1, 2.2 표 참고)

## 부록 B. 라우트 맵
| 라우트 | 페이지 | 상태 |
|---|---|---|
| `/` | Overview | 구현 (4섹션) |
| `/plugins` | Plugins 리스트 | 구현 |
| `/plugins/[id]` | Plugin 상세 (5탭) | 구현 |
| `/proposals` | Proposals 리스트 | 구현 |
| `/proposals/[id]` | Proposal 상세 | 구현 (코멘트 미연결) |
| `/clients` | Client Hub | 구현 (NewClient placeholder) |
| `/clients/[id]` | Client 상세 | 구현 |
| `/skills` | Skills 리스트 | 구현 |
| `/skills/[id]` | Skill 상세 | 구현 |
| `/agents` | Agents | placeholder |
| `/teams` | Teams | 구현 (조회 전용) |
| `/members` | Members | 구현 |
