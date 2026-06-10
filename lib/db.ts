// 데이터 접근 계층 — Supabase 구현 + (환경변수 미설정 시) 로컬 데모용 in-memory fallback.
// Supabase 접근은 항상 서버에서만 일어난다 (service-role 키, 클라이언트 노출 금지).
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type ReservationStatus = "pending" | "confirmed" | "done" | "cancelled";

export interface Reservation {
  id: string;
  created_at: string;
  date: string; // YYYY-MM-DD
  time_slot: string; // '11:00' 등
  service: string;
  name: string;
  phone: string;
  memo: string | null;
  status: ReservationStatus;
}

export interface CreateReservationInput {
  date: string;
  time_slot: string;
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
  /** 해당 날짜에 점유된(취소 제외) 슬롯 목록 */
  takenSlots(date: string): Promise<string[]>;
  /** 해당 날짜에 차단(휴무)된 슬롯 목록 */
  blockedSlots(date: string): Promise<string[]>;
  createReservation(input: CreateReservationInput): Promise<CreateResult>;
  listReservations(filter: ListFilter): Promise<Reservation[]>;
  updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation | null>;
  setBlocked(date: string, slot: string, blocked: boolean): Promise<void>;
}

/* ============================ Supabase ============================ */

class SupabaseDb implements Database {
  private client: SupabaseClient;

  constructor(url: string, serviceKey: string) {
    this.client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  async takenSlots(date: string): Promise<string[]> {
    const { data, error } = await this.client
      .from("reservations")
      .select("time_slot")
      .eq("date", date)
      .neq("status", "cancelled");
    if (error) throw new Error(`takenSlots: ${error.message}`);
    return (data ?? []).map((r) => r.time_slot);
  }

  async blockedSlots(date: string): Promise<string[]> {
    const { data, error } = await this.client
      .from("blocked_slots")
      .select("time_slot")
      .eq("date", date);
    if (error) throw new Error(`blockedSlots: ${error.message}`);
    return (data ?? []).map((r) => r.time_slot);
  }

  async createReservation(input: CreateReservationInput): Promise<CreateResult> {
    // 차단 슬롯 확인 후 insert — 이중 예약은 partial unique index가 최종 방어
    const blocked = await this.blockedSlots(input.date);
    if (blocked.includes(input.time_slot)) return { ok: false, reason: "taken" };

    const { data, error } = await this.client
      .from("reservations")
      .insert({
        date: input.date,
        time_slot: input.time_slot,
        service: input.service,
        name: input.name,
        phone: input.phone,
        memo: input.memo ?? null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return { ok: false, reason: "taken" };
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
  async takenSlots(date: string): Promise<string[]> {
    return memStore()
      .reservations.filter((r) => r.date === date && r.status !== "cancelled")
      .map((r) => r.time_slot);
  }

  async blockedSlots(date: string): Promise<string[]> {
    return memStore()
      .blocks.filter((b) => b.date === date)
      .map((b) => b.time_slot);
  }

  async createReservation(input: CreateReservationInput): Promise<CreateResult> {
    const store = memStore();
    const taken = await this.takenSlots(input.date);
    const blocked = await this.blockedSlots(input.date);
    if (taken.includes(input.time_slot) || blocked.includes(input.time_slot)) {
      return { ok: false, reason: "taken" };
    }
    const reservation: Reservation = {
      id: `mem-${store.seq++}`,
      created_at: new Date().toISOString(),
      date: input.date,
      time_slot: input.time_slot,
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
