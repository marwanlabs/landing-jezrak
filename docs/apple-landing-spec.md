# Independent `/apple` landing page replacement candidate

Status: Specification only. Ready for a separate implementation request. No application changes, route creation, deployment, or root-page replacement are authorized by this deliverable.

## Problem Statement

The owner wants a complete alternative Jizrak landing page that can be evaluated as a future replacement for `/`. The alternative must stand on its own: a first-time visitor arriving directly at `/apple` must understand the product, explore its full scope, and reach the same business-start, demo, and sign-in destinations without visiting the existing landing page.

The existing page must remain untouched. Its colors and approved Arabic/English text are the only design inputs to carry forward. Copying its composition, components, typography, diagrams, or motion and applying an Apple-like finish would fail the request. A companion page, abbreviated showcase, or additional chapter would also fail.

## Solution

Create a complete, independently designed landing page at exactly `/apple`, using the supplied Apple Design reference for visual and interaction principles. Keep `/` as the unchanged existing landing page. Build the candidate's hierarchy, composition, typography, materials, visual explanations, responsive behavior, and motion from first principles.

The candidate uses the same product copy and color palette, with one selected language at a time. Arabic is a fully designed RTL experience; English is LTR. Light, dark, and system theme choices remain available. Product actions retain their configured destinations and honest unavailable states.

The new design should feel calm, precise, spacious, and immediately responsive. Apple Design is a craft reference, not permission to copy Apple branding, introduce Apple product imagery, or turn a commerce landing page into a gesture demo.

### Independent page direction

These are new design decisions for the candidate, not a rearrangement of the root page's templates. Chapter names below are planning labels; use existing localized copy for public headings and controls.

| New composition | Required content and purpose |
| --- | --- |
| Floating navigation | Newly designed compact navigation, textual Jizrak identity, feature anchors, start action, sign-in, language, and theme controls. Use a restrained translucent surface over scrolling content, with a solid fallback. |
| Typographic introduction | A centered, generous opening with the exact hero eyebrow, headline, body, premise, and start/demo labels. Place a newly composed commerce overview below the copy instead of a split hero with root artwork. Keep the proposition and actions immediately available. |
| Business and Store foundation | Present the connected workflow and independent Store model as a broad product explanation. Use newly arranged labeled surfaces to distinguish Business, Stores, Locations, and independent ledgers. Preserve all workflow steps and the three existing positioning statements. |
| Selling experiences | Compose Storefront, POS, and catalog as differently sized product stories. Give each its complete heading and body, with clearly discoverable details. Avoid repeating one two-column template. |
| Operational continuity | Explain inventory, purchasing, and orders through a newly composed linear relationship with readable text equivalents. Preserve all product conditions and Store boundaries. |
| Customer knowledge and business understanding | Present customer history, finance, and reporting as focused editorial sections using the existing text. Do not invent dashboard numbers, charts suggesting actual performance, or testimonials. |
| Store identity and operating control | Give identity, localization, configuration, access, and operating boundaries their own complete treatment. Use the current public operating copy. |
| Complete feature index | Include the existing introduction and all 17 feature groups, each with its full public inventory. Use independently designed, accessible expandable rows or panels, with clear grouping and no numbered atlas styling. |
| Demo and conversion close | Include the complete demo and start copy, configured actions or localized pending notices, and the protected closing slogan. This must complete the visitor journey within `/apple`. |
| Complete footer | Include textual brand identity, current copyright convention, feature/demo/sign-in links, configured privacy/terms links, back-to-top behavior, and applicable preview notice. |

Reorder topics and change how they are grouped without rewriting or dropping copy. Keep important qualifications with the claims they qualify. Long detail lists may use progressive disclosure; primary product explanations and actions must not require interaction to become visible.

## User Stories

1. As a first-time visitor, I want `/apple` to explain Jizrak completely, so that I do not need the original landing page for context.
2. As the owner, I want a full replacement candidate, so that I can evaluate whether it could eventually become the primary landing page.
3. As the owner, I want `/` to retain its current appearance and behavior, so that exploring a candidate does not disturb the existing experience.
4. As the owner, I want only the existing palette and text to influence the new design, so that the candidate is visually independent.
5. As a visitor, I want the proposition and primary actions to be clear on arrival, so that I can decide where to go next.
6. As an Arabic reader, I want natural RTL composition and legible Arabic typography, so that the page feels designed for my language.
7. As an English reader, I want a complete English experience, so that I can read without interleaved translations.
8. As a bilingual visitor, I want language switching to retain my reading location, focus, and expanded details, so that I can continue exploring.
9. As a returning visitor, I want my language and theme preferences respected, so that the page stays comfortable to use.
10. As a Business owner, I want the distinctions between Business, Store, Location, and stock ledger explained accurately, so that shared operations do not imply merged Store data.
11. As a potential customer, I want to explore Storefront, catalog, and POS capabilities, so that I can understand the selling experience.
12. As an operator, I want inventory, assembly, purchasing, and orders explained with their conditions, so that I can assess the operating workflows.
13. As a decision maker, I want customer, finance, reporting, identity, and access coverage, so that I can assess the complete product.
14. As a detail-oriented visitor, I want all 17 feature groups and full workflow details available, so that a spacious design does not remove useful information.
15. As a visitor ready to act, I want start, demo, and sign-in actions to reach the correct destinations, so that I can proceed directly.
16. As a visitor viewing a preview, I want truthful pending-link explanations, so that unavailable destinations do not appear functional.
17. As a mobile visitor, I want readable content and reachable navigation without horizontal overflow, so that the complete page works on a small screen.
18. As a keyboard or screen-reader user, I want clear landmarks, focus, labels, and disclosure controls, so that I can use every essential feature.
19. As a visitor sensitive to motion or transparency, I want appropriate presentation alternatives, so that decorative effects do not interfere with reading.
20. As a visitor with a slow device or failed animation download, I want content and links to remain available, so that enhancement failures do not block the page.
21. As a visitor, I want controls to respond immediately and transitions to accept new input, so that the interface feels predictable.
22. As a reviewer, I want direct links and anchors within `/apple`, so that I can inspect the candidate independently.
23. As a maintainer, I want candidate styles and animation effects isolated, so that visiting either route cannot visually alter the other.
24. As the owner, I want explicit content and regression evidence, so that I can assess completeness and root-page preservation before considering replacement.

## Implementation Decisions

### Scope and route isolation

- Add a sibling route using the existing React and TanStack routing application. Do not replace, redirect, alias, or conditionally reskin `/`.
- Give the candidate its own page composition, navigation, footer, controls, disclosures, visual explanations, typography rules, responsive rules, and motion layer. Do not import or wrap the current landing-page renderer or its presentational components.
- Reuse existing localized data and destination configuration read-only. Existing preference infrastructure may be consumed unchanged as functional infrastructure, provided its global side effects are accounted for. This is not permission to inherit its associated visual components.
- Do not modify shared copy, palette definitions, existing visual assets, root-page styles, or root-page motion to serve the candidate. Do not perform a shared-component extraction or broad refactor as part of this feature.
- Permit only unavoidable additive routing registration and narrowly route-scoped head integration outside candidate-owned modules. Any shared integration must preserve `/` output and behavior and be explicitly covered by regression verification.
- The existing shell loads global styles, including body fonts, heading typography, Arabic selectors, generic element rules, and document scroll spacing. CSS Modules alone do not neutralize those rules. Define a complete candidate style boundary, explicitly overriding inherited non-color presentation inside it, including Arabic typography and focus treatment. Do not use root-page classes such as its container, hero, narrative, or atlas classes.
- Candidate styles must remain harmless even if their stylesheet stays loaded after client navigation. Keep selectors under the candidate boundary. Any unavoidable document-level setting must be active only while the candidate is mounted, with correct restoration on exit and error. Keep candidate portals within the same style boundary.
- Scope animation selectors, observers, event listeners, and temporary styles to the candidate and clean them up on unmount. Do not initialize the root landing animation module from the candidate or attach candidate effects to root-page elements.
- Continue using the existing preference contract without changing its defaults or storage keys. An explicit language/theme choice may carry between routes as it does today; that is expected preference behavior, not a design change. Compare root regressions under identical preferences.
- Do not add a link or variant selector to the root page. Access the candidate directly at `/apple`. Candidate section links and local pending destinations resolve within `/apple`; configured product URLs retain their actual destinations.
- Retain existing application-level favicons and manifest as unchanged infrastructure. Do not use their graphics as candidate page artwork. Use a newly typeset textual brand lockup; do not reuse the root mark, root illustrations, diagrams, social-preview composition, or other root design assets inside the page.

### Content contract

- Treat the current public landing experience as the authoritative copy baseline. Preserve exact Arabic and English wording, punctuation, product facts, labels, notices, and qualifications. This is a redesign, not a copywriting task.
- Build a coverage manifest at implementation time mapping each public text ID and locale to its destination and visible or expanded state in the candidate. Include localized content data, supporting narrative and diagram text, navigation, accessibility labels, conditional notices, and footer text. Repeated uses of one string may be consolidated when no meaning or needed control is lost.
- Account explicitly for empty placeholders, source-only editorial titles, duplicate inventory entries, and internal-only exclusions. They are not instructions to expose unpublished text.
- Preserve the current public `operateBody` override, the public `platform` inventory override for feature group 17, and the deliberate exclusion of restricted platform-recovery and platform-operations details. Do not revert to the raw source versions when building a fresh renderer.
- Preserve all 16 substantive content topics identified by these stable IDs: `top`, `connected`, `business`, `sell`, `catalog`, `inventory`, `purchasing`, `orders`, `pos`, `customers`, `understand`, `identity`, `operate`, `features`, `demo`, and `start`. These IDs describe coverage, not a mandatory visual order or one-section-per-ID layout.
- Preserve the 17 feature groups: Business and Stores; Team and access; Catalog; Merchandising; Inventory; Dependencies and assembly; Purchasing; Storefront; Cart and checkout; Orders; POS; Customers; Engagement; Finance; Analytics; Store configuration; Platform and resilience. Use their exact localized source names and public inventory text.
- Preserve the exact slogans `Your idea. Your brand. Your roots.` and `فكرتك. براندك. جذرك.` Preserve the textual brand identity `Jizrak — جِذرك`.
- Render only the selected locale across visible and accessible text. Exceptions remain the canonical brand lockup, destination-language switch label, and necessary existing product terms or identifiers. Do not show parallel translated paragraphs.
- Do not invent marketing copy, pricing, metrics, testimonials, customers, certifications, guarantees, product screens, or availability claims. Reuse existing labels for newly arranged controls; avoid interactions that require additional marketing text.
- Preserve full limitations concerning localization verification, configured payment/shipping behavior, email infrastructure, web push configuration, and other conditional capabilities. New visuals must not imply that shared Locations combine separate Store ledgers or customer histories.

### Palette and independent visual system

Use the following existing color values as inputs. Reassign them to candidate-specific semantic roles without changing the original tokens. Alpha variants and blends may be derived from these colors for surfaces, shadows, and translucency; do not introduce an unrelated accent palette.

| Existing color | Light | Dark |
| --- | --- | --- |
| Forest | `#153C2B` | `#78B88F` |
| Deep root | `#0B2419` | `#09150F` |
| Growth | `#4F9368` | `#70B889` |
| Sprout | `#A9C9A8` | `#3A6A4B` |
| Limestone | `#F4F1E8` | `#15231B` |
| Chalk | `#FCFBF7` | `#1C2D23` |
| Ink | `#17221C` | `#F1F3ED` |
| Soil | `#73513A` | `#C79773` |
| Copper | `#B66B45` | `#D18A63` |
| Muted | `#59635B` | `#BAC7BC` |
| Line | `#D5D8CB` | `#3C5142` |
| Focus | `#387549` | `#8BCEA0` |

Additional existing fixed colors are on-dark `#F4F1E8`, dark-muted `#BBC9B9`, and dark-line `#345240`. Choose combinations based on measured contrast, rather than assuming every palette pairing is suitable for text.

- Establish a new type scale, spacing scale, content widths, radii, borders, shadows, icon treatment, and section rhythm. Do not reuse the existing visual token values except colors.
- Start with platform system typography and appropriate Arabic system fallbacks. Do not inherit the root page's Alexandria/IBM Plex typography as the design choice. If an Arabic fallback proves unsuitable on a target platform, justify a candidate-only font choice based on Arabic legibility.
- Use large display typography with restrained English tracking and comfortable body measures. Arabic uses normal letter spacing and sufficient line height for joined forms and diacritics. Design line breaks independently for each language; never shrink Arabic simply to imitate English wrapping.
- Use responsive relative units and content-driven heights. Mobile is a deliberately composed single-column experience, not a scaled desktop canvas. Avoid clipping, forced horizontal page scrolling, or fixed-height text cards.
- Use visual depth selectively: a floating navigation layer and purposeful raised surfaces. Do not stack translucent text surfaces or put essential low-contrast text over changing imagery. Provide solid fallbacks when blur is unsupported or transparency is reduced.
- Do not inherit root-network metaphors, branching lines, botanical decoration, numbered chapter treatment, alternating narrative bands, existing diagrams, sticky workflow choreography, or the current footer composition. The word “roots” remains protected copy; it does not require a root drawing.
- Build new explanatory visuals from existing labels and verified relationships. Prefer clear conceptual illustrations over invented app screenshots. All meaningful visual relationships need readable text equivalents.

### Interaction, motion, and accessibility

- Apply the supplied reference selectively to actual interactions. Provide immediate press feedback while preserving native activation on click/release and normal cancellation. Never navigate on pointer-down.
- Keep opening/closing paths consistent and anchored to their controls. Animated controls must accept reversal from their current visible state without input lockout or jumping to a previous target.
- Use non-bouncy, critically damped behavior as the default, with an approximate response of 0.3–0.4 seconds as a tuning starting point. This is a behavior target, not a mandate to install a specific library or treat response as fixed settle duration. Verify any chosen spring API before mapping parameters.
- The baseline design needs no drag gesture or carousel. If a gesture materially improves an explanation, provide keyboard/button equivalents, direct tracking, interruption, and velocity continuity. Never make gestures the only way to access content.
- Preserve native scrolling. Do not use scroll hijacking, forced snap chapters, long pinned sequences, full-viewport moving backgrounds, autoplay loops, artificial interaction delays, or decorative sound/haptics.
- Restrict routine animation to transform and opacity. Avoid continuously animating large blur surfaces; use a stable material and lightweight transition when needed for performance.
- Under reduced motion, remove spatial travel, springs, parallax, and overshoot; use static states or brief cross-fades. Under reduced transparency or increased contrast, provide solid readable surfaces and explicit boundaries. Maintain usable forced-colors behavior.
- Use semantic landmarks, one main heading, ordered heading levels, a working skip link, visible focus, and properly labeled controls. All feature details must be keyboard and screen-reader accessible. Native disclosures are preferred for robust no-JavaScript access.
- Mobile navigation must close on selection and Escape, restore focus appropriately, and reset safely across breakpoints. Ensure touch targets are comfortably usable, targeting at least 44 by 44 CSS pixels for primary controls.
- Meet WCAG AA text contrast and non-text control contrast. Support 200% text enlargement and reflow at 320 CSS pixels without content loss. Mirror directional relationships for RTL while isolating Latin identifiers and numbers appropriately.
- Preserve readable server-rendered English fallback and working native links/details when JavaScript is disabled. With JavaScript enabled, honor existing stored/browser language behavior and theme selection. Enhancement or font failure must not hide core content.
- Candidate metadata uses existing product title/description text. Keep the candidate `noindex, nofollow` during evaluation, with candidate-specific canonical/OG URL handling and no duplicate conflicting tags. Do not change root indexing or metadata. If a route-specific social image is supplied later, it must be newly designed; do not regenerate shared assets for this work.

## Testing Decisions

The primary test seam is the rendered route in the existing Playwright browser setup. Test what a visitor can read and do, including transitions between routes. Existing browser coverage for locale, theme, anchors, disclosure, accessibility, no-JavaScript rendering, and unavailable storage provides prior art. Add focused component tests in the existing Vitest/Testing Library setup only where they cover a meaningful behavior that browser tests cannot diagnose well; do not mirror component internals.

1. **Complete independent journey:** Open `/apple` directly and reload it. Verify proposition, all required topics, all 17 full feature inventories, demo/start/sign-in, conditional legal links, pending notices, and footer without navigating to `/`. Resolve every local anchor inside the candidate, including direct fragment entry.
2. **Copy fidelity:** Reconcile the implementation coverage manifest against rendered and expanded content in both languages. Check exact protected strings, public overrides, excluded internal details, all conditions, and zero unaccounted public entries. Verify that source copy was not edited.
3. **Locale behavior:** Exercise both languages, switching in both directions, persistence, browser-language initialization, blocked storage, focus continuity, open disclosure state, and approximate reading-location retention. Check document direction and metadata as well as visible strings.
4. **Theme and responsive behavior:** Inspect both languages in light and dark at 320, 375, 768, 1024, and 1440 CSS pixels, plus system theme changes. Check text zoom, long Arabic copy, touch targets, navigation breakpoints, disclosure contents, and horizontal overflow.
5. **Accessible interactions:** Test the keyboard-only journey, skip link, disclosure state, menu dismissal and focus return, screen-reader names, reduced motion, solid-material fallbacks, increased contrast, and forced colors. Run the existing axe tooling; resolve candidate violations and manually verify reading order and transparency contrast.
6. **Resilience and motion:** Test disabled JavaScript, delayed/failed fonts, failed motion loading, rapid repeated opening/closing, route exit during animation, and low-end/mobile throttling. Essential content must remain visible; interactions must not wait for decorative transitions.
7. **Root preservation:** Before implementation, record a fresh `/` visual and functional baseline under fixed viewport, locale, theme, and settled animation conditions. Compare after implementation across both languages, both themes, desktop/mobile, and representative expanded states. Do not simply replace baseline images to make checks pass.
8. **Cross-route leakage:** Exercise `/` → `/apple` → `/`, browser back/forward, and direct reload of each route with matched preferences. Confirm root typography, layout, colors, scroll behavior, controls, focus, head tags, and animation behavior match the baseline even after candidate CSS has loaded. Verify candidate cleanup leaves no stale styles or listeners affecting `/`.
9. **Build and delivery:** Run existing lint, typecheck, unit tests, production/review builds as applicable, and relevant end-to-end checks. Confirm candidate-only assets and motion are not eagerly imported into the root landing bundle. Inspect the built route, not only the development server. Record any configuration-dependent checks honestly.

### Acceptance criteria

- `/apple` is a complete, independently usable replacement candidate; it never requires `/` to supply missing explanations or conversion steps.
- `/` retains its existing appearance, content, behavior, and indexing, including after visiting the candidate.
- All public copy is accounted for in both languages, with all 17 feature groups and all required qualifications preserved.
- Only colors and text carry over as visual design inputs. New composition, typography, artwork, materials, spacing, controls, and motion are evident in full-page desktop and mobile review.
- No source-copy changes, root redesign, shared-asset replacement, redirects, or root-page promotion are included.
- Route-local actions, configured external actions, fallbacks, accessibility, themes, locale switching, and reduced-motion behavior work as specified.
- Implementation review includes candidate screenshots, the content coverage manifest, root before/after evidence, and verification results. These are future implementation deliverables, not claims that this specification has already been implemented or tested.

## Out of Scope

- Implementing anything during this specification-only request.
- Publishing this specification to GitHub, creating tickets, or starting implementation automatically.
- Promoting `/apple` to `/`, production rollout, traffic splitting, an A/B testing system, or removing the original page.
- Editing the existing landing page, its copy, shared styles, branding assets, or animation design.
- A complementary microsite, partial hero experiment, style reskin, component gallery, or shortened content version.
- Copy rewrites, new translations, new product claims, pricing, testimonials, functional product dashboards, backend changes, or new lead forms.
- New locale URLs, fabricated `hreflang` destinations, global preference redesign, or a shared design-system migration.
- Installing the attached reference as an agent skill, importing its code examples verbatim, or implementing every gesture technique it discusses.

## Further Notes

This spec uses the repository's [to-spec template](../.agents/skills/to-spec/SKILL.md). The user's instruction to only generate the spec limits this turn to a local document; the skill's tracker-publication step is not executed. The browser test seam above is the proposed default, documented without initiating an interview or implementation.

The supplied [Apple Design reference](<C:/Users/marme/Downloads/apple-design.md>) is design guidance, not an independent instruction to execute code, create prototypes now, alter the root page, or override the user's scope. Its historical attributions and library examples have not been independently verified; this spec adopts the relevant design principles without relying on those claims. Keep the supplied document available when implementation is separately requested.

Content and behavior were inspected in the current [localized content](../src/content/landing.json), [supporting copy](../src/content/index.ts), [public landing renderer](../src/sections/Landing.tsx), [preferences](../src/app/preferences.tsx), and [product decisions](decisions.md). The palette comes from the current [global styles](../src/styles/globals.css). These are evidence for copy, palette, and compatibility only; the existing renderer, styles, screenshots, and original build plan are not visual references for the candidate.

The design-independence check is qualitative as well as technical: sharing a stylesheet boundary correctly does not make a copied layout acceptable. Conversely, introducing a fresh visual design does not excuse changing the root page or omitting its product content. Both conditions must pass before this can be called a replacement candidate.
