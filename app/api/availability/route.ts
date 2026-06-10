import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { SLOTS, isBookableDate, isSlotInPast, isValidDateStr } from "@/lib/slots";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date") ?? "";
  if (!isValidDateStr(date)) {
    return NextResponse.json({ error: "올바른 날짜가 아니에요." }, { status: 400 });
  }
  if (!isBookableDate(date)) {
    // 과거/범위 밖 날짜는 전부 마감 처리로 응답
    return NextResponse.json({
      date,
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
