import React from "react";

/**
 * Mellowbrow Button — the primary call-to-action.
 * Soft pill by default; warm mocha fill for primary.
 */
export function Button({
  variant = "primary",
  size = "md",
  pill = true,
  full = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  children,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: "8px 16px", fontSize: "13px", height: 36, gap: 7 },
    md: { padding: "11px 22px", fontSize: "14px", height: 44, gap: 8 },
    lg: { padding: "15px 30px", fontSize: "15px", height: 54, gap: 10 },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary: {
      background: "var(--primary)",
      color: "var(--on-primary)",
      border: "1px solid transparent",
    },
    secondary: {
      background: "var(--surface-card)",
      color: "var(--text-primary)",
      border: "1px solid var(--border-strong)",
    },
    ghost: {
      background: "transparent",
      color: "var(--primary)",
      border: "1px solid transparent",
    },
    quiet: {
      background: "var(--primary-soft)",
      color: "var(--mocha-800)",
      border: "1px solid transparent",
    },
  };
  const v = variants[variant] || variants.primary;

  return (
    <button
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        fontSize: s.fontSize,
        letterSpacing: "0.01em",
        lineHeight: 1,
        whiteSpace: "nowrap",
        padding: s.padding,
        minHeight: s.height,
        width: full ? "100%" : "auto",
        borderRadius: pill ? "var(--radius-pill)" : "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur) var(--ease-out)",
        ...v,
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.975)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
