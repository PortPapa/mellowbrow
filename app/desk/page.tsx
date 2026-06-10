"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, LogOut, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { DESK_PATH } from "@/lib/constants";
import { SLOT_HOURS, hourLabel, slotHour, slotLabel, todayKST } from "@/lib/slots";
import { durationLabel } from "@/lib/catalog";
import type { Reservation, ReservationStatus } from "@/lib/db";

const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: "대기",
  confirmed: "확정",
  done: "완료",
  cancelled: "취소",
};

const STATUS_TONE: Record<ReservationStatus, "neutral" | "brand" | "accent" | "success" | "error"> = {
  pending: "accent",
  confirmed: "brand",
  done: "success",
  cancelled: "error",
};

export default function DeskPage() {
  const router = useRouter();
  const today = todayKST();
  const [date, setDate] = useState(today);
  const [dayReservations, setDayReservations] = useState<Reservation[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [pending, setPending] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (d: string) => {
    setLoading(true);
    setError("");
    try {
      const [rRes, bRes, pRes] = await Promise.all([
        fetch(`/api${DESK_PATH}/reservations?date=${d}`),
        fetch(`/api${DESK_PATH}/blocks?date=${d}`),
        fetch(`/api${DESK_PATH}/reservations?status=pending&from=${todayKST()}`),
      ]);
      if (rRes.status === 401 || bRes.status === 401) {
        window.location.href = `${DESK_PATH}/login`;
        return;
      }
      if (!rRes.ok || !bRes.ok || !pRes.ok) throw new Error();
      setDayReservations(((await rRes.json()) as { reservations: Reservation[] }).reservations);
      setBlocked(((await bRes.json()) as { blocked: string[] }).blocked);
      setPending(((await pRes.json()) as { reservations: Reservation[] }).reservations);
    } catch {
      setError("데이터를 불러오지 못했어요. 새로고침 해주세요.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(date);
  }, [date, load]);

  async function changeStatus(id: string, status: ReservationStatus) {
    const res = await fetch(`/api${DESK_PATH}/reservations`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) void load(date);
    else setError("상태 변경에 실패했어요.");
  }

  async function toggleBlock(slot: string, nextBlocked: boolean) {
    const res = await fetch(`/api${DESK_PATH}/blocks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, time_slot: slot, blocked: nextBlocked }),
    });
    if (res.ok) void load(date);
    else setError("휴무 설정에 실패했어요.");
  }

  async function logout() {
    await fetch(`/api${DESK_PATH}/login`, { method: "DELETE" });
    router.replace(`${DESK_PATH}/login`);
  }

  // 시간별 점유 맵 — 예약(start, duration)이 [start, start+D) 시간을 차지
  const occupancy = new Map<number, { r: Reservation; isStart: boolean }>();
  for (const r of dayReservations) {
    if (r.status === "cancelled") continue;
    const start = slotHour(r.time_slot);
    for (let h = start; h < start + r.duration_hours; h++) {
      occupancy.set(h, { r, isStart: h === start });
    }
  }
  // 21시 이후는 점유(스필오버)가 있을 때만 표시
  const boardHours: number[] = [
    ...SLOT_HOURS,
    ...[21, 22, 23].filter((h) => occupancy.has(h)),
  ];

  function StatusActions({ r }: { r: Reservation }) {
    return (
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {r.status === "pending" && (
          <Button size="sm" onClick={() => changeStatus(r.id, "confirmed")}>
            확정
          </Button>
        )}
        {r.status === "confirmed" && (
          <Button size="sm" variant="quiet" onClick={() => changeStatus(r.id, "done")}>
            완료
          </Button>
        )}
        {(r.status === "pending" || r.status === "confirmed") && (
          <Button size="sm" variant="secondary" onClick={() => changeStatus(r.id, "cancelled")}>
            취소
          </Button>
        )}
        {r.status === "cancelled" && (
          <Button size="sm" variant="secondary" onClick={() => changeStatus(r.id, "pending")}>
            복구
          </Button>
        )}
      </div>
    );
  }

  function ReservationRow({ r, showDate }: { r: Reservation; showDate?: boolean }) {
    return (
      <div
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
        <div style={{ minWidth: 220 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Badge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Badge>
            <b style={{ fontSize: 15 }}>{r.name}</b>
            <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
              {showDate && `${r.date} · `}
              {slotLabel(r.time_slot)} · {r.service} · {durationLabel(r.duration_hours)}
            </span>
          </div>
          <div style={{ marginTop: 4, fontSize: 13, color: "var(--text-muted)" }}>
            {r.phone}
            {r.memo && ` · ${r.memo}`}
          </div>
        </div>
        <StatusActions r={r} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px var(--gutter) 80px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Logo variant="full" size={22} />
          <span className="mb-eyebrow">Desk</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => void load(date)}>
            <RefreshCw size={14} strokeWidth={2} /> 새로고침
          </Button>
          <Button size="sm" variant="ghost" onClick={logout}>
            <LogOut size={14} strokeWidth={2} /> 로그아웃
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

      {/* 날짜 선택 + 슬롯 보드 */}
      <Card elevation="sm" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          <h3 style={{ fontSize: 19, display: "flex", alignItems: "center", gap: 8 }}>
            <CalendarDays size={18} strokeWidth={1.75} /> 날짜별 슬롯
          </h3>
          <div style={{ width: 180 }}>
            <Input type="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {boardHours.map((h) => {
            const slotValue = `${h}:00`;
            const entry = occupancy.get(h);
            const isBlocked = blocked.includes(slotValue);
            return (
              <div
                key={h}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  background: entry
                    ? "var(--primary-soft)"
                    : isBlocked
                      ? "var(--surface-fill)"
                      : "var(--surface-page)",
                  border: "1px solid var(--border-soft)",
                  flexWrap: "wrap",
                  opacity: entry && !entry.isStart ? 0.75 : 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <b style={{ fontSize: 14, minWidth: 76 }}>{hourLabel(h)}</b>
                  {entry ? (
                    entry.isStart ? (
                      <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
                        <Badge tone={STATUS_TONE[entry.r.status]}>
                          {STATUS_LABEL[entry.r.status]}
                        </Badge>{" "}
                        {entry.r.name} · {entry.r.service} ·{" "}
                        {durationLabel(entry.r.duration_hours)}
                      </span>
                    ) : (
                      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                        ↳ {entry.r.name}님 시술 진행 중
                      </span>
                    )
                  ) : isBlocked ? (
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>휴무 (차단됨)</span>
                  ) : (
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>비어 있음</span>
                  )}
                </div>
                {!entry && h <= 20 && (
                  <Button
                    size="sm"
                    variant={isBlocked ? "secondary" : "quiet"}
                    onClick={() => toggleBlock(slotValue, !isBlocked)}
                  >
                    {isBlocked ? "차단 해제" : "차단"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* 해당 날짜 예약 목록 */}
      <Card elevation="sm" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 19, marginBottom: 6 }}>{date} 예약</h3>
        {loading && <p style={{ fontSize: 13.5, color: "var(--text-muted)" }}>불러오는 중…</p>}
        {!loading && dayReservations.length === 0 && (
          <p style={{ fontSize: 13.5, color: "var(--text-muted)", padding: "10px 0" }}>
            이 날짜에는 예약이 없어요.
          </p>
        )}
        {dayReservations.map((r) => (
          <ReservationRow key={r.id} r={r} />
        ))}
      </Card>

      {/* 다가오는 대기 예약 */}
      <Card elevation="sm">
        <h3 style={{ fontSize: 19, marginBottom: 6 }}>확인이 필요한 신청 (대기)</h3>
        {!loading && pending.length === 0 && (
          <p style={{ fontSize: 13.5, color: "var(--text-muted)", padding: "10px 0" }}>
            대기 중인 신청이 없어요.
          </p>
        )}
        {pending.map((r) => (
          <ReservationRow key={r.id} r={r} showDate />
        ))}
      </Card>
    </div>
  );
}
