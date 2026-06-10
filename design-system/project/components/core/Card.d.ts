import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Resting shadow depth. @default "sm" */
  elevation?: "none" | "xs" | "sm" | "md" | "lg";
  /** Apply default inner padding. @default true */
  padded?: boolean;
  /** Lift + deepen shadow on hover. @default false */
  interactive?: boolean;
  children?: React.ReactNode;
}

/** Warm white surface container with soft, warm-tinted elevation. */
export function Card(props: CardProps): JSX.Element;
