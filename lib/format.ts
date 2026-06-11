// 공용 입력 포맷 헬퍼 — 예약 폼과 예약 조회·취소 페이지에서 함께 사용
/** 전화번호 자동 하이픈 — 02 지역번호 특례, 그 외(010 등) 3-4-4 */
export function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  // 서울 지역번호 02
  if (d.startsWith("02")) {
    const rest = d.slice(2);
    if (d.length <= 2) return d;
    if (rest.length <= 4) return `02-${rest}`;
    return `02-${rest.slice(0, rest.length - 4)}-${rest.slice(rest.length - 4)}`;
  }
  // 휴대전화·그 외 (010 등): 3-4-4
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

/** 전화번호 비교용 — 하이픈/공백 제거, 숫자만 */
export function phoneDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}
