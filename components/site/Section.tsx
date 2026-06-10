import type { CSSProperties, ReactNode } from "react";

export function Section({
  children,
  bg = "var(--surface-page)",
  style,
}: {
  children: ReactNode;
  bg?: string;
  style?: CSSProperties;
}) {
  return (
    <section className="mb-section" style={{ background: bg, ...style }}>
      <div className="mb-container">{children}</div>
    </section>
  );
}
