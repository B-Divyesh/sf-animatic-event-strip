# Adversarial first-read review 4 — Animatic Event Strip

**Verdict: FAIL**

- Reviewed: 2026-08-28 UTC
- Candidate: `00eb3611709671cdc2bba4b70002dad7a482882e`
- Live URL: <https://animatic-event-strip.sociobot.in>
- Method: fresh Chromium contexts at 390 × 844 and 1440 × 900; fresh local clone at `/tmp/animatic-review-4-clean.2DevRJ`; no product source was changed.

## First 30 seconds

Before scrolling, at both phone and desktop sizes, this is clear: it is a local timing strip for solo 2D animators and small game teams to plan frames, sound cues, and input windows before engine work. The first action is **“Try it with sample data”** and the adjacent copy says **“Loads a filled 10-second strip.”** No console error or horizontal body overflow occurred on either cold load.

The first-read threshold passes. The verdict nevertheless fails on the sandbox contradiction below.

## Findings

### F-4-1 — BLOCKING: the advertised one-click demo reads the real project before entering its sandbox

**Location / exact quote:** The home first screen says, **“Loads a filled 10-second strip. The demo never opens or changes your project.”** README says, **“It opens a filled 10-second strip without reading or changing your project.”**

**Evidence:** In a fresh browser context, I opened `/`, then activated that exact CTA. Before navigation to `/demo`, `indexedDB.databases()` already contained `animatic-event-strip`. Source confirms why: `src/app.ts` selects `storageSpace = 'project'` on `/` and startup calls `loadProject(storageSpace)`; `src/storage.ts` opens that database and reads its active record. When that record is absent, the same startup path creates `newProject()` and calls `persist('Ready offline')`, so a brand-new visitor also gets a real-project write before the demo click. The subsequent `/demo` state correctly uses `demo:animatic-event-strip`, shows the persistent **“Demo — sample data, nothing is saved to your project”** banner, seeds Rain Gate with two boards, one clip, and three markers, and Reset restores the sample.

**Why this fails:** A visitor with existing work can reasonably rely on “without reading” and “never opens.” A new visitor can reasonably rely on “without changing.” The sandbox contract requires a try-out path isolated from real data. The current test creates and opens a real project before clicking the CTA, so it proves only that demo edits do not overwrite it; it does not prove the stated no-read/no-write behavior.

**Concrete fix:** Make the landing CTA a storage-free entry surface: defer `loadProject('project')` and the initial `persist()` until the visitor chooses **Add your own event** (or move the real workspace to its own route). Keep `/demo` as the only storage selected by the sample CTA. Extend `@claim:sample-demo` to start with a sentinel real project in IndexedDB, load `/`, activate **Try it with sample data**, and assert that no read transaction/open occurs against `animatic-event-strip` from page load through the demo flow; repeat in a blank context and assert the real database was never created. If the landing must open the real project, replace both promises with accurate narrower copy; that would not satisfy the requested isolated one-click path.

## Copy audit

Counts treat hyphenated terms, file extensions, versions, and currency values as one word. Commands and bare URLs are excluded. No audited sentence is over 22 words. No banned marketing adjective appears. The terms **project**, **strip**, **board**, **sound clip**, **event marker**, **demo**, and **Studio Pack** are used consistently. No additional copy finding results.

### Landing page — default visible sentences

| Words | Sentence |
| ---: | --- |
| 6 | Plan animation events before engine work. |
| 18 | For solo 2D animators and small game teams planning frames, sound cues, and input windows before engine work. |
| 5 | Loads a filled 10-second strip. |
| 8 | The demo never opens or changes your project. — F-4-1 |
| 6 | Your project stays on this device. |
| 6 | Reopens offline after your first visit. |
| 4 | Core exports are free. |
| 5 | Studio Pack costs $12 once. |
| 12 | Add a board image, then mark the sounds and engine events around it. |
| 4 | Everything is stored locally. |
| 7 | Project JSON reopens here with local media. |
| 14 | Adapter JSON and CSV export frame data for Godot, Unity, or your own tools. |
| 6 | Both formats have a version number. |
| 5 | Turn markers into starter code. |
| 9 | The full planner and every core export are free. |
| 18 | A one-time Studio Pack adds direct Godot 4 and Unity 6 adapter source plus a printable handoff sheet. |
| 7 | Licenses are checked at most once daily. |
| 4 | Cached access works offline. |
| 6 | Plan scene timing before engine implementation. |
| 8 | Your project and media stay on this device. |
| 4 | AI-generated environmental scene. |
| 2 | No analytics. |
| 4 | Built by Param Factory. |

Headings are meaningful in isolation: **Current strip**, **How to build an animation handoff**, **Export formats for engine handoff**, and **Optional Studio Pack**. Visible action controls name results: **Try it with sample data**, **Add your own event**, **Import project**, **Choose export**, **Add event**, **Open quick guide**, **Restore Studio license**, and **Show artwork provenance**. No separate control-name finding results.

### README — prose sentences

| Words | Sentence |
| ---: | --- |
| 18 | Animatic Event Strip is a timing board that works offline for solo 2D animators and small game teams. |
| 10 | Keep boards, audio clips, and named events in one strip. |
| 10 | Plan them before code and final assets lock the scene. |
| 12 | It opens a filled 10-second strip without reading or changing your project. — F-4-1 |
| 12 | Reset demo restores the sample, and Start for real discards demo edits. |
| 13 | Builds a frame-accurate strip at 12, 15, 24, 25, 30, or 60 fps. |
| 13 | Stores board images, audio files, calculated waveform snippets, markers, and notes in IndexedDB. |
| 8 | Previews the timeline and aligned browser-supported audio locally. |
| 8 | Exports a complete `.aes.json` backup with embedded media. |
| 11 | Exports stable adapter v1 JSON and UTF-8 CSV without a license. |
| 9 | Imports and validates project backups before replacing local data. |
| 9 | Installs as a PWA and reopens the editor offline. |
| 19 | Optionally unlocks Godot 4 / Unity 6 starter adapters and a print handoff sheet through a one-time Sociobot license. |
| 21 | This is a pre-production tool, not an animation editor: it does not tween, generate art, animate characters, or execute engine events. |
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
| 14 | Checkout is hosted by Sociobot/Dodo; no product or payment-provider IDs are embedded here. |
| 7 | The policy restricts content sources and framing. |
| 6 | It also disables unused browser capabilities. |
| 7 | Versioned assets use a one-year immutable cache. |

## Demo, privacy, claims, and quality evidence

- The click path immediately displayed the realistic **Rain Gate — opening beat** sample, six named events, and the persistent demo banner. **Reset demo** restored the six-event sample. Direct fresh `/demo` used only `demo:animatic-event-strip`, did not access a saved license, and made same-origin requests only.
- The live request log for the fresh demo flow contained only `https://animatic-event-strip.sociobot.in`; no analytics, cookies, remote fonts, or third-party runtime scripts were observed. Offline, storage, export, audio, and keyboard behavior are individually covered by the declared claim commands.
- All 17 exact commands in `.factory/claims.json` completed independently from the fresh clone: `sample-demo`, `editor-workflow`, `fps-options`, `audio-preview`, `local-storage-only`, `runtime-privacy`, `asset-provenance`, `offline-reload`, `keyboard-operation`, `project-json-roundtrip`, `adapter-json-v1`, `csv-export`, `cached-license-offline`, `license-lifecycle`, `studio-outputs`, `studio-checkout`, and `node-support`. The live-policy claim reported `checkout=303`, `rate-limit=429`, and `retry-after=4`; Node 20.19 build support passed.
- `npm test` passed (17 tests); `npm run lint`, `npm run typecheck`, and `npm run build` passed. The production build is 10.41 kB gzip JavaScript and produces `dist/`.
- A full `npm run test:e2e` aggregate run was attempted after the individual claims. Chromium itself exited with `SIGSEGV` while creating a later browser context; this was not an application assertion failure. The required individual claim commands had already passed, and a separate live route-focus check passed after route restoration settled.
- Existing `@claim:sample-demo` is insufficient for F-4-1 because it deliberately creates a real project before it clicks the CTA and only asserts the demo’s later isolation. Thus its pass does not verify the public no-read promise.

## Structure, accessibility, links, identity, and leverage

Verified live at 390 px and desktop: route-specific title, one h1, meta description, canonical, Open Graph/Twitter data, SVG and Apple favicon, language, main landmark, skip link, shared header/footer, designed 404, focus/announcement on route change, 44 × 44 px minimum visible links/buttons, and back navigation after route restoration. `/`, `/demo`, `/privacy/`, `/terms/`, `/offline.html`, robots, sitemap, and manifest return 200; an unknown route returns the designed HTTP 404. All discovered internal links work; hosted checkout returns 303 and mailto links are explicit.

The cutting-room visual system is distinctive and matches the documented thesis rather than a generic SaaS template. The brief explicitly excludes AI image generation and the practical implied import/export and Godot/Unity handoff paths are present. No decorative runtime AI feature, raw provider key, or Azure endpoint was found.

## Earlier findings recheck

Every earlier review/polish/handoff finding was read and checked against current source plus the live site. All are fixed except the newly found F-4-1; no historical identifier is reopened.

| Earlier IDs | Current result |
| --- | --- |
| F-1-1, F-3-1 | Fixed: app, legal, offline, and 404 route titles receive focus and a polite message; Back works after the page restoration frame. |
| F-1-2 | Fixed: the visible three-step **How to build an animation handoff** section appears on planner and demo. |
| F-1-3, F-1-7 | Fixed: `keyboard-operation` is declared and passes; README instructions are short. |
| F-1-4 through F-1-6, F-1-8 | Fixed: the cited README sentences remain split, plain, and within the cap. |
| F-1-9, F-2-2 | Fixed: the cited vague labels were replaced by specific workflow/export/footer copy. |
| F-1-10, F-2-3, F-3-5 | Fixed: cited controls have result names and board terminology is consistent. |
| F-2-1 | Fixed: every checked footer exposes Demo, Privacy, and Terms. |
| F-2-4, F-3-6 | Fixed: export and README wording is concrete and plain. |
| F-3-2, AES-QA-003 | Fixed: no visible target under 44 × 44 px appeared across phone routes. |
| F-3-3, AES-QA-304, AES-QA-305 | Fixed: offline and 404 use the shared skeleton/metadata; unknown URLs return the designed 404. |
| F-3-4, AES-QA-201, AES-QA-303 | Fixed: public provenance, runtime, license, and Node claims are declared and individually tested. |
| AES-QA-001, AES-QA-002 | Fixed: checkout is hosted (303) and verification rate-limits (429 with numeric Retry-After). |
| AES-QA-004, AES-QA-005 | Fixed: live CSP/frame/permissions protections and immutable hashed assets are present. |
| AES-QA-202, AES-QA-203 | Fixed in their direct `/demo` and first-read scopes: seed, reset, exit, visible job/audience/action all work. F-4-1 identifies the still-uncovered no-read behavior of the CTA path. |
| AES-QA-301, AES-QA-302 | Fixed: existing tests retain timeline focus through frame movement and return focus from editing. |
| AES-QA-401, AES-QA-501, AES-QA-502 | Fixed: fresh build-before-preview claim execution, declared license lifecycle, and accurate single-project privacy wording remain present. |

## What would make this perfect

Make the sample CTA truly storage-isolated from the moment the landing page opens, add the sentinel-read regression described in F-4-1, and rerun the full fresh-clone browser suite. The first read, realistic demo content, local-first workflow, metadata, accessibility baseline, and claimed outputs otherwise meet this review’s checks. A pass requires F-4-1 to be removed as well.
