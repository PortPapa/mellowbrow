import type { Metadata, Viewport } from "next";
import { INSTAGRAM_URL, SITE_URL } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "mellowbrow · 멜로우브로우 — 천호 눈썹문신 · 자연눈썹 반영구 스튜디오",
    template: "%s · mellowbrow",
  },
  description:
    "천호역 도보 5분, 강동구 눈썹문신 멜로우브로우. 결을 살린 자연눈썹·콤보눈썹·수지눈썹, 1:1 맞춤 디자인, 100% 예약제로 운영합니다.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "mellowbrow · 멜로우브로우",
    title: "멜로우브로우 — 천호 눈썹문신 · 자연눈썹 반영구 스튜디오",
    description:
      "천호역 도보 5분, 강동구 눈썹문신 멜로우브로우. 자연눈썹·콤보눈썹·수지눈썹 1:1 맞춤 디자인, 100% 예약제.",
    url: SITE_URL,
    images: [{ url: "/photos/hero.jpg", width: 1200, height: 1500, alt: "멜로우브로우 자연눈썹" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "멜로우브로우 — 천호 눈썹문신 · 자연눈썹 반영구 스튜디오",
    description: "천호역 도보 5분, 강동구 눈썹문신 멜로우브로우. 100% 예약제.",
    images: ["/photos/hero.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// 로컬 SEO — 구글이 업체 정보(위치·영업시간·업종)를 이해하도록 하는 구조화 데이터.
// ⚠️ 정확한 도로명 주소(streetAddress)와 좌표는 사장님 확인 후 채워주세요. 좌표는 현재 천호역 기준 근사값.
const LOCAL_BUSINESS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "@id": `${SITE_URL}/#business`,
  name: "멜로우브로우 (mellowbrow)",
  description:
    "천호역 도보 5분, 서울 강동구의 눈썹문신·반영구 화장 스튜디오. 자연눈썹, 콤보눈썹, 수지눈썹, 아이라인, 입술 틴트립을 1:1 맞춤 디자인과 100% 예약제로 시술합니다.",
  url: SITE_URL,
  image: `${SITE_URL}/photos/hero.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "강동구",
    addressRegion: "서울특별시",
    streetAddress: "천호동 (천호역 도보 5분)",
    addressCountry: "KR",
  },
  geo: { "@type": "GeoCoordinates", latitude: 37.5384, longitude: 127.1235 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "11:00",
      closes: "20:00",
    },
  ],
  priceRange: "₩₩",
  areaServed: ["천호동", "강동구", "하남시", "서울"],
  sameAs: [INSTAGRAM_URL],
  potentialAction: {
    "@type": "ReserveAction",
    target: `${SITE_URL}/booking`,
    name: "예약 신청",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSONLD) }}
        />
        {children}
      </body>
    </html>
  );
}
