import * as React from "react";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Field label shown above the input. */
  label?: string;
  /** Helper text below the field. */
  hint?: string;
  /** Error message — also turns the border red. */
  error?: string;
  /** Leading adornment (e.g. "₩" or an icon). */
  prefix?: React.ReactNode;
  /** @default "md" */
  size?: "md" | "lg";
}

/** Labeled text field with warm focus ring. */
export function Input(props: InputProps): JSX.Element;
