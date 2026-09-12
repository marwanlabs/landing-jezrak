# Root landing redesign

The root route now serves **Stronger roots**. The existing palette and brand mark remain. The photographic opening, botanical feature story, navigation, layout, motion and closing composition are new. The merchant-daybook grammar uses one bounded root reveal inside a normal document. Inventory, orders, purchasing, customers and finance are selectable roots with accurate explanations.

The brief was self-authored under creative delegation, then refined using the user's palette constraint and plant-root idea. See BRIEF.md for the journey, feeling curve, score and fingerprint comparison.

## Evidence

- `lab/desktop`: 32 scroll frames, 1440 × 900.
- `lab/mobile`: 31 scroll frames, 390 × 844.
- `lab/reduced`: 32 scroll frames, 1440 × 900 with reduced motion.
- All three contact sheets generated and visually reviewed. No dead scroll reported. The page-local root path state is exposed to the harness. Engine-specific cue/contrast arrays do not measure this route's custom copy.
- `lab/final/report.json`: English desktop, phone, compact Arabic 360 × 640, Arabic desktop, dark mode and reduced motion. No page errors, failed requests, horizontal overflow, broken images or WCAG A/AA axe violations. Axe supplements pixel inspection, not full accessibility certification.
- Static HTML with JavaScript disabled retains heading, main links, native disclosures and all five root explanations. Scripted controls stay disabled until ready.
- Five Chromium end-to-end tests pass: routing; channel/root selection; keyboard/disclosures/onboarding; Arabic compact menu/reduced motion; theme with retained selection.
- Existing unit tests: 23 passed. TypeScript and ESLint on changed application/test files passed. Final review build and prerender succeeded.
- `lab/package/report.json`: the final built server at port 3001 repeated all six layout/accessibility checks and the no-JavaScript check successfully. Compact Arabic and phone opening pixels were reviewed again after the final caption/theme-control adjustments.
- Firefox and WebKit could not start because their Playwright executables are not installed. Real iPhone/Android hardware has not been tested. The page has no video decoder or WebGL dependency.

## Corrections and feel check

The first interaction run caught clicks arriving before hydration. Buttons now remain disabled until handlers are mounted; the rerun passed all five tests. The unadapted skill harness timed out on its engine-specific readiness marker. The local harness uses the route's actual marker, with measurement unchanged. Feature links now target real guide anchors. Compact captions were enlarged and the theme control remains available at 360px.

Contact-sheet assessment: inviting → familiar → connected → orderly → grounded → resolved. This corresponds to intended possibility → recognition → relief → clarity → confidence → readiness. The root scene is the largest visual shift; the close resolves without trailing blank space. This is editorial assessment, not user research.

## Assets and preview

Generated one still through the configured Kie service: ceramics, an olive branch and a packed green box. It is illustrative brand photography, not customer proof. The original is archived here; only the 1200 × 1600, 270 KB JPEG is served. No invented metrics or testimonials.

Development: http://127.0.0.1:3000/

Built package: http://127.0.0.1:3001/

Nothing deployed or committed. Unrelated working-tree files preserved.
