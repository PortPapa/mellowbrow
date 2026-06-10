import Link from "next/link";
import { Instagram } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { INSTAGRAM_URL } from "@/lib/constants";

const NAV = [
  { href: "/", label: "홈" },
  { href: "/services", label: "시술 안내" },
  { href: "/gallery", label: "갤러리" },
  { href: "/booking", label: "예약" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Logo variant="full" size={26} color="var(--paper)" />
          <p
            style={{
              marginTop: 16,
              maxWidth: 280,
              fontSize: 14,
              lineHeight: 1.7,
              color: "var(--mocha-300)",
            }}
          >
            결을 살린 자연스러운 눈썹. 1:1 맞춤 디자인, 100% 예약제로 운영합니다.
          </p>
        </div>
        <div className="footer-col">
          <span className="mb-eyebrow" style={{ color: "var(--mocha-400)" }}>
            둘러보기
          </span>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </div>
        <div className="footer-col">
          <span className="mb-eyebrow" style={{ color: "var(--mocha-400)" }}>
            찾아오시는 길
          </span>
          <span style={{ fontSize: 14, color: "var(--mocha-300)", lineHeight: 1.7 }}>
            서울 강남구 · 예약 시 안내
            <br />
            평일 11:00–20:00
            <br />
            주말 예약 문의
          </span>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 14,
              color: "var(--paper)",
              marginTop: 4,
            }}
          >
            <Instagram size={16} strokeWidth={1.75} /> @mellowbrow
          </a>
        </div>
      </div>
      <div className="footer-bottom">© 2026 mellowbrow. All rights reserved.</div>
    </footer>
  );
}
