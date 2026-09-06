# Current product decisions

The supplied `build-plan.md` is preserved as the original reference. The following later user instruction takes precedence wherever the original plan conflicts:

## One selected language at a time — 6 September 2026

English mode displays English content. Arabic mode displays Arabic content. Do not show simultaneous translation pairs in headings, body copy, buttons, diagrams, feature summaries, or the footer. Preserve the canonical Jizrak — جِذرك brand lockup and the language-switch label. Established technical terms such as SKU, CSV, and EGP may remain where appropriate in Arabic copy.

Keep paired English/Arabic source content for maintainability, but render only the selected string. The language control updates the document language/direction, UI strings, title, description, and current content without a reload or focus reset. This remains a single URL with a default English prerendered/no-JavaScript fallback. Do not fabricate localized routes or `hreflang` destinations.
