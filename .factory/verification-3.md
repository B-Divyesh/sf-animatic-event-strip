# Animatic Event Strip — independent verification 3

**Verdict: FAIL — release blocked**

- Candidate: `bf3323eb1fb9922deb2e7f7bb1670950d61c1d60`
- Live URL: <https://animatic-event-strip.sociobot.in>
- Verified: 2026-08-28 UTC
- Work order: `animatic-event-strip-verify-3`
- Artifact: local-first PWA; no sign-in, published package/CLI, or first-party backend

The repaired one-click demo and all nine declared claim commands pass, and the live deployment is byte-for-byte this candidate. The planner works end to end, including media, boundary ranges, exports, persistence, offline reload, service-worker update, checkout, and rate limiting. It is still not releasable under the supplied contract: keyboard focus is destroyed by two common event-editing paths, several visitor-facing claims are absent from the mandatory claim manifest, and the mandatory 404/site metadata skeleton is incomplete.

## Release-blocking defects

### High — AES-QA-301: timeline keyboard movement loses focus after one keypress

The README promises that Left/Right moves a focused event by one frame and Shift+Left/Right by ten. On the live demo, focusing `Edit Interaction Enable player input, F108–144` and pressing Right once moved it to `F109–145`, but the event re-render moved focus to `<body>`. A second Right did nothing. This makes repeated frame adjustment impossible without tabbing back to the event after every frame.

Fresh reproduction:

```text
before:         Edit Interaction Enable player input, F108–144
after Right:    Edit Interaction Enable player input, F109–145
active element: BODY
after 2nd Right: F109–145 (unchanged)
```

The repository keyboard test checks the first move but does not assert focus retention or a second move. Evidence: `.factory/evidence/verification-3/keyboard-repeat.json`.

### High — AES-QA-302: closing an event-edit dialog loses focus

Opening a populated timeline event correctly focuses the label field. Pressing Escape closes the dialog but leaves focus on `<body>`, not on the event that opened it. Opening and closing the add-event dialog does return focus to `+ Add event`, proving the defect is specific to event editing: the clicked event is replaced in the DOM before the dialog opens.

This fails the supplied non-negotiable dialog-focus baseline and makes keyboard/screen-reader orientation unreliable in the product's core editor. Evidence: `.factory/evidence/verification-3/dialog-focus-return.json`.

### High — AES-QA-303: visitor-facing claims are missing from `.factory/claims.json`

All nine listed claim commands pass, but the required landing/README cross-check found observable claims with no manifest entry and therefore no exactly tagged claim test:

- README: “Previews the timeline and aligned browser-supported audio locally.” The demo claim tests contain no audio media or playback assertion. An independent WAV upload proved waveform generation and persistence, but it is not a declared claim test.
- Landing, README, and Terms: the Studio Pack “adds direct Godot 4 and Unity 6 adapter source plus a printable handoff sheet.” `studio-checkout` verifies only the hosted checkout, price copy, response policy, and asset cache. `cached-license-offline` verifies only cached unlock status. Neither asserts the three paid outputs.
- README/privacy/footer: “No analytics, cookies, remote fonts, or third-party runtime scripts are present” / “No analytics.” `local-storage-only` intercepts origins for one demo flow, but the manifest does not list this broader runtime/privacy claim or test cookies, fonts, scripts, and same-origin analytics.

Other README capability statements, including supported FPS choices and PWA installation, are likewise broader than the exact declared claims. The attached claims contract says any unlisted claim fails review until the copy is removed or a matching tagged sandbox test is added. Independent functional evidence cannot substitute for the required manifest coverage.

## Other defects

### Medium — AES-QA-304: unknown URLs are not a real, designed 404

`GET /qa-definitely-missing-20260828` returned HTTP 200 and the normal home shell. There is no 404 route or 404 artifact. This directly misses the supplied site-structure requirement for a real, product-styled 404 with a way home and can hide broken links from users and crawlers. Evidence: `.factory/evidence/verification-3/http-policy.log` and `site-structure-audit.json`.

### Low — AES-QA-305: mandatory social metadata and shared route skeleton are incomplete

The live home/demo shell has no Open Graph fields, Twitter card fields, 1200×630 social image, or 180 px Apple touch icon. Privacy and Terms have no canonical URL or skip link and do not use the common wordmark/navigation skeleton. No route footer includes “Built by Param Factory” or a version/build ID. These are explicit site-structure requirements. Titles, descriptions, favicon, theme color, `lang`, one H1, and main landmarks are present.

## Mandatory first gates

### Cold first-read — PASS

The first live viewport answers all three required questions:

- What: **“Plan animation events before engine work.”**
- For whom: **“For solo 2D animators and small game teams…”**
- First click: **“Try it with sample data”**, beside “Loads a filled 10-second strip. The demo never opens or changes your project.”

It also shows the three short facts for local storage, offline reopening, and the $12 one-time Studio Pack. HTTP was 200, the page had `lang=en`, one H1 and a main landmark, and there were no console/page errors. Evidence: `first-read-desktop.txt` and `first-read-desktop.png`.

### Declared claims — all commands PASS

Every command was run separately from the candidate checkout before general QA. Logs are in `.factory/evidence/verification-3/claims-fresh/`.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `sample-demo` | PASS | `/demo` loaded the six-event Rain Gate sample; reset/exit and real/demo isolation passed. |
| `editor-workflow` | PASS | Created image/interaction events, reloaded them, and downloaded Adapter JSON. |
| `local-storage-only` | PASS | Demo flow stayed same-origin; only `demo:animatic-event-strip` existed; no saved license key. |
| `offline-reload` | PASS | 390 px mobile demo reloaded offline with the sample. |
| `project-json-roundtrip` | PASS | Seven-event AES 1 backup exported, reset, and reopened. |
| `adapter-json-v1` | PASS | Six events exported with `animatic-event-strip/adapter`, version 1, and integer exclusive ends. |
| `csv-export` | PASS | BOM/header plus exactly six sample event rows. |
| `cached-license-offline` | PASS | Cached valid Studio verdict stayed available offline. |
| `studio-checkout` | PASS | Checkout 303; verify endpoint 429 with numeric `Retry-After`; live 200; immutable hashed asset. |

## Clean candidate gates

`npm ci` was run at candidate HEAD before the complete gate suite.

| Gate | Result |
| --- | --- |
| `npm ci` | PASS — 140 packages; 0 vulnerabilities |
| `npm test` | PASS — 9/9 Vitest tests |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS — exact production `dist/` produced |
| `npm run test:e2e` | PASS — 23 passed, 3 intentional profile skips |
| `npm audit --omit=dev` | PASS — 0 vulnerabilities |

Full output: `.factory/evidence/verification-3/quality-gates.log`.

## Independent end-to-end and recovery evidence

A separate live-browser workflow performed 28 checks; all 28 passed after correcting the verifier's native-validation and async timing assumptions:

- Opened the populated demo with two boards, one waveform snippet, and three markers.
- Rejected a negative range with the browser's specific minimum message, then accepted a one-frame board at frame 0 without reload.
- Rejected a duration that would truncate events, then saved corrected timing and name.
- Rejected malformed JSON without changing the current project.
- Imported the 12-frame minimum at 60 fps; rejected 216,001 with the browser's `≤ 216000` guidance; accepted 216,000.
- Added an implementation note on the last supported frame, kept it inside the upper boundary, moved it ten frames by keyboard, persisted it, and exported the correct CSV row.
- Cancelled a named deletion and then confirmed it successfully.
- Made only same-origin requests throughout the normal demo flow and produced no console/page errors.

An independent audio path uploaded a generated 8 kHz WAV, rendered 56 waveform buckets, survived reload, and exported embedded `data:audio/wav;base64` media. A cached valid license independently downloaded Godot 4 and Unity 6 versioned loader source and invoked print; a returned invalid token was stored under the required key, removed from the URL while preserving other query/hash state, and sent to the exact Sociobot verify URL. Evidence: `independent-live-qa.json`, `audio-workflow.json`, and `license-flow.json`.

## Accessibility, responsive behavior, and visual review

- `verify-url.sh` on live `/demo`: HTTP 200; title `Demo — Animatic Event Strip`; `lang=en`; one H1; main present; zero images without alternatives; zero unlabeled buttons; zero console/page errors.
- Fresh axe WCAG 2 A/AA checks on desktop demo, 390×844 demo, Privacy, and Terms found zero serious/critical violations.
- At 390 px, body width equaled viewport width and every rendered button, link, field, selector, and textarea had an effective target of at least 44×44 CSS px.
- The first Tab exposed the skip link with a 3 px cyan outline. Reduced-motion duration was `0.00001s` and there was no looping animation.
- A 200% reflow-equivalent check (640 CSS px at 2× scale) kept the page and open dialog usable without body overflow or lost actions.
- Desktop and 390 px screenshots show the product-specific cutting-room visual system without clipping, collisions, or illegible controls. The imagery and authored-icon provenance is recorded in `.factory/design.md` and `assets/src/`.

These passes do not override AES-QA-301/302: automated axe cannot detect lost focus after a DOM replacement.

## PWA, privacy, response policy, and deployment identity

- Live demo acquired an active service-worker controller, cached `aes-shell-v5`, reloaded offline, retained the sample, and showed the Offline state.
- A two-version local production-artifact probe installed `aes-shell-qa-update-1`, displayed **A fresh version is ready**, activated **Update app**, reloaded, deleted the old cache, and left only `aes-shell-qa-update-2` with no errors.
- Chrome parsed the live manifest with zero errors: standalone display, versioned start URL, 192/512 icons, and a maskable icon.
- All **19** served build files matched fresh `dist/` outputs byte-for-byte by SHA-256; `staticwebapp.config.json` is consumed by Azure and was correctly excluded. Thus the live site is candidate `bf3323e`.
- The root has HSTS, restrictive CSP including `frame-ancestors 'none'`, `X-Frame-Options: DENY`, Permissions Policy, `nosniff`, and strict-origin referrer policy. Hashed assets return one-year immutable caching; HTML, manifest, and service worker remain revalidatable.
- A fresh sequential license-verify burst returned 30 HTTP 200 responses, then the first HTTP 429 on request **31** with `Retry-After: 4`. Checkout independently returned HTTP 303 to Dodo's hosted session.
- The billing API allowed the exact product origin, returned `Cache-Control: no-store`, and is the only optional cross-origin runtime endpoint. Normal editor/demo work stayed same-origin.
- There is no sign-in, so the Entra authority requirement is not applicable. There is no published package/CLI or first-party server, so consumer-pack, health, concurrency, and persistence-boundary backend checks are not applicable.

## Performance

Fresh live Lighthouse 13.4.1 mobile results:

| Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 93 | 100 | 100 | 100 | 1,059 ms | 318.5 ms | 0.0136 |

Initial production assets are well within the supplied budgets: JavaScript 28,392 B / 10,146 B gzip; primary CSS 20,717 B / 5,378 B gzip; no fonts; mobile hero WebP 36,138 B. Lab navigation does not supply a reliable INP measurement; no INP claim is made.

## Evidence index

All fresh artifacts are under `.factory/evidence/verification-3/`, including:

- `claims-fresh/*.log`, `quality-gates.log`
- `first-read-desktop.txt`, desktop/mobile screenshots
- `independent-live-qa.json`, `audio-workflow.json`, `license-flow.json`
- `keyboard-repeat.json`, `dialog-focus-return.json`
- `verify-url-live/verify.json`, `service-worker-update.json`, `manifest-browser.json`
- `deployment-identity.log`, `http-policy.log`, `rate-limit-threshold.json`
- `bundle-budgets.log`, `lighthouse-live.json`, `lighthouse-summary.json`
- `site-structure-audit.json`, `text-resize-200.json`

## Release decision

**FAIL. Do not release candidate `bf3323eb1fb9922deb2e7f7bb1670950d61c1d60`.** Preserve focus when timeline events re-render and return focus to the edited event after dialog close; enumerate and tag every public claim (or remove unsupported claim copy); then add the required real 404 and complete route metadata/skeleton. Re-run all claim commands and the two keyboard reproductions after repair.

The researched five-person handoff pilot has not been run. That success measure remains product research rather than a verified release claim.
