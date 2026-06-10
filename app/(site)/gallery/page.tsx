"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/site/Section";
import { Photo } from "@/components/site/Photo";

const TABS = ["전체", "자연눈썹", "콤보", "섀도우", "입술"];

const ITEMS: [string, "a" | "b" | "c" | "d"][] = [
  ["자연눈썹", "a"],
  ["콤보", "b"],
  ["섀도우", "c"],
  ["입술", "b"],
  ["자연눈썹", "d"],
  ["콤보", "a"],
  ["섀도우", "c"],
  ["자연눈썹", "b"],
];

export default function GalleryPage() {
  const [filter, setFilter] = useState("전체");
  const shown = filter === "전체" ? ITEMS : ITEMS.filter((i) => i[0].includes(filter));

  return (
    <div>
      <Section>
        <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto" }}>
          <span className="mb-eyebrow">Gallery</span>
          <h1 style={{ fontSize: "var(--fs-display-md)", marginTop: 16 }}>전후 갤러리</h1>
          <p
            style={{
              marginTop: 16,
              fontSize: 16,
              lineHeight: 1.8,
              color: "var(--text-secondary)",
            }}
          >
            실제 시술 전후 사진입니다. 모든 사진은 고객 동의 후 게시되었습니다.
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

        <div className="grid-4" style={{ marginTop: 36 }}>
          {shown.map((it, i) => (
            <div key={`${it[0]}-${i}`} style={{ position: "relative" }}>
              <Photo ratio="5 / 6" variant={it[1]} radius="var(--radius-lg)" />
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

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Button size="lg" href="/booking">
            나도 예약하기
          </Button>
        </div>
      </Section>
    </div>
  );
}
