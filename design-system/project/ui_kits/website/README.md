# Mellowbrow — Website UI kit

A high-fidelity, click-through recreation of the **mellowbrow** brow-studio marketing site, built from the design-system primitives. Warm, editorial, Korean-first.

## Screens
- **Home** (`Home.jsx`) — hero, philosophy, signature menu preview, reviews, dark CTA.
- **Services** (`Services.jsx`) — full service menu (6 cards) + pricing note + FAQ accordion.
- **Gallery** (`Gallery.jsx`) — filterable before/after grid.
- **Booking** (`Booking.jsx`) — reservation form with info sidebar and a success state.

Shared chrome lives in `Chrome.jsx` (`Header`, `Footer`, `Section`, `Photo`, `Icon`). Navigation is in-page state (no router); `index.html` wires it all together.

## Run
Open `index.html`. It loads React UMD, Babel, Lucide (icons via CDN), and the compiled `_ds_bundle.js`, then mounts the four screens.

## Notes
- **Photos are placeholders.** The `Photo` helper renders warm gradient blocks where real studio photography goes — swap in real images (`<img>` / `background-image`) before production.
- Components used from the DS: `Logo`, `Button`, `Badge`, `Card`, `ServiceCard`, `Accordion`, `Input`, `Select`, `Checkbox`.
- Copy is illustrative (services, prices, hours, location). Replace with the studio's real details.
- Icons: **Lucide** (CDN) — stroke set matching the soft, minimal brand. Flagged substitution; see root `readme.md` › Iconography.
