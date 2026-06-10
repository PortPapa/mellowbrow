import React from "react";

/**
 * Mellowbrow Input — labeled text field with warm styling.
 */
export function Input({
  label,
  hint,
  error,
  prefix = null,
  size = "md",
  style = {},
  id,
  ...rest
}) {
  const fieldId = id || (label ? `in-${label}` : undefined);
  const pad = size === "lg" ? "14px 16px" : "11px 14px";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7, fontFamily: "var(--font-sans)" }}>
      {label && (
        <label htmlFor={fieldId} style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.01em" }}>{label}</label>
      )}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "var(--surface-card)",
        border: `1px solid ${error ? "var(--error)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-md)",
        padding: pad,
        transition: "border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)",
      }}
        onFocus={(e) => { if (!error) { e.currentTarget.style.borderColor = "var(--mocha-500)"; e.currentTarget.style.boxShadow = "var(--shadow-focus)"; } }}
        onBlur={(e) => { e.currentTarget.style.borderColor = error ? "var(--error)" : "var(--border-default)"; e.currentTarget.style.boxShadow = "none"; }}
      >
        {prefix && <span style={{ color: "var(--text-muted)", fontSize: 14 }}>{prefix}</span>}
        <input
          id={fieldId}
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            fontFamily: "inherit", fontSize: 15, color: "var(--text-primary)", minWidth: 0, ...style,
          }}
          {...rest}
        />
      </div>
      {(hint || error) && (
        <span style={{ fontSize: 12, color: error ? "var(--error)" : "var(--text-muted)" }}>{error || hint}</span>
      )}
    </div>
  );
}
