# Promoted root implementation verification

Updated 8 September 2026 for the complete single-Store positioning candidate.

The Apple landing experience is the sole root route. Its styles, composition, controls and conceptual visuals remain under `src/apple`; the implementation directory name is intentionally unchanged.

## Content and design

- [Coverage manifest](apple-content-coverage.json) accounts for both locales, all 16 content topics, 17 full feature inventories, public overrides, source-only/empty entries, internal exclusions, accessible labels and conditional destinations.
- Source data is consumed read-only. `operate-body-public` and `platform-public` replace the unpublished source versions. Restricted recovery/operations details remain excluded.
- Native details expose all long inventories without JavaScript. The page uses system fonts, normal Arabic tracking, a centered introduction, a commerce overview, independent Store-ledger surfaces, varied product stories and an unnumbered feature index.
- Only selected-locale text is rendered, with the specified brand and destination-language exceptions. Existing storage keys/defaults and theme infrastructure remain unchanged.
- Motion is limited to reversible CSS press feedback. There is no animation dependency, hidden reveal state, gesture requirement or continuous animation. Reduced motion removes transforms; reduced transparency/increased contrast uses solid navigation.
- Candidate social-image tags are omitted; shared root social images are retained only on `/`. Candidate robots are always `noindex, nofollow`.

## Verification results

- TypeScript and ESLint: pass.
- Full Vitest suite: 20 tests pass.
- Full Chromium browser suite: 28 tests pass, including 10 candidate tests and 18 root-route regression tests.
- Review production build: pass; server-rendered/prerendered `/` was emitted.
- Built-output audit: pass for English/Arabic and light/dark at 375×900, including serious/critical axe checks, overflow checks, and synthetic performance observations.
- Candidate responsive/accessibility checks: 320, 375, 768, 1024 and 1440 CSS pixels; both locales and themes; 200% text reflow at 320 pixels; forced colors; reduced motion; system theme changes.
- Resilience: disabled JavaScript/native disclosures, failed fonts, unavailable storage, browser-language initialization, deep links, language/disclosure/focus continuity, mobile Escape/selection dismissal, and client history navigation.
- Content coverage: 778 bilingual entries; all 16 substantive topic identities; all 17 feature groups; visible, expanded, conditional, metadata, superseded, and excluded states are represented in [the coverage manifest](apple-content-coverage.json).
- Root route: automated route-history assertions preserve root typography, layout, localized metadata, and return behavior. The [root comparison record](apple-evidence/root-comparison.json) reports exact byte matches at 375 pixels and small exact-image mismatches at 1440 pixels; visual inspection shows the desktop before/after/return captures are equivalent, but this is recorded as a limitation rather than converted into a pass claim.
- Final build emits separate candidate assets (`apple-*.js` and `apple-*.css`); the root entry does not eagerly import the candidate module.

The browser suite was run with Chromium in this checkout. Firefox/WebKit coverage is not claimed for this gate. Focus retention is tested through keyboard activation because pointer clicks do not focus buttons consistently across browsers. The evidence capture uses reduced motion and waits for fonts before screenshots; exact-image comparison remains sensitive to rendering differences.

Production destination configuration is not supplied in this checkout. Review-build pending states were verified; live product/legal destinations and a configured production release were not exercised. No deployment was performed. Physical low-end hardware and assistive-technology reading remain manual review items; automated accessibility does not substitute for those checks.

## Standards

The independent standards review found no hard repository-standard violations and one possible duplicated-policy smell. The repeated exclusion predicate was consolidated in candidate-owned `publicContent.ts`, shared with the manifest generator; the browser suite independently asserts restricted content is absent. No outstanding reported findings.

## Spec

The independent spec review found two issues: negative Arabic tracking on smaller headings/closing text, and shared social-image metadata on the candidate. Both were corrected. Its additional Arabic cross-route metadata concern was verified with browser history tests and passes. No outstanding reported findings.

Standards: 0 outstanding findings. Spec: 0 outstanding findings.

## Evidence and reproduction

- [English desktop](apple-evidence/apple-en-light-1440.png)
- [Arabic mobile, dark](apple-evidence/apple-ar-dark-375.png)
- [Arabic desktop](apple-evidence/apple-ar-light-1440.png)
- The evidence directory includes all eight candidate combinations and root before/after/return screenshots. `docs/screenshots/built-mobile-*.png` contains the four built-output mobile locale/theme captures.
- Historical candidate evidence remains under `docs/apple-evidence/`; active verification uses the root route and `bun run e2e`.
- Regenerate the manifest with `node node_modules/jiti/lib/jiti-cli.mjs scripts/apple-coverage.ts`.
- Run the built-output audit with the review server on port 4000 using `node scripts/audit-built.mjs`; it refreshes `docs/performance.json` and the built mobile screenshots.
- Standard commands: `bun run typecheck`, `bun run lint`, `bun run test`, `bun run build:preview`, and `bun run e2e`. This machine used the corresponding local Node entry points because Bun was not on PATH.

Configuration-dependent checks remain intentionally open: production start, demo, sign-in, privacy, and terms destinations were not supplied, so review-mode pending states were verified instead. No deployment, redirect, indexing change, analytics, or conversion measurement was performed. Manual screen-reader pronunciation, physical low-end hardware, and human Arabic/English editorial approval remain outside automated evidence.
