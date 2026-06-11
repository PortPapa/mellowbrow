// 데이터 접근 계층 — Supabase 구현 + (환경변수 미설정 시) 로컬 데모용 in-memory fallback.
// Supabase 접근은 항상 서버에서만 일어난다 (service-role 키, 클라이언트 노출 금지).
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SLOT_VALUES, addDays, isClosedDay, slotHour } from "@/lib/slots";

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
  has_residue: boolean; // 기존 반영구 잔흔 여부 — true면 사진 상담 필요
  status: ReservationStatus;
}

/** 데스크 API 응답용 — returning은 DB 컬럼이 아니라 서버에서 계산해 붙이는 주석 필드 */
export type ReservationWithMeta = Reservation & { returning?: boolean };

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
  has_residue?: boolean;
}

export type CreateResult =
  | { ok: true; reservation: Reservation }
  | { ok: false; reason: "taken" };

export interface ListFilter {
  date?: string;
  status?: ReservationStatus;
  fromDate?: string;
  name?: string;
}

export interface GalleryItem {
  id: string;
  created_at: string;
  category: string;
  image_url: string; // 비포(기본) 이미지
  storage_path: string | null;
  after_image_url: string | null; // 애프터 이미지 — 있으면 호버 시 전환
  after_storage_path: string | null;
}

export interface FilePayload {
  fileName: string;
  contentType: string;
  data: ArrayBuffer;
}

export interface AddGalleryInput {
  category: string;
  before: FilePayload;
  after?: FilePayload;
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
  /** 예약 영구 삭제 — 취소(cancelled) 상태인 건만 삭제 (가드 내장). 삭제됐으면 true */
  deleteReservation(id: string): Promise<boolean>;
  setBlocked(date: string, slot: string, blocked: boolean): Promise<void>;
  /** 기간 전체 차단/해제 — 차단 시 정기 휴무일(월)은 건너뜀, 해제는 기간 내 차단 전부 제거 */
  setBlockedRange(from: string, to: string, blocked: boolean): Promise<void>;
  /** 갤러리 — 최신순 */
  listGallery(): Promise<GalleryItem[]>;
  addGalleryImage(input: AddGalleryInput): Promise<GalleryItem>;
  deleteGalleryImage(id: string): Promise<boolean>;
  /** 사이트 고정 이미지 (홈/시술 카드) — key → 커스텀 URL */
  getSiteImages(): Promise<Record<string, string>>;
  setSiteImage(key: string, input: FilePayload): Promise<string>;
  deleteSiteImage(key: string): Promise<boolean>;
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
        has_residue: input.has_residue ?? false,
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
    if (filter.name) q = q.eq("name", filter.name);
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

  async deleteReservation(id: string): Promise<boolean> {
    // status 조건을 쿼리에 포함 — 취소되지 않은 예약은 절대 지워지지 않음
    const { data, error } = await this.client
      .from("reservations")
      .delete()
      .eq("id", id)
      .eq("status", "cancelled")
      .select()
      .maybeSingle();
    if (error) throw new Error(`deleteReservation: ${error.message}`);
    return Boolean(data);
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

  async setBlockedRange(from: string, to: string, blocked: boolean): Promise<void> {
    if (blocked) {
      const rows: { date: string; time_slot: string }[] = [];
      for (let d = from; d <= to; d = addDays(d, 1)) {
        if (isClosedDay(d)) continue; // 월요일은 자동 휴무 — 행 불필요
        for (const slot of SLOT_VALUES) rows.push({ date: d, time_slot: slot });
      }
      if (rows.length === 0) return;
      const { error } = await this.client
        .from("blocked_slots")
        .upsert(rows, { onConflict: "date,time_slot", ignoreDuplicates: true });
      if (error) throw new Error(`setBlockedRange: ${error.message}`);
    } else {
      const { error } = await this.client
        .from("blocked_slots")
        .delete()
        .gte("date", from)
        .lte("date", to);
      if (error) throw new Error(`setBlockedRange: ${error.message}`);
    }
  }

  async listGallery(): Promise<GalleryItem[]> {
    const { data, error } = await this.client
      .from("gallery_items")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(60);
    if (error) throw new Error(`listGallery: ${error.message}`);
    return (data ?? []).map(normalizeGalleryRow);
  }

  private async uploadToStorage(file: FilePayload, prefix = ""): Promise<{ url: string; path: string }> {
    const ext = (file.fileName.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${prefix}${crypto.randomUUID()}.${ext || "jpg"}`;
    const { error } = await this.client.storage
      .from("gallery")
      .upload(path, file.data, { contentType: file.contentType });
    if (error) throw new Error(`storage upload: ${error.message}`);
    const { data: pub } = this.client.storage.from("gallery").getPublicUrl(path);
    return { url: pub.publicUrl, path };
  }

  async addGalleryImage(input: AddGalleryInput): Promise<GalleryItem> {
    const before = await this.uploadToStorage(input.before);
    let after: { url: string; path: string } | null = null;
    if (input.after) {
      try {
        after = await this.uploadToStorage(input.after);
      } catch (e) {
        await this.client.storage.from("gallery").remove([before.path]);
        throw e;
      }
    }

    const { data, error } = await this.client
      .from("gallery_items")
      .insert({
        category: input.category,
        image_url: before.url,
        storage_path: before.path,
        after_image_url: after?.url ?? null,
        after_storage_path: after?.path ?? null,
      })
      .select()
      .single();
    if (error) {
      // 행 삽입 실패 시 고아 파일 정리
      const orphans = [before.path, ...(after ? [after.path] : [])];
      await this.client.storage.from("gallery").remove(orphans);
      throw new Error(`addGalleryImage: ${error.message}`);
    }
    return normalizeGalleryRow(data);
  }

  async deleteGalleryImage(id: string): Promise<boolean> {
    const { data, error } = await this.client
      .from("gallery_items")
      .delete()
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(`deleteGalleryImage: ${error.message}`);
    if (!data) return false;
    const paths = [data.storage_path, data.after_storage_path].filter(Boolean).map(String);
    if (paths.length) {
      await this.client.storage.from("gallery").remove(paths);
    }
    return true;
  }

  async getSiteImages(): Promise<Record<string, string>> {
    const { data, error } = await this.client.from("site_images").select("key, image_url");
    if (error) throw new Error(`getSiteImages: ${error.message}`);
    const map: Record<string, string> = {};
    for (const r of data ?? []) map[String(r.key)] = String(r.image_url);
    return map;
  }

  async setSiteImage(key: string, input: FilePayload): Promise<string> {
    // 기존 커스텀 이미지의 스토리지 경로 (교체 후 삭제)
    const { data: prev } = await this.client
      .from("site_images")
      .select("storage_path")
      .eq("key", key)
      .maybeSingle();

    const uploaded = await this.uploadToStorage(input, "site/");
    const { error } = await this.client
      .from("site_images")
      .upsert({ key, image_url: uploaded.url, storage_path: uploaded.path }, { onConflict: "key" });
    if (error) {
      await this.client.storage.from("gallery").remove([uploaded.path]);
      throw new Error(`setSiteImage: ${error.message}`);
    }
    if (prev?.storage_path) {
      await this.client.storage.from("gallery").remove([String(prev.storage_path)]);
    }
    return uploaded.url;
  }

  async deleteSiteImage(key: string): Promise<boolean> {
    const { data, error } = await this.client
      .from("site_images")
      .delete()
      .eq("key", key)
      .select()
      .maybeSingle();
    if (error) throw new Error(`deleteSiteImage: ${error.message}`);
    if (!data) return false;
    if (data.storage_path) {
      await this.client.storage.from("gallery").remove([String(data.storage_path)]);
    }
    return true;
  }
}

function normalizeGalleryRow(row: Record<string, unknown>): GalleryItem {
  return {
    id: String(row.id),
    created_at: String(row.created_at),
    category: String(row.category),
    image_url: String(row.image_url),
    storage_path: row.storage_path == null ? null : String(row.storage_path),
    after_image_url: row.after_image_url == null ? null : String(row.after_image_url),
    after_storage_path: row.after_storage_path == null ? null : String(row.after_storage_path),
  };
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
    has_residue: Boolean(row.has_residue),
    status: row.status as ReservationStatus,
  };
}

/* ====================== In-memory (로컬 데모용) ====================== */

interface MemoryStore {
  reservations: Reservation[];
  blocks: { date: string; time_slot: string }[];
  gallery: GalleryItem[];
  siteImages: Record<string, string>;
  seq: number;
}

function memStore(): MemoryStore {
  const g = globalThis as unknown as { __mb_mem?: MemoryStore };
  if (!g.__mb_mem) {
    g.__mb_mem = { reservations: [], blocks: [], gallery: [], siteImages: {}, seq: 1 };
  }
  if (!g.__mb_mem.gallery) g.__mb_mem.gallery = [];
  if (!g.__mb_mem.siteImages) g.__mb_mem.siteImages = {};
  return g.__mb_mem;
}

function toDataUrl(contentType: string, data: ArrayBuffer): string {
  const bytes = new Uint8Array(data);
  let bin = "";
  const CHUNK = 8192;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return `data:${contentType};base64,${btoa(bin)}`;
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
      has_residue: input.has_residue ?? false,
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
          (!filter.fromDate || r.date >= filter.fromDate) &&
          (!filter.name || r.name === filter.name),
      )
      .sort((a, b) => (a.date + a.time_slot).localeCompare(b.date + b.time_slot));
  }

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation | null> {
    const r = memStore().reservations.find((x) => x.id === id);
    if (!r) return null;
    r.status = status;
    return r;
  }

  async deleteReservation(id: string): Promise<boolean> {
    const store = memStore();
    const idx = store.reservations.findIndex((r) => r.id === id && r.status === "cancelled");
    if (idx === -1) return false;
    store.reservations.splice(idx, 1);
    return true;
  }

  async setBlocked(date: string, slot: string, blocked: boolean): Promise<void> {
    const store = memStore();
    store.blocks = store.blocks.filter((b) => !(b.date === date && b.time_slot === slot));
    if (blocked) store.blocks.push({ date, time_slot: slot });
  }

  async setBlockedRange(from: string, to: string, blocked: boolean): Promise<void> {
    const store = memStore();
    store.blocks = store.blocks.filter((b) => b.date < from || b.date > to);
    if (blocked) {
      for (let d = from; d <= to; d = addDays(d, 1)) {
        if (isClosedDay(d)) continue;
        for (const slot of SLOT_VALUES) store.blocks.push({ date: d, time_slot: slot });
      }
    }
  }

  async listGallery(): Promise<GalleryItem[]> {
    return [...memStore().gallery].reverse().slice(0, 60);
  }

  async addGalleryImage(input: AddGalleryInput): Promise<GalleryItem> {
    // 메모리 모드: data URL로 저장 (로컬 데모 전용)
    const item: GalleryItem = {
      id: `mem-g${memStore().seq++}`,
      created_at: new Date().toISOString(),
      category: input.category,
      image_url: toDataUrl(input.before.contentType, input.before.data),
      storage_path: null,
      after_image_url: input.after ? toDataUrl(input.after.contentType, input.after.data) : null,
      after_storage_path: null,
    };
    memStore().gallery.push(item);
    return item;
  }

  async deleteGalleryImage(id: string): Promise<boolean> {
    const store = memStore();
    const before = store.gallery.length;
    store.gallery = store.gallery.filter((g) => g.id !== id);
    return store.gallery.length < before;
  }

  async getSiteImages(): Promise<Record<string, string>> {
    return { ...memStore().siteImages };
  }

  async setSiteImage(key: string, input: FilePayload): Promise<string> {
    const url = toDataUrl(input.contentType, input.data);
    memStore().siteImages[key] = url;
    return url;
  }

  async deleteSiteImage(key: string): Promise<boolean> {
    const store = memStore();
    if (!(key in store.siteImages)) return false;
    delete store.siteImages[key];
    return true;
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
