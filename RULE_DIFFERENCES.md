# Rule Differences and App Conventions

## Rules that change game results

| Area | Rulebook | Baseline app behavior | Classification | Required disposition |
|---|---|---|---|---|
| d20 critical | Critical equals the modified statistic | Natural 1 is also always critical | Incorrect | Replace with one shared exact resolver. |
| Values above 20 | Add excess to die result; result 20+ is critical | Target is clamped and die is not transformed | Incorrect | Implement Chapter 6 procedure. |
| Values below 1 | Automatic failure; expanded fumble range | Target is clamped to 0/1 | Incorrect | Preserve negative target and calculate fumble threshold. |
| Opposed resolution | Highest successful modified die result wins; a successful loser gets partial success | Shared comparator gave every critical priority over ordinary successes | Incorrect | Compare successful modified die results without an extra critical-priority rule. |
| Core start year | First characters and opening scenario are in 767 | Default/new custom characters begin in 768 | Incorrect | New campaigns start in 767; retain existing saved years. |
| Father chronology | Father history is 745-766 | Timeline label/range includes 767 | Incorrect | End father history at 766 and start player history at 767. |
| Starting passions | Honor, Love Charlemagne, Love family, Love God | Loyalty liege, Love family, Hospitality, Honor, Hate Saracens, Love God | Incorrect/House Rule | Use the four source passions for new characters; preserve optional legacy passions in saves. |
| Saint Denis | +2 Love [Charlemagne] | +2 Standing [Charlemagne] | Incorrect | Change target passion. |
| Custom base statistics | Roll source tables in the listed order | Fixed skills and traits | Incorrect | Add rules-engine generators or keep clearly manual; do not call fixed values rolled output. |
| Aging timing | Age at Winter Step 2, then age-30 roll | Age after all ten steps | Incorrect | Move age/squire/mount aging into Step 2 atomically. |
| Aging death | Attribute 3 or less bedridden; 0 dead | Attribute cannot fall below 3 | Incorrect | Persist incapacity/death separately. |
| Salvation legacy | Transfer 1 score + gift; saint transfers 2 + blessing | 1.1x Glory and fabricated instant heir | Incorrect/House Rule | Remove invented multiplier and separate legacy from successor creation. |
| Successor creation | Run same-family new-character modifiers and inherit allowed gear/manors | Reset to one fixed template | Incorrect | Route through creation/migration state. |
| Harvest | Full Stewardship modifiers and manor economy | Base Stewardship only; gross income becomes cash | Incorrect | Implement modifiers and explicit maintenance ledger. |
| Personal events | Exact Table 10-9 outcomes and choices | Several effects omitted or applied to wrong fields | Incorrect | Automate deterministic effects and preserve unresolved choices. |
| Survival | All relevant NPCs/special mounts; herd replaces ordinary mounts | Only squire and one horse; charger can be permanently deleted | Incorrect | Expand target set and replacement rules. |
| Family event target | Table 10-13 relation and sex distribution | Uniform random living non-player family member | Incorrect | Resolve relation/sex table then select/create a valid target. |
| Glory bonus | Must be spent immediately | User may discard it while ending Winter | Incorrect/House Rule | Block completion until spent unless GM override is explicitly recorded as a house rule. |

## Disposition after the audit

The d20 resolver, opposed-roll ordering, 767 start, father chronology, four starting passions, Saint Denis, rules-based Frankish Ardennes generation, Winter aging, aging death, Salvation, Canonization, Legacy and the complete same/new-family successor routes were corrected. The Grand Remaster also enforces the printed ten-step Winter order and compulsory Glory-bonus spending. Harvest modifiers, Maintenance consequences, complete Survival target coverage and GM-dependent personal/family-event effects remain partial rather than being accepted as app conventions.

The Table 1-17 blessing control is now hidden unless a canonized predecessor granted a blessing roll. A valid roll consumes that grant. Existing saved blessing text is displayed but does not create another grant. The rules-based creation path no longer offers an arbitrary starting blessing.

The Phase 2 `Core Rules Character` route is the canonical Chapter One implementation. `Quick-start Preset` remains labeled as authored sample data and `Manual Character` remains an explicit override/editor route; neither is presented as a rulebook roll or allowed to silently change the canonical creation session.

Table 1-15 blessed spear/sword entries are now stored as conditional modifiers against pagans instead of permanently increasing the base weapon skill. Sacred relics no longer fabricate a `Pious/Worldly` result; the integrated creation path requires one of the six printed Religious traits, while legacy/manual unresolved records are retained as a visible choice requirement.

Winter training no longer offers `Pious` as a core trait. Table 10-9 event 19 failure now remains unresolved until a printed Christian trait is chosen and rolled; it no longer converts the choice into an automatic Pious experience check.

## Interface conveniences that do not inherently change rules

- Local auto-save after every React state update.
- JSON backup/import.
- Optional Firebase whole-save backup.
- Search, filters, collapsible reference tables and bilingual labels.
- Manual dice entry alongside random rolls, provided both use the same resolver.
- One-time application IDs that prevent double-click duplication.
- A confirmation before intentionally skipping an unresolved Winter item. This is an app workflow aid; the skip itself can change play and must remain logged as a GM override.

## House rules and invented defaults

- Old saves may retain `Pious/Worldly` as additional fields although new core characters and the primary UI use the twelve printed pairs.
- Old saves may retain `Loyalty [liege]`, `Hospitality` and `Hate [Saracens]`; they are optional legacy passions rather than new-character defaults. Schema migration maps old Loyalty to Love Charlemagne only when the canonical field is absent.
- The initial sample knight, family members, blessing, possessions, Glory and historical prose are app-authored demo content, not a blank rules-derived campaign.
- The yes/no oracle is an app solo aid, not a table in the core rulebook.
- Confirmed Winter skips and free manual family edits are GM-override tools. They must not be described as source rules.

## Old-version or cross-game traces

The default Loyalty/Hospitality passion set and natural-1 critical wording resemble assumptions from adjacent BRP/Pendragon-style play rather than the Paladin passages cited in this audit. The repository contains no second rules PDF or version note that authorizes these differences. They are therefore treated as unverified legacy behavior, not accepted alternatives.

## Ambiguous or GM-dependent rules

### Phase 3 lifecycle interpretation record

- Death and definitive retirement both open Salvation, but they remain different career and Family Tree states. Temporary incapacity and bedridden survival never open Salvation.
- The same-family route requires an explicit family candidate and predecessor/household father-class context before the canonical wizard proceeds. The app does not infer a replacement class from a name or free-form note.
- Source-listed personal/family equipment, money and horses are separate selectable inheritance records. Temporary/consumed items are excluded, each copied item receives provenance, and manor inheritance remains unresolved until GM approval is recorded.
- Choosing the new-family route records approval, creates a new family context and forfeits unused predecessor Legacy because the rulebook grants no lineage benefit to that character.
- A version 4 `pending_succession` record cannot prove whether its predecessor died or retired. Migration therefore keeps the predecessor historical, creates an unresolved `pending_successor` state and never revives that character.
- Existing blessing prose is historical content, not evidence of an unused Table 1-17 roll. Migration stores it without generating a blessing grant.

### Female-specific creation order

- Source: Chapter 1 pp.28, 31, 34-35 and 41-42; Tables 1-2, 1-10 and 1-13.
- Source conflict: The book supplies female family-characteristic and skill tables and discusses female knights, while the son-number procedure subtracts the son's ordinal from Love [family] and also modifies Page education/outfit before the normal Standing [family] derivation. It does not state one unambiguous replacement order for a female-specific route.
- Implemented certainty: Table 1-2 and Table 1-13 are exact, tested engine data. A woman may use the explicitly offered male-equivalent core route where the Gamemaster applies the printed mainstream procedure.
- Current UI: The female-specific route is visible but disabled with a source-ambiguity notice. It does not guess a daughter-number formula, silently drop the modifier, or manufacture acceptance/disguise mechanics.
- Impact: Choosing an invented order can change Love [family], Standing [family], Page education and starting outfit.
- Recommendation: Keep `CHAR-FAMCHAR-F-001`, `CHAR-SKILL-F-001` and `CHAR-FEMALE-001` Partial until the user confirms the intended table/order interpretation.
- User confirmation: Required before enabling the female-specific route.

### Phase 4 date discrepancy in the printed source

- Source: Introduction p.19; Chapter 15 contents and Phase 4 heading.
- Source conflict: The introductory chronology labels Phase 4 as 801-813 and then lists Charlemagne's death in 814 separately. Chapter 15 labels Phase 4 as 801-814 and includes 814 in that chapter.
- Current interpretation: Keep 814 inside Phase 4 while also treating it as the core-campaign conclusion. This follows the detailed chapter structure already recorded by the audit.
- Impact: Removing 814 from Phase 4 would change phase-derived lookups during the final campaign year.
- Recommendation: Do not invent a separate Phase 5 or silently choose a new boundary. Retain the detailed Chapter 15 interpretation until the user confirms otherwise.
- User confirmation: Needed before changing the existing 801-814 phase boundary.

### Underage family member and succession

- Source: Chapter 1 pp. 35, 42-44.
- Interpretation A: A replacement player character must be at least 15, then uses squire-year growth until he qualifies for knighthood; age 18 is normal, not an absolute legal threshold.
- Interpretation B: A campaign may select only an already playable/qualified family member, using a prepared second character, while young heirs remain in the family tree until later.
- Current app: Blocks only candidates below 15, routes ages 15-17 through the same squire-year and qualification procedure as any other successor, and keeps prepared second characters separate from permanent succession.
- Impact: A strict age-18 gate can reject an exceptional 16- or 17-year-old who already meets the printed requirements. Allowing any child to inherit immediately would also be wrong.
- Implemented interpretation: Require an explicit generated character record and the printed knighthood qualifications, not age 18 alone. Under-15 members are unavailable; ages 15-17 enter canonical generation and become active only after its qualification/completion transaction.
- User confirmation: Not required for the source-aligned minimum; a campaign-specific regency system would be a separate house rule.

### Retired predecessor equipment wording

- Source: Chapter 1 pp.39 and 42-43.
- Source conflict: The general Possessions rule says a character created after a predecessor's retirement or death may inherit that predecessor's equipment instead of Table 1-14. The later same-family paragraph specifically says that the deceased character may pass down equipment, treasure and goods.
- Current interpretation: Keep equipment selection available after either definitive career end, following the earlier explicit retirement-or-death clause. Preserve the predecessor status in provenance and never copy the old `birthGifts` grant record as a fresh grant.
- Impact: Restricting the later wording to death would force a retired predecessor's same-family successor back to Table 1-14 despite the earlier sentence.
- Recommendation: Keep this interpretation until the user confirms that the later “deceased” wording is intended to narrow the earlier rule.
- User confirmation: Required before removing equipment inheritance from definitive retirement.

### Campaign end at 814

- Source: Introduction pp. 19-20 and Chapter 15 p.321.
- Interpretation A: 814 is the intended end of the 47-year Charlemagne campaign.
- Interpretation B: Play may continue beyond 814 under Gamemaster-created history even though the core chronology and magic premise end.
- Baseline app: State sanitizer allows years to 1200 and no ending is enforced.
- Impact: Hard-ending at 814 can prevent an intentionally extended campaign; silently applying Phase 4 forever misrepresents the source.
- Recommendation: Mark 814 as the core-campaign conclusion and require an explicit extended-campaign mode beyond it.
- User confirmation: Needed before adding a hard game-over policy.

### Maintenance and cash ledger

- Source: Chapter 10 pp.175-177 and Chapter 12 pp.194-206.
- Interpretation A: Manor income directly funds the annual maintenance package and only surplus becomes portable treasure.
- Interpretation B: The app can keep gross income and expenses as separate ledger entries if the same net wealth and grade result.
- Baseline app: Adds gross income to cash and marks Maintenance resolved without expense entries.
- Impact: Treasury grows by roughly a manor's gross income every year and changes later choices.
- Recommendation: Use explicit income, required expense and surplus fields; either presentation is valid only if net results match.
- User confirmation: Not needed for correcting the current net-result error.

### Grand Remaster Winter resolution record

- Source: Chapter 10 pp.174-183 and Chapter 4 pp.90-93.
- Printed order: Solo Scenario, Aging, Economic Circumstances, Survival, Personal Event, Family, Experience, Training and Practice, Compute Glory, Glory Bonus.
- Implemented interpretation: The detailed Chapter 10 sequence overrides any project brief or legacy UI sequence that lists different steps. Every step is a separate transaction and later steps cannot run first.
- Manual boundary: Deterministic table effects are automatic. Player choices, missing family targets and rules requiring external play or Gamemaster judgment create an explicit unresolved record; the app never chooses for the player.
- Legacy save migration: A save paused after the old Harvest step preserves its recorded gross income and resumes Maintenance inside Economic Circumstances without rerolling or paying the income twice.
- Glory bonus: Winter cannot close while any crossed-threshold point remains unspent. A manual skip is not offered because the printed rule has no discard option.

### Final Completion Chronicle and ledger boundary

- Source: Chapter 4 pp.84-94, Chapter 10 pp.174-182 and the printed character-sheet Glory history.
- Implemented interpretation: Every Glory and Standing change is a rules transaction, but the Chronicle is a narrative of meaningful deeds and life events rather than a duplicate transaction log.
- Chronicle inclusion: adventures, consequential personal/family events, exceptional harvests, illness, death, marriage, birth, knighting, retirement, major Glory thresholds and succession.
- Chronicle exclusion: routine age increments without loss, ordinary income arithmetic, survival rolls with no consequence, experience-roll counts, training field names and annual-close administration.
- Family continuity: same-family and prepared-second routes preserve shared Family Timeline, Glory and Standing history with character IDs. A genuinely new-family route starts new ledgers.
- Save migration: schema v6 preserves unknown fields and all old journal text. Existing pre-v6 Glory totals mark already-passed 1,000-point thresholds as claimed because the old save cannot prove whether those points were spent; this prevents duplicate benefits.
- User confirmation: Not required. This changes presentation and provenance, not a printed game result.

### Chapter 12 economy and narrative boundary

- Source: Chapter 12 pp.193-209.
- Implemented interpretation: Coin, ransom, market, land, buildings, loans, deposits, taxes, retainers and equipment use one canonical Economy state. Legacy `gear.cash` and `family.manors` remain compatibility projections only.
- Market availability: The book supplies phase gates and foreign comparison marks, but no rarity or stock roll. Standard city goods are available unless the GM explicitly marks a temporary shortage; no rarity system was invented.
- Investments and buildings: Chapter 12 gives purchase or spending costs but no general return rate or annual building-maintenance formula. The app records the expenditure and structure without inventing returns or upkeep.
- Enchanted items: Deterministic combat, battle, health and aging effects are engine-owned. Prophecy, illusion, divination and GM-selected targets remain explicit narrative records.
- Attack-trained mounts: The x2 acquisition cost is Chapter 12 and is recorded. The actual horse attack is Chapter 18 and remains outside this phase.
- User confirmation: Not required; these are direct printed boundaries.

## Offline fallback finding

The app has no network-fetched rule tables or event outcomes. Firebase only stores and loads the complete local character object. Therefore online and offline modes currently execute the same local rules and random calls, and there is no stale fallback table to compare. The remaining risk is synchronization behavior, not probability drift: real Firebase save/load was not testable without the user's project configuration.
