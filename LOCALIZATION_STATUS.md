# Localization Status

## Locale Architecture

- Default locale: `ko`.
- Fallback locale: `en`.
- API: `t(key, params)`, `setLocale`, `getLocale`.
- Diagnostics: missing keys are recorded by `getMissingTranslationKeys`; tests clear and inspect the set.
- Internal enums, file names and canonical Rule IDs remain English.

## Korean-First Coverage

- Lifecycle status and progress track.
- Career-end cause, death/retirement distinction and confirmation dialog.
- Salvation ledger, automatic/manual roll controls and results.
- Canonization eligibility and Church Standing check.
- Legacy transfers, grants, equipment/manor choices and unresolved state.
- Same-family, new-family and prepared-second-character routes.
- Canonical character-creation wizard step names, progress, navigation and principal save/resume/error text.
- Character Sheet principal navigation and lifecycle section.
- Family Tree lifecycle status labels.
- Mobile lifecycle and creation action buttons.

At first explanatory use, rule terms may appear as Korean with the canonical English term: 영광(Glory), 성향(Trait), 열정(Passion), 지위(Standing), 구원(Salvation), 유산(Legacy). Repeated compact controls use Korean where space is limited.

## Fallback and Quality Checks

- Korean is resolved first; a missing Korean key falls back to English.
- Missing in both locales returns the key and records it for diagnostics.
- `{parameter}` replacement is shared by both locales.
- Phase 3 regression verifies default Korean, English fallback and missing-key reporting.
- Buttons and status text were inspected at 390 CSS pixels; document `scrollWidth` equals `clientWidth`.
- Korean headings use zero letter spacing in the new components and wrap without fixed viewport-scaled font sizes.

## Remaining English

- Rule IDs, source page labels, dice notation and internal score paths such as `traits.valorous` remain canonical/debug-facing English.
- Large legacy Character Sheet editing sections still contain bilingual labels and some English headings.
- Winter, oracles, lore/reference, adventure data and many Family Tree editing controls are not yet fully extracted.
- User-authored character/family names and imported source text are preserved as entered.

## Missing Keys

No missing key was reported by the Phase 3 locale regression for its required screens. This does not claim that every legacy JSX literal has been extracted; the remaining areas above are intentionally outside the current locale map.

## Next Priority

1. Phase 4 Winter wizard actions, errors, event choices and completion messages.
2. Remaining Family Tree edit/status controls and Chronicle filters.
3. Shared save/import/conflict messages once the cloud conflict workflow is exercised.
4. Oracles and lore navigation, without translating or duplicating whole copyrighted source passages.
