// 예약 내역 CSV 생성 — 순수 함수 (데스크 통계 페이지에서 다운로드용)
import type { Reservation } from "./db";
import { durationLabel } from "./catalog";
import { slotLabel } from "./slots";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const STATUS_KO: Record<Reservation["status"], string> = {
  pending: "대기",
  confirmed: "확정",
  done: "완료",
  cancelled: "취소",
};

/** 콤마/따옴표/개행이 든 값은 따옴표로 감싸고 내부 따옴표는 이중화 */
function esc(v: string): string {
  return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function weekdayOf(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

function createdAtKST(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** UTF-8 BOM 포함 — 엑셀에서 한글이 깨지지 않게 */
export function buildReservationsCsv(rows: Reservation[]): string {
  const header = ["날짜", "요일", "시간", "시술", "소요시간", "성함", "연락처", "잔흔", "상태", "요청사항", "신청일시"];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.date,
        weekdayOf(r.date),
        slotLabel(r.time_slot),
        r.service,
        durationLabel(r.duration_hours),
        r.name,
        r.phone,
        r.has_residue ? "있음" : "없음",
        STATUS_KO[r.status],
        r.memo ?? "",
        createdAtKST(r.created_at),
      ]
        .map(esc)
        .join(","),
    );
  }
  return "﻿" + lines.join("\r\n");
}
