# Paladin v1.0.0 Golden Master Record

## Release Identity

- Version: `1.0.0`
- Candidate: `v1.0.0`
- Release commit: the commit containing this record, resolved by annotated tag `v1.0.0^{commit}`
- Production URL: `https://imwul.github.io/paladin/`
- Save schema: v12
- Phase 17 source commit: `237c9db32251e0cdb1bfe896937371f69e234534`
- Certified source patch SHA-256: `3b0182bdaf76364479ce32ae0ccd2dcf1e3abe6e37356c2586482da11448998e`

This record becomes effective only when all 24 pre-tag gates pass, the annotated `v1.0.0` tag is published, the GitHub Pages deployment reports the same commit, and the post-deploy production smoke passes. The exact release commit hash is also recorded in the annotated tag, GitHub Release, and final packaging report.

The pre-tag production smoke found one mobile-only Family editor cascade defect: desktop generation rows overrode the earlier narrow-screen layout. The release candidate includes only the corrective responsive CSS override. At 360-390 px the editor now uses one-column cards, ignores saved desktop drag offsets, retains zero document overflow, and exposes 44 px action controls. The source patch identity above supersedes the earlier Phase 17 hash; all certification gates are rerun against this exact patch before tagging.

## Rule Integrity

- Deterministic rule gaps: 0
- Blocker / Major / Minor: 0 / 0 / 0
- Source ambiguity clusters: 9
- Unsupported invented rules: 0
- Validated campaign rulebook reopen count: 0
- Certification gates: 40 / 40 PASS

Intentional GM/player judgment, narrative interpretation, reference-only material, and source ambiguities remain explicit. They are not replaced with invented deterministic rules.

## Automated Evidence

- Full temporary CI: PASS
- Schema v12 migration: PASS
- Hostile saves: PASS
- Idempotency: PASS
- 11-year campaign: PASS
- Production build: PASS
- Production-browser console: 0 errors / 0 warnings
- Responsive browser evidence: 360 through 3440 px PASS

## Known Engineering Debt

- Repository ESLint: 129 quality-only errors / 0 warnings
- `no-unused-vars`: 66
- `no-useless-assignment`: 63
- Runtime-risk React Hook findings: 0
- Main bundle: 696.01 kB / gzip 212.32 kB
- Existing build warning: main chunk exceeds 500 kB

These items are frozen as known post-1.0 engineering debt and are not cleaned in the release packaging change.

## Verification Limitations

- Physical phone/tablet: `NOT TESTED - ENVIRONMENT UNAVAILABLE`
- Physical screen reader: `NOT TESTED - ENVIRONMENT UNAVAILABLE`
- Authenticated Firebase multi-client conflict: `NOT TESTED - ENVIRONMENT UNAVAILABLE`

Browser viewport emulation, semantic control inspection, focus behavior, modal handling, local save/reload, and hostile save recovery remain part of the certified evidence.

## Freeze Policy

The annotated `v1.0.0` tag must never be moved or overwritten.

- `1.0.x`: bug, accessibility, compatibility, performance, and documentation fixes
- `1.x`: optional convenience features
- `2.0`: substantial rule interpretation, architecture, or save-model changes

No lint cleanup, bundle optimization, refactor, or dependency upgrade is included in this Golden Master packaging.
