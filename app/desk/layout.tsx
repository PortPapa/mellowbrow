import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "데스크",
  robots: { index: false, follow: false },
};

export default function DeskLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ minHeight: "100vh", background: "var(--surface-sunken)" }}>{children}</div>;
}
