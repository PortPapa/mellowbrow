"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { DESK_PATH } from "@/lib/constants";

const TABS = [
  { href: DESK_PATH, label: "예약" },
  { href: `${DESK_PATH}/gallery`, label: "갤러리" },
  { href: `${DESK_PATH}/images`, label: "사이트 이미지" },
  { href: `${DESK_PATH}/stats`, label: "기록·통계" },
];

export function DeskNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.startsWith(`${DESK_PATH}/login`)) return null;

  async function logout() {
    await fetch(`/api${DESK_PATH}/login`, { method: "DELETE" });
    router.replace(`${DESK_PATH}/login`);
  }

  return (
    <div className="desk-nav">
      <div className="desk-nav-inner">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo variant="full" size={20} />
          <span className="mb-eyebrow">Desk</span>
        </Link>
        <nav className="desk-tabs">
          {TABS.map((t) => {
            const active = t.href === DESK_PATH ? pathname === DESK_PATH : pathname.startsWith(t.href);
            return (
              <Link key={t.href} href={t.href} className={active ? "is-active" : ""}>
                {t.label}
              </Link>
            );
          })}
        </nav>
        <Button size="sm" variant="ghost" onClick={logout}>
          <LogOut size={14} strokeWidth={2} /> 로그아웃
        </Button>
      </div>
    </div>
  );
}
