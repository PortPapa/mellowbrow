# mellowbrow · 멜로브로우

눈썹 반영구 스튜디오 **멜로브로우**의 공식 홈페이지 + 실시간 슬롯 예약시스템.

- **스택**: Next.js 15 (App Router, TypeScript) · Supabase (Postgres) · Cloudflare Workers (OpenNext)
- **디자인**: claude.ai/design 핸드오프 번들 (`design-system/` — 참고용 원본 보관)

## 화면 구성

| 경로 | 내용 |
|---|---|
| `/` | 홈 — 히어로, 철학, 시그니처 메뉴, 후기, CTA |
| `/services` | 시술 안내 6종 + 가격 + FAQ |
| `/gallery` | 전후 갤러리 (카테고리 필터) |
| `/booking` | **예약 신청** — 날짜 선택 시 실시간으로 마감된 시간대 비활성화 |
| `/desk` | **관리자 데스크** (비밀번호 보호) — 예약 확인/확정/취소, 날짜별 휴무(슬롯 차단) |

> 관리자 경로를 바꾸려면 `app/desk` 폴더명과 [lib/constants.ts](lib/constants.ts)의 `DESK_PATH`, [middleware.ts](middleware.ts)의 `matcher`를 함께 수정하세요.

## 예약시스템 동작

1. 고객이 날짜를 고르면 `GET /api/availability?date=`로 슬롯별(11/13/15/17/19시) 가능 여부 조회
2. 이미 예약됐거나(취소 제외) 휴무로 차단된 슬롯은 "마감" 표시
3. 신청 시 서버가 재검증 후 저장 — DB의 partial unique index가 동시 신청 경쟁까지 차단 (409 응답)
4. 신청 상태는 `대기` → 사장님이 데스크에서 `확정`/`완료`/`취소` 처리. 취소하면 슬롯이 다시 열림

## 로컬 개발

```bash
npm install
npm run dev
```

- 환경변수 없이도 동작합니다 (in-memory 저장소, 서버 재시작 시 초기화 — 데모 전용)
- 데스크 기본 비밀번호: `mellow` (운영에서는 반드시 `ADMIN_PASSWORD` 설정)
- 실제 DB 연동: `.env.example`을 `.env.local`로 복사 후 Supabase 값 입력

## Supabase 설정 (1회)

1. [supabase.com](https://supabase.com)에서 새 프로젝트 생성
2. **SQL Editor**에서 [supabase/schema.sql](supabase/schema.sql) 전체 실행
3. **Project Settings > API**에서 `URL`과 `service_role` 키 복사 → 환경변수로 설정

## Cloudflare 배포 (GitHub 연동)

이 저장소는 [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare)로 Cloudflare Workers에 배포되도록 구성되어 있습니다.

1. GitHub에 저장소 푸시
2. Cloudflare 대시보드 → **Workers & Pages > Create > Workers > Import a repository**
3. 빌드 설정:
   - **Build command**: `npx opennextjs-cloudflare build`
   - **Deploy command**: `npx opennextjs-cloudflare deploy`
4. **Settings > Variables and Secrets**에 환경변수 등록:
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (Secret)
   - `ADMIN_PASSWORD`, `AUTH_SECRET` (Secret)
5. 이후 `main` 브랜치에 푸시할 때마다 자동 배포

로컬에서 직접 배포하려면: `npm run deploy` (wrangler 로그인 필요)

> ⚠️ **Windows 참고**: OpenNext 어댑터는 Windows에서 불안정합니다(공식적으로 WSL 권장).
> 로컬에서 `npm run preview`/`deploy`가 실패하면 WSL을 사용하세요.
> **GitHub → Cloudflare 자동 배포는 Linux CI에서 빌드되므로 영향이 없습니다.**

## 오픈 전 교체할 것 (디자인 번들의 플레이스홀더)

- [ ] 사진 — 현재 웜 그라데이션 placeholder (`components/site/Photo.tsx`, `ServiceCard` `image` prop으로 교체)
- [ ] 로고 — 현재 타이포 워드마크 (`components/ui/Logo.tsx`)
- [ ] 시술 메뉴/가격/소요시간 — 예시 값 (`app/(site)/services/page.tsx`, 홈, `lib/slots.ts`의 `SERVICES`)
- [ ] 위치/영업시간/연락처 — 예시 값 (Footer, 예약 페이지 사이드바)
- [ ] 예약 시간대 — 현재 11/13/15/17/19시 (`lib/slots.ts`의 `SLOTS`)
- [ ] 후기 3건 — 예시 문구 (`app/(site)/page.tsx`)
