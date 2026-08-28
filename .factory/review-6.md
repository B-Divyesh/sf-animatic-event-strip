# Adversarial first-read review 6 — Animatic Event Strip

**Verdict: PASS**

- Reviewed: 2026-08-28 UTC
- Live URL: <https://animatic-event-strip.sociobot.in>
- Candidate: `db1addc09be5834f228a46bd78de4b05d9a67596`
- Method: fresh Chromium contexts at 390 × 844 and 1440 × 900; clean clone at `/tmp/aes-review6.TlouRm`; no product code changed.

There are zero findings. This is a PASS because the first read is clear, the sample is isolated and usable in one click, every declared claim passed from a clean clone, and the prior findings remain fixed in live behavior and source.

## First 30 seconds

Both cold first screens answer the required questions before scrolling.

- **What it does:** plan animation events before engine work.
- **For whom:** solo 2D animators and small game teams.
- **What to click first:** **Try it with sample data**.

The exact visible copy is **“Plan animation events before engine work.”**, **“For solo 2D animators and small game teams planning frames, sound cues, and input windows before engine work.”**, and **“Loads a filled 10-second strip. Your project is not opened or changed.”** The first screen also states local storage, offline reopening, named free exports, and the $12 one-time Studio Pack price. At 390 px, body width equalled viewport width and the live page produced no application console error. Desktop showed the same understanding and action.

## Findings

None.

## Copy audit

Counts treat hyphenated terms, versions, file names, and prices as one word. The landing table covers the default visible landing state; conditional dialogs, errors, demo state, and export state are also audited in full in [`.factory/copy-audit.md`](copy-audit.md). No sentence exceeds 22 words. No banned marketing term, unexplained metaphor, inconsistent product term, or non-result-naming visible control remains.

### Landing page

| Words | Sentence |
| ---: | --- |
| 6 | Plan animation events before engine work. |
| 18 | For solo 2D animators and small game teams planning frames, sound cues, and input windows before engine work. |
| 5 | Loads a filled 10-second strip. |
| 7 | Your project is not opened or changed. |
| 6 | Your project stays on this device. |
| 6 | Reopens offline after your first visit. |
| 9 | Project JSON, Adapter JSON, and CSV exports are free. |
| 5 | Studio Pack costs $12 once. |
| 8 | Planner ready: your project has not been opened. |
| 6 | Place each board on the strip. |
| 8 | Add local clips where the scene needs them. |
| 7 | Mark beats, cues, and input windows. |
| 5 | Add the first board image. |
| 12 | Add a board image, then mark the sounds and engine events around it. |
| 4 | Everything is stored locally. |
| 7 | Project JSON reopens here with local media. |
| 14 | Adapter JSON and CSV export frame data for Godot, Unity, or your own tools. |
| 6 | Both formats have a version number. |
| 5 | Turn markers into starter code. |
| 12 | The full planner, Project JSON, Adapter JSON, and CSV exports are free. |
| 18 | A one-time Studio Pack adds direct Godot 4 and Unity 6 adapter source plus a printable handoff sheet. |
| 7 | Licenses are checked at most once daily. |
| 4 | Cached access works offline. |
| 6 | Plan scene timing before engine implementation. |
| 8 | Your project and media stay on this device. |
| 4 | AI-generated environmental scene. |
| 2 | No analytics. |
| 4 | Built by Param Factory. |
| 4 | Version 1.0.0, polish 5. |

The headings identify their sections: **How to build an animation handoff**, **Start your first strip**, **Export this strip for engine work**, and **Optional Studio Pack**. The visible actions name outcomes: **Try it with sample data**, **Add your own event**, **Import project**, **Choose export**, **Add event**, **Open quick guide**, **Add your first event**, **Restore Studio license**, and **Show artwork provenance**.

### README

| Words | Sentence |
| ---: | --- |
| 18 | Animatic Event Strip is a timing board that works offline for solo 2D animators and small game teams. |
| 10 | Keep boards, audio clips, and named events in one strip. |
| 10 | Plan them before code and final assets lock the scene. |
| 12 | It opens a filled 10-second strip without reading or changing your project. |
| 12 | Reset demo restores the sample, and Start for real discards demo edits. |
| 13 | Builds a frame-accurate strip at 12, 15, 24, 25, 30, or 60 fps. |
| 13 | Stores board images, audio files, calculated waveform snippets, markers, and notes in IndexedDB. |
| 8 | Previews the timeline and aligned browser-supported audio locally. |
| 8 | Exports a complete `.aes.json` backup with embedded media. |
| 11 | Exports Project JSON, Adapter JSON, and UTF-8 CSV without a license. |
| 9 | Imports and validates project backups before replacing local data. |
| 9 | Installs as a PWA and reopens the editor offline. |
| 19 | Optionally unlocks Godot 4 / Unity 6 starter adapters and a print handoff sheet through a one-time Sociobot license. |
| 21 | This is a pre-production tool, not an animation editor: it does not tween, generate art, animate characters, or execute engine events. |
| 9 | The landing page does not open either project database. |
| 10 | The demo stores edits in the separate `demo:animatic-event-strip` IndexedDB database. |
| 4 | Real projects use `animatic-event-strip`. |
| 14 | The complete claim list and one tagged browser test per claim are in `.factory/claims.json`. |
| 9 | Requires Node.js 20.19 or newer, or 22.12 or newer. |
| 13 | The static artifact is written to `dist/`, with `dist/index.html` at its root. |
| 10 | Run every observable product claim from a fresh demo sandbox. |
| 5 | Playwright is pinned to 1.58.2. |
| 8 | Each claim command builds the production artifact first. |
| 14 | It then starts Vite preview and works after `npm ci` in a clean clone. |
| 10 | The live-policy check calls the deployed product and Sociobot API. |
| 9 | Run it after deployment, not with local unit tests. |
| 6 | Use Tab to reach planner controls. |
| 7 | Enter or Space opens the focused button. |
| 11 | Left and Right move the selected event or playhead one frame. |
| 6 | Hold Shift to move ten frames. |
| 10 | Home and End jump to the scene start and end. |
| 13 | The phone layout stacks project controls while keeping the time axis horizontally scrollable. |
| 10 | The active project is held under the `animatic-event-strip` IndexedDB database. |
| 5 | There is no server sync. |
| 10 | `.aes.json` uses `aes-project-1` and embeds selected media as data URLs. |
| 8 | Adapter JSON and CSV identify `animatic-event-strip/adapter` version `1`. |
| 7 | A range uses `start_frame` and `end_frame_exclusive` fields. |
| 8 | Project JSON is the backup and reopen format. |
| 14 | Adapter JSON and CSV include local filenames, but they exclude image and audio files. |
| 11 | No analytics, cookies, remote fonts, or third-party runtime scripts are present. |
| 15 | The only optional request is a Studio Pack license check to the Sociobot billing API. |
| 5 | Checkout is hosted by Sociobot/Dodo. |
| 7 | The policy restricts content sources and framing. |
| 6 | It also disables unused browser capabilities. |
| 7 | Versioned assets use a one-year immutable cache. |

Terminology is consistent: **project** is the editable document, **strip** the planning view, **board** the image-backed item, **sound clip** the audio item, **event marker** the named engine moment, **Project JSON** the reopenable backup, **Adapter JSON** the handoff, **demo** the isolated sample, and **Studio Pack** the paid adapter bundle.

## Demo, sandbox, and privacy

**PASS.** The first click opens `/?demo=1`; the initial product screen already shows the realistic **Rain Gate — opening beat** sample, including boards, a sound clip and waveform, event markers, frames, and timing. The persistent banner says **“Demo — sample data, nothing is saved to your project”** and includes **Reset demo** and **Start for real**.

The declared `sample-demo` test passed from the clean clone. It instruments IndexedDB and verifies that the landing and one-click demo path do not open or write the real project namespace; demo uses `demo:animatic-event-strip`, Reset restores the seeded strip, and leaving discards demo state before loading real storage. The declared privacy tests passed with only same-origin planning requests, no analytics/cookies/remote fonts/third-party runtime scripts, and a mobile offline demo reload after first visit.

## Claims and quality gates

All 19 exact commands from `.factory/claims.json` passed independently from the clean clone. The final live-policy command passed, including hosted checkout, rate limiting, headers, and immutable assets.

| Claim ID | Result |
| --- | --- |
| sample-demo | PASS |
| editor-workflow | PASS |
| fps-options | PASS |
| audio-preview | PASS |
| local-storage-only | PASS |
| runtime-privacy | PASS |
| asset-provenance | PASS |
| offline-reload | PASS |
| keyboard-operation | PASS |
| project-json-roundtrip | PASS |
| adapter-json-v1 | PASS |
| csv-export | PASS |
| free-core-exports | PASS |
| cached-license-offline | PASS |
| license-lifecycle | PASS |
| studio-outputs | PASS |
| studio-checkout | PASS |
| node-support | PASS |
| mobile-layout | PASS |

Also passed from that clone: `npm test` (19 tests), `npm run lint`, `npm run typecheck`, `npm run build`, full `npm run test:e2e` (58 tests), and `npm run test:pwa-update`. The production build emitted `dist/index.html`; initial JavaScript is 30.63 kB (10.64 kB gzip).

Every claim-like landing and README statement maps to the applicable declared test: sample isolation (`sample-demo`), local data/runtime privacy (`local-storage-only`, `runtime-privacy`), offline (`offline-reload`), planner/audio/FPS/keyboard workflows, backup/adapter/CSV exports, no-license export access, provenance, license lifecycle, Studio outputs/checkout, Node support, and mobile layout. No unlisted claim remains.

## Structure, routing, accessibility, links, and identity

**PASS.** Fresh live checks confirmed:

- `/`, `/?demo=1`, `/demo`, `/privacy/`, `/terms/`, and `/offline.html` return 200 with route-appropriate titles, one h1, descriptions, canonicals, Open Graph/Twitter metadata, favicon/Apple icon, `lang`, and a main landmark.
- The direct demo has title **“Demo — Animatic Event Strip”**. Privacy, Terms, Offline, and 404 use the prescribed `route — product` title pattern.
- An unknown route returns the designed **Page not found** page with HTTP 404 and a return-to-planner action.
- Deep links focus the route h1 and populate the polite announcement; the full browser suite covers navigation and Back.
- Header/footer navigation is consistent; every live landing link returned 200, with checkout returning its intended hosted 303 and mail links explicit.
- `robots.txt`, `sitemap.xml`, manifest, CSP/anti-framing headers, and a matching dark theme color are present.
- Fresh 390 px and desktop checks found no page overflow, no application console error, and the tested target/keyboard/accessibility suite passed. The original cutting-room visual system remains distinct from a generic SaaS template and matches the documented palette, typography, rails, and restrained motion.

## Earlier findings recheck

Every earlier review, polish report, verification report, and handoff section was read. The following lists each prior finding identifier and its current live/source confirmation.

| Earlier ID | Current confirmation |
| --- | --- |
| F-1-1 | Route changes and Back focus the h1 and announce the new route. |
| F-1-2 | The visible three-step handoff section appears on landing and demo. |
| F-1-3 | `keyboard-operation` is declared and passes. |
| F-1-4 | README opening is short and plain. |
| F-1-5 | Clean-clone instructions are split and accurate. |
| F-1-6 | Live-policy instruction is short and accurate. |
| F-1-7 | Keyboard instructions are short and tested. |
| F-1-8 | Response-policy/cache wording is separated and tested. |
| F-1-9 | Workflow and export headings name their sections. |
| F-1-10 | Import/export/license controls name their results. |
| F-2-1 | Footer Demo, Privacy, and Terms links occur on every route. |
| F-2-2 | Vague workflow/export/footer labels remain replaced. |
| F-2-3 | Guide/provenance controls use actions; save feedback is status text. |
| F-2-4 | Export copy explains its outputs in concrete terms. |
| F-3-1 | Legal, offline, and 404 route entry/Back receives focus and an announcement. |
| F-3-2 | Public mobile controls meet the tested 44 × 44 px minimum. |
| F-3-3 | Offline shares the route skeleton and metadata. |
| F-3-4 | Outcome, provenance, runtime, and license claims are declared/tested. |
| F-3-5 | Board terminology, controls, headings, and errors are plain and specific. |
| F-3-6 | README Node, storage, and export wording is concrete. |
| F-4-1 | Landing/demo path does not open real project storage. |
| F-5-1 | Named free exports are declared and `free-core-exports` passes. |
| F-5-2 | `mobile-layout` is declared and tested at 390 px. |
| F-5-3 | The unsupported embedded-ID clause is removed. |
| F-5-4 | “Three passes” is replaced by “Three steps.” |
| F-5-5 | Export dialog uses “Export options.” |
| F-5-6 | Offline h1 is “You are offline.” |
| F-5-7 | 404 h1 is “Page not found.” |
| AES-QA-001 | Hosted checkout returns its expected 303. |
| AES-QA-002 | Verification rate limits with a numeric `Retry-After`. |
| AES-QA-003 | Mobile touch target regression passes. |
| AES-QA-004 | Live CSP, anti-framing, referrer, and permissions policies are present. |
| AES-QA-005 | Versioned assets are immutable-cached. |
| AES-QA-201 | All 19 claims are uniquely declared and tagged. |
| AES-QA-202 | Demo is seeded, isolated, resettable, disposable, and documented. |
| AES-QA-203 | Cold first-read content is visible at both widths. |
| AES-QA-301 | Repeated keyboard frame movement retains focus. |
| AES-QA-302 | Edit-dialog close restores focus to its opener. |
| AES-QA-303 | Prior audio/output/privacy claims remain declared and tested. |
| AES-QA-304 | Unknown URLs receive the designed HTTP 404. |
| AES-QA-305 | App/legal/offline/404 route metadata and shared shell remain complete. |
| AES-QA-401 | Each local browser claim builds before preview from a clean clone. |
| AES-QA-501 | License lifecycle is declared and fixture-tested. |
| AES-QA-502 | Privacy accurately describes one current project. |

## Missed leverage

None. The brief’s implied import/export and engine-handoff paths are present: local media boards, waveform snippets, event markers, Project JSON, Adapter JSON, CSV, optional Godot/Unity starter adapters, and a printable handoff. Runtime AI would be decorative and AI image generation is explicitly out of scope. No provider key or Azure runtime endpoint is embedded.

## What would make this perfect

Keep this exact standard in future changes: preserve the one-click isolated demo, rerun the full declared claim manifest from a clean clone, and repeat cold 390 px/desktop route and copy checks whenever public text or routing changes. There is no remaining product change required by this review.
