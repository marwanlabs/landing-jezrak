# Account entry verification

Final source: `src/auth/`, `/login`, `/signup`. Reproduce with `node scripts/verify-auth.mjs`; defaults to the final built package served on port 4200. The existing development site also serves both routes on port 3000.

- Scroll-craft preflight passed with the installed FFmpeg path explicitly supplied. No generation calls or asset credits used.
- Review build prerendered all four routes. TypeScript and focused ESLint passed. Existing Vitest suite: 23 tests passed.
- Final browser evidence: `lab/final/`. Headless Chrome, pointer lock/capture disabled in all contexts.
- Both routes at desktop 1440px light/dark, phone 390px, compact Arabic dark 360px, and reduced-motion phone. Opening, middle, end and submitted states captured.
- Twenty Axe scans (initial and submitted state across ten configurations) returned zero violations. This is an automated check, not accessibility certification.
- Checked empty fields, focus on first invalid input, live store-name preview, password reveal/hide, password clearing, no credential requests/storage/URL query, recovery explanation, reciprocal links, keyboard skip-to-form, no horizontal overflow, no runtime/resource errors, and safe disabled no-JavaScript forms using POST rather than GET.
- Mobile specimen enters only on visibility; frames at 0, 300 and 850ms show three distinct plaque transforms. Reduced-motion check confirms no positional animation.

Visual review: desktop form remains dominant and reachable, specimen and connectors retain separation, Arabic RTL labels and dark-mode controls are legible. The initial mobile review revealed the illustration had already completed offscreen, so the final version triggers on intersection. Password padding was also corrected for the RTL reveal button. Final motion frames reviewed after these changes.

Feeling check: initial composition reads calm, then clear; the editable name gives the illustration ownership. Mobile initially lost the arrival beat, fixed by the viewport trigger. The ending is an explicit integration boundary, not a simulated account success. These are design judgments from rendered frames, not measured user sentiment.

Limits: no authentication backend or identity provider; no account, session or reset email created. A real phone was not tested. No deployment or commit requested. Existing staged skill files and prior feature animation changes were preserved.
