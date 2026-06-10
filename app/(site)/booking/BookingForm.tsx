"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarCheck, Check, Clock, Instagram, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SERVICES, MAX_DAYS_AHEAD, addDays, slotLabel, todayKST } from "@/lib/slots";

interface SlotInfo {
  value: string;
  label: string;
  available: boolean;
}

interface DoneInfo {
  date: string;
  time_slot: string;
  service: string;
  name: string;
}

const INFO: [typeof Clock, string, string][] = [
  [Clock, "영업 시간", "평일 11:00–20:00\n주말 예약 문의"],
  [MapPin, "위치", "서울 강남구\n예약 확정 시 상세 주소 안내"],
  [CalendarCheck, "예약제", "100% 예약제 운영\n방문 전 꼭 예약해 주세요"],
  [Instagram, "문의", "@mellowbrow DM"],
];

export function BookingForm({ initialService }: { initialService: string }) {
  const [service, setService] = useState(
    (SERVICES as readonly string[]).includes(initialService) ? initialService : "",
  );
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [memo, setMemo] = useState("");
  const [agree, setAgree] = useState(false);

  const [slots, setSlots] = useState<SlotInfo[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<DoneInfo | null>(null);

  const today = todayKST();
  const maxDate = addDays(today, MAX_DAYS_AHEAD);

  const loadAvailability = useCallback(async (d: string) => {
    setLoadingSlots(true);
    setSlots(null);
    try {
      const res = await fetch(`/api/availability?date=${d}`);
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { slots: SlotInfo[] };
      setSlots(data.slots);
    } catch {
      setError("예약 가능 시간을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (date) {
      setSlot("");
      setError("");
      void loadAvailability(date);
    }
  }, [date, loadAvailability]);

  const canSubmit =
    !!service && !!date && !!slot && name.trim().length > 0 && phone.trim().length >= 9 && agree;

  async function submit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          time_slot: slot,
          service,
          name: name.trim(),
          phone: phone.trim(),
          memo: memo.trim() || undefined,
        }),
      });
      if (res.status === 201) {
        setDone({ date, time_slot: slot, service, name: name.trim() });
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 409) {
        setError(body.error ?? "방금 마감된 시간이에요. 다른 시간을 선택해 주세요.");
        setSlot("");
        void loadAvailability(date);
      } else {
        setError(body.error ?? "신청 처리 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.");
      }
    } catch {
      setError("네트워크 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <Card
        elevation="md"
        style={{ maxWidth: 520, margin: "40px auto", textAlign: "center", padding: "48px 40px" }}
      >
        <span
          style={{
            display: "inline-flex",
            width: 56,
            height: 56,
            borderRadius: "999px",
            background: "var(--success-soft)",
            color: "var(--success)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
          }}
        >
          <Check size={28} strokeWidth={2} />
        </span>
        <h2 style={{ fontSize: 30 }}>예약 신청 완료</h2>
        <p
          style={{
            marginTop: 14,
            fontSize: 15,
            lineHeight: 1.7,
            color: "var(--text-secondary)",
          }}
        >
          {done.name}님, 신청해 주셔서 감사합니다.
          <br />
          <b style={{ color: "var(--text-primary)" }}>
            {done.date} {slotLabel(done.time_slot)} · {done.service}
          </b>
          <br />
          확인 후 남겨주신 연락처로 예약 확정을 안내드릴게요.
        </p>
        <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center" }}>
          <Button variant="secondary" href="/">
            홈으로
          </Button>
          <Button
            onClick={() => {
              setDone(null);
              setSlot("");
              if (date) void loadAvailability(date);
            }}
          >
            다시 신청
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 44px" }}>
        <span className="mb-eyebrow">Booking</span>
        <h1 style={{ fontSize: "var(--fs-display-md)", marginTop: 16 }}>예약 신청</h1>
        <p style={{ marginTop: 14, fontSize: 16, color: "var(--text-secondary)" }}>
          원하시는 날짜와 시간을 선택해 주세요. 이미 마감된 시간은 선택할 수 없어요. (100% 예약제)
        </p>
      </div>

      <div className="booking-grid">
        <Card elevation="sm" style={{ padding: "32px 32px 36px" }}>
          <div className="form-grid">
            <Input
              label="성함"
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="연락처"
              prefix="+82"
              placeholder="010-0000-0000"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Select
              label="시술 선택"
              placeholder="메뉴를 골라주세요"
              options={[...SERVICES]}
              value={service}
              onChange={(e) => setService(e.target.value)}
            />
            <Input
              label="희망 날짜"
              type="date"
              min={today}
              max={maxDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <div className="span-2">
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  display: "block",
                  marginBottom: 10,
                }}
              >
                희망 시간대
              </span>
              {!date && (
                <p style={{ fontSize: 13.5, color: "var(--text-muted)" }}>
                  날짜를 먼저 선택하시면 예약 가능한 시간이 표시돼요.
                </p>
              )}
              {date && loadingSlots && (
                <p style={{ fontSize: 13.5, color: "var(--text-muted)" }}>
                  예약 가능 시간을 확인하고 있어요…
                </p>
              )}
              {date && slots && (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {slots.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      className={`slot-chip${slot === s.value ? " is-active" : ""}`}
                      disabled={!s.available}
                      onClick={() => setSlot(s.value)}
                    >
                      {s.label}
                      {!s.available && " · 마감"}
                    </button>
                  ))}
                </div>
              )}
              {date && slots && slots.every((s) => !s.available) && (
                <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginTop: 10 }}>
                  이 날은 예약이 모두 마감되었어요. 다른 날짜를 선택해 주세요.
                </p>
              )}
            </div>
            <div className="span-2">
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  display: "block",
                  marginBottom: 7,
                }}
              >
                요청 사항 (선택)
              </span>
              <textarea
                className="textarea"
                placeholder="원하시는 눈썹 스타일이나 궁금한 점을 적어주세요."
                rows={3}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>
            <div className="span-2" style={{ marginTop: 4 }}>
              <Checkbox
                checked={agree}
                onChange={setAgree}
                label="개인정보 수집·이용에 동의합니다"
              />
            </div>
            {error && (
              <div className="span-2">
                <p
                  style={{
                    fontSize: 13.5,
                    color: "var(--error)",
                    background: "var(--error-soft)",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  {error}
                </p>
              </div>
            )}
            <div className="span-2" style={{ marginTop: 6 }}>
              <Button full size="lg" disabled={!canSubmit || submitting} onClick={submit}>
                {submitting ? "신청 중…" : "예약 신청하기"}
              </Button>
            </div>
          </div>
        </Card>

        <Card
          elevation="none"
          style={{ background: "var(--surface-sunken)", border: "1px solid var(--border-soft)" }}
        >
          <h3 style={{ fontSize: 20 }}>이용 안내</h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "18px 0 0",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {INFO.map(([IconCmp, t, d]) => (
              <li key={t} style={{ display: "flex", gap: 12 }}>
                <span style={{ color: "var(--mocha-600)", marginTop: 1 }}>
                  <IconCmp size={18} strokeWidth={1.75} />
                </span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                    {t}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      whiteSpace: "pre-line",
                      lineHeight: 1.6,
                    }}
                  >
                    {d}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
