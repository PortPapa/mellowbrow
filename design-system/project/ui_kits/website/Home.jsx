/* global React */
// Mellowbrow website — Home screen

function Home({ onNavigate }) {
  const { Button, Badge, Card, ServiceCard } = window.MellowbrowDesignSystem_20fe7e;
  const { Section, Photo, Icon } = window;

  return (
    <div>
      {/* HERO */}
      <section style={{ background: "var(--surface-page)" }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-9) var(--gutter)",
          display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 56, alignItems: "center" }}>
          <div>
            <span className="mb-eyebrow">Brow Atelier · Seoul</span>
            <h1 style={{ fontSize: "clamp(2.5rem, 1.4rem + 2.8vw, 3.4rem)", marginTop: 18, color: "var(--text-primary)" }}>
              결을 살린,<br/><span style={{ fontStyle: "italic", color: "var(--mocha-600)" }}>자연스러운</span> 눈썹
            </h1>
            <p style={{ marginTop: 22, fontSize: 17, lineHeight: 1.75, color: "var(--text-secondary)", maxWidth: 440 }}>
              얼굴형과 분위기에 꼭 맞는 1:1 맞춤 디자인.
              과하지 않게, 오래 두고 봐도 편안한 눈썹을 그려드려요.
            </p>
            <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
              <Button size="lg" onClick={() => onNavigate("booking")}>예약하기</Button>
              <Button size="lg" variant="secondary" onClick={() => onNavigate("services")}>시술 둘러보기</Button>
            </div>
            <div style={{ marginTop: 40, display: "flex", gap: 36 }}>
              {[["8년+", "브로우 경력"], ["1:1", "맞춤 디자인"], ["100%", "예약제"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--text-primary)" }}>{n}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <Photo ratio="4 / 5" variant="b" radius="var(--radius-xl)" label="hero · brow close-up" style={{ boxShadow: "var(--shadow-lg)" }} />
            <div style={{ position: "absolute", bottom: -22, left: -22, background: "var(--surface-card)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", gap: 2, color: "var(--blush-500)" }}>
                {[0,1,2,3,4].map(i => <Icon key={i} name="star" size={15} />)}
              </div>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}><b style={{ color: "var(--text-primary)" }}>4.9</b> · 후기 320+</span>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <Section bg="var(--surface-sunken)">
        <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 56, alignItems: "center" }}>
          <Photo ratio="5 / 4" variant="c" radius="var(--radius-xl)" label="studio mood" />
          <div>
            <span className="mb-eyebrow">Our Philosophy</span>
            <h2 style={{ fontSize: "var(--fs-display-md)", marginTop: 16 }}>덜어내는 디자인</h2>
            <p style={{ marginTop: 18, fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)" }}>
              멜로브로우는 ‘눈썹을 그린 듯 안 그린 듯’ 자연스러움을 가장 중요하게 생각해요.
              유행을 따르기보다 얼굴의 균형을 먼저 보고, 한 올 한 올 결을 살려 또렷하지만 부담스럽지 않은 눈썹을 완성합니다.
            </p>
            <ul style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14, listStyle: "none", padding: 0 }}>
              {["충분한 상담 후 디자인을 함께 결정해요", "피부 톤에 맞춘 색소 조색", "첫 시술 후 리터치 1회 포함"].map((t) => (
                <li key={t} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: "var(--text-primary)" }}>
                  <span style={{ color: "var(--mocha-600)", display: "inline-flex" }}><Icon name="check" size={18} /></span>{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* SERVICES PREVIEW */}
      <Section>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
          <div>
            <span className="mb-eyebrow">Signature Menu</span>
            <h2 style={{ fontSize: "var(--fs-display-md)", marginTop: 14 }}>시그니처 시술</h2>
          </div>
          <Button variant="ghost" onClick={() => onNavigate("services")}>전체 보기 →</Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          <ServiceCard titleKo="자연눈썹" titleEn="Natural" tag="시그니처" description="결을 한 올씩 살린 가장 자연스러운 디자인." price="₩250,000" duration="약 2시간" onSelect={() => onNavigate("booking")} />
          <ServiceCard titleKo="콤보눈썹" titleEn="Combo" description="자연결 + 음영으로 또렷하게 채운 스타일." price="₩290,000" duration="약 2시간" onSelect={() => onNavigate("booking")} />
          <ServiceCard titleKo="섀도우눈썹" titleEn="Shadow" description="화장한 듯 은은한 그라데이션 눈썹." price="₩270,000" duration="약 2시간" onSelect={() => onNavigate("booking")} />
        </div>
      </Section>

      {/* REVIEWS */}
      <Section bg="var(--surface-sunken)">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span className="mb-eyebrow">Reviews</span>
          <h2 style={{ fontSize: "var(--fs-display-md)", marginTop: 14 }}>고객 후기</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            ["“알아서 자연스럽게 해주세요 했는데 딱 제 얼굴에 맞게 그려주셨어요. 주변에서 눈썹 어디서 했냐고 물어봐요.”", "김OO · 자연눈썹"],
            ["“상담을 정말 꼼꼼히 해주셔서 믿고 맡겼어요. 과하지 않고 화장 안 해도 인상이 또렷해졌어요.”", "이OO · 콤보눈썹"],
            ["“처음 눈썹문신이라 걱정했는데 시술 내내 편안했어요. 리터치까지 받고 완전 만족합니다.”", "박OO · 섀도우눈썹"],
          ].map(([quote, who]) => (
            <Card key={who} elevation="sm">
              <div style={{ display: "flex", gap: 2, color: "var(--blush-500)", marginBottom: 12 }}>
                {[0,1,2,3,4].map(i => <Icon key={i} name="star" size={14} />)}
              </div>
              <p style={{ fontFamily: "var(--font-serif-ko)", fontSize: 16, lineHeight: 1.7, color: "var(--text-primary)" }}>{quote}</p>
              <p style={{ marginTop: 16, fontSize: 13, color: "var(--text-muted)" }}>{who}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section style={{ background: "var(--surface-dark)" }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-9) var(--gutter)", textAlign: "center" }}>
          <span className="mb-eyebrow" style={{ color: "var(--mocha-400)" }}>Booking</span>
          <h2 style={{ fontSize: "var(--fs-display-md)", marginTop: 16, color: "var(--text-on-dark)" }}>
            오늘의 눈썹, 멜로브로우에서
          </h2>
          <p style={{ marginTop: 16, fontSize: 16, color: "var(--mocha-300)", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            100% 예약제로 운영됩니다. 원하시는 날짜와 시술을 남겨주시면 빠르게 안내드릴게요.
          </p>
          <div style={{ marginTop: 30 }}>
            <Button size="lg" onClick={() => onNavigate("booking")}>예약 신청하기</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

window.Home = Home;
