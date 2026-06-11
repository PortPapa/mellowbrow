// 예약 알림 — 텔레그램 봇 메시지.
// TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID 가 모두 있을 때만 동작하며,
// 실패하더라도 절대 throw 하지 않는다 (예약 처리에 영향 없음).
import type { Reservation } from "./db";
import { getService } from "./catalog";
import { slotLabel } from "./slots";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function formatDateKo(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const wd = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${m}월 ${d}일 (${wd})`;
}

async function sendTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return; // 미설정 시 조용히 건너뜀
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // plain text — 사용자 입력(이름/요청)에 특수문자가 있어도 안전하게 parse_mode 미사용
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) {
      console.error("[notify:telegram]", res.status, await res.text().catch(() => ""));
    }
  } catch (e) {
    console.error("[notify:telegram]", e);
  }
}

export async function notifyNewReservation(r: Reservation): Promise<void> {
  const svc = getService(r.service);
  const lines = [
    "🌿 새 예약 신청",
    "",
    `이름: ${r.name}`,
    `연락처: ${r.phone}`,
    `시술: ${r.service}${svc ? ` (약 ${svc.durationHours}시간)` : ""}`,
    `일시: ${formatDateKo(r.date)} ${slotLabel(r.time_slot)}`,
    `잔흔: ${r.has_residue ? "있음 — 사진 상담 필요" : "없음"}`,
  ];
  if (r.memo) lines.push(`요청: ${r.memo}`);
  lines.push("", "데스크에서 확인 후 예약을 확정해 주세요.");
  await sendTelegram(lines.join("\n"));
}

export async function notifyCancelledReservation(
  r: Reservation,
  by: "customer" | "desk",
): Promise<void> {
  const lines = [
    "🚫 예약 취소",
    "",
    `이름: ${r.name}`,
    `연락처: ${r.phone}`,
    `시술: ${r.service}`,
    `일시: ${formatDateKo(r.date)} ${slotLabel(r.time_slot)}`,
    `취소 주체: ${by === "customer" ? "손님 직접 취소" : "데스크에서 취소"}`,
  ];
  await sendTelegram(lines.join("\n"));
}
