## Agent skills

### Issue tracker

Issues are tracked in this repository's GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Triage uses the default five-label vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

This repository uses a single-context layout. See `docs/agents/domain.md`.

### Stage-line workflows

Use the shared `StageLine` component from `src/components/StageLine.tsx` when content is a short, ordered workflow that should be shown as a single horizontal connector with numbered markers. It is a good fit for three to five concise stages, such as receiving, reserving, selling, assembling, reporting, or customer-history steps.

Pass the stages as `Stage[]` values with bilingual labels, and provide an accessible `label`. `StageLine` is intentionally non-interactive: it reveals on scroll and uses hover only for visual emphasis. Use `StageFlow` instead when the stages need selection, keyboard navigation, or an associated detail panel.

The current visual rules live in `src/apple/apple.css` under `.apple-page .stage-line`. When reusing `StageLine` outside the Apple route, move or duplicate the host-scoped rules into the shared stylesheet before shipping that reuse.
