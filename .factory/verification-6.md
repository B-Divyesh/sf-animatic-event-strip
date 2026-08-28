# Animatic Event Strip — independent verification 6

**Verdict: PASS — accepted for release**

- Candidate: `63faf8ff8aa43eb1f7353254ebef7d6c7fb55ff3`
- Live URL: <https://animatic-event-strip.sociobot.in>
- Verified: 2026-08-28 UTC
- Work order: `animatic-event-strip-verify-6`
- Artifact: local-first static PWA; no sign-in, published library/CLI, or first-party backend

The candidate satisfies the researched brief and supplied acceptance contract. The one-click isolated sample demonstrates the real planning job, all 14 declared claim commands pass, the complete clean-checkout gate suite is green, and the live deployment matches all 22 rebuilt public files byte-for-byte. No blocker, high, medium, or low product defect was found.

## Mandatory first gates

### Cold first-read — PASS

A fresh live load returned HTTP 200 with no console or page errors. The first screen answers the three required questions in plain words:

- What: **“Plan animation events before engine work.”**
- For whom: **“For solo 2D animators and small game teams planning frames, sound cues, and input windows before engine work.”**
- What to click first: **“Try it with sample data”**, followed by **“Loads a filled 10-second strip. The demo never opens or changes your project.”**

It also states the local-storage, offline, free-core-export, and $12 one-time-price facts. One click opens `/demo`, which immediately contains two board ranges, one waveform clip, and three semantic markers. The persistent banner says **Demo — sample data, nothing is saved**, and provides **Reset demo** and **Start for real**.

### Declared claims — 14/14 commands PASS

`.factory/claims.json` exists. After `npm ci`, every exact command was run separately against its declared demo/live entry point before broader QA:

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
| `license-lifecycle` | PASS |
| `studio-outputs` | PASS |
| `studio-checkout` | PASS — checkout 303, verify endpoint 429, `Retry-After: 4`, live 200, immutable asset |

The landing page, README, Privacy, Terms, export dialog, and license panel were cross-checked against the manifest. Their observable storage, privacy, offline, import/export, frame-rate, audio, paid-output, checkout, price, and license-lifecycle statements are represented by the listed claims and observable tests. Claim tags are unique by the release-policy test.

## Clean candidate quality gates

The interrupted prior run had left untracked evidence files in the shared workspace. Candidate gates were therefore repeated in a detached clean worktree at the exact commit so generated verifier files could not affect ESLint or build results.

| Gate | Result |
| --- | --- |
| `npm ci` | PASS — 140 packages installed; 0 audit vulnerabilities |
| `npm test` | PASS — 13/13 Vitest unit/release tests |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS — exact production `dist/` produced |
| `npm run test:e2e` | PASS — 37 passed, 3 intentional cross-profile skips |
| `npm run test:pwa-update` | PASS — update toast shown, `aes-shell-v8` activated, old cache removed |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities |

Production build sizes are 28,669 B JavaScript (10.22 KB gzip), 20,756 B CSS (5.41 KB gzip), 0 B fonts, and a 36,138 B mobile hero image. These are below the 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB hero budgets.

## Independent end-to-end exercise

A separate live Chromium flow, not an invocation of the repository tests, passed 14/14 checks:

- Opened the six-event **Rain Gate — opening beat** sample in its demo-only IndexedDB namespace.
- Rejected an equal 10–10 interaction range with the explicit supported-range error, then accepted the corrected 10–11 range without losing input.
- Accepted the last one-frame boundary at 239–240 (exclusive end).
- Rejected a duration of 239 while an event ended at 240, then accepted the documented maximum of 216,000 frames.
- Reloaded and retained all eight edited events.
- Moved a focused event left twice with the keyboard, retained focus after both re-renders, opened it with Enter, and returned focus with Escape.
- Rejected malformed project JSON and left all eight current events unchanged.
- Exported Adapter JSON version 1 with eight events and UTF-8 CSV with one header plus eight data rows.
- Reset the demo back to its six seeded events.

The ordinary demo flow requested only the product origin, created only `demo:animatic-event-strip`, set no cookies or license keys, and emitted no console/page errors. This confirms the demo does not read the real project or paid-license namespace.

## Accessibility, keyboard, mobile, and visual review

- `/opt/fleet/lib/verify-url.sh` on live `/demo`: HTTP 200; title `Demo — Animatic Event Strip`; `lang=en`; one H1; main landmark; zero missing image alternatives; zero unlabeled buttons; zero console/page errors.
- Fresh Axe WCAG 2 A/AA checks on `/`, `/demo`, `/privacy/`, `/terms/`, `/offline.html`, and the designed 404 found zero serious/critical violations.
- The first Tab reaches **Skip to event strip**. After the reduced-motion transition settles (10 ms), it is on-screen with a 3 px cyan outline. Enter moves focus to the main landmark. Core event editing and dialog focus-return paths work without a pointer.
- `prefers-reduced-motion: reduce` reduces transitions to `0.01 ms`; there is no looping or flashing motion.
- At exactly 390×844, both `/` and `/demo` have no body overflow. Every visible link, button, input, select, textarea, and focusable timeline control measured at least 44×44 CSS px.
- Desktop and full-page 390 px visual review found no clipping, collision, unreadable control, or obscured content. The responsive layout intentionally keeps only the time axis horizontally scrollable.
- The visual system matches `.factory/design.md`: a single documented cutting-room dark treatment, authored icons, self-hosted/system type, product-specific palette, and disclosed original generated artwork.

## PWA, privacy, routes, and deployment identity

- Chromium reported zero manifest parse or installability errors. The worker controls the full origin under cache `aes-shell-v8`.
- A fresh 390 px demo visit reloaded offline with all six sample events and the visible offline notice. The dedicated update probe showed **A fresh version is ready**, activated v8, and removed the prior cache.
- All 22 public files rebuilt from this commit match the custom-domain responses byte-for-byte by SHA-256. Azure-consumed `staticwebapp.config.json` is correctly excluded. The live deployment is the candidate under test.
- `/`, `/demo`, both slash variants of Privacy and Terms, the offline page, manifest, worker, robots, and sitemap return 200. An unknown route returns the designed 404 page with HTTP 404.
- A crawl found no dead links: internal product links return 200, mail links are explicit, and the purchase link returns 303 to `checkout.dodopayments.com`.
- Root responses include HSTS, restrictive CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict-origin referrer policy, and a Permissions Policy disabling unused capabilities.
- HTML, manifest, worker, and legal pages revalidate with `max-age=30`. Hashed assets return `public, max-age=31536000, immutable`.
- A fresh rapid sequential burst to the Sociobot verification endpoint returned 30 HTTP 200 responses; request 31 returned HTTP 429 with `Retry-After: 4`.
- No sign-in exists, so Microsoft Entra tenant verification is not applicable. No product backend, published package, or CLI exists, so backend concurrency/health and clean-consumer package checks are not applicable.

## Performance

Lighthouse 13.4.1 mobile against live `/demo` completed successfully:

- Performance 94
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 982 ms; LCP 1,051 ms; TBT 282.5 ms; CLS 0.0136; transfer 61,096 B

LCP and CLS satisfy the supplied budgets. Lab INP is not produced for a navigation-only Lighthouse run; interaction testing found no delayed or blocked core control.

## Findings and disposition

- Blocker: none.
- High: none.
- Medium: none.
- Low: none.
- Research gap: the brief’s five-person pilot and its ambiguity success measure have not been run. This remains post-release product research, not a coded or advertised performance claim.

## Release decision

**PASS. Candidate `63faf8ff8aa43eb1f7353254ebef7d6c7fb55ff3` is accepted for release at <https://animatic-event-strip.sociobot.in>.** No product code was changed during verification.
