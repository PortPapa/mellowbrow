import type { Metadata } from "next";
import { Section } from "@/components/site/Section";
import { BookingForm } from "./BookingForm";

export const metadata: Metadata = {
  title: "예약 — 천호역 눈썹문신",
  description:
    "천호역 눈썹문신 멜로우브로우 예약 신청. 캘린더에서 원하시는 날짜와 시간을 바로 선택하세요. 100% 예약제, 매주 월요일 휴무.",
  alternates: { canonical: "/booking" },
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  return (
    <Section>
      <BookingForm initialService={service ?? ""} />
    </Section>
  );
}
