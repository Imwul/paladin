# Rule Traceability Matrix

## Status vocabulary

Only these values are used: `Exact`, `Partial`, `Incorrect`, `Missing`, `Unreachable`, `UI-only`, `Logic-only`, `Ambiguous`, and `House Rule`.

## Detailed rule cards

### CORE-RES-001 - d20 resolution

- Location: Introduction pp. 20-21; Chapter 6 pp. 108-110
- Meaning: Roll 1d20. Below the modified statistic is success, exactly equal is critical, above is failure, and 20 is a fumble only when the modified statistic is below 20.
- Trigger: Any required skill, trait, passion, standing, or attribute roll.
- Choice: The Gamemaster decides whether a roll and modifiers are warranted.
- Random/calculation: For values above 20, add the excess over 20 to the die result and treat a resulting 20+ as critical. For values at or below 0, failure is certain and each point below 0 expands the fumble range.
- State: A critical skill/trait/passion may receive an experience check; attributes usually have no special critical/fumble effect.
- Exceptions/order: Modifiers alter the statistic before resolution; the die is still rolled at automatic-success/failure values.
- App surface: General dice, traits/passions, personal events, battle, prayer, conversion, trial, courtship, and any future rules engine.

### SETUP-ERA-001 - campaign and lineage year boundaries

- Location: Introduction pp. 19-20; Chapter 1 pp. 26-27; Chapter 2 pp. 46-63; Chapter 15 pp. 286-321
- Meaning: Core play begins in 767. The generated grandfather history runs 723-744 and father history runs 745-766. Historical campaign phases are 742-767 (Phase 0), 768-778 (Phase 1), 779-789 (Phase 2), 790-800 (Phase 3), and 801-814 (Phase 4).
- Trigger: New campaign, ancestry generation, chronology display, annual modifiers, equipment/technology lookup, and year advance.
- Choice: A Gamemaster may start at another precise campaign date.
- Random/calculation: Boundary years belong to the inclusive ranges above.
- State: Current year is saved; phase is derived from year.
- Exceptions/order: The phase used after a Winter Phase must be the phase of the newly advanced year.
- App surface: Initial state, ancestry, chronology, Winter harvest, lore and equipment references.

### LIFE-001 - career end, incapacitation, and replacement character

- Location: Chapter 1 pp. 42-44; Chapter 10 pp. 174-175
- Meaning: Death and definitive retirement end a career; a statistic at 3 or less makes a knight bedridden but not dead; an attribute at 0 kills him. A temporarily incapacitated knight may be replaced for an adventure by a prepared second character.
- Trigger: Voluntary retirement, Gamemaster-required retirement, attribute loss, zero attribute, death event, or temporary incapacity.
- Choice: A player may retire at any time, preferably with permission, and chooses an available family/companion-family member or, with approval, a new family character.
- Random/calculation: Salvation is rolled only after death or definitive retirement. It does not itself determine death.
- State: Career status, cause, year, active-character identity, pending successor, and the predecessor's record must remain distinct.
- Exceptions/order: Retired is not deceased; bedridden characters continue aging; no automatic game-over or regency rule is stated in the core book.
- App surface: Family tree, Salvation, character creation, journal, save/load, and all rule actions that require an active character.

### WINTER-ORDER-001 - annual sequence

- Location: Chapter 10 pp. 174-183
- Meaning: 1 Solo Scenario, 2 Aging (including age increments), 3 Economic Circumstances, 4 Survival, 5 Personal Event, 6 Family, 7 Experience, 8 Training, 9 Compute Glory, 10 spend Glory bonus immediately.
- Trigger: End of every game year.
- Choice: Personal Event is used when no solo adventure is performed; marriage/childbirth can be skipped as allowed; one Training option is chosen.
- Random/calculation: Each step has its own tables and checks.
- State: Each step must resolve once and in order before the year advances.
- Exceptions/order: Death/incapacitation from Aging must stop active-character-only updates. The new year begins only after Step 10.
- App surface: Winter wizard, journal, auto-save, current age/year, squire and mounts.

## Matrix

| Rule ID | Rulebook location | Rule summary | Trigger, choice, random/state/order | Required app surface | Status | Implementation | Tests | Issue |
|---|---|---|---|---|---|---|---|---|
| INTRO-DICE-001 | Intro p.20 | d20, d6, d3 and `Nd6+N` notation | Dice requested; d3 maps pairs; sums precede modifier | Dice tools | Partial | `SoloOracles.jsx` | No | d20 distribution exists; d3 and reusable dice parser do not. |
| INTRO-ROUND-001 | Intro p.20 | Fractions .5+ round up, lower fractions down | Any fractional rule calculation | Shared arithmetic | Partial | `roundPaladin`, derived statistics and Glory inheritance | `CORE-MATH-001` | Shared half-up helper drives audited core calculations; remaining subsystem-specific divisions need table-by-table review. |
| CORE-RES-001 | Ch.6 pp.108-110 | Standard d20 success/critical/failure/fumble | See detailed card | All checks | Partial | `resolveD20Roll`; major oracle, Winter and Salvation paths | `CORE-RES-001` to `004` | Exact shared resolver covers major flows, but some isolated legacy widgets still compare raw rolls locally. |
| CORE-OPPOSED-001 | Ch.6 p.109 | Opposed winner is highest successful roll; critical outranks success | Both roll; tie and two-failure outcomes retained | Combat/social opposed tools | Partial | `compareOpposedD20` and oracle callers | `CORE-RES-004` | Core ordering is exact; caller-specific consequences and the complete combat engine remain partial. |
| CORE-MOD-001 | Ch.6 pp.109-110 | Modifiers apply to statistic, with reflexive modifiers when stated | GM applies before roll | All roll forms | Partial | Per-widget number inputs | No | No single modifier contract; several flows clamp away below-zero behavior. |
| CORE-FEAT-001 | Ch.6 p.110 | Feat halves skill and converts success/failure to critical/fumble | GM permits desperate all-or-nothing attempt | General dice | Missing | None | No | No feat mode. |
| CORE-TIME-001 | Ch.6 pp.111-112 | Usually one scenario and one Winter Phase per year | End of scenario/year | Campaign flow | Partial | Winter wizard and journal | No | No scenario lifecycle; manual Winter can be repeated/reset locally. |
| CORE-MOVE-001 | Ch.6 pp.112-113, Table 6-2 | Movement, travel pace, unknown routes and forced march | Travel/action | Travel tools | Missing | Lore prose only | No | No rule execution. |
| CORE-XP-001 | Ch.6 pp.113-114 | One experience check per statistic per year | GM awards check after meaningful use | Sheet/check state | Partial | check maps; Winter XP | Hostile regression schema only | Automatic/experience semantics need centralized tests. |
| CORE-XP-002 | Ch.10 p.182 | XP succeeds on roll >= value, or 20 for value >20 | Winter Step 7 | Winter | Partial | `runExperiencePhase` | No | Retinue coverage and deterministic boundary tests missing. |
| SETUP-ERA-001 | Intro pp.19-20; Ch.1-2; Ch.15 | 767 start; ancestor and campaign phase boundaries | See detailed card | Initial state/chronology/phase helper | Exact | `App.jsx`, `getCampaignPhase`, `getLineageEra`, chronology | `ERA-001`, `ERA-002` | New core campaigns begin in 767; grandfather, father and player boundaries are inclusive as printed. |
| ERA-FUTURE-001 | Ch.15 pp.286-321 | Phase 1 is 768-778 | Year lookup, inclusive | Rules/lore | Exact | `getCampaignPhase`, chronology | `ERA-001` | Canonical phase helper returns Phase 1 at both boundaries. |
| ERA-FUTURE-002 | Ch.15 pp.298-307 | Phase 2 is 779-789 | Year lookup, inclusive | Rules/lore | Exact | `getCampaignPhase`, chronology | `ERA-001` | Canonical phase helper returns Phase 2 at both boundaries. |
| ERA-FUTURE-003 | Ch.15 pp.308-311 | Phase 3 is 790-800 | Year lookup, inclusive | Rules/lore | Exact | `getCampaignPhase`, chronology | `ERA-001` | Canonical phase helper returns Phase 3 at both boundaries. |
| ERA-FUTURE-004 | Ch.15 pp.312-321 | Phase 4 is 801-814 | Year lookup, inclusive | Rules/lore | Exact | `getCampaignPhase`, chronology | `ERA-001` | Canonical phase helper returns Phase 4 at both boundaries and stops after 814. |
| ERA-HARVEST-001 | Ch.10 p.176; Ch.15 annual entries | Phase/year harvest modifier applies | Determine current year before Stewardship roll | Winter economy | Partial | `getHarvestModifier`, Winter economy | `WIN-ECO-001` | Phase modifiers are automatic; annual chronology-specific disasters remain an explicit situational modifier. |
| CHAR-PERSONAL-001 | Ch.1 pp.26-27 | Initial character is Frankish Ardennes squire in Bastogne in 767 | New core campaign | Character creation | Exact | Initial/custom state | `ERA-001`, browser smoke | Rules-based creation now uses Bastogne, Ardennes, Frankish and 767 without a fabricated blessing. |
| CHAR-NAME-001 | Ch.1 p.27; App.1 pp.440-441 | One Frankish name; optional earned nickname | Player chooses/generates | Character creation/name generator | Partial | `names.js`, generator UI | No | Generator data exists; app commonly adds modern title/English formatting and fixed surnames elsewhere. |
| CHAR-FAMILY-001 | Ch.1 pp.27-30 | Shared family, tree, great noble, characteristic, saint, motto, muster | Campaign setup | Family tree | Partial | `FamilyTree.jsx` | No | Rich UI; shared-player family and all inheritance semantics not modeled. |
| CHAR-FAMCHAR-M-001 | Ch.1 p.28, Table 1-1 | Male characteristic d20 distribution and bonuses | Once per male line; choice on 20 | Creation/family | Exact | `characteristics.js`, `rulebookTables.js` | Partial | Roll map tested; end-to-end one-time application not fully tested. |
| CHAR-FAMCHAR-F-001 | Ch.1 p.28, Table 1-2 | Female characteristic distribution and bonuses | Once per female line | Creation/family | Partial | `characteristics.js`, FamilyTree UI | No | Data exists; primary custom generator is male-only. |
| CHAR-SAINT-001 | Ch.1 pp.28-29, Table 1-3 | d20 family saint and listed benefit | Family setup; 20 player choice | Creation/family | Exact | `patronSaints`, custom generator | `CC-PASSION-001` partial | Saint Denis now raises Love Charlemagne; final saint effects apply after the capped-15 creation steps. |
| CHAR-DIRECTED-001 | Ch.1 p.28, p.33; Ch.3 pp.69-70 | Directed traits/passions are inherited/acquired with named subjects | Family/GM event | Sheet/family | Missing | Free text only | No | No structured directed trait or inheritance model. |
| CHAR-MUSTER-001 | Ch.1 pp.29-30 | Family knights/men are generated and mustered by family size/class | Setup and summons | Family | Partial | Muster widgets | No | Counts exist but later yearly aging/service/death coverage is incomplete. |
| CHAR-FATHER-001 | Ch.1 pp.30-31, Tables 1-4/1-5 | Father class distribution, subtable, bonuses, skill points, Glory | Youth generation | Custom creation | Partial | `fathersClasses`, `lordOfficerSubclasses` | No | Main table/subclasses improved; downstream base rolls and ordering remain wrong. |
| CHAR-FATHER-SURV-001 | Ch.1 p.31, Table 1-6 | Father survival result | Youth generation | Creation | UI-only | Separate roll widget | No | Selection does not consistently affect generated family state. |
| CHAR-SON-001 | Ch.1 p.31 | Son number affects Love [family] and outfit | Choose 1 or roll d6 | Creation | Exact | Custom and direct creation controls | `CC-PASSION-001` | All six son numbers are selectable and the source Love Family formula is used. |
| CHAR-PAGE-001 | Ch.1 pp.31-32, Table 1-7 | Page training roll, modifiers, traits/passions/Glory | Youth generation | Creation | UI-only | `pageEducations` separate widget | No | Custom apply does not include the selected result. |
| CHAR-CULTURE-001 | Ch.1 p.32 | Frankish `+1d3` traits, +1 Honor/Love God/religious traits | Youth generation before attributes/skills finalization | Creation | Partial | `createFrankishArdennesTraits`, custom generator | `CC-BASE-001` | Correct modifiers apply; individual cultural d3 faces are not retained in the creation log. |
| CHAR-HOMELAND-001 | Ch.1 p.32; Ch.14 | Ardennes `+1d3` Hunting/Temperate/Modest/Suspicious | Youth generation | Creation | Exact | `createFrankishArdennesTraits`, custom generator | `CC-BASE-001` | Ardennes modifiers are integrated into the generated statistics. |
| CHAR-ATTR-001 | Ch.1 pp.32-33, Table 1-8 | Five 2d6+3 rolls plus exactly 5 points, max +3 each | Creation | Creation | Partial | Custom attribute UI | No | Allocation exact; rolls are manual/UI state and women option not integrated. |
| CHAR-DERIVED-001 | Ch.1 pp.32-33 | Damage, healing, move, HP, unconscious, major wound | After final attributes and changes | Sheet/combat | Partial | `CharacterSheet.jsx`, `roundPaladin` | `CORE-MATH-001` | Derived arithmetic is corrected; unconscious and major-wound state transitions still need a health engine. |
| CHAR-FEATURE-001 | Ch.1 p.33, Table 1-9 | Choose/roll distinctive feature category and description | Creation | Creation | Partial | Feature roll + editable list | No | Result list is app-authored and not trace-tested. |
| CHAR-TRAIT-001 | Ch.1 pp.33-34 | Twelve virtue rolls `2d6+3`, modifiers, opposite totals 20 | Creation | Creation | Partial | `createFrankishArdennesTraits`, custom generator | `CC-BASE-001` | Rules-based generation is exact; authored legacy presets remain available as clearly separate examples. |
| CHAR-PASSION-001 | Ch.1 p.34, Table 1-10 | Honor formula; Love Charlemagne 2d6+3; Love family formula; Love God lowest religious trait | After traits | Creation | Partial | `deriveStartingPassions`, custom generator | `CC-PASSION-001` | Rules-based generation is exact; optional legacy passion fields remain readable for save compatibility. |
| CHAR-STANDING-001 | Ch.1 p.34, Table 1-11 | Six standings derive from listed traits/passions | After passions | Creation | Partial | `deriveStartingStandings`, custom generator | `CC-PASSION-001` | Rules-based generation is exact; manual and authored preset paths are not forced through the derivation. |
| CHAR-SKILL-M-001 | Ch.1 p.35, Table 1-12 | Frankish male base skills use listed dice/formulas | Creation | Creation | Exact | `createFrankishMaleBaseSkills`, custom generator | `CC-BASE-001` | Every listed base formula uses the source dice and Paladin rounding. |
| CHAR-SKILL-F-001 | Ch.1 p.35, Table 1-13 | Frankish female base skills use listed dice/formulas | Creation | Creation | Missing | None in generator | No | Reference data only. |
| CHAR-SKILL-ORDER-001 | Ch.1 pp.34-35 | Base + father/page/culture/homeland capped 15; family/saint last, capped 20 | Creation | Creation engine | Partial | `handleApplyCustom` | No | Several prerequisite modifiers are omitted, so final order cannot be exact. |
| CHAR-KNIGHT-QUAL-001 | Ch.1 pp.35-36 | At 15+, apply two distinct squire-year benefits until requirements met; knight immediately | Annual pre-play creation | Creation | Missing | Age fixed at 18 | No | Qualification and squire-year loop absent. |
| CHAR-IDEAL-001 | Ch.1 pp.35-36; Ch.11 pp.191-192 | Chivalrous/Religious/Romantic requirements and benefits | Qualification/state change | Sheet/Winter/oracles | Partial | Badges, prayer and Glory helpers | No | Romantic UI adds skill requirements not present in the p.35 ideal table; benefits not consistently enforced. |
| CHAR-GLORY-001 | Ch.1 p.36 | Initial Glory from father/history, page training, cumulative scores over 15, then +1000 knighting | Knighting | Creation/Glory | Incorrect | Father + 1000 only | No | Cumulative 16+ triangular Glory and page/history paths are missing. |
| CHAR-OUTFIT-001 | Ch.1 pp.39-40, Table 1-14 | Outfit by father class/son number; listed equipment and money | Possessions step | Creation/gear | Partial | Outfit helpers | No | Main rank flow implemented; exact contents and replacement semantics need table tests. |
| CHAR-GIFT-001 | Ch.1 p.40, Table 1-15 | Birth gift distribution and nested rerolls/choice | Possessions step | Creation/gear | Partial | `birthGiftsTable`, custom creation choices | Browser smoke only | Conditional blessed-weapon modifiers and direct relic choices are corrected; nested choice/reroll effects still lack exhaustive 1-20 tests. |
| CHAR-STORY-001 | Ch.1 pp.41-42 | Record Glory, story and history | End creation/each adventure | Journal | Exact | Character sheet + journal | No | User-authored history is preserved. |
| CHAR-FEMALE-001 | Ch.1 pp.41-42 | Female knight alternatives and acceptance | GM permits | Creation | Partial | Female characteristic table | No | Full female attribute/skill creation and disguise/acceptance procedures absent. |
| LIFE-001 | Ch.1 pp.42-43; Ch.10 p.174 | Death, retirement, incapacity and second character are distinct | See detailed card | Lifecycle | Partial | Lifecycle state, Family Tree, Winter aging | `WIN-AGE-001`, `SAVE-LIFE-001`, `SUCCESSION-001` | Outcomes and active-character guards are distinct; prepared temporary second characters are not implemented. |
| LIFE-SALVATION-001 | Ch.1 pp.42-43, Table 1-16 | Salvation score and standard resolution | Death/definitive retirement | Family/lifecycle | Exact | `rollSalvation`, `resolveD20Roll` | `CORE-RES-001` to `003` | Uses the lowest religious trait, four printed passion/deed bonuses and standard d20 resolution only after career end. |
| LIFE-LEGACY-001 | Ch.1 p.42 | Salvation success transfers one score capped by Salvation and grants extra birth gift | Successful Salvation, next character | Succession/creation | Partial | `applySalvationLegacy`, pending legacy state | `SAVE-LIFE-001` partial | Invented Glory multiplier/heir reset removed; score and gift choices are preserved but not yet consumed by one atomic successor wizard. |
| LIFE-SAINT-001 | Ch.1 p.43, Table 1-17 | Canonization needs +15 deed bonuses, critical Salvation, successful Church Standing; two transfers + blessing | Qualified deceased/retired character | Succession/creation | Partial | Salvation/canonization and gated blessing roll | Core resolver tests; browser smoke | Canonization and blessing eligibility are exact; two score transfers are still pending successor-wizard work. |
| LIFE-NEWCHAR-001 | Ch.1 pp.43-44 | Same-family successor inherits family, APP/Valor/Glory/equipment/manors by listed rules | New character after career end | Succession/creation | Partial | `handleInheritCharacter`, custom generator, pending legacy state | `SUCCESSION-001`, `SAVE-LIFE-001` | Fixed reset and false death/retirement conflation removed; listed inheritance bonuses still require manual completion in generation. |
| LIFE-NEWFAMILY-001 | Ch.1 p.44 | GM-approved unrelated character gets no lineage benefit | Player choice | Creation | Missing | Generic reset only | No | No explicit unrelated-character route. |
| PAST-GF-001 | Ch.2 pp.46-56 | Grandfather yearly history 723-744 with exact tables and survival subrolls | Optional first-family history | Family ancestry | Partial | Large `FamilyTree.jsx` simulator | No | Extensive implementation but duplicated interactive/auto branches lack exhaustive table tests. |
| PAST-FATHER-001 | Ch.2 pp.46-63 | Father yearly history 745-766 and inheritance | Optional first-family history | Family ancestry | Partial | `FamilyTree.jsx` | No | Display elsewhere says through 767; table branches duplicated. |
| PAST-STANDARD-001 | Ch.2 p.47, Tables 2-1 to 2-3 | Ordinary-year, combat survival, death causes | Ancestor event directs roll | Ancestry | Partial | Local helpers/branches | No | Exact ranges not isolated/tested; retirement/death labels can be conflated. |
| TRAIT-HEROIC-001 | Ch.3 pp.67-68 | 20+ trait/passion rules; excess handling and Glory | Values exceed 19 | Sheet/checks/Winter | Partial | Values up to 30; passive Glory | No | Mandatory behavior and value-over-20 resolution depend on broken d20 logic. |
| TRAIT-ROLL-001 | Ch.3 pp.67, 71-73, Table 3-1 | Trait roll outcomes, opposing roll, checks and moral tests | GM calls trait test | Oracles | Partial | Trait widget | No | Natural 1 critical; several narrative rules not represented. |
| TRAIT-PAIR-001 | Ch.3 pp.68-70 | Twelve opposed pairs total 20 until exceptional >20 behavior | Trait changes | State sanitizer/sheet | Partial | Pair sanitizer, sheet and oracle controls | `CC-BASE-001` | Core UI and generation use twelve pairs; exceptional above-20 pair behavior still lacks complete mutation tests. |
| TRAIT-DISHONOR-001 | Ch.3 pp.74-76, Table 3-2 | Dishonorable acts reduce Honor as listed | Character commits act | Honor | Missing | Reference prose only | No | No structured act table. |
| PASSION-GAIN-001 | Ch.3 pp.73-79 | Passion creation/types/one Amor and initial values | Story event | Sheet/oracles | Partial | Dynamic passion object, courtship | No | One-Amor guard present in one flow; general acquisition and subject identity inconsistent. |
| PASSION-USE-001 | Ch.3 pp.79-81, Table 3-4 | Inspiration, shock, melancholy, madness and recovery | Player invokes/mandatory roll | Oracles/state | Partial | Passion simulator, `passionStates` | No | Base critical probability wrong; duration/recovery coverage incomplete. |
| PASSION-GROUP-001 | Ch.3 p.81 | Group inspiration resolution | Leader/group attempts | Oracles | Partial | Group widget | No | No rules-derived deterministic tests. |
| PASSION-MAND-001 | Ch.3 pp.81-82 | 16+ can require mandatory rolls; frivolous use lowers passion | Triggering circumstance | Oracles/GM helper | UI-only | Guidance/widget | No | Not enforced outside tool. |
| PASSION-OATH-001 | Ch.3 p.82 | Oaths create/alter passion and conflict with traits | Sworn oath | Sheet | Missing | None | No oath state. |
| GLORY-BASIC-001 | Ch.4 pp.84-87, Tables 4-1 to 4-3 | Glory is permanent; standard awards and ranks | Significant deed | Glory calculator | Partial | Manual Glory tools | No | Several app-authored presets are not source-traceable. |
| GLORY-COMBAT-001 | Ch.4 pp.88-90 | Opponent/round/tournament/battle Glory | Combat/tournament | Oracles | Partial | Combat and battle widgets | No | Personal combat resolution incomplete; some multipliers simplified. |
| GLORY-MARRIAGE-001 | Ch.4 p.88 | Marriage Glory rules | Marriage | Winter/Glory | Partial | Marriage table | No | Random marriage included; repeat/previous marriage cases not modeled. |
| GLORY-NONCOMBAT-001 | Ch.4 pp.88-91 | Noncombat, quest, honor, miracle awards | Qualifying deed | Glory tools | UI-only | Checkboxes/calculators | No | User can enter/apply values; no complete event linkage. |
| GLORY-PASSIVE-001 | Ch.4 pp.91-92 | Maintenance, holdings, items, stats 16+, ideals generate annual Glory | Winter Step 9 | Winter | Partial | `computeGlory` | No | Stats 16+ fixed previously; item/horse/conspicuous consumption coverage incomplete. |
| GLORY-BONUS-001 | Ch.4 pp.91-92; Ch.10 p.183 | One point per crossed 1000 threshold, spent immediately without restriction | Winter Step 10 | Winter | Partial | Bonus UI | No | User may intentionally discard unspent points; rule says must spend immediately. |
| STANDING-BASE-001 | Ch.4 pp.92-94 | Standing base, changes, gifts and rolls | Creation/social action | Sheet/oracles | Partial | Stored standings, donation helper | No | Starting values not reliably derived; gift rules incomplete. |
| SKILL-CATALOG-001 | Ch.5 pp.96-106 | Skill meanings, special outcomes, Honor/Glory interactions | Skill use | Sheet/reference | UI-only | Skill list and prose | No | No complete skill-specific engine. |
| COMBAT-MELEE-001 | Ch.7 pp.116-123 | Melee round phases and action declarations | Combat begins/each round | Combat engine | Missing | Single opposed-roll helper only | No | No end-to-end melee round state machine. |
| COMBAT-DAMAGE-001 | Ch.7 pp.118-119 | Damage, armor and shield reduction | Winning attack | Combat/health | Partial | Damage roller/reference | No | No canonical armor/shield/HP mutation pipeline. |
| COMBAT-DEX-001 | Ch.7 pp.119-121, Table 7-1 | DEX, encumbrance, footing, knockdown/climb/jump/sneak | Movement hazards | Combat | Missing | None | No stateful implementation. |
| COMBAT-MOD-001 | Ch.7 pp.122-123, Table 7-2 | Combat modifiers by situation | Combat resolution | Combat | UI-only | Reference list | No | Not enforced by resolver. |
| COMBAT-MOUNT-001 | Ch.7 pp.123-125 | Lance charge, mounted vs foot, horses/armor | Mounted combat | Combat | UI-only | Weapon notes | No | No action flow or horse damage state. |
| COMBAT-SPECIAL-001 | Ch.7 pp.125-129 | Weapon damage, nonlethal, joust, multiple foes, tactics | Chosen combat action | Combat | Missing | Some descriptions | No | No complete procedures. |
| HEALTH-HP-001 | Ch.7 pp.129-132 | HP loss, unconscious, zero HP, wound classes, unhealthy | Damage/healing | Health state | Missing | Only `currentHp` field | No | Thresholds and death/unconscious transitions absent. |
| HEALTH-HEAL-001 | Ch.7 pp.132-134, Tables 7-3 to 7-5 | First Aid, natural healing, Chirurgery, deterioration | Wound/recovery | Health | Missing | No engine | No | No wound records or weekly recovery. |
| HEALTH-HAZARD-001 | Ch.7 pp.134-136 | Disease, fall, fire, poison, suffocation, aggravation | Hazard | Health | Missing | Oracle prose only | No | No exact damage/effect procedures. |
| BATTLE-SKIRMISH-001 | Ch.8 pp.138-140, Tables 8-1/8-2 | Battle roll and follower fate in skirmish | Skirmish | Battle tool | Partial | Battle simulator | No | Does not model all follower outcomes. |
| BATTLE-ROUND-001 | Ch.8 pp.140-149, Tables 8-3 to 8-10 | Full battle setup, charge/melee rounds, followers, retreat/pursuit, victory | Battle | Battle tool | Partial | Battle simulator | No | Simplified; no table-complete state machine. |
| BATTLE-ENEMY-001 | Ch.8 pp.150-156 | Phase/culture-specific enemy tables | Determine enemy | Battle/reference | UI-only | Some enemy lists | No | Not exhaustive or phase-driven. |
| SIEGE-001 | Ch.8 pp.157-162, Tables 8-11 to 8-16 | Simple/advanced siege, health, assault, blockade, treachery, morale | Siege | Siege engine | Missing | Reference only | No | No execution flow. |
| MAGIC-PRAYER-001 | Ch.9 pp.165-168, Table 9-2 | Prayer modifiers, results and miracles | Prayer | Magic oracle | Partial | Prayer simulator | No | Uses broken d20 and simplified effect application. |
| MAGIC-TRIAL-001 | Ch.9 p.168 | Judicial combat/ordeal procedures | Trial | Magic oracle | Partial | Trial simulator | No | Critical logic wrong; full combat/ordeal consequences absent. |
| MAGIC-CONVERT-001 | Ch.9 pp.168-169 | Conversion sequence and rewards | Pagan conversion attempt | Magic oracle | Partial | Conversion simulator | No | Rolls are present but critical/opposed rules and exact results need table tests. |
| MAGIC-DREAM-001 | Ch.9 pp.169-170 | Dreams and omens | Trigger/GM | Magic oracle | Partial | Dream simulator | No | Narrative generator not fully source-traceable. |
| MAGIC-AMOR-001 | Ch.9 pp.170-172, Table 3-3 | Passive infatuation and deliberate Amor | Meeting/courtship | Magic oracle | Partial | Courtship simulator | No | Uses broken resolution; full staged procedure incomplete. |
| WINTER-ORDER-001 | Ch.10 pp.174-183 | Ten steps execute in source order | See detailed card | Winter | Partial | `FamilyWinter.jsx` | `WIN-AGE-001`, `WIN-ECO-001` | Step 2 now ages atomically and stops active flow on death; several later substeps remain incomplete. |
| WINTER-AGING-001 | Ch.10 pp.174-175, Tables 10-1/10-2 | Age +1 at Step 2; at 30+ roll losses; <=3 bedridden; 0 death | Winter Step 2 | Winter/lifecycle | Exact | `rollAging`, `applyAging`, lifecycle sanitizer | `WIN-AGE-001`, `SAVE-LIFE-001` | Age advances before the age-30 check and zero/bedridden outcomes persist distinctly. |
| WINTER-SQUIRE-001 | Ch.10 p.174 | Squire ages at Step 2 and is replaced by a 14-year-old at 18 | Winter Step 2 | Winter/squire | Exact | Winter Step 2 | `WIN-AGE-001` partial | Squire age advances with the character and replacement begins at 14. |
| WINTER-HARVEST-001 | Ch.10 pp.175-176, Tables 10-3/10-4 | Modified Stewardship determines manor income | Landed character Step 3 | Winter/economy | Partial | `getHarvestModifier`, `resolveHarvest`, Winter economy | `WIN-ECO-001` | Standing, prosperity, phase and manual disaster modifiers work; chronology-specific disasters are not auto-fired. |
| WINTER-MAINT-001 | Ch.10 pp.176-177, Table 10-5 | Choose/pay Maintenance; forced changes use Temperate/Indulgent; effects apply | Winter Step 3 | Winter/economy | Partial | Economy ledger and explicit net resolution | `WIN-ECO-001` partial | Gross income no longer silently becomes cash; exact lifestyle choices/effects remain manually resolved. |
| WINTER-SURVIVAL-001 | Ch.10 p.177, Tables 10-6/10-7 | Roll each relative, retainer and child with age/maintenance | Winter Step 4 | Winter/family | Partial | Squire only | No | Most NPCs are skipped. |
| WINTER-MOUNT-001 | Ch.10 p.177, Tables 10-6/10-8 | Roll each special mount; ordinary herd mounts replaced | Winter Step 4 | Winter/horses | Partial | Winter mount age/survival | `WIN-AGE-001` partial | Mount age now advances; all special mounts and ordinary-herd replacement semantics remain incomplete. |
| WINTER-PERSONAL-001 | Ch.10 pp.177-180, Table 10-9 | One d20 event if no solo adventure; then exact trait/passion/standing outcome | Winter Step 5 | Winter | Partial | `personalEventTable`, `applyPersonalEvent`, shared d20 resolver | Core resolver tests | Roll grading is corrected; several source result choices/effects remain unresolved rather than fully automated. |
| WINTER-MARRIAGE-001 | Ch.10 pp.177-180, Table 10-10 | Permission/Courtesy, waiting modifier, one final table roll | Winter Step 6 | Winter/family | Partial | Random marriage table | No | Courtship prerequisite and waiting-state rules are manual/absent. |
| WINTER-CHILDBIRTH-001 | Ch.10 p.180, Table 10-11 | Per eligible woman, pay non-wife upkeep first, modified roll and sex d6 | Winter Step 6 | Winter/family | Partial | Childbirth widget | No | One selected mother only; sex is generated with 50/50 equivalent but roll not recorded; upkeep is deducted after roll application. |
| WINTER-FAMILY-001 | Ch.10 pp.181-182, Tables 10-12/10-13 | Family event d20 and relation/sex target table | Winter Step 6 | Winter/family | Partial | Family event handler | No | Target is uniform among current living relatives, not Table 10-13 distribution. |
| WINTER-TRAIN-001 | Ch.10 p.182 | Choose one of three exact annual training options and limits | Winter Step 8 | Winter | Partial | Training UI | No | Most limits present; age constraints and source categories require tests. |
| WINTER-GLORY-001 | Ch.10 pp.182-183 | Add play, solo, honor and annual/passive Glory | Winter Step 9 | Winter | Partial | `computeGlory`, `applyGlory` | No | Several annual sources omitted; economy basis wrong. |
| AMBITION-CLASS-001 | Ch.11 pp.184-191 | Class requirements/duties/benefits/retirement | Promotion/career | Career system | UI-only | Lore/reference | No | No eligibility or yearly benefit engine. |
| AMBITION-IDEAL-001 | Ch.11 pp.191-192 | Ideal requirements/duties/benefits | Qualification | Sheet/Winter | Partial | Badges/annual Glory | No | See CHAR-IDEAL-001. |
| WEALTH-LEVEL-001 | Ch.12 pp.194-196 | Wealth levels, prerogatives, retinues | Holdings/maintenance | Economy | Partial | Cash/manors/maintenance fields | No | No coherent ledger or wealth-level engine. |
| WEALTH-INCOME-001 | Ch.12 pp.196-199 | Land, ransom, aids, taxes, service, loans and sales | Economic event | Economy | Missing | Some manual notes | No | No exact procedures. |
| WEALTH-MARKET-001 | Ch.12 pp.199-206 | Buying/selling/trade and exact price lists | Purchase/sale | Armory | UI-only | Armory/reference | No | Reference/appraisal exists; transactions are not table-complete. |
| ITEM-MAGIC-001 | Ch.12 pp.206-211 | Enchanted item/relic individual effects | Possession/use | Gear/combat | UI-only | Lore | No | Effects are descriptive, not enforced. |
| SOCIETY-LAW-001 | Ch.13 pp.221-224 | Courts, trial, punishment, missi procedures | Legal adventure | Adventure tools | UI-only | Scenario/lore helpers | No | No complete legal state machine. |
| SOCIETY-HUNT-001 | Ch.13 pp.230-231 | Court hunt procedure | Hunt | Hunt tools | Partial | Solo references | No | Full Chapter 19 hunt is also partial. |
| SOCIETY-TOURN-001 | Ch.13 pp.232-234 | Tournament phases/events | Tournament | Solo reference | UI-only | Lore | No | No executable tournament. |
| FRANKLAND-001 | Ch.14 pp.262-283 | Homeland locations/modifiers and regional data | Character/adventure location | Lore/creation | Partial | `lore.js`, maps | No | Rich reference data; only Ardennes modifier partially executable. |
| FUTURE-EVENT-001 | Ch.15 pp.286-321 | Annual history, harvest, warfare and technology changes | New year | Chronology/rules | Partial | `chronologyData` | No | Narrative coverage exists; rule modifiers/equipment changes are not driven by year. |
| CULTURE-ATTR-001 | Ch.17 p.372, Table 17-1 | Foreign culture attribute generation | Foreign character | Creation | UI-only | Lore/culture data | No | No executable foreign generator. |
| CULTURE-SKILL-001 | Ch.17 pp.342-372 | Culture-specific traits, skills, gear and honor | Foreign character/opponent | Creation/reference | UI-only | `lore.js` | No | Reference only. |
| OPPONENT-001 | Ch.18 pp.374-380 | Standard NPCs, movement and horse rules | Encounter | Combat/reference | UI-only | `lore.js`/oracle lists | No | No canonical stat-block resolver. |
| CREATURE-001 | Ch.18 pp.381-391 | Animals, avoidance, valor, creatures/faeries | Encounter/hunt | Combat/hunt | UI-only | Bestiary | No | No exact combat/avoidance engine. |
| ADV-STRUCT-001 | Ch.19 pp.392-395 | Campaign/adventure/quest structure | GM preparation | Journal/lore | UI-only | Scenario summaries | No | No quest state or slot engine despite audit checklist applicability. |
| ADV-JEWEL-001 | Ch.19 pp.396-400 | Adventure of the Jewel encounters/results | Scenario | Adventure | UI-only | Summary only | No | Not playable end to end. |
| ADV-SQUIRE-001 | Ch.19 pp.401-409 | Humble Squires and 767 opening | First scenario | Adventure/chronology | UI-only | 767 chronology entry and scenario reference | Browser smoke | Opening year is visible, but the scenario is not playable end to end. |
| ADV-SHORT-001 | Ch.19 pp.410-424 | Fifteen short-form scenario procedures/tables | Chosen scenario | Adventure | UI-only | Summaries | No | Not executable end to end. |
| HUNT-001 | Ch.19 pp.425-427, Tables 19-8 to 19-12 | Search, chase, obstacles, prey and kill | Hunt | Solo oracle | UI-only | Summary/reference | No | No table-complete flow. |
| CHASE-001 | Ch.19 pp.427-428 | Pursuit speed/terrain/danger | Chase | Battle pursuit | Partial | Pursuit helper | No | Battle-only simplification. |
| SOLO-CROSSROAD-001 | Ch.19 pp.428-429, Tables 19-13/19-14 | Crossroad challenge and opponent quality | Solo scenario | Oracles | UI-only | Reference summaries | No | App's 1-20 summary is not the source procedure. |
| SOLO-FEUD-001 | Ch.19 pp.429-430, Tables 19-15/19-16 | Feud exhort/recon/frontation/combat | Solo scenario | Oracles | UI-only | Reference | No | Not executable. |
| SOLO-TRAVEL-001 | Ch.19 pp.430-434, Tables 19-18 to 19-26 | Forest, Holy Lands, wild hunt, madness, mallus, missus, pilgrimage | Solo scenario | Oracles | Partial | Several isolated widgets | No | No complete ordered flows or persistence. |
| SOLO-ROMANCE-001 | Ch.19 pp.434-437, Tables 19-27 to 19-30 | Declaration, rejection, wooing, essai, exposure, pregnancy | Solo scenario | Courtship | Partial | Courtship widget | No | Simplified and uses wrong d20 resolver. |
| SOLO-COURT-001 | Ch.19 pp.437-440, Tables 19-31 to 19-36 | Court, tournament, vassal service, manor | Solo scenario | Oracles/lore | UI-only | Reference/calculators | No | No complete event engine. |
| APP-NAME-001 | App.1 pp.440-441 | Frankish prefix/suffix generator/equivalents | Name generation | Lore/creation | Partial | `names.js` | No | Data not audited item by item in automated tests. |
| SAVE-LOCAL-001 | App feature, no rulebook rule | Offline-first local auto-save | Any state change | Persistence | House Rule | `App.jsx` | Manual only | Interface convenience; should not alter game results. |
| SAVE-CLOUD-001 | App feature, no rulebook rule | Explicit cloud save/load | Signed-in user action | Persistence | House Rule | `firebase.js`, `App.jsx` | Mock only | Real remote smoke requires user configuration. |
| SAVE-IMPORT-001 | App feature, no rulebook rule | JSON export/import and schema migration | User action/startup | Persistence | House Rule | Settings + sanitizer | Partial hostile regression | Convenience; validation currently requires sections older saves may lack. |
| SAVE-IDEMP-001 | App integrity rule | Rule result must not apply twice | Double click/re-entry/load | All mutating flows | Partial | `applyOnce`, event IDs | Hostile regression partial | Many flows use it, but not all random/UI actions share one guard. |
| RNG-001 | App testability concern | One injectable RNG should preserve every source distribution | Any random result | Rules engine | Partial | Injectable core rule helpers; legacy widgets | `CC-BASE-001` and boundary tests | Core generators can be deterministic, but many legacy UI tables still call `Math.random` directly. |
| OFFLINE-001 | App feature, no online rules feed | Offline and online use the same local rule code/data | Network/auth changes | Persistence | Exact | Firebase only stores whole character object | Mock test partial | There is no online rule/event feed, so fallback cannot alter table odds; remote round-trip still unverified. |

## Coverage notes

- A row marked `UI-only` is intentionally not upgraded to `Exact` merely because the source text is displayed.
- A row marked `Partial` may contain exact subparts; the issue column names the missing or divergent path that prevents an `Exact` rating.
- Book II setting prose that has no trigger, choice, random calculation, state change, exception, or ordering effect is reference content and is outside the rule count. Book II procedures and tables are included above.
- The full random-table item audit remains linked to the table-family row. Each automated table test should enumerate every legal roll and boundary rather than sample random output.
