# `/apple` implementation verification

Implemented as an independent sibling route. `/` remains the existing landing page; candidate styles, composition, controls and conceptual visuals live under `src/apple`. The only shared edits are additive route registration and route-aware canonical, OG and robots metadata. No shared copy, palette, root artwork, root CSS or root motion was changed.

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
- Existing root browser suite: 18 tests pass on each of Chromium, Firefox and WebKit (54 checks).
- Candidate browser suite: 7 tests pass on each engine (21 checks), including focused reruns after fixes.
- Review production build: pass, server-rendered/prerendered `/` and `/apple`.
- Candidate suite against built output: 7 Chromium tests pass.
- Axe: zero candidate violations in Arabic/English and light/dark across the tested engines.
- Responsive checks: 320, 375, 768, 1024 and 1440 CSS pixels in both locales/themes; 200% text reflow at 320 pixels; forced colors; reduced motion; system theme changes.
- Resilience: disabled JavaScript/native disclosures, failed fonts, unavailable storage, browser-language initialization, deep links, language/disclosure/focus continuity, mobile Escape/selection dismissal, and client history navigation.
- Root metadata and typography remain correct during Arabic `/` → `/apple` → back/forward navigation.
- [Root comparison](apple-evidence/root-comparison.json): all eight full-page screenshots are byte-identical before/after implementation and after returning from `/apple`. Baselines use the starting commit `6ac01a580b9b7a2b1aa6e9d17604b14b2eb565bf`, reduced motion, 375/1440 widths, both locales/themes, 1000-pixel viewport height and the first feature disclosure expanded. Baselines were captured before implementing the route and were never replaced.
- Final build emits separate candidate assets (about 7.64 kB JavaScript and 11.61 kB CSS before gzip), independent of root motion.

The initial all-engine run could not locate Firefox/WebKit in the default cache. Both are available through `PLAYWRIGHT_BROWSERS_PATH=.tools/browsers`. Cross-browser checks found a 200% text navigation overflow, fixed with wrapping. Focus retention is tested through keyboard activation because WebKit does not focus buttons on pointer clicks. Reading-location verification uses a coordinate click on the sticky language control so locator auto-scrolling does not alter the initial position.

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
- The evidence directory includes all eight candidate combinations and root before/after/return screenshots.
- With the dev server on port 3000, run `node scripts/apple-evidence.mjs` to compare against the preserved baseline and refresh candidate/after/return captures.
- Regenerate the manifest by bundling `scripts/apple-coverage.ts` with the installed esbuild, then running the generated module.
- Standard commands: `bun run typecheck`, `bun run lint`, `bun run test`, `bun run build:preview`, and `bun run e2e`. This machine used the corresponding local Node entry points because Bun was not on PATH.
