import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { phoneDigits } from "@/lib/format";
import { isSlotInPast } from "@/lib/slots";

// 손님 예약 조회 — 성함 + 연락처가 모두 일치하는 다가오는 활성 예약만 반환.
// 민감 정보(요청사항·잔흔 여부)는 응답에 포함하지 않는다.
const schema = z.object({
  name: z.string().trim().min(1).max(40),
  phone: z.string().min(9).max(20),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청이에요." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "성함과 연락처를 확인해 주세요." }, { status: 400 });
  }
  const digits = phoneDigits(parsed.data.phone);
  if (digits.length < 9) {
    return NextResponse.json({ error: "성함과 연락처를 확인해 주세요." }, { status: 400 });
  }

  try {
    const rows = await getDb().listReservations({ name: parsed.data.name });
    const mine = rows.filter(
      (r) =>
        phoneDigits(r.phone) === digits &&
        (r.status === "pending" || r.status === "confirmed") &&
        !isSlotInPast(r.date, r.time_slot),
    );
    return NextResponse.json({
      reservations: mine.map((r) => ({
        id: r.id,
        date: r.date,
        time_slot: r.time_slot,
        service: r.service,
        duration_hours: r.duration_hours,
        status: r.status,
      })),
    });
  } catch (e) {
    console.error("[reservations:lookup]", e);
    return NextResponse.json({ error: "조회에 실패했어요. 잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
}
