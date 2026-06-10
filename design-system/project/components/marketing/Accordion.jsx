import React from "react";

/**
 * Mellowbrow Accordion — quiet FAQ list with soft expand.
 * items: [{ q, a }]
 */
export function Accordion({ items = [], defaultOpen = 0, style = {} }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ fontFamily: "var(--font-sans)", ...style }}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ borderBottom: "1px solid var(--border-default)" }}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 16, padding: "20px 4px", background: "transparent", border: "none",
                cursor: "pointer", textAlign: "left",
                fontSize: 16, fontWeight: 600, color: "var(--text-primary)",
              }}
            >
              <span>{it.q}</span>
              <span style={{
                flexShrink: 0, width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: "var(--mocha-600)", transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                transition: "transform var(--dur) var(--ease-out)", fontSize: 22, fontWeight: 300,
              }}>+</span>
            </button>
            <div style={{
              maxHeight: isOpen ? 320 : 0, overflow: "hidden",
              transition: "max-height var(--dur-slow) var(--ease-out), opacity var(--dur) var(--ease-out)",
              opacity: isOpen ? 1 : 0,
            }}>
              <p style={{ padding: "0 4px 22px", fontSize: 14.5, lineHeight: 1.7, color: "var(--text-secondary)" }}>{it.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
