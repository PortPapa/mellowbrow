---
name: mellowbrow-design
description: Use this skill to generate well-branded interfaces and assets for mellowbrow (멜로브로우), a Korean semi-permanent makeup / brow studio, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Quick map:
- `styles.css` — link this for all tokens + fonts.
- `tokens/` — colors (warm mocha + cream + blush), typography (Cormorant Garamond / Gowun Batang / Pretendard), spacing, radii, shadows, motion.
- `components/` — React primitives (Button, Badge, Card, Logo, Input, Select, Checkbox, ServiceCard, Accordion). Exposed on `window.MellowbrowDesignSystem_20fe7e` via the compiled `_ds_bundle.js`.
- `ui_kits/website/` — full click-through brow-studio site (home, services, gallery, booking).
- `guidelines/cards/` — foundation specimens.

Brand in one line: warm, soft, editorial Korean brow atelier — lowercase `mellowbrow` wordmark, mocha browns on warm paper, big quiet serif headlines, polite 해요체 copy, natural over hype. Note: real logo/photos/fonts were not supplied — treat the included ones as substitutes and ask the user for the originals.
