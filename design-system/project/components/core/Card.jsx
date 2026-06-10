import React from "react";

/**
 * Mellowbrow Card — warm surface container with soft elevation.
 */
export function Card({
  elevation = "sm",
  padded = true,
  interactive = false,
  children,
  style = {},
  ...rest
}) {
  const shadows = {
    none: "none",
    xs: "var(--shadow-xs)",
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)",
  };
  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-soft)",
        borderRadius: "var(--radius-card)",
        boxShadow: shadows[elevation] || shadows.sm,
        padding: padded ? "var(--space-5)" : 0,
        transition: "box-shadow var(--dur) var(--ease-out), transform var(--dur) var(--ease-out)",
        cursor: interactive ? "pointer" : "default",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (interactive) {
          e.currentTarget.style.boxShadow = shadows.md;
          e.currentTarget.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        if (interactive) {
          e.currentTarget.style.boxShadow = shadows[elevation] || shadows.sm;
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
