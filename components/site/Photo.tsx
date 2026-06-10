import type { CSSProperties } from "react";

/** 실제 사진이 들어갈 자리의 웜 그라데이션 플레이스홀더.
 *  실사진 수령 시 <img>/next-image로 교체. */
export function Photo({
  ratio = "4 / 3",
  variant = "a",
  label,
  radius = "var(--radius-lg)",
  style,
}: {
  ratio?: string;
  variant?: "a" | "b" | "c" | "d";
  label?: string;
  radius?: string;
  style?: CSSProperties;
}) {
  const grads = {
    a: "linear-gradient(135deg, #EEDFD0, #E0C5B2)",
    b: "linear-gradient(135deg, #F3E7E1, #E3C7B9)",
    c: "linear-gradient(135deg, #EAE0D2, #D4C0A6)",
    d: "linear-gradient(160deg, #E7D6C4, #C9B49A)",
  };
  return (
    <div
      style={{
        aspectRatio: ratio,
        background: grads[variant],
        borderRadius: radius,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {label && (
        <span
          style={{
            position: "absolute",
            bottom: 12,
            left: 14,
            fontSize: 11,
            letterSpacing: "0.06em",
            color: "var(--mocha-700)",
            opacity: 0.7,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
