import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "prefix"> {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: ReactNode;
}

export function Input({ label, hint, error, prefix, id, ...rest }: InputProps) {
  const fieldId = id || (label ? `in-${label}` : undefined);
  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={fieldId}>
          {label}
        </label>
      )}
      <div className={`field-box${error ? " is-error" : ""}`}>
        {prefix && <span className="field-prefix">{prefix}</span>}
        <input id={fieldId} {...rest} />
      </div>
      {(hint || error) && (
        <span className={error ? "field-error-text" : "field-hint"}>{error || hint}</span>
      )}
    </div>
  );
}
