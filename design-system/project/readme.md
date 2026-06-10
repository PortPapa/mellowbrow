# Mellowbrow — Design System

Brand & UI design system for **mellowbrow (멜로브로우)**, a Korean semi-permanent makeup studio (눈썹문신 / brow art). Warm, soft, editorial — the visual language of a high-end brow atelier as seen on its Instagram.

> **Source provided:** Instagram — https://www.instagram.com/mellowbrow/
> The Instagram is behind a login wall and could not be read programmatically, and no logo, fonts, photos, or codebase were supplied. **This system is an informed interpretation** of the studio's category and name ("mellow" + "brow") in the established aesthetic of premium Korean brow studios. Everything visual here — wordmark, fonts, palette, photography — is a **substitute to be confirmed/replaced** with the studio's real assets. See **Caveats** at the bottom.

---

## What this is for
Generate well-branded interfaces and assets for mellowbrow — marketing site, booking flows, social/promo pieces, decks — either as throwaway mocks or production-ready HTML/CSS, all on a consistent warm editorial foundation.

## Products represented
- **Marketing website** (`ui_kits/website/`) — the studio's public site: home, services & pricing, before/after gallery, booking. This is the primary surface.

---

## Repository index (manifest)
| Path | What |
|---|---|
| `styles.css` | Global entry point — `@import`s every token + font file. Consumers link this. |
| `tokens/colors.css` | Mocha brand scale, warm neutrals, blush accent, semantic aliases. |
| `tokens/typography.css` | Font families, weights, fluid type scale, line-height & tracking. |
| `tokens/spacing.css` | Spacing rhythm, radii, shadows, motion. |
| `tokens/fonts.css` | `@import` of webfonts (Pretendard, Cormorant Garamond, Gowun Batang). |
| `tokens/base.css` | Element resets + the `.mb-eyebrow` label utility. |
| `components/core/` | `Button`, `Badge`, `Card`, `Logo`. |
| `components/forms/` | `Input`, `Select`, `Checkbox`. |
| `components/marketing/` | `ServiceCard`, `Accordion`. |
| `ui_kits/website/` | Click-through recreation of the mellowbrow site. |
| `guidelines/cards/` | Foundation specimen cards (Type / Colors / Spacing / Brand). |
| `SKILL.md` | Agent-Skill manifest for use in Claude Code. |

**Components:** Button · Badge · Card · Logo · Input · Select · Checkbox · ServiceCard · Accordion.
**Namespace (for cards):** `window.MellowbrowDesignSystem_20fe7e`.

---

## CONTENT FUNDAMENTALS

**Voice.** Calm, warm, reassuring — like a trusted artist who listens before picking up the needle. Confident but never boastful; the focus is *natural* results, not hype.

**Language.** Korean-first. English appears only as small tracked labels and service sub-names (e.g. `NATURAL`, `Brow Atelier`) — a styling device, not the content language. Numbers/prices use ₩ and full digits (`₩250,000`).

**Person.** Speaks to the customer as **you / 고객님** with polite 해요체 (`그려드려요`, `안내드릴게요`) — soft and personal, never the stiff 합니다체 and never casual 반말.

**Casing.** The brand name and wordmark are **all-lowercase** (`mellowbrow`). Latin micro-labels are UPPERCASE with wide tracking. Korean headlines are sentence-case naturally.

**Tone examples (use these as a guide):**
- Headline: *“결을 살린, 자연스러운 눈썹”*
- Sub: *“얼굴형과 분위기에 꼭 맞는 1:1 맞춤 디자인.”*
- Reassurance: *“과하지 않게, 오래 두고 봐도 편안한 눈썹을 그려드려요.”*
- Policy: *“100% 예약제로 운영합니다.”*
- CTA: *“예약하기” · “시술 둘러보기” · “예약 신청하기”*

**Vibe words:** 자연스러움(natural), 결(grain/flow), 편안함(comfort), 맞춤(bespoke), 덜어냄(restraint).

**Emoji:** Avoid in UI/marketing copy. (Casual Instagram captions may use a sparse ♥/✨, but the website voice stays clean.) Use real icons, not emoji, for UI affordances.

---

## VISUAL FOUNDATIONS

**Overall feeling.** Warm, editorial, skin-adjacent. Lots of negative space; serif display set large and quiet; soft photography. Nothing cold, neon, or high-contrast.

**Color.** A single warm family. **Mocha** browns (the eyebrow-ink hue) carry the brand — `--mocha-700` is the primary action color, `--mocha-900` is ink/text. Backgrounds are warm papers (`--paper #FBF7F1`, `--cream`, `--linen`) — **never** cold grey, never pure white pages, never pure black text. A muted **blush** (`--blush-500`) adds beauty warmth for stars/accents, used sparingly. Semantic colors are quiet and warm-biased.

**Type.** Display = **Cormorant Garamond** (high-contrast editorial serif) for the wordmark and big headlines, often with an *italic* word for emphasis in `--mocha-600`. Korean display = **Gowun Batang** (gentle Myeongjo) for quotes/serif Korean. Text/UI = **Pretendard** for body, labels, buttons (covers Hangul + Latin cleanly). Signature motif: the **eyebrow label** — 11px uppercase, `0.22em` tracking, muted (`.mb-eyebrow`) sitting above headings.

**Spacing & layout.** 8px rhythm. Generous section padding (`--space-9`, ~96px). Centered `--container-max` 1200px. Two-column hero/feature splits (text + image). Content breathes — restraint over density.

**Backgrounds.** Solid warm fills only — alternate `--paper` and `--cream`/`--sunken` between sections; one dark `--mocha-900` section for the CTA/footer. No busy gradients, no patterns, no textures behind text. (Photo placeholders use soft warm gradients purely as stand-ins.)

**Imagery.** Warm-toned, soft-focus, skin-close: brow close-ups, studio mood, before/after. Plenty of negative space, gentle natural light. Rounded corners (`--radius-lg`/`--radius-xl`). Real photography replaces all placeholders.

**Corner radii.** Soft, never sharp. Cards `--radius-lg` (22px); large media `--radius-xl` (32px); chips/buttons are full pills (`--radius-pill`).

**Cards.** Warm white (`#FFFFFF`) surface, hairline `--border-soft` border, soft warm-tinted shadow (`--shadow-sm`), 22px radius. Interactive cards lift `translateY(-2/3px)` and deepen to `--shadow-md` on hover.

**Shadows.** Low, soft, brown-tinted (`rgba(74,59,48, …)`) — never grey/black drop shadows. Four steps xs→lg.

**Borders.** Hairlines in warm tan (`--line #E7DAC9`) or softer `--line-soft`. Inputs use `--border-default`, deepen to `--mocha-500` + soft focus ring on focus.

**Buttons.** Pill by default. Primary = solid `--mocha-700` fill, paper text. Secondary = white with tan outline. Ghost = text-only mocha. Quiet = soft mocha tint.

**Motion.** Gentle and short. `--ease-out` (no bounce), 140–420ms. Fades and small lifts/slides; accordion height ease. Press state = subtle `scale(0.975)`. **No** springy bounces, no parallax, no looping decoration.

**Hover / press.** Hover deepens color or lifts elevation slightly (never brightens). Press shrinks marginally. Links underline via a 1.5px mocha border that animates in.

**Transparency & blur.** Used only for the sticky header (`paper` at ~86% + `blur(12px)`) and image-overlay chips (`backdrop-filter: blur`). Sparingly, never over text-heavy areas.

---

## ICONOGRAPHY
- **Set:** **Lucide** (CDN `lucide@0.460.0`) — thin, rounded, minimal stroke icons that match the soft brand. Loaded in UI kits via `<script src="…lucide…">`; rendered as `<i data-lucide="name">` then `lucide.createIcons()`. Sized by parent `font-size` (CSS: `svg.lucide { width:1em; height:1em }`), colored via `currentColor`.
- **Usage:** sparse and functional only — `star` (reviews), `instagram`, `phone`, `clock`, `map-pin`, `calendar-check`, `check`, `chevron`. Stroke width ~1.75–2, never filled.
- **Substitution flag:** the studio's real icon set is unknown; **Lucide is a chosen substitute** matching the aesthetic. Swap if the brand has its own.
- **Emoji / unicode as icons:** avoid. The accordion uses a typographic `+` (rotating to ×) which is intentional, not an emoji.
- **Logo:** typographic wordmark (`Logo` component / `guidelines/cards/brand-wordmark.html`), not an SVG symbol — there is no supplied logo mark. `mono` variant is a circular "m" badge for avatars/favicons.

---

## Using the system
1. Link `styles.css` for tokens + fonts.
2. Pull primitives from `window.MellowbrowDesignSystem_20fe7e` (the compiled bundle `_ds_bundle.js`).
3. Compose screens like `ui_kits/website/`. Replace `Photo` placeholders and sample copy with real assets.

---

## CAVEATS — please help me make this perfect
- **No real brand assets were available** (Instagram is login-walled; no logo/fonts/photos/codebase supplied). The wordmark, fonts, palette, and all imagery are **educated substitutes**.
- **Fonts are substitutes:** Cormorant Garamond + Gowun Batang + Pretendard (all webfont CDNs). If mellowbrow uses specific fonts, send them and I'll swap.
- **Icons are Lucide (substitute).**
- **Copy is illustrative** — services, prices (₩250k–350k), hours, "강남" location, "8년+ 경력", "4.9 / 후기 320+" are placeholders. Confirm real details.

### 👉 What I need from you to finish
1. **Logo** (PNG/SVG) and a few **real photos** (brow close-ups, studio, before/after).
2. The studio's **real services & prices**, **location**, and **hours**.
3. **Fonts** if the brand uses specific ones; otherwise approve the substitutes above.
4. Confirm the **warm mocha/cream direction** — or tell me to push pinker, darker, or more minimal.
