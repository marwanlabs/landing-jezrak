# Landing stage components spec

Status: Ready for implementation.

## Problem Statement

The landing page presents operational sequences with several unrelated visual treatments: isolated rules above labels, numbered cards, compact segmented rows, and a detailed order list. The same reader has to relearn the pattern in each section, and the thin, disconnected lines do not make an active stage or a meaningful sequence clear.

The existing prototype established two useful directions. The active rail (option A) lets a reader focus on one detailed stage without making a wide, dense section taller. The operational story (option B) makes a short, self-contained sequence readable at a glance. Option C is rejected and must not be implemented or retained as a production variant.

## Solution

Create one shared, accessible stage-flow foundation with two named presentation modes:

- **Option A — active rail:** a horizontal, selectable stage rail with one current stage and its detail panel. Use it when a sequence has four or more stages and each stage has meaningful explanatory content.
- **Option B — operational story:** an ordered, sequential story that shows the whole short journey at once. Use it when the section has three concise steps, or when seeing the complete sequence is more valuable than inspecting one step at a time.

The foundation must render the existing localized stage data rather than hard-coding Arabic or English strings. It must preserve the current landing routes and section anchors, work in both text directions, and adapt to a vertical reading order on narrow screens.

## User Stories

1. As a prospective merchant, I want the main connected-commerce journey to show which stage I am reading, so that I can understand how the product areas relate without deciphering decorative lines.
2. As a prospective merchant, I want to select a connected-commerce stage with a mouse, touch, or keyboard, so that I can inspect its explanation at my own pace.
3. As a keyboard user, I want the active rail to expose one clear selected stage and its associated detail, so that the interaction has understandable semantics and does not depend on motion or color alone.
4. As an Arabic reader, I want stages to progress in the natural right-to-left reading direction, so that the sequence does not feel reversed or mechanically translated.
5. As an English reader, I want the same component to follow left-to-right reading order, so that each locale reads naturally.
6. As a mobile reader, I want every stage flow to become an unclipped vertical sequence, so that labels, descriptions, and controls remain usable at narrow widths and enlarged text sizes.
7. As a reader who prefers reduced motion, I want the component to show its selected state without animated movement, so that the information remains stable and understandable.
8. As a reader of the inventory section, I want the receipt, reservation, sale, and assembly sequence to read as an operational story, so that I can follow the stock movement from beginning to end.
9. As a reader of the selling section, I want discovery, selection, and checkout to appear as a short story, so that the route to purchase is immediately clear.
10. As a reader of the purchasing section, I want supplier, purchase order, and receipt to appear in order, so that I can understand replenishment without treating it as a generic feature list.
11. As a reader of the orders section, I want reservation, fulfilment, and order history to appear as a progression, so that the operational lifecycle is legible.
12. As a reader of the point-of-sale section, I want opening a shift, recording a sale, and issuing a receipt to appear as one in-person-sales journey, so that the relationship between the steps is clear.
13. As a reader of the customers section, I want Business, Store, and customer profile to appear in a consistent scope sequence, so that I understand that customer data belongs to a Store within a Business.
14. As a reader of the reporting section, I want sales and stock, financial records, and operational reports to appear as a concise reporting path, so that the three reporting views do not look like unrelated tabs.
15. As a reader of the alternate Apple landing route, I want its detailed order journey to use the same active rail, so that the most detailed five-stage sequence does not duplicate a separate interaction model.
16. As a reader of the alternate Apple landing route, I want its inventory, purchasing, orders, customers, and reporting paths to use the same operational-story presentation, so that repeated flows look and behave consistently across public landing surfaces.
17. As a maintainer, I want both visual modes to use one semantic stage data model, so that locale, accessibility, responsive behavior, and motion rules are fixed once rather than copied across sections.
18. As a maintainer, I want the component to accept section-owned content rather than inventing new product claims, so that it preserves the distinctions between a Business, a Store, a Location, stock reservation, and stock consumption.

## Implementation Decisions

- Build a single shared stage-flow module with a stable data contract: an ordered collection of localized stages, each with an ID and label, plus an optional localized description. The component receives an explicit presentation mode rather than guessing from array length at runtime.
- Name the production modes by their behavior, not prototype letters: `active-rail` for option A and `operational-story` for option B. Keep the mapping below in the integration layer as an intentional content decision. Do not ship a mode corresponding to prototype option C.
- The active rail owns selection. It starts on the first stage unless a section has an existing meaningful active state. Selecting a stage updates only that component's local state; it must not alter the URL, scroll position, global landing animation state, or another stage flow.
- The active rail is a tabs-style interaction: each stage is a keyboard-focusable control; the selected stage exposes selected/current state; its detail is programmatically associated with the selected control; and arrow-key behavior follows the page direction. Home and End move to the first and last stage. The selected stage remains visible without relying on the visual indicator.
- The operational story is an ordered list, not a tab set. It is non-interactive unless a future product requirement supplies a real destination for a stage. It may reveal its ordered markers on entry, but its text is present and readable before JavaScript and without animation.
- Use brief descriptive lines only where canonical landing content already establishes the meaning. Where existing data contains labels alone, keep the story label-only rather than adding unverified product detail. The implementation may add localized descriptions for the inventory stages only when they restate the established inventory explanation: receipt into the Store ledger, reservation for an order, consumption on sale, and assembly into finished stock.
- Motion has one purpose: make a user-initiated selection legible. On active-rail selection, move the emphasis marker and fade/translate the newly selected detail over roughly 160–220 ms using an ease-out curve; do not replay the entire rail. On operational-story entry, allow only a restrained one-time opacity/transform reveal of markers and rows, staggered by no more than 40 ms. Hover and press feedback must be immediate and subtle. Disable all nonessential transitions under reduced motion.
- Preserve visible focus rings, sufficient contrast in light, dark, and forced-colors modes, logical `lang` and `dir`, and the selected-language-only rule. Do not use `aria-hidden` on stage labels or descriptions that now carry content.
- On small screens and at 200% text size, both modes use a vertical ordered layout. The active rail keeps its controls before the detail panel, maintains the locale reading order, and never horizontally scrolls or truncates labels.
- Replace every current stage visual on the public root landing route according to this assignment:

| Landing placement | Existing sequence | Mode | Reason |
| --- | --- | --- | --- |
| Connected-commerce section | Publish, Sell, Reserve, Replenish, Understand, with five explanatory workflow details | A — active rail | Five dense, explanatory stages benefit from one focused detail panel while retaining the whole system map. |
| Inventory section | Receive, Reserve, Sell, Assemble | B — operational story | A fixed four-event stock movement is best understood as one compact chronological story. |
| Sell section | Discover, Choose, Checkout | B — operational story | A short customer journey should be scannable in full. |
| Purchasing section | Supplier, Purchase order, Receive | B — operational story | The replenishment sequence is linear and brief. |
| Orders section | Reserve, Fulfil, Order history | B — operational story | The three operational events are a concise lifecycle. |
| Point-of-sale section | Open a shift, Record a sale, Issue a receipt | B — operational story | The in-person sale has three fixed actions that should read together. |
| Customers section | Business, Store A, Store customer profile | B — operational story | The short ordered scope relationship is clearer when all levels remain visible. |
| Understand section | Sales & stock, Financial records, Operational reports | B — operational story | The three reporting lenses are brief and need a consistent ordered presentation rather than separate divider labels. |

- Apply the same semantic assignment on the public alternate Apple landing route, which currently repeats these flows in a separate visual language:

| Landing placement | Existing sequence | Mode | Reason |
| --- | --- | --- | --- |
| Order journey | Discover and choose, Checkout creates the order, The Store reserves availability, The merchant fulfils, The record keeps unfolding | A — active rail | Each of the five stages has substantive explanatory copy; keeping one detail visible avoids a dense five-column paragraph grid. |
| Operations inventory story | Receive, Reserve, Sell, Assemble | B — operational story | Same stock-movement meaning as the root landing route. |
| Operations purchasing story | Supplier, Purchase order, Receive | B — operational story | Same short replenishment sequence as the root landing route. |
| Operations orders story | Reserve, Fulfil, Order history | B — operational story | Same short order lifecycle as the root landing route. |
| Insight customers story | Business, Store A, Store customer profile | B — operational story | Same short scope sequence as the root landing route. |
| Insight reporting story | Sales & stock, Financial records, Operational reports | B — operational story | Same compact reporting path as the root landing route. |

- Do not replace diagrams that describe a network, ownership model, or set of surfaces rather than stages: the hero network, Store-ledger diagram, catalog diagram, identity diagram, demo relationship map, and application/capability selector remain specialized components. Keep their current behavior and visual language.
- Retire the prior stage-specific CSS and markup once every assigned placement uses the shared component. Do not leave duplicate legacy stage markup hidden in the DOM.
- The prototype route remains a disposable design artifact until the production implementation is accepted. When the shared component is complete, remove the rejected option C from the prototype and either remove the prototype route or reduce it to only A/B, according to the team's normal prototype-retention decision. It must not become a public navigation destination.

## Testing Decisions

- Add component-level tests at the shared component seam. Good tests observe user-facing behavior: visible labels and descriptions for the selected locale, the selected stage and associated detail, keyboard navigation, and absence of hidden duplicate localized text. They must not assert internal state variables or CSS class names.
- Test active-rail selection with click, Enter/Space, locale-appropriate arrow keys, Home, and End. Verify focus moves predictably, the selected stage changes, and exactly one associated detail is exposed as current.
- Test operational-story output as an ordered, non-interactive sequence with all configured labels visible in order. Include label-only stages so the component does not require fabricated descriptions.
- Extend root-landing browser coverage for every assigned section in English and Arabic, both directions, 320 px through desktop widths, 200% text scaling, light/dark/forced-colors presentation, and reduced motion. Confirm no horizontal overflow and that all stage copy remains reachable.
- Extend alternate-landing browser coverage for its order journey and every repeated operational story. Confirm the existing section anchors and details disclosures still work after replacement.
- Run the existing localized-content tests, route-level end-to-end suites, type checking, linting, and production-preview build. Include an accessibility scan of both landing routes in each locale and theme, with no serious or critical violations.

## Out of Scope

- Rewriting product copy, expanding product scope, or adding new business rules to create richer stage descriptions.
- Changing the hero network, ledger, catalog, identity, demo relationship diagram, capability selector, navigation, or disclosure component.
- Adding server persistence, deep links for the selected stage, analytics, or cross-section synchronization.
- Shipping prototype option C, a third production presentation, or a generic tab component for unrelated interface controls.
- Applying the component to product application screens outside the two public landing routes.

## Further Notes

The screenshots supplied with this request are visual references only. Their Arabic labels are existing landing content, not additional instructions or a request to alter wording.

The key seam is the shared stage-flow component and its stage-data contract. The root and alternate landing integrations should be thin declarations of mode and existing content. This keeps the semantic behavior, localization, accessibility, responsive design, and motion rules in one place while preserving the content ownership of each landing section.
