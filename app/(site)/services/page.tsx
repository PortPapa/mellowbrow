import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Accordion } from "@/components/ui/Accordion";
import { Section } from "@/components/site/Section";

export const metadata: Metadata = {
  title: "시술 안내",
  description: "멜로우브로우의 시술 메뉴와 가격 안내. 모든 시술은 1:1 맞춤 상담 후 진행됩니다.",
};

// [한글명, 영문 라벨, 태그, 설명, 가격, 비고]
const SERVICES: [string, string, string | null, string, string, string | undefined][] = [
  ["자연눈썹", "Natural", "시그니처", "결을 한 올씩 살린 가장 자연스러운 디자인.", "₩120,000", "현금가 · 리터치 미포함"],
  ["콤보눈썹", "Combo", null, "자연결 위에 음영을 더해 또렷하게.", "₩150,000", "현금가 · 리터치 미포함"],
  ["수지눈썹", "Suji", "인기", "은은한 음영으로 메이크업한 듯 풍성하게.", "₩170,000", "현금가 · 리터치 미포함"],
  ["눈썹 추가 리터치", "Retouch", null, "신규 2개월 이내 · 재방문 유지터치 3개월 이내 방문 시.", "₩50,000", undefined],
  ["아이라인", "Eyeline", null, "또렷하고 깊은 눈매를 자연스럽게.", "₩100,000", undefined],
  ["입술 틴트립", "Tint Lip", null, "입술 비대칭 · 어두운 입술 톤업 · 창백한 입술.", "₩400,000", undefined],
  ["SMP 두피문신", "SMP", null, "헤어라인 · 가르마 · 정수리 · M자 · 흉터커버 · 구렛나루.", "1부위 ₩300,000~", "2부위 이상 견적문의"],
  ["미인점", "Beauty Spot", null, "포인트가 되어주는 자연스러운 미인점.", "₩20,000", undefined],
  ["블랙틴트 케라틴펌", "Keratin Perm", null, "클리닉 + 블랙틴트로 결을 살린 브로우 펌.", "₩40,000", undefined],
];

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
    a: "눈썹 추가 리터치는 50,000원으로, 신규 시술 후 2개월 이내 또는 재방문 유지터치 3개월 이내 방문 시 받으실 수 있어요.",
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

export default function ServicesPage() {
  return (
    <div>
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
          {SERVICES.map(([ko, en, tag, desc, price, duration]) => (
            <ServiceCard
              key={ko}
              titleKo={ko}
              titleEn={en}
              tag={tag}
              description={desc}
              price={price}
              duration={duration}
              href={`/booking?service=${encodeURIComponent(ko)}`}
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
