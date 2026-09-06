# Verification — 6 September 2026

This is a working, locally reviewed implementation. It is **not approved for public launch**. Production destinations, product release evidence, and human language/accessibility approvals have not been supplied.

## Completed checks

- Strict TypeScript and ESLint with zero warnings.
- 19 component/configuration tests: paired source IDs, correct language tags/direction, only the selected translation rendered, one semantic heading, persistence, native disclosure, valid and invalid URL inputs.
- All 54 Playwright cases passed in Chromium, Firefox, and WebKit after the selected-language update: English-only and Arabic-only sections, both themes, all 17 atlas groups, preserved disclosure state across breakpoints, narrative anchors, development CTA targets, locale position/focus stability, persistence, system theme changes, mobile menu lifecycle, keyboard access, reduced motion, no JavaScript, blocked storage, normal-mode GSAP failure, 200% text scaling with spacing overrides, forced colors, and slow fonts.
- Responsive overflow checks at 320, 375, 768, 1024, and 1440 CSS pixels in both directions.
- Zero serious or critical axe violations in the tested locale/theme combinations, including the compiled 375px mobile artifact.
- Complete TanStack Start prerendered root HTML contains the default English copy and native `<details>` before JavaScript. The selected Arabic version replaces that content during hydration; both languages are bundled locally. The Nitro Node server and static output both build.
- Jizrak-only favicon, mask, touch/PWA icons, 1200×630 social image, canonical metadata, sitemap, and review-mode robots/noindex behavior.
- Local WOFF2 files with pinned official upstream sources and SHA-256 records. OFL licenses retained. Arabic name, diacritics, and Latin glyph coverage checked programmatically and rendering visually inspected.
- Analytics, lead collection, unsupported provider claims, fabricated social proof, and platform-only recovery marketing are absent.

## Performance evidence

See `performance.json` for synthetic mobile observations at 375×900, 4× CPU slowdown, 150ms latency, and 200kB/s download. These are local measurements, not Lighthouse scores, deployed Core Web Vitals, or contractual performance thresholds. The report also lists raw/gzip bundle sizes. GSAP is split from the initial application chunk; core text is never fetched at runtime. Display-font transfer was reduced from 126,608 to 57,956 bytes by packaging the used Alexandria weight.

Screenshots in `screenshots/` include English/Arabic desktop designs and all four compiled mobile locale/theme combinations. Automated font/glyph and contrast checks do not replace a native Arabic editorial review or a screen-reader pronunciation review.

## Required before launch

1. Provide and verify `VITE_SITE_URL`, `VITE_START_BUSINESS_URL`, `VITE_DEMO_URL`, and `VITE_SIGN_IN_URL`. The production build intentionally fails when these are missing or invalid. Development anchor notices are not launch destinations.
2. Confirm every advertised user journey is enabled in the intended product deployment. The specification is working copy, not release evidence. No current sandbox behavior is asserted without a verified URL.
3. Obtain Arabic and English reviewer approval in the rendered design.
4. Run a manual desktop and mobile screen-reader pass, including pronunciation, preferred heading order, and focus behavior; a real browser 200% zoom pass supplements the automated 200% text-size/viewport checks.
5. Measure the selected HTTPS deployment and validate all external CTA destinations, cache/compression behavior, canonical metadata, and social previews in that environment.
6. Supply monitored contact/legal URLs if they are to be displayed. Analytics remains disabled pending provider and consent-policy approval.

The selected adapter is a pinned Nitro prerelease compatible with Vite 7. The build logs include upstream TanStack/Rollup unused-import and `use client` directive warnings; project linting is clean and prerendering succeeds. CI configuration is included but has not run on a remote CI service.
