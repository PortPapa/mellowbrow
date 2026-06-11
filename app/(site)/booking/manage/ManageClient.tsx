"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { formatPhone } from "@/lib/format";
import { slotLabel } from "@/lib/slots";
import { durationLabel } from "@/lib/catalog";

interface LookupItem {
  id: string;
  date: string;
  time_slot: string;
  service: string;
  duration_hours: number;
  status: "pending" | "confirmed";
}

const STATUS_LABEL = { pending: "대기 중", confirmed: "확정" } as const;

/** '2026-06-12' → '6월 12일 (금)' */
function formatDateKo(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${m}월 ${d}일 (${weekday})`;
}

export function ManageClient() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [items, setItems] = useState<LookupItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelledIds, setCancelledIds] = useState<string[]>([]);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setItems(null);
    setConfirmId(null);
    setCancelledIds([]);
    if (!name.trim() || phone.replace(/\D/g, "").length < 9) {
      setError("성함과 연락처를 정확히 입력해 주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reservations/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone }),
      });
      const data = (await res.json()) as { reservations?: LookupItem[]; error?: string };
      if (!res.ok) throw new Error(data.error);
      setItems(data.reservations ?? []);
    } catch {
      setError("조회에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  async function cancelReservation(id: string) {
    setCancelling(true);
    setError("");
    try {
      const res = await fetch("/api/reservations/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: name.trim(), phone }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error);
      }
      setCancelledIds((prev) => [...prev, id]);
      setConfirmId(null);
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "취소에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <span className="mb-eyebrow">Manage Booking</span>
        <h1 style={{ fontSize: "var(--fs-display-md)", marginTop: 14 }}>예약 조회·취소</h1>
        <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          예약하실 때 입력한 성함과 연락처로 다가오는 예약을 확인하고 취소할 수 있어요.
        </p>
      </div>

      <Card elevation="sm">
        <form onSubmit={lookup} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input
            label="성함"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예약하신 분 성함"
            maxLength={40}
          />
          <Input
            label="연락처"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="010-0000-0000"
            maxLength={13}
          />
          <Button type="submit" disabled={loading}>
            <Search size={15} strokeWidth={2} /> {loading ? "조회 중…" : "예약 조회"}
          </Button>
        </form>
      </Card>

      {error && (
        <p
          style={{
            marginTop: 16,
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

      {items !== null && items.length === 0 && (
        <Card elevation="sm" style={{ marginTop: 18 }}>
          <p style={{ fontSize: 14.5, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            입력하신 정보로 다가오는 예약을 찾지 못했어요. 성함·연락처를 다시 확인해 주시거나,
            카카오톡 채널로 문의해 주세요.
          </p>
        </Card>
      )}

      {items?.map((it) => {
        const isCancelled = cancelledIds.includes(it.id);
        return (
          <Card key={it.id} elevation="sm" style={{ marginTop: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {isCancelled ? (
                    <Badge tone="error">취소됨</Badge>
                  ) : (
                    <Badge tone={it.status === "confirmed" ? "brand" : "accent"}>
                      {STATUS_LABEL[it.status]}
                    </Badge>
                  )}
                  <b style={{ fontSize: 15.5 }}>
                    {formatDateKo(it.date)} {slotLabel(it.time_slot)}
                  </b>
                </div>
                <div style={{ marginTop: 6, fontSize: 13.5, color: "var(--text-secondary)" }}>
                  {it.service} · {durationLabel(it.duration_hours)}
                </div>
              </div>
              {!isCancelled &&
                (confirmId === it.id ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: "var(--error)" }}>정말 취소할까요?</span>
                    <Button size="sm" onClick={() => void cancelReservation(it.id)} disabled={cancelling}>
                      {cancelling ? "취소 중…" : "네, 취소합니다"}
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setConfirmId(null)} disabled={cancelling}>
                      아니요
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => setConfirmId(it.id)}>
                    예약 취소
                  </Button>
                ))}
            </div>
            {isCancelled && (
              <p style={{ marginTop: 12, fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.6 }}>
                취소가 완료됐어요. 다시 예약을 원하시면 언제든 예약 페이지를 이용해 주세요.
              </p>
            )}
          </Card>
        );
      })}

      <p style={{ textAlign: "center", marginTop: 28, fontSize: 14 }}>
        <Link
          href="/booking"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--text-secondary)",
            textDecoration: "underline",
            textUnderlineOffset: 4,
          }}
        >
          <CalendarCheck size={15} strokeWidth={1.75} /> 새 예약 신청하러 가기
        </Link>
      </p>
    </div>
  );
}
