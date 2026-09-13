# Pricing refinement verification

Implemented in src/pricing/PricingSection.tsx and src/pricing/pricing.css. Existing unpublished pricing catalog and workspace edits were preserved.

- Compact editorial introduction; asymmetric plan grouping with a raised forest Grow surface and botanical icons.
- Prices, calls to action and capacity rows aligned; optional capacity extras use native disclosures.
- Live Seed/Grow estimator uses configured base price, completed-order fees and the four explicitly named optional Seed tools. Proposed/sample pricing disclosure retained.
- Shared site theme tokens replace the conflicting operating-system dark override. Arabic feature names localized; native comparison scroll region is keyboard focusable.
- Native view-timeline reveal is progressive enhancement. Its baseline is fully visible; reduced-motion CSS disables animation and transitions.

## Evidence
Screenshots inspected in the connected browser at desktop, 390 x 844 and 360 x 640. Checked Arabic and English, light and dark surfaces, top of section, plan body, expanded capacity extras, estimator and feature table. Phone emulation showed no document horizontal overflow; feature table scrolls within its own region. Browser console error list was empty.

Keyboard range End: 1,000 orders gives Seed EGP 5,000 and Grow EGP 1,499. With the four tools enabled and Home: zero orders gives Seed EGP 1,096 and Grow EGP 1,499. Focus ring visibly present on the range and capacity disclosure. Plan URLs retain their plan query parameters.

TypeScript and targeted ESLint passed on the final source. Review build completed and prerendered 19 routes; subsequent final edits added a keyboard-focusable comparison region and fixed mobile chevron alignment, followed by successful type/lint checks.

Feel check: orientation, confidence, agency, certainty. Grow remains the strongest surface; the estimator is visually quieter and useful. The existing page ending still resolves the journey.

Limits: no physical phone test or reduced-motion browser emulation; reduced-motion behavior reviewed in CSS. No video generated; FFmpeg unavailable and unnecessary. Screenshots were inspected inline rather than saved as a contact sheet.

This is a refinement of the existing stronger-roots page, so it intentionally retains that page's navigation, hero and ending. No claim of a new-site fingerprint gate pass.
