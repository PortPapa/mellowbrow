"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MAX_DAYS_AHEAD, addDays, todayKST } from "@/lib/slots";

interface DayInfo {
  date: string;
  available: number;
  total: number;
  closed?: boolean;
}

/** 월 캘린더 — 일자별 남은 시간대를 점으로, 마감/지난 날은 비활성으로 표시 */
export function Calendar({
  value,
  onSelect,
  reloadToken = 0,
}: {
  value: string;
  onSelect: (date: string) => void;
  reloadToken?: number;
}) {
  const today = todayKST();
  const maxDate = addDays(today, MAX_DAYS_AHEAD);
  const minMonth = today.slice(0, 7);
  const maxMonth = maxDate.slice(0, 7);

  const [month, setMonth] = useState(minMonth);
  const [days, setDays] = useState<DayInfo[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    setFailed(false);
    fetch(`/api/availability?month=${month}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { days: DayInfo[] }) => {
        if (alive) setDays(d.days);
      })
      .catch(() => {
        if (alive) {
          setDays(null);
          setFailed(true);
        }
      });
    return () => {
      alive = false;
    };
  }, [month, reloadToken]);

  const [y, m] = month.split("-").map(Number);
  const firstWeekday = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();

  function moveMonth(delta: number) {
    const t = new Date(Date.UTC(y, m - 1 + delta, 1));
    const next = `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, "0")}`;
    if (next < minMonth || next > maxMonth) return;
    setDays(null);
    setMonth(next);
  }

  return (
    <div className="cal">
      <div className="cal-head">
        <button
          type="button"
          className="cal-nav"
          onClick={() => moveMonth(-1)}
          disabled={month <= minMonth}
          aria-label="이전 달"
        >
          <ChevronLeft size={17} strokeWidth={2} />
        </button>
        <span className="cal-title">
          {y}년 {m}월
        </span>
        <button
          type="button"
          className="cal-nav"
          onClick={() => moveMonth(1)}
          disabled={month >= maxMonth}
          aria-label="다음 달"
        >
          <ChevronRight size={17} strokeWidth={2} />
        </button>
      </div>

      <div className="cal-week">
        {["일", "월", "화", "수", "목", "금", "토"].map((w, i) => (
          <span key={w} className={i === 0 ? "is-sun" : ""}>
            {w}
          </span>
        ))}
      </div>

      {days ? (
        <div className="cal-grid">
          {Array.from({ length: firstWeekday }).map((_, i) => (
            <span key={`empty-${i}`} />
          ))}
          {days.map((d) => {
            const inRange = d.date >= today && d.date <= maxDate;
            const isClosed = inRange && !!d.closed;
            const isFull = inRange && !isClosed && d.available === 0;
            const selectable = inRange && d.available > 0;
            const cls = [
              "cal-cell",
              value === d.date ? "is-selected" : "",
              isFull || isClosed ? "is-full" : "",
              !inRange ? "is-out" : "",
              d.date === today ? "is-today" : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <button
                key={d.date}
                type="button"
                className={cls}
                disabled={!selectable}
                onClick={() => onSelect(d.date)}
              >
                <span className="cal-day">{Number(d.date.slice(8))}</span>
                {selectable && (
                  <span className="cal-dots">
                    {Array.from({ length: d.available }).map((_, i) => (
                      <i key={i} />
                    ))}
                  </span>
                )}
                {isFull && <span className="cal-full">마감</span>}
                {isClosed && <span className="cal-closed">휴무</span>}
              </button>
            );
          })}
        </div>
      ) : (
        <p style={{ fontSize: 13, color: "var(--text-muted)", padding: "18px 0", textAlign: "center" }}>
          {failed ? "예약 현황을 불러오지 못했어요. 잠시 후 다시 시도해 주세요." : "예약 현황을 불러오는 중…"}
        </p>
      )}

      <div className="cal-legend">
        <span>
          <i className="dot" /> 남은 시간대 수
        </span>
        <span>
          <b style={{ color: "var(--blush-700)", fontWeight: 600, fontSize: 11 }}>마감</b> 예약 불가
        </span>
        <span>
          <b style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 11 }}>휴무</b> 매주 월요일
        </span>
      </div>
    </div>
  );
}
