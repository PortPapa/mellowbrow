import type { Metadata } from "next";
import { Section } from "@/components/site/Section";
import { ManageClient } from "./ManageClient";

export const metadata: Metadata = {
  title: "예약 조회·취소",
  description: "예약하신 성함과 연락처로 예약을 확인하고 취소할 수 있어요.",
  robots: { index: false, follow: false }, // 개인 유틸 페이지 — 검색 노출 불필요
};

export default function ManagePage() {
  return (
    <Section>
      <ManageClient />
    </Section>
  );
}
