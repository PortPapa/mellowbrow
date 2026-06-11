import type { Metadata } from "next";
import { GalleryClient } from "./GalleryClient";

export const metadata: Metadata = {
  title: "시술 갤러리 — 천호 눈썹문신 전후 사진",
  description:
    "강동구 천호 눈썹문신 멜로우브로우의 실제 시술 사진. 자연눈썹·콤보눈썹·수지눈썹·입술 비포/애프터를 확인해 보세요.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
