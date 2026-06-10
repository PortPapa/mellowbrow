import type { CSSProperties } from "react";

/** 사진 블록 — src가 있으면 이미지를, 없으면 웜 그라데이션 플레이스홀더를 렌더링.
 *  현재 이미지는 Pexels 무료 스톡 더미 — 실제 스튜디오 사진 수령 시 교체. */
export function Photo({
  ratio = "4 / 3",
  variant = "a",
  label,
  radius = "var(--radius-lg)",
  src,
  alt = "",
  style,
}: {
  ratio?: string;
  variant?: "a" | "b" | "c" | "d";
  label?: string;
  radius?: string;
  src?: string;
  alt?: string;
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
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
      {!src && label && (
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
