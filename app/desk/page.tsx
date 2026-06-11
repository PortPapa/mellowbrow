"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { DESK_PATH } from "@/lib/constants";
import { durationLabel } from "@/lib/catalog";
import { SLOT_HOURS, addDays, hourLabel, isClosedDay, slotHour, slotLabel, todayKST } from "@/lib/slots";
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

const STRIP_DAYS = 14;
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function weekdayOf(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

function shortDate(dateStr: string): string {
  const [, m, d] = dateStr.split("-").map(Number);
  return `${m}/${d}`;
}

export default function DeskPage() {
  const today = todayKST();
  const tomorrow = addDays(today, 1);
  const [selected, setSelected] = useState(today);
  const [upcoming, setUpcoming] = useState<Reservation[]>([]);
  const [blockedMap, setBlockedMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const t = todayKST();
      const [rRes, bRes] = await Promise.all([
        fetch(`/api${DESK_PATH}/reservations?from=${t}`),
        fetch(`/api${DESK_PATH}/blocks?from=${t}&to=${addDays(t, STRIP_DAYS - 1)}`),
      ]);
      if (rRes.status === 401 || bRes.status === 401) {
        window.location.href = `${DESK_PATH}/login`;
        return;
      }
      if (!rRes.ok || !bRes.ok) throw new Error();
      setUpcoming(((await rRes.json()) as { reservations: Reservation[] }).reservations);
      setBlockedMap(((await bRes.json()) as { blocked: Record<string, string[]> }).blocked);
    } catch {
      setError("데이터를 불러오지 못했어요. 새로고침 해주세요.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  // 스트립 범위(+14일) 밖 날짜를 고르면 그 날짜의 차단 정보만 추가 조회
  useEffect(() => {
    if (selected > addDays(today, STRIP_DAYS - 1) && !(selected in blockedMap)) {
      void (async () => {
        const res = await fetch(`/api${DESK_PATH}/blocks?date=${selected}`);
        if (res.ok) {
          const data = (await res.json()) as { blocked: string[] };
          setBlockedMap((m) => ({ ...m, [selected]: data.blocked }));
        }
      })();
    }
  }, [selected, blockedMap, today]);

  /** 해당 날짜의 활성(대기·확정) 예약 — 시작 시간순 */
  const activeOf = useCallback(
    (date: string) =>
      upcoming
        .filter((r) => r.date === date && (r.status === "pending" || r.status === "confirmed"))
        .sort((a, b) => slotHour(a.time_slot) - slotHour(b.time_slot)),
    [upcoming],
  );

  const pendingAll = useMemo(() => upcoming.filter((r) => r.status === "pending"), [upcoming]);
  const dayAll = useMemo(() => upcoming.filter((r) => r.date === selected), [upcoming, selected]);

  function daySummary(date: string): string {
    if (isClosedDay(date)) return "정기 휴무";
    const list = activeOf(date);
    if (list.length === 0) return "예약 없음";
    const first = slotLabel(list[0].time_slot);
    const lastR = list[list.length - 1];
    const last = slotLabel(lastR.time_slot);
    return list.length === 1 ? `${first}` : `${first} ~ ${last}`;
  }

  async function changeStatus(id: string, status: ReservationStatus) {
    const res = await fetch(`/api${DESK_PATH}/reservations`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) void loadAll();
    else setError("상태 변경에 실패했어요.");
  }

  async function toggleBlock(slot: string, nextBlocked: boolean) {
    const res = await fetch(`/api${DESK_PATH}/blocks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: selected, time_slot: slot, blocked: nextBlocked }),
    });
    if (res.ok) {
      setBlockedMap((m) => {
        const cur = new Set(m[selected] ?? []);
        if (nextBlocked) cur.add(slot);
        else cur.delete(slot);
        return { ...m, [selected]: [...cur] };
      });
    } else setError("휴무 설정에 실패했어요.");
  }

  // 선택 날짜의 시간별 점유 맵
  const occupancy = new Map<number, { r: Reservation; isStart: boolean }>();
  for (const r of activeOf(selected)) {
    const start = slotHour(r.time_slot);
    for (let h = start; h < start + r.duration_hours; h++) {
      occupancy.set(h, { r, isStart: h === start });
    }
  }
  const boardHours: number[] = [...SLOT_HOURS, ...[21, 22, 23].filter((h) => occupancy.has(h))];
  const blocked = blockedMap[selected] ?? [];

  const stripDates = Array.from({ length: STRIP_DAYS }, (_, i) => addDays(today, i));

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
            {r.has_residue && <Badge tone="accent">잔흔</Badge>}
            <b style={{ fontSize: 15 }}>{r.name}</b>
            <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
              {showDate && `${shortDate(r.date)} (${weekdayOf(r.date)}) · `}
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
        <h2 style={{ fontSize: 24 }}>예약 현황</h2>
        <Button size="sm" variant="secondary" onClick={() => void loadAll()}>
          <RefreshCw size={14} strokeWidth={2} /> 새로고침
        </Button>
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

      {/* 요약 카드 */}
      <div className="desk-summary" style={{ marginBottom: 20 }}>
        <Card elevation="sm">
          <span className="mb-eyebrow">오늘 ({weekdayOf(today)})</span>
          <div className="desk-summary-num" style={{ marginTop: 8 }}>
            {isClosedDay(today) ? "휴무" : `${activeOf(today).length}건`}
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: "var(--text-muted)" }}>
            {daySummary(today)}
          </div>
        </Card>
        <Card elevation="sm">
          <span className="mb-eyebrow">내일 ({weekdayOf(tomorrow)})</span>
          <div className="desk-summary-num" style={{ marginTop: 8 }}>
            {isClosedDay(tomorrow) ? "휴무" : `${activeOf(tomorrow).length}건`}
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: "var(--text-muted)" }}>
            {daySummary(tomorrow)}
          </div>
        </Card>
        <Card elevation="sm">
          <span className="mb-eyebrow">확인 필요 (대기)</span>
          <div
            className="desk-summary-num"
            style={{ marginTop: 8, color: pendingAll.length > 0 ? "var(--blush-700)" : undefined }}
          >
            {pendingAll.length}건
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: "var(--text-muted)" }}>
            {pendingAll.length > 0 ? "아래 목록에서 확정해 주세요" : "모두 처리됐어요"}
          </div>
        </Card>
      </div>

      {/* 2주 스케줄 스트립 */}
      <div className="desk-strip" style={{ marginBottom: 24 }}>
        {stripDates.map((d) => {
          const closed = isClosedDay(d);
          const list = activeOf(d);
          const isToday = d === today;
          const cls = [
            "desk-day",
            d === selected ? "is-selected" : "",
            isToday ? "is-today" : "",
            closed ? "is-closed" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button key={d} type="button" className={cls} onClick={() => !closed && setSelected(d)}>
              <div className="desk-day-label">
                {isToday ? "오늘" : d === tomorrow ? "내일" : `${shortDate(d)} (${weekdayOf(d)})`}
              </div>
              <div className="desk-day-count">{closed ? "휴무" : `${list.length}건`}</div>
              <div className="desk-day-sub">
                {closed ? "" : list.length > 0 ? `${slotLabel(list[0].time_slot)}부터` : "비어 있음"}
              </div>
            </button>
          );
        })}
      </div>

      {/* 날짜 선택 + 시간 보드 */}
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
            <CalendarDays size={18} strokeWidth={1.75} />
            {shortDate(selected)} ({weekdayOf(selected)}) 시간표
          </h3>
          <div style={{ width: 180 }}>
            <Input
              type="date"
              min={today}
              value={selected}
              onChange={(e) => e.target.value && setSelected(e.target.value)}
            />
          </div>
        </div>
        {isClosedDay(selected) ? (
          <p style={{ fontSize: 14, color: "var(--text-muted)", padding: "8px 0" }}>
            월요일은 정기 휴무예요.
          </p>
        ) : (
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
                          {entry.r.has_residue && <Badge tone="accent">잔흔</Badge>}{" "}
                          {entry.r.name} · {entry.r.service} · {durationLabel(entry.r.duration_hours)}
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
        )}
      </Card>

      {/* 선택 날짜 예약 목록 */}
      <Card elevation="sm" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 19, marginBottom: 6 }}>
          {shortDate(selected)} ({weekdayOf(selected)}) 예약
        </h3>
        {loading && <p style={{ fontSize: 13.5, color: "var(--text-muted)" }}>불러오는 중…</p>}
        {!loading && dayAll.length === 0 && (
          <p style={{ fontSize: 13.5, color: "var(--text-muted)", padding: "10px 0" }}>
            이 날짜에는 예약이 없어요.
          </p>
        )}
        {dayAll.map((r) => (
          <ReservationRow key={r.id} r={r} />
        ))}
      </Card>

      {/* 대기 전체 */}
      <Card elevation="sm">
        <h3 style={{ fontSize: 19, marginBottom: 6 }}>확인이 필요한 신청 (대기)</h3>
        {!loading && pendingAll.length === 0 && (
          <p style={{ fontSize: 13.5, color: "var(--text-muted)", padding: "10px 0" }}>
            대기 중인 신청이 없어요.
          </p>
        )}
        {pendingAll.map((r) => (
          <ReservationRow key={r.id} r={r} showDate />
        ))}
      </Card>
    </div>
  );
}
