# Paladin Design System

## Principles

The interface is an open royal manuscript interpreted through modern editorial design. On wide screens the index and current chapter read as facing folios divided by a visible spine; on small screens they become one page and an off-canvas index. Hierarchy comes from type, rules, color, numbering, whitespace and provenance. Rulebook clarity always outranks ornament.

## Grid and Rhythm

- Base spacing unit: 8px; compact metadata may use 4px subdivisions.
- Desktop content: up to 1680px inside the right folio, with a 300px left folio index.
- Wide desktop (2200px+): 22px root type, up to 2580px right folio, 560px left folio, and 72px page gutters. The complete spread is capped at 3320px for a 3440x1440 primary display.
- Tablet index: 208px; the decorative spread collapses before labels become unreadable.
- Mobile: one-column folio, off-canvas index and vertical ledger rows.
- Fixed-format controls use stable 44px minimum targets and explicit grid tracks.
- Page sections are ruled bands or open layouts. Cards are reserved for repeated records and dialogs.

## Typography

- Primary Korean and body family: local `Hahmlet Variable` 100-900, normally 500 with 700-800 hierarchy.
- English and Latin glyph family: `Black North` Regular 400.
- English/Latin register labels and display numerals explicitly use Black North; Korean and mixed prose use Hahmlet.
- Fallback: AppleMyungjo, Noto Serif KR, serif.
- Display: year, character name and folio title.
- Register: section title and administrative heading.
- Body: explanations and Chronicle narrative at 1.6-1.65 line height.
- Data: Rule ID, page, roll and modifier labels use Hahmlet with tabular numerals; large display numerals use Black North.
- Script accents are not used for functional text.
- Natural letter spacing with kerning and optical shaping is retained for legibility; headings wrap instead of shrinking with viewport width.
- English and Latin register labels use title case. All caps are reserved for canonical rules abbreviations and identifiers.

## Color

| Token | Value | Use |
|---|---|---|
| Parchment | `#f1e5c7` | Main folio |
| Bright vellum | `#fbf3de` | Header, fields and active records |
| Aged parchment | `#ddcba6` | Index and quiet bands |
| Iron-gall ink | `#261b16` | Primary text and rules |
| Ultramarine | `#174575` | Chapter structure and primary commands |
| Deep ultramarine | `#0b2d53` | Binding, headers and major bands |
| Vermilion | `#b13a2f` | Active, warning and historical emphasis |
| Malachite | `#315f49` | Positive and living state |
| Gold | `#e0c36b` | Folio rules, register marks and ornament |
| Focus gold | `#c79b2c` | Keyboard focus only |

Color never carries state alone. Every state also has a label, icon, border style or explanatory text.

## Components

- `AppShell`: royal header, campaign strip, folio index, breadcrumb and footer.
- `FolioHeading`: large title, source eyebrow, summary and year.
- `SectionHeader`: numbered register heading and optional command.
- `LedgerRow`: label, provenance and value with stable columns.
- `StatusSeal`: active, warning, danger or historical state with text.
- `PendingAction`: one current command with context, not a launcher grid.
- `RuleReference`: collapsible Rule ID, source page and short Korean summary.
- `ChoicePanel` / `RollPanel`: engine input only; never computes outcomes in the UI.
- `EmptyState`, `LoadingState`, `ErrorState`: quiet full-width ledger states.
- Dialogs: square document panels, labelled title, focus trap, Escape close and focus return.

## Interaction States

- Hover changes paper value or underline only.
- Focus uses a 3px visible gold outline with 3px offset.
- Disabled controls remain labelled and retain sufficient contrast.
- Unresolved records use double dark-red rules plus an explicit explanation.
- Resolved Winter steps remain readable and cannot be re-applied.
- Motion is 150-250ms and removed under `prefers-reduced-motion`.

## Responsive and Accessibility

- 44px minimum interactive targets.
- Semantic headings, navigation landmarks, status live regions and labelled dialogs.
- Mobile navigation traps focus while open, scrolls inside `100dvh`, exposes every chapter, and returns focus to its command.
- Tables remain tables; long ledgers switch column structure rather than becoming decorative cards.
- No viewport-scaled font sizes, horizontal document overflow or text/image overlap is permitted.

## Editorial Plates

The lower index uses a public-domain 1352 manuscript plate of a knightly investiture. The dashboard opens with a CC0 1455 Book of Hours border from the Cleveland Museum of Art. Both are treated as cited archival objects, not atmospheric stock art; no imagery is generated for the interface. See `ATTRIBUTIONS.md`.
