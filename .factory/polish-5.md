# Polish round 5 — cumulative adversarial closure

Work order `animatic-event-strip-polish-5` repairs candidate `36b37945e91177de3ee1444c649c5658cd5514e9` using every finding in reviews 1–5. The product remains a static, local-first offline PWA with the documented cutting-room visual system. Product repair commit: `1215e9153619046277a4b74c7ab00fe6e10828f6`.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 / F-3-1 | Every app, legal, offline, and 404 route focuses its h1, announces the destination, and restores Back state. | `repairs F-3-1 and F-1-1 by focusing and announcing app and legal routes, including browser Back`; live `https://animatic-event-strip.sociobot.in/privacy/`. |
| F-1-2 | Kept the visible three-step handoff section on the landing and sample routes. | `shows the three visible handoff steps on the planner and demo`; `.factory/evidence/polish-5-live/demo/screenshot-mobile.png`. |
| F-1-3 | Kept the one declared `keyboard-operation` claim and executable keyboard regression. | `@claim:keyboard-operation operates documented planner controls and frame keys without focus loss`. |
| F-1-4 | Kept the short README opening with board, audio, and event language. | `release policy > repairs F-1-4 through F-1-10`; `.factory/copy-audit.md`. |
| F-1-5 | Kept the split, clean-clone claim-test instruction. | `release policy > repairs F-1-4 through F-1-10`; README audit. |
| F-1-6 | Kept the separate live-policy instruction. | `@claim:studio-checkout` passed from the clean clone after deployment. |
| F-1-7 | Kept the tested, short keyboard-help sentences. | `@claim:keyboard-operation`; README audit. |
| F-1-8 | Kept concrete response-policy and cache wording. | `@claim:studio-checkout`; live response headers. |
| F-1-9 | Kept specific workflow and export headings. | `release policy > repairs F-1-4 through F-1-10`; live home screenshot. |
| F-1-10 | Kept result-naming import, export, and license controls. | Full Playwright matrix; `.factory/evidence/polish-5-live/demo/export-options-mobile.png`. |
| F-2-1 | Every footer retains Demo, Privacy, and Terms, with the current legal route marked. | `repairs F-2-1 with predictable Demo, Privacy, and Terms links in every footer`; live legal screenshots. |
| F-2-2 | Retained factual export and footer copy. | `repairs F-2-2 through F-2-4 with specific copy and action names`; live home check. |
| F-2-3 | Retained verb-led guide/provenance controls and non-interactive save status. | F-2 copy regression and live Axe suite. |
| F-2-4 | Retained concrete Adapter JSON and CSV explanation. | `@claim:adapter-json-v1`; `@claim:csv-export`. |
| F-3-2 / AES-QA-003 | Retained at least 44 × 44 px visible controls on every public mobile route. | `repairs F-3-2 and AES-QA-003 with 44px targets on every public route`. |
| F-3-3 / AES-QA-304 / AES-QA-305 | Retained the shared skip/header/nav/main/footer skeleton, metadata, and designed HTTP 404. | Public-route Axe test; live `/polish-5-not-found` returned 404. |
| F-3-4 | Retained declared provenance, runtime, Node, license, and output claims. | `@claim:asset-provenance`, `@claim:runtime-privacy`, `@claim:node-support`, `@claim:license-lifecycle`, and `@claim:studio-outputs`. |
| F-3-5 | Retained one board term, useful errors, and result-naming controls. | `repairs F-3-5 with result-naming controls and one board term`; `.factory/copy-audit.md`. |
| F-3-6 | Retained exact Node support and plain README storage/export language. | `@claim:node-support`; release-policy test. |
| F-4-1 / AES-QA-202 | Retained storage-free landing and isolated `/?demo=1` path; the CTA never opens real storage. | `@claim:sample-demo`; live recheck records CTA, banner, Reset demo, and Rain Gate in `.factory/evidence/polish-5-live/recheck.json`. |
| F-5-1 | Replaced vague “core exports” with Project JSON, Adapter JSON, and CSV. Added `free-core-exports` and a fixture-backed no-license/revoked-license test that downloads all three files in both states. | `@claim:free-core-exports downloads Project JSON, Adapter JSON, and CSV without a license or after revocation` passed from clean clone and live; home screenshots and `recheck.json`. |
| F-5-2 | Added the `mobile-layout` claim. Its 390 px demo test proves a single-column project bar, stacked control groups, horizontally scrollable time axis, and no body overflow. | `@claim:mobile-layout stacks project controls and keeps the time axis scrollable at 390px` passed from clean clone and live; `.factory/evidence/polish-5-live/demo/screenshot-mobile.png`. |
| F-5-3 | Removed the untested embedded-provider-ID clause. README now says only “Checkout is hosted by Sociobot/Dodo.” | `release policy > repairs F-5-1 through F-5-7`; `.factory/copy-audit.md`; `@claim:studio-checkout`. |
| F-5-4 | Replaced both “Three passes” labels with “Three steps.” | Release-policy F-5 regression; `.factory/evidence/polish-5-live/home/screenshot-desktop.png`. |
| F-5-5 | Replaced the export-dialog mood label with “Export options.” | Release-policy F-5 regression; `.factory/evidence/polish-5-live/demo/export-options-mobile.png`. |
| F-5-6 | Replaced the offline h1 with “You are offline.” | Release-policy F-5 regression; live `/offline.html`; `.factory/evidence/polish-5-live/offline/screenshot-mobile.png`. |
| F-5-7 | Replaced the 404 h1 with “Page not found.” | Release-policy F-5 regression; live `https://animatic-event-strip.sociobot.in/polish-5-not-found`; `.factory/evidence/polish-5-live/missing/screenshot-mobile.png`. |
| AES-QA-001 / AES-QA-002 | Hosted checkout and numerical verification rate limit remain real production behavior. | Clean-clone post-deploy `@claim:studio-checkout`: checkout 303, verification 429, numeric `Retry-After: 1`. |
| AES-QA-004 / AES-QA-005 | CSP, anti-framing, permissions, referrer policy, `nosniff`, and immutable hashed assets remain deployed. | `@claim:studio-checkout`; live header check; 22 served deployable files SHA-256 match `dist/`. |
| AES-QA-201 | Claims manifest now has 19 unique IDs, each with one exact tagged test. | `release policy > declares every executable product claim exactly once`; all 19 exact commands passed from a clean clone. |
| AES-QA-203 | The cold first screen still states job, audience, first action, sample outcome, local storage, offline behavior, named free exports, and price. | `repairs AES-QA-203 with a plain first read and first action`; live home screenshot. |
| AES-QA-301 / AES-QA-302 | Repeated event movement keeps focus and closing event edit returns focus to its opener. | Dedicated Playwright regressions in the 58-test matrix. |
| AES-QA-401 | Every local browser claim still builds before production preview. | `repairs AES-QA-401 by building before Playwright starts the production preview`; clean clone. |
| AES-QA-501 / AES-QA-502 | License lifecycle remains declared/fixture-tested and Privacy describes one current project accurately. | `@claim:license-lifecycle`; release-policy regression. |

## Verification

- Clean clone: `/tmp/animatic-polish5-clean.OBn3qc`, cloned from `1215e91` before verification. `npm ci` installed 140 packages and `npm audit --omit=dev` found zero vulnerabilities.
- Clean full suite: `npm test` 19/19, lint, typecheck, build, `npm run test:pwa-update`, and Node 20.19 build support passed. Full local Playwright passed 58 tests with three intentional cross-profile skips.
- Every one of the 19 exact commands in `.factory/claims.json` passed from that clean clone. The post-deploy `studio-checkout` command reported checkout 303, verification 429, numeric `Retry-After: 1`, live 200, and an immutable asset.
- Local URL checks passed for home, query demo, Privacy, Terms, and offline. They report the right title, `lang=en`, one h1, main landmark, complete image alternatives, labeled buttons, and no console/page errors. Unknown local route returned HTTP 404.
- Local Lighthouse report is `.factory/evidence/polish-5-local/lighthouse.json`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,357 ms, TBT 76.5 ms, CLS 0.0012.
- Production deployment used Azure Static Web Apps CLI 2.0.10. The custom domain is <https://animatic-event-strip.sociobot.in>. All 22 deployable files that Azure serves match `dist/` byte-for-byte; `404.html` is intentionally status-coded and `staticwebapp.config.json` is consumed by Azure.
- Live `verify-url.sh` passed for home, demo, Privacy, Terms, and offline. Playwright AxeBuilder passed demo and all public routes on desktop and 390 px mobile. `.factory/evidence/polish-5-live/recheck.json` records the final cold mobile checks for the direct demo path, named free exports, layout, export label, offline h1, and HTTP 404.

No finding of any severity remains open. The brief’s five-person pilot remains future research and is not a public product promise.
