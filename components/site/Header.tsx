"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Instagram, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { INSTAGRAM_URL } from "@/lib/constants";

const NAV = [
  { href: "/", label: "홈" },
  { href: "/services", label: "시술 안내" },
  { href: "/gallery", label: "갤러리" },
  { href: "/booking", label: "예약" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" aria-label="mellowbrow 홈" onClick={() => setOpen(false)}>
          <Logo variant="full" size={24} />
        </Link>

        <nav className="site-nav">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={isActive(n.href) ? "is-active" : ""}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <a
            className="header-insta"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="인스타그램"
          >
            <Instagram size={20} strokeWidth={1.75} />
          </a>
          <Button size="sm" href="/booking">
            예약하기
          </Button>
          <button
            className="menu-toggle"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      <nav className={`mobile-nav${open ? " is-open" : ""}`}>
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={isActive(n.href) ? "is-active" : ""}
            onClick={() => setOpen(false)}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
