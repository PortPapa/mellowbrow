import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "quiet";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children?: ReactNode;
}

type ButtonAsButton = BaseProps & ComponentPropsWithoutRef<"button"> & { href?: undefined };
type ButtonAsLink = BaseProps & { href: string };

function classes({ variant = "primary", size = "md", full, className }: BaseProps) {
  return ["btn", `btn-${variant}`, `btn-${size}`, full ? "btn-full" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  if (typeof props.href === "string") {
    const { variant, size, full, iconLeft, iconRight, className, children, href } =
      props as ButtonAsLink;
    return (
      <Link href={href} className={classes({ variant, size, full, className })}>
        {iconLeft}
        {children}
        {iconRight}
      </Link>
    );
  }
  const { variant, size, full, iconLeft, iconRight, className, children, ...rest } =
    props as ButtonAsButton;
  return (
    <button className={classes({ variant, size, full, className })} {...rest}>
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
