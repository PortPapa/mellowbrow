"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarCheck, Check, Clock, Instagram, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { CATALOG, durationLabel, getService } from "@/lib/catalog";
import { SLOT_HOURS, slotHour, slotLabel } from "@/lib/slots";
import { Calendar } from "./Calendar";

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
  [Clock, "영업 시간", "11:00–20:00\n매주 월요일 휴무"],
  [MapPin, "위치", "천호역 도보 5분 (주차 가능)\n예약 확정 시 상세 주소 안내"],
  [CalendarCheck, "예약제", "100% 예약제 운영\n방문 전 꼭 예약해 주세요"],
  [Instagram, "문의", "@mellowbrow DM\n카카오톡 ID mellow415"],
];

/** '2026-06-12' → '6월 12일 (금)' */
function formatDateKo(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${m}월 ${d}일 (${weekday})`;
}

export function BookingForm({ initialService }: { initialService: string }) {
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [service, setService] = useState(getService(initialService) ? initialService : "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [memo, setMemo] = useState("");
  const [agree, setAgree] = useState(false);

  const [slots, setSlots] = useState<SlotInfo[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<DoneInfo | null>(null);
  const [calToken, setCalToken] = useState(0);

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

  /** 시작 시간 start부터 시술(소요 D시간)이 들어갈 수 있는지 — 영업시간 내 시간만 검사 */
  function fits(startSlot: string, hours: number): boolean {
    if (!slots) return false;
    const start = slotHour(startSlot);
    const lastHour = SLOT_HOURS[SLOT_HOURS.length - 1];
    for (let h = start; h < start + hours; h++) {
      if (h > lastHour) break; // 마감 이후 시간은 제약 없음 (20시 예약 → 22시까지 시술)
      const s = slots.find((x) => slotHour(x.value) === h);
      if (!s || !s.available) return false;
    }
    return true;
  }

  function openModal(slotValue: string) {
    setSlot(slotValue);
    setError("");
    setModalOpen(true);
  }

  function refresh() {
    setCalToken((t) => t + 1);
    if (date) void loadAvailability(date);
  }

  const selectedService = getService(service);
  const serviceFits = !!selectedService && fits(slot, selectedService.durationHours);
  const canSubmit =
    !!service && !!date && !!slot && serviceFits && name.trim().length > 0 && phone.trim().length >= 9 && agree;

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
        refresh();
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 409) {
        setError(body.error ?? "방금 마감된 시간이에요. 다른 시간을 선택해 주세요.");
        refresh();
      } else {
        setError(body.error ?? "신청 처리 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.");
      }
    } catch {
      setError("네트워크 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  function closeModal() {
    setModalOpen(false);
    if (done) {
      setDone(null);
      setSlot("");
      setName("");
      setPhone("");
      setMemo("");
      setAgree(false);
    }
  }

  return (
    <>
      <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 40px" }}>
        <span className="mb-eyebrow">Booking</span>
        <h1 style={{ fontSize: "var(--fs-display-md)", marginTop: 16 }}>예약 신청</h1>
        <p style={{ marginTop: 14, fontSize: 16, color: "var(--text-secondary)" }}>
          원하시는 날짜와 시간을 선택해 주세요. 이미 마감된 시간은 선택할 수 없어요. (100% 예약제)
        </p>
      </div>

      <div className="booking-col">
        {/* ① 캘린더 */}
        <Calendar value={date} onSelect={setDate} reloadToken={calToken} />

        {/* ② 시간대 */}
        <div>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-secondary)",
              display: "block",
              marginBottom: 12,
            }}
          >
            희망 시간대 {date && <b style={{ color: "var(--text-primary)" }}>· {formatDateKo(date)}</b>}
          </span>
          {!date && (
            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
              캘린더에서 날짜를 먼저 선택해 주세요.
            </p>
          )}
          {date && loadingSlots && (
            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>예약 가능 시간을 확인하고 있어요…</p>
          )}
          {date && slots && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {slots.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  className={`slot-chip${slot === s.value && modalOpen ? " is-active" : ""}`}
                  disabled={!s.available}
                  onClick={() => openModal(s.value)}
                >
                  {s.label}
                  {!s.available && " · 마감"}
                </button>
              ))}
            </div>
          )}
          {date && slots && slots.every((s) => !s.available) && (
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 12 }}>
              이 날은 예약이 모두 마감되었어요. 다른 날짜를 선택해 주세요.
            </p>
          )}
          {error && !modalOpen && (
            <p
              style={{
                fontSize: 13.5,
                color: "var(--error)",
                background: "var(--error-soft)",
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                marginTop: 12,
              }}
            >
              {error}
            </p>
          )}
        </div>

        {/* ③ 이용 안내 */}
        <Card
          elevation="none"
          style={{ background: "var(--surface-sunken)", border: "1px solid var(--border-soft)" }}
        >
          <ul className="booking-info-grid" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {INFO.map(([IconCmp, t, d]) => (
              <li key={t} style={{ display: "flex", gap: 12 }}>
                <span style={{ color: "var(--mocha-600)", marginTop: 1 }}>
                  <IconCmp size={18} strokeWidth={1.75} />
                </span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{t}</div>
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

      {/* 신청 모달 */}
      <Modal open={modalOpen} onClose={closeModal} ariaLabel="예약 신청">
        {done ? (
          <div style={{ textAlign: "center", padding: "12px 0 4px" }}>
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
            <h2 style={{ fontSize: 28 }}>예약 신청 완료</h2>
            <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)" }}>
              {done.name}님, 신청해 주셔서 감사합니다.
              <br />
              <b style={{ color: "var(--text-primary)" }}>
                {formatDateKo(done.date)} {slotLabel(done.time_slot)} · {done.service}
              </b>
              <br />
              확인 후 남겨주신 연락처로 예약 확정을 안내드릴게요.
            </p>
            <div style={{ marginTop: 26 }}>
              <Button full onClick={closeModal}>
                확인
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <span className="mb-eyebrow">Booking</span>
              <h2 style={{ fontSize: 24, marginTop: 8 }}>
                {date && formatDateKo(date)}{" "}
                <span style={{ color: "var(--mocha-600)" }}>{slot && slotLabel(slot)}</span>
              </h2>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="modal-service">
                시술 선택
              </label>
              <div className="select-wrap">
                <select
                  id="modal-service"
                  value={service}
                  className={service ? "" : "is-placeholder"}
                  onChange={(e) => setService(e.target.value)}
                >
                  <option value="">메뉴를 골라주세요</option>
                  {CATALOG.map((s) => {
                    const ok = fits(slot, s.durationHours);
                    return (
                      <option key={s.name} value={s.name} disabled={!ok}>
                        {s.name} · {durationLabel(s.durationHours)}
                        {!ok ? " (시간 부족)" : ""}
                      </option>
                    );
                  })}
                </select>
                <svg
                  className="select-chevron"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {selectedService && serviceFits && (
                <span className="field-hint">
                  {slotLabel(slot)} 시작 · {durationLabel(selectedService.durationHours)} 소요
                </span>
              )}
              {selectedService && !serviceFits && (
                <span className="field-error-text">
                  이 시간에는 {selectedService.name}({durationLabel(selectedService.durationHours)})
                  시술이 어려워요. 다른 시간을 선택해 주세요.
                </span>
              )}
            </div>

            <Input label="성함" placeholder="홍길동" value={name} onChange={(e) => setName(e.target.value)} />
            <Input
              label="연락처"
              prefix="+82"
              placeholder="010-0000-0000"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div>
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
            <Checkbox checked={agree} onChange={setAgree} label="개인정보 수집·이용에 동의합니다" />
            {error && (
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
            )}
            <Button full size="lg" disabled={!canSubmit || submitting} onClick={submit}>
              {submitting ? "신청 중…" : "예약 신청하기"}
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}
