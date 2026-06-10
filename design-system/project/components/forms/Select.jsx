import React from "react";

/**
 * Mellowbrow Select — labeled native dropdown with warm chevron.
 */
export function Select({ label, hint, options = [], value, onChange, placeholder, style = {}, id, ...rest }) {
  const fieldId = id || (label ? `sel-${label}` : undefined);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7, fontFamily: "var(--font-sans)" }}>
      {label && <label htmlFor={fieldId} style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>{label}</label>}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <select
          id={fieldId}
          value={value}
          onChange={onChange}
          style={{
            appearance: "none", width: "100%",
            background: "var(--surface-card)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            padding: "12px 40px 12px 14px",
            fontFamily: "inherit", fontSize: 15,
            color: value ? "var(--text-primary)" : "var(--text-placeholder)",
            cursor: "pointer", outline: "none", ...style,
          }}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => {
            const val = typeof o === "string" ? o : o.value;
            const lab = typeof o === "string" ? o : o.label;
            return <option key={val} value={val}>{lab}</option>;
          })}
        </select>
        <svg style={{ position: "absolute", right: 14, pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
      </div>
      {hint && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{hint}</span>}
    </div>
  );
}
