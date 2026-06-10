import type { Metadata } from "next";
import { Section } from "@/components/site/Section";
import { BookingForm } from "./BookingForm";

export const metadata: Metadata = {
  title: "예약",
  description: "멜로우브로우 예약 신청. 원하시는 날짜와 시간을 선택해 주세요. 100% 예약제로 운영합니다.",
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
