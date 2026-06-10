import React from "react";

/**
 * Mellowbrow wordmark logo (typographic). Renders in the brand serif.
 */
export function Logo({ variant = "full", size = 28, color = "var(--text-primary)", tagline = false, style = {}, ...rest }) {
  const wrap = { display: "inline-flex", flexDirection: "column", alignItems: variant === "stacked" ? "center" : "flex-start", gap: 3, lineHeight: 1, ...style };
  const word = { fontFamily: "var(--font-display)", fontWeight: 500, fontSize: size, letterSpacing: "0.01em", color };
  const em = { fontStyle: "italic", color: "var(--mocha-600)" };
  const tag = { fontFamily: "var(--font-sans)", fontSize: Math.max(8, size * 0.26), letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--text-muted)" };

  if (variant === "mono") {
    return (
      <span style={{ width: size, height: size, borderRadius: "999px", background: "var(--primary)", color: "var(--paper)", fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: size * 0.56, display: "inline-flex", alignItems: "center", justifyContent: "center", ...style }} {...rest}>m</span>
    );
  }
  return (
    <span style={wrap} {...rest}>
      <span style={word}>mellow<span style={em}>brow</span></span>
      {(tagline || variant === "stacked") && <span style={tag}>Brow Atelier</span>}
    </span>
  );
}
