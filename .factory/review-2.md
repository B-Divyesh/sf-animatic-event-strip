# Adversarial first-read review 2 — Animatic Event Strip

**Verdict: FAIL**

- Reviewed: 2026-08-28 UTC
- Live URL: <https://animatic-event-strip.sociobot.in>
- Repository base: `e35553979bdede5dd6f46c0a6911cc86cef9cf5d`
- Method: fresh Chromium contexts at 390 × 844 and 1440 × 900; fresh local clone at `/tmp/animatic-review-2.vUKl7P`; no product code changed.

## First 30 seconds

Before scrolling, at both 390 px and desktop, this reads as an offline planning strip for timing animation events before engine implementation. It is for solo 2D animators and small game teams. The first action is **“Try it with sample data”**; **“Loads a filled 10-second strip”** explains the immediate result. The first screen also states local storage, offline reopening, free exports, and the $12 optional pack. No body overflow or application console error occurred on either cold home-page load.

This passes the cold comprehension threshold. It does not make the overall review a pass because the findings below remain.

## Findings

### F-1-1 — BLOCKING, reopened: the mobile header removes the Demo route used to verify route focus and announcement

**Location / exact evidence:** At live 390 px, the utility header exposes only the clickable **“Saved locally”** status; its **“Demo”** link and **“Quick guide”** button are visually absent. The clean-clone full-suite command `npm run test:e2e` failed its mobile instance of **“repairs F-1-1 by focusing and announcing each route change, including browser Back”**. The failure snapshot shows `navigation "Utility navigation"` containing only the save-status button, so `getByRole('link', { name: 'Demo' })` cannot be activated.

**Why this matters:** This is an earlier finding and the earlier repair was required to make Demo navigation, focus, and route announcement dependable. The hero CTA still enters the demo, but the header is no longer a consistent mobile route control and the declared regression suite is red. That is a half-fix under the review contract.

**Concrete fix:** Keep an accessible 44 px **Demo** link in the mobile header, or replace the hidden controls with an explicit menu that contains Demo and is keyboard-operable. Retain a mobile test that activates that visible navigation control, asserts the demo h1 is focused and announced, then goes Back and asserts the planner h1 is focused and announced. The full `npm run test:e2e` suite must pass.

### F-2-1 — Medium: legal-page footers are inconsistent and omit one required legal link

**Location / exact evidence:** Live `/privacy/` footer contains **“Demo”** and **“Terms”**, but no **“Privacy”** link. Live `/terms/` footer contains **“Demo”** and **“Privacy”**, but no **“Terms”** link. The source has the same omissions in `public/privacy/index.html` and `public/terms/index.html`.

**Why this matters:** The required shared site skeleton calls for Privacy and Terms in every footer. The current page is still a useful legal destination and should remain visibly available and marked as current; changing footer contents by route makes the legal navigation less predictable.

**Concrete fix:** Put both links in both legal footers. Keep the current one as a link with `aria-current="page"`, matching the header. Add a route regression that asserts every footer exposes Demo, Privacy, and Terms.

### F-2-2 — Minor: two visible text labels are vague when read without their surrounding layout

**Location / exact quote:** Landing h2 **“One strip, several handoffs.”** and footer line **“Built for sketches before systems.”**

**Why this matters:** The first does not name the export formats or engine handoff work; the second does not say what the product does. A screen-reader heading list and a visitor scanning the lower page get slogans rather than destinations.

**Concrete fix:** Replace the h2 with **“Export formats for engine handoff.”** Replace the footer line with **“Plan scene timing before engine implementation.”** Keep the explanatory text that follows.

### F-2-3 — Minor: visible buttons do not name the action/result they perform

**Location / exact quote:** Header button **“Quick guide”** opens a dialog; footer button **“Artwork provenance”** opens that dialog with provenance content; the header’s visible **“Saved locally”** control is a clickable save action.

**Why this matters:** These are nouns or a past-tense status presented as buttons. A first-time visitor cannot infer the action from the accessible control name, and the save status should not masquerade as an unexplained action.

**Concrete fix:** Rename them **“Open quick guide”**, **“Show artwork provenance”**, and **“Save project locally”**. If the last control is only status, change it to a non-interactive status element and provide a separate explicitly named save action only when one is needed.

### F-2-4 — Minor: export copy uses unexplained implementation jargon

**Location / exact quote:** Landing handoff paragraph: **“Adapter JSON and CSV stay implementation-neutral, with stable schema versions for Godot, Unity, or your own tools.”** (16 words)

**Why this matters:** “Implementation-neutral” and “schema versions” are developer terms rather than a direct explanation of what an animator receives. The audience should not need to translate the promise before deciding whether export helps them.

**Concrete fix:** Replace with: **“Adapter JSON and CSV export frame data for Godot, Unity, or your own tools. Both formats have a version number.”** Retain the declared adapter and CSV claim tests.

## Copy audit

Counts treat hyphenated words, version numbers, file extensions, and currency values as one word. Commands, URLs, and state-dependent errors are excluded. No audited sentence exceeds 22 words. The only terminology/plain-word flag is F-2-4. The terms **project**, **strip**, **event**, **demo**, **Project JSON**, **Adapter JSON**, and **Studio Pack** are otherwise used consistently.

### Landing page: default visible prose, headings, and controls

| Words | Copy |
| ---: | --- |
| 3 | Animation handoff planner |
| 6 | Plan animation events before engine work. |
| 18 | For solo 2D animators and small game teams planning frames, sound cues, and input windows before engine work. |
| 6 | Try it with sample data |
| 4 | Add your own event |
| 5 | Loads a filled 10-second strip. |
| 8 | The demo never opens or changes your project. |
| 6 | Your project stays on this device. |
| 6 | Reopens offline after your first visit. |
| 4 | Core exports are free. |
| 5 | Studio Pack costs $12 once. |
| 2 | Current strip |
| 2 | Untitled scene |
| 2 | Import project |
| 2 | Choose export |
| 3 | Add event |
| 2 | How to build an animation handoff |
| 2 | Add boards |
| 7 | Place each visual range on the strip. |
| 2 | Align sound |
| 8 | Add local clips where the scene needs them. |
| 3 | Name implementation moments |
| 7 | Mark beats, cues, and input windows. |
| 4 | Start your first strip |
| 7 | Start with the beat you can see. |
| 13 | Add a board image, then mark the sounds and implementation moments around it. |
| 4 | Everything is stored locally. |
| 4 | Add your first event |
| 6 | Export this strip for engine work |
| 5 | One strip, several handoffs. — F-2-2 |
| 7 | Project JSON reopens here with local media. |
| 16 | Adapter JSON and CSV stay implementation-neutral, with stable schema versions for Godot, Unity, or your own tools. — F-2-4 |
| 6 | Turn markers into starter code. |
| 9 | The full planner and every core export are free. |
| 19 | A one-time Studio Pack adds direct Godot 4 and Unity 6 adapter source plus a printable handoff sheet. |
| 3 | $12 one-time purchase |
| 3 | Buy Studio Pack |
| 3 | Free planner active |
| 3 | Have a license? |
| 3 | Restore Studio license |
| 7 | Licenses are checked at most once daily. |
| 4 | Cached access works offline. |
| 2 | Quick guide — F-2-3 |
| 5 | Built for sketches before systems. — F-2-2 |
| 8 | Your project and media stay on this device. |
| 2 | Artwork provenance — F-2-3 |
| 4 | Original AI-generated environmental artwork. |
| 2 | No analytics. |
| 4 | Built by Param Factory. |
| 4 | Version 1.0.0, polish 1. |
| 2 | Saved locally — F-2-3 |

### README: prose sentences

| Words | Copy |
| ---: | --- |
| 16 | Animatic Event Strip is an offline-first timing board for solo 2D animators and small game teams. |
| 11 | Keep storyboard ranges, audio clips, and named moments in one strip. |
| 11 | Plan them before code and final assets lock the scene. |
| 12 | It opens a filled 10-second strip without reading or changing your project. |
| 12 | Reset demo restores the sample, and Start for real discards demo edits. |
| 13 | Builds a frame-accurate strip at 12, 15, 24, 25, 30, or 60 fps. |
| 13 | Stores board images, audio blobs, calculated waveform snippets, markers, and notes in IndexedDB. |
| 8 | Previews the timeline and aligned browser-supported audio locally. |
| 8 | Exports a complete `.aes.json` backup with embedded media. |
| 11 | Exports stable adapter v1 JSON and UTF-8 CSV without a license. |
| 9 | Imports and validates project backups before replacing local data. |
| 9 | Installs as a PWA and reopens the editor offline. |
| 18 | Optionally unlocks Godot 4 / Unity 6 starter adapters and a print handoff sheet through a one-time Sociobot license. |
| 21 | This is a pre-production tool, not an animation editor: it does not tween, generate art, animate characters, or execute engine events. |
| 11 | The demo stores edits in the separate `demo:animatic-event-strip` IndexedDB database. |
| 4 | Real projects use `animatic-event-strip`. |
| 15 | The complete claim list and one tagged browser test per claim are in `.factory/claims.json`. |
| 5 | Requires Node.js 20 or newer. |
| 13 | The static artifact is written to `dist/`, with `dist/index.html` at its root. |
| 10 | Run every observable product claim from a fresh demo sandbox. |
| 5 | Playwright is pinned to 1.58.2. |
| 8 | Each claim command builds the production artifact first. |
| 14 | It then starts Vite preview and works after `npm ci` in a clean clone. |
| 10 | The live-policy check calls the deployed product and Sociobot API. |
| 10 | Run it after deployment, not with local unit tests. |
| 7 | Use Tab to reach planner controls. |
| 8 | Enter or Space opens the focused button. |
| 11 | Left and Right move the selected event or playhead one frame. |
| 7 | Hold Shift to move ten frames. |
| 11 | Home and End jump to the scene start and end. |
| 13 | The phone layout stacks project controls while keeping the time axis horizontally scrollable. |
| 10 | The active project is held under the `animatic-event-strip` IndexedDB database. |
| 5 | There is no server sync. |
| 10 | `.aes.json` uses `aes-project-1` and embeds selected media as data URLs. |
| 21 | Adapter JSON and CSV identify `animatic-event-strip/adapter` version 1; ranges are represented as `start_frame` plus an exclusive `end_frame_exclusive`. |
| 7 | Project JSON is the backup/reopen format. |
| 19 | Adapter JSON and CSV are deliberately media-light handoff formats; they include the original local filename but not file contents. |
| 11 | No analytics, cookies, remote fonts, or third-party runtime scripts are present. |
| 15 | The only optional request is a Studio Pack license check to the Sociobot billing API. |
| 14 | Checkout is hosted by Sociobot/Dodo; no product or payment-provider IDs are embedded here. |
| 8 | See `public/privacy/index.html` and `public/terms/index.html`. |
| 8 | Production response policy is declared in `public/staticwebapp.config.json`. |
| 7 | The policy restricts content sources and framing. |
| 6 | It also disables unused browser capabilities. |
| 7 | Versioned assets use a one-year immutable cache. |
| 15 | The HTML, manifest, service worker, and legal documents remain revalidatable so updates are discovered safely. |

## Demo and sandbox behaviour

**PASS.** One click from the landing page entered `/demo`, focused and announced the destination h1, and showed the realistic six-event **Rain Gate — opening beat** strip in the initial 390 px viewport. The persistent banner states **“Demo — sample data, nothing is saved to your project”** and exposes Reset demo and Start for real. The declared sample-demo test added a temporary demo event, reset it, discarded another on exit, and confirmed that the pre-existing real event remained.

The declared isolation test starts directly at `/demo`, observes `demo:animatic-event-strip` but not the real database or stored license, then checks the complete flow. Its request interception observed only the page origin. My live offline check loaded `/demo`, waited for service-worker control, set the context offline, and reloaded a 200 cached page with the six events and the visible offline banner.

## Claims and quality gates

**PASS for declared claims.** I ran every command listed in `.factory/claims.json` from the fresh clone after `npm ci`. Each local command builds its production artifact before preview. The live checkout command passed with its hosted 303 redirect, rate-limit check, live page check, and immutable asset check.

| Claim ID | Result |
| --- | --- |
| sample-demo | PASS |
| editor-workflow | PASS |
| fps-options | PASS |
| audio-preview | PASS |
| local-storage-only | PASS |
| runtime-privacy | PASS |
| offline-reload | PASS |
| keyboard-operation | PASS |
| project-json-roundtrip | PASS |
| adapter-json-v1 | PASS |
| csv-export | PASS |
| cached-license-offline | PASS |
| license-lifecycle | PASS |
| studio-outputs | PASS |
| studio-checkout | PASS |

Live landing and README claim-like copy maps to the declared sample, workflow, FPS, audio, local-storage, runtime-privacy, offline, keyboard, project/adapter/CSV, license, Studio-output, and checkout claims. No additional unlisted visitor-reliant product claim was found.

The fresh clone passed `npm test` (14 tests), `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:pwa-update`. However, the full `npm run test:e2e` suite failed one of 46 tests: the mobile F-1-1 regression described above. The build emitted `dist/`; initial JS is 29.33 kB / 10.43 kB gzip.

## Earlier findings recheck

I read `.factory/review-1.md`, `.factory/polish-1.md`, and the handoff/history reports. F-1-1 is reopened above. The remaining F-1 findings are fixed in both deployed behavior and current code/tests.

| Earlier ID | Current confirmation |
| --- | --- |
| F-1-1 | **Reopened / BLOCKING.** `announceRoute()` exists and the hero CTA path works, but the 390 px header removes Demo and the mobile route regression fails. |
| F-1-2 | The visible **How to build an animation handoff** section has all three required steps on `/` and `/demo`. |
| F-1-3 | `keyboard-operation` is declared and its tagged demo test passes. |
| F-1-4 through F-1-8 | The rewritten README sentences are all at or below 22 words in this audit. |
| F-1-9 | The prior vague labels were replaced by **Start your first strip** and **Export this strip for engine work**. |
| F-1-10 | The prior controls are now **Import project**, **Choose export**, and **Restore Studio license**. |

## Structure, links, identity, and leverage

The home, demo, Privacy, Terms, and designed 404 routes have the expected per-route titles, one h1, description, canonical, Open Graph/Twitter metadata, favicon, `lang=en`, and main landmark. Deep `/demo` and `?demo=1` entries work; browser Back restores and announces the route through the hero CTA. The crawl returned 200 for home, demo, Privacy, Terms, robots, sitemap, and manifest; checkout returned its expected hosted 303. The unknown route returned the designed HTTP 404 with a way back. F-1-1 and F-2-1 are the remaining shared-navigation exceptions.

The charcoal/paper/signal-cyan cutting-room system, serif editorial labels, timeline rails, and original environmental plate match `.factory/design.md` and are distinct from a generic SaaS template. No runtime AI feature or provider key exists. The brief explicitly excludes AI image generation, while the implied imports, exports, local media, and engine handoff are present; no missing leverage finding is warranted.

## What would make this perfect

Implement reopened F-1-1 and F-2-1 through F-2-4, then rerun `npm run test:e2e`, the exact declared claims, and the cold 390 px and desktop checks. The job, tryable sandbox, privacy/offline behavior, and engine-handoff workflow are otherwise clear and evidenced; a pass requires removing these remaining navigation and copy defects too.
