# Visual QA

## Build

- Date: 2026-08-12
- Public URL: `https://imwul.github.io/paladin/`
- Verified source: Phase 5 release candidate, 2026-08-09
- Browsers: deployed GitHub Pages build in the Codex in-app browser.

## Responsive Matrix

| Width | Horizontal overflow | Replacement glyphs |
|---:|---:|---:|
| 360 | 0 | 0 |
| 390 | 0 | 0 |
| 768 | 0 | 0 |
| 1024 | 0 | 0 |
| 1440 | 0 | 0 |
| 1920 | 0 | 0 |
| 2200+ wide breakpoint | 0 | 0 |

## Interaction Checks

- All fourteen primary ledger screens load through the persistent index without an error state.
- Mobile index opens at 320px, stays inside `100dvh`, scrolls to all fourteen chapters, traps focus, and closes after navigation.
- Settings dialog receives focus, is labelled, and returns focus to the settings command when closed.
- Winter renders ten source-ordered steps and does not overflow at desktop or mobile widths.
- Combat renders the five source-ordered phases, two combatants, round inputs, wound ledger and recovery controls without horizontal overflow at 360, 1440 or 1920 CSS pixels.
- Combat controls have programmatic labels, visible 44px targets, no duplicate IDs and no console warnings or errors.
- A conscious Major Wound exposes its required Valorous continuation check without displacing the combat ledger; failure, forced re-entry and withdrawal remain keyboard-operable.
- Current-character display is derived from the lifecycle active character ID. Regression coverage confirms that death or retirement clears the current name and exposes the predecessor separately.

## Typography and Assets

- Black North and Hahmlet both report loaded in the local release candidate.
- Korean and mixed prose use `Hahmlet, AppleMyungjo, Noto Serif KR, serif`; explicit English/Latin display labels and large numerals use Black North at weight 400.
- The wide breakpoint computes a 22px root/body size with 336px index, 64px gutters, and no document overflow.
- Small English and Latin register labels use title case with no uppercase transform.
- The family reference list contains eight Lucide shield icons and no broken surrogate-pair glyphs.
- The public-domain knightly investiture plate loads with a non-zero natural width.

## Captures

- `docs/screenshots/grand-remaster-dashboard-1440.png`
- `docs/screenshots/grand-remaster-dashboard-390.png`
- `docs/screenshots/grand-remaster-mobile-index-390.png`
- `docs/screenshots/grand-remaster-character-390.png`
- `docs/screenshots/grand-remaster-winter-1440.png`
- `docs/screenshots/grand-remaster-reference-1024.png`
- `docs/screenshots/final-combat-360.png`
- `docs/screenshots/final-combat-1440.png`
