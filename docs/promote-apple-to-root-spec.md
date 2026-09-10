# Promote the Apple landing page to the sole root route

## Problem Statement

The application currently exposes three routes: the original landing page at `/`, the replacement Apple landing page at `/apple`, and a workflow prototype at `/prototype/workflow-items`. The desired product has only one public page. Visitors should receive the Apple landing experience at `/`, and the repository should no longer carry route-specific runtime or test code for the original landing page or prototype.

Keeping the candidate at `/apple` also leaves candidate-only URL assumptions throughout navigation, metadata, tests, and evidence tooling. Those assumptions would produce incorrect anchors, canonical metadata, indexing behavior, and maintenance overhead after promotion.

## Solution

Make the current Apple landing experience the application’s sole index route at `/`. Convert all of its internal links, configured local destinations, metadata, and tests from the `/apple` prefix to the root URL. Remove the `/apple` and `/prototype/workflow-items` route registrations rather than redirecting them, and remove non-Apple route-specific source and test code that is no longer reachable.

Preserve shared modules that the promoted page still depends on, including preferences, configuration, content, and shared workflow components. Preserve the Apple page’s content, design, accessibility, localization, theming, responsive behavior, and no-JavaScript behavior except where behavior must change because its public URL is now `/`.

## User Stories

1. As a visitor, I want `/` to show the Apple landing experience, so that the intended design is the first and only landing page I encounter.
2. As a visitor arriving at `/`, I want the complete Apple proposition and product journey, so that no content depends on visiting a secondary route.
3. As a visitor using an in-page navigation link, I want it to target `/#section`, so that navigation remains on the canonical root page.
4. As a visitor opening a root fragment directly, I want the matching section to be available, so that shared deep links continue to work.
5. As a keyboard user, I want the skip link to target the root page’s main content, so that I can bypass repeated navigation.
6. As a mobile visitor, I want menu selections to use root fragments and retain the existing dismissal and focus behavior, so that promotion does not degrade navigation.
7. As a visitor using local start, demo, or sign-in fallbacks, I want those actions to resolve to root fragments, so that they never point at the removed `/apple` route.
8. As a visitor using browser back and forward navigation, I want root fragments and page state to behave normally, so that the single-page journey feels consistent.
9. As a visitor, I want `/apple` to be absent, so that there is no duplicate public URL for the same page.
10. As a visitor, I want `/prototype/workflow-items` to be absent, so that an internal prototype is not exposed as a product route.
11. As a search engine, I want the canonical URL for the promoted page to be the configured site root, so that indexing signals do not refer to a retired candidate URL.
12. As a search engine, I want production indexing rules to match the normal root-page policy, so that candidate-only `noindex, nofollow` is not retained after promotion.
13. As a reviewer using a review or development build, I want the existing environment-level `noindex, nofollow` safeguard to remain, so that nonproduction builds are not indexed.
14. As a social-media crawler, I want the established root social metadata and image to describe `/`, so that the promoted page has one coherent preview.
15. As an English-speaking visitor, I want all current Apple-page English content and controls preserved at `/`, so that promotion changes the URL rather than the product story.
16. As an Arabic-speaking visitor, I want the current RTL, Arabic copy, metadata, and language-switch behavior preserved at `/`, so that promotion does not regress localization.
17. As a visitor with a stored locale or theme preference, I want that preference to continue working at `/`, so that the route change does not reset my experience.
18. As a visitor with JavaScript disabled or storage unavailable, I want the existing readable fallback at `/`, so that the core page remains resilient.
19. As a visitor using reduced motion, forced colors, zoom, or a narrow viewport, I want the existing accessibility and reflow behavior preserved, so that promotion introduces no presentation regression.
20. As a maintainer, I want the generated route definition to expose only `/`, so that route types reflect the actual public application.
21. As a maintainer, I want obsolete original-landing and prototype route code removed, so that future changes have one landing implementation to maintain.
22. As a maintainer, I want Apple dependencies distinguished from dead route-specific code, so that cleanup does not delete shared content or workflow components still required by `/`.
23. As a maintainer, I want tests to describe the promoted root experience rather than the historical candidate arrangement, so that failures communicate the current product contract.
24. As a deployer, I want the production build to prerender the sole root route successfully, so that hosting behavior remains unchanged apart from route removal.
25. As a deployer, I want retired routes to return the application’s not-found behavior and not render the landing page, so that removal is verifiable and no implicit redirect is introduced.
26. As a repository contributor, I want documentation and verification commands to refer to the sole root page, so that instructions do not preserve stale `/apple` assumptions.
27. As a repository contributor, I want route-specific evidence and maintenance scripts either updated for `/` or removed when obsolete, so that automated checks do not recreate the retired route model.
28. As a product owner, I want this promotion to leave the approved copy and product claims unchanged, so that route cleanup does not become an unreviewed content rewrite.

## Implementation Decisions

- The Apple landing renderer becomes the index route component. There is one registered leaf route: `/`.
- The separate Apple route and workflow prototype route are removed. Neither retired URL receives a compatibility redirect unless a later requirement explicitly adds one.
- The generated router tree is regenerated by the existing TanStack Router workflow and must contain only the root shell and index route.
- Every candidate-local absolute fragment is converted from `/apple#…` to `/#…`. This includes brand links, desktop and mobile navigation, skip navigation, capability details, footer navigation, back-to-top, and locally configured calls to action.
- The root shell no longer detects an Apple candidate route. Canonical and Open Graph URLs always use the configured site root.
- Production metadata uses the normal root indexing policy and established root social image. Review/development mode continues to emit `noindex, nofollow` through the existing environment safeguard.
- The promoted renderer keeps the existing Apple visual system, copy, content coverage, semantic structure, interactions, preferences, and resilience behavior.
- Original-landing and prototype modules are deleted when they are exclusively used by the retired routes. This includes their route components, motion implementation, prototype implementation and styling, and tests that only assert those retired experiences.
- Shared modules remain when imported by the promoted page or root shell. In particular, cleanup must follow the actual import graph rather than deleting an entire shared directory by name.
- Shared `StageLine` and `StageFlow` behavior remains available because the Apple renderer uses both. Their tests remain unless a test is specifically tied to a retired route.
- The Apple source directory may retain its existing name; renaming it is not required for route promotion and would create unrelated churn.
- The prerender configuration continues to emit `/`. No retired route is added to the prerender page list.
- Documentation, content-coverage tooling, and evidence tooling are updated when they are still useful for the sole root page. Historical design specifications and past evidence may remain as records, but active commands and claims must not describe `/apple` as a live sibling route.
- No approved bilingual copy, configuration contract, external destination, public asset, or product claim is changed as part of this work.

## Testing Decisions

The primary and highest test seam is the built application’s public URL surface through the existing Playwright setup. Tests should assert what a visitor or crawler can observe: which URLs resolve, what `/` renders, where links go, which metadata is emitted, and whether the established page journey still works. Tests should not assert internal filenames or component ownership.

- Adapt the existing Apple end-to-end suite to open `/` and use root-local fragments. It is the strongest prior art for content fidelity, language switching, theme behavior, accessibility, responsive reflow, native disclosures, adverse conditions, and no-JavaScript rendering.
- Replace the old landing-page regression suite with focused route-surface checks. The old renderer’s appearance and behavior are no longer product requirements.
- Verify that `/` renders the promoted heading, complete topic coverage, all 17 feature groups, and the current public qualifications in English and Arabic.
- Verify that all internal links resolve to `/#…` or approved external destinations and that no rendered `href`, canonical tag, or social URL references `/apple`.
- Verify direct fragment entry, mobile-menu navigation, skip navigation, browser history, and local CTA fallbacks on `/`.
- Verify production root canonical/Open Graph/social-image metadata and the absence of candidate-only indexing rules. Separately verify that review/development mode remains noindex.
- Verify `/apple` and `/prototype/workflow-items` produce not-found behavior, do not render the promoted landing page, and do not redirect.
- Run existing axe coverage and responsive checks across both locales, both themes, representative desktop/mobile sizes, reduced motion, blocked storage, and failed fonts.
- Keep focused Vitest coverage for shared workflow and preference behavior when it remains useful. Remove unit tests that only cover components deleted with the original route.
- Verify generated route types expose only `/` by running type checking rather than snapshotting generated implementation details.
- Run lint, type checking, unit tests, the relevant Playwright suite, and the review production build. Inspect the built output to confirm only `/` is prerendered and retired route chunks are absent.
- A good test fails only when externally observable route behavior or preserved page behavior regresses; it does not fail because files were reorganized without changing the contract.

## Out of Scope

- Redirecting `/apple` or `/prototype/workflow-items` to `/`.
- Redesigning the Apple landing page or changing its content hierarchy.
- Rewriting English or Arabic copy, adding claims, changing the 17 feature inventories, or changing product terminology.
- Changing locale persistence, theme persistence, CTA configuration, hosting infrastructure, or deployment destinations.
- Renaming the Apple implementation directory solely to match its new URL.
- Deleting historical specifications, screenshots, or evidence that are clearly retained as an archive rather than used by active tooling.
- Introducing additional routes, localized URLs, an A/B test, or a new not-found experience.
- Implementing the change as part of this specification-only request.

## Further Notes

- This local specification replaces the issue-publication step at the user’s explicit request.
- The accepted test seam is the public route surface: `/` is the complete Apple landing page, while `/apple` and `/prototype/workflow-items` are absent. This is the highest existing seam and avoids coupling acceptance tests to the router’s generated internals.
- The repository currently has unrelated local changes in ignore and scratch artifacts. Implementation should preserve them.
- The existing Apple implementation was intentionally built as a sibling candidate and contains candidate-only URL and indexing logic. Promotion is therefore more than swapping route components: the cleanup must include anchors, metadata, active documentation, tests, route generation, and obsolete route-specific code.
