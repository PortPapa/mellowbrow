// 데이터 접근 계층 — Supabase 구현 + (환경변수 미설정 시) 로컬 데모용 in-memory fallback.
// Supabase 접근은 항상 서버에서만 일어난다 (service-role 키, 클라이언트 노출 금지).
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { slotHour } from "@/lib/slots";

export type ReservationStatus = "pending" | "confirmed" | "done" | "cancelled";

export interface Reservation {
  id: string;
  created_at: string;
  date: string; // YYYY-MM-DD
  time_slot: string; // 'HH:00' 시작 시간
  duration_hours: number; // 점유 시간 수 — [start, start+D)
  service: string;
  name: string;
  phone: string;
  memo: string | null;
  status: ReservationStatus;
}

/** 활성 예약의 점유 구간 */
export interface Span {
  time_slot: string;
  duration_hours: number;
}

export interface CreateReservationInput {
  date: string;
  time_slot: string;
  duration_hours: number;
  service: string;
  name: string;
  phone: string;
  memo?: string;
}

export type CreateResult =
  | { ok: true; reservation: Reservation }
  | { ok: false; reason: "taken" };

export interface ListFilter {
  date?: string;
  status?: ReservationStatus;
  fromDate?: string;
}

export interface Database {
  /** 해당 날짜의 활성(취소 제외) 예약 점유 구간 목록 */
  activeSpans(date: string): Promise<Span[]>;
  /** 해당 날짜에 차단(휴무)된 슬롯 목록 */
  blockedSlots(date: string): Promise<string[]>;
  /** 날짜 범위의 활성 점유 구간 — { 'YYYY-MM-DD': Span[] } */
  activeSpansInRange(from: string, to: string): Promise<Record<string, Span[]>>;
  /** 날짜 범위의 차단 슬롯 — { 'YYYY-MM-DD': ['11:00', ...] } */
  blockedSlotsInRange(from: string, to: string): Promise<Record<string, string[]>>;
  createReservation(input: CreateReservationInput): Promise<CreateResult>;
  listReservations(filter: ListFilter): Promise<Reservation[]>;
  updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation | null>;
  setBlocked(date: string, slot: string, blocked: boolean): Promise<void>;
}

/** 두 점유 구간 [aStart, aStart+aDur) / [bStart, bStart+bDur) 겹침 여부 */
export function spansOverlap(aStart: number, aDur: number, bStart: number, bDur: number): boolean {
  return aStart < bStart + bDur && bStart < aStart + aDur;
}

/* ============================ Supabase ============================ */

class SupabaseDb implements Database {
  private client: SupabaseClient;

  constructor(url: string, serviceKey: string) {
    this.client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  async activeSpans(date: string): Promise<Span[]> {
    const { data, error } = await this.client
      .from("reservations")
      .select("time_slot, duration_hours")
      .eq("date", date)
      .neq("status", "cancelled");
    if (error) throw new Error(`activeSpans: ${error.message}`);
    return (data ?? []).map((r) => ({
      time_slot: String(r.time_slot),
      duration_hours: Number(r.duration_hours),
    }));
  }

  async blockedSlots(date: string): Promise<string[]> {
    const { data, error } = await this.client
      .from("blocked_slots")
      .select("time_slot")
      .eq("date", date);
    if (error) throw new Error(`blockedSlots: ${error.message}`);
    return (data ?? []).map((r) => r.time_slot);
  }

  async activeSpansInRange(from: string, to: string): Promise<Record<string, Span[]>> {
    const { data, error } = await this.client
      .from("reservations")
      .select("date, time_slot, duration_hours")
      .gte("date", from)
      .lte("date", to)
      .neq("status", "cancelled");
    if (error) throw new Error(`activeSpansInRange: ${error.message}`);
    const map: Record<string, Span[]> = {};
    for (const r of data ?? []) {
      const d = String(r.date).slice(0, 10);
      (map[d] ??= []).push({
        time_slot: String(r.time_slot),
        duration_hours: Number(r.duration_hours),
      });
    }
    return map;
  }

  async blockedSlotsInRange(from: string, to: string): Promise<Record<string, string[]>> {
    const { data, error } = await this.client
      .from("blocked_slots")
      .select("date, time_slot")
      .gte("date", from)
      .lte("date", to);
    if (error) throw new Error(`blockedSlotsInRange: ${error.message}`);
    const map: Record<string, string[]> = {};
    for (const r of data ?? []) {
      const d = String(r.date).slice(0, 10);
      (map[d] ??= []).push(String(r.time_slot));
    }
    return map;
  }

  async createReservation(input: CreateReservationInput): Promise<CreateResult> {
    // 차단 슬롯이 점유 구간에 걸리는지 확인 — 겹침 자체는 exclusion constraint가 최종 방어
    const blocked = await this.blockedSlots(input.date);
    const start = slotHour(input.time_slot);
    if (blocked.some((b) => spansOverlap(start, input.duration_hours, slotHour(b), 1))) {
      return { ok: false, reason: "taken" };
    }

    const { data, error } = await this.client
      .from("reservations")
      .insert({
        date: input.date,
        time_slot: input.time_slot,
        duration_hours: input.duration_hours,
        service: input.service,
        name: input.name,
        phone: input.phone,
        memo: input.memo ?? null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      // 23505 = unique violation, 23P01 = exclusion violation (점유 구간 겹침)
      if (error.code === "23505" || error.code === "23P01") {
        return { ok: false, reason: "taken" };
      }
      throw new Error(`createReservation: ${error.message}`);
    }
    return { ok: true, reservation: normalizeRow(data) };
  }

  async listReservations(filter: ListFilter): Promise<Reservation[]> {
    let q = this.client.from("reservations").select("*");
    if (filter.date) q = q.eq("date", filter.date);
    if (filter.status) q = q.eq("status", filter.status);
    if (filter.fromDate) q = q.gte("date", filter.fromDate);
    const { data, error } = await q
      .order("date", { ascending: true })
      .order("time_slot", { ascending: true });
    if (error) throw new Error(`listReservations: ${error.message}`);
    return (data ?? []).map(normalizeRow);
  }

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation | null> {
    const { data, error } = await this.client
      .from("reservations")
      .update({ status })
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(`updateReservationStatus: ${error.message}`);
    return data ? normalizeRow(data) : null;
  }

  async setBlocked(date: string, slot: string, blocked: boolean): Promise<void> {
    if (blocked) {
      const { error } = await this.client
        .from("blocked_slots")
        .upsert({ date, time_slot: slot }, { onConflict: "date,time_slot", ignoreDuplicates: true });
      if (error) throw new Error(`setBlocked: ${error.message}`);
    } else {
      const { error } = await this.client
        .from("blocked_slots")
        .delete()
        .eq("date", date)
        .eq("time_slot", slot);
      if (error) throw new Error(`setBlocked: ${error.message}`);
    }
  }
}

// Supabase date 컬럼은 'YYYY-MM-DD' 문자열로 오지만 방어적으로 자른다
function normalizeRow(row: Record<string, unknown>): Reservation {
  return {
    id: String(row.id),
    created_at: String(row.created_at),
    date: String(row.date).slice(0, 10),
    time_slot: String(row.time_slot),
    duration_hours: Number(row.duration_hours ?? 2),
    service: String(row.service),
    name: String(row.name),
    phone: String(row.phone),
    memo: row.memo == null ? null : String(row.memo),
    status: row.status as ReservationStatus,
  };
}

/* ====================== In-memory (로컬 데모용) ====================== */

interface MemoryStore {
  reservations: Reservation[];
  blocks: { date: string; time_slot: string }[];
  seq: number;
}

function memStore(): MemoryStore {
  const g = globalThis as unknown as { __mb_mem?: MemoryStore };
  if (!g.__mb_mem) g.__mb_mem = { reservations: [], blocks: [], seq: 1 };
  return g.__mb_mem;
}

class MemoryDb implements Database {
  async activeSpans(date: string): Promise<Span[]> {
    return memStore()
      .reservations.filter((r) => r.date === date && r.status !== "cancelled")
      .map((r) => ({ time_slot: r.time_slot, duration_hours: r.duration_hours }));
  }

  async blockedSlots(date: string): Promise<string[]> {
    return memStore()
      .blocks.filter((b) => b.date === date)
      .map((b) => b.time_slot);
  }

  async activeSpansInRange(from: string, to: string): Promise<Record<string, Span[]>> {
    const map: Record<string, Span[]> = {};
    for (const r of memStore().reservations) {
      if (r.date >= from && r.date <= to && r.status !== "cancelled") {
        (map[r.date] ??= []).push({ time_slot: r.time_slot, duration_hours: r.duration_hours });
      }
    }
    return map;
  }

  async blockedSlotsInRange(from: string, to: string): Promise<Record<string, string[]>> {
    const map: Record<string, string[]> = {};
    for (const b of memStore().blocks) {
      if (b.date >= from && b.date <= to) {
        (map[b.date] ??= []).push(b.time_slot);
      }
    }
    return map;
  }

  async createReservation(input: CreateReservationInput): Promise<CreateResult> {
    const store = memStore();
    const start = slotHour(input.time_slot);
    const spans = await this.activeSpans(input.date);
    const blocked = await this.blockedSlots(input.date);
    const conflict =
      spans.some((s) => spansOverlap(start, input.duration_hours, slotHour(s.time_slot), s.duration_hours)) ||
      blocked.some((b) => spansOverlap(start, input.duration_hours, slotHour(b), 1));
    if (conflict) return { ok: false, reason: "taken" };

    const reservation: Reservation = {
      id: `mem-${store.seq++}`,
      created_at: new Date().toISOString(),
      date: input.date,
      time_slot: input.time_slot,
      duration_hours: input.duration_hours,
      service: input.service,
      name: input.name,
      phone: input.phone,
      memo: input.memo ?? null,
      status: "pending",
    };
    store.reservations.push(reservation);
    return { ok: true, reservation };
  }

  async listReservations(filter: ListFilter): Promise<Reservation[]> {
    return memStore()
      .reservations.filter(
        (r) =>
          (!filter.date || r.date === filter.date) &&
          (!filter.status || r.status === filter.status) &&
          (!filter.fromDate || r.date >= filter.fromDate),
      )
      .sort((a, b) => (a.date + a.time_slot).localeCompare(b.date + b.time_slot));
  }

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation | null> {
    const r = memStore().reservations.find((x) => x.id === id);
    if (!r) return null;
    r.status = status;
    return r;
  }

  async setBlocked(date: string, slot: string, blocked: boolean): Promise<void> {
    const store = memStore();
    store.blocks = store.blocks.filter((b) => !(b.date === date && b.time_slot === slot));
    if (blocked) store.blocks.push({ date, time_slot: slot });
  }
}

/* ============================ Factory ============================ */

let warned = false;

export function getDb(): Database {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) return new SupabaseDb(url, key);
  if (!warned) {
    warned = true;
    console.warn(
      "[mellowbrow] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY가 없어 in-memory 저장소로 동작합니다. " +
        "서버 재시작 시 예약 데이터가 사라집니다 (로컬 데모 전용).",
    );
  }
  return new MemoryDb();
}
