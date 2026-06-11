"use client";

import { useCallback, useEffect, useState } from "react";
import { Images, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DESK_PATH } from "@/lib/constants";
import { SITE_IMAGE_SLOTS, resolveSiteImage } from "@/lib/site-images";

export default function DeskImagesPage() {
  const [siteImages, setSiteImages] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/site-images");
      if (!res.ok) throw new Error();
      setSiteImages(((await res.json()) as { images: Record<string, string> }).images);
    } catch {
      setError("사이트 이미지를 불러오지 못했어요.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function change(key: string, file: File) {
    setBusy(key);
    setError("");
    try {
      const form = new FormData();
      form.append("key", key);
      form.append("file", file);
      const res = await fetch(`/api${DESK_PATH}/site-images`, { method: "POST", body: form });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "업로드에 실패했어요.");
        return;
      }
      void load();
    } catch {
      setError("네트워크 오류가 발생했어요.");
    } finally {
      setBusy(null);
    }
  }

  async function reset(key: string) {
    setBusy(key);
    setError("");
    const res = await fetch(`/api${DESK_PATH}/site-images?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
    });
    setBusy(null);
    if (res.ok) void load();
    else setError("기본값 복원에 실패했어요.");
  }

  return (
    <div className="desk-container">
      <Card elevation="sm">
        <h3 style={{ fontSize: 19, display: "flex", alignItems: "center", gap: 8 }}>
          <Images size={18} strokeWidth={1.75} /> 사이트 이미지
        </h3>
        <p style={{ marginTop: 6, fontSize: 13, color: "var(--text-muted)" }}>
          홈 화면과 시술 카드에 쓰이는 사진이에요. &lsquo;변경&rsquo;으로 교체하고, 언제든
          기본값으로 되돌릴 수 있어요.
        </p>
        {error && (
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
            const isBusy = busy === slot.key;
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
                      opacity: isBusy ? 0.5 : 1,
                    }}
                  />
                  {isCustom && (
                    <span style={{ position: "absolute", top: 8, left: 8 }}>
                      <Badge tone="brand">교체됨</Badge>
                    </span>
                  )}
                </div>
                <div
                  style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                    {slot.label}
                  </span>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <label className="btn btn-secondary btn-sm" style={{ cursor: "pointer" }}>
                      {isBusy ? "처리 중…" : "변경"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        disabled={isBusy}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void change(slot.key, f);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {isCustom && (
                      <Button size="sm" variant="ghost" disabled={isBusy} onClick={() => reset(slot.key)}>
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
