"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ImagePlus, Images, LogOut, RefreshCw, RotateCcw, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { DESK_PATH, GALLERY_CATEGORIES } from "@/lib/constants";
import { SITE_IMAGE_SLOTS, resolveSiteImage } from "@/lib/site-images";
import type { GalleryItem } from "@/lib/db";
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

  // 갤러리 관리
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [upFile, setUpFile] = useState<File | null>(null);
  const [upCategory, setUpCategory] = useState<string>(GALLERY_CATEGORIES[0]);
  const [uploading, setUploading] = useState(false);
  const [galleryError, setGalleryError] = useState("");

  const loadGallery = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error();
      setGallery(((await res.json()) as { items: GalleryItem[] }).items);
    } catch {
      setGalleryError("갤러리를 불러오지 못했어요.");
    }
  }, []);

  useEffect(() => {
    void loadGallery();
  }, [loadGallery]);

  async function uploadGallery() {
    if (!upFile || uploading) return;
    setUploading(true);
    setGalleryError("");
    try {
      const form = new FormData();
      form.append("file", upFile);
      form.append("category", upCategory);
      const res = await fetch(`/api${DESK_PATH}/gallery`, { method: "POST", body: form });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setGalleryError(body.error ?? "업로드에 실패했어요.");
        return;
      }
      setUpFile(null);
      void loadGallery();
    } catch {
      setGalleryError("네트워크 오류가 발생했어요.");
    } finally {
      setUploading(false);
    }
  }

  async function deleteGallery(id: string) {
    const res = await fetch(`/api${DESK_PATH}/gallery?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) void loadGallery();
    else setGalleryError("삭제에 실패했어요.");
  }

  // 사이트 이미지 (홈/시술 카드)
  const [siteImages, setSiteImages] = useState<Record<string, string>>({});
  const [siteBusy, setSiteBusy] = useState<string | null>(null);
  const [siteError, setSiteError] = useState("");

  const loadSiteImages = useCallback(async () => {
    try {
      const res = await fetch("/api/site-images");
      if (!res.ok) throw new Error();
      setSiteImages(((await res.json()) as { images: Record<string, string> }).images);
    } catch {
      setSiteError("사이트 이미지를 불러오지 못했어요.");
    }
  }, []);

  useEffect(() => {
    void loadSiteImages();
  }, [loadSiteImages]);

  async function changeSiteImage(key: string, file: File) {
    setSiteBusy(key);
    setSiteError("");
    try {
      const form = new FormData();
      form.append("key", key);
      form.append("file", file);
      const res = await fetch(`/api${DESK_PATH}/site-images`, { method: "POST", body: form });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setSiteError(body.error ?? "업로드에 실패했어요.");
        return;
      }
      void loadSiteImages();
    } catch {
      setSiteError("네트워크 오류가 발생했어요.");
    } finally {
      setSiteBusy(null);
    }
  }

  async function resetSiteImage(key: string) {
    setSiteBusy(key);
    setSiteError("");
    const res = await fetch(`/api${DESK_PATH}/site-images?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
    });
    setSiteBusy(null);
    if (res.ok) void loadSiteImages();
    else setSiteError("기본값 복원에 실패했어요.");
  }

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
      <Card elevation="sm" style={{ marginBottom: 24 }}>
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

      {/* 갤러리 관리 */}
      <Card elevation="sm">
        <h3 style={{ fontSize: 19, display: "flex", alignItems: "center", gap: 8 }}>
          <ImagePlus size={18} strokeWidth={1.75} /> 갤러리 관리
        </h3>
        <p style={{ marginTop: 6, fontSize: 13, color: "var(--text-muted)" }}>
          시술 사진을 올리면 홈페이지 갤러리에 바로 표시돼요. (이미지 8MB 이하)
        </p>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: 14,
          }}
        >
          <div className="select-wrap" style={{ width: 150 }}>
            <select value={upCategory} onChange={(e) => setUpCategory(e.target.value)}>
              {GALLERY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
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
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setUpFile(e.target.files?.[0] ?? null)}
            style={{ fontSize: 13.5, fontFamily: "var(--font-sans)" }}
          />
          <Button size="sm" disabled={!upFile || uploading} onClick={uploadGallery}>
            {uploading ? "업로드 중…" : "업로드"}
          </Button>
        </div>
        {galleryError && (
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
            {galleryError}
          </p>
        )}
        {gallery.length === 0 ? (
          <p style={{ fontSize: 13.5, color: "var(--text-muted)", padding: "14px 0 4px" }}>
            아직 올린 사진이 없어요. 사진이 없으면 갤러리에 기본 이미지가 표시돼요.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: 12,
              marginTop: 18,
            }}
          >
            {gallery.map((g) => (
              <div key={g.id} style={{ position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.image_url}
                  alt={g.category}
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    borderRadius: "var(--radius-md)",
                    display: "block",
                  }}
                />
                <span style={{ position: "absolute", top: 8, left: 8 }}>
                  <Badge tone="brand">{g.category}</Badge>
                </span>
                <button
                  aria-label="삭제"
                  onClick={() => deleteGallery(g.id)}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 28,
                    height: 28,
                    borderRadius: "999px",
                    border: "none",
                    background: "rgba(46,38,32,0.65)",
                    color: "var(--paper)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 사이트 이미지 (홈/시술 카드) */}
      <Card elevation="sm" style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 19, display: "flex", alignItems: "center", gap: 8 }}>
          <Images size={18} strokeWidth={1.75} /> 사이트 이미지
        </h3>
        <p style={{ marginTop: 6, fontSize: 13, color: "var(--text-muted)" }}>
          홈 화면과 시술 카드에 쓰이는 사진이에요. &lsquo;변경&rsquo;으로 교체하고, 언제든
          기본값으로 되돌릴 수 있어요.
        </p>
        {siteError && (
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
            {siteError}
          </p>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 14,
            marginTop: 18,
          }}
        >
          {SITE_IMAGE_SLOTS.map((slot) => {
            const isCustom = !!siteImages[slot.key];
            const busy = siteBusy === slot.key;
            return (
              <div
                key={slot.key}
                style={{
                  border: "1px solid var(--border-soft)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  background: "var(--surface-page)",
                }}
              >
                <div style={{ position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveSiteImage(siteImages, slot.key)}
                    alt={slot.label}
                    style={{
                      width: "100%",
                      aspectRatio: "4 / 3",
                      objectFit: "cover",
                      display: "block",
                      opacity: busy ? 0.5 : 1,
                    }}
                  />
                  {isCustom && (
                    <span style={{ position: "absolute", top: 8, left: 8 }}>
                      <Badge tone="brand">교체됨</Badge>
                    </span>
                  )}
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                    {slot.label}
                  </span>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <label className="btn btn-secondary btn-sm" style={{ cursor: "pointer" }}>
                      {busy ? "처리 중…" : "변경"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        disabled={busy}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void changeSiteImage(slot.key, f);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {isCustom && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={busy}
                        onClick={() => resetSiteImage(slot.key)}
                      >
                        <RotateCcw size={13} strokeWidth={2} /> 기본값
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
