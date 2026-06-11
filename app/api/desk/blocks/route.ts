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

const singleSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time_slot: z.string().refine((v) => SLOT_VALUES.includes(v)),
  blocked: z.boolean(),
});

// 기간 일괄 차단/해제 (휴가용)
const rangeSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  blocked: z.boolean(),
});

const MAX_RANGE_DAYS = 92;

function daySpan(from: string, to: string): number {
  const [y1, m1, d1] = from.split("-").map(Number);
  const [y2, m2, d2] = to.split("-").map(Number);
  return (Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000 + 1;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청이에요." }, { status: 400 });
  }

  // 단일 슬롯 모드
  const single = singleSchema.safeParse(body);
  if (single.success) {
    if (!isValidDateStr(single.data.date)) {
      return NextResponse.json({ error: "입력 내용을 확인해 주세요." }, { status: 400 });
    }
    try {
      await getDb().setBlocked(single.data.date, single.data.time_slot, single.data.blocked);
      return NextResponse.json({ ok: true });
    } catch (e) {
      console.error("[desk:blocks]", e);
      return NextResponse.json({ error: "휴무 설정에 실패했어요." }, { status: 500 });
    }
  }

  // 기간 모드
  const range = rangeSchema.safeParse(body);
  if (!range.success || !isValidDateStr(range.data.from) || !isValidDateStr(range.data.to)) {
    return NextResponse.json({ error: "입력 내용을 확인해 주세요." }, { status: 400 });
  }
  const { from, to, blocked } = range.data;
  if (from > to) {
    return NextResponse.json({ error: "시작일이 종료일보다 늦어요." }, { status: 400 });
  }
  if (daySpan(from, to) > MAX_RANGE_DAYS) {
    return NextResponse.json({ error: `기간은 최대 ${MAX_RANGE_DAYS}일까지 가능해요.` }, { status: 400 });
  }
  try {
    await getDb().setBlockedRange(from, to, blocked);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[desk:blocks:range]", e);
    return NextResponse.json({ error: "휴무 설정에 실패했어요." }, { status: 500 });
  }
}
