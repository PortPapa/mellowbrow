"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/site/Section";
import { Photo } from "@/components/site/Photo";
import type { GalleryItem } from "@/lib/db";

const TABS = ["전체", "자연눈썹", "콤보눈썹", "수지눈썹", "입술"];

// 데스크에서 올린 사진이 없을 때 보여줄 기본(더미) 비포/애프터 쌍
const FALLBACK: { category: string; before: string; after: string }[] = [
  { category: "자연눈썹", before: "/photos/hero.jpg", after: "/photos/natural.jpg" },
  { category: "콤보눈썹", before: "/photos/gallery2.jpg", after: "/photos/combo.jpg" },
  { category: "수지눈썹", before: "/photos/gallery1.jpg", after: "/photos/suji.jpg" },
  { category: "입술", before: "/photos/spot.jpg", after: "/photos/lips.jpg" },
];

/** 비포/애프터 카드 — 호버(데스크톱)·탭(모바일) 시 애프터로 부드럽게 전환 */
function BACard({
  category,
  before,
  after,
}: {
  category: string;
  before: string;
  after?: string | null;
}) {
  const [showAfter, setShowAfter] = useState(false);
  const hasAfter = !!after;
  return (
    <div
      className={`ba-card${hasAfter ? " has-after" : ""}${showAfter ? " is-after" : ""}`}
      onClick={() => hasAfter && setShowAfter((v) => !v)}
    >
      <Photo ratio="5 / 6" src={before} alt={`${category} 시술 전`} radius="var(--radius-lg)" />
      {hasAfter && (
        <div className="ba-after">
          <Photo ratio="5 / 6" src={after!} alt={`${category} 시술 후`} radius="var(--radius-lg)" />
        </div>
      )}
      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>
        <Badge tone="brand">{category}</Badge>
      </div>
      {hasAfter && (
        <span className="ba-chip">
          <span className="ba-chip-before">BEFORE</span>
          <span className="ba-chip-after">AFTER</span>
        </span>
      )}
    </div>
  );
}

export function GalleryClient() {
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
    ? FALLBACK.filter((i) => filter === "전체" || i.category === filter)
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
            실제 시술 사진입니다. 사진 위에 마우스를 올리면 시술 후 모습을 볼 수 있어요.
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
          <>
            <div className="grid-4" style={{ marginTop: 36 }}>
              {shownUploads.map((it) => (
                <BACard
                  key={it.id}
                  category={it.category}
                  before={it.image_url}
                  after={it.after_image_url}
                />
              ))}
            </div>
            {shownUploads.length === 0 && (
              <p
                style={{ textAlign: "center", marginTop: 48, fontSize: 14, color: "var(--text-muted)" }}
              >
                이 분류의 사진이 아직 없어요.
              </p>
            )}
          </>
        )}

        {items !== null && !useUploads && (
          <div className="grid-4" style={{ marginTop: 36 }}>
            {shownFallback.map((it, i) => (
              <BACard
                key={`${it.category}-${i}`}
                category={it.category}
                before={it.before}
                after={it.after}
              />
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
