import { KAKAO_OPENCHAT_URL } from "@/lib/constants";

/** 우측 하단 플로팅 퀵메뉴 — 카카오톡 오픈채팅 상담 */
export function QuickMenu() {
  return (
    <div className="quick-menu">
      <a
        className="quick-kakao"
        href={KAKAO_OPENCHAT_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="카카오톡 오픈채팅 상담문의"
      >
        {/* 카카오톡 말풍선 */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#191919" aria-hidden="true">
          <path d="M12 3C6.48 3 2 6.54 2 10.9c0 2.8 1.86 5.26 4.66 6.66-.15.55-.62 2.27-.71 2.62-.11.44.16.43.34.31.14-.09 2.23-1.51 3.13-2.13.83.12 1.69.19 2.58.19 5.52 0 10-3.54 10-7.9S17.52 3 12 3z" />
        </svg>
      </a>
      <span className="quick-label">상담문의</span>
    </div>
  );
}
