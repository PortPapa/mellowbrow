import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "mellowbrow · 멜로우브로우 — 천호 눈썹문신 · 자연눈썹 반영구 스튜디오",
    template: "%s · mellowbrow",
  },
  description:
    "천호역 도보 5분, 강동 눈썹문신 멜로우브로우. 결을 살린 자연눈썹·콤보눈썹·수지눈썹, 1:1 맞춤 디자인, 100% 예약제로 운영합니다.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
