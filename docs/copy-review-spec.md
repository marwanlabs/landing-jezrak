# Landing page copy review spec

Status: Ready for execution. This document defines the review; it does not certify the current copy.

## Objective

Review every end-user text entry in English and Arabic, repair concrete writing problems, and verify the result on the rendered landing page. Review each language independently, then compare meaning. Do not stop after the hero or the main content file.

Use these two repository skills:

- English: [no-ai-slop](../.agents/skills/no-ai-slop/SKILL.md).
- Arabic: [no-ai-slop-ar](../.agents/skills/no-ai-slop-ar/SKILL.md).

Use edit mode when executing this spec. Apply the smallest effective changes. Keep clear text as written. The deliverable requested now is this spec; executing the copy changes is a separate step.

## Required voice and language

English must be clear, specific business writing. Arabic must be natural, formal, business-focused Modern Standard Arabic, with direct descriptions of what the product does. Formality must not become bureaucratic padding or inflated marketing language.

Preserve the approved slogan exactly: `فكرتك. براندك. جذرك.` Preserve its existing English counterpart, `Your idea. Your brand. Your roots.` Record both as protected text rather than rewriting or forcing them through ordinary prose rules.

The English page must show English content and the Arabic page Arabic content. Do not render both translations together. Apply this requirement to accessible names and status messages as well as visible prose. Narrow exceptions are the approved canonical brand lockup `Jizrak — جِذرك`, the language switcher's destination-language name, necessary product names, exact identifiers, and necessary technical abbreviations such as CSV. Record each exception and its purpose; do not use it to justify bilingual sentences or repeated translation glosses.

Preserve supported product facts, distinctions, conditions, and limitations. In particular, do not confuse a business, a store, and a location, or imply that shared operations merge stores' independent stock ledgers. Use established terminology consistently. Do not invent features, numbers, guarantees, customer evidence, or availability claims to make vague wording more concrete.

## Coverage inventory

Create `docs/copy-review-inventory.csv` during execution, with one row per source text entry per locale. Give every row a stable ID based on file, key or source location, and locale. Repeated strings at different keys still require separate rows; shared keys must list every rendering location.

Inspect at least these sources:

| Source | Required coverage |
| --- | --- |
| `src/content/landing.json` | Every `en` and `ar` value, including nested details, group names, feature inventories, and empty entries |
| `src/content/index.ts` | `copy`, `nav`, `nodes`, `flow`, `workflowNames`, `metadata`, and all `ui` translation keys |
| `src/sections/` and `src/components/` | Inline text, diagram labels, navigation, footer, links, disclosure contents, accessible names, titles, tooltips, and image alternatives |
| `src/routes/` and `src/app/` | Error and fallback text, preference announcements, document titles, descriptions, and social metadata |
| `public/` and other rendered assets | Manifest names and any text embedded in images, SVGs, or social preview artwork |
| Remaining application sources | Any additional user-facing text, including generated strings and CSS-generated content |

Inventory both collapsed and expanded content, mobile navigation, theme controls, review notices, unavailable-link messages, and conditional links. Include screen-reader-only text. An entry is not out of scope merely because it is absent from the initial viewport.

Classify empty or unused keys explicitly with a reason and rendering evidence. Exclude code identifiers, developer documentation, font licenses, and other material that users do not encounter. Do not delete structural placeholders merely to improve coverage totals.

Required inventory columns:

`id`, `file`, `key_or_location`, `locale`, `surfaces_and_states`, `original`, `final`, `coverage_status`, `slop_finding`, `pattern_and_reason`, `repair`, `no_slop_verdict`, `exception_reason`, `verification_evidence`.

Coverage status must be `reviewed`, `protected`, `empty-unused`, or `unreviewed`. Preserve original text so changes remain auditable. Use proper CSV quoting for commas, quotes, and line breaks.

## Two review checks

Use two evidence-based checks for each entry. These are editorial verdicts, not numerical scores or estimates of AI authorship.

### 1. Slop check: identify the problem

Record `found`, `none found`, or `not assessed`. A finding must quote the actual wording, name the pattern, explain why it harms this passage, and give a repair direction. A watchword alone is not an Arabic finding.

| Pattern | English review | Arabic review |
| --- | --- | --- |
| Generic praise | Portable benefits, unsupported superlatives, banned terms from the English skill | Inflated promises such as «نقلة نوعية» without a concrete supported meaning |
| Padding | Throat-clearing, empty qualifiers, weak verb phrases | Ceremonial openings, administrative verb padding, tangled noun chains |
| Repetition | Repeated claims, synonym cycling, mechanical sentence shapes | Synonym piles, redundant ideas, repeated claims about Arabic or Arab businesses |
| Artificial drama | Fake discoveries, dramatic fragments, binary contrasts, colon reveals | Fake revelation, unsupported certainty, rhetorical contrast that adds no distinction |
| Unclear meaning | Abstract benefits with no identifiable function or consequence | Translationese, ambiguous references, vague phrases about a connected foundation |
| Unsupported interpretation | Claims about importance, authority, or results without support | Stock commentary about commitment, leadership, or significance |

Do not mechanically flag useful short labels, real FAQ questions, necessary feature lists, natural Arabic nominal sentences, or meaningful repetition. The approved slogan is a protected exception.

### 2. No-slop check: accept the final wording

Record `pass`, `fail`, `blocked`, or `protected` after editing. A pass requires all applicable checks below:

- The reader can identify the feature, fact, distinction, or action without interpreting a vague metaphor.
- Every phrase contributes useful meaning; no unresolved finding from the applicable skill remains.
- Facts, qualifications, and product terminology remain accurate and consistent.
- The text fits its role: navigation identifies destinations, buttons name actions, and error messages explain the problem and an available next step.
- English reads naturally; Arabic uses the approved formal business register and natural Arabic syntax.
- The selected locale is respected, with only documented narrow exceptions.
- Adjacent headings and descriptions do not repeat the same point without adding information.
- Spelling, punctuation, capitalization, and references are correct; rendered text remains readable.

Use `blocked` when a necessary product fact or intended meaning cannot be established. Record the exact missing information; do not invent a replacement. Protected slogans receive `protected`, not an artificial pass.

## Execution procedure

1. Read both skills and the full page content before editing. Build the complete inventory, including every Arabic key and its English counterpart. Search beyond the localization files.
2. Review English with the English skill and Arabic with the Arabic skill. Record every finding and retain entries that already work.
3. Edit only entries with a concrete problem. For Arabic body copy, prefer declarative business descriptions over repeated commands such as «أدر». Choose button language according to its action rather than banning imperatives everywhere.
4. Compare each English/Arabic pair for equivalent facts and scope. Natural sentence structures may differ. Neither language may promise more than the other.
5. Read each full section and then the whole page to catch repeated positioning, inconsistent terms, disconnected headings, and robotic rhythm that isolated-key review misses.
6. Verify the rendered site in both locales on desktop and mobile. Open every disclosure and navigation state; inspect diagrams, footer, conditional notices, and accessible text. Check theme-dependent assets in light and dark mode.
7. Switch languages in both directions and reload with each preference saved. Verify titles, descriptions, announcements, and content after switching. Inspect initial metadata and social/manifest surfaces separately; a client-side title update alone does not establish their localization.
8. Reconcile source inventory with rendered text. Add missing entries and account for every excluded or empty key. Review any strings changed during verification again.
9. Run relevant existing checks if application files change. Record commands and results. Automated searches support the editorial review; they cannot certify writing quality.

## Initial inspection targets

These are concrete locations to inspect during execution, not a completed audit:

- `src/sections/Landing.tsx` contains a hard-coded `aria-label="Footer"` and a bilingual brand accessible name.
- `src/components/Primitives.tsx` also contains a bilingual brand accessible name.
- `public/site.webmanifest` contains a bilingual application name.
- `src/routes/__root.tsx` initializes document and social metadata from English content; compare this with updates in `src/app/preferences.tsx`.
- The source has empty localized placeholders. Account for them individually rather than silently skipping them.

## Deliverables and acceptance

Execution must produce the revised application copy, the complete inventory, and `docs/copy-review-report.md`. The report must summarize English and Arabic coverage separately, list substantive before/after changes, document protected text and language exceptions, and link verification evidence. Include unresolved blockers explicitly.

Accept the review only when:

- Every discovered text entry is accounted for; zero rows remain `unreviewed`.
- Every in-scope, non-protected entry has a final `pass`; zero `fail` or `blocked` verdicts remain.
- Every empty or excluded entry has a reason supported by its use in the application.
- Both protected slogan strings are unchanged.
- Locale isolation and factual parity hold across visible and accessible content.
- Rendered verification covers both languages, desktop/mobile layouts, and the relevant interactive states without clipping, unreadable direction changes, or stale translations.

If any required check cannot be completed, report the review as incomplete. Do not describe the entire site as “no slop” based only on a keyword search or a sample of sections.
