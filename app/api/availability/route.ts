import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { SLOTS, isBookableDate, isClosedDay, isSlotInPast, isValidDateStr } from "@/lib/slots";

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
      slots: SLOTS.map((s) => ({ value: s.value, label: s.label, available: false })),
    });
  }

  try {
    const db = getDb();
    const [taken, blocked] = await Promise.all([db.takenSlots(date), db.blockedSlots(date)]);
    const slots = SLOTS.map((s) => ({
      value: s.value,
      label: s.label,
      available:
        !taken.includes(s.value) && !blocked.includes(s.value) && !isSlotInPast(date, s.value),
    }));
    return NextResponse.json({ date, slots });
  } catch (e) {
    console.error("[availability]", e);
    return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
}

/** 월 단위 가용성 — 캘린더용. 일자별 남은 슬롯 수를 반환한다. */
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
    const [taken, blocked] = await Promise.all([
      db.takenSlotsInRange(first, last),
      db.blockedSlotsInRange(first, last),
    ]);
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = `${month}-${String(d).padStart(2, "0")}`;
      const closed = isClosedDay(date);
      let available = 0;
      if (isBookableDate(date) && !closed) {
        const t = taken[date] ?? [];
        const b = blocked[date] ?? [];
        available = SLOTS.filter(
          (s) => !t.includes(s.value) && !b.includes(s.value) && !isSlotInPast(date, s.value),
        ).length;
      }
      days.push({ date, available, total: SLOTS.length, closed });
    }
    return NextResponse.json({ month, days });
  } catch (e) {
    console.error("[availability:month]", e);
    return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
}
