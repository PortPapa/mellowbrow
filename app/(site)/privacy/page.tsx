import type { Metadata } from "next";
import { Section } from "@/components/site/Section";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "멜로우브로우 개인정보처리방침 — 예약 시 수집하는 개인정보의 항목, 이용 목적, 보유 기간을 안내합니다.",
};

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: 22, marginTop: 40 }}>{children}</h2>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.8, color: "var(--text-secondary)" }}>
    {children}
  </p>
);

const UL = ({ items }: { items: React.ReactNode[] }) => (
  <ul
    style={{
      marginTop: 12,
      paddingLeft: 20,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      fontSize: 15,
      lineHeight: 1.7,
      color: "var(--text-secondary)",
    }}
  >
    {items.map((it, i) => (
      <li key={i}>{it}</li>
    ))}
  </ul>
);

export default function PrivacyPage() {
  return (
    <Section>
      <div style={{ maxWidth: "var(--container-text)", margin: "0 auto" }}>
        <span className="mb-eyebrow">Privacy Policy</span>
        <h1 style={{ fontSize: "var(--fs-display-md)", marginTop: 14 }}>개인정보처리방침</h1>
        <P>
          멜로우브로우(이하 &lsquo;스튜디오&rsquo;)는 「개인정보 보호법」 등 관련 법령을 준수하며,
          고객님의 개인정보를 소중하게 다룹니다. 본 방침은 예약 서비스 이용 과정에서 수집되는
          개인정보의 항목과 이용 목적, 보유 기간을 안내합니다.
        </P>

        <H2>1. 수집하는 개인정보 항목</H2>
        <P>홈페이지 예약 신청 시 아래 정보를 수집합니다.</P>
        <UL
          items={[
            <>
              <b>필수</b> — 성함, 연락처(휴대전화 번호), 희망 시술, 예약 날짜·시간
            </>,
            <>
              <b>선택</b> — 요청 사항, 기존 반영구 흔적(잔흔) 여부
            </>,
          ]}
        />

        <H2>2. 개인정보의 수집·이용 목적</H2>
        <UL
          items={[
            "예약 접수, 예약 확정·변경·취소 안내",
            "시술 상담 및 시술 이력 관리 (잔흔 커버 가능 여부 확인 등)",
            "예약 관련 연락 (확정 안내, 일정 변경 시 통지)",
          ]}
        />

        <H2>3. 보유 및 이용 기간</H2>
        <P>
          수집된 개인정보는 시술 이력 관리와 리터치 기간(신규 2개월 / 재방문 3개월) 안내를 위해
          <b> 마지막 방문일로부터 1년간</b> 보관 후 지체 없이 파기합니다. 고객님이 삭제를 요청하시면
          관련 법령상 보관 의무가 없는 한 즉시 파기합니다.
        </P>

        <H2>4. 개인정보의 제3자 제공</H2>
        <P>
          스튜디오는 고객님의 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 따라 수사기관
          등이 적법한 절차로 요청하는 경우는 예외로 합니다.
        </P>

        <H2>5. 개인정보 처리의 위탁</H2>
        <P>
          예약 데이터는 서비스 운영을 위해 아래 클라우드 인프라에 안전하게 저장됩니다. 수탁 업체는
          위탁 업무 수행 목적 외에 개인정보를 처리하지 않습니다.
        </P>
        <UL
          items={[
            "Cloudflare, Inc. — 홈페이지 호스팅 및 전송 구간 보호",
            "Supabase, Inc. — 예약 데이터 보관 (데이터베이스)",
          ]}
        />

        <H2>6. 정보주체의 권리</H2>
        <P>
          고객님은 언제든지 본인의 개인정보에 대한 열람·정정·삭제·처리 정지를 요청하실 수 있습니다.
          카카오톡(ID: mellow415) 또는 인스타그램(@mellowbrow) DM으로 요청해 주시면 지체 없이
          처리해 드립니다.
        </P>

        <H2>7. 개인정보의 안전성 확보 조치</H2>
        <UL
          items={[
            "예약 데이터는 암호화된 통신(HTTPS)으로만 전송됩니다",
            "데이터베이스 접근은 관리자 인증을 거친 경우로 제한됩니다",
            "수집 목적에 필요한 최소한의 정보만 수집합니다",
          ]}
        />

        <H2>8. 개인정보 보호책임자</H2>
        <UL
          items={[
            "보호책임자: 멜로우브로우 대표",
            "문의: 카카오톡 ID mellow415 · 인스타그램 @mellowbrow",
          ]}
        />

        <H2>9. 고지의 의무</H2>
        <P>
          본 방침의 내용이 변경되는 경우 홈페이지를 통해 공지합니다.
          <br />본 방침은 2026년 6월 11일부터 시행됩니다.
        </P>
      </div>
    </Section>
  );
}
