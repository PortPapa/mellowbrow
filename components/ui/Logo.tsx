import type { CSSProperties } from "react";

/** mellowbrow 타이포 워드마크 — 실제 로고 수령 시 교체 예정 */
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
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
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
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: size,
          letterSpacing: "0.01em",
          color,
        }}
      >
        mellow
        <span style={{ fontStyle: "italic", color: "var(--mocha-600)" }}>brow</span>
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
