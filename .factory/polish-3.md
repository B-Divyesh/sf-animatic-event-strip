# Polish round 3 — cumulative adversarial closure

Product commit: `3afe8ad38737892f988eb370e83208ad8e4ca5e4`

Deployment: `44069a8c-9f18-4082-9538-73c0cac59c50`

Live product: <https://animatic-event-strip.sociobot.in>

Live demo: <https://animatic-event-strip.sociobot.in/?demo=1>

Every finding in `.factory/review-1.md`, `.factory/review-2.md`, and `.factory/review-3.md` is closed. Local screenshots are under `.factory/evidence/polish-3-local/`. Cold production screenshots and structured route results are under `.factory/evidence/polish-3-live/`.

## Round 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 / F-1-1 | Added the shared route script to Privacy, Terms, offline, and 404 pages. Every route h1 is programmatically focusable, receives focus on cold load and bfcache return, and has a populated polite announcement. App routes retain focus and scroll restoration. | `repairs F-3-1 and F-1-1 by focusing and announcing app and legal routes, including browser Back`; `.factory/evidence/polish-3-live/cold-routes.json`; `.factory/evidence/polish-3-live/browser-suite.log`; live `/privacy/` and `/terms/`. |
| F-3-2 / AES-QA-003 | Rebuilt the shared legal stylesheet so navigation, footer, contact, and offline actions have at least 44 px inline and block targets. Extended geometry coverage to every visible link and button on home, legal, offline, and 404 routes. | `repairs F-3-2 and AES-QA-003 with 44px targets on every public route`; live cold results record minima of 44×44 px; `.factory/evidence/polish-3-live/privacy-mobile.png`; `.factory/evidence/polish-3-live/404-mobile.png`. |
| F-3-3 | Gave home, demo, Privacy, Terms, offline, and 404 the same Demo/Privacy/Terms navigation and legal footer. Offline now has skip navigation, full metadata, icons, a route announcement, and a 44 px return action. Demo mode now sets its own title, description, canonical, Open Graph URL, and Twitter metadata. | `repairs AES-QA-304, AES-QA-305, and F-3-3 across every public route`; `gives the real and demo routes distinct titles, descriptions, and canonical URLs`; `.factory/evidence/polish-3-live/cold-routes.json`; live route status: 200 for five real routes and 404 for the missing route. |
| F-3-4 | Replaced the unsupported ambiguity outcome with `Build an animation handoff`. Removed broad public asset claims and declared `asset-provenance` with a source, prompt, request-origin, and dialog test. Declared `node-support` with a real Node 20.19 production build. Removed the vague update-safety promise. | `@claim:asset-provenance`; `@claim:node-support`; `release policy > repairs F-3-1 through F-3-6`; `.factory/evidence/polish-3-local/clean-clone-claims.log`. |
| F-3-5 | Renamed every cited heading and action. The interface now uses board/board image consistently, `Name engine events`, result-naming frame, delete, export, adapter, and print controls, `Optional Studio Pack`, and `Event markers`. Range and label errors now tell the user what to change. | `repairs F-3-5 with result-naming controls and one board term`; `release policy > repairs F-3-1 through F-3-6`; `.factory/copy-audit.md`; `.factory/evidence/polish-3-live/query-demo-mobile.png`. |
| F-3-6 | Rewrote the README opening and storage/export text in plain words. Added `engines.node` as `^20.19.0 || >=22.12.0` and a Node 20.19 production-build claim test. | `@claim:node-support`; `release policy > repairs F-3-1 through F-3-6`; clean-clone claim log above. |

## Earlier review findings retained

| Finding | Change retained or strengthened | Evidence |
| --- | --- | --- |
| F-1-1 | Route focus, announcement, Back/Forward, and mobile Demo navigation now cover app, legal, offline, and 404 pages. | F-3-1 browser test and live cold-route record. |
| F-1-2 | The visible three-step section remains on both `/` and demo routes. | `shows the three visible handoff steps on the planner and demo`; live demo screenshot. |
| F-1-3 | `keyboard-operation` remains declared exactly once and tests button activation, frame steps, Home/End, and focus retention. | `@claim:keyboard-operation`; clean-clone claim log. |
| F-1-4 | README uses short sentences and plain board/audio/event terms. | `.factory/copy-audit.md`; release-policy copy test. |
| F-1-5 | Clean-clone claim instructions remain split into short steps. | README copy audit and release-policy test. |
| F-1-6 | Live-policy instructions remain direct and separate from local tests. | README copy audit; final live-policy pass. |
| F-1-7 | Keyboard instructions remain three short, tested statements. | `@claim:keyboard-operation`; `.factory/copy-audit.md`. |
| F-1-8 | Security and cache disclosures remain concrete and short; the untestable update sentence is removed. | `@claim:studio-checkout`; F-3-4 release regression. |
| F-1-9 | `Start your first strip` and `Export this strip for engine work` remain, with the action heading further clarified to `Add the first board image`. | Release-policy copy test; live home screenshot. |
| F-1-10 | `Import project`, `Choose export`, and `Restore Studio license` remain. All result buttons are now more specific. | F-3-5 browser test; live demo screenshot. |
| F-2-1 | Every footer includes Demo, Privacy, and Terms; the current legal route uses `aria-current`. | `repairs F-2-1 with predictable Demo, Privacy, and Terms links in every footer`; live browser matrix. |
| F-2-2 | Export and footer headings remain descriptive rather than slogans. | `repairs F-2-2 through F-2-4 with specific copy and action names`. |
| F-2-3 | Guide and provenance actions remain verb-led; save feedback remains a status, not a button. | F-2 copy test and axe scans. |
| F-2-4 | Export copy continues to explain Adapter JSON and CSV in plain words. | F-2 copy test, `@claim:adapter-json-v1`, and `@claim:csv-export`. |

## Product QA findings referenced by review 3

| Finding | Current evidence |
| --- | --- |
| AES-QA-001 | Hosted checkout returns 303 to Sociobot/Dodo in `@claim:studio-checkout`. |
| AES-QA-002 | Verification reaches 429 with numeric `Retry-After: 4` in `@claim:studio-checkout`. |
| AES-QA-003 | Repaired by F-3-2; all live visible targets meet 44×44 px. |
| AES-QA-004 | Live headers retain CSP, anti-framing, Permissions Policy, referrer policy, and `nosniff`; see `root-headers.txt`. |
| AES-QA-005 | The live hashed asset has one-year immutable caching in `@claim:studio-checkout`. |
| AES-QA-201 | `.factory/claims.json` has 17 entries and the release test enforces one unique tagged test per entry. |
| AES-QA-202 | `/demo` and `?demo=1` load a seeded, resettable, disposable `demo:animatic-event-strip` workspace. |
| AES-QA-203 | The first screen states the job, audience, sample action, result, privacy, offline behavior, free core, and $12 price. |

## Final evidence

- Clean clone: `/tmp/animatic-polish-3-clean.RlgFnB/repo` at `3afe8ad38737892f988eb370e83208ad8e4ca5e4`.
- Every one of the 17 exact claim commands passed independently after `npm ci`; see `clean-clone-claims.log`.
- The complete clean suite passed: 17 Vitest checks, lint, typecheck, build, zero production audit findings, service-worker update, and 51 Playwright checks with three intentional profile skips; see `clean-clone-full-suite.log`.
- Initial output: 29.66 kB JavaScript (10.41 kB gzip), 22.63 kB CSS (5.72 kB gzip), no fonts, and a 36.14 kB mobile scene image.
- Local Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.4 s, TBT 0 ms, CLS 0.
- The complete 51-check browser matrix also passed against the live custom domain. Live Lighthouse: 100/100/100/100; LCP 1.1 s, TBT 30 ms, CLS 0.
- Live `verify-url.sh` reports HTTP 200, correct demo title, `lang=en`, one h1, a main landmark, complete alternatives, named buttons, and zero errors.
- All 23 deployable files match the live custom domain byte-for-byte. The live checkout/rate-limit/security/cache claim passed after deployment.

No review finding remains open.
