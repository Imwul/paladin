# PALADIN v1.1 Personal Rulebook Transplant

## Final Browser Evidence Certification

Certification date: 2026-08-13

Final verdict: **PALADIN PERSONAL RULEBOOK TRANSPLANT COMPLETE**

## Browser Environment

- Engine: Codex in-app production browser (Chromium surface)
- Production preview: `http://127.0.0.1:5182/`
- Build: Vite production output served by `vite preview`
- Automation: semantic browser controls, DOM accessibility snapshot, viewport override and observed page assets
- Viewports: 360x800, 390x844, 768x1024, 1440x1000, 1920x1080 and 3440x1440
- Console: 0 errors and 0 warnings in the certified flows

## 37 Gates

| # | Gate | Result | Evidence |
|---:|---|---|---|
| 1 | Reader open/close | PASS | Context drawer and standalone reader opened with content; close returned to gameplay |
| 2 | Chapter navigation | PASS | Introduction, Chapters 1/7/10/14/15/18/19 and Appendices opened at their indexed starts |
| 3 | Page navigation | PASS | Direct navigation covered p.30, 42, 80, 311, 368, 386, 413, 425 and 432 |
| 4 | Full-text search | PASS | Passion, Grapple, Winter, Amor, Ransom, Hippogriff, Tournament, Slav Pony, Standing and Siege returned and opened relevant pages |
| 5 | Table Library | PASS | Tables 3-1, 8-1, 12-1, 17-1 and 19-11 retained number, title, chapter and source page |
| 6 | Full-width table transcript | PASS | p.425 linear transcript retained the complete 3,491-character hunting table sequence |
| 7 | Character context | PASS | Current Character source opened the applicable Character Creation/lifecycle page without state change |
| 8 | Personality context | PASS | Passion context opened printed p.77 |
| 9 | Combat context | PASS | Chapter 7 Combat p.115 and Wounds/First Aid p.130 opened from the active Combat surface |
| 10 | Battle/Siege context | PASS | Current Chapter 8 context opened printed p.137 |
| 11 | Winter context | PASS | Three consecutive steps opened p.173, p.174 and p.174; returning from the drawer preserved Step 3 |
| 12 | Adventure context | PASS | The Tournament current scene and Table 19 source both opened p.436 without advancing or resetting the stage |
| 13 | Chronology reference | PASS | Campaign year 767 produced the matching Chapter 15 search result without narrative mutation |
| 14 | Atlas reference | PASS | Austrasia opened a Chapter 14 source search with 17 matching results |
| 15 | NPC reference | PASS | King Charlemagne opened four Chapter 16 source results |
| 16 | Culture reference | PASS | Basque, Jewish and Moorish/Saracen entries exposed religion, equipment and modifier differences with source results |
| 17 | Bestiary | PASS | Human, animal, giant, enchanted creature and Hippogriff references exposed source-backed stats/attacks/special text/Glory where printed |
| 18 | Nine ambiguities | PASS | AMB-01 through AMB-09 displayed conflict and non-inventive handling on the exact source pages |
| 19 | Bookmarks | PASS | Three new pages were added, survived close/reload, and were removed; the pre-existing p.386 bookmark was preserved |
| 20 | Recent history | PASS | Recently opened pages persisted in reverse chronological order after reload |
| 21 | Personal notes | PASS | Note create, persistence, edit and delete passed |
| 22 | House Rule notes | PASS | Separate labeled House Rule create, persistence, edit and delete passed without engine effects |
| 23 | JSON export | PASS | Export action completed with no console error; payload is the reference library object only and uses the JSON download filename |
| 24 | PDF fallback | PASS | Normal p.425 opened the built PDF at physical page 426 |
| 25 | No-text page fallback | PASS | Static 30/30 mapping passed; p.22, 63, 264, 318 and 372 opened physical pages 23, 64, 265, 319 and 373 |
| 26 | Keyboard focus | PASS | Initial focus entered the drawer, Tab remained inside, Escape closed it, and focus returned to the source button |
| 27 | Semantic names | PASS | 35 visible audited controls had names; reader H1, navigation, search, notes, bookmarks and close controls were exposed |
| 28 | 360px | PASS | Document and reader overflow 0; drawer, search, tables, notes and navigation remained usable; undersized critical controls 0 |
| 29 | 390px | PASS | Core reader flow repeated with document and reader overflow 0 |
| 30 | Table mobile behavior | PASS | Table Library and p.425 transcript produced no document overflow |
| 31 | Search mobile | PASS | 360px Passion search returned 80 results, opened p.78 and returned to Search |
| 32 | Storage separation | PASS | Rulebook storage uses `paladin.rulebook.v1.1.personal`; regression confirms no campaign save key dependency |
| 33 | Read-only gameplay state | PASS | Stable campaign revision remained unchanged through reader/search/bookmark/note operations; direct-reference reload reproduced no mutation |
| 34 | Lazy loading | PASS | Initial gameplay loaded no reader, chapter, search, table or PDF payload; opening the reader loaded only its feature and requested page group |
| 35 | Performance regression | PASS | Initial main 700.56 kB / gzip 213.38 kB, +4.55 kB over v1.0; reference payload remains lazy |
| 36 | v1.0 Golden regression | PASS | Full temporary CI, schema-v12 migration, hostile saves/idempotency, production build and 11-year campaign passed |
| 37 | Deterministic consultation count | PASS | 0 external PDF consultations during representative normal-play source flows |

Result: **37/37 PASS**.

## Mobile 360

- Horizontal document overflow: 0
- Reader overflow: 0
- Drawer: full-width and closable; 44px close control
- Search: result list readable and navigable
- Tables: single-column library and linear transcript readable
- Notes: both text areas reachable and editable
- Touch: 0 visible audited controls below 44px after remediation
- Long page: p.425 provided 7,829 characters in a scrollable 6,499px document without frozen content
- Overlay: no fixed or decorative layer intercepted the audited actions

## Reader And Library

- Pages: 463/463
- Chapter/index groups: 22
- Tables: 163
- Full-text search: lazy and operational
- Facsimile: exact `printed page + 1` physical PDF mapping
- Bookmarks: add/reload/remove passed
- Recent history: passed
- Notes and House Rules: independent persistence and delete passed
- Export: browser action passed; the automation surface does not expose the downloaded Blob as a retrievable artifact
- Campaign storage separation: passed in source regression and stable browser revision evidence

## Runtime Safety

- Gameplay mutation from reference actions: none reproduced
- Campaign save schema: v12 unchanged
- Migration and hostile saves: PASS
- Duplicate prevention/idempotency: PASS
- 11-year campaign: PASS, 10 years original knight plus 1 successor year
- Deterministic rulebook consultations: 0

## Performance

- Initial main: 700.56 kB / gzip 213.38 kB
- Reader JS: 16.13 kB / gzip 5.21 kB, lazy
- Chapters: 22 independent lazy data chunks
- Search index: 2,133.25 kB / gzip 705.76 kB, loaded only on search
- Table index: 40.33 kB / gzip 3.87 kB, loaded only in Table Library
- PDF: 50.69 MB separate asset, opened only by facsimile fallback
- Existing `>500 kB` build warning remains non-blocking and did not regress initial gameplay materially

## Bugs Found And Remediated

1. The global context source button received its size CSS only after the lazy reader stylesheet loaded. The rule was moved to the eager remaster stylesheet; 360px now measures 44x44.
2. The controlled page-number input committed every intermediate keystroke, so replacing a number could briefly navigate to p.0. It now keeps an input draft and commits on blur/Enter.
3. Reader page input and chapter rows measured 42-43px on mobile. Their minimum height is now 44px.

No gameplay rule, source transcript, ambiguity handling, save schema or canonical resolver changed during remediation.

## Evidence Limitations

- Physical phone/tablet: **NOT TESTED - ENVIRONMENT UNAVAILABLE**
- Physical screen reader: **NOT TESTED - ENVIRONMENT UNAVAILABLE**
- Authenticated Firebase multi-client conflict: **NOT TESTED - ENVIRONMENT UNAVAILABLE**
- Downloaded Blob contents could not be captured as a file by the in-app automation API; the user-facing click path, JSON construction path and zero-console-error result were verified.

## Final Assessment

1. Is the Personal Rulebook Reader usable at 360px in a real production browser? **YES**
2. Can search, tables, contextual links, bookmarks and notes be used without altering campaign gameplay state? **YES**
3. Does the transplant preserve v1.0 deterministic gameplay exactly? **YES**
4. Can normal deterministic play proceed without consulting the external PDF? **YES**
5. Are any Rulebook Transplant implementation gaps still reproduced? **NO**

Remaining Transplant Gaps: **NONE FOR NORMAL PLAY**.
