# Animatic Event Strip — independent verification 5

**Verdict: FAIL — release blocked**

- Candidate: `b6137917279fd65d9556713d718c2874399822d6`
- Live URL: <https://animatic-event-strip.sociobot.in>
- Verified: 2026-08-28 UTC
- Work order: `animatic-event-strip-verify-5`
- Artifact: local-first static PWA; no sign-in, published library/CLI, or first-party backend

The product itself works well and the deployment matches this candidate. All 13 declared claim commands pass after `npm ci`, the required first-read/demo gate passes, and the functional, accessibility, PWA, policy, and performance checks are green. The candidate still fails the acceptance contract because several public promises are absent from `.factory/claims.json`, and the Privacy page inaccurately says that project history is stored.

## Release-blocking findings

### High — AES-QA-501: public license-lifecycle claims have no declared, exactly tagged sandbox test

The claims contract requires every statement a visitor can rely on to be listed in `.factory/claims.json` and exercised by exactly one `@claim:<id>` test. These public promises are not represented by any claim entry:

- `index.html:129`: “Licenses are checked at most once daily.”
- `public/privacy/index.html:4`: license verification responses are not cached, while only the verdict and check time are retained for up to one day.
- `public/terms/index.html:4`: a refunded, expired, or revoked license stops paid access while the free planner and data remain available.
- `public/terms/index.html:4`: a Studio license can be used across the buyer's devices through restoration.

The existing `cached-license-offline` test starts with a fresh valid verdict and checks only offline access. It does not assert same-day request suppression, verdict expiry, response-cache exclusion, invalid/revoked reconciliation, or restore behavior. `studio-outputs` checks downloads with a seeded valid cache, while `studio-checkout` checks the hosted redirect, API rate limit, response headers, and asset caching. None proves the lifecycle statements above.

Independent probes found that the current daily and revocation behavior does work: a same-day cached verdict made zero API requests; a mocked `reason: "revoked"` response stripped the return token from the URL, stored it, and locked paid exports. That does not satisfy the mandatory claims manifest and exactly tagged test requirement. Add a declared license-lifecycle claim backed by recorded browser fixtures, or remove/narrow the public promises.

### Medium — AES-QA-502: the Privacy page incorrectly says project history is stored

`public/privacy/index.html:4` says “project history” is stored in IndexedDB. The data layer has one `projects` store and always writes the current project to the single key `active` (`src/storage.ts:9-11,35-40`). There is no history collection, revision list, undo history, or history UI. A user could reasonably read the privacy disclosure as meaning prior project revisions are retained or recoverable.

Replace “project history” with “the current project,” or implement and document real history with corresponding privacy and claim coverage.

## Mandatory first gates

### Cold first-read — PASS

A fresh live desktop and 390 px load returned 200 with no console or page errors. The first screen answers all three required questions in plain words:

- What: **“Plan animation events before engine work.”**
- For whom: **“For solo 2D animators and small game teams…”**
- What to click first: **“Try it with sample data”**, followed by **“Loads a filled 10-second strip. The demo never opens or changes your project.”**

The same screen shows local-storage, offline, free-export, and $12 one-time-price facts. The one-click `/demo` route immediately shows the six-event Rain Gate sample and the persistent isolated-demo banner with **Reset demo** and **Start for real**.

Evidence: `evidence/verification-5/live-first-read-mobile-390.png` and `evidence/verification-5/live-demo-desktop.png`.

### Declared claims — PASS after clean install

`.factory/claims.json` exists with 13 entries. After `npm ci`, every exact command was run separately from its demo entry point:

| Claim | Result |
| --- | --- |
| `sample-demo` | PASS |
| `editor-workflow` | PASS |
| `fps-options` | PASS |
| `audio-preview` | PASS |
| `local-storage-only` | PASS |
| `runtime-privacy` | PASS |
| `offline-reload` | PASS |
| `project-json-roundtrip` | PASS |
| `adapter-json-v1` | PASS |
| `csv-export` | PASS |
| `cached-license-offline` | PASS |
| `studio-outputs` | PASS |
| `studio-checkout` | PASS — checkout 303, rate limit 429, numeric `Retry-After: 4`, live 200, immutable asset |

The failure is the separate cross-check required by the claims contract: public promises exist outside this complete-looking list.

## Clean local quality gates

| Gate | Result |
| --- | --- |
| `npm ci` | PASS — 140 packages; 0 vulnerabilities |
| `npm test` | PASS — 12/12 Vitest unit and release tests |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS — exact production build emitted `dist/` |
| `npm run test:e2e` | PASS — 35 passed, 3 intentional cross-profile skips |
| `npm run test:pwa-update` | PASS — update toast shown, `aes-shell-v7` activated, old cache removed |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities |

Build sizes: initial JavaScript 28,640 bytes / 10,215 bytes gzip; CSS 20,756 bytes / 5,413 bytes gzip; fonts 0 bytes; mobile hero WebP 36,138 bytes. All are below the 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB hero budgets.

## Independent product exercise

- Normal demo: loaded six realistic board/audio/marker events, added an interaction window, persisted it, exported Adapter JSON v1 with seven events, and exported UTF-8 CSV with one header plus seven data rows.
- Boundaries: accepted the last one-frame event at frames 239–240; clamped a right-arrow move at the strip end; accepted the maximum 216,000-frame duration and retained all events.
- Invalid input and recovery: native required validation rejected an empty label; an equal start/end range produced the explicit frame-range error; a duration that would cut an existing event was rejected; malformed project JSON produced an actionable error and left the seven-event project unchanged.
- Keyboard: repeated Arrow and Shift+Arrow movement retained focus; Enter opened the selected event; Escape returned focus to that exact event. A fresh first Tab exposed the skip link with a 3 px cyan focus outline.
- Privacy boundary: the complete normal demo flow made only same-origin requests. The browser contained only the `demo:animatic-event-strip` IndexedDB database, not the real project database.
- Paid flow: checkout returned 303 to `checkout.dodopayments.com`. A return token was stored and removed from the URL. Invalid/revoked verification locked paid controls. A fresh same-day cache made zero verification requests.
- Routes and links: `/`, `/demo`, `/privacy/`, and `/terms/` returned 200. An unknown route returned the designed 404 with a route-specific title and return action. Every product link returned 200 or the intentional checkout 303.

## Accessibility, responsive behavior, and browser health

- `/opt/fleet/lib/verify-url.sh` passed locally and live on `/demo`: `lang=en`, route title, one H1, main landmark, no missing image alternatives, no unlabeled buttons, and no console/page errors. JSON evidence is under `evidence/verification-5/{local-smoke,live-smoke}/verify.json`.
- Fresh Axe WCAG 2 A/AA runs found zero violations of any impact on `/demo`, `/privacy/`, `/terms/`, and the designed 404.
- At 390×844, document width equaled viewport width (390 px), every currently visible interactive target was at least 44×44 CSS px, and the cold first screen remained readable without collisions or clipping.
- `prefers-reduced-motion: reduce` changed control transitions to `0.00001s`. No looping or flashing motion was present.
- Desktop, mobile, normal demo, legal routes, offline reload, and keyboard probes produced no unexpected console or page errors.

## PWA, privacy, deployment, and response policy

- Chromium reported no manifest parse or installability errors. The live worker controlled `/demo`, used only `aes-shell-v7`, and reloaded all six sample events offline with the visible offline notice.
- The dedicated update test installed an older worker, showed **A fresh version is ready**, activated v7, reloaded, and removed the old cache.
- All 22 deployable files rebuilt from candidate `b6137917` match the custom-domain responses byte-for-byte by SHA-256. Azure consumes `staticwebapp.config.json`, so it is excluded. The deployment is the candidate under test.
- Root responses include HSTS, restrictive CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict-origin referrer policy, and a restrictive Permissions Policy. Root/manifest/worker responses revalidate after 30 seconds; hashed assets return `public, max-age=31536000, immutable`.
- A fresh sequential burst to the Sociobot verify endpoint returned 30 HTTP 200 responses; request 31 returned HTTP 429 with `Retry-After: 4`.
- No sign-in exists, so Entra tenant verification is not applicable. No published package/CLI or first-party backend exists, so consumer install, health, concurrency, and backend persistence checks are not applicable.

## Performance

Lighthouse 13.4.1 mobile against live `/demo`:

- Performance 97
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 988 ms; LCP 1,056 ms; TBT 183 ms; CLS 0.0136; transfer 65,295 bytes
- Lab INP was unavailable; no INP failure was observed in interaction testing.

Raw report: `evidence/verification-5/lighthouse-live.json`.

## Required disposition

Do not release this candidate. Correct the false project-history disclosure, enumerate every remaining public license/privacy promise in `.factory/claims.json`, add one exactly tagged sandbox test per declared claim using recorded API fixtures, and rerun independent verification. No product code was changed during this verification.
