"use client";

import { useState } from "react";

export function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: { q: string; a: string }[];
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className={`accordion-item${isOpen ? " is-open" : ""}`}>
            <button className="accordion-q" onClick={() => setOpen(isOpen ? -1 : i)}>
              <span>{it.q}</span>
              <span className="accordion-plus">+</span>
            </button>
            <div className="accordion-a">
              <p>{it.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
