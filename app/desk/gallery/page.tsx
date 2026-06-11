"use client";

import { useCallback, useEffect, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DESK_PATH, GALLERY_CATEGORIES } from "@/lib/constants";
import type { GalleryItem } from "@/lib/db";

export default function DeskGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [upCategory, setUpCategory] = useState<string>(GALLERY_CATEGORIES[0]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error();
      setGallery(((await res.json()) as { items: GalleryItem[] }).items);
    } catch {
      setError("갤러리를 불러오지 못했어요.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function upload() {
    if (!beforeFile || uploading) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("before", beforeFile);
      if (afterFile) form.append("after", afterFile);
      form.append("category", upCategory);
      const res = await fetch(`/api${DESK_PATH}/gallery`, { method: "POST", body: form });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "업로드에 실패했어요.");
        return;
      }
      setBeforeFile(null);
      setAfterFile(null);
      void load();
    } catch {
      setError("네트워크 오류가 발생했어요.");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api${DESK_PATH}/gallery?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) void load();
    else setError("삭제에 실패했어요.");
  }

  return (
    <div className="desk-container">
      <Card elevation="sm">
        <h3 style={{ fontSize: 19, display: "flex", alignItems: "center", gap: 8 }}>
          <ImagePlus size={18} strokeWidth={1.75} /> 갤러리 관리
        </h3>
        <p style={{ marginTop: 6, fontSize: 13, color: "var(--text-muted)" }}>
          비포·애프터 사진을 함께 올리면 갤러리에서 마우스를 올렸을 때 애프터로 부드럽게
          전환돼요. 애프터는 선택사항이에요. (이미지 각 8MB 이하)
        </p>
        <div
          style={{ display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap", marginTop: 14 }}
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
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
              비포 (필수)
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBeforeFile(e.target.files?.[0] ?? null)}
              style={{ fontSize: 13, fontFamily: "var(--font-sans)" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
              애프터 (선택)
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAfterFile(e.target.files?.[0] ?? null)}
              style={{ fontSize: 13, fontFamily: "var(--font-sans)" }}
            />
          </div>
          <Button size="sm" disabled={!beforeFile || uploading} onClick={upload}>
            {uploading ? "업로드 중…" : "업로드"}
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
              marginTop: 12,
            }}
          >
            {error}
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
                <span style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 4 }}>
                  <Badge tone="brand">{g.category}</Badge>
                  {g.after_image_url && <Badge tone="accent">B/A</Badge>}
                </span>
                <button
                  aria-label="삭제"
                  onClick={() => remove(g.id)}
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
    </div>
  );
}
