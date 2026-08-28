# Polish round 4 — cumulative adversarial closure

Product repair commit: `962da03b50453cdfd1cb3b0e6058ed2bb32bc750`

Deployment: `eb86db5f-fd3b-4b58-9ea9-24c7bdf5e714`

Live product: <https://animatic-event-strip.sociobot.in>

Live isolated demo: <https://animatic-event-strip.sociobot.in/?demo=1>

Every finding in reviews 1–4 is closed. The live screenshots are `.factory/evidence/polish-4-live/home/screenshot-mobile.png`, `.factory/evidence/polish-4-live/home/screenshot-desktop.png`, `.factory/evidence/polish-4-live/demo/screenshot-mobile.png`, and `.factory/evidence/polish-4-live/demo/screenshot-desktop.png`.

Every named browser test below passed against the live root or query-demo URL after deployment. The screenshots above are the visual evidence for each landing/demo row; the complete live matrix supplies route, legal, 404, keyboard, privacy, offline, and mobile evidence where a still image cannot prove behavior.

## Review findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | App, legal, offline, and 404 routes focus their h1, announce the route, and restore Back/Forward state. The mobile Demo link remains visible. | `repairs F-3-1 and F-1-1 by focusing and announcing app and legal routes, including browser Back`; live 51-check matrix; live home/demo screenshots. |
| F-1-2 | The visible three-step workflow remains on landing and demo. | `shows the three visible handoff steps on the planner and demo`; live demo screenshots. |
| F-1-3 | `keyboard-operation` remains declared exactly once and covers native activation plus all documented frame keys. | `@claim:keyboard-operation`; clean-clone exact claim pass; live matrix. |
| F-1-4 | README keeps the short board/audio/event introduction and no unexplained jargon. | `release policy > repairs F-1-4 through F-1-10`; `.factory/copy-audit.md`. |
| F-1-5 | Clean-clone claim instructions remain split into short sentences. | `release policy > repairs F-1-4 through F-1-10`; `.factory/copy-audit.md`. |
| F-1-6 | Live-policy instructions remain direct and separate from local checks. | `release policy > repairs F-1-4 through F-1-10`; live `@claim:studio-checkout`. |
| F-1-7 | Keyboard help remains three short, tested statements. | `@claim:keyboard-operation`; `.factory/copy-audit.md`. |
| F-1-8 | Security and caching copy remains concrete and short. | `release policy > repairs F-1-4 through F-1-10`; live policy headers/cache check. |
| F-1-9 | Workflow and export headings remain specific. | `release policy > repairs F-1-4 through F-1-10`; live home screenshots. |
| F-1-10 | Import, export, and license controls retain result-naming labels. | `release policy > repairs F-1-4 through F-1-10`; live matrix. |
| F-2-1 | Every footer exposes Demo, Privacy, and Terms; current legal links use `aria-current`. | `repairs F-2-1 with predictable Demo, Privacy, and Terms links in every footer`; live routes. |
| F-2-2 | Export and footer headings remain descriptive rather than slogans. | `repairs F-2-2 through F-2-4 with specific copy and action names`; live home screenshots. |
| F-2-3 | Guide and provenance buttons use verbs; save feedback remains a status element. | `repairs F-2-2 through F-2-4 with specific copy and action names`; live axe pass. |
| F-2-4 | Export copy explains frame-data formats without implementation jargon. | `repairs F-2-2 through F-2-4 with specific copy and action names`; `@claim:adapter-json-v1`; `@claim:csv-export`. |
| F-3-1 | Privacy, Terms, offline, 404, landing, and demo all focus and announce route entry and restoration. | F-1-1/F-3-1 browser regression; live 51-check matrix. |
| F-3-2 | All visible links and buttons across public routes retain 44 × 44 px minimum targets at 390 px. | `repairs F-3-2 and AES-QA-003 with 44px targets on every public route`; live mobile matrix. |
| F-3-3 | Every route retains the shared skip/header/nav/main/footer skeleton and route-specific metadata; unknown paths return HTTP 404. | `repairs AES-QA-304, AES-QA-305, and F-3-3 across every public route`; live 404 check; live screenshots. |
| F-3-4 | Outcome language remains factual; provenance and Node support have declared, executable claims. | `@claim:asset-provenance`; `@claim:node-support`; 18 release tests. |
| F-3-5 | Board terminology, headings, errors, and result-producing controls remain plain and consistent. | `repairs F-3-5 with result-naming controls and one board term`; `.factory/copy-audit.md`. |
| F-3-6 | README keeps exact Node ranges and plain storage/export wording. | `@claim:node-support`; `release policy > repairs F-3-1 through F-3-6`. |
| F-4-1 | `/` is now storage-free. It does not call `loadProject('project')` or persist a new project. The CTA goes directly to `/?demo=1`, which opens only `demo:animatic-event-strip`. Real storage opens only after an explicit real-project action or **Start for real**. | `@claim:sample-demo never opens real storage on the one-click sample path and resets its isolated data` instruments every IndexedDB open, checks a sentinel database and a blank browser, then verifies seed/reset/discard/exit; passed in clean clone and live. Screenshots: live home and demo paths above. |

## Earlier product-QA identifiers cited by the reviews

| Finding | Change retained | Evidence |
| --- | --- | --- |
| AES-QA-001 | Studio checkout remains hosted by Sociobot/Dodo. | Live `@claim:studio-checkout`: HTTP 303. |
| AES-QA-002 | License verification remains rate limited. | Live `@claim:studio-checkout`: HTTP 429 and `Retry-After: 4`. |
| AES-QA-003 | All-route mobile targets meet 44 × 44 px. | F-3-2 live mobile regression. |
| AES-QA-004 | CSP, anti-framing, permissions, referrer, and `nosniff` headers remain live. | `release policy > declares browser hardening`; live response headers. |
| AES-QA-005 | Hashed assets retain one-year immutable caching. | Live `@claim:studio-checkout`. |
| AES-QA-201 | Claims manifest has one unique tagged test for every claim. | `release policy > declares every executable product claim exactly once`; 17/17 exact commands passed. |
| AES-QA-202 | Query demo is seeded, isolated, resettable, disposable, and documented. | `@claim:sample-demo`; `.factory/demo.md`; live demo screenshots. |
| AES-QA-203 | First screen states job, audience, action, result, privacy, offline behavior, and price. | `repairs AES-QA-203 with a plain first read and first action`; live home screenshots. |
| AES-QA-301 | Repeated event frame moves retain focus. | `repairs AES-QA-301 by retaining focus through repeated keyboard frame moves`; live matrix. |
| AES-QA-302 | Closing an event editor returns focus to its opener. | `repairs AES-QA-302 by returning dialog focus to the edited event`; live matrix. |
| AES-QA-303 | Audio, paid outputs, and runtime privacy are declared and tested. | `@claim:audio-preview`, `@claim:studio-outputs`, and `@claim:runtime-privacy`. |
| AES-QA-304 | Unknown URLs return the designed missing-frame page with HTTP 404. | Live `/qa-polish-4-missing` returned 404; public-route regression. |
| AES-QA-305 | Titles, social metadata, Apple icon, and shared legal/footer skeleton remain complete. | Public-route regression; both live URL verifier reports. |
| AES-QA-401 | Every local claim command builds before Vite preview. | `release policy > repairs AES-QA-401`; clean-clone 17-command run. |
| AES-QA-501 | License lifecycle remains declared and fixture-tested. | `@claim:license-lifecycle`; clean-clone and live matrix. |
| AES-QA-502 | Privacy describes one current local project rather than project history. | `release policy > repairs AES-QA-501 and AES-QA-502`; live Privacy route. |

## Claim evidence

Each exact command from `.factory/claims.json` ran independently after `npm ci` in `/tmp/animatic-polish-4-clean.ycav6H/repo` at commit `962da03`.

| Claim IDs | Result and evidence |
| --- | --- |
| `sample-demo` | PASS — no real IndexedDB open in sentinel or blank contexts; sample, reset, discard, and explicit real exit passed. |
| `editor-workflow`, `fps-options`, `audio-preview` | PASS — create/edit/reload/export, six FPS choices, local waveform and aligned playback. |
| `local-storage-only`, `runtime-privacy`, `asset-provenance` | PASS — demo namespace only, same-origin runtime, no cookies/fonts/analytics, recorded art source. |
| `offline-reload`, `keyboard-operation` | PASS — service-worker-controlled query demo reloaded offline; documented keys retained focus. |
| `project-json-roundtrip`, `adapter-json-v1`, `csv-export` | PASS — complete validated backup, adapter schema 1, UTF-8 header plus one row per event. |
| `cached-license-offline`, `license-lifecycle`, `studio-outputs` | PASS — cached offline access, daily/revoked/refunded/expired behavior, Godot/Unity/print outputs. |
| `studio-checkout` | PASS live — checkout 303, verification 429, numeric retry header, security and immutable cache policy. |
| `node-support` | PASS — production build completed on Node 20.19.0. |

## Final verification

- Clean clone: 18 unit/release checks passed; lint, typecheck, build, PWA update, and production audit passed; 51 browser checks passed with 3 intentional cross-profile skips.
- Build: `dist/index.html` exists; JavaScript 30.62 kB raw / 10.63 kB gzip; CSS 22.63 kB raw / 5.72 kB gzip; no font files; mobile scene 36.14 kB.
- Accessibility: Playwright AxeBuilder found zero serious/critical WCAG 2 A/AA findings. Both URL verifier reports found `lang=en`, one h1, main, complete image alternatives, named buttons, and zero console/page errors.
- Local Lighthouse: 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO; LCP 1.354 s, TBT 0 ms, CLS 0.0003. Report: `.factory/evidence/polish-4-local/lighthouse.json`.
- Live Lighthouse: 100 / 100 / 100 / 100; LCP 944 ms, TBT 0 ms, CLS 0.0012. Report: `.factory/evidence/polish-4-live/lighthouse.json`.
- All 23 deployed public files match `dist/` byte-for-byte. Azure consumes `staticwebapp.config.json`, so it is excluded from the public comparison.
- Deployment `eb86db5f-fd3b-4b58-9ea9-24c7bdf5e714` succeeded. No review finding remains open.
