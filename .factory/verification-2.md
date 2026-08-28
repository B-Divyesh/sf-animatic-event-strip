# Animatic Event Strip — independent verification 2

**Verdict: FAIL — release blocked**

- Candidate: `ae964e0113269aecfbdf888a3f239e27f200a280`
- Live URL: <https://animatic-event-strip.sociobot.in>
- Verified: 2026-08-28 UTC
- Work order: `animatic-event-strip-verify-2`
- Artifact: local-first PWA; no sign-in and no first-party backend

This is fresh verification of the repaired candidate, not a repetition of the historical report in `verification.md`. The prior deployment-only blockers are repaired: checkout redirects correctly, the license endpoint throttles, policy headers and immutable caching are live, and the deployed files match this candidate. The candidate nevertheless fails the supplied acceptance contract before general QA can accept it: it has no required claims manifest, no isolated one-click sample-data demo, and the cold first screen does not plainly identify its audience or first action.

## Release-blocking defects

### Blocker — AES-QA-201: required claims manifest and executable claim tests are absent

The very first clean-checkout check was:

```text
git rev-parse HEAD  -> ae964e0113269aecfbdf888a3f239e27f200a280
test -f .factory/claims.json  -> false
rg -n '@claim:' tests src README.md  -> no matches
```

`.factory/claims.json` is missing, so there were no declared `test` commands to run from the demo entry point. The claims contract explicitly makes a missing manifest release-blocking. This also leaves observable claims such as local-only storage, offline reopening, JSON/CSV export, stable schemas, and cached offline access without one tagged sandbox test each.

### Blocker — AES-QA-202: no one-click, isolated sample-data demo exists

Cold browser evidence at 390 × 844 found **0** elements whose accessible text matched `Try it with sample data`. The first interactive product actions are `Import`, `Export`, `+ Add event`, and `Add your first event`; each requires the visitor to create their own content.

`/demo` returns HTTP 200 only because the SPA navigation fallback serves the same editor. It has the identical heading, no sample events, no `Demo — sample data, nothing is saved` banner, no Reset demo or Start for real control, and no separate storage namespace. Source inspection confirms that the sole IndexedDB database is `animatic-event-strip` (`src/storage.ts`) and has no demo conditional or `demo:` namespace. `.factory/demo.md` is also absent.

Impact: a new animator cannot try the core workflow in one click, and there is no safe demo entry point against which to execute the required claims tests.

### Blocker — AES-QA-203: cold first-read test fails the plain-words contract

The visible first-screen copy is:

```text
ENGINE-NEUTRAL PRE-PRODUCTION
Find the beat. Mark the handoff.
Shape frames, voice, sound, and interaction windows into one portable strip—before implementation details harden.
```

It suggests a planning tool, but does not name the stated audience (solo 2D animators and small game teams) and provides no sample-data action or instruction for what to click first. The heading is metaphorical rather than a plain-language job headline. Consequently the first screen does not answer all of what it does, for whom, and what to click first in plain words, as required. `.factory/copy-audit.md` is absent as well.

## Previous deployment findings: fresh disposition

| Historical finding | Fresh result |
| --- | --- |
| Checkout returned 404 | **PASS/repaired.** `GET https://api.sociobot.in/api/v1/products/animatic-event-strip/checkout` returned HTTP 303 with a `https://checkout.dodopayments.com/session/...` location. |
| No API rate limiting | **PASS/repaired.** An independent 80-request concurrent verify burst returned 30 × HTTP 200 and 50 × HTTP 429; throttled responses supplied `Retry-After: 4`. The repository live-policy test also passed (observed `Retry-After: 3`). The exact first response order in concurrent completion is not a threshold measurement; the safe observed threshold is no more than 30 successful requests per burst. |
| 390 px target sizes | **PASS.** Repository mobile Playwright test passed its exact 44 px checks for the wordmark, rename, Privacy, and Terms controls. The live 390 px `+ Add event` target measured 358 × 46 CSS px. |
| Missing policy headers/caching | **PASS/repaired.** Live responses include restrictive CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, Permissions-Policy, HSTS, and Referrer-Policy. Hashed JS/CSS return `Cache-Control: public, max-age=31536000, immutable`; HTML, manifest, SW, and legal pages are revalidatable (`max-age=30`). |

## Clean candidate quality gates

All commands below were run against the checked-out candidate after `npm ci`:

| Gate | Result |
| --- | --- |
| `npm ci` | PASS — 140 packages installed; 0 audit vulnerabilities reported by install |
| required claims tests | **BLOCKED/FAIL — `.factory/claims.json` absent** |
| `npm test` | PASS — 7/7 Vitest tests |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS — `dist/` produced |
| `npm run test:e2e` | PASS — 7 passed, 3 intentional profile skips (10 declared tests) |
| `npm run test:live-policy` | PASS — checkout 303, observed 429 with numeric Retry-After, live HTTP 200 and immutable asset |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities |

The production build has 25,361 B JS (9,234 B gzip), 19,674 B CSS (5,172 B gzip), no font files, and a 36,138 B mobile hero image. These are within the supplied static-PWA budgets.

## End-to-end evidence

Against the local production build, an empty project was exercised through representative and recovery paths:

- Added an image board (`Gate opens`, frames 0–48), then an interaction marker (`Enable player input`, frames 36–55); both persisted after reload in the `animatic-event-strip` IndexedDB database.
- Rejected an invalid zero-length range with the visible, recoverable message: `Use a range inside frames 0–239; the end frame is exclusive.`
- Rejected malformed project JSON without reload and exposed the parse error in the workspace alert.
- Exported Marker CSV and inspected its observable result: UTF-8 BOM header plus exactly one row per created event, including frame ranges, seconds, marker kind, notes, and local filename.
- Focused a selected marker and used Shift+Right; its accessible label changed from the 36–55 range to `F46–64`, demonstrating keyboard movement and persistence behavior.

The repository Playwright suite additionally covers image attachment, edit, JSON adapter download, desktop/mobile axe, 390 px overflow, and local offline reload. It passed from this build.

## PWA, privacy, accessibility, and browser evidence

- Live offline reload: in a fresh mobile context, visited once, awaited service-worker readiness, reloaded under offline mode, and observed the app heading plus the `Offline` status banner. A service-worker controller was active.
- Service-worker update: served an unmodified candidate build in a temporary local server and changed only the served SW version token to simulate a newer deployment. The already-controlled app displayed **A fresh version is ready**; **Update app** activated the new worker and left only `aes-shell-v5` in Cache Storage. This confirms candidate update behavior without changing product code.
- Accessibility: the supplied `verify-url.sh` passed live (HTTP 200; title; `lang=en`; one `h1`; `main`; 0 missing image alternatives; 0 unlabeled buttons; 0 console/page errors). Live axe WCAG 2 A/AA found 0 serious/critical violations. The first Tab focused the skip link with `rgb(101, 227, 209) solid 3px`; reduced-motion transition duration was effectively instant (`1e-05s`).
- Browser privacy: the full ordinary live page load made only same-origin requests and produced no console/page errors. The optional payment route is the declared Sociobot endpoint; no analytics, remote fonts, ads, or third-party runtime scripts were observed. No sign-in exists, so the Entra tenant requirement is not applicable.
- Mobile: live cold-page test used 390 × 844; repository desktop and mobile profiles passed. No mobile body overflow was found by the mobile Playwright assertion.

## Deployment identity, HTTP, and performance

- Every deployable output file rebuilt from this commit matched its live response by SHA-256: all 18 files in `dist/`, excluding `staticwebapp.config.json` because Azure consumes rather than serves it. This includes `index.html`, JS, CSS, artwork, icons, manifest, service worker, legal pages, offline page, robots, and sitemap.
- Live `/`, `/demo`, `/privacy/`, `/terms/`, `/offline.html`, manifest, SW, robots, and sitemap returned HTTP 200. `/demo` is not a demo as noted above. The undeclared unknown route also returns the SPA shell rather than a designed 404.
- Lighthouse 13.4.1 mobile run produced Performance 96, Accessibility 100, Best Practices 100, SEO 100; LCP 1,771 ms and CLS 0.014. Its post-audit browser process crashed during the BFCache gatherer and exited non-zero, but the complete JSON report was written before that crash. Treat INP as unmeasured in this environment; do not represent it as independently verified.

## Reproduction

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run test:live-policy
npm audit --omit=dev
```

## Release decision

**FAIL. Do not release this candidate.** Add a claims manifest with one tagged observable demo test per claim; implement and document an isolated `?demo=1` or `/demo` sample workspace with the required persistent demo controls; and rewrite the first screen to plainly state the job, audience, and sample-data first action. Re-run all claim commands from a clean browser context after those changes.
