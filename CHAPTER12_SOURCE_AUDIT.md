# Chapter 12 Source Audit

## Scope

- Authority: `paladin_core_rulebook.pdf`
- Printed pages: 193-209 (PDF pages 194-210)
- Re-read: 2026-08-09
- Method: rendered every page, then checked paragraphs, tables, sidebars, quotations, footnotes, phase marks, foreign-item marks and the final unextractable image page.
- Rule boundary: Chapter 12 only. Attack-trained horse attacks remain Chapter 18 behavior; Chapter 17-19 rules were not added.

## Status

**Complete**

All deterministic Chapter 12 economic procedures are executable through one canonical Economy state. Player choices remain explicit inputs. GM choices and narrative-only enchanted-item effects are exposed as reference plus owned/use state and are never replaced with invented outcomes.

## Page Audit

| Printed page | Source content | Classification | Implementation |
|---:|---|---|---|
| 193 | Coinage, value, ordinary support, manor definition | Automatic / Reference | £-s-d ledger, £1=20s=240d, legacy cash migration, canonical estates |
| 194 | Five wealth levels and their consequences | Automatic / Narrative | Winter maintenance grades and exact net economy; descriptive social consequences remain reference |
| 195 | Progress, heralds, retinue examples, land | Narrative / GM Choice | No invented progress cost; land and specialist retainers have explicit state |
| 196 | Ransom, Table 12-1, lord/family support, first aids | Automatic / Player Choice | Exact minima, payable/receivable claims, Standing support, campaign release and one-use aid state |
| 197 | Four aids, Tallage, Impost, service, loans, marriage income | Automatic / Player / GM | Aid collection, agreed tax, Impost Commoners -2, phase interest, purpose and Heribannum limits |
| 198 | Sales, deposits, investment, market rules | Automatic / Player / GM | 50% sale, own-lord 100%, 5-10% deposit fee, eligibility, major spending without invented return |
| 199 | Standard list rules, famine, mounts | Automatic / Reference | Exact phase gates, GM unavailable boundary, food doubling, complete mount list, Phase 4 training cost |
| 200 | Animals, armor, shields | Automatic / Reference | Exact prices and combat Protection/DEX/loadout connection |
| 201 | Horse armor, melee and missile weapons | Automatic / Reference | Exact prices, phase gates, horse Movement/DEX, weapon profile and ammunition connection |
| 202 | Clothes, jewelry, services, miscellaneous goods | Automatic / Reference | Complete purchasable catalog and service expenses |
| 203 | Construction and defensive works | Automatic / Player Choice | Exact costs, phase/DV, quantity, estate link and Standing [lord] approval |
| 204 | Mercenaries, siege equipment, specialists | Automatic / Player Choice | Exact purchase bundles, specialist generation, annual pay/Glory/checks and special abilities |
| 205 | Spy, squire, steward, freeing enslaved people, magic boundary | Automatic / Player / GM | Three spy tasks, exposure, squire departure, steward use, liberation-only 120d-£10 payment, no magic market |
| 206 | Magic books and miscellaneous enchanted objects | Player / GM / Narrative | Complete catalog, ownership/equip/use state and exact concise procedure reference |
| 207 | Miscellaneous magic objects | Automatic / Player / GM | Battle bonuses, aging immunity, consumable/use records and narrative outcomes |
| 208 | Magic weapons and armor | Automatic / Player / GM | Chapter 7 bonuses, armor, damage, HP, unhorsing, first-shot and chivalrous-magic penalty |
| 209 | Remaining armor and Christian relics | Automatic / Player / GM | Fire/First Aid protection, protection ring source, exact six Christian traits, relic state and first-round armor eligibility |

## Source Classification

### Automatic

- Currency conversion and all coin transfers
- Minimum ransom values and self-paid settlement
- Market prices, phase availability, sale/trade multipliers and merchant outcomes
- Loan interest, deposit fees, annual retainer pay/Glory and Winter checks
- Construction costs, DV records and equipment combat values
- Mechanical equipped magic effects with a corresponding implemented engine

### Player Choice

- Maintenance level, purchases, sales, lord trade and major spending
- Ransom funding source and amount above the legal minimum
- Which aid to levy, whether to impose a tax, whom to retain and how to dismiss them
- Which acquired equipment or magic item is active

### GM Choice

- Temporary price changes or unavailable goods
- Land grants, special slave-liberation prices and defensive-work approval
- Difficult spy modifiers and which future roll receives +5
- Narrative divination, illusion, prophecy and target selection for magic objects

### Narrative / Reference

- Lordly progress, heraldic ceremony and illustrative retinue sizes
- Social appearance of each wealth level
- Legendary provenance, quotations and effects with no deterministic procedure
- Foreign goods marked for comparison only

## Integration

| Target | Status | Evidence |
|---|---|---|
| Chapter 7 | Complete | Equipped weapons, armor, shield DEX, horse armor, forged sword quality, Valorous/Horsemanship relic bonuses and mechanical magic effects enter the shared combat state |
| Chapter 8 | Complete | Loot changes coin once; captives create canonical ransom claims; player ransom releases only after settlement; battle magic bonus applies |
| Winter | Complete | Estate net, loan interest, deposit fees, specialist payroll/Glory/checks, steward and horse groom effects, magic aging immunity |
| Campaign | Complete | Transactions preserve year, source page, cause and related entity |
| Save | Complete | Schema v10 migrates legacy cash/manors/`pendingEconomy` once and preserves in-progress combat and Winter state |

## Remaining Boundaries

- Attack-trained horses are purchasable at the Chapter 12 x2 cost, but their attack action belongs to Chapter 18 and is intentionally not implemented here.
- GM-authored visions, prophecies, magic, social consequences and story targets are recorded, not auto-authored.
- Chapter 12 does not provide investment returns or general building upkeep numbers, so the engine does not invent them.

## Verification

- `npm run test:economy`: PASS
- `npm run test:combat`: PASS
- `npm run test:battle`: PASS
- `npm run test:winter`: PASS
- Scoped ESLint: PASS
- Production build: PASS
- Schema v9 and older migration to v10: PASS
- 360px seven-tab overflow, touch-target and console check: PASS

## Screenshots

- `docs/screenshots/chapter-12-economy-360.png`
- `docs/screenshots/chapter-12-economy-desktop.png`

## Assessment

Can every Chapter 12 economy procedure now be completed without reopening the rulebook?

**YES.** Deterministic outcomes execute in the app, and printed GM/narrative boundaries are present at the point of use without fabricated rules.
