# Animatic Event Strip — handoff

## Release-blocking product-QA repair 2 — local PASS

Work order `animatic-event-strip-repair-2` repairs every blocker recorded in verifier commit `7c859f8c1a1110429c4496027094314f872ffc3d` for candidate `ae964e0113269aecfbdf888a3f239e27f200a280`. The product remains a static, local-first PWA. Deployment and final live-policy evidence are recorded below after the repair commit.

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
