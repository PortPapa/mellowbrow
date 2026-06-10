-- =====================================================================
-- mellowbrow 예약시스템 스키마
-- Supabase 대시보드 > SQL Editor 에서 이 파일 전체를 1회 실행하세요.
-- =====================================================================

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  date date not null,
  time_slot text not null,            -- '11:00' | '13:00' | '15:00' | '17:00' | '19:00'
  service text not null,
  name text not null,
  phone text not null,
  memo text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'done', 'cancelled'))
);

-- 이중 예약 방지: 취소되지 않은 예약은 (날짜, 슬롯) 조합이 유일해야 함
create unique index if not exists uniq_active_slot
  on reservations(date, time_slot)
  where status <> 'cancelled';

create index if not exists idx_reservations_date on reservations(date);
create index if not exists idx_reservations_status on reservations(status);

create table if not exists blocked_slots (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  date date not null,
  time_slot text not null,            -- 슬롯 단위 차단. 종일 휴무 = 5개 슬롯 모두 차단
  unique(date, time_slot)
);

-- RLS: 기본 거부. 서버(service-role 키)만 접근하므로 공개 정책 없음.
alter table reservations enable row level security;
alter table blocked_slots enable row level security;
