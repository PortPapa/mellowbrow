import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb, spansOverlap } from "@/lib/db";
import { notifyNewReservation } from "@/lib/notify";
import { getService, SERVICE_NAMES } from "@/lib/catalog";
import { SLOT_VALUES, isBookableDate, isClosedDay, isSlotInPast, slotHour } from "@/lib/slots";

const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time_slot: z.string().refine((v) => SLOT_VALUES.includes(v), "올바른 시간대가 아니에요."),
  service: z.enum(SERVICE_NAMES),
  name: z.string().trim().min(1, "성함을 입력해 주세요.").max(50),
  phone: z
    .string()
    .trim()
    .regex(/^0\d{1,2}-?\d{3,4}-?\d{4}$/, "연락처 형식을 확인해 주세요."),
  memo: z.string().trim().max(500).optional(),
  has_residue: z.boolean().optional().default(false),
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
    const msg = parsed.error.issues[0]?.message ?? "입력 내용을 확인해 주세요.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const input = parsed.data;
  if (!isBookableDate(input.date)) {
    return NextResponse.json({ error: "예약 가능한 날짜가 아니에요." }, { status: 400 });
  }
  if (isClosedDay(input.date)) {
    return NextResponse.json({ error: "월요일은 정기 휴무예요." }, { status: 400 });
  }
  if (isSlotInPast(input.date, input.time_slot)) {
    return NextResponse.json({ error: "이미 지난 시간대예요." }, { status: 400 });
  }

  const service = getService(input.service);
  if (!service) {
    return NextResponse.json({ error: "올바른 시술이 아니에요." }, { status: 400 });
  }
  const duration = service.durationHours;
  const start = slotHour(input.time_slot);

  try {
    const db = getDb();

    // 점유 구간 [start, start+duration) 재검증 — 레이스는 DB exclusion constraint가 최종 방어
    const spans = await db.activeSpans(input.date);
    if (spans.some((s) => spansOverlap(start, duration, slotHour(s.time_slot), s.duration_hours))) {
      return NextResponse.json(
        { error: "방금 마감된 시간이에요. 다른 시간을 선택해 주세요." },
        { status: 409 },
      );
    }

    const result = await db.createReservation({
      date: input.date,
      time_slot: input.time_slot,
      duration_hours: duration,
      service: input.service,
      name: input.name,
      phone: input.phone,
      memo: input.memo,
      has_residue: input.has_residue,
    });
    if (!result.ok) {
      return NextResponse.json(
        { error: "방금 마감된 시간이에요. 다른 시간을 선택해 주세요." },
        { status: 409 },
      );
    }
    // 텔레그램 알림 (미설정 시 건너뜀, 실패해도 예약에 영향 없음)
    await notifyNewReservation(result.reservation);
    return NextResponse.json({ reservation: result.reservation }, { status: 201 });
  } catch (e) {
    console.error("[reservations:create]", e);
    return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
}
