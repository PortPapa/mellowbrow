"use client";

import type { ReactNode } from "react";

export function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
}: {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <label
      className={`checkbox${checked ? " is-checked" : ""}${disabled ? " is-disabled" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) onChange?.(!checked);
      }}
    >
      <span className="checkbox-box" role="checkbox" aria-checked={checked}>
        {checked && (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--paper)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
