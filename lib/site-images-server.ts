// 서버 전용 — 페이지(서버 컴포넌트)에서 사이트 이미지 맵을 읽는다.
import { getDb } from "./db";

/** key → 커스텀 이미지 URL. 실패 시 빈 맵(기본 이미지로 폴백). */
export async function getSiteImageMap(): Promise<Record<string, string>> {
  try {
    return await getDb().getSiteImages();
  } catch (e) {
    console.error("[site-images]", e);
    return {};
  }
}
