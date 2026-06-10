import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { SERVICES, SLOT_VALUES, isBookableDate, isSlotInPast } from "@/lib/slots";

const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time_slot: z.string().refine((v) => SLOT_VALUES.includes(v), "올바른 시간대가 아니에요."),
  service: z.enum(SERVICES),
  name: z.string().trim().min(1, "성함을 입력해 주세요.").max(50),
  phone: z
    .string()
    .trim()
    .regex(/^0\d{1,2}-?\d{3,4}-?\d{4}$/, "연락처 형식을 확인해 주세요."),
  memo: z.string().trim().max(500).optional(),
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
  if (isSlotInPast(input.date, input.time_slot)) {
    return NextResponse.json({ error: "이미 지난 시간대예요." }, { status: 400 });
  }

  try {
    const db = getDb();
    const result = await db.createReservation(input);
    if (!result.ok) {
      return NextResponse.json(
        { error: "방금 마감된 시간이에요. 다른 시간을 선택해 주세요." },
        { status: 409 },
      );
    }
    return NextResponse.json({ reservation: result.reservation }, { status: 201 });
  } catch (e) {
    console.error("[reservations:create]", e);
    return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
}
