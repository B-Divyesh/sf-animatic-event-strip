# Adversarial first-read review 3 — Animatic Event Strip

**Verdict: FAIL**

- Reviewed: 2026-08-28 UTC
- Live URL: <https://animatic-event-strip.sociobot.in>
- Repository candidate: `d593b232bc6db1cbfd22d7149eafa75e41f74fbd`
- Method: fresh Chromium contexts at 390 × 844 and 1440 × 900; clean clone at `/tmp/animatic-review-3.7SWjRo/repo`; no product code changed.

Two earlier accessibility findings are not fully closed. Under this review's rules, each is blocking. Four additional copy and structure findings remain.

## First 30 seconds

The cold first screen passes at both widths.

- **What it does:** it plans animation events before engine work.
- **For whom:** solo 2D animators and small game teams.
- **What to click first:** **Try it with sample data**. The adjacent copy says it loads a filled 10-second strip and does not change the visitor's project.

The exact first-screen text is **“Plan animation events before engine work.”**, **“For solo 2D animators and small game teams planning frames, sound cues, and input windows before engine work.”**, and **“Try it with sample data.”** At 390 px, the action, explanation, three facts, and start of **Current strip** all appear before scrolling. The page had no body overflow or application console error.

## Findings

### F-3-1 / F-1-1 — BLOCKING, reopened: legal route changes still lose focus and are not announced

**Exact location:** live footer **Privacy** link, then the **Terms** link. After each full-page navigation, `document.activeElement` is `BODY`; neither page has an `aria-live` route-status region. Browser Back returns to Privacy with focus still on `BODY`. In contrast, `/` and `/demo` focus their h1 and populate **“Planner loaded: your local project.”** or **“Demo loaded: Rain Gate sample strip.”**

**Why this fails:** F-1-1 required route entry and Back/Forward to focus and announce the new h1. Polish 2 verified only the app-shell `/` ↔ `/demo` path. A keyboard or screen-reader user gets no comparable route-change signal on Privacy or Terms.

**Concrete fix:** give each legal h1 `tabindex="-1"`; on load and `pageshow`, focus it and write the route name to a polite live region. Add a browser test that follows Home → Privacy → Terms → Back and asserts URL, focused h1, and announcement at each step.

### F-3-2 / AES-QA-003 — BLOCKING, reopened: mobile touch targets again fall below 44 × 44 px

**Exact location:** fresh 390 × 844 live measurements found these rendered targets:

| Route | Target | Size |
| --- | --- | ---: |
| `/privacy/` | `privacy@sociobot.in` | 161.8 × 19 px |
| `/privacy/` | footer **Demo** | 38.6 × 44 px |
| `/privacy/` | footer **Terms** | 38.3 × 44 px |
| `/terms/` | `support@sociobot.in` | 164.5 × 19 px |
| `/terms/` | footer **Demo** | 38.6 × 44 px |
| `/terms/` | footer **Terms** | 38.3 × 44 px |
| designed 404 | footer **Demo** | 38.6 × 44 px |
| designed 404 | footer **Terms** | 38.3 × 44 px |
| `/offline.html` | **Return to Event Strip** | 192.1 × 19 px |

**Why this fails:** the accessibility contract requires every touch target to be at least 44 × 44 px. AES-QA-003 previously named the Terms footer target and was marked repaired at 44 × 44 px. It is now 38.3 × 44 px on the shared legal layout. The current regression test checks only four targets on `/`, so the full suite passes while the legal and offline routes fail.

**Concrete fix:** apply a 44 px minimum inline and block size, or equivalent padding, to every legal/footer/offline link. Expand the mobile target test to `/privacy/`, `/terms/`, the 404, and `/offline.html`, including inline contact links.

### F-3-3 — Medium: the shared route skeleton is inconsistent and the offline route is incomplete

**Exact location:** the `/` and `/demo` header navigation contains **Demo**, **Open quick guide**, and save status. Privacy, Terms, and 404 instead contain **Demo**, **Privacy**, and **Terms**. `/offline.html` has no skip link, header, footer, meta description, canonical, Open Graph/Twitter metadata, favicon, or Apple-touch icon.

**Why this fails:** the site-structure contract requires a consistent header/footer and route metadata. The offline fallback is a real 200 route and the service worker can show it at the point of failure, when navigation must be most predictable.

**Concrete fix:** use one shared navigation set on all routes, including a visible Privacy link. Bring `/offline.html` into the same skeleton with a skip link, wordmark, navigation, footer, metadata, icons, and a 44 × 44 **Return to the planner** action. Add all public routes to the structure regression.

### F-3-4 — Medium: public outcome, provenance, and runtime claims are unlisted

**Exact quotes:** quick-guide h2 **“Build an unambiguous handoff”**; footer **“Original AI-generated environmental artwork”**; artwork dialog **“Generated for this product with the Param Factory image model on 28 August 2026”**, **“All interface marks are authored SVG strokes”**, and **“No third-party art or fonts are loaded”**; README **“Requires Node.js 20 or newer”** and **“The HTML, manifest, service worker, and legal documents remain revalidatable so updates are discovered safely.”**

**Why this fails:** none of these statements appears in `.factory/claims.json`. The first promises an unambiguous outcome even though the handoff records that the five-person ambiguity pilot has not run. The artwork statements make origin and asset-inventory promises without a tagged provenance test. The Node sentence includes unsupported 20.0–20.18 releases. The final sentence promises safe update discovery, while `studio-checkout` checks only selected security headers and immutable hashed assets; it does not assert revalidation for every named document or define “safely.”

**Concrete fix:** change the heading to **“Build an animation handoff”**. Remove unverifiable provenance adjectives or add one inventory/provenance claim with a tagged source-and-request audit. State the exact Node ranges and test the lowest supported versions. Replace the revalidation sentence with a concrete statement covered by a tagged update/cache test, or remove it.

### F-3-5 — Minor: several headings and buttons still do not use plain, result-naming words

**Exact locations and rewrites:** 

| Current copy | Problem | Proposed copy |
| --- | --- | --- |
| h2 **“Start with the beat you can see.”** | “beat” is vague in a heading list and does not name the first action. | **“Add the first board image.”** |
| guide heading **“Name implementation intent.”** and copy **“without binding them to methods.”** | “implementation intent” and “binding” are developer jargon. | **“Name engine events.”** and **“without naming engine methods.”** |
| error **“Give this event a short, implementation-ready label.”** | “implementation-ready” is jargon and does not explain what makes the label useful. | **“Give this event a short label that tells the implementer what to build.”** |
| error **“the end frame is exclusive”** | “exclusive” is schema jargon in an error that must tell the visitor what to do next. | **“Choose a start and end between frames 0 and 239. The end frame itself is not included.”** |
| timeline buttons **“Previous frame”**, **“Next frame”** | Nouns do not name the action. | **“Move to previous frame”**, **“Move to next frame”** |
| event button **“Delete”** | It does not name what will be deleted. | **“Delete event”** |
| export buttons **“Project JSON”**, **“Adapter JSON”**, **“Marker CSV”** | File-type nouns do not name the result-producing action. | **“Export Project JSON”**, **“Export Adapter JSON”**, **“Export Marker CSV”** |
| paid buttons **“Godot 4 adapter source”**, **“Unity 6 adapter source”**, **“Print handoff sheet”** | The first two are nouns; the third does not say it opens printing. | **“Download Godot 4 adapter”**, **“Download Unity 6 adapter”**, **“Open printable handoff”** |
| **“Board”**, **“Boards”**, **“0 cards”**, **“Storyboard cards”**, and **“visual range”** | Five terms name the same board-image event. | Use **“board”** for the item and **“board image”** for its file everywhere. |
| eyebrow **“Optional studio pack”** | It changes the capitalization of the named **Studio Pack** tier. | **“Optional Studio Pack”** |
| lane accessible name **“Semantic event markers”** | “Semantic” is unexplained and conflicts with the visible **Events** / documented **marker** terms. | **“Event markers”** |

No audited default-visible sentence exceeds 22 words and no banned marketing word appears. These remaining issues are action naming, heading context, and terminology.

### F-3-6 — Minor: README setup and storage wording is imprecise or jargon-heavy

**Exact quotes:** **“Requires Node.js 20 or newer.”**, **“Animatic Event Strip is an offline-first timing board…”**, **“Stores board images, audio blobs, calculated waveform snippets, markers, and notes in IndexedDB.”**, and **“Adapter JSON and CSV are deliberately media-light handoff formats…”**

**Why this fails:** Vite 7.3.6 declares `^20.19.0 || >=22.12.0`, so “Node.js 20 or newer” includes unsupported Node 20 releases. “Offline-first”, “audio blobs”, and “media-light” are implementation jargon in the opening and feature list.

**Concrete fix:** write **“Requires Node.js 20.19 or newer, or 22.12 or newer.”** Add the matching `engines.node` field and test the lowest supported runtime. Rewrite the opening as **“Animatic Event Strip is a timing board that works offline for solo 2D animators and small game teams.”** Replace “audio blobs” with **“audio files.”** Replace the last sentence with **“Adapter JSON and CSV include local filenames, but they exclude image and audio files.”**

## Copy audit

Counts treat a hyphenated term, code token, version, and currency value as one word; standalone symbols are excluded. The landing audit covers every sentence rendered in the default landing state. State-dependent dialog copy was also inspected; F-3-4 and F-3-5 record its flags. Controls and headings are listed separately. README command blocks and bare URLs are not sentences.

### Landing-page sentences

| Words | Sentence |
| ---: | --- |
| 5 | Planner loaded: your local project. |
| 6 | Plan animation events before engine work. |
| 18 | For solo 2D animators and small game teams planning frames, sound cues, and input windows before engine work. |
| 5 | Loads a filled 10-second strip. |
| 8 | The demo never opens or changes your project. |
| 6 | Your project stays on this device. |
| 6 | Reopens offline after your first visit. |
| 4 | Core exports are free. |
| 5 | Studio Pack costs $12 once. |
| 7 | Place each visual range on the strip. |
| 8 | Add local clips where the scene needs them. |
| 6 | Mark beats, cues, and input windows. |
| 7 | Start with the beat you can see. — F-3-5 |
| 13 | Add a board image, then mark the sounds and implementation moments around it. |
| 4 | Everything is stored locally. |
| 5 | Export formats for engine handoff. |
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
| 4 | Original AI-generated environmental artwork. |
| 2 | No analytics. |
| 4 | Built by Param Factory. |
| 4 | Version 1.0.0, polish 2. |

### Landing headings, controls, and status labels

| Words | Copy |
| ---: | --- |
| 4 | Skip to event strip |
| 3 | Animatic Event Strip |
| 1 | Demo |
| 3 | Open quick guide |
| 2 | Saved locally |
| 3 | Animation handoff planner |
| 5 | Try it with sample data |
| 4 | Add your own event |
| 2 | Current strip |
| 2 | Untitled scene |
| 2 | Import project |
| 2 | Choose export |
| 2 | Add event |
| 1 | Zoom |
| 2 | Three passes |
| 6 | How to build an animation handoff |
| 2 | Add boards |
| 2 | Align sound |
| 3 | Name implementation moments |
| 4 | Start your first strip |
| 4 | Add your first event |
| 6 | Export this strip for engine work |
| 3 | Optional Studio Pack |
| 3 | $12 one-time purchase |
| 3 | Buy Studio Pack |
| 3 | Free planner active |
| 3 | Have a license? |
| 3 | Restore Studio license |
| 3 | Show artwork provenance |

The remaining conditional button names were checked as follows: **Reset demo** (2), **Start for real** (3), **Close dialog** (2), **Choose image** (2), **Choose audio** (2), **Delete** (1), **Cancel** (1), **Add to strip** (3), **Save event** (2), **Save timing** (2), **Project JSON** (2), **Adapter JSON** (2), **Marker CSV** (2), **Godot 4 adapter source** (4), **Unity 6 adapter source** (4), **Print handoff sheet** (3), **Keep current** (2), **Replace project** (2), and **Update app** (2). F-3-5 flags the names that do not state their action/result.

### Conditional landing-page sentences

This table completes the landing audit for demo, dialog, offline, license, provenance, import, validation, and error states. Counts use representative values for interpolated project names, frames, filenames, and event numbers. Duplicate sentences already listed in the default-state table are not repeated.

| Words | Sentence |
| ---: | --- |
| 9 | Demo edits stay separate until you reset or leave. |
| 6 | Demo loaded: Rain Gate sample strip. |
| 11 | Your strip is available and every edit stays on this device. |
| 3 | Event strip timeline. |
| 9 | Use left and right arrows to move the playhead. |
| 7 | Give this event a short, implementation-ready label. — F-3-5 |
| 11 | Use a range inside frames 0–239; the end frame is exclusive. — F-3-5 |
| 5 | What must the implementer understand? |
| 3 | Replace this project? |
| 2 | Delete “Footstep”? |
| 2 | Open “Rain Gate”? |
| 10 | This removes the event and any media stored with it. |
| 8 | You can cancel and export a backup first. |
| 5 | Give this project a name. |
| 12 | Duration must be at least 12 frames to contain the current events. |
| 7 | The Studio adapters need a one-time license. |
| 8 | The project, adapter JSON, and CSV remain free. |
| 6 | The export could not be created. |
| 7 | This replaces “Untitled scene” on this device. |
| 10 | Export a backup first if you want to keep both. |
| 7 | The selected file could not be imported. |
| 5 | Cached Studio access is active. |
| 7 | Studio access is cached on this device. |
| 5 | License verification will resume online. |
| 6 | Connect once to verify this license. |
| 5 | The free planner works offline. |
| 8 | Studio access was checked within the last day. |
| 2 | License verified. |
| 4 | Studio downloads are ready. |
| 6 | This license is no longer active. |
| 13 | You can keep using the complete free planner or purchase a new license. |
| 10 | Could not refresh the license; cached Studio access remains active. |
| 5 | Could not verify right now. |
| 6 | Check your connection and try again. |
| 3 | Sample strip reset. |
| 7 | Start for real before restoring a license. |
| 8 | The demo does not read your saved access. |
| 7 | Paste the license token from your receipt. |
| 3 | Block the boards. |
| 7 | Give each visual range a plain-language label. — F-3-5 |
| 3 | Lay in sound. |
| 10 | Add local voice or effect clips and align their waveforms. |
| 3 | Name implementation intent. — F-3-5 |
| 11 | Mark beats, cues, and input windows without binding them to methods. — F-3-5 |
| 3 | ← → moves the playhead. |
| 12 | On a selected item, it moves one frame; hold Shift for ten. |
| 5 | A fresh version is ready. |
| 2 | Original scene. |
| 1 | Purpose. |
| 3 | No stock library. |
| 14 | Generated for this product with the Param Factory image model on 28 August 2026. — F-3-4 |
| 14 | The blue-hour cutting room establishes the planning context; it does not depict product output. |
| 7 | All interface marks are authored SVG strokes. — F-3-4 |
| 7 | No third-party art or fonts are loaded. — F-3-4 |
| 7 | Offline install is unavailable in this browser. |
| 5 | Your project still saves locally. |
| 4 | Local storage is unavailable. |
| 9 | You can still work and export from this tab. |
| 12 | The demo uses the free planner and does not read saved licenses. |
| 4 | Could not save locally. |
| 8 | Export a project backup before closing this tab. |
| 11 | This is not an Animatic Event Strip project (AES project 1). |
| 5 | The project name is missing. |
| 12 | Frames per second must be 12, 15, 24, 25, 30, or 60. |
| 7 | Project duration is outside the supported range. |
| 6 | The project event list is missing. |
| 4 | Event 1 is malformed. |
| 6 | Event 1 has an unknown type. |
| 7 | Event 1 needs an id and label. |
| 9 | Event 1 has a frame range outside the project. |
| 5 | Event 1 notes are malformed. |
| 7 | Event 1 has an unknown marker kind. |
| 5 | Event 1 contains invalid media. |
| 4 | Could not decode file.wav. |

No conditional sentence exceeds 22 words or contains a banned marketing word. F-3-5 records the remaining jargon and terminology failures.

### README sentences

| Words | Sentence |
| ---: | --- |
| 16 | Animatic Event Strip is an offline-first timing board for solo 2D animators and small game teams. — F-3-6 |
| 11 | Keep storyboard ranges, audio clips, and named moments in one strip. |
| 10 | Plan them before code and final assets lock the scene. |
| 12 | It opens a filled 10-second strip without reading or changing your project. |
| 12 | Reset demo restores the sample, and Start for real discards demo edits. |
| 13 | Builds a frame-accurate strip at 12, 15, 24, 25, 30, or 60 fps. |
| 13 | Stores board images, audio blobs, calculated waveform snippets, markers, and notes in IndexedDB. — F-3-6 |
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
| 5 | Requires Node.js 20 or newer. — F-3-6 |
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
| 15 | The HTML, manifest, service worker, and legal documents remain revalidatable so updates are discovered safely. — F-3-4 |

## Demo and sandbox

**PASS.** A fresh live browser first created **Review 3 real event** in the real project. One click on **Try it with sample data** opened `/demo`; the initial 390 px screen already showed **Rain Gate — opening beat**, **2 cards**, **1 clip**, and **3 markers**. The persistent banner reads **“Demo — sample data, nothing is saved to your project”** and exposes **Reset demo** and **Start for real**.

A temporary demo marker disappeared after Reset. A second demo marker disappeared after leaving, while **Review 3 real event** reappeared unchanged. Re-entering `/demo` showed the original six-event sample. The ordinary demo flow requested only `https://animatic-event-strip.sociobot.in`, set no license key, and emitted no application error. In a demo-only fresh context, only `demo:animatic-event-strip` is opened. A service-worker-controlled `/demo` reload succeeded with network disabled, retained the sample, and showed **Offline**.

## Claims

Every exact command in `.factory/claims.json` passed independently after `npm ci` in the clean clone. No declared claim is untested. F-3-4 records the two claim-like sentences that are not declared.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `sample-demo` | PASS | One-click sample, reset, discard, and real-data isolation. |
| `editor-workflow` | PASS | Create, edit, reload, and export. |
| `fps-options` | PASS | 12/15/24/25/30/60 fps options. |
| `audio-preview` | PASS | Stored WAV waveform and aligned playback start. |
| `local-storage-only` | PASS | Demo database only; same-origin requests. |
| `runtime-privacy` | PASS | No cookies, remote fonts/scripts, analytics request, or third-party flow. |
| `offline-reload` | PASS | Installed mobile demo shell and sample reload offline. |
| `keyboard-operation` | PASS | Documented activation and repeated frame movement retain focus. |
| `project-json-roundtrip` | PASS | Complete backup reopens; invalid input preserves current project. |
| `adapter-json-v1` | PASS | Every sample event exports under adapter schema 1. |
| `csv-export` | PASS | BOM/UTF-8 header and one row per sample event. |
| `cached-license-offline` | PASS | Cached valid Studio verdict keeps downloads available offline. |
| `license-lifecycle` | PASS | Daily cache, restoration, inactive fixtures, and free fallback. |
| `studio-outputs` | PASS | Godot 4, Unity 6, and print outputs. |
| `studio-checkout` | PASS | Checkout 303; rate limit 429 with `Retry-After: 4`; live policy and immutable asset passed. |

## Earlier finding recheck

I read both earlier reviews, both polish reports, every verification report, and the cumulative handoff. The table checks every unique earlier finding ID against live behavior and current code/tests.

| Earlier ID | Round-3 result |
| --- | --- |
| F-1-1 | **REOPENED / BLOCKING as F-3-1.** App-shell focus works; Privacy/Terms navigation and Back leave focus on `BODY` with no announcement. |
| F-1-2 | FIXED. The visible three-step workflow appears on `/` and `/demo`. |
| F-1-3 | FIXED. `keyboard-operation` is declared exactly once and passes. |
| F-1-4 | FIXED. The 28-word introduction and its earlier jargon are gone. |
| F-1-5 | FIXED. The clean-clone claim instruction is split and accurate. |
| F-1-6 | FIXED. The live-policy instruction is split and accurate. |
| F-1-7 | FIXED. Keyboard instructions are short and the tagged test passes. |
| F-1-8 | FIXED in its original long-sentence scope. The new unlisted update wording is F-3-4. |
| F-1-9 | FIXED for the named labels. **Start your first strip** and **Export this strip for engine work** are present. |
| F-1-10 | FIXED for the named controls. Import, export chooser, and license restoration have result names. |
| F-2-1 | FIXED. Demo, Privacy, and Terms are present in every app/legal/404 footer checked. |
| F-2-2 | FIXED. The two exact slogans were replaced. |
| F-2-3 | FIXED. Quick guide and artwork buttons use verbs; save feedback is a status. |
| F-2-4 | FIXED. The implementation-neutral/schema sentence was replaced with two plain sentences. |
| AES-QA-001 | FIXED. Hosted checkout returns 303 to Dodo. |
| AES-QA-002 | FIXED. Verification returns 429 with numeric `Retry-After`. |
| AES-QA-003 | **REOPENED / BLOCKING as F-3-2.** The shared legal Terms target is 38.3 × 44 px, and other route targets also fail. |
| AES-QA-004 | FIXED. CSP, anti-framing, referrer, nosniff, and permissions headers are live. |
| AES-QA-005 | FIXED. Hashed assets use one-year immutable caching. |
| AES-QA-201 | FIXED. The claims manifest exists and all exact commands pass. |
| AES-QA-202 | FIXED. `/demo` is seeded, isolated, resettable, disposable, and documented. |
| AES-QA-203 | FIXED. The cold first screen names the job, audience, action, result, privacy, offline behavior, and price. |
| AES-QA-301 | FIXED. Repeated keyboard movement retains event focus. |
| AES-QA-302 | FIXED. Closing event edit returns focus to the opening event. |
| AES-QA-303 | FIXED for its named audio/output/privacy claims. F-3-4 identifies different unlisted wording. |
| AES-QA-304 | FIXED. An unknown route returns the designed page with HTTP 404 and routes back. |
| AES-QA-305 | FIXED in its original home/legal/404 scope. F-3-3 records the untested offline route and inconsistent global header. |
| AES-QA-401 | FIXED. Each local claim command builds before preview from a clean clone. |
| AES-QA-501 | FIXED. License lifecycle is declared once and its fixture-backed test passes. |
| AES-QA-502 | FIXED. Privacy accurately describes one current project. |

## Structure, accessibility, links, and identity

Home, Demo, Privacy, Terms, and the designed 404 have route-specific titles, one h1, descriptions, canonicals, Open Graph/Twitter metadata, favicons, `lang=en`, and main landmarks. `/demo` deep links and `?demo=1` work. The designed unknown route returns HTTP 404. All intended internal destinations return 200; checkout returns an expected hosted 303; mail links are explicit. The 404 page's same-document skip target works despite the page's intentional HTTP 404.

Fresh Axe WCAG 2 A/AA scans found zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, `/offline.html`, and the designed 404. The worker URL verifier also passed `/demo`: correct title, language, one h1, main, complete image alternatives, labeled buttons, and no application console errors. These automated passes do not detect the manual focus and target-size failures in F-3-1 and F-3-2.

The charcoal, paper, cyan, coral, serif, film-strip geometry, original cutting-room art, and restrained motion match `.factory/design.md`. This is visually specific to animation pre-production and is not a generic SaaS template. Reduced-motion CSS is present; mobile pages have no body overflow.

## Quality gates

From the clean clone:

- `npm test`: PASS — 15/15.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run build`: PASS — `dist/` produced; initial JavaScript 29.26 kB / 10.42 kB gzip.
- `npm run test:e2e`: PASS — 47 passed, 3 intended cross-profile skips.
- `npm run test:pwa-update`: PASS — update toast shown, v9 activated, old cache removed.
- `/opt/fleet/lib/verify-url.sh https://animatic-event-strip.sociobot.in/demo`: PASS.

The passing suite does not cover legal-route focus, all-route touch geometry, the offline skeleton, or the unlisted copy claims.

## Missed leverage

No additional AI feature is justified. AI image generation is an explicit brief non-goal, the runtime has no provider key or Azure endpoint, and the product already includes the obvious import/export and engine-handoff paths. Cloud sync would conflict with the local-first scope unless introduced as a separate, explicit feature. No missed-leverage finding is recorded.

## What would make this perfect

Close F-3-1 through F-3-6, especially the two reopened blockers. Extend route tests beyond the app shell, enforce 44 × 44 px geometry on every public route, give the offline fallback the shared skeleton, remove the two unsupported outcome claims, and finish the remaining action/copy rewrites. Then rerun all 15 claim commands and the full cold mobile/desktop review. A PASS requires zero findings; this round has six.
