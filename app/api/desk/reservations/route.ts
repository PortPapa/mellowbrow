import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb, type ReservationStatus } from "@/lib/db";
import { isValidDateStr } from "@/lib/slots";

const STATUSES: ReservationStatus[] = ["pending", "confirmed", "done", "cancelled"];

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const date = sp.get("date") ?? undefined;
  const status = sp.get("status") ?? undefined;
  const fromDate = sp.get("from") ?? undefined;

  if (date && !isValidDateStr(date)) {
    return NextResponse.json({ error: "올바른 날짜가 아니에요." }, { status: 400 });
  }
  if (status && !STATUSES.includes(status as ReservationStatus)) {
    return NextResponse.json({ error: "올바른 상태가 아니에요." }, { status: 400 });
  }

  try {
    const db = getDb();
    const reservations = await db.listReservations({
      date,
      status: status as ReservationStatus | undefined,
      fromDate,
    });
    return NextResponse.json({ reservations });
  } catch (e) {
    console.error("[desk:reservations:list]", e);
    return NextResponse.json({ error: "목록을 불러오지 못했어요." }, { status: 500 });
  }
}

const patchSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["pending", "confirmed", "done", "cancelled"]),
});

export async function PATCH(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청이에요." }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "입력 내용을 확인해 주세요." }, { status: 400 });
  }

  try {
    const db = getDb();
    const updated = await db.updateReservationStatus(parsed.data.id, parsed.data.status);
    if (!updated) {
      return NextResponse.json({ error: "예약을 찾을 수 없어요." }, { status: 404 });
    }
    return NextResponse.json({ reservation: updated });
  } catch (e) {
    console.error("[desk:reservations:patch]", e);
    return NextResponse.json({ error: "상태 변경에 실패했어요." }, { status: 500 });
  }
}
