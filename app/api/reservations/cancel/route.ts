import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { phoneDigits } from "@/lib/format";
import { notifyCancelledReservation } from "@/lib/notify";
import { isSlotInPast } from "@/lib/slots";

// 손님 직접 취소 — id만으로는 취소 불가, 성함·연락처를 재대조해 본인 확인 (IDOR 방지).
// 불일치/없음/이미 지난 예약은 모두 404로 통일해 존재 여부를 노출하지 않는다.
const schema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(40),
  phone: z.string().min(9).max(20),
});

const NOT_FOUND = NextResponse.json(
  { error: "예약을 찾을 수 없어요. 입력 정보를 확인해 주세요." },
  { status: 404 },
);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청이에요." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "입력 내용을 확인해 주세요." }, { status: 400 });
  }
  const digits = phoneDigits(parsed.data.phone);
  if (digits.length < 9) return NOT_FOUND;

  try {
    const db = getDb();
    const rows = await db.listReservations({ name: parsed.data.name });
    const target = rows.find(
      (r) =>
        r.id === parsed.data.id &&
        phoneDigits(r.phone) === digits &&
        (r.status === "pending" || r.status === "confirmed") &&
        !isSlotInPast(r.date, r.time_slot),
    );
    if (!target) return NOT_FOUND;

    const updated = await db.updateReservationStatus(target.id, "cancelled");
    if (!updated) return NOT_FOUND;

    await notifyCancelledReservation(updated, "customer"); // 실패해도 내부에서 흡수
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[reservations:cancel]", e);
    return NextResponse.json({ error: "취소에 실패했어요. 잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
}
