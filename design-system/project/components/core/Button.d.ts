import * as React from "react";

/**
 * Primary call-to-action button for Mellowbrow.
 * @startingPoint section="Core" subtitle="Pill CTA in mocha, blush & ghost variants" viewport="700x150"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default "primary" */
  variant?: "primary" | "secondary" | "ghost" | "quiet";
  /** Size. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Fully rounded pill shape. @default true */
  pill?: boolean;
  /** Stretch to container width. @default false */
  full?: boolean;
  disabled?: boolean;
  /** Node rendered before the label (e.g. an icon). */
  iconLeft?: React.ReactNode;
  /** Node rendered after the label. */
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
