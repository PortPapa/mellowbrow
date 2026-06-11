-- =====================================================================
-- mellowbrow 예약시스템 스키마 (v2 — 1시간 슬롯 + 시술별 소요시간)
-- Supabase 대시보드 > SQL Editor 에서 이 파일 전체를 1회 실행하세요.
--
-- ⚠️ v1 스키마로 만든 테이블이 이미 있다면 먼저 삭제 후 실행:
--    drop table if exists reservations; drop table if exists blocked_slots;
-- ⚠️ v2 테이블에 잔흔 컬럼만 추가하려면:
--    alter table reservations add column if not exists has_residue boolean not null default false;
-- =====================================================================

-- 점유 구간 겹침 방지(exclusion constraint)에 필요
create extension if not exists btree_gist;

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  date date not null,
  time_slot text not null,              -- 'HH:00' 시작 시간 (11:00 ~ 20:00)
  duration_hours int not null default 2 -- 점유 시간 수: [시작, 시작+duration) 연속 점유
    check (duration_hours between 1 and 6),
  slot_hour int generated always as ((split_part(time_slot, ':', 1))::int) stored,
  service text not null,
  name text not null,
  phone text not null,
  memo text,
  has_residue boolean not null default false, -- 기존 반영구 잔흔 여부 (true면 사진 상담 필요)
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'done', 'cancelled')),

  -- 이중 예약 방지의 최종 방어선: 취소되지 않은 예약끼리
  -- 같은 날짜에서 점유 구간 [slot_hour, slot_hour+duration_hours)가 겹칠 수 없음
  constraint no_overlap exclude using gist (
    date with =,
    int4range(slot_hour, slot_hour + duration_hours) with &&
  ) where (status <> 'cancelled')
);

create index if not exists idx_reservations_date on reservations(date);
create index if not exists idx_reservations_status on reservations(status);

create table if not exists blocked_slots (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  date date not null,
  time_slot text not null,              -- 시간 단위 차단 ('11:00' 등). 종일 휴무 = 전 시간 차단
  unique(date, time_slot)
);

-- 갤러리 (데스크에서 업로드하는 시술 사진)
create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  category text not null,               -- 자연눈썹 | 콤보눈썹 | 수지눈썹 | 입술 | 기타
  image_url text not null,              -- Storage 공개 URL
  storage_path text                     -- Storage 객체 경로 (삭제용)
);

-- 사이트 고정 이미지 (홈 히어로/스튜디오, 시술 카드 — 데스크에서 교체)
create table if not exists site_images (
  key text primary key,                 -- 'hero' | 'studio' | 'service:자연눈썹' ...
  image_url text not null,
  storage_path text,
  updated_at timestamptz not null default now()
);

-- 갤러리/사이트 이미지 저장용 공개 버킷
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- RLS: 기본 거부. 서버(service-role 키)만 접근하므로 공개 정책 없음.
alter table reservations enable row level security;
alter table blocked_slots enable row level security;
alter table gallery_items enable row level security;
alter table site_images enable row level security;
