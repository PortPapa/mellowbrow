import React from "react";

/**
 * Mellowbrow Badge — small status / category label.
 */
export function Badge({ tone = "neutral", soft = true, children, style = {}, ...rest }) {
  const tones = {
    neutral: { bg: "var(--surface-fill)", fg: "var(--text-secondary)", solidBg: "var(--mocha-700)" },
    brand:   { bg: "var(--primary-soft)", fg: "var(--mocha-800)", solidBg: "var(--mocha-700)" },
    accent:  { bg: "var(--accent-soft)", fg: "var(--blush-700)", solidBg: "var(--blush-500)" },
    success: { bg: "var(--success-soft)", fg: "#4F5C39", solidBg: "var(--success)" },
    error:   { bg: "var(--error-soft)", fg: "#8E3C32", solidBg: "var(--error)" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--font-sans)",
        fontSize: "11.5px",
        fontWeight: 600,
        letterSpacing: "0.02em",
        lineHeight: 1,
        whiteSpace: "nowrap",
        padding: "5px 11px",
        borderRadius: "var(--radius-pill)",
        background: soft ? t.bg : t.solidBg,
        color: soft ? t.fg : "var(--paper)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
