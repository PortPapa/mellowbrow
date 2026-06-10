/* global React */
// Mellowbrow website — shared chrome: Icon (Lucide), Header, Footer, Section helpers

function Icon({ name, size = 20, color = "currentColor", style = {} }) {
  // Lucide replaces <i data-lucide> with an <svg class="lucide">; size via font-size.
  return (
    <span style={{ fontSize: size, lineHeight: 0, color, display: "inline-flex", ...style }}>
      <i data-lucide={name}></i>
    </span>
  );
}

function useLucide(dep) {
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
}

const NAV = [
  { id: "home", label: "홈" },
  { id: "services", label: "시술 안내" },
  { id: "gallery", label: "갤러리" },
  { id: "booking", label: "예약" },
];

function Header({ route, onNavigate }) {
  const { Logo, Button } = window.MellowbrowDesignSystem_20fe7e;
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "color-mix(in oklab, var(--paper) 86%, transparent)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border-soft)",
    }}>
      <div style={{
        maxWidth: "var(--container-max)", margin: "0 auto",
        padding: "16px var(--gutter)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
      }}>
        <a onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>
          <Logo variant="full" size={24} />
        </a>
        <nav style={{ display: "flex", gap: 30, alignItems: "center" }}>
          {NAV.map((n) => (
            <a key={n.id} onClick={() => onNavigate(n.id)} style={{
              cursor: "pointer", fontSize: 14.5, fontWeight: 500, whiteSpace: "nowrap",
              color: route === n.id ? "var(--text-primary)" : "var(--text-secondary)",
              borderBottom: route === n.id ? "1.5px solid var(--mocha-600)" : "1.5px solid transparent",
              paddingBottom: 3, transition: "color var(--dur) var(--ease-out)",
            }}>{n.label}</a>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="https://www.instagram.com/mellowbrow/" target="_blank" rel="noreferrer" style={{ color: "var(--text-secondary)", display: "inline-flex" }}>
            <Icon name="instagram" size={20} />
          </a>
          <Button size="sm" onClick={() => onNavigate("booking")}>예약하기</Button>
        </div>
      </div>
    </header>
  );
}

function Footer({ onNavigate }) {
  const { Logo } = window.MellowbrowDesignSystem_20fe7e;
  return (
    <footer style={{ background: "var(--surface-dark)", color: "var(--text-on-dark)", marginTop: 0 }}>
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "64px var(--gutter) 40px",
        display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 40 }}>
        <div>
          <Logo variant="full" size={26} color="var(--paper)" />
          <p style={{ marginTop: 16, maxWidth: 280, fontSize: 14, lineHeight: 1.7, color: "var(--mocha-300)" }}>
            결을 살린 자연스러운 눈썹. 1:1 맞춤 디자인, 100% 예약제로 운영합니다.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="mb-eyebrow" style={{ color: "var(--mocha-400)" }}>둘러보기</span>
          {NAV.map((n) => (
            <a key={n.id} onClick={() => onNavigate(n.id)} style={{ cursor: "pointer", fontSize: 14, color: "var(--mocha-300)" }}>{n.label}</a>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="mb-eyebrow" style={{ color: "var(--mocha-400)" }}>찾아오시는 길</span>
          <span style={{ fontSize: 14, color: "var(--mocha-300)", lineHeight: 1.7 }}>서울 강남구 · 예약 시 안내<br/>평일 11:00–20:00<br/>주말 예약 문의</span>
          <a href="https://www.instagram.com/mellowbrow/" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, color: "var(--paper)", marginTop: 4 }}>
            <Icon name="instagram" size={16} /> @mellowbrow
          </a>
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--mocha-800)", padding: "18px var(--gutter)", maxWidth: "var(--container-max)", margin: "0 auto", fontSize: 12, color: "var(--mocha-400)" }}>
        © 2026 mellowbrow. All rights reserved.
      </div>
    </footer>
  );
}

function Section({ children, bg = "var(--surface-page)", style = {} }) {
  return (
    <section style={{ background: bg, padding: "var(--space-9) 0", ...style }}>
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--gutter)" }}>{children}</div>
    </section>
  );
}

// Warm gradient placeholder standing in for real photography
function Photo({ ratio = "4 / 3", variant = "a", label, radius = "var(--radius-lg)", style = {} }) {
  const grads = {
    a: "linear-gradient(135deg, #EEDFD0, #E0C5B2)",
    b: "linear-gradient(135deg, #F3E7E1, #E3C7B9)",
    c: "linear-gradient(135deg, #EAE0D2, #D4C0A6)",
    d: "linear-gradient(160deg, #E7D6C4, #C9B49A)",
  };
  return (
    <div style={{ aspectRatio: ratio, background: grads[variant], borderRadius: radius, position: "relative", overflow: "hidden", ...style }}>
      {label && <span style={{ position: "absolute", bottom: 12, left: 14, fontSize: 11, letterSpacing: "0.06em", color: "var(--mocha-700)", opacity: 0.7 }}>{label}</span>}
    </div>
  );
}

Object.assign(window, { Icon, useLucide, Header, Footer, Section, Photo, MB_NAV: NAV });
