/* global React */
// Mellowbrow website — Before/After gallery

function Gallery({ onNavigate }) {
  const { Badge, Button } = window.MellowbrowDesignSystem_20fe7e;
  const { Section, Photo } = window;
  const [filter, setFilter] = React.useState("전체");
  const tabs = ["전체", "자연눈썹", "콤보", "섀도우", "입술"];

  const items = [
    ["자연눈썹", "a", "5 / 6"], ["콤보", "b", "5 / 6"], ["섀도우", "c", "5 / 6"],
    ["입술", "b", "5 / 6"], ["자연눈썹", "d", "5 / 6"], ["콤보", "a", "5 / 6"],
    ["섀도우", "c", "5 / 6"], ["자연눈썹", "b", "5 / 6"],
  ];
  const shown = filter === "전체" ? items : items.filter((i) => i[0].includes(filter));

  return (
    <div>
      <Section>
        <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto" }}>
          <span className="mb-eyebrow">Gallery</span>
          <h1 style={{ fontSize: "var(--fs-display-md)", marginTop: 16 }}>전후 갤러리</h1>
          <p style={{ marginTop: 16, fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            실제 시술 전후 사진입니다. 모든 사진은 고객 동의 후 게시되었습니다.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 36, flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: "8px 18px", borderRadius: "var(--radius-pill)", cursor: "pointer", whiteSpace: "nowrap",
              fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 600,
              border: "1px solid " + (filter === t ? "transparent" : "var(--border-strong)"),
              background: filter === t ? "var(--primary)" : "transparent",
              color: filter === t ? "var(--on-primary)" : "var(--text-secondary)",
              transition: "all var(--dur) var(--ease-out)",
            }}>{t}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginTop: 36 }}>
          {shown.map((it, i) => (
            <div key={i} style={{ position: "relative" }}>
              <Photo ratio={it[2]} variant={it[1]} radius="var(--radius-lg)" />
              <div style={{ position: "absolute", top: 12, left: 12 }}>
                <Badge tone="brand">{it[0]}</Badge>
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex" }}>
                <span style={{ flex: 1, textAlign: "center", padding: "6px 0", fontSize: 11, fontWeight: 600, color: "var(--paper)", background: "color-mix(in oklab, var(--mocha-900) 55%, transparent)", borderRadius: "0 0 0 var(--radius-lg)" }}>BEFORE</span>
                <span style={{ flex: 1, textAlign: "center", padding: "6px 0", fontSize: 11, fontWeight: 600, color: "var(--paper)", background: "color-mix(in oklab, var(--mocha-700) 55%, transparent)", borderRadius: "0 0 var(--radius-lg) 0" }}>AFTER</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Button size="lg" onClick={() => onNavigate("booking")}>나도 예약하기</Button>
        </div>
      </Section>
    </div>
  );
}

window.Gallery = Gallery;
