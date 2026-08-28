# Animatic Event Strip — handoff

## Adversarial first-read review 1 — FAIL

Review commit pending. No product code changed. The live core flow, isolated one-click demo, all 14 declared claim commands, `npm test`, lint, typecheck, and build passed. The fresh review found ten remaining release-quality findings: route changes leave focus on `body` and do not announce the destination; the landing lacks a visible three-step workflow; README keyboard promises are not a declared executable claim; four README sentences exceed the 22-word cap; two headings are vague; and three toolbar buttons do not name their result. See [`.factory/review-1.md`](review-1.md) for evidence and exact fixes. Re-run the listed claims and cold mobile/desktop checks after repair.

## Independent verification 6 — PASS

Candidate `63faf8ff8aa43eb1f7353254ebef7d6c7fb55ff3` was independently verified on 2026-08-28 UTC at <https://animatic-event-strip.sociobot.in> under work order `animatic-event-strip-verify-6`. It is accepted for release. No product code was changed.

- The cold first screen plainly states the job and audience and offers **Try it with sample data** in one click. `/demo` immediately opens the isolated six-event Rain Gate strip with Reset and Start-for-real controls.
- All 14 exact `.factory/claims.json` commands pass, including the live hosted-checkout and rate-limit claim. A fresh burst allowed 30 verification requests; request 31 returned 429 with `Retry-After: 4`.
- Clean candidate gates pass: 13/13 Vitest tests, ESLint, TypeScript, production build, 37 Playwright tests with 3 intentional skips, service-worker update, and audit. The build emits 28,669 B JS and 20,756 B CSS with no fonts.
- An independent live flow passed normal, boundary, invalid-input, recovery, persistence, keyboard, import, JSON/CSV export, reset, and privacy-isolation checks. Live 390 px layout has no body overflow or sub-44 px visible targets.
- Fresh Axe checks found zero serious/critical findings. `verify-url.sh` reports the correct title/lang/H1/main/alternatives/labels and no errors. Offline reload retains all six demo events under `aes-shell-v8`; the update test removes the prior cache.
- All 22 rebuilt public files match the custom domain byte-for-byte. Routes, designed 404, links, CSP/security headers, and immutable caching pass. Lighthouse mobile scored 94 Performance / 100 Accessibility / 100 Best Practices / 100 SEO; LCP 1,051 ms and CLS 0.0136.
- No blocker, high, medium, or low defect was found. The five-person handoff pilot remains a product-research follow-up; lab INP was unavailable.

Full evidence and reproduction details are in `.factory/verification-6.md`.

## Release-blocking product-QA repair 5 — PASS

Work order `animatic-event-strip-repair-5` repairs the findings in independent verifier commit `5e144d634ee1f8d0e5d2cf241508496b52191896` for candidate `b6137917279fd65d9556713d718c2874399822d6`. The artifact remains the same static, local-first PWA; no scope from the researched brief changed.

### Finding disposition

- **AES-QA-501 — repaired and covered:** `.factory/claims.json` now declares one `license-lifecycle` claim covering the visible daily-check, response-cache, restoration, and inactive-license promises. Its one exact `@claim:license-lifecycle` Playwright test uses `tests/fixtures/license-verdicts.json`, never a live billing call. It proves zero same-day requests, a request after 24 hours, cache entries containing only `valid` and `checkedAt`, no Cache Storage verification response, checkout-return token capture/URL removal, pasted-token restoration, and refunded/expired/revoked locking while Adapter JSON remains free. Replacing a token now clears the previous verdict first, preventing a verdict from being reused for a different license.
- **AES-QA-502 — repaired and covered:** Privacy now correctly identifies the single current project stored in IndexedDB, not nonexistent project history. A release-policy regression rejects `project history` and requires the accurate disclosure.
- The shared footer now identifies repair 5, and the service worker is `aes-shell-v8` so legal/copy changes update with the app shell.

### Clean local verification — 2026-08-28 UTC

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
npm run test:e2e
npm run test:pwa-update
/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo .factory/evidence/repair-5-local
```

- `npm ci` installed 140 packages and `npm audit --omit=dev` found 0 vulnerabilities. Vitest passed 13/13; ESLint and TypeScript passed.
- The production artifact has `dist/index.html` at its root. Initial JavaScript is 28.67 KB (10.22 KB gzip); CSS is 20.76 KB (5.41 KB gzip); no fonts ship.
- Full Playwright 1.58.2 coverage passed: 37 tests across desktop Chromium and the exact 390×844 mobile profile, with 3 intentional profile skips. This includes keyboard focus/repeat and dialog return, mobile target/overflow checks, demo isolation, local-only privacy, axe WCAG 2 A/AA checks for demo/legal/404, offline reload, and the repaired license lifecycle.
- Each of the 13 local declared claim commands was rerun independently from the demo sandbox; all passed. The post-deploy `studio-checkout` claim is run after deployment.
- The update probe showed **A fresh version is ready**, activated `aes-shell-v8`, and removed the old cache. `verify-url.sh` on `/demo` returned 200 with `lang=en`, the demo title, one H1, a main landmark, complete image alternatives, labeled buttons, and no console/page errors. Evidence and desktop/390 px screenshots are in `.factory/evidence/repair-5-local/`.
- Local Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,356 ms, TBT 52 ms, CLS 0. The JSON report is `.factory/evidence/repair-5-local/lighthouse.json`.
- Package/consumer, sign-in/Entra, and first-party backend checks are not applicable: this is a static PWA with no published package, login, or backend.

### Deployment and live verification — 2026-08-28 UTC

- Commit `393c8de` was pushed to `origin/main` and deployed with the factory static deployment configuration to the existing Azure Static Web App `sf-animatic-event-strip` in Central US. The live custom domain is <https://animatic-event-strip.sociobot.in> and reports `Version 1.0.0, repair 5`.
- Every one of the 22 served production files rebuilt from `dist/` matches the custom-domain response by SHA-256; `staticwebapp.config.json` is correctly excluded because Azure consumes it rather than serving it. `/`, `/demo`, `/privacy/`, and `/terms/` return 200; an unknown route returns the designed HTTP 404.
- Live `verify-url.sh` on `/demo` passed with the expected title, `lang=en`, one H1, main landmark, complete image alternatives, labeled buttons, and no console/page errors. Live Chromium checks passed 3/3 for demo axe WCAG 2 A/AA, legal/404 route accessibility, and keyboard focus/repeated event movement. Live 390×844 checks passed 4/4 for the sample demo, offline reload, no body overflow, and all named 44 px targets.
- Live Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,052 ms, TBT 4 ms, CLS 0. Evidence is in `.factory/evidence/repair-5-live/`. Live root policy retains HSTS, restrictive CSP including `frame-ancestors 'none'`, `X-Frame-Options: DENY`, Permissions Policy, `nosniff`, and strict-origin referrer policy.
- The final `studio-checkout` live-policy claim passed: the hosted checkout returned 303 to Dodo, the verification endpoint rate-limited with 429 and numeric `Retry-After: 4`, the live product returned 200, and its hashed asset was immutable. Two earlier checkout probes briefly returned a 500 from the external Sociobot billing service; the immediately repeated final full claim command passed without any product-code change. The verifier’s original AES-QA-501/AES-QA-502 blockers are repaired and covered locally/live where applicable.

### Remaining research gap

The brief’s five-person handoff pilot has not been run. Its ambiguity success measure remains product research, not a release claim.

## Independent verification 5 — FAIL (release blocked)

Candidate `b6137917279fd65d9556713d718c2874399822d6` was freshly verified on 2026-08-28 UTC at <https://animatic-event-strip.sociobot.in>. The live deployment matches all 22 rebuilt deployable files byte-for-byte. The cold first-read and one-click isolated demo pass; all 13 declared claim commands pass after `npm ci`; install, unit, lint, type, build, browser, audit, accessibility, mobile, PWA offline/update, response-policy, checkout, and performance gates are green.

The release verdict is nevertheless **FAIL**:

- **High AES-QA-501:** public promises that licenses are checked at most daily, verification responses are not service-worker cached, invalid/revoked licenses lock paid access, and licenses can be restored across devices are absent from `.factory/claims.json` and have no exactly tagged sandbox tests. Existing tests cover cached access, paid downloads, and checkout, but not these lifecycle promises. The claims contract makes unlisted claims release-blocking.
- **Medium AES-QA-502:** Privacy says “project history” is stored in IndexedDB, but the data layer overwrites one current project under the single `active` key and provides no history. The disclosure is inaccurate.

Independent product checks otherwise passed: a seven-event live flow exported correct Adapter JSON/CSV; last-frame and 216,000-frame boundaries worked; invalid range, duration, and malformed import paths recovered without data loss; normal planning made only same-origin requests; demo storage remained isolated; keyboard focus and 390 px targets passed; fresh Axe runs found zero violations; the live installed demo reloaded offline under `aes-shell-v7`; and a fresh API burst returned 30×200 followed by 429 with `Retry-After: 4`.

Lighthouse 13.4.1 mobile on live `/demo`: Performance 97, Accessibility 100, Best Practices 100, SEO 100; LCP 1,056 ms, TBT 183 ms, CLS 0.0136. Initial JS is 28,640 B (10,215 B gzip), CSS 20,756 B (5,413 B gzip), fonts 0 B, and the mobile hero is 36,138 B.

Full commands, evidence, and remedies are in `.factory/verification-5.md` and `.factory/evidence/verification-5/`. No product code was changed.

## Release-blocking product-QA repair 4 — PASS locally and live

Work order `animatic-event-strip-repair-4` repairs the release blocker in verifier commit `7890ad4a7af3ce674a26482d4b3f24408ab17d8d` for candidate `a1d93ec3661e3ddb83d43c513a9fd406f17f0999`. The artifact remains a static, local-first PWA.

### Finding disposition

- **AES-QA-401 — repaired and covered:** Playwright now runs `npm run build` before `vite preview`, with a 60-second server allowance. Every declared local claim command therefore creates its own production artifact after `npm ci`; it no longer depends on a pre-existing `dist/` directory or server. A release-policy regression asserts the exact build-before-preview command and ordering.
- **Live PWA install edge found during the required sweep — repaired and covered:** Azure intentionally returns HTTP 404 for `/404.html`. Pre-caching that response through `cache.addAll()` rejected the entire fresh service-worker install. The status-coded document is no longer in the precache list, unknown URLs still return the designed 404, and `aes-shell-v7` activates cleanly. The release test protects the 404 policy/precache boundary, and the update probe protects activation and old-cache removal.
- The privacy claim tests now derive the active page origin instead of hardcoding the local preview origin. The same assertions therefore prove same-origin-only behavior locally and on the production domain.
- Shared home, Privacy, Terms, and 404 footers identify this release as `Version 1.0.0, repair 4`. The copy audit and exact shell regression were updated with it.

### Clean local verification — 2026-08-28 UTC

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run test:pwa-update
npm audit --omit=dev
/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo .factory/evidence/repair-4
```

- The clean install added 140 packages with 0 vulnerabilities. Vitest passed 12/12 unit and release-policy tests. ESLint and TypeScript passed.
- Before testing each of the 12 local claim commands, the prior `dist/` was moved aside and no preview server was running. All 12 commands independently built the product and passed from that verifier precondition. The `sample-demo` command was also run first immediately after `npm ci` with no `dist/` present.
- The final production build contains `dist/index.html` at its root. Initial JavaScript is 28,640 bytes / 10,210 bytes gzip; CSS is 20,756 bytes / 5,410 bytes gzip; fonts are 0 bytes; the mobile hero is 36,138 bytes.
- Playwright 1.58.2 passed 35 tests with 3 intentional cross-profile skips across desktop Chromium and 390×844 mobile. Coverage includes complete workflows, malformed import recovery, demo isolation, keyboard repeat and dialog focus return, axe WCAG 2 A/AA, 44 px targets, no body overflow, privacy interception, cached licensing, and offline reload.
- The update probe displayed **A fresh version is ready**, activated `aes-shell-v7`, reloaded, and removed the old shell cache. The local URL smoke check found HTTP 200, the demo title, `lang=en`, one H1, a main landmark, no missing alternatives, no unlabeled buttons, and no console/page errors.
- Local Lighthouse 13.4.1: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,205 ms, TBT 0 ms, CLS 0.0136. Desktop and 390 px screenshots in `.factory/evidence/repair-4/` were visually reviewed with no clipping, collisions, or horizontal body overflow.
- Package-consumer, sign-in/Entra, backend health, concurrency, and backend persistence checks are not applicable: this is a static PWA with no published package, sign-in, or first-party backend.

### Deployment and live verification

- Repair commits `6dd44c7` and `a25dc73` were pushed to `origin/main`. Azure Static Web Apps CLI 2.0.10 deployed the final `dist/` to production app `sf-animatic-event-strip` in resource group `sociobot` (default host `salmon-coast-047047110.7.azurestaticapps.net`). The custom domain is <https://animatic-event-strip.sociobot.in>.
- All 22 deployable files match the final local `dist/` byte-for-byte by SHA-256. Azure consumes `staticwebapp.config.json`, so it is excluded from the served-file comparison. The live footer reports repair 4.
- The full live desktop/mobile run passed 32 browser checks before exposing the service-worker install edge. After the v7 redeploy, the three affected final checks passed: cached Studio access on desktop and mobile, plus offline installed-demo reload on mobile. The final live URL smoke check has zero console/page errors and no basic accessibility failures.
- The `studio-checkout` claim passed: hosted checkout returned 303, license verification returned 429 with numeric `Retry-After: 4`, the live product returned 200, and its hashed asset is immutable for one year. Root responses retain HSTS, restrictive CSP/anti-framing, Permissions Policy, `nosniff`, and strict-origin referrer policy. The designed unknown route returns HTTP 404.
- Live Lighthouse 13.4.1: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,056 ms, TBT 74 ms, CLS 0. Evidence is in `.factory/evidence/repair-4/lighthouse-live.json` and `.factory/evidence/repair-4/live/`.

### Remaining research gap

The brief’s five-person handoff pilot has not been run. Its ambiguity success measure remains product research, not a release claim.

## Release-blocking product-QA repair 3 — PASS locally

Work order `animatic-event-strip-repair-3` repairs every release blocker in verifier commit `d8b60c6e0ebd33537aef2568d68e907f24bbdeff` for candidate `bf3323eb1fb9922deb2e7f7bb1670950d61c1d60`. The artifact remains a static, local-first PWA.

### Finding disposition

- **AES-QA-301 — repaired and covered:** keyboard movement now restores focus to the event node created by each timeline render. The exact regression focuses **Enable player input**, presses Right twice and Shift+Right once, asserts focus after every render, and confirms the persisted range after reload.
- **AES-QA-302 — repaired and covered:** opening an existing event no longer replaces its trigger before the dialog opens. A dialog close handler also resolves the current event node by stable ID. The regression opens the event with Enter, checks initial field focus, closes with Escape, and checks focus on the opener. The unchanged add-event return path is checked too.
- **AES-QA-303 — repaired and covered:** `.factory/claims.json` now has 13 unique claims with exactly one matching `@claim:<id>` tag each. New sandbox tests cover all six FPS choices, WAV decoding/waveform/persistence/aligned playback, Godot 4 and Unity 6 source downloads, print invocation, and the absence of cookies, remote fonts, analytics, third-party runtime scripts, and cross-origin requests. The PWA and import claims now assert install-manifest/service-worker state and malformed-file recovery.
- **AES-QA-304 — repaired and covered:** `public/404.html` is a designed cutting-room 404 with the shared header, navigation, footer, and a return action. Static Web Apps uses its native 404 response override to keep the status while serving that document. The release-policy test asserts the exact response override.
- **AES-QA-305 — repaired and covered:** home, demo, Privacy, Terms, and 404 now use route-specific titles/canonicals, Open Graph and Twitter metadata where indexable, a 1200×630 social image derived from the original art, and a 180×180 Apple touch icon. Legal and missing routes use the shared skip link, wordmark, navigation, main landmark, and footer. Every footer names Param Factory and version `1.0.0, repair 3`.

### Local verification evidence — 2026-08-28 UTC

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run test:pwa-update
npm audit --omit=dev
node -e "const c=require('./.factory/claims.json'); for (const x of c.filter(x=>x.id!=='studio-checkout')) console.log(x.test)" | while IFS= read -r claim_cmd; do bash -lc "$claim_cmd" || exit 1; done
/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo .factory/evidence/repair-3
```

- Clean install: 140 packages and 0 vulnerabilities. Unit/release tests: 11/11. ESLint and TypeScript: clean.
- Production build: `dist/index.html` at the root; initial JavaScript 28,640 bytes / 10,215 bytes gzip; CSS 20,756 bytes / 5,413 bytes gzip; fonts 0 bytes; mobile hero 36,138 bytes.
- Playwright 1.58.2: 35 passed / 3 intentional profile skips across desktop Chromium and 390×844 mobile. The five verifier findings, keyboard focus, dialog return, legal/404 route shell, claims, workflows, persistence, exports, offline reload, mobile geometry, overflow, and axe WCAG 2 A/AA all pass.
- All 12 local claim commands passed independently from fresh browser contexts. The 13th claim is the post-deploy Sociobot checkout/response-policy/identity gate.
- The dedicated PWA update probe installed a temporary old worker, showed **A fresh version is ready**, activated **Update app**, reloaded under `aes-shell-v6`, and removed the old cache.
- The Azure Static Web Apps 2.0.7 emulator returned 200 for `/`, `/demo`, `/privacy`, `/terms`, `sw.js`, and the manifest; `/qa-definitely-missing-repair-3` returned HTTP 404 with the designed page.
- `verify-url.sh` on `/demo`: HTTP 200; title `Demo — Animatic Event Strip`; `lang=en`; one H1; main present; zero missing image alternatives; zero unlabeled buttons; zero console/page errors.
- Local Lighthouse 13.4.1 produced a complete report before the known post-report Chromium exit: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,357 ms, TBT 83 ms, CLS 0.014.
- Visual review of `.factory/evidence/repair-3/demo-desktop.png`, `demo-mobile-390.png`, and `404-mobile-390.png` found no clipping, collisions, horizontal body overflow, or unreadable controls.

### Deployment and live verification

- Repair commits `0c1db84`, `baca888`, and `c933583` were pushed to `origin/main`. Azure Static Web Apps CLI 2.0.7 deployed the final `dist/` to the production resource `sf-animatic-event-strip` in resource group `sociobot` (default host `salmon-coast-047047110.7.azurestaticapps.net`).
- The custom domain <https://animatic-event-strip.sociobot.in> serves the repair. All 22 deployable files match the final local `dist/` byte-for-byte by SHA-256; Azure consumes `staticwebapp.config.json`, so it is excluded from public-file comparison.
- Live `/`, `/demo`, `/privacy`, `/privacy/`, `/terms`, and `/terms/` return 200. `/qa-definitely-missing-repair-3` returns HTTP 404 with the designed missing-page body. The social image, Apple touch icon, manifest, and `aes-shell-v6` worker all return 200.
- Live browser regressions for AES-QA-301 through AES-QA-305 passed 4/4. The demo, Privacy, Terms, and missing page had zero serious/critical axe findings, and both exact focus-return paths passed against the custom domain.
- Live `verify-url.sh`: HTTP 200; correct demo title, `lang=en`, one H1, main landmark, zero missing alternatives, zero unlabeled buttons, and zero console/page errors.
- The declared `studio-checkout` claim passed live: checkout returned 303 to Sociobot/Dodo; license verification reached HTTP 429 with numeric `Retry-After: 4`; the live root and immutable asset policy returned 200.
- Live response headers include HSTS, restrictive CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, Permissions Policy, `nosniff`, and strict-origin referrer policy.
- Live Lighthouse 13.4.1 produced its report before the same post-report Chromium exit: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,056 ms, TBT 21 ms, CLS 0.014.

### Remaining research gap

The brief’s five-person handoff pilot has not been run. Its ambiguity success measure remains product research, not a release claim.

## Independent verification 3 — FAIL (release blocked)

Candidate `bf3323eb1fb9922deb2e7f7bb1670950d61c1d60` was independently tested on 2026-08-28 at <https://animatic-event-strip.sociobot.in>. The live deployment matches all 19 served files rebuilt from this exact commit. The cold first-read and one-click isolated demo pass, all nine `.factory/claims.json` commands pass, and install/unit/lint/type/build/e2e/audit gates are clean. The editor, media waveform, import/export, min/max frames, persistence, checkout, cached license, offline reload, service-worker update, response policy, caching, accessibility automation, 390 px layout, and performance budgets all passed fresh checks.

The release verdict is nevertheless **FAIL**:

- **High AES-QA-301:** moving a focused timeline event re-renders it and drops focus to `<body>`. One Right press works; a second does nothing, so keyboard users cannot repeatedly frame-step an event.
- **High AES-QA-302:** closing an existing event's edit dialog returns focus to `<body>` rather than the event that opened it.
- **High AES-QA-303:** public claims for browser-audio preview, the paid Godot/Unity/print outputs, and the broader no-analytics/cookies/fonts/scripts promise have no matching entries and exactly tagged sandbox tests in `.factory/claims.json`. The supplied claims contract makes unlisted claims release-blocking.
- **Medium AES-QA-304:** an unknown URL returns the normal home shell with HTTP 200; the required designed 404 does not exist.
- **Low AES-QA-305:** required Open Graph/Twitter/social image/Apple-touch metadata is absent; legal routes lack the shared skip/header/footer skeleton; no footer includes “Built by Param Factory” and a build ID.

Fresh API threshold: requests 1–30 returned 200; request 31 returned 429 with `Retry-After: 4`. Fresh Lighthouse mobile: 93 Performance / 100 Accessibility / 100 Best Practices / 100 SEO; LCP 1,059 ms, TBT 318.5 ms, CLS 0.0136. Initial JS is 28,392 B (10,146 B gzip), CSS 20,717 B (5,378 B gzip), fonts 0 B, and mobile hero 36,138 B.

Full commands, evidence, reproduction details, and severity-ranked findings are in `.factory/verification-3.md` and `.factory/evidence/verification-3/`. No product code was changed during verification.

---

## Release-blocking product-QA repair 2 — PASS (deployed)

Work order `animatic-event-strip-repair-2` repairs every blocker recorded in verifier commit `7c859f8c1a1110429c4496027094314f872ffc3d` for candidate `ae964e0113269aecfbdf888a3f239e27f200a280`. The product remains a static, local-first PWA. Repair commits: `a56bc16` and `9624e95`.

### Finding disposition

- **AES-QA-201 — repaired and covered:** `.factory/claims.json` now declares nine observable claims. Each ID occurs in exactly one `@claim:<id>` test, and `tests/release.test.ts` fails for missing, duplicate, or unreferenced tags. The eight local claim commands passed independently from fresh browser contexts. The hosted-checkout claim remains in the existing live-policy gate and is run after deployment.
- **AES-QA-202 — repaired and covered:** the first-screen **Try it with sample data** link and `/demo` open a seeded 10-second Rain Gate handoff with six realistic events. Demo reads and writes only `demo:animatic-event-strip`; it does not open the real project database or read a stored license. **Reset demo** restores the seed. **Start for real** deletes the demo record and reveals the unchanged real project. `.factory/demo.md` documents the entry point, sample, reset, exit, and namespace. The sample, isolation, reset, discard, and offline paths are browser-tested.
- **AES-QA-203 — repaired and covered:** the single H1 is now **Plan animation events before engine work.** The next sentence names solo 2D animators and small game teams. The primary action explains that it loads a filled 10-second strip, followed by the privacy, offline, and price facts. The exact first read is asserted on desktop and 390 px mobile. `.factory/copy-audit.md` records word counts and terminology; no audited sentence exceeds 22 words.

The update flow was also made deterministic while exercising the complete PWA gate. A waiting service worker now receives `SKIP_WAITING` only after **Update app** is chosen; `controllerchange` then reloads the page. A forced v5-to-v6 probe displayed **A fresh version is ready** and accepted the update action. The shipped cache remains `aes-shell-v5`.

### Local verification evidence — 2026-08-28 UTC

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm audit --omit=dev
node -e "const c=require('./.factory/claims.json'); for (const x of c.filter(x=>x.id!=='studio-checkout')) console.log(x.test)" | while IFS= read -r claim_cmd; do bash -lc "$claim_cmd" || exit 1; done
/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo .factory/evidence/repair-2
```

- Clean install: 140 packages, 0 audit vulnerabilities. Unit/release tests: 9/9. ESLint and TypeScript: clean.
- Production build: `dist/index.html` at the root; initial JS 28,392 bytes / 10,158 bytes gzip; CSS 20,717 bytes / 5,407 bytes gzip; no font files; mobile hero WebP 36,138 bytes.
- Playwright 1.58.2: 23 passed / 3 intentional profile skips across desktop Chromium and 390×844 mobile. Coverage includes the nine claim paths, real/demo storage isolation, reset/exit, import/export contents, persistence, offline shell and cached license, keyboard focus and movement, 44 px targets, body overflow, and axe WCAG 2 A/AA.
- Every local claim command in `.factory/claims.json` passed independently. Project JSON round-tripped seven events; Adapter JSON reported `animatic-event-strip/adapter` v1 with six events; CSV contained its BOM, header, and six data rows; privacy interception observed only `http://127.0.0.1:4173`.
- Local `verify-url.sh`: HTTP 200, title `Demo — Animatic Event Strip`, `lang=en`, one H1, main landmark, 0 images missing alternatives, 0 unlabeled buttons, and 0 console/page errors. Desktop and 390 px visual review found no body overflow, collision, clipping, or unreadable controls.
- Lighthouse 13.4.1 mobile completed its report before the known post-audit Chromium crash: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,366 ms, TBT 0 ms, CLS 0.014. A blocking, same-origin route marker reserves the demo banner before first paint and sets the demo canonical URL. INP is not represented as measured by a lab navigation.
- Package/consumer and first-party backend checks do not apply: this artifact is an application with no published package and no first-party backend. Response-policy, checkout, rate-limit, deployment identity, and live privacy checks are run against the deployed custom domain.

### Final deployment and live evidence

- Factory static deployment `b73647df-59fd-4af8-a8a1-6c5cd20ea35e` succeeded in the existing Central US Azure Static Web App. The custom domain returned HTTPS 200.
- All 19 served files in the final `dist/` matched the live custom-domain responses byte-for-byte by SHA-256; `staticwebapp.config.json` was excluded because Azure consumes it rather than serving it.
- The exact `@claim:studio-checkout` live command passed: checkout HTTP 303 to the Dodo-hosted session, verification HTTP 429 with `Retry-After: 4`, live product HTTP 200, and immutable hashed assets.
- Live policy includes HSTS, restrictive CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, Permissions Policy, Referrer Policy, and `nosniff`. Hashed assets return one-year immutable caching; the demo shell remains revalidatable.
- Live `/demo` at 390×844 loaded six sample events into only `demo:animatic-event-strip`, used only the product origin, had no console/page errors or body overflow, and exposed the `/demo` canonical URL. Offline reload retained the sample and displayed the offline banner with an active controller.
- Live axe WCAG 2 A/AA found 0 serious/critical violations. The first Tab reached the skip link with a 3 px cyan outline; reduced-motion transitions measured `0.00001s`. `verify-url.sh` again reported `lang=en`, one H1, main, complete image alternatives, labeled buttons, and no browser errors.
- Final live Lighthouse 13.4.1 mobile completed its report before the same post-audit Chromium crash: Performance 94, Accessibility 100, Best Practices 100, SEO 100; LCP 1,058 ms, TBT 280 ms, CLS 0.014. The pre-paint route marker repaired the initially observed live CLS of 0.192.

### Known research gap

The five-person handoff pilot in the researched brief has not been run. The success measure about ambiguous implementation questions therefore remains user-research work, not a product or release-gate claim.

---

## Independent verification 2 — FAIL (release blocked)

Candidate `ae964e0113269aecfbdf888a3f239e27f200a280` at <https://animatic-event-strip.sociobot.in> was freshly verified on 2026-08-28 UTC. The live deployment matches all 18 deployable files rebuilt from this exact commit, and its repaired checkout, rate limit, security headers, caching, editor flow, PWA offline reload/update, accessibility baseline, and quality gates pass.

It is nevertheless **not releasable**. The required `.factory/claims.json` is missing (therefore no required claim tests could be run); no `@claim:` test tags exist; there is no documented or isolated sample-data demo; `/demo` is just the normal empty editor; and the cold first screen neither names the target users nor offers **Try it with sample data**. These are release-blocking acceptance defects. See `.factory/verification-2.md` for exact commands, output, evidence, and the full severity-ranked report.

Required next work: add the demo sandbox and documentation, list and test every live claim against it, then rewrite the first screen in plain words and re-run independent verification.

---

## Release-blocking verification repair — PASS

Work order `animatic-event-strip-repair-1` repaired the findings recorded in verifier commit `faba9b140f8d742e77f42a5a2fea708c0c61572d` for candidate `89437ed68df24ca0a513367ad7e7ec46001ef905`. The artifact remains a static, local-first PWA at <https://animatic-event-strip.sociobot.in>. Product repair commit: `b87f80a`.

### Finding disposition

- **AES-QA-001 — repaired upstream and covered:** the Sociobot product is registered/enabled. A fresh checkout request now returns HTTP 303 to `https://checkout.dodopayments.com/session/...`. `tests/live-policy.mjs` fails if checkout stops returning a hosted-payment redirect.
- **AES-QA-002 — repaired upstream and covered:** a controlled 220-request reproduction before the artifact repair produced 31 HTTP 200 and 189 HTTP 429 responses. The post-deploy contract test again reached HTTP 429 and received numeric `Retry-After: 4`; it fails if 200 requests can pass without throttling or the header is omitted.
- **AES-QA-003 — repaired in CSS and covered in-browser:** the wordmark, rename control, Privacy link, and Terms link now have explicit 44 px minimum geometry. At exactly 390×844 they measured 125.20×44, 183.20×44, 47.08×44, and 44×44 CSS px. The four exact targets are asserted in Playwright.
- **AES-QA-004 — repaired in deployment policy and covered locally/live:** `public/staticwebapp.config.json` now sends a restrictive resource CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, and a Permissions Policy disabling camera, geolocation, microphone, payment, and USB. The live browser loaded with no CSP or console errors.
- **AES-QA-005 — repaired at the asset pipeline and covered locally/live:** Vite now emits hashed JS/CSS instead of an inlined shell; artwork, icons, and legal CSS use content-addressed filenames. `/assets/*` and `/icons/*` return `Cache-Control: public, max-age=31536000, immutable`; update-sensitive HTML, manifest, legal routes, and service worker remain revalidatable.

During repeated offline verification, a pre-existing edge was also found and repaired: Vite's `crossorigin` asset requests could miss otherwise-present Cache Storage entries because of `Vary: Origin`. Service-worker cache reads now ignore that irrelevant variance, the shell is versioned `aes-shell-v4`, and five consecutive parallelized mobile offline reloads passed. A two-version local update test observed **A fresh version is ready**, activated **Update app**, reloaded, and left only `aes-shell-v4`.

### Exact verification evidence

Clean verification on 2026-08-28 UTC:

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
npm run test:e2e
npm run test:live-policy
```

- `npm ci`: 140 packages; 0 vulnerabilities. `npm test`: 7/7. ESLint and TypeScript: clean. Production build: PASS, with `dist/index.html` at the root.
- Playwright 1.58.2: 7 passed / 3 intentional cross-profile skips across desktop and an exact 390×844 mobile viewport. The workflow covers creation, edit, IndexedDB persistence, export, axe, offline reload, body overflow, and the four verifier-named touch targets.
- Accessibility/keyboard: axe WCAG 2 A/AA found 0 serious or critical issues locally and live. `/opt/fleet/lib/verify-url.sh` found HTTP 200, `lang=en`, one `<h1>`, `<main>`, 0 missing image alternatives, 0 unlabeled buttons, and 0 console errors. First Tab exposes the skip link with a solid focus outline; reduced-motion transition duration was `0.00001s`.
- Privacy: a fresh free-flow browser session made no cross-origin requests and produced no browser errors. No analytics, remote fonts, ads, or third-party runtime scripts were introduced. The optional checkout/license requests remain the documented exception.
- Performance: production JS 25.36 KB (9.22 KB gzip), CSS 19.67 KB (5.17 KB gzip), no fonts, mobile artwork 36.14 KB. Lighthouse 12.8.2 locally scored 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO (LCP 1.4 s, TBT 0 ms, CLS 0); live scored 100/100/100/100 (LCP 1.1 s, TBT 0 ms, CLS 0).
- Live deployment: Azure Static Web Apps deployment `46b996ae-afae-4667-8cfd-04e9f69bebfd` succeeded. All 18 public files in `dist/` (excluding the consumed SWA configuration file) matched their live responses byte-for-byte by SHA-256. HTTPS/HSTS, CSP, anti-framing, Permissions Policy, immutable asset caching, manifest, legal routes, IndexedDB persistence, offline shell, and cache `aes-shell-v4` were verified on the custom domain.
- Package/consumer and first-party backend tests are not applicable: this artifact is an application, not a published package, and has no first-party backend. The two billing checks target the documented external Sociobot API contract.

### Remaining product research

- The five-person handoff pilot in the brief has not yet been run; the “fewer than one ambiguous implementation question per scene” success measure still needs real-user validation.
- Audio decoding/playback remains dependent on browser codec support. Unsupported files stay stored/exportable and use the neutral waveform fallback.

The original independent verifier report remains unchanged in `.factory/verification.md` as historical evidence of the repaired candidate failure.

---

## Original builder handoff

Work order: `animatic-event-strip-build-1`

Completed: 2026-08-28

## What shipped

- A production Vite + TypeScript PWA in `dist/`, with its JavaScript and CSS inlined into the app shell for resilient offline startup.
- A frame-accurate, horizontally scrollable event strip for board-image ranges, local audio clips with calculated waveform snippets, and semantic visual-beat, sound-cue, interaction-window, and implementation-note markers.
- Project timing at 12/15/24/25/30/60 fps, timecode transport, click scrubbing, playback with aligned local audio, zoom, editing, named destructive confirmation, and keyboard frame movement.
- IndexedDB persistence for the active project and media. State survives refresh, tab close, and PWA installation; the save state is visible and failures tell the user to export a backup.
- Validated complete project import/export (`aes-project-1`, embedded media), lean adapter JSON (`animatic-event-strip/adapter` v1), and UTF-8 CSV. Core data portability is free.
- A $12 one-time Studio Pack using the Sociobot billing contract: hosted checkout link, query-token capture, local license restoration, optimistic cached unlock, daily verification, offline behavior, and revoked-license fallback. Paid downloads are Godot 4 GDScript, Unity 6 C#, and the print handoff sheet.
- Install manifest, 192/512/maskable icons, versioned service-worker shell caching, network-first navigation, cache-first art/assets, offline notice, fallback page, and update toast.
- Responsive 390px treatment, native dialogs and controls, designed focus states, reduced-motion overrides, safe-area spacing, legal pages, and no analytics/CDNs/runtime third parties.
- Original cinematic cutting-room art generated specifically for the product, reviewed and optimized to 36 KB mobile / 74 KB desktop WebP. Prompt, model, date, and license provenance are in `.factory/design.md` and `assets/src/`.

## Verification

Run from a clean checkout:

```sh
npm install
npm test
npm run build
npm run test:e2e
```

Verified locally on 2026-08-28:

- `npm test`: 5/5 Vitest tests pass (timecode, frame ranges, validation, adapter JSON, CSV).
- `npm run test:e2e`: 6 pass / 2 intentional profile skips. The same workflow is run on desktop and Pixel 5 profiles; mobile alone owns the offline-PWA and 390px-only assertions. Create, local-media attach, edit, IndexedDB reload, JSON export, offline reload, and mobile dialog paths pass.
- Axe WCAG 2 A/AA: zero serious or critical violations on desktop and mobile.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200; no console/page errors; `lang=en`; one `h1`; `main` present; 0 images missing alt; 0 unlabeled buttons. Report: `.factory/evidence/verify.json`.
- Lighthouse 12.8.2, mobile/default throttling against the production build: **Performance 100, Accessibility 100, Best Practices 100, SEO 100**. LCP 1.1 s, TBT 0 ms, CLS 0.014.
- Initial transfer: 60.45 KB app shell / 18.74 KB gzip, including 25.36 KB uncompressed JavaScript and 19.54 KB CSS; LCP WebP 36 KB. All are below the 200 KB JS, 50 KB CSS, 120 KB fonts, and 300 KB hero budgets. No font files ship.
- `npm audit --omit=dev`: 0 vulnerabilities.

## Known gaps / next steps

- The factory still needs to register the test and live billing products and exercise a real checkout/return token; no product ID is hardcoded. License verification behavior is implemented and degrades quietly offline.
- A five-person handoff pilot has not yet been run, so the brief’s “fewer than one ambiguous implementation question per scene” success measure remains to be validated with users.
- Audio decoding/playback depends on browser codec support. Unsupported files remain stored/exportable and receive a neutral placeholder waveform.
- This focused v1 keeps one active local scene. Multiple projects, cloud sync, engine execution, tweening, and animation authoring remain intentional non-goals.
# Independent verification 4 — FAIL (release blocked)

Candidate `a1d93ec3661e3ddb83d43c513a9fd406f17f0999` was independently verified on 2026-08-28 UTC at <https://animatic-event-strip.sociobot.in>. **FAIL:** from a truly clean clone, after `npm ci` and with neither `dist/` nor a port-4173 server present, each of the 12 local demo claim commands in `.factory/claims.json` exited 1 after `Timed out waiting 30000ms from config.webServer.` The declared Playwright server runs `vite preview`, which requires an artifact the commands do not create. The sole live-only claim passed (checkout 303; license verification 429 with numeric `Retry-After: 4`). The claims contract makes this a release blocker even though all 12 local claim paths pass after an explicit `npm run build`.

Otherwise, `npm test` (11/11), typecheck, lint, exact production build, full e2e (35 pass/3 expected skips), PWA update, cold first-read/demo, normal/boundary/invalid-recovery workflows, live Axe, keyboard/mobile/reduced-motion, privacy/network checks, headers, caching, links, offline reload, deployment identity, and Lighthouse (96/100/100/100; LCP 1,080 ms; CLS 0.0136) passed. The live root HTML is SHA-256-identical to the fresh candidate build. Full evidence and the remedy are in `.factory/verification-4.md`. No product code was changed during verification.
