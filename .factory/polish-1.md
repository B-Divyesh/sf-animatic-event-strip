# Polish round 1 — adversarial review closure

Repair commit: `e05fc9cf03b964e1337bdf4e308154b6076216ad`  
Live: <https://animatic-event-strip.sociobot.in/demo>

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Route status now announces the destination and focuses the route `<h1>` after load, Back/Forward, and bfcache restoration. Route state records scroll position. | `repairs F-1-1 by focusing and announcing each route change, including browser Back`; live Chromium pass; `evidence/polish-1-live/demo-desktop.png`. |
| F-1-2 | Added a visible, semantic three-step `How to build an animation handoff` section on both planner and demo. | `shows the three visible handoff steps on the planner and demo`; live Chromium pass. |
| F-1-3 | Added the declared `keyboard-operation` claim and one exact tagged demo test. README now documents only the covered keys. | `@claim:keyboard-operation operates documented planner controls and frame keys without focus loss`; live Chromium pass. |
| F-1-4 | Rewrote the README introduction into two plain sentences and removed unexplained terms. | `release policy > repairs F-1-4 through F-1-10`; `.factory/copy-audit.md`. |
| F-1-5 | Split the claim-command build instruction into short sentences. | `release policy > repairs F-1-4 through F-1-10`; `.factory/copy-audit.md`. |
| F-1-6 | Split and clarified the deployed live-policy instruction. | `release policy > repairs F-1-4 through F-1-10`; `.factory/copy-audit.md`. |
| F-1-7 | Rewrote keyboard help as short, one-action sentences. | `@claim:keyboard-operation`; `.factory/copy-audit.md`. |
| F-1-8 | Split response-policy disclosure into concrete, short sentences. | `release policy > repairs F-1-4 through F-1-10`; `.factory/copy-audit.md`. |
| F-1-9 | Renamed the ambiguous workflow and handoff labels to `Start your first strip` and `Export this strip for engine work`. | `release policy > repairs F-1-4 through F-1-10`; live screenshot `evidence/polish-1-live/demo-mobile-390.png`. |
| F-1-10 | Renamed toolbar and license controls to `Import project`, `Choose export`, and `Restore Studio license`. | `release policy > repairs F-1-4 through F-1-10`; `@claim:studio-outputs`; live mobile screenshot. |

The demo now also condenses its route-only introduction so the filled Rain Gate project is inside the first phone viewport. `@claim:sample-demo` verifies both `/demo` and `?demo=1`, and the result is visible in `evidence/polish-1-live/demo-mobile-390.png`.

## Verification

- Fresh dependency install: `npm ci` (0 production vulnerabilities from `npm audit --omit=dev`).
- Unit/release policy: `npm test` — 14 tests passed after the final copy regression.
- Static checks: `npm run lint`, `npm run typecheck`, `npm run build` — passed. The final build emits `dist/index.html`; initial JS is 29.33 KB (10.43 KB gzip) and CSS is 22.16 KB (5.67 KB gzip).
- Browser/accessibility: desktop and 390×844 mobile tests passed for the repaired routes, workflow, demo, keyboard operation, legal/404, offline reload, overflow, touch targets, and axe WCAG 2 A/AA (`has no serious accessibility violations`).
- Every local `.factory/claims.json` command was run independently from a clean demo sandbox. The live `studio-checkout` command passed after deployment: checkout 303, verification rate-limit 429 with numeric `Retry-After: 4`, live response 200, immutable asset policy present.
- `verify-url.sh` passed locally and live on `/demo`: title, `lang`, one H1, main landmark, image alternatives, button names, and zero console errors. The standalone axe CLI could not launch Selenium Chrome in this container; the repository's Playwright AxeBuilder integration passed locally and on live `/demo`.
