# Copy review execution todo

This checklist tracks execution of [the copy review spec](copy-review-spec.md) on the current `main` worktree.

- [x] Read the full spec, English no-slop guidance, and Arabic no-ai-slop guidance.
- [x] Audit the shared landing copy, metadata, route error copy, accessible labels, manifest, and rendered-source assets.
- [x] Review every discovered English and Arabic source entry; preserve clear wording and document empty placeholders.
- [x] Repair only concrete copy problems, with Arabic findings tied to quoted wording and a specific repair.
- [x] Compare English/Arabic pairs for factual scope, Store/Business/Location distinctions, and locale isolation.
- [x] Update the inventory generator and committed CSV with original text, final text, verdicts, and evidence.
- [x] Validate JSON syntax, CSV verdict coverage, and whitespace safety.
- [x] Run typecheck and lint through the installed project binaries.
- [ ] Run unit tests, build, and browser verification. **Blocked:** the Vitest/esbuild launcher cannot resolve the repo config in this sandbox; rendered browser verification therefore remains unavailable here.
- [ ] Verify desktop/mobile interactive states, theme assets, language switching, and reload persistence. **Blocked:** the local dev/test runtime is unavailable.
- [x] Record blockers explicitly in the review report.
