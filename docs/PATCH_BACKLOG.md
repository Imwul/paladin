# Patch Backlog

Local/offline Release Green is accepted for the current exploit fix sprint. The items below are tracked as follow-up patch risks, not release blockers.

## Temporary CI Standard

`npm run lint` is currently isolated as an environment/toolchain issue. Minimal reproduction shows the ESLint CLI boot hangs before project source, flat config, or ignored paths are evaluated:

- `node ./node_modules/eslint/bin/eslint.js --version` hangs.
- `node ./node_modules/eslint/bin/eslint.js --no-config-lookup src/utils/campaignState.js` hangs.
- Plain Node and package resolution still work.

Until ESLint is recovered, use:

```sh
npm run ci:temporary
```

This runs `npm run build && node scripts/hostile-regression.mjs`.

## Winter Manual Resolution

Winter personal and family events now mark incomplete automation with `manual resolution required` in the UI. These labels are intentional: some rulebook outcomes require choosing a target, adjudicating a test outside the current sheet, or applying table-specific state that the app does not yet mutate automatically.

Future patches should either automate a specific outcome fully or keep the manual resolution marker visible.

## Family Manual Edit Warnings

The family edit modal now blocks obvious impossible relationships before saving:

- self as parent
- self as spouse
- same person as parent and spouse
- parent cycles
- generation inversion
- parent/child spouse links
- multiple living active `본인` records

The sanitizer remains the final defense for imports, save/load, and cloud state. Future patches can add inline form hints, but impossible edits must continue to fail before corrupt links become live UI state.

## Firebase Remote Smoke

Real Firebase remote save/load smoke is unverified and pending a real user Firebase config. This session had no project config in repo files, environment files, or browser storage, so only mock/offline behavior was verified. The app must stay mock/offline unless a user config is present.

Required smoke when config is available:

1. Add a real Firebase config through Settings.
2. Reload after the config change.
3. Save a sanitized campaign to cloud.
4. Load it back into a fresh app session.
5. Confirm family, annals, winter state, applied event IDs, and active knight identity match the local sanitized state.
6. Remove the config and confirm the app returns to mock/offline mode.

## Winter Completion Gate

The winter completion gate is an explicit manual skip gate, not a hard block. If required winter steps or required unresolved events remain, the app must present a confirmation listing the unresolved items. Choosing cancel must keep the winter phase open. Choosing confirm is treated as an intentional manual skip and should be logged/persisted as such.

Confirmed manual skips are now written into the winter journal summary and tagged with a persistent `winter:manual_skip:<year>` applied event. This preserves the fact that the player intentionally bypassed a required unresolved item instead of silently completing the phase.

## Hostile Regression Guard

Keep `scripts/hostile-regression.mjs` as a required guard. Any recurrence in save/load sanitization, succession event duplication, winter step schema, unresolved winter state, or family graph corruption must fail the script immediately.

## Final Local Wrap-Up

Local verification remains the release standard unless a real Firebase config is supplied. Browser click-through was partially verified on character and family views; a later in-app browser policy block prevented completing the winter tab click-through in that surface. Do not record Firebase remote save/load or full browser winter click-through as verified until those checks are rerun with an available browser session and real config.
