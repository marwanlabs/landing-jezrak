# Landing page copy review report

Date: 8 September 2026

This review follows [the copy review spec](copy-review-spec.md), the English no-slop skill, and the Arabic no-slop skill. It reviews user-facing landing-page content in edit mode. It does not make claims about authorship.

## Result

The source-copy review is complete. `docs/copy-review-inventory.csv` accounts for 665 discovered text entries: 332 English, 330 Arabic, and 3 universal product or decorative entries. It includes the route error state, initial metadata, manifest names, and decorative coordinate. No entry is marked `unreviewed`, `fail`, or `blocked` in the source inventory. Execution status is tracked in [the todo](copy-review-todo.md).

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
- The Arabic sell heading removes unsupported reassurance, the cart detail names server-data reconciliation, and the checkout detail uses the correct checkout term.
- Arabic identity and permissions headings now name their actions directly. The operations body describes explicit operating boundaries instead of an unsupported safety comparison. Arabic metadata names Arab businesses rather than an undefined region.

All other reviewed feature lists were retained because they identify specific functions, conditions, and limits. Concise inventories are appropriate in their disclosure context and do not need marketing rewrites.

## Locale isolation

The selected page language controls the footer navigation label, header navigation labels, document title, description, and Open Graph title and description. The canonical `Jizrak — جِذرك` brand lockup is an approved exception in [the product decisions](decisions.md), as is the language switcher's destination-language name.

`public/site.webmanifest` retains its `name` and `short_name` as documented universal product-name metadata: an installed-app manifest cannot follow the page's runtime language preference. They are not page prose.

## Verification

- JSON parsing and `git diff --check` pass for the current edits.
- Source-level inventory checks pass: all 665 rows have `reviewed`, `protected`, or `empty-unused` coverage, and no row has a `fail`, `blocked`, or `unreviewed` verdict.
- Typecheck and lint pass through the installed project binaries. Vitest cannot load `vitest.config.ts` in this sandbox because its esbuild launcher resolves an inaccessible parent directory; build and browser verification were not completed. The review is therefore incomplete against the rendered-verification acceptance criteria.
- The initial prerender remains intentionally English, as required by [the product decisions](decisions.md); client-side locale selection is covered by the existing source/test design but could not be rerun here.

The inventory generator is [generate-copy-review-inventory.ts](../scripts/generate-copy-review-inventory.ts). Run it after any copy change to regenerate [copy-review-inventory.csv](copy-review-inventory.csv).
