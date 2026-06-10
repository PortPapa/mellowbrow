// 사이트 고정 이미지 슬롯 — 홈 히어로/스튜디오 + 시술 카드 이미지.
// 데스크에서 교체하면 site_images에 저장되고, 없으면 기본 이미지를 쓴다.
// (클라이언트에서도 import 하므로 DB 접근 코드는 여기 두지 말 것 → site-images-server.ts)
import { CATALOG } from "./catalog";

export interface SiteImageSlot {
  key: string;
  label: string;
  defaultUrl: string;
}

export const SITE_IMAGE_SLOTS: SiteImageSlot[] = [
  { key: "hero", label: "홈 — 히어로 (세로 사진 권장)", defaultUrl: "/photos/hero.jpg" },
  { key: "studio", label: "홈 — 스튜디오 (철학 섹션)", defaultUrl: "/photos/studio.jpg" },
  ...CATALOG.map((s) => ({
    key: `service:${s.name}`,
    label: `시술 카드 — ${s.name}`,
    defaultUrl: s.image,
  })),
];

export const SITE_IMAGE_KEYS = SITE_IMAGE_SLOTS.map((s) => s.key);

/** 커스텀 이미지가 있으면 그걸, 없으면 슬롯 기본값을 반환 */
export function resolveSiteImage(map: Record<string, string>, key: string): string {
  if (map[key]) return map[key];
  return SITE_IMAGE_SLOTS.find((s) => s.key === key)?.defaultUrl ?? "";
}
