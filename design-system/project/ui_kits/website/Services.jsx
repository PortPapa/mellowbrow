/* global React */
// Mellowbrow website — Services & pricing

function Services({ onNavigate }) {
  const { ServiceCard, Accordion, Button } = window.MellowbrowDesignSystem_20fe7e;
  const { Section } = window;

  const services = [
    ["자연눈썹", "Natural", "시그니처", "결을 한 올씩 살린 가장 자연스러운 디자인.", "₩250,000", "약 2시간 · 리터치 포함", "a"],
    ["콤보눈썹", "Combo", null, "자연결 위에 음영을 더해 또렷하게.", "₩290,000", "약 2시간 · 리터치 포함", "b"],
    ["섀도우눈썹", "Shadow", null, "화장한 듯 은은한 그라데이션 눈썹.", "₩270,000", "약 2시간 · 리터치 포함", "c"],
    ["남자눈썹", "Men's", null, "자연스러운 결로 인상을 또렷하게.", "₩260,000", "약 2시간 · 리터치 포함", "d"],
    ["입술 (물광)", "Lip", "인기", "혈색을 더해 화사하고 또렷한 입술로.", "₩350,000", "약 2.5시간 · 리터치 포함", "b"],
    ["리터치", "Retouch", null, "타 샵 시술 후 결을 다시 살리는 보정.", "₩150,000", "약 1.5시간", "c"],
  ];

  return (
    <div>
      <Section>
        <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto" }}>
          <span className="mb-eyebrow">Service & Pricing</span>
          <h1 style={{ fontSize: "var(--fs-display-md)", marginTop: 16 }}>시술 안내</h1>
          <p style={{ marginTop: 16, fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            모든 시술은 충분한 상담 후 1:1 맞춤으로 진행되며, 첫 시술 후 4~6주 내 1회 리터치가 포함됩니다.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 48 }}>
          {services.map((s) => (
            <ServiceCard key={s[0]} titleKo={s[0]} titleEn={s[1]} tag={s[2]} description={s[3]} price={s[4]} duration={s[5]} onSelect={() => onNavigate("booking")} />
          ))}
        </div>
      </Section>

      <Section bg="var(--surface-sunken)">
        <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 56 }}>
          <div>
            <span className="mb-eyebrow">FAQ</span>
            <h2 style={{ fontSize: "var(--fs-display-md)", marginTop: 14 }}>자주 묻는 질문</h2>
            <p style={{ marginTop: 16, fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)" }}>
              궁금한 점이 더 있다면 인스타그램 DM으로 편하게 문의해 주세요.
            </p>
            <div style={{ marginTop: 22 }}>
              <Button variant="secondary" onClick={() => onNavigate("booking")}>예약 문의</Button>
            </div>
          </div>
          <Accordion items={[
            { q: "시술은 얼마나 걸리나요?", a: "디자인 상담을 포함해 약 2시간 소요됩니다. 충분히 상의한 뒤 진행하니 시간을 여유 있게 잡아주세요." },
            { q: "통증은 어느 정도인가요?", a: "마취 연고를 충분히 도포한 뒤 진행해 대부분 견딜 만한 정도입니다. 개인차가 있을 수 있어요." },
            { q: "리터치는 꼭 받아야 하나요?", a: "첫 시술 후 색이 자리잡는 과정에서 균일하게 보정하기 위해 1회 리터치를 권장하며, 가격에 포함되어 있습니다." },
            { q: "지속 기간은 얼마나 되나요?", a: "피부 타입과 관리에 따라 보통 1~2년 정도 유지됩니다." },
            { q: "예약은 어떻게 하나요?", a: "100% 예약제로 운영합니다. 홈페이지 예약 또는 인스타그램 DM으로 신청해 주세요." },
          ]} />
        </div>
      </Section>
    </div>
  );
}

window.Services = Services;
