# PALADIN v1.1 Personal Rulebook Transplant

## Status

This private build is isolated on `feature/v1.1-personal-rulebook-transplant` from the immutable v1.0.0 Golden Master commit `95a6cccfdac90d44e96c38cc26ac03b79f3e1f3d`.

- Public v1.0.0 Golden Master tag: unchanged
- Package identity: `1.1.0-personal`
- Campaign save schema: v12, unchanged
- Rulebook reference storage: `paladin.rulebook.v1.1.personal`, separate from campaign saves
- v1.1 tag: not created
- Deployment target: GitHub Pages through the protected `main` workflow

## Source

The only primary source is `paladin_core_rulebook.pdf`:

- PDF pages: 463
- Printed-page index: 0-462, including unnumbered/front matter mapping
- Numbered chapters: 19/19
- Additional groups: front matter, Introduction, appendices and sheets
- Extraction: page text, two-column reading view, headings, table captions, cross-references and source blocks
- Facsimile fallback: the exact PDF page opens at the matching physical page

The build script is `scripts/build-rulebook-transplant.py`. It refuses to generate data unless the source has exactly 463 PDF pages.

## Transplant Model

Each page retains its full source transcript and is additionally indexed into the following navigation blocks:

- `RULE`
- `PROCEDURE`
- `EXCEPTIONS`
- `TABLE`
- `EXAMPLE`
- `GM NOTES`
- `PLAYER NOTES`
- `CONTEXT`
- `SOURCE`

The block labels are search/navigation aids generated from the transcript. They do not replace the complete transcript or the PDF facsimile and do not create a new rule interpretation.

## Coverage

| Metric | Current count | Counting unit |
|---|---:|---|
| Source pages | 463 | every PDF page |
| Chapter/index groups | 22 | front, Introduction, Chapters 1-19, appendices |
| Rule blocks | 210 | extracted practical source blocks |
| Rule-bearing pages | 288 | pages with mechanical rule language |
| Tables | 163 | 107 numbered and 56 source-index tables |
| Procedure blocks | 152 | extracted procedural source blocks |
| Procedure-bearing pages | 228 | pages with sequence/procedure language |
| Examples | 119 | extracted example blocks |
| Example-bearing pages | 102 | pages containing examples |
| GM guidance blocks | 163 | extracted GM-directed blocks |
| GM guidance pages | 139 | pages containing GM guidance |
| Player guidance blocks | 172 | extracted player-directed blocks |
| Exception blocks | 108 | extracted exception/qualification blocks |
| Cross-links | 192 | valid printed-page and chapter references |
| Historical/reference pages | 104 | Chapters 13, 15 and 16 |
| Geographic reference pages | 24 | Chapter 14 |
| Creature reference pages | 18 | Chapter 18 |
| Cultural reference pages | 32 | Chapter 17 |

### Table Library

The source Table Index was transcribed independently of PDF font detection:

- Numbered tables: 107 (`1-1` through `19-36` across their printed chapters)
- Ancestor event tables: 35
- Other indexed market, combat, Glory, roster and encounter tables: 21
- Total: 163

Each table search result records its title, printed page, chapter and canonical runtime view. Opening it reveals the exact source-page rows; pages containing full-width tables also provide a linear transcript so rows are not lost at the two-column boundary.

## Runtime Links

The compact gameplay screens remain the default. Source content opens in a focus-trapped drawer or the standalone Personal Rulebook view.

- Character Creation: current 20-step source page
- Character and Family: creation, lifecycle and Chapter 2 history
- Personality/Magic: each current Trait, Passion, Madness, Melancholy, Amor, Prayer or Miracle section
- Combat/Health: Combat, wounds, healing and non-combat damage sections
- Skirmish/Battle/Siege: current phase or governing Table 8-x page
- Winter: each of the ten current steps
- Adventure: current Chapter 19 stage and active table
- Chronicle: current campaign year search in Chapter 15
- Reference: selected Chapter 13 family/society, Chapter 14 place, Chapter 16 NPC, Chapter 17 culture or Chapter 18 creature search

The `Use in current game` action only navigates to the existing canonical subsystem. It never applies a roll, modifier, consequence or transaction from the reference layer.

## Personal Library

Bookmarks, recent pages, reading notes and House Rule notes are local-only reference data.

- Campaign state is never read or mutated by note storage.
- Canonical notes and House Rule notes use separate collections.
- House Rules do not override the engine.
- The complete personal library can be exported as JSON.

## Source Ambiguities

All nine certified source ambiguities appear on their original pages with the conflict and current non-inventive handling:

1. p.30 female Son Number/order wording
2. p.42 inheritance edge wording
3. p.80 Melancholy duration wording
4. p.311 Phase Four 801-813 / 801-814 framing
5. p.368 generic Slav Pony
6. p.386 Hippogriff Hoofs versus claw/bite
7. p.413 Table 19-7 prose/table count
8. p.425 Table 19-11 overlapping result 4
9. p.432 Table 19-24 malformed amount

No replacement value or unsupported ruling was added.

## Remaining PDF Dependencies

**NONE FOR NORMAL DETERMINISTIC PLAY.**

The PDF button remains for exact visual facsimile, maps/illustrations and 30 pages with no extractable text layer: p.22, 24, 44, 63-64, 82, 94, 106, 114, 135-136, 162, 172, 182, 192, 210, 212, 256-260, 264, 283-284, 318-320, 340 and 372. These are chapter dividers, blank/illustration leaves, map/image surfaces or end matter rather than missing deterministic procedures. Existing in-app atlas maps cover normal Chapter 14 travel reference.

## Performance

- Manifest: small eager metadata only
- Reader and drawer: lazy feature chunks
- Chapters: 22 independent lazy JSON chunks
- Full-text index: separate lazy chunk loaded only on search
- Table index: separate lazy chunk loaded only in the table library
- Source PDF: separate asset used only by the facsimile fallback
- Initial main chunk: 700.56 kB / gzip 213.36 kB, a 4.55 kB increase from the certified 696.01 kB v1.0 baseline

The existing main-chunk warning remains. The large Chapter 13, Chapter 19 and search chunks are not part of initial gameplay loading.

## Verification

| Gate | Result |
|---|---|
| 463-page extraction and coverage regression | PASS |
| 163-table source index | PASS |
| Nine ambiguity locations | PASS |
| Modified-file lint | PASS |
| Full v1.0 temporary CI | PASS |
| Character / Family / Lifecycle | PASS |
| Chapters 7 / 8 / 12 / 17 / 18 / 19 | PASS |
| Personality / Magic / Winter | PASS |
| Save migration through schema v12 | PASS |
| Hostile saves and idempotency | PASS |
| 11-year campaign | PASS, 0 deterministic rulebook consultations |
| Production build | PASS |
| Production HTTP serve | PASS |
| Automated browser visual/interaction run | PASS - 37/37 production-browser gates |
| Responsive reader | PASS - 360/390/768/1440/1920/3440, 0 horizontal overflow |
| Browser console | PASS - 0 errors / 0 warnings |
| Physical device and screen reader | NOT TESTED - environment unavailable |

Repository-wide lint remains the certified v1.0 quality-only baseline of 129 errors / 0 warnings. No modified v1.1 file adds a lint finding.

## Assessment

1. Complete deterministic Paladin engine: **YES**, unchanged from v1.0 certification.
2. Practical integrated rulebook replacement in normal play: **YES**.

The source/runtime transplant and its production-browser evidence are complete. See `PERSONAL_RULEBOOK_BROWSER_CERTIFICATION.md` for the 37-gate record.

Final status: **PALADIN PERSONAL RULEBOOK TRANSPLANT COMPLETE**.
