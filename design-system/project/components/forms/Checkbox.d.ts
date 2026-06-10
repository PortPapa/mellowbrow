import * as React from "react";

export interface CheckboxProps {
  /** Checked state (controlled). */
  checked?: boolean;
  /** Called with the next boolean value. */
  onChange?: (next: boolean) => void;
  /** Inline label to the right. */
  label?: React.ReactNode;
  disabled?: boolean;
}

/** Soft square checkbox with warm mocha fill. */
export function Checkbox(props: CheckboxProps): JSX.Element;
