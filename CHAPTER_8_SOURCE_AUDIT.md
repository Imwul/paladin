# Chapter 8 Source Audit

## Authority And Method

- Authority: `paladin_core_rulebook.pdf`, printed pages 137-161.
- Re-read: 2026-08-09, page images and extracted text checked from the chapter opening through Siege Glory.
- Implementation boundary: Chapter 8 owns skirmish command and followers, mass-battle abstraction, and siege. Normal individual blows use the shared Chapter 7 combat and health engine.
- No result is inferred where the source gives the decision to the Gamemaster. Those points are explicit inputs or structured pending records.

## Executable Tables

| Table | Source | Input And Condition | Roll And Modifiers | Output And State Change | Next Step / Choice | Runtime |
|---|---|---|---|---|---|---|
| 8-1 | p.138 | Skirmish commander Battle | Unopposed Battle; critical +5, success 0, failure -5, fumble -10 | Stores first-melee and subordinate-leader modifier | First personal melee; no player choice after roll | `resolveSkirmishCommand`, `resolveCommandRoll` |
| 8-2 | pp.138-139 | Each non-overlapping leader group and follower count | Leader Battle plus Table 8-1 modifier | Exact killed, wounded, captured, survivors, and enemy captives; canonical follower entities updated | Player assigns exact people because the source does not prescribe selection | `resolveSkirmishFollowers`, `assignSkirmishFollowerFates` |
| 8-3 | p.144 | Mounted/equal-foot unit Battle result | Battle with command, melee event, isolation and lone modifiers | Engaged state, modifier, and exact allowed actions | Player chooses only from returned actions | `resolveUnitBattleRoll`, `beginBattleMeleeRound` |
| 8-4 | p.144 | Foot unit facing mounted enemy | Same unit Battle roll; success also checks Melee Event total | Engaged/disengaged state and allowed actions | Engage, withdraw, or surrender as printed | `resolveUnitBattleRoll`, `beginBattleMeleeRound` |
| 8-5 | p.145 | Special event action after eligible unit result | 1d20, then a fresh Battle Enemy roll with the printed modifier | Weapon, bodyguard-table, and next-melee modifiers | Chapter 7 special combat may run as long as needed, then its result and extra Glory return to the battle round | `executeTable85`, `prepareBattleSpecialEvent`, `completeBattleMeleeRound` |
| 8-6 | p.145 | Rally action while disengaged | Battle plus Glory/1,000 minus 2d6 | Rallied followers, commander status, or desertion | Continue attached or alone | `executeTable86`, `completeBattleMeleeRound` |
| 8-7 | p.146 | Flee or escape from an enemy | Opposed Horsemanship/DEX against enemy weapon; route run applies -15 | Escape, shield applicability, weapon loss, and next Battle modifier | Aftermath on escape; melee on failure | `executeTable87`, `resolveBattleWithdrawal` |
| 8-8 | p.147 | Followers or whole-force fate | Battle outcome and force count; Paladin half-up rounding | Killed, wounded, captured, survivors, enemy captives, and fumble survivor rout | Exact follower assignment or aftermath; routed followers leave later rolls | `executeTable88`, follower and aftermath flows |
| 8-9 | p.148 | Routed/retreated status of both armies | No roll; -10/-5/+5/+10 sum | Final-result roll modifier | Table 8-10 | `calculateTable89Modifier`, `resolveBattleAftermath` |
| 8-10 | p.148 | Final 1d20 plus Table 8-9 | Adjusted 2 or less, 3-18, 19 or more | Decisive defeat, indecisive, decisive victory and force-fate modifier | Force fate, loot, ransom and Glory | `executeTable810`, `resolveBattleAftermath` |
| 8-11 | p.158 | Monthly personal and troop Siege health | Siege rolls with carried health modifiers | Personal all-skill penalty, next-health modifier and fumble surgery need; unavailable troops, siege and morale modifiers | Monthly tactic or morale | `executeTable811`, `resolveSiegeHealth` |
| 8-12 | p.158 | Attacker and defender Siege outcomes | Opposed outcome matrix after DV and equipment modifiers | Defense held/taken, both loss levels, retirement, and the critical-vs-fumble extra defense line | Morale, next defense line, or aftermath | `executeTable812`, simple and advanced assault flows |
| 8-13 | p.159 | Blockade Stewardship by both sides | Stewardship plus carried modifier | Next-month and morale modifiers | Morale or next month | `executeTable813`, `resolveSiegeTactic` |
| 8-14 | p.159 | Attacker Intrigue, bribe and target | Intrigue plus spent bribe | Target morale requirement or next target bonus | Defender morale or next month | `executeTable814`, `resolveSiegeTactic` |
| 8-15 | p.160 | Defender Valorous, retinue, commoners in order | Three conditional checks with immediate and carried modifiers | Surrender, betrayal, revolt, Honor loss, or continuation | Aftermath or next month | `executeTable815`, `resolveSiegeMorale` |
| 8-16 | p.160 | Attacker Valorous, retinue, commoners in order | Three conditional checks with immediate and carried modifiers | Abandonment, revolt, equipment loss, Honor loss, siege modifier, or continuation | Aftermath or next month | `executeTable816`, `resolveSiegeMorale` |

## Non-Table Procedures

- Battle setup preserves scale, duration, army and battalion command, role, army sizes, homeland, mount, lance, armor, shield, enemy table, and canonical follower references.
- The first charge is round one. It requires horse and lance; missile damage parity selects horse or rider and uses Horsemanship/DEX fall consequences.
- Every later round generates the 3d6 Melee Event and a fresh foe from the selected Battle Enemy table before the unit Battle roll. Triple 2 and triple 5 use their printed special entries.
- Retreat, rout stand, escape, surrender, optional one- or two-round pursuit, final army fate, participation/command Glory, loot and prisoners are persisted. The second pursuit round is an opposed Hunting-versus-weapon roll, including Prudent capture and separate foot-ambush strikes.
- Battle Enemy tables on pp.149-155 are executable lookups for early knights, late knights, footmen, Saxons/Danes, Bretons, Basques, Slavs, and Huns/Avars, including 21+ rows.
- Siege is a separate monthly state. It preserves multiple DV rings, natural DV, equipment, troops, casualties, health, morale, tactics, result, fortress control and Glory.

## Explicit Boundaries

- Skirmish personal attacks and siege single combat use Chapter 7 combat results. Chapter 8 adds no replacement damage rule.
- Gamemaster-decided skirmish result, captured-follower rescue, battle duration, clear narrative victory, single-combat winner, and loot amount remain visible choices.
- Ransom claims are retained in `pendingEconomy` until Chapter 12 supplies the amount and settlement procedure.
- Nobles captured with a castle remain structured as pending GM escape/death outcomes, as required by the source.

## Test Link

`scripts/battle-siege-regression.mjs` verifies Tables 8-1 through 8-16, every Battle Enemy table boundary, legal state transitions, follower identity and casualty persistence, injury/death/capture, retreat/pursuit, assault/blockade/treachery/morale, fortress persistence, and schema v8 reload behavior.
