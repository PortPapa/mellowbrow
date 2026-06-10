/* global React */
// Mellowbrow website — Booking form

function Booking({ onNavigate }) {
  const { Input, Select, Checkbox, Button, Card } = window.MellowbrowDesignSystem_20fe7e;
  const { Section, Icon } = window;
  const [done, setDone] = React.useState(false);
  const [agree, setAgree] = React.useState(false);
  const [svc, setSvc] = React.useState("");
  const [time, setTime] = React.useState("");

  if (done) {
    return (
      <Section>
        <Card elevation="md" style={{ maxWidth: 520, margin: "40px auto", textAlign: "center", padding: "48px 40px" }}>
          <span style={{ display: "inline-flex", width: 56, height: 56, borderRadius: "999px", background: "var(--success-soft)", color: "var(--success)", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
            <Icon name="check" size={28} />
          </span>
          <h2 style={{ fontSize: 30 }}>예약 신청 완료</h2>
          <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)" }}>
            신청해 주셔서 감사합니다. 확인 후 남겨주신 연락처로 예약 가능 일정을 안내드릴게요.
          </p>
          <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center" }}>
            <Button variant="secondary" onClick={() => onNavigate("home")}>홈으로</Button>
            <Button onClick={() => setDone(false)}>다시 신청</Button>
          </div>
        </Card>
      </Section>
    );
  }

  return (
    <Section>
      <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 44px" }}>
        <span className="mb-eyebrow">Booking</span>
        <h1 style={{ fontSize: "var(--fs-display-md)", marginTop: 16 }}>예약 신청</h1>
        <p style={{ marginTop: 14, fontSize: 16, color: "var(--text-secondary)" }}>
          아래 내용을 남겨주시면 빠르게 확인 후 연락드릴게요. (100% 예약제)
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.9fr", gap: 32, alignItems: "start" }}>
        <Card elevation="sm" style={{ padding: "32px 32px 36px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <Input label="성함" placeholder="홍길동" />
            <Input label="연락처" prefix="+82" placeholder="010-0000-0000" />
            <Select label="시술 선택" placeholder="메뉴를 골라주세요" options={["자연눈썹", "콤보눈썹", "섀도우눈썹", "남자눈썹", "입술 (물광)", "리터치"]} value={svc} onChange={(e) => setSvc(e.target.value)} />
            <Input label="희망 날짜" type="date" />
            <div style={{ gridColumn: "1 / -1" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 10 }}>희망 시간대</span>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["오전 11:00", "오후 1:00", "오후 3:00", "오후 5:00", "오후 7:00"].map((t) => (
                  <button key={t} onClick={() => setTime(t)} style={{
                    padding: "9px 16px", borderRadius: "var(--radius-pill)", cursor: "pointer",
                    fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 500,
                    border: "1px solid " + (time === t ? "transparent" : "var(--border-strong)"),
                    background: time === t ? "var(--primary-soft)" : "transparent",
                    color: time === t ? "var(--mocha-800)" : "var(--text-secondary)",
                  }}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 7 }}>요청 사항 (선택)</span>
              <textarea placeholder="원하시는 눈썹 스타일이나 궁금한 점을 적어주세요." rows={3} style={{
                width: "100%", boxSizing: "border-box", resize: "vertical",
                background: "var(--surface-card)", border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)", padding: "12px 14px",
                fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--text-primary)", outline: "none",
              }} />
            </div>
            <div style={{ gridColumn: "1 / -1", marginTop: 4 }}>
              <Checkbox checked={agree} onChange={setAgree} label="개인정보 수집·이용에 동의합니다" />
            </div>
            <div style={{ gridColumn: "1 / -1", marginTop: 6 }}>
              <Button full size="lg" disabled={!agree} onClick={() => agree && setDone(true)}>예약 신청하기</Button>
            </div>
          </div>
        </Card>

        <Card elevation="none" style={{ background: "var(--surface-sunken)", border: "1px solid var(--border-soft)" }}>
          <h3 style={{ fontSize: 20 }}>이용 안내</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: "18px 0 0", display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              ["clock", "영업 시간", "평일 11:00–20:00\n주말 예약 문의"],
              ["map-pin", "위치", "서울 강남구\n예약 확정 시 상세 주소 안내"],
              ["calendar-check", "예약제", "100% 예약제 운영\n방문 전 꼭 예약해 주세요"],
              ["instagram", "문의", "@mellowbrow DM"],
            ].map(([ic, t, d]) => (
              <li key={t} style={{ display: "flex", gap: 12 }}>
                <span style={{ color: "var(--mocha-600)", marginTop: 1 }}><Icon name={ic} size={18} /></span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{t}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", whiteSpace: "pre-line", lineHeight: 1.6 }}>{d}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Section>
  );
}

window.Booking = Booking;
