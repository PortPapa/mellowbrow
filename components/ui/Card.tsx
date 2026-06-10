import type { CSSProperties, ReactNode } from "react";

export function Card({
  elevation = "sm",
  padded = true,
  interactive = false,
  children,
  style,
  className,
}: {
  elevation?: "none" | "xs" | "sm" | "md" | "lg";
  padded?: boolean;
  interactive?: boolean;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  const cls = [
    "card",
    `card-${elevation}`,
    padded ? "card-padded" : "",
    interactive ? "card-interactive" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls} style={style}>
      {children}
    </div>
  );
}
