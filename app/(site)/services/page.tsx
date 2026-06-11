import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Accordion } from "@/components/ui/Accordion";
import { Section } from "@/components/site/Section";
import { CATALOG, durationLabel } from "@/lib/catalog";
import { resolveSiteImage } from "@/lib/site-images";
import { getSiteImageMap } from "@/lib/site-images-server";

export const metadata: Metadata = {
  title: "시술 안내 — 천호 눈썹문신 가격",
  description:
    "천호역 눈썹문신 멜로우브로우 시술 메뉴와 가격 — 자연눈썹 12만, 콤보눈썹 15만, 수지눈썹 17만 (현금가). 아이라인·입술 틴트립·SMP까지 1:1 맞춤 상담 후 진행합니다.",
  alternates: { canonical: "/services" },
};

// 데스크에서 교체한 사이트 이미지를 매 요청 반영
export const dynamic = "force-dynamic";

const FAQ = [
  {
    q: "시술은 얼마나 걸리나요?",
    a: "디자인 상담을 포함해 약 2시간 소요됩니다. 충분히 상의한 뒤 진행하니 시간을 여유 있게 잡아주세요.",
  },
  {
    q: "통증은 어느 정도인가요?",
    a: "마취 연고를 충분히 도포한 뒤 진행해 대부분 견딜 만한 정도입니다. 개인차가 있을 수 있어요.",
  },
  {
    q: "리터치는 어떻게 받나요?",
    a: "눈썹 추가 리터치는 50,000원으로, 신규 시술 후 2개월 이내 또는 재방문 유지터치 3개월 이내 방문 시 받으실 수 있어요. 기간이 지나면 정상가가 적용되고, 타 샵 잔흔 리터칭은 어려우며 신규 비용이 발생해요.",
  },
  {
    q: "지속 기간은 얼마나 되나요?",
    a: "피부 타입과 관리에 따라 보통 1~2년 정도 유지됩니다.",
  },
  {
    q: "예약은 어떻게 하나요?",
    a: "100% 예약제로 운영합니다. 홈페이지 예약 또는 인스타그램 DM으로 신청해 주세요.",
  },
];

// FAQ 리치 결과용 구조화 데이터 (아래 FAQ 아코디언과 동일 내용)
const FAQ_JSONLD = () =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

export default async function ServicesPage() {
  const siteImages = await getSiteImageMap();
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_JSONLD() }} />
      <Section>
        <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto" }}>
          <span className="mb-eyebrow">Service & Pricing</span>
          <h1 style={{ fontSize: "var(--fs-display-md)", marginTop: 16 }}>시술 안내</h1>
          <p
            style={{
              marginTop: 16,
              fontSize: 16,
              lineHeight: 1.8,
              color: "var(--text-secondary)",
            }}
          >
            모든 시술은 충분한 상담 후 1:1 맞춤으로 진행됩니다. 눈썹 가격은 현금가 기준이며,
            리터치는 별도예요.
          </p>
        </div>
        <div className="grid-3" style={{ marginTop: 48 }}>
          {CATALOG.map((s) => (
            <ServiceCard
              key={s.name}
              titleKo={s.name}
              titleEn={s.en}
              tag={s.tag}
              description={s.desc}
              price={s.price}
              duration={s.priceNote ?? durationLabel(s.durationHours)}
              image={resolveSiteImage(siteImages, `service:${s.name}`)}
              href={`/booking?service=${encodeURIComponent(s.name)}`}
            />
          ))}
        </div>
      </Section>

      <Section bg="var(--surface-sunken)">
        <div className="split split-faq">
          <div>
            <span className="mb-eyebrow">FAQ</span>
            <h2 style={{ fontSize: "var(--fs-display-md)", marginTop: 14 }}>자주 묻는 질문</h2>
            <p
              style={{
                marginTop: 16,
                fontSize: 15,
                lineHeight: 1.7,
                color: "var(--text-secondary)",
              }}
            >
              궁금한 점이 더 있다면 인스타그램 DM으로 편하게 문의해 주세요.
            </p>
            <div style={{ marginTop: 22 }}>
              <Button variant="secondary" href="/booking">
                예약 문의
              </Button>
            </div>
          </div>
          <Accordion items={FAQ} />
        </div>
      </Section>
    </div>
  );
}
