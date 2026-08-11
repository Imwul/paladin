# Paladin Design System

## Principles

The interface is a Carolingian royal register interpreted through modern editorial design. Hierarchy comes from type, rules, numbering, whitespace and provenance rather than fantasy borders, rounded cards or decorative texture. Rulebook clarity always outranks ornament.

## Grid and Rhythm

- Base spacing unit: 8px; compact metadata may use 4px subdivisions.
- Desktop content: up to 1460px inside the folio, with a 248px register index.
- Wide desktop (2200px+): 22px root type, up to 2400px folio, 336px register index, and 64px page gutters.
- Tablet index: 208px; content grids collapse before labels become unreadable.
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
| Paper | `#f3f2ed` | Main folio |
| Bright paper | `#fbfaf6` | Header and active record |
| Paper grey | `#e4e3de` | Index and quiet bands |
| Ink | `#171717` | Primary text and rules |
| Muted ink | `#73736f` | Metadata |
| Seal red | `#b7372f` | Active, warning and historical emphasis |
| Dark red | `#7d201c` | Danger and unresolved actions |
| Focus blue | `#155b85` | Keyboard focus only |

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
- Focus uses a 3px visible blue outline with 3px offset.
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

## Editorial Plate

The lower index uses a public-domain 1352 manuscript plate of a knightly investiture. It replaces the former decorative letter seal and is treated as a cited archival object, not atmospheric stock art. See `ATTRIBUTIONS.md`.
