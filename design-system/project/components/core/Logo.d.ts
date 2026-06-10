import * as React from "react";

export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Lockup form. @default "full" */
  variant?: "full" | "stacked" | "mono";
  /** Cap height in px (drives overall scale). @default 28 */
  size?: number;
  /** Wordmark color (mono ignores this). @default text-primary */
  color?: string;
  /** Show the "Brow Atelier" tagline under the word. @default false */
  tagline?: boolean;
}

/** Typographic Mellowbrow wordmark in the brand serif. */
export function Logo(props: LogoProps): JSX.Element;
