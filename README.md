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
| `/desk` | **관리자 데스크** (비밀번호 보호) — 예약 확인/확정/취소, 날짜별 휴무(슬롯 차단), **갤러리 사진 업로드/삭제** |

> 관리자 경로를 바꾸려면 `app/desk` 폴더명과 [lib/constants.ts](lib/constants.ts)의 `DESK_PATH`, [middleware.ts](middleware.ts)의 `matcher`를 함께 수정하세요.

## 예약시스템 동작

1. 고객이 캘린더에서 날짜 → 시간(매시 정각 **11:00~20:00**, 20시 예약 시 마감 이후까지 시술)을 고르면 모달에서 시술/연락처 입력
2. 예약은 **시술별 소요시간만큼 연속 시간을 점유** — 예: 13시 자연눈썹(2시간)이 잡히면 13·14시가 막히고, 12시에 2시간짜리 시술도 불가
3. 소요시간은 [lib/catalog.ts](lib/catalog.ts)의 `durationHours`에서 관리 (⚠️ 기본값은 추정 — 사장님 확인 필요)
4. 이미 예약됐거나(취소 제외) 휴무로 차단된 시간, 매주 월요일은 선택 불가
5. 서버 재검증 + DB **exclusion constraint**(점유 구간 겹침 금지)가 동시 신청 경쟁까지 차단 (409 응답)
6. 신청 상태는 `대기` → 사장님이 데스크에서 `확정`/`완료`/`취소` 처리. 취소하면 시간이 다시 열림

## 로컬 개발

```bash
npm install
npm run dev
```

- 환경변수 없이도 동작합니다 (in-memory 저장소, 서버 재시작 시 초기화 — 데모 전용)
- 데스크 기본 비밀번호: `mellow` (운영에서는 반드시 `ADMIN_PASSWORD` 설정)
- 실제 DB 연동: `.env.example`을 `.env.local`로 복사 후 Supabase 값 입력

## 갤러리 관리

- 데스크(`/desk/gallery`)에서 **비포(필수) + 애프터(선택)** 사진 업로드(분류 선택, 각 8MB 이하) → `/gallery`에 즉시 표시
- 애프터까지 올리면 갤러리에서 **마우스 호버(모바일은 탭) 시 비포→애프터로 부드럽게 전환**
- 업로드한 사진이 하나도 없으면 갤러리는 기본(더미) 이미지로 폴백
- 사진 파일은 Supabase Storage `gallery` 버킷에 저장 (schema.sql이 버킷까지 생성)

## 사이트 이미지 관리

- 데스크 맨 아래 "사이트 이미지"에서 **홈 히어로 / 스튜디오 사진 / 시술 카드 9장**을 교체할 수 있어요
- "변경"으로 새 사진 업로드, "기본값"으로 언제든 원래 이미지로 복원
- 슬롯 정의는 [lib/site-images.ts](lib/site-images.ts) (`SITE_IMAGE_SLOTS`), 저장은 `site_images` 테이블 + Storage `gallery` 버킷

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

## 오픈 전 교체/확인할 것

- [x] 시술 메뉴/가격 — 실제 가격표 반영 완료 (`app/(site)/services/page.tsx`, `lib/slots.ts`)
- [x] 로고 — 실제 로고(산세리프 "mellow brow")를 타이포로 재현 (`components/ui/Logo.tsx`; 이미지 파일 수령 시 교체 가능)
- [x] 위치/영업시간/연락처 — 인스타그램 공개 정보 반영 (천호역 도보 5분, 11:00–20:00, 월요일 휴무, 카카오 mellow415)
- [x] 휴무 — 매주 월요일은 예약 캘린더에서 자동 차단 (`lib/slots.ts`의 `isClosedDay`)
- [ ] 사진 — 현재 Pexels 무료 스톡 더미 (`public/photos/`). 실제 스튜디오 사진으로 같은 파일명으로 교체하면 끝
- [ ] 예약 시간대 — 현재 11/13/15/17/19시 (`lib/slots.ts`의 `SLOTS`)
- [ ] 후기 3건 + 히어로 통계(8년+/4.9/후기 320+) — 예시 문구 (`app/(site)/page.tsx`)
