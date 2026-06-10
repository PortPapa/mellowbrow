import * as React from "react";

export interface SelectOption { value: string; label: string; }

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  /** Options as strings or {value,label}. */
  options?: (string | SelectOption)[];
  /** Empty-value placeholder option. */
  placeholder?: string;
}

/** Labeled dropdown with warm chevron. */
export function Select(props: SelectProps): JSX.Element;
