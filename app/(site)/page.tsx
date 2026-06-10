import { Star, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Section } from "@/components/site/Section";
import { Photo } from "@/components/site/Photo";
import { CATALOG, durationLabel } from "@/lib/catalog";
import { resolveSiteImage } from "@/lib/site-images";
import { getSiteImageMap } from "@/lib/site-images-server";

const SIGNATURE = ["자연눈썹", "콤보눈썹", "수지눈썹"];

// 데스크에서 교체한 사이트 이미지를 매 요청 반영
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const siteImages = await getSiteImageMap();
  return (
    <div>
      {/* HERO */}
      <section style={{ background: "var(--surface-page)" }}>
        <div
          className="mb-container hero-grid"
          style={{ paddingTop: "var(--space-9)", paddingBottom: "var(--space-9)" }}
        >
          <div>
            <span className="mb-eyebrow">Brow Atelier · Seoul</span>
            <h1
              style={{
                fontSize: "clamp(2.5rem, 1.4rem + 2.8vw, 3.4rem)",
                marginTop: 18,
                color: "var(--text-primary)",
              }}
            >
              결을 살린,
              <br />
              <span style={{ fontStyle: "italic", color: "var(--mocha-600)" }}>자연스러운</span> 눈썹
            </h1>
            <p
              style={{
                marginTop: 22,
                fontSize: 17,
                lineHeight: 1.75,
                color: "var(--text-secondary)",
                maxWidth: 440,
              }}
            >
              얼굴형과 분위기에 꼭 맞는 1:1 맞춤 디자인. 과하지 않게, 오래 두고 봐도 편안한 눈썹을
              그려드려요.
            </p>
            <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button size="lg" href="/booking">
                예약하기
              </Button>
              <Button size="lg" variant="secondary" href="/services">
                시술 둘러보기
              </Button>
            </div>
            <div className="hero-stats" style={{ marginTop: 40, display: "flex", gap: 36 }}>
              {[
                ["8년+", "브로우 경력"],
                ["1:1", "맞춤 디자인"],
                ["100%", "예약제"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 30,
                      color: "var(--text-primary)",
                    }}
                  >
                    {n}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <Photo
              ratio="4 / 5"
              variant="b"
              radius="var(--radius-xl)"
              src={resolveSiteImage(siteImages, "hero")}
              alt="자연스러운 눈썹 클로즈업"
              style={{ boxShadow: "var(--shadow-lg)" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -22,
                left: -22,
                background: "var(--surface-card)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-md)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", gap: 2, color: "var(--blush-500)" }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={15} strokeWidth={2} />
                ))}
              </div>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                <b style={{ color: "var(--text-primary)" }}>4.9</b> · 후기 320+
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <Section bg="var(--surface-sunken)">
        <div className="split split-philosophy">
          <Photo
            ratio="5 / 4"
            variant="c"
            radius="var(--radius-xl)"
            src={resolveSiteImage(siteImages, "studio")}
            alt="멜로우브로우 스튜디오"
          />
          <div>
            <span className="mb-eyebrow">Our Philosophy</span>
            <h2 style={{ fontSize: "var(--fs-display-md)", marginTop: 16 }}>덜어내는 디자인</h2>
            <p
              style={{
                marginTop: 18,
                fontSize: 16,
                lineHeight: 1.8,
                color: "var(--text-secondary)",
              }}
            >
              멜로우브로우는 &lsquo;눈썹을 그린 듯 안 그린 듯&rsquo; 자연스러움을 가장 중요하게
              생각해요. 유행을 따르기보다 얼굴의 균형을 먼저 보고, 한 올 한 올 결을 살려 또렷하지만
              부담스럽지 않은 눈썹을 완성합니다.
            </p>
            <ul
              style={{
                marginTop: 24,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                listStyle: "none",
                padding: 0,
                margin: "24px 0 0",
              }}
            >
              {[
                "충분한 상담 후 디자인을 함께 결정해요",
                "피부 톤에 맞춘 색소 조색",
                "눈썹부터 아이라인 · 입술 · SMP까지",
              ].map((t) => (
                <li
                  key={t}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 15,
                    color: "var(--text-primary)",
                  }}
                >
                  <span style={{ color: "var(--mocha-600)", display: "inline-flex" }}>
                    <Check size={18} strokeWidth={2} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* SERVICES PREVIEW */}
      <Section>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 36,
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <span className="mb-eyebrow">Signature Menu</span>
            <h2 style={{ fontSize: "var(--fs-display-md)", marginTop: 14 }}>시그니처 시술</h2>
          </div>
          <Button variant="ghost" href="/services">
            전체 보기 →
          </Button>
        </div>
        <div className="grid-3">
          {CATALOG.filter((s) => SIGNATURE.includes(s.name)).map((s) => (
            <ServiceCard
              key={s.name}
              titleKo={s.name}
              titleEn={s.en}
              tag={s.tag}
              description={s.desc}
              price={s.price}
              duration={s.priceNote ?? durationLabel(s.durationHours)}
              image={resolveSiteImage(siteImages, `service:${s.name}`)}
              href={`/booking?service=${encodeURIComponent(s.name)}`}
            />
          ))}
        </div>
      </Section>

      {/* REVIEWS */}
      <Section bg="var(--surface-sunken)">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span className="mb-eyebrow">Reviews</span>
          <h2 style={{ fontSize: "var(--fs-display-md)", marginTop: 14 }}>고객 후기</h2>
        </div>
        <div className="grid-3">
          {[
            [
              "“알아서 자연스럽게 해주세요 했는데 딱 제 얼굴에 맞게 그려주셨어요. 주변에서 눈썹 어디서 했냐고 물어봐요.”",
              "김OO · 자연눈썹",
            ],
            [
              "“상담을 정말 꼼꼼히 해주셔서 믿고 맡겼어요. 과하지 않고 화장 안 해도 인상이 또렷해졌어요.”",
              "이OO · 콤보눈썹",
            ],
            [
              "“처음 눈썹문신이라 걱정했는데 시술 내내 편안했어요. 리터치까지 받고 완전 만족합니다.”",
              "박OO · 수지눈썹",
            ],
          ].map(([quote, who]) => (
            <Card key={who} elevation="sm">
              <div style={{ display: "flex", gap: 2, color: "var(--blush-500)", marginBottom: 12 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={14} strokeWidth={2} />
                ))}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-serif-ko)",
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "var(--text-primary)",
                }}
              >
                {quote}
              </p>
              <p style={{ marginTop: 16, fontSize: 13, color: "var(--text-muted)" }}>{who}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section style={{ background: "var(--surface-dark)" }}>
        <div
          className="mb-container"
          style={{
            paddingTop: "var(--space-9)",
            paddingBottom: "var(--space-9)",
            textAlign: "center",
          }}
        >
          <span className="mb-eyebrow" style={{ color: "var(--mocha-400)" }}>
            Booking
          </span>
          <h2
            style={{
              fontSize: "var(--fs-display-md)",
              marginTop: 16,
              color: "var(--text-on-dark)",
            }}
          >
            오늘의 눈썹, 멜로우브로우에서
          </h2>
          <p
            style={{
              marginTop: 16,
              fontSize: 16,
              color: "var(--mocha-300)",
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            100% 예약제로 운영됩니다. 원하시는 날짜와 시술을 남겨주시면 빠르게 안내드릴게요.
          </p>
          <div style={{ marginTop: 30 }}>
            <Button size="lg" href="/booking">
              예약 신청하기
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
