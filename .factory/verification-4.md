# Animatic Event Strip — independent verification 4

**Verdict: FAIL — release blocked**

- Candidate: `a1d93ec3661e3ddb83d43c513a9fd406f17f0999`
- Live URL: <https://animatic-event-strip.sociobot.in>
- Verified: 2026-08-28 UTC
- Work order: `animatic-event-strip-verify-4`
- Artifact: local-first PWA; no sign-in, published library/CLI, or first-party backend

## Release blocker

### High — AES-QA-401: every local declared claim command fails from a clean clone

The mandatory first gate was run in a new clone with only `npm ci` completed. No `dist/` directory and no process listening on port 4173 existed. Each declared local claim command exits 1 after Playwright's configured 30-second web-server timeout:

```text
Error: Timed out waiting 30000ms from config.webServer.
```

`playwright.config.ts` starts `npm run preview -- --host 127.0.0.1`; `vite preview` requires a production `dist/` artifact, but the declared commands do not build it. This violates the required clean-clone, demo-entry claim gate. The 12 affected claims are `sample-demo`, `editor-workflow`, `fps-options`, `audio-preview`, `local-storage-only`, `runtime-privacy`, `offline-reload`, `project-json-roundtrip`, `adapter-json-v1`, `csv-export`, `cached-license-offline`, and `studio-outputs`.

The live-only `studio-checkout` command passed (checkout 303; rate-limit 429 with `Retry-After: 4`; live product 200; immutable asset policy). After an explicit `npm run build`, all 12 local claims also passed individually. That confirms the product behavior, but does not repair the clean-command failure: the claims contract explicitly makes any failing claim command release-blocking.

## Mandatory first gates

### Cold first-read — PASS

Fresh 390 px live load returned 200 with no console/page errors. The first screen says:

- **What:** “Plan animation events before engine work.”
- **For whom:** “For solo 2D animators and small game teams planning frames, sound cues, and input windows before engine work.”
- **First action:** “Try it with sample data,” with “Loads a filled 10-second strip. The demo never opens or changes your project.”

The local-device, offline, and $12 one-time-price facts are also visible. `/demo` is a one-click isolated sample workspace with persistent “Demo — sample data, nothing is saved,” Reset demo, and Start for real controls.

### Claims evidence

| Claim group | Clean-clone command | Result | Follow-up evidence |
| --- | --- | --- | --- |
| 12 local demo claims listed above | Exact `npm run test:e2e -- --grep @claim:<id> --project=<profile>` | **FAIL** — server timeout before test starts | All pass only after an explicit production build. |
| `studio-checkout` | `npm run test:live-policy -- --claim @claim:studio-checkout` | PASS | 303 hosted checkout; 429 rate limit; numeric Retry-After 4; live 200; immutable asset. |

## Quality gates after an explicit production build

| Gate | Result |
| --- | --- |
| `npm ci` | PASS — 140 packages, 0 vulnerabilities |
| `npm test` | PASS — 11/11 Vitest tests |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — `dist/` produced; JS 28.64 KB (10.21 KB gzip), CSS 20.76 KB (5.41 KB gzip) |
| `npm run test:e2e` | PASS — 35 passed, 3 expected profile skips |
| `npm run test:pwa-update` | PASS — update toast shown, v6 activated, old cache removed |

## Independent live functional QA — PASS

- Normal demo flow: loaded the six-event Rain Gate sample, added an interaction marker, and exported Marker CSV.
- Boundary/recovery: an equal start/end range displayed “Use a range inside frames 0–239; the end frame is exclusive.” Correcting it to frames 239–240 saved the one-frame event. Malformed JSON displayed its parsing error and retained the sample unchanged.
- Privacy: editor/demo flow made only same-origin requests and raised no console/page errors. The optional license endpoint was not touched during normal planning.
- Keyboard/mobile: first Tab reached the skip link with a 3 px focus ring. Repeated Right then Shift+Right retained event focus and moved the selected event from F108–144 to F109–145 then F119–155. At 390×844 the body width equaled the viewport, and reduced-motion transition duration was `0.00001s`.
- Accessibility: `verify-url.sh` on live `/demo` found title, `lang=en`, one H1, main landmark, no images missing alternatives, no unlabeled buttons, and no console/page errors. Fresh Axe WCAG 2 A/AA checks found zero serious/critical violations on `/demo`, `/privacy/`, `/terms/`, and the designed 404 route. The 404 navigation itself reports its expected HTTP 404 in the browser console.
- PWA: the claim test reloaded the demo and sample offline on the mobile profile; the independent update probe passed.
- Links/routes: internal routes returned 200; hosted checkout returned 303; the designed unknown route returned 404 with a way home.

## Live deployment, policy, and performance — PASS

- Fresh candidate `dist/index.html` and the live root HTML have identical SHA-256 `d5c29bf0bd2fc6283091a11e8e5e5d2dedf8c38808fe256824fca3cfeb785d6e`; asset references match exactly. The deployment therefore matches this candidate.
- Root policy includes HSTS, CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict-origin referrer policy, and a restrictive Permissions Policy. Hashed JS returns `Cache-Control: public, max-age=31536000, immutable`; HTML, manifest, and service worker are revalidatable.
- Lighthouse 13.4.1 mobile on live `/demo`: Performance 96, Accessibility 100, Best Practices 100, SEO 100; LCP 1,080 ms, TBT 246 ms, CLS 0.0136. Lab INP was unavailable. Bundle/font/image budgets pass.
- No sign-in is present, so the Entra tenant requirement is not applicable. No library/CLI package or first-party backend exists, so consumer-install, health, concurrency, and persistence-boundary backend checks are not applicable.

## Required remedy

Make each claim command self-sufficient from a clean clone (for example, run the production build before the Playwright preview server, or use a test server that builds the app) and rerun every declared claim command from a clean clone with no pre-existing server. Do not change the PASS findings above without re-verification.
