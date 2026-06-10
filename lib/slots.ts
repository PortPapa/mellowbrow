// 예약 슬롯 정의 + KST 날짜 유틸 (서버/클라이언트 공용)

export const SLOTS = [
  { value: "11:00", label: "오전 11:00" },
  { value: "13:00", label: "오후 1:00" },
  { value: "15:00", label: "오후 3:00" },
  { value: "17:00", label: "오후 5:00" },
  { value: "19:00", label: "오후 7:00" },
] as const;

export const SLOT_VALUES: string[] = SLOTS.map((s) => s.value);

export function slotLabel(value: string): string {
  return SLOTS.find((s) => s.value === value)?.label ?? value;
}

export const SERVICES = [
  "자연눈썹",
  "콤보눈썹",
  "수지눈썹",
  "눈썹 추가 리터치",
  "아이라인",
  "입술 틴트립",
  "SMP 두피문신",
  "미인점",
  "블랙틴트 케라틴펌",
] as const;

/** 오늘부터 며칠 뒤까지 예약을 받을지 */
export const MAX_DAYS_AHEAD = 60;

/** 현재 KST 기준 { date: 'YYYY-MM-DD', minutes: 자정 이후 경과 분 } */
export function kstNow(): { date: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  // hour12:false 환경에 따라 24시가 나올 수 있어 보정
  const hour = Number(get("hour")) % 24;
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: hour * 60 + Number(get("minute")),
  };
}

export function todayKST(): string {
  return kstNow().date;
}

/** 'YYYY-MM-DD' + n일 (UTC 산술이라 TZ 무관) */
export function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return t.toISOString().slice(0, 10);
}

export function isValidDateStr(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

/** 예약 가능 날짜 범위인지 (오늘 ~ 오늘+MAX_DAYS_AHEAD, KST) */
export function isBookableDate(dateStr: string): boolean {
  if (!isValidDateStr(dateStr)) return false;
  const today = todayKST();
  return dateStr >= today && dateStr <= addDays(today, MAX_DAYS_AHEAD);
}

/** 고정 휴무일 — 매주 월요일 (인스타그램 공지 기준) */
export function isClosedDay(dateStr: string): boolean {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() === 1;
}

/** 당일 예약일 때 이미 지난 시간대인지 */
export function isSlotInPast(dateStr: string, slot: string): boolean {
  const now = kstNow();
  if (dateStr !== now.date) return false;
  const [h, m] = slot.split(":").map(Number);
  return h * 60 + m <= now.minutes;
}
