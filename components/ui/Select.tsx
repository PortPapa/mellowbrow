import type { ComponentPropsWithoutRef } from "react";

type Option = string | { value: string; label: string };

interface SelectProps extends ComponentPropsWithoutRef<"select"> {
  label?: string;
  hint?: string;
  options?: Option[];
  placeholder?: string;
}

export function Select({ label, hint, options = [], placeholder, value, id, ...rest }: SelectProps) {
  const fieldId = id || (label ? `sel-${label}` : undefined);
  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={fieldId}>
          {label}
        </label>
      )}
      <div className="select-wrap">
        <select id={fieldId} value={value} className={value ? "" : "is-placeholder"} {...rest}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => {
            const val = typeof o === "string" ? o : o.value;
            const lab = typeof o === "string" ? o : o.label;
            return (
              <option key={val} value={val}>
                {lab}
              </option>
            );
          })}
        </select>
        <svg
          className="select-chevron"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}
