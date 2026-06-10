"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/site/Section";
import { Photo } from "@/components/site/Photo";
import type { GalleryItem } from "@/lib/db";

const TABS = ["전체", "자연눈썹", "콤보눈썹", "수지눈썹", "입술"];

// 데스크에서 올린 사진이 없을 때 보여줄 기본(더미) 이미지
const FALLBACK: [string, string][] = [
  ["자연눈썹", "/photos/natural.jpg"],
  ["콤보눈썹", "/photos/combo.jpg"],
  ["수지눈썹", "/photos/suji.jpg"],
  ["입술", "/photos/lips.jpg"],
  ["자연눈썹", "/photos/hero.jpg"],
  ["콤보눈썹", "/photos/gallery2.jpg"],
  ["수지눈썹", "/photos/gallery1.jpg"],
  ["자연눈썹", "/photos/retouch.jpg"],
];

export default function GalleryPage() {
  const [filter, setFilter] = useState("전체");
  const [items, setItems] = useState<GalleryItem[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/gallery")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { items: GalleryItem[] }) => {
        if (alive) setItems(d.items);
      })
      .catch(() => {
        if (alive) setItems([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const useUploads = !!items && items.length > 0;

  const shownUploads = useUploads
    ? items.filter((i) => filter === "전체" || i.category === filter)
    : [];
  const shownFallback = !useUploads
    ? FALLBACK.filter((i) => filter === "전체" || i[0] === filter)
    : [];

  return (
    <div>
      <Section>
        <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto" }}>
          <span className="mb-eyebrow">Gallery</span>
          <h1 style={{ fontSize: "var(--fs-display-md)", marginTop: 16 }}>시술 갤러리</h1>
          <p
            style={{
              marginTop: 16,
              fontSize: 16,
              lineHeight: 1.8,
              color: "var(--text-secondary)",
            }}
          >
            실제 시술 사진입니다. 모든 사진은 고객 동의 후 게시되었습니다.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginTop: 36,
            flexWrap: "wrap",
          }}
        >
          {TABS.map((t) => (
            <button
              key={t}
              className={`filter-pill${filter === t ? " is-active" : ""}`}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {items === null && (
          <p style={{ textAlign: "center", marginTop: 48, fontSize: 14, color: "var(--text-muted)" }}>
            갤러리를 불러오는 중…
          </p>
        )}

        {useUploads && (
          <div className="grid-4" style={{ marginTop: 36 }}>
            {shownUploads.map((it) => (
              <div key={it.id} style={{ position: "relative" }}>
                <Photo ratio="5 / 6" src={it.image_url} alt={`${it.category} 시술 사진`} radius="var(--radius-lg)" />
                <div style={{ position: "absolute", top: 12, left: 12 }}>
                  <Badge tone="brand">{it.category}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
        {useUploads && shownUploads.length === 0 && (
          <p style={{ textAlign: "center", marginTop: 48, fontSize: 14, color: "var(--text-muted)" }}>
            이 분류의 사진이 아직 없어요.
          </p>
        )}

        {items !== null && !useUploads && (
          <div className="grid-4" style={{ marginTop: 36 }}>
            {shownFallback.map((it, i) => (
              <div key={`${it[0]}-${i}`} style={{ position: "relative" }}>
                <Photo ratio="5 / 6" src={it[1]} alt={`${it[0]} 시술 전후`} radius="var(--radius-lg)" />
                <div style={{ position: "absolute", top: 12, left: 12 }}>
                  <Badge tone="brand">{it[0]}</Badge>
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex" }}>
                  <span
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "6px 0",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--paper)",
                      background: "color-mix(in oklab, var(--mocha-900) 55%, transparent)",
                      borderRadius: "0 0 0 var(--radius-lg)",
                    }}
                  >
                    BEFORE
                  </span>
                  <span
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "6px 0",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--paper)",
                      background: "color-mix(in oklab, var(--mocha-700) 55%, transparent)",
                      borderRadius: "0 0 var(--radius-lg) 0",
                    }}
                  >
                    AFTER
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Button size="lg" href="/booking">
            나도 예약하기
          </Button>
        </div>
      </Section>
    </div>
  );
}
