// 시술 카탈로그 — 가격/소요시간/이미지의 단일 소스.
// ⚠️ durationHours는 기본값(추정)입니다. 사장님 확인 후 조정하세요.
//    예약 시 [시작시간, 시작시간+durationHours) 만큼 연속으로 시간을 점유합니다.

export interface Service {
  name: string;
  en: string;
  tag: string | null;
  desc: string;
  price: string;
  priceNote?: string;
  durationHours: number;
  image: string;
}

export const CATALOG: Service[] = [
  {
    name: "자연눈썹",
    en: "Natural",
    tag: "시그니처",
    desc: "결을 한 올씩 살린 가장 자연스러운 디자인.",
    price: "₩120,000",
    priceNote: "현금가 · 리터치 미포함",
    durationHours: 2,
    image: "/photos/natural.jpg",
  },
  {
    name: "콤보눈썹",
    en: "Combo",
    tag: null,
    desc: "자연결 위에 음영을 더해 또렷하게.",
    price: "₩150,000",
    priceNote: "현금가 · 리터치 미포함",
    durationHours: 2,
    image: "/photos/combo.jpg",
  },
  {
    name: "수지눈썹",
    en: "Suji",
    tag: "인기",
    desc: "은은한 음영으로 메이크업한 듯 풍성하게.",
    price: "₩170,000",
    priceNote: "현금가 · 리터치 미포함",
    durationHours: 2,
    image: "/photos/suji.jpg",
  },
  {
    name: "눈썹 추가 리터치",
    en: "Retouch",
    tag: null,
    desc: "신규 2개월 이내 · 재방문 유지터치 3개월 이내 방문 시.",
    price: "₩50,000",
    durationHours: 1,
    image: "/photos/retouch.jpg",
  },
  {
    name: "아이라인",
    en: "Eyeline",
    tag: null,
    desc: "또렷하고 깊은 눈매를 자연스럽게.",
    price: "₩100,000",
    durationHours: 1,
    image: "/photos/eyeline.jpg",
  },
  {
    name: "입술 틴트립",
    en: "Tint Lip",
    tag: null,
    desc: "입술 비대칭 · 어두운 입술 톤업 · 창백한 입술.",
    price: "₩400,000",
    durationHours: 3,
    image: "/photos/lips.jpg",
  },
  {
    name: "SMP 두피문신",
    en: "SMP",
    tag: null,
    desc: "헤어라인 · 가르마 · 정수리 · M자 · 흉터커버 · 구렛나루.",
    price: "1부위 ₩300,000~",
    priceNote: "2부위 이상 견적문의",
    durationHours: 2,
    image: "/photos/smp.jpg",
  },
  {
    name: "미인점",
    en: "Beauty Spot",
    tag: null,
    desc: "포인트가 되어주는 자연스러운 미인점.",
    price: "₩20,000",
    durationHours: 1,
    image: "/photos/spot.jpg",
  },
  {
    name: "블랙틴트 케라틴펌",
    en: "Keratin Perm",
    tag: null,
    desc: "클리닉 + 블랙틴트로 결을 살린 브로우 펌.",
    price: "₩40,000",
    durationHours: 1,
    image: "/photos/perm.jpg",
  },
];

export const SERVICE_NAMES = CATALOG.map((s) => s.name) as [string, ...string[]];

export function getService(name: string): Service | undefined {
  return CATALOG.find((s) => s.name === name);
}

export function durationLabel(hours: number): string {
  return `약 ${hours}시간`;
}
