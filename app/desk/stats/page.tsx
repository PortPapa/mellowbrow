"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { DESK_PATH } from "@/lib/constants";
import { getService } from "@/lib/catalog";
import { buildReservationsCsv } from "@/lib/csv";
import { slotLabel, todayKST } from "@/lib/slots";
import type { ReservationWithMeta } from "@/lib/db";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function weekdayOf(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

function shortDate(dateStr: string): string {
  const [, m, d] = dateStr.split("-").map(Number);
  return `${m}/${d}`;
}

/** 카탈로그 가격 문자열에서 최소 금액 파싱 — '₩300,000~' → 300000 */
function priceOf(service: string): number {
  const p = getService(service)?.price;
  if (!p) return 0;
  const digits = p.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function won(n: number): string {
  return `₩${n.toLocaleString("ko-KR")}`;
}

/** '2026-06' → '2026년 6월' */
function monthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return `${y}년 ${m}월`;
}

function downloadCsv(rows: ReservationWithMeta[], filename: string) {
  const blob = new Blob([buildReservationsCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DeskStatsPage() {
  const [rows, setRows] = useState<ReservationWithMeta[]>([]);
  const [month, setMonth] = useState(todayKST().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api${DESK_PATH}/reservations`);
      if (res.status === 401) {
        window.location.href = `${DESK_PATH}/login`;
        return;
      }
      if (!res.ok) throw new Error();
      setRows(((await res.json()) as { reservations: ReservationWithMeta[] }).reservations);
    } catch {
      setError("데이터를 불러오지 못했어요. 새로고침 해주세요.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const inMonth = useMemo(() => rows.filter((r) => r.date.startsWith(month)), [rows, month]);
  const confirmedDone = useMemo(
    () => inMonth.filter((r) => r.status === "confirmed" || r.status === "done"),
    [inMonth],
  );
  const cancelledRows = useMemo(
    () =>
      inMonth
        .filter((r) => r.status === "cancelled")
        .sort((a, b) => (b.date + b.time_slot).localeCompare(a.date + a.time_slot)),
    [inMonth],
  );
  const revenue = useMemo(
    () => confirmedDone.reduce((sum, r) => sum + priceOf(r.service), 0),
    [confirmedDone],
  );
  const serviceRows = useMemo(() => {
    const map = new Map<string, { count: number; revenue: number }>();
    for (const r of confirmedDone) {
      const e = map.get(r.service) ?? { count: 0, revenue: 0 };
      e.count += 1;
      e.revenue += priceOf(r.service);
      map.set(r.service, e);
    }
    return [...map.entries()].sort((a, b) => b[1].count - a[1].count);
  }, [confirmedDone]);

  async function removeReservation(id: string) {
    if (!window.confirm("이 예약 기록을 완전히 삭제할까요? 되돌릴 수 없어요.")) return;
    const res = await fetch(`/api${DESK_PATH}/reservations?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) void load();
    else {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "삭제에 실패했어요.");
    }
  }

  return (
    <div className="desk-container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ fontSize: 24 }}>기록·통계</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 160 }}>
            <Input type="month" value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} />
          </div>
          <Button size="sm" variant="secondary" onClick={() => void load()}>
            <RefreshCw size={14} strokeWidth={2} /> 새로고침
          </Button>
        </div>
      </div>

      {error && (
        <p
          style={{
            fontSize: 13.5,
            color: "var(--error)",
            background: "var(--error-soft)",
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            marginBottom: 16,
          }}
        >
          {error}
        </p>
      )}

      {/* 월 요약 */}
      <div className="desk-summary" style={{ marginBottom: 20 }}>
        <Card elevation="sm">
          <span className="mb-eyebrow">{monthLabel(month)} 신청</span>
          <div className="desk-summary-num" style={{ marginTop: 8 }}>
            {inMonth.length}건
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: "var(--text-muted)" }}>
            취소 {cancelledRows.length}건 포함
          </div>
        </Card>
        <Card elevation="sm">
          <span className="mb-eyebrow">확정·완료</span>
          <div className="desk-summary-num" style={{ marginTop: 8 }}>
            {confirmedDone.length}건
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: "var(--text-muted)" }}>
            대기 {inMonth.filter((r) => r.status === "pending").length}건 별도
          </div>
        </Card>
        <Card elevation="sm">
          <span className="mb-eyebrow">예상 매출</span>
          <div className="desk-summary-num" style={{ marginTop: 8 }}>
            {won(revenue)}
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: "var(--text-muted)" }}>
            확정·완료 기준, 현금가 최소 금액으로 계산
          </div>
        </Card>
      </div>

      {/* 시술별 집계 */}
      <Card elevation="sm" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 19, marginBottom: 12 }}>시술별 집계 ({monthLabel(month)})</h3>
        {serviceRows.length === 0 ? (
          <p style={{ fontSize: 13.5, color: "var(--text-muted)", padding: "10px 0" }}>
            이 달에는 확정·완료된 예약이 없어요.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {serviceRows.map(([service, s]) => (
              <div
                key={service}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "12px 0",
                  borderBottom: "1px solid var(--border-soft)",
                  flexWrap: "wrap",
                }}
              >
                <b style={{ fontSize: 14.5 }}>{service}</b>
                <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
                  {s.count}건 · {won(s.revenue)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* CSV 내보내기 */}
      <Card elevation="sm" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 19, marginBottom: 6 }}>CSV 내보내기</h3>
        <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 14 }}>
          엑셀에서 바로 열 수 있어요 (한글 깨짐 방지 처리됨).
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button
            size="sm"
            variant="secondary"
            disabled={inMonth.length === 0}
            onClick={() => downloadCsv(inMonth, `mellowbrow-예약-${month}.csv`)}
          >
            <Download size={14} strokeWidth={2} /> 이 달 내역 ({inMonth.length}건)
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={rows.length === 0}
            onClick={() => downloadCsv(rows, `mellowbrow-예약-전체-${todayKST()}.csv`)}
          >
            <Download size={14} strokeWidth={2} /> 전체 내역 ({rows.length}건)
          </Button>
        </div>
      </Card>

      {/* 취소 내역 */}
      <Card elevation="sm">
        <h3 style={{ fontSize: 19, marginBottom: 6 }}>취소 내역 ({monthLabel(month)})</h3>
        {loading && <p style={{ fontSize: 13.5, color: "var(--text-muted)" }}>불러오는 중…</p>}
        {!loading && cancelledRows.length === 0 && (
          <p style={{ fontSize: 13.5, color: "var(--text-muted)", padding: "10px 0" }}>
            이 달에는 취소된 예약이 없어요.
          </p>
        )}
        {cancelledRows.map((r) => (
          <div
            key={r.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
              padding: "14px 0",
              borderBottom: "1px solid var(--border-soft)",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Badge tone="error">취소</Badge>
                <b style={{ fontSize: 15 }}>{r.name}</b>
                <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
                  {shortDate(r.date)} ({weekdayOf(r.date)}) · {slotLabel(r.time_slot)} · {r.service}
                </span>
              </div>
              <div style={{ marginTop: 4, fontSize: 13, color: "var(--text-muted)" }}>{r.phone}</div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => void removeReservation(r.id)}>
              삭제
            </Button>
          </div>
        ))}
      </Card>
    </div>
  );
}
