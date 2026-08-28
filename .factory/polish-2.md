# Polish round 2 — cumulative review closure

Product repair commits: `9713e7e` and `31cc790`  
Deployment: `585e014a-0a31-4d10-801e-097beb829733`  
Live product: <https://animatic-event-strip.sociobot.in>  
Live demo: <https://animatic-event-strip.sociobot.in/demo>

Every finding in `.factory/review-1.md` and `.factory/review-2.md` is closed below. The evidence screenshots are cold production loads at desktop and 390 px: `.factory/evidence/polish-2-live/screenshot-desktop.png` and `.factory/evidence/polish-2-live/screenshot-mobile.png`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1, reopened | Kept the 44 px Demo link visible in the 390 px utility header. Route entry and Back still focus the h1, announce the route, and restore route state. | `repairs F-1-1 by focusing and announcing each route change, including browser Back` passed locally and live on desktop/mobile; mobile screenshot above; `/` and `/demo` returned 200. |
| F-1-2 | Retained the visible three-step workflow on the planner and demo. | `shows the three visible handoff steps on the planner and demo` passed locally and live; desktop screenshot above; `/demo` returned 200. |
| F-1-3 | Retained the declared `keyboard-operation` claim and its single tagged test. | `@claim:keyboard-operation operates documented planner controls and frame keys without focus loss` passed in the final clean clone and live. |
| F-1-4 | Retained the short README introduction using storyboard ranges, audio clips, and named moments. | `release policy > repairs F-1-4 through F-1-10`; `.factory/copy-audit.md`; live root returned 200. |
| F-1-5 | Retained the split clean-clone claim-test instruction. | `release policy > repairs F-1-4 through F-1-10`; `.factory/copy-audit.md`. |
| F-1-6 | Retained the split live-policy instruction. | `release policy > repairs F-1-4 through F-1-10`; final live policy reported checkout 303, rate limit 429, live 200. |
| F-1-7 | Retained the three short keyboard-help sentences. | `release policy > repairs F-1-4 through F-1-10` and `@claim:keyboard-operation`; `.factory/copy-audit.md`. |
| F-1-8 | Retained the three short response-policy sentences. | `release policy > repairs F-1-4 through F-1-10`; live CSP and immutable asset policy passed. |
| F-1-9 | Retained `Start your first strip` and `Export this strip for engine work`. | `release policy > repairs F-1-4 through F-1-10`; desktop screenshot above. |
| F-1-10 | Retained `Import project`, `Choose export`, and `Restore Studio license`. | `release policy > repairs F-1-4 through F-1-10`; desktop screenshot above. |
| F-2-1 | Both legal footers now show Demo, Privacy, and Terms. Each current legal link remains linked and uses `aria-current="page"`. | `repairs F-2-1 with predictable Demo, Privacy, and Terms links in every footer` passed locally and live; `/privacy/` and `/terms/` returned 200. |
| F-2-2 | Replaced the vague heading and footer slogan with `Export formats for engine handoff` and `Plan scene timing before engine implementation`. | `repairs F-2-2 through F-2-4 with specific copy and action names` passed locally and live; desktop screenshot above; live root returned 200. |
| F-2-3 | Renamed the buttons to `Open quick guide` and `Show artwork provenance`. Converted save feedback from a clickable button to a non-interactive polite status. | `repairs F-2-2 through F-2-4 with specific copy and action names` and Axe passed locally and live; desktop screenshot above. |
| F-2-4 | Replaced implementation jargon with: `Adapter JSON and CSV export frame data for Godot, Unity, or your own tools. Both formats have a version number.` | `repairs F-2-2 through F-2-4 with specific copy and action names`, `@claim:adapter-json-v1`, and `@claim:csv-export` passed; live root returned 200. |

## Final verification

- A new clone at `/tmp/animatic-polish-2-final.dUBh3B/repo` installed with `npm ci`. Every one of the 15 exact commands in `.factory/claims.json` passed independently. The release test confirms one and only one tagged test per claim.
- The same clean clone passed `npm test` (15/15), lint, typecheck, build, the PWA update test, and the complete Playwright matrix (47 passed, 3 intentional cross-profile skips). Build output is `dist/index.html`; initial JS is 29.26 KB / 10.42 KB gzip and CSS is 22.43 KB / 5.69 KB gzip.
- Playwright AxeBuilder found no serious accessibility violations on desktop or 390 px. The local and live URL verifiers found the correct demo title, `lang=en`, one h1, a main landmark, complete image alternatives, labeled buttons, and zero console errors.
- The production browser matrix passed every desktop test. A headless-shell process crashed before one mobile test; that test passed immediately alone, and the complete 25-test live mobile project then passed in one run.
- Live Lighthouse mobile scored 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO. LCP was 1.1 s, TBT 0 ms, and CLS 0. Evidence is `.factory/evidence/polish-2-live/lighthouse.json`.
- `/`, `/demo`, `/privacy/`, `/terms/`, `robots.txt`, `sitemap.xml`, and the manifest returned 200. An unknown route returned the designed 404. The root HTML, final CSS, final JS, both legal pages, and service worker matched `dist/` byte-for-byte by SHA-256.

No review finding remains open.
