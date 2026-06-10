import type { CSSProperties, ReactNode } from "react";

export function Badge({
  tone = "neutral",
  children,
  style,
}: {
  tone?: "neutral" | "brand" | "accent" | "success" | "error";
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span className={`badge badge-${tone}`} style={style}>
      {children}
    </span>
  );
}
