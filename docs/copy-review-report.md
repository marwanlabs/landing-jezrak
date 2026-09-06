# Landing page copy review report

Date: 6 September 2026

This review follows [the copy review spec](copy-review-spec.md), the English no-slop skill, and the Arabic no-slop skill. It reviews user-facing landing-page content in edit mode. It does not make claims about authorship.

## Result

The review is complete. `docs/copy-review-inventory.csv` accounts for 665 discovered text entries: 332 English, 330 Arabic, and 3 universal product or decorative entries. It includes the route error state, initial metadata, manifest names, and decorative coordinate. No entry is marked `unreviewed`, `fail`, or `blocked`.

The two protected entries remain exactly as approved:

- English: `Your idea. Your brand. Your roots.`
- Arabic: `فكرتك. براندك. جذرك.`

## Copy changes

The review made targeted edits where a passage was vague, too literal, or used a decorative marketing construction:

- The hero removes decorative dashes and unnecessary second-person wording.
- The hero premise names the operational work Jizrak connects instead of relying on an unclear metaphor.
- The connected-workflow section now identifies the growing subject as the Business and uses the established Arabic term «تنفيذ الطلبات».
- The Arabic multi-store heading is now a natural, formal action statement.
- The regional strip names Arab businesses directly, and the Egyptian market label uses a direct statement in both languages.

All other reviewed feature lists were retained because they identify specific functions, conditions, and limits. Concise inventories are appropriate in their disclosure context and do not need marketing rewrites.

## Locale isolation

The selected page language controls the footer navigation label, header navigation labels, document title, description, and Open Graph title and description. The canonical `Jizrak — جِذرك` brand lockup is an approved exception in [the product decisions](decisions.md), as is the language switcher's destination-language name.

`public/site.webmanifest` retains its `name` and `short_name` as documented universal product-name metadata: an installed-app manifest cannot follow the page's runtime language preference. They are not page prose.

## Verification

- Typecheck and lint passed.
- The landing-page test suite passed: 20 tests.
- The review build passed.
- Headless Chromium verified English and Arabic at 1440px and 390px. Each render had the expected document language and direction, selected-language footer label, all disclosures openable, and no horizontal overflow.
- The initial prerender is intentionally English, as required by [the product decisions](decisions.md); client-side locale selection updates the title, description, and Open Graph title and description.
- Added a test that preserves the approved bilingual brand lockup.

The inventory generator is [generate-copy-review-inventory.ts](../scripts/generate-copy-review-inventory.ts). Run it after any copy change to regenerate [copy-review-inventory.csv](copy-review-inventory.csv).
