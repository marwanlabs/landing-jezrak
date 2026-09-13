# Front-end pricing configurator specification

Status: Proposed  
Source: `pricing.md`  
Scope: UI prototype only; no backend, billing, or real authorization

## 1. Summary

Add pricing to the canonical `/` landing page and add a pricing configurator to the existing Platform Super Admin workspace. The configurator stores its values in `localStorage`; the landing page reads the same values and updates without requiring code edits.

The configuration is treated as platform-wide inside this front-end demo. It is not configured separately for each Store. In Jizrak's domain language, a plan belongs to a Business and defines the number of Stores, Locations, and staff included for that Business.

Because this repository has no backend, “platform-wide” means within the same browser profile and origin only. Values will not synchronize across browsers, devices, deployments, or real users. The UI must say this plainly and must continue to identify the workspace as a sample environment.

## 2. Goals

1. Show the Seed, Grow, and Canopy plans on the landing page in English and Arabic.
2. Let a user acting as Platform Super Admin change every commercial number through a UI.
3. Persist those changes across refreshes with `localStorage`.
4. Make the landing page use the saved values automatically.
5. Allow the sample configuration to be reset safely to the defaults in `pricing.md`.
6. Keep the implementation isolated enough that local storage can later be replaced by a real API.

## 3. Non-goals

- Backend persistence or synchronization.
- Real authentication, authorization, billing, checkout, invoicing, usage metering, or entitlement enforcement.
- Different pricing for different Businesses or Stores.
- Multiple currencies.
- Editing marketing prose or the full feature matrix in the first version.
- Preserving historical pricing for existing subscriptions.
- Scheduling or versioning price changes.

## 4. Source analysis and initial values

The initial configuration is seeded from `pricing.md`.

| Plan | Billing model | Base price | Order fee | Stores | Locations | Staff |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Seed | Pay as you go | 0 EGP/month | 5 EGP/completed order | 1 | 1 | 1 |
| Grow | Monthly | 1,499 EGP/month | 0 EGP | 1 | 3 | 5 |
| Canopy | Monthly | 3,499 EGP/month | 0 EGP | 3 | 10 | 20 |

Resource extras:

| Extra | Seed | Grow | Canopy |
| --- | ---: | ---: | ---: |
| Store | unavailable | unavailable | 499 EGP/month |
| Location | unavailable | 149 EGP/month | 149 EGP/month |
| Staff | unavailable | 99 EGP/month | 99 EGP/month |

Seed add-ons:

| Add-on | Initial monthly price |
| --- | ---: |
| POS | 299 EGP |
| Purchasing | 249 EGP |
| Advanced Inventory | 249 EGP |
| Finance | 299 EGP |
| Growth Tools | 199 EGP |
| Advanced Analytics | 199 EGP |

The source contains commercial questions that the UI does not need to settle, but the landing page must avoid overclaiming. In particular, “completed order,” tax treatment, and real billing behavior are not implemented. The prototype should label prices as proposed/sample pricing unless the product owner later approves public-ready copy.

The source also says Grow's add-ons are “mostly included,” while the detailed matrix marks all six as included. For this UI spec, the feature matrix stays static and the landing summary should say “Advanced business tools included” rather than making a more specific conflicting claim.

## 5. Configuration model

Create a dedicated pricing module rather than adding pricing fields to `src/workspace/model.ts`. The module owns defaults, validation, storage, formatting, and the React hook used by both surfaces.

Suggested shape:

```ts
type MoneyValue = number; // whole EGP for this prototype

type ExtraPrice = {
  enabled: boolean;
  monthlyPrice: MoneyValue;
};

type PlanPricing = {
  code: "seed" | "grow" | "canopy";
  monthlyPrice: MoneyValue;
  completedOrderFee: MoneyValue;
  includedStores: number;
  includedLocations: number;
  includedStaff: number;
  includedDomains: number;
  extraStore: ExtraPrice;
  extraLocation: ExtraPrice;
  extraStaff: ExtraPrice;
};

type AddOnPricing = {
  code:
    | "pos"
    | "purchasing"
    | "advanced_inventory"
    | "finance"
    | "growth_tools"
    | "advanced_analytics";
  monthlyPrice: MoneyValue;
};

type PricingConfig = {
  schemaVersion: 1;
  currency: "EGP";
  plans: PlanPricing[];
  seedAddOns: AddOnPricing[];
  updatedAt: string | null;
};
```

Plan and add-on codes, names, taglines, descriptions, feature lists, display order, and billing-model labels remain code-owned bilingual content. Only numbers and extra-resource availability are configurable. This matches the request and prevents the simple prototype from becoming a general CMS.

Use whole EGP values because all proposed values are whole EGP and no real payment arithmetic occurs. A future billing implementation must migrate to integer minor units.

## 6. Storage behavior

- Storage key: `jizrak.pricing.v1`.
- The module exports one immutable `defaultPricingConfig` based on the tables above.
- On first load or when the key is absent, both pages use the defaults without writing automatically.
- On save, write one complete validated JSON document. Do not store individual fields under separate keys.
- Parse storage defensively. Invalid JSON, the wrong schema version, missing plan codes, duplicate codes, or invalid values fall back to defaults.
- A corrupt value must not crash the landing page. Log a development warning and show the default catalog.
- Saving dispatches a same-tab custom event such as `jizrak:pricing-change`.
- The shared hook listens to both the custom event and the browser `storage` event so an already-open landing tab updates when the admin saves in another tab.
- The Reset action removes the key rather than writing another copy of the defaults.
- Do not reuse `jizrak.workspace-preview.v1`: pricing has an independent lifecycle and should persist across browser sessions, unlike the current `sessionStorage` sample data.

## 7. Platform Super Admin UI

### Route and navigation

Add a `Pricing` / `الأسعار` item to the Platform navigation and a route such as `/platform/pricing`. Render it through the existing `Workspace` shell so locale, theme, sample-environment labeling, and responsive navigation remain consistent.

This route is a UI preview, not secure administration. Include a visible note:

> Saved in this browser only. Changes update the landing-page preview on this device and are not sent to a server.

Arabic copy must convey the same limitation naturally.

### Editor structure

Use one section for plan pricing and limits, one for extra-resource prices, and one for Seed add-ons.

Each plan card includes:

- Read-only plan name and billing model.
- Monthly price.
- Completed-order fee.
- Included Stores.
- Included Locations.
- Included staff.
- Included managed domains.
- Toggles and monthly prices for extra Store, Location, and staff units.

The Seed add-on section includes one monthly-price input for each of the six fixed add-ons.

### Interaction model

- Load the saved configuration or defaults into a form draft.
- Editing inputs changes only the draft; it does not update the landing page immediately.
- `Save pricing` validates and writes the complete draft to local storage.
- After saving, show a polite success status with the local update time.
- `Discard changes` restores the form to the last saved values.
- `Reset to proposed defaults` opens a confirmation dialog. Confirming removes the local-storage key and restores `pricing.md` defaults. This is the only destructive action.
- Disable Save when nothing changed or when validation errors exist.
- Warn before leaving the route with unsaved changes where browser/router behavior allows it.
- Provide `Preview landing pricing`, linking to `/#pricing`; opening it in a new tab makes it easy to compare and exercises cross-tab updates.

### Input behavior

- Use `type="number"`, `inputMode="numeric"`, `min="0"`, and `step="1"` for all numeric fields.
- Blank input is an incomplete draft, not zero.
- Show `EGP` beside monetary inputs and `/month` or `/completed order` where relevant.
- When an extra-resource toggle is off, disable its price input and exclude the price from landing-page display.
- Keep values as numbers in application state; do not preserve formatted strings.
- Labels must distinguish `Stores`, `Locations`, and `staff` according to the repository's domain vocabulary.

### Validation

The form may save only when:

1. Every configured amount is a finite whole number at least zero.
2. Monthly Grow and Canopy prices are greater than zero.
3. Seed's completed-order fee is greater than zero.
4. Included Store, Location, and staff counts are positive whole numbers.
5. Included domain counts are whole numbers at least zero.
6. An enabled extra has a monthly price greater than zero.
7. All three stable plan codes and all six stable add-on codes exist exactly once.

Do not enforce that higher plans must always cost more or include higher limits; that would prevent deliberate product experiments. A non-blocking warning may flag unusual relationships such as Canopy costing less than Grow.

## 8. Landing-page pricing section

### Placement and navigation

Add `Pricing` / `الأسعار` to desktop navigation, mobile navigation, and footer navigation. Add a section with `id="pricing"` after the existing `Room to grow. Ground to trust.` section and before the closing CTA. This preserves the current story: value, connected operations, trust/scale, price, then conversion.

### Plan cards

Render Seed, Grow, and Canopy in their fixed order. Grow is visually marked `Recommended` / `موصى بها`, with text as well as styling.

Each card shows:

- Plan name and tagline.
- Primary price and billing unit.
- Seed's per-completed-order fee; Grow and Canopy's monthly price.
- Included Store, Location, and staff counts.
- Available extra-resource prices.
- Domain treatment.
- A short code-owned capability summary.
- A CTA using the existing `config.start` destination.

Suggested names and taglines from `pricing.md`:

- Seed — Start selling.
- Grow — Run your business.
- Canopy — Run your organization.

The CTA may append `?plan=seed`, `?plan=grow`, or `?plan=canopy` only when `config.start` is a same-origin path and query composition is handled safely. Otherwise it uses the configured URL unchanged. No checkout behavior is implied.

### Add-ons and comparison

- Below the cards, show a compact Seed add-ons area with the six configurable prices and fixed descriptions from `pricing.md`.
- Add a disclosure labeled `Compare plan features` / its Arabic equivalent.
- The comparison uses the feature access matrix from `pricing.md` as code-owned content. It is not editable in this version.
- On wide screens, use a semantic table.
- On narrow screens, use stacked plan/group summaries or a plan selector; do not create page-level horizontal scrolling.
- Included, add-on, and unavailable states must have text labels. Icons may supplement them but cannot carry the meaning alone.

### Calculated examples

Do not hard-code the `300 orders` crossover or Seed add-on totals.

When Seed's completed-order fee is greater than zero and Grow has a monthly price, calculate:

```text
crossoverOrders = grow.monthlyPrice / seed.completedOrderFee
```

Display an approximate whole-order crossover, clearly labeled as an estimate before add-ons. With the defaults it is approximately 300 completed orders/month.

The existing example for POS + Purchasing + Advanced Inventory + Finance must also be computed. With defaults it produces 1,096 EGP/month in add-ons and 1,596 EGP at 100 completed orders. If values change, the example changes with them.

If the calculation is not meaningful, omit the comparison instead of showing `0`, `Infinity`, or misleading copy.

### Formatting and localization

- Use `Intl.NumberFormat` with `en-EG` or `ar-EG` and currency `EGP`.
- Keep the existing rule that only the selected language renders at a time.
- Localize surrounding labels, quantities, CTA text, comparison states, and accessibility names.
- Do not split one price into fragments that read out of order to assistive technology.
- In RTL, preserve the plan sequence in the locale's natural reading direction.

### No-JavaScript behavior

The root route is statically prerendered. Local storage cannot be read during prerendering or without JavaScript, so the server/no-JavaScript version shows `defaultPricingConfig`. After hydration, the saved browser-local configuration replaces the defaults.

To avoid surprising visible changes:

- Keep the plan structure and dimensions stable between default and saved values.
- Update text values without a loading spinner.
- Do not hide the entire pricing section until hydration.
- Treat the default proposal as the canonical static preview, not as a promise of live server-backed pricing.

## 9. Shared module boundary

The implementation should expose a small interface resembling:

```ts
export const defaultPricingConfig: PricingConfig;
export function parsePricingConfig(value: unknown): PricingConfig | null;
export function readPricingConfig(): PricingConfig;
export function writePricingConfig(config: PricingConfig): void;
export function resetPricingConfig(): void;
export function usePricingConfig(): PricingConfig;
```

The landing page and admin editor consume this interface. They must not call `localStorage` directly. This is the future replacement seam: an API-backed repository can replace the browser implementation without changing the pricing components' data shape.

## 10. Accessibility and responsive requirements

- The pricing section has one clear section heading and logical headings for every plan and comparison group.
- Every input has a persistent visible label, unit, and inline error association.
- Save/reset status uses an appropriate polite live region; validation summaries use an alert only after attempted submission.
- The reset confirmation has a clear title, consequence, Cancel action, and focus restoration.
- Keyboard users can operate all fields, toggles, disclosures, dialog actions, and links.
- The UI works at 320 px width, 200% text scaling, light/dark/forced-colors modes, English/Arabic, and reduced motion.
- Cards and tables do not cause page-level horizontal overflow.
- Motion is optional decoration and does not delay prices or form controls.

## 11. Acceptance criteria

1. With no stored configuration, the landing page shows all default numbers from `pricing.md`.
2. A user can change every plan price, order fee, included resource count, enabled extra-resource price, domain count, and Seed add-on price from `/platform/pricing`.
3. Saving and refreshing preserves the values in the same browser and origin.
4. Opening or refreshing `/#pricing` shows the saved values without any source-code change.
5. An already-open landing page in another tab updates after a save through the `storage` event.
6. The same-tab view updates through the custom pricing-change event.
7. Discard restores the last saved values without changing storage.
8. Confirmed reset removes `jizrak.pricing.v1` and both the editor and landing page return to defaults.
9. Invalid or corrupt stored data never crashes either page and never renders partial pricing; defaults are used instead.
10. English and Arabic display identical numeric values with locale-appropriate formatting and labels.
11. Crossover and add-on examples are calculated from current configuration rather than copied constants.
12. The feature comparison stays consistent with `pricing.md` and clearly distinguishes included, add-on, and unavailable capabilities.
13. The interface clearly states that the configuration is stored only in the current browser and is not real platform-wide persistence.
14. Existing landing-page interactions, locale/theme persistence, CTAs, and routes continue to work.

## 12. Test plan

### Unit tests

- Default configuration contains exactly three plans and six Seed add-ons.
- Parser accepts a complete valid v1 document.
- Parser rejects bad schema versions, missing/duplicate codes, negative, fractional, blank, `NaN`, and infinite values.
- Formatting is correct for English and Arabic.
- Crossover and add-on examples update from supplied configuration and disappear for invalid/non-meaningful inputs.
- Reset removes the correct key.

### Component tests

- Editor loads defaults and stored values.
- Dirty, discard, validation, save, success, disabled-extra, and reset-confirmation states behave correctly.
- Landing cards render current configuration and only the selected language.
- Storage and custom events update mounted consumers.

### Browser tests

- Save in Platform Pricing, visit `/#pricing`, and verify every changed number.
- Save in one tab and verify the open landing page in another tab updates.
- Refresh and verify persistence; reset and verify defaults.
- Seed/Grow crossover and selected add-on example recalculate.
- English/Arabic, LTR/RTL, keyboard, 320 px, 200% text, light/dark, forced colors, reduced motion, and no-JavaScript defaults.
- Confirm there is no horizontal page overflow and that existing root E2E journeys still pass.

## 13. Suggested implementation sequence

1. Add the typed defaults, parser, local-storage adapter, event handling, and unit tests.
2. Add bilingual code-owned plan/add-on/comparison content.
3. Add `/platform/pricing` and the Platform navigation entry.
4. Build editor validation, dirty/discard/save/reset states, and component tests.
5. Add the root pricing section and navigation/footer anchor links.
6. Add calculated crossover/add-on examples.
7. Add browser coverage and run the repository's lint, typecheck, unit, and E2E checks.

