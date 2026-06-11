import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb, type Reservation, type ReservationStatus, type ReservationWithMeta } from "@/lib/db";
import { phoneDigits } from "@/lib/format";
import { notifyCancelledReservation } from "@/lib/notify";
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
    // 전체를 한 번에 조회 — 재방문(같은 번호의 이전 예약) 계산에 전체 이력이 필요.
    // 1인 스튜디오 규모라 전체 조회 비용은 무시 가능.
    const all = await getDb().listReservations({});

    const byPhone = new Map<string, Reservation[]>();
    for (const r of all) {
      const key = phoneDigits(r.phone);
      const list = byPhone.get(key);
      if (list) list.push(r);
      else byPhone.set(key, [r]);
    }
    const isReturning = (r: Reservation): boolean =>
      (byPhone.get(phoneDigits(r.phone)) ?? []).some(
        (s) => s.id !== r.id && s.status !== "cancelled" && s.date < r.date,
      );

    const reservations: ReservationWithMeta[] = all
      .filter(
        (r) =>
          (!date || r.date === date) &&
          (!status || r.status === status) &&
          (!fromDate || r.date >= fromDate),
      )
      .map((r) => ({ ...r, returning: isReturning(r) }));

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
    if (parsed.data.status === "cancelled") {
      await notifyCancelledReservation(updated, "desk"); // 실패해도 내부에서 흡수
    }
    return NextResponse.json({ reservation: updated });
  } catch (e) {
    console.error("[desk:reservations:patch]", e);
    return NextResponse.json({ error: "상태 변경에 실패했어요." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!id) {
    return NextResponse.json({ error: "잘못된 요청이에요." }, { status: 400 });
  }
  try {
    const deleted = await getDb().deleteReservation(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "취소된 예약만 삭제할 수 있어요. 먼저 취소해 주세요." },
        { status: 400 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[desk:reservations:delete]", e);
    return NextResponse.json({ error: "삭제에 실패했어요." }, { status: 500 });
  }
}
