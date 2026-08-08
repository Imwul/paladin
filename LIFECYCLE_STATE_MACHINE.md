# Lifecycle State Machine

## States

| State | Meaning | Active character |
|---|---|---|
| `active` | Normal playable primary character. | Required. |
| `incapacitated` | Temporarily unable to adventure; prepared second character may be used. | Primary retained but inactive during substitution. |
| `bedridden` | Living character with a relevant attribute at 3 or less; continues Aging. | Retained; normal adventure participation is restricted, but the temporary prepared-second route is not inferred. |
| `deceased` | Career ended by death or attribute 0. | Cleared. |
| `retired` | Living character whose career definitively ended. | Cleared. |
| `pending_salvation` | Career end is committed; Salvation ledger/roll remains. | None. |
| `pending_legacy` | Salvation resolved; score/gift/blessing/inheritance choices remain. | None. |
| `pending_successor` | Legacy resolved or unavailable; successor mode remains. | None. |
| `successor_in_creation` | Canonical twenty-step creation session is saved in progress. | None for permanent succession; prepared character is a temporary exception. |
| `historical` | Predecessor retained for lineage/Chronicle and never auto-reactivated. | None. |

`careerStatus` keeps the living/deceased/retired truth while `status` may describe the pending workflow. For example, a deceased predecessor can have workflow status `pending_salvation`.

## Allowed Transitions

| From | Trigger | To | Resolver/transaction |
|---|---|---|---|
| `active` | Temporary incapacity | `incapacitated` | `resolveIncapacitation` |
| `active`/`incapacitated` | Attribute 1-3 | `bedridden` | `resolveBedridden` / `resolveAttributeLifecycle` |
| `incapacitated`/`bedridden` | Owning rule confirms recovery | `active` | `resolveRecovery` |
| Living career state | Death confirmation or attribute 0 | `deceased` + `pending_salvation` | `prepareCareerEnd` then `resolveDeath` |
| Living career state | Definitive retirement confirmation | `retired` + `pending_salvation` | `prepareCareerEnd` then `resolveRetirement` |
| `pending_salvation` | Salvation resolved | `pending_legacy` or `pending_successor` | `resolveSalvation` |
| `pending_legacy` | Transfers/inheritance confirmed | `pending_successor` | `updateLegacyChoices` |
| `pending_successor` | Same/new-family route starts | `successor_in_creation` | `createSuccessorContext`, `beginSuccessorCreation` |
| `successor_in_creation` | Canonical wizard commits | predecessor `historical`, successor `active` | `completeCharacterCreation` |
| `incapacitated` | Prepared second character starts | `successor_in_creation` temporary context | `beginSuccessorCreation` |
| Prepared second active | Primary recovery explicitly confirmed | primary `active` | `restorePrimaryCharacter` |

## Forbidden Transitions

- `incapacitated` or `bedridden` directly to Salvation.
- `deceased`, `retired` or `historical` directly back to `active`.
- Salvation before a committed death or definitive retirement.
- Legacy transfer before successful Salvation; two transfers without successful Canonization.
- Blessing display/roll without an unconsumed Canonization grant.
- Same-family benefit on the new-family route.
- Permanent successor activation below age 15 or before canonical creation completion.
- A second permanent successor after the completion effect ID is recorded.
- Automatic regency or automatic creation of a replacement template.

## Career-End Transaction

Confirmation applies together:

- Character and Family Tree career status.
- Cause, year, age and source reference.
- Active-character removal and predecessor snapshot.
- Journal and Chronicle entries.
- Salvation eligibility and pending choices.
- Applied event/effect IDs and save revision.

Each lifecycle event stores `lifecycleEventId`, `sourceRuleId`, `previousStatus`, `nextStatus`, `cause`, `year`, `age`, `sourcePage`, `triggeringEvent`, `unresolvedChoices`, `appliedEffectIds`, `journalEntryId` and `timestamp`.

## Pending State and Save/Resume

Schema version 5 persists career-end confirmation, Salvation ledger/result, Canonization eligibility/check, Legacy selections and grants, successor mode, creation session and completion IDs. Sanitization preserves valid pending data, removes invalid duplicate grants and never converts a dead/historical predecessor into an active character.

Version 4 `pending_succession` is deliberately migrated to `historical` plus unresolved `pending_successor`, because the old state cannot prove death versus retirement. The user must resolve the historical context instead of receiving an invented answer.

## Idempotency and Invariants

- Every mutation checks a stable event/effect/completion ID before applying.
- A resolved Salvation or Canonization roll is returned unchanged on repeat requests.
- Birth Gift, blessing, equipment and Legacy are consumed once during canonical completion.
- Predecessor equipment receives provenance and cannot be copied by the same completion twice.
- At most one permanent character has active status after completion.
- The predecessor remains in Family Tree and Chronicle as deceased, retired or historical.

## Winter and Shell Integration

- Winter Aging calls `resolveAttributeLifecycle`; the Winter UI never writes lifecycle status directly.
- A bedridden or deceased result is stored on the Aging transaction with its lifecycle event ID and remains visible in the persistent campaign strip.
- Every Winter step has an independent completion ID, so a resumed save cannot age a character, squire or mount twice.
- The year advances only after all ten printed Winter steps resolve and all Glory bonus points are spent.
- App Shell navigation, Dashboard, Character dossier, Family register and Chronicle derive lifecycle labels from this canonical state; none owns a parallel successor flag.
- Cloud conflicts compare schema-v5 save revisions and show both document versions before replacement. Choosing a version replaces the whole canonical campaign object through the sanitizer.
