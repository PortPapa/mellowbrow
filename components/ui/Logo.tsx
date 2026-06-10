import type { CSSProperties } from "react";

/** mellow brow 워드마크 — 실제 로고(클린 산세리프 소문자)를 타이포로 재현 */
export function Logo({
  variant = "full",
  size = 28,
  color = "var(--text-primary)",
  tagline = false,
  style,
}: {
  variant?: "full" | "stacked" | "mono";
  size?: number;
  color?: string;
  tagline?: boolean;
  style?: CSSProperties;
}) {
  if (variant === "mono") {
    return (
      <span
        style={{
          width: size,
          height: size,
          borderRadius: "999px",
          background: "var(--primary)",
          color: "var(--paper)",
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: size * 0.56,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
      >
        m
      </span>
    );
  }
  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: variant === "stacked" ? "center" : "flex-start",
        gap: 3,
        lineHeight: 1,
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: size * 0.92,
          letterSpacing: "-0.01em",
          color,
          whiteSpace: "nowrap",
        }}
      >
        mellow brow
      </span>
      {(tagline || variant === "stacked") && (
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: Math.max(8, size * 0.26),
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          Brow Atelier
        </span>
      )}
    </span>
  );
}
