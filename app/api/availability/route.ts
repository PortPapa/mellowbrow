import { NextRequest, NextResponse } from "next/server";
import { getDb, spansOverlap, type Span } from "@/lib/db";
import {
  SLOT_HOURS,
  hourLabel,
  isBookableDate,
  isClosedDay,
  isSlotInPast,
  isValidDateStr,
  slotHour,
} from "@/lib/slots";

/** 시간 h(1시간)가 활성 예약/차단에 점유되어 있는지 */
function hourTaken(h: number, spans: Span[], blocked: string[]): boolean {
  return (
    spans.some((s) => spansOverlap(h, 1, slotHour(s.time_slot), s.duration_hours)) ||
    blocked.some((b) => slotHour(b) === h)
  );
}

export async function GET(req: NextRequest) {
  const month = req.nextUrl.searchParams.get("month");
  if (month) return monthAvailability(month);

  const date = req.nextUrl.searchParams.get("date") ?? "";
  if (!isValidDateStr(date)) {
    return NextResponse.json({ error: "올바른 날짜가 아니에요." }, { status: 400 });
  }
  if (!isBookableDate(date) || isClosedDay(date)) {
    // 과거/범위 밖/휴무일은 전부 마감 처리로 응답
    return NextResponse.json({
      date,
      closed: isClosedDay(date),
      slots: SLOT_HOURS.map((h) => ({ value: `${h}:00`, label: hourLabel(h), available: false })),
    });
  }

  try {
    const db = getDb();
    const [spans, blocked] = await Promise.all([db.activeSpans(date), db.blockedSlots(date)]);
    // 1시간 기준 가용성 — 시술별 소요시간 적합 여부는 클라이언트(모달)와 POST에서 추가 검증
    const slots = SLOT_HOURS.map((h) => ({
      value: `${h}:00`,
      label: hourLabel(h),
      available: !hourTaken(h, spans, blocked) && !isSlotInPast(date, `${h}:00`),
    }));
    return NextResponse.json({ date, closed: false, slots });
  } catch (e) {
    console.error("[availability]", e);
    return NextResponse.json(
      { error: "잠시 후 다시 시도해 주세요.", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}

/** 월 단위 가용성 — 캘린더용. 일자별 남은 시작 시간 수(1시간 기준)를 반환한다. */
async function monthAvailability(month: string) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return NextResponse.json({ error: "올바른 월이 아니에요." }, { status: 400 });
  }
  const [y, m] = month.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const first = `${month}-01`;
  const last = `${month}-${String(daysInMonth).padStart(2, "0")}`;

  try {
    const db = getDb();
    const [spansByDate, blockedByDate] = await Promise.all([
      db.activeSpansInRange(first, last),
      db.blockedSlotsInRange(first, last),
    ]);
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = `${month}-${String(d).padStart(2, "0")}`;
      const closed = isClosedDay(date);
      let available = 0;
      if (isBookableDate(date) && !closed) {
        const spans = spansByDate[date] ?? [];
        const blocked = blockedByDate[date] ?? [];
        available = SLOT_HOURS.filter(
          (h) => !hourTaken(h, spans, blocked) && !isSlotInPast(date, `${h}:00`),
        ).length;
      }
      days.push({ date, available, total: SLOT_HOURS.length, closed });
    }
    return NextResponse.json({ month, days });
  } catch (e) {
    console.error("[availability:month]", e);
    return NextResponse.json(
      { error: "잠시 후 다시 시도해 주세요.", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
