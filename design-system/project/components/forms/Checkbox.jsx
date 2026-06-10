import React from "react";

/**
 * Mellowbrow Checkbox — soft square check with warm fill.
 */
export function Checkbox({ checked = false, onChange, label, disabled = false, style = {}, ...rest }) {
  return (
    <label style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-primary)",
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, ...style,
    }}>
      <span
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          width: 22, height: 22, borderRadius: "var(--radius-xs)",
          border: `1.5px solid ${checked ? "var(--primary)" : "var(--border-strong)"}`,
          background: checked ? "var(--primary)" : "var(--surface-card)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          transition: "all var(--dur-fast) var(--ease-out)", flexShrink: 0,
        }}
        {...rest}
      >
        {checked && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--paper)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        )}
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
