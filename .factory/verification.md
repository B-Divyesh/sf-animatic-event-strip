# Animatic Event Strip — independent verification

**Verdict: FAIL**

- Candidate: `89437ed68df24ca0a513367ad7e7ec46001ef905`
- Live URL: <https://animatic-event-strip.sociobot.in>
- Verified: 2026-08-28 UTC
- Work order: `animatic-event-strip-verify-1`
- Artifact: PWA/offline; no sign-in and no first-party backend

The free, local-first planner is usable end to end and the live deployment is byte-for-byte the candidate. Release acceptance nevertheless fails because the advertised paid checkout returns 404 and the license verification endpoint did not rate-limit a 200-request burst. Mobile touch targets also miss the supplied accessibility contract.

## Defects

### High — AES-QA-001: Studio Pack cannot be purchased

The live **Buy Studio Pack** link targets the required Sociobot endpoint, but a fresh request returned:

```text
GET https://api.sociobot.in/api/v1/products/animatic-event-strip/checkout
HTTP/2 404
{"error":"enabled factory product","status":404}
```

Impact: the advertised $12 one-time purchase and paid Godot/Unity/print unlock have no working acquisition path. Existing/invalid license verification itself is reachable and returned HTTP 200 with `{ "valid": false, "reason": "invalid" }`.

### High — AES-QA-002: license verification has no observable rate limit

A burst of 200 GETs to
`/api/v1/products/animatic-event-strip/verify?license=qa-rate-limit-89437ed`
was sent in 20 waves of 10 concurrent requests. Result: **200 × HTTP 200, 0 × HTTP 429**. No threshold was reached and no `Retry-After` header was available. This fails the explicit API rate-limit acceptance check and leaves the verification endpoint open to unthrottled abuse.

### Medium — AES-QA-003: four mobile interactive targets are below 44×44 CSS px

At a 390×844 viewport:

| Target | Measured size |
| --- | ---: |
| Wordmark/home link | 125×42 |
| Rename-project button | 183×34 |
| Privacy link | 47×20 |
| Terms link | 38×20 |

All remained keyboard reachable and axe reported no serious/critical findings, but the supplied accessibility/design contract requires every touch/click target to be at least 44×44 px.

### Low — AES-QA-004: deployed browser-policy hardening is incomplete

Responses include HTTPS, HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Content-Type-Options: nosniff`, but no `Content-Security-Policy`, anti-framing policy (`frame-ancestors` or `X-Frame-Options`), or `Permissions-Policy` was present. This leaves a local-data/licensing UI frameable and without a browser-enforced resource allowlist.

### Low — AES-QA-005: static assets do not receive long-lived immutable caching

The app shell, service worker, manifest, legal pages, icons, and artwork all return `Cache-Control: public, must-revalidate, max-age=30`. Asset URLs are not content-hashed and therefore cannot use the requested long-lived immutable policy. The service worker's cache-first asset strategy still makes repeat/offline use work.

## Clean-checkout gates

A detached worktree was created directly from the candidate, then tested with the lockfile:

| Gate | Result |
| --- | --- |
| `npm ci` | PASS — 65 packages added; 0 audit vulnerabilities |
| `npm test` | PASS — 5/5 Vitest tests |
| Type check | PASS — `tsc --noEmit` runs inside the build |
| `npm run build` | PASS — Vite 7.3.6; `dist/` produced |
| `npm run test:e2e` | PASS — 6 passed, 2 expected profile skips |
| Separate lint script | Not present in `package.json` |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities |

The production build emitted a 60,421-byte inlined app shell (18.73 KB gzip). Extracted inline payloads were 25,304 bytes of JavaScript and 19,535 bytes of CSS; no fonts ship. The responsive LCP artwork is 36,138 bytes at 960 px and 75,286 bytes at 1536 px. These meet the 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB hero budgets.

Lighthouse 12.8.2 using the supplied Chromium, mobile/default throttling:

| Target | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Local production build | 90 | 100 | 100 | 100 | 1.4 s | 390 ms | 0 |
| Live deployment | 100 | 100 | 100 | 100 | 1.2 s | 0 ms | 0.014 |

## End-to-end product evidence

The same independent Playwright workflow passed against both the local production build and the live URL:

- Started from the empty state and built a 30-second, 24 fps scene with a WebP board, a valid local WAV (decoded waveform), an interaction window, notes, and a marker on the final supported frame.
- Rejected blank labels, negative frames, a range beyond the scene, a duration too short for existing events, malformed JSON, and an over-maximum duration; recovered without reload. Accepted the 12-frame minimum through import and the 216,000-frame maximum through settings.
- Renamed/re-timed the scene, moved a selected marker by keyboard, honored the end boundary, moved the playhead with Home/End, and advanced/pause-stopped playback.
- Exported and parsed project JSON with embedded media, adapter JSON with schema `animatic-event-strip/adapter` and `adapter_version: 1`, and BOM-prefixed UTF-8 CSV. The locked Godot action left core exports free and explained the license requirement.
- Cancelled and confirmed destructive project replacement and event deletion. Data and media survived reload and offline reload in IndexedDB.
- Simulated a service-worker script update using a versioned query, observed **A fresh version is ready**, activated **Update app**, and reloaded successfully. Cache `aes-shell-v1` was present.
- Captured a returned license token, verified it was stored under `sb_license:animatic-event-strip`, stripped it from the address bar while preserving other query/hash state, and confirmed cached access on offline reload. A real invalid-token browser check made exactly one request to the documented Sociobot verification endpoint and set no browser cookies.

Ordinary planning, import, export, reload, and offline use made only same-origin requests. Source inspection found no analytics, ad code, remote fonts, or third-party runtime scripts. User media stayed in IndexedDB and exported files. Privacy and terms pages are present and accurate for observed application behavior.

## Accessibility and responsive evidence

- `/opt/fleet/lib/verify-url.sh` passed locally and live: HTTP 200, `lang=en`, one `<h1>`, `<main>`, zero images missing alt, zero unlabeled buttons, and no console/page errors.
- Axe WCAG 2 A/AA scans on empty desktop, open event dialog, and 390 px mobile returned **0 serious and 0 critical** findings.
- Keyboard-only checks passed for the skip link, visible focus, dialogs, timeline selection/movement, and Home/End playhead controls.
- `prefers-reduced-motion: reduce` reduced transitions to effectively instant. A 200% body-text check and 390 px layout check produced no body overflow; the mobile dialog remained scrollable within the viewport.
- Visual review of full-page desktop and 390 px screenshots found no overlap, clipping, illegible state, or generic/default styling. The implementation matches `.factory/design.md`.

## Deployment identity, PWA, and HTTP evidence

- All **16 files** in the candidate `dist/` matched live responses by SHA-256. `dist/index.html` and live `/` both hash to `ec5c4b9c9bce43d51b69402e2d2d1f2aeffeaedb2be6cee786e6e300020bd746`.
- Live `/`, `/privacy/`, `/terms/`, `/sw.js`, manifest, icons, and artwork returned HTTP 200. Chromium parsed the manifest with no errors and confirmed standalone display, versioned start URL, 192/512 icons, and a maskable icon.
- The production service worker registered, precached the shell, showed its offline state, preserved stored work, accepted an update, and recovered after offline reload.
- Live verification CORS allowed only the product origin in the observed response. Invalid license responses were `Cache-Control: no-store`.
- No sign-in exists, so the Entra authority check is not applicable. No library/CLI pack test and no first-party backend concurrency/health test are applicable.

## Commands to reproduce

```sh
npm ci
npm test
npm run build
npm run test:e2e
npm audit --omit=dev
CHROME_PATH=/opt/pw-browsers/chromium-1208/chrome-linux64/chrome \
  npx --yes lighthouse@12.8.2 https://animatic-event-strip.sociobot.in/ \
  --chrome-flags='--headless --no-sandbox' \
  --only-categories=performance,accessibility,best-practices,seo
```

## Release decision

**FAIL.** Do not treat the paid product as releasable until the live checkout is registered/enabled and the verification endpoint enforces a documented 429 threshold with `Retry-After`. The mobile target-size defect should be corrected before acceptance; response-policy and caching findings should be scheduled with the deployment owner.
