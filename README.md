# Jizrak — جِذرك

English/Arabic commerce landing page built from the supplied specification, with **only the selected language rendered at a time**. The user's updated language preference supersedes the original simultaneous-bilingual layout. The canonical brand lockup and language-switch label are the intentional exceptions.

## Runtime and deployment decision

Bun **1.2.23**, React 19, TanStack Start 1.x, Vite 7, TypeScript 5.8, Tailwind 4. The selected deployment adapter is **Nitro 3.0.1-alpha.2**, using `nitro/vite` with the `node-server` preset, intended for a Node.js service on Render behind HTTPS. This is the Vite 7 generation of the adapter, pinned and tested; adapter upgrades require rerunning the prerender and browser checks. The root is statically prerendered as well as server rendered. Production onboarding, demo, authentication, and canonical URLs must come from the owner; no production destinations are inferred.

## Local development

Install Bun 1.2.23, then `bun install --frozen-lockfile` and `bun run dev`. Development uses the brief's local anchors. `bun run build` intentionally fails until the public URL configuration is complete. Copy `.env.example` to `.env` and supply verified values before launch. `bun run build:preview` produces an explicitly nonproduction, noindex review build with development anchors.

Available checks: `bun run lint`, `bun run typecheck`, `bun run test`, `bun run e2e`. Install browser binaries using `bun x playwright install`. `bun run preview` serves the Nitro build on port 3000 (override `PORT` when the dev server is running). Analytics and lead collection are disabled.

Alexandria and IBM Plex assets are local WOFF2 files. Their official upstream commits, SHA-256 checksums, and OFL licenses are recorded in `public/fonts/`. Alexandria is packaged at the one display weight used by the design. IBM Plex remains unmodified. Only requested font weights are fetched by the browser. System fonts remain the fail-open fallback.

## Build and hosting

The production command is `bun run build`, which first runs `bun run validate:config`. On Render, set the four public build variables from `.env.example`, use `bun install --frozen-lockfile && bun run build` as the build command, and `node .output/server/index.mjs` as the start command. Configure Bun 1.2.23 and Node 22.12 or newer. The host supplies `PORT` and HTTPS. The deployable directory is `.output/`; complete HTML is in `.output/public/index.html`. Brotli/gzip sidecars are generated for static assets. This repository has not been publicly deployed.

The `build:preview` command intentionally uses a noindex review mode. Its local anchor destinations lead to honest configuration notices, not simulated onboarding or authentication. Do not promote a review build to production. Optional legal links render only when configured; their URLs are validated too. No structured Organization claims are emitted without a verified legal identity.

## Project map

- `src/content/landing.json`: all approved bilingual section copy and the 17 feature groups, imported from `docs/build-plan.md`.
- `src/content/index.ts`: typed content and interface strings.
- `src/components/BilingualBlock.tsx`: selects one language from paired source data; renders a single semantic heading or text fragment without a duplicate translation.
- `src/app/preferences.tsx`: first-paint preferences, storage fallback, locale reflow, and theme behavior.
- `src/apple/AppleLanding.tsx`: the sole root landing page and product journey.
- `e2e/apple.spec.ts`: cross-browser acceptance checks for the promoted root experience.
- `e2e/landing.spec.ts`: public route-surface checks for the sole root route.
- `scripts/audit-built.mjs`: local mobile performance observations against port 4000.

Read the [TanStack prerendering documentation](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering) and [hosting documentation](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) before changing the adapter. The public copy intentionally omits platform-only recovery operations in accordance with the supplied product-truth rules.

## Launch gates

Verify every advertised journey against the deployed product; obtain Arabic and English reviewer approval; supply real production URLs; perform desktop and mobile screen-reader reviews and deployed performance audits. Development previews are not approved public launch artifacts. See `docs/verification.md` for measured results and remaining work.
