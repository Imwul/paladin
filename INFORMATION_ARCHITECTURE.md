# Information Architecture

## Global Frame

1. Royal header: product identity, year, folio, save revision and cloud commands.
2. Persistent campaign strip: year, phase, active character, lifecycle, Winter progress and unresolved count.
3. Folio index: ten stable destinations in record order.
4. Breadcrumb: current Korean screen name and canonical English register label.
5. Folio content: one screen owns one reading task.

## Navigation

| Screen | Primary question | Canonical owner |
|---|---|---|
| Dashboard | What is happening now? | Derived selectors only |
| Chronicle | What happened, when and why? | `campaign.chronicleEvents`, journal |
| Character | Who is the active knight? | character and lifecycle state |
| Family | How does lineage and succession continue? | family register and lifecycle |
| Winter | What annual rule step is next? | `winterRules` transaction state |
| Adventure | What is the current authored scenario record? | journal/adventure data |
| Standing | How is each relationship valued? | canonical Standing fields and checks |
| Glory | Where did Glory come from? | Glory totals and transaction sources |
| Oracles | Which optional/manual play tool is needed? | shared rules engine plus explicit house aids |
| Reference | What short source context is relevant? | reference data, never copied full rulebook text |

Settings is a global command rather than a content destination because it owns import, export and cloud configuration, not campaign narrative.

## Data Flow

```text
Printed Rulebook
  -> Rules Engine resolver
  -> schema-v5 canonical campaign transaction
  -> selectors and screen models
  -> UI ledger / Chronicle / status
```

UI components may collect input and display results. They do not calculate outcomes, mutate scores, select unresolved choices or advance lifecycle state.

## Pending Actions

Priority is lifecycle, unresolved Winter choice, in-progress character creation, Winter continuation, then current adventure. Dashboard shows only currently valid actions. The persistent strip always exposes the unresolved count and save revision even when the user visits another folio.

## Winter Ownership

`WINTER_STEPS` is the immutable source order. `resolveWinterStep` owns calculation and mutation; `recordManualWinterResolution` owns explicit GM records; `closeWinterYear` alone advances the year. The screen reads records and submits input. Migration preserves old progress without exposing legacy step names.

## Responsive Behavior

- Desktop: persistent index and multi-column ledgers.
- Tablet: narrower index and reduced dossier tracks.
- Mobile: off-canvas scrollable index, one-column folio, generation-focused family list and step-by-step Winter.
- Long Chronicle data remains grouped by year.
- Rule references collapse in place to preserve context.

## Save and Conflict

Local state is primary and auto-saved after canonical updates. Cloud import compares document revisions. A mismatch opens a version comparison dialog; choosing local or cloud replaces the complete sanitized document. Partial object merges are not allowed because they can violate lifecycle and one-active-character invariants.
