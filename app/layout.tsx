import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "mellowbrow · 멜로브로우 — 자연눈썹 반영구 스튜디오",
    template: "%s · mellowbrow",
  },
  description:
    "결을 살린 자연스러운 눈썹. 얼굴형과 분위기에 꼭 맞는 1:1 맞춤 디자인, 100% 예약제로 운영하는 브로우 아틀리에 멜로브로우입니다.",
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
