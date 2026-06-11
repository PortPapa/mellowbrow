import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { SLOT_VALUES, isValidDateStr } from "@/lib/slots";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const from = sp.get("from");
  const to = sp.get("to");

  // 범위 모드 — { blocked: { 'YYYY-MM-DD': ['11:00', ...] } }
  if (from && to) {
    if (!isValidDateStr(from) || !isValidDateStr(to) || from > to) {
      return NextResponse.json({ error: "올바른 기간이 아니에요." }, { status: 400 });
    }
    try {
      const blocked = await getDb().blockedSlotsInRange(from, to);
      return NextResponse.json({ from, to, blocked });
    } catch (e) {
      console.error("[desk:blocks:range]", e);
      return NextResponse.json({ error: "휴무 정보를 불러오지 못했어요." }, { status: 500 });
    }
  }

  const date = sp.get("date") ?? "";
  if (!isValidDateStr(date)) {
    return NextResponse.json({ error: "올바른 날짜가 아니에요." }, { status: 400 });
  }
  try {
    const db = getDb();
    const blocked = await db.blockedSlots(date);
    return NextResponse.json({ date, blocked });
  } catch (e) {
    console.error("[desk:blocks:list]", e);
    return NextResponse.json({ error: "휴무 정보를 불러오지 못했어요." }, { status: 500 });
  }
}

const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time_slot: z.string().refine((v) => SLOT_VALUES.includes(v)),
  blocked: z.boolean(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청이에요." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success || !isValidDateStr(parsed.data.date)) {
    return NextResponse.json({ error: "입력 내용을 확인해 주세요." }, { status: 400 });
  }

  try {
    const db = getDb();
    await db.setBlocked(parsed.data.date, parsed.data.time_slot, parsed.data.blocked);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[desk:blocks]", e);
    return NextResponse.json({ error: "휴무 설정에 실패했어요." }, { status: 500 });
  }
}
