# Rule Differences and App Conventions

## Rules that change game results

| Area | Rulebook | Baseline app behavior | Classification | Required disposition |
|---|---|---|---|---|
| d20 critical | Critical equals the modified statistic | Natural 1 is also always critical | Incorrect | Replace with one shared exact resolver. |
| Values above 20 | Add excess to die result; result 20+ is critical | Target is clamped and die is not transformed | Incorrect | Implement Chapter 6 procedure. |
| Values below 1 | Automatic failure; expanded fumble range | Target is clamped to 0/1 | Incorrect | Preserve negative target and calculate fumble threshold. |
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

The d20 resolver, 767 start, father chronology, four starting passions, Saint Denis, rules-based Frankish Ardennes generation, Winter aging, aging death, Salvation calculation and fabricated legacy multiplier were corrected. Harvest modifiers and the economy ledger were upgraded but remain partial. Personal events, Survival, family-event targeting, compulsory Glory-bonus spending and complete successor generation remain open in the traceability matrix rather than being accepted as app conventions.

The Table 1-17 blessing control is now hidden unless a canonized predecessor granted a blessing roll. A valid roll consumes that grant. Existing saved blessing text is displayed but does not create another grant. The rules-based creation path no longer offers an arbitrary starting blessing.

Table 1-15 blessed spear/sword entries are now stored as conditional modifiers against pagans instead of permanently increasing the base weapon skill. Sacred relics no longer fabricate a `Pious/Worldly` result; the integrated creation path requires one of the six printed Religious traits, while legacy/manual unresolved records are retained as a visible choice requirement.

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

### Underage family member and succession

- Source: Chapter 1 pp. 35, 42-44.
- Interpretation A: A replacement player character must be at least 15, then uses squire-year growth until he qualifies for knighthood; age 18 is normal, not an absolute legal threshold.
- Interpretation B: A campaign may select only an already playable/qualified family member, using a prepared second character, while young heirs remain in the family tree until later.
- Baseline app: Blocks selected successors below 18 and has no prepared-second-character or waiting flow.
- Impact: A strict age-18 gate can reject an exceptional 16- or 17-year-old who already meets the printed requirements. Allowing any child to inherit immediately would also be wrong.
- Recommendation: Require an explicit generated character record and the printed knighthood qualifications, not age 18 alone. Until those statistics exist, treat under-15 members as unavailable and 15-17 members as pending character generation.
- User confirmation: Not required for the source-aligned minimum; a campaign-specific regency system would be a separate house rule.

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

## Offline fallback finding

The app has no network-fetched rule tables or event outcomes. Firebase only stores and loads the complete local character object. Therefore online and offline modes currently execute the same local rules and random calls, and there is no stale fallback table to compare. The remaining risk is synchronization behavior, not probability drift: real Firebase save/load was not testable without the user's project configuration.
