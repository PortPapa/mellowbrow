import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color tone. @default "neutral" */
  tone?: "neutral" | "brand" | "accent" | "success" | "error";
  /** Soft tinted fill (vs solid). @default true */
  soft?: boolean;
  children?: React.ReactNode;
}

/** Small pill label for status, category or count. */
export function Badge(props: BadgeProps): JSX.Element;
