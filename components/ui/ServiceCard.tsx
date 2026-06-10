import Link from "next/link";

/** 시술 메뉴 카드 — image 미지정 시 웜 그라데이션 플레이스홀더 (실사진 교체 예정) */
export function ServiceCard({
  titleKo,
  titleEn,
  description,
  price,
  duration,
  tag,
  image,
  href,
}: {
  titleKo: string;
  titleEn?: string;
  description?: string;
  price: string;
  duration?: string;
  tag?: string | null;
  image?: string;
  href?: string;
}) {
  const body = (
    <>
      <div
        style={{
          aspectRatio: "4 / 3",
          background: image
            ? `center/cover url(${image})`
            : "linear-gradient(135deg, #EEDFD0, #E0C5B2)",
          position: "relative",
        }}
      >
        {tag && (
          <span
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.02em",
              padding: "5px 10px",
              borderRadius: "var(--radius-pill)",
              background: "rgba(251,247,241,0.92)",
              color: "var(--mocha-800)",
              backdropFilter: "blur(4px)",
              whiteSpace: "nowrap",
            }}
          >
            {tag}
          </span>
        )}
      </div>
      <div style={{ padding: "18px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 500,
              color: "var(--text-primary)",
            }}
          >
            {titleKo}
          </h3>
          {titleEn && (
            <span
              style={{
                fontSize: 12,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              {titleEn}
            </span>
          )}
        </div>
        {description && (
          <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>
            {description}
          </p>
        )}
        <div
          style={{
            marginTop: 16,
            paddingTop: 14,
            borderTop: "1px solid var(--border-soft)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--text-primary)" }}>
            {price}
          </span>
          {duration && (
            <span
              style={{
                fontSize: 12.5,
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
                flexShrink: 0,
                marginLeft: 10,
              }}
            >
              {duration}
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="service-card">
        {body}
      </Link>
    );
  }
  return <div className="service-card">{body}</div>;
}
