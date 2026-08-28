# Adversarial first-read review 5 — Animatic Event Strip

**Verdict: FAIL**

- Reviewed: 2026-08-28 UTC
- Live URL: <https://animatic-event-strip.sociobot.in>
- Candidate: `36b37945e91177de3ee1444c649c5658cd5514e9`
- Method: fresh Chromium contexts at 390 × 844 and 1440 × 900; disposable clean clone at `/tmp/animatic-review-5-clean.QK30Jo/repo`; no product code changed.

The product, sandbox, claims, accessibility baseline, and routes work. Seven copy and claims-manifest findings remain. The zero-finding acceptance rule therefore requires a fail.

## First 30 seconds

The cold first screen passes at both widths.

- **What it does:** plans animation events before engine work.
- **For whom:** solo 2D animators and small game teams.
- **What to click first:** **Try it with sample data**.

The exact supporting text is **“Plan animation events before engine work.”**, **“For solo 2D animators and small game teams planning frames, sound cues, and input windows before engine work.”**, and **“Loads a filled 10-second strip. Your project is not opened or changed.”** All were visible before scrolling at 390 px and desktop. The three privacy/offline/price facts were also visible. There was no horizontal body overflow or application console error.

## Findings

### F-5-1 — Medium: free core exports are an unlisted claim, and “core” does not identify them

**Exact locations:** landing first screen, **“Core exports are free.”**; Studio section, **“The full planner and every core export are free.”**; README, **“Exports stable adapter v1 JSON and UTF-8 CSV without a license.”**; locked-export state, **“The project, Adapter JSON, and CSV remain free.”**

**Why this fails:** A visitor can rely on which outputs remain free after declining or losing a Studio license. No entry in `.factory/claims.json` states that Project JSON, Adapter JSON, and CSV all export without a license. `license-lifecycle` states that the free planner remains available and checks one unlocked JSON control after an inactive verdict; the three export claims test file contents, not the no-license boundary. “Core exports” also makes the visitor find the later section to learn what is free.

**Concrete fix:** Replace both uses of **“core exports”** with **“Project JSON, Adapter JSON, and CSV exports.”** Add one claim such as `free-core-exports`: **“Project JSON, Adapter JSON, and CSV export without a Studio license.”** Add exactly one `@claim:free-core-exports` test that starts with no license, performs all three exports, and then repeats after a revoked fixture verdict.

### F-5-2 — Medium: the README mobile-layout promise is unlisted and only partly tested

**Exact location:** README, Keyboard and mobile: **“The phone layout stacks project controls while keeping the time axis horizontally scrollable.”**

**Why this fails:** No claim entry covers the responsive layout. The untagged 390 px regression checks that the body does not overflow, but it does not assert that controls stack or that the time axis itself remains horizontally scrollable. The sentence is therefore an unlisted observable claim.

**Concrete fix:** Add a `mobile-layout` claim with one tagged 390 px demo test. Assert the computed control layout, `timeline.scrollWidth > timeline.clientWidth`, and no body overflow. Otherwise remove the sentence.

### F-5-3 — Medium: the README makes an unlisted embedded-identifier claim

**Exact location:** README, Privacy and payment: **“Checkout is hosted by Sociobot/Dodo; no product or payment-provider IDs are embedded here.”**

**Why this fails:** `studio-checkout` proves the hosted redirect, price, rate limit, headers, and asset cache policy. It does not state or test the absence of embedded provider identifiers. The second clause is a separate source/privacy claim and is not useful enough to leave unverified.

**Concrete fix:** Prefer the plain, listed statement **“Checkout is hosted by Sociobot/Dodo.”** If the identifier promise is retained, add it to a claim and test the production bundle and public documents for the prohibited identifier forms.

### F-5-4 — Minor: “Three passes” is a decorative production metaphor

**Exact locations:** landing workflow eyebrow and Quick guide eyebrow, **“Three passes.”**

**Why this fails:** Read alone, “passes” does not say that the section contains three instructions. It is film-production mood copy where the plain-words rule requires an informative label.

**Concrete fix:** Use **“Three steps.”** in both places.

### F-5-5 — Minor: the export dialog uses a non-informative mood label

**Exact location:** export dialog eyebrow above **Export strip**, **“Take it with you.”**

**Why this fails:** The phrase could appear on any download screen and does not identify formats or export work.

**Concrete fix:** Replace it with **“Export options.”**

### F-5-6 — Minor: the offline h1 uses a stage metaphor

**Exact location:** `/offline.html` h1, **“The stage is offline.”**

**Why this fails:** The page title is heard first on route focus. “Stage” is product lore rather than the network state, contrary to the supplied plain-words rule.

**Concrete fix:** Use **“You are offline.”** Keep the cutting-room visual treatment in the art and layout.

### F-5-7 — Minor: the 404 h1 uses a frame-and-strip metaphor

**Exact location:** designed 404 h1, **“That frame is not on this strip.”**

**Why this fails:** A mistyped URL is not a missing animation frame. The heading delays the basic fact behind a product metaphor.

**Concrete fix:** Use **“Page not found.”** The following sentence already explains the likely cause and recovery.

## Copy audit

Counts treat hyphenated terms, versions, file names, code tokens, and prices as one word. No sentence exceeds 22 words. No banned marketing adjective appears. Findings F-5-1 and F-5-3 identify unclear or unlisted copy; F-5-4 through F-5-7 identify non-informative labels/headings.

### Landing page — default-visible sentences

| Words | Sentence |
| ---: | --- |
| 8 | Planner ready: your project has not been opened. |
| 6 | Plan animation events before engine work. |
| 18 | For solo 2D animators and small game teams planning frames, sound cues, and input windows before engine work. |
| 5 | Loads a filled 10-second strip. |
| 7 | Your project is not opened or changed. |
| 6 | Your project stays on this device. |
| 6 | Reopens offline after your first visit. |
| 4 | Core exports are free. — F-5-1 |
| 5 | Studio Pack costs $12 once. |
| 6 | Place each board on the strip. |
| 8 | Add local clips where the scene needs them. |
| 6 | Mark beats, cues, and input windows. |
| 5 | Add the first board image. |
| 13 | Add a board image, then mark the sounds and engine events around it. |
| 4 | Everything is stored locally. |
| 5 | Export formats for engine handoff. |
| 7 | Project JSON reopens here with local media. |
| 14 | Adapter JSON and CSV export frame data for Godot, Unity, or your own tools. |
| 6 | Both formats have a version number. |
| 5 | Turn markers into starter code. |
| 9 | The full planner and every core export are free. — F-5-1 |
| 18 | A one-time Studio Pack adds direct Godot 4 and Unity 6 adapter source plus a printable handoff sheet. |
| 3 | Have a license? |
| 7 | Licenses are checked at most once daily. |
| 4 | Cached access works offline. |
| 6 | Plan scene timing before engine implementation. |
| 8 | Your project and media stay on this device. |
| 3 | AI-generated environmental scene. |
| 2 | No analytics. |
| 4 | Built by Param Factory. |
| 4 | Version 1.0.0, polish 4. |

### Landing page — state-dependent sentences

| Words | Sentence |
| ---: | --- |
| 9 | Demo — sample data, nothing is saved to your project |
| 9 | Demo edits stay separate until you reset or leave. |
| 6 | Demo loaded: Rain Gate sample strip. |
| 11 | Your strip is available and every edit stays on this device. |
| 3 | Event strip timeline. |
| 9 | Use left and right arrows to move the playhead. |
| 13 | Give this event a short label that tells the implementer what to build. |
| 10 | Choose a start and end between frames 0 and 239. |
| 7 | The end frame itself is not included. |
| 5 | What must the implementer understand? |
| 3 | Replace this project? |
| 2 | Delete “Footstep”? |
| 3 | Open “Rain Gate”? |
| 10 | This removes the event and any media stored with it. |
| 8 | You can cancel and export a backup first. |
| 5 | Give this project a name. |
| 12 | Duration must be at least 12 frames to contain the current events. |
| 7 | The Studio adapters need a one-time license. |
| 8 | The project, Adapter JSON, and CSV remain free. — F-5-1 |
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
| 2 | Add boards. |
| 6 | Give each board a plain label. |
| 2 | Align sound. |
| 10 | Add local voice or effect clips and align their waveforms. |
| 3 | Name engine events. |
| 10 | Mark beats, cues, and input windows without naming engine methods. |
| 3 | ← → moves the playhead. |
| 12 | On a selected item, it moves one frame; hold Shift for ten. |
| 5 | A fresh version is ready. |
| 3 | AI-generated cutting-room scene. |
| 8 | Created for this product on 28 August 2026. |
| 6 | The scene sets the planning context. |
| 6 | It does not show app output. |
| 11 | Prompt and source details are recorded in the product’s visual thesis. |
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

### Landing headings, labels, and controls

The following headings and labels were checked with their word counts: **Animation handoff planner** (3), **Current strip** (2), **How to build an animation handoff** (6), **Three passes** (2, F-5-4), **Add boards** (2), **Align sound** (2), **Name engine events** (3), **Start your first strip** (4), **Export this strip for engine work** (6), **Optional Studio Pack** (3), **Place on strip** (3), **Project setup** (2), **Take it with you** (4, F-5-5), **Scene credit** (2), and **Please confirm** (2). The dynamic h2 labels are **Untitled scene** (2), **Add event** (2), **Edit event** (2), **Scene timing** (2), **Export strip** (2), **Build an animation handoff** (4), **Artwork provenance** (2), and **Replace this project?** (3). Status labels **Project unopened** (2), **Demo only** (2), **Free planner active** (3), and **Studio Pack unlocked** (3) are direct.

The action names checked were **Try it with sample data** (5), **Add your own event** (4), **Import project** (2), **Choose export** (2), **Add event** (2), **Open quick guide** (3), **Add your first event** (4), **Buy Studio Pack** (3), **Restore Studio license** (3), **Show artwork provenance** (3), **Reset demo** (2), **Start for real** (3), **Choose image** (2), **Choose audio** (2), **Delete event** (2), **Add to strip** (3), **Save event** (2), **Save timing** (2), **Export Project JSON** (3), **Export Adapter JSON** (3), **Export Marker CSV** (3), **Download Godot 4 adapter** (4), **Download Unity 6 adapter** (4), **Open printable handoff** (3), **Update app** (2), **Keep current** (2), and **Replace project** (2). They name their action or result. Standard **Cancel** and icon controls have contextual or explicit accessible names.

The hero image alternative is **“A lamplit storyboard desk overlooking a misty soundstage of painted forest flats”** (12 words). It describes the image’s purpose and contains no embedded required text.

### README sentences

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
| 11 | Exports stable adapter v1 JSON and UTF-8 CSV without a license. — F-5-1 |
| 9 | Imports and validates project backups before replacing local data. |
| 9 | Installs as a PWA and reopens the editor offline. |
| 19 | Optionally unlocks Godot 4 / Unity 6 starter adapters and a print handoff sheet through a one-time Sociobot license. |
| 21 | This is a pre-production tool, not an animation editor: it does not tween, generate art, animate characters, or execute engine events. |
| 9 | The landing page does not open either project database. |
| 10 | The demo stores edits in the separate `demo:animatic-event-strip` IndexedDB database. |
| 4 | Real projects use `animatic-event-strip`. |
| 14 | The complete claim list and one tagged browser test per claim are in `.factory/claims.json`. |
| 9 | Requires Node.js 20.19 or newer, or 22.12 or newer. |
| 12 | The static artifact is written to `dist/`, with `dist/index.html` at its root. |
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
| 13 | The phone layout stacks project controls while keeping the time axis horizontally scrollable. — F-5-2 |
| 10 | The active project is held under the `animatic-event-strip` IndexedDB database. |
| 5 | There is no server sync. |
| 10 | `.aes.json` uses `aes-project-1` and embeds selected media as data URLs. |
| 8 | Adapter JSON and CSV identify `animatic-event-strip/adapter` version `1`. |
| 7 | A range uses `start_frame` and `end_frame_exclusive` fields. |
| 8 | Project JSON is the backup and reopen format. |
| 14 | Adapter JSON and CSV include local filenames, but they exclude image and audio files. |
| 11 | No analytics, cookies, remote fonts, or third-party runtime scripts are present. |
| 15 | The only optional request is a Studio Pack license check to the Sociobot billing API. |
| 13 | Checkout is hosted by Sociobot/Dodo; no product or payment-provider IDs are embedded here. — F-5-3 |
| 7 | The policy restricts content sources and framing. |
| 6 | It also disables unused browser capabilities. |
| 7 | Versioned assets use a one-year immutable cache. |

README headings **What it does**, **Run locally**, **Test**, **Keyboard and mobile**, **Data and export schemas**, **Privacy and payment**, and **Project notes** all identify their sections. No README sentence is over the hard cap.

### Terminology

| Concept | Term used |
| --- | --- |
| Editable timeline document | project |
| Horizontal planning view | strip |
| Image-backed timeline item | board |
| Uploaded visual file | board image |
| Sound-backed timeline item | sound clip |
| Named engine moment | event marker |
| Complete reopenable backup | Project JSON |
| Frame-data handoff | Adapter JSON / CSV |
| Isolated sample workspace | demo |
| Paid output bundle | Studio Pack |

The board/board-image distinction is consistent. “Event” is the umbrella type; board, sound, and marker are its three explicit choices.

## Demo and sandbox behavior

**PASS.** One click on **Try it with sample data** opened `/?demo=1` and immediately showed **Rain Gate — opening beat**, two boards, one sound clip, and three markers. The persistent banner reads **“Demo — sample data, nothing is saved to your project”** and exposes **Reset demo** and **Start for real**.

In a fresh live context I seeded **REAL SENTINEL** in the real project, entered the demo, added **DEMO TEMP**, reset, and left. Reset removed the temporary event and restored Rain Gate. Leaving preserved the real sentinel. IndexedDB used `animatic-event-strip` and `demo:animatic-event-strip` as separate databases. The initial landing page had no database. The exact `sample-demo` test also instrumented every IndexedDB open and passed its blank and sentinel cases.

The complete live demo request log contained only the product origin. After service-worker control, a network-disabled reload retained the Demo title, banner, and Rain Gate sample. No real storage or saved Studio license was read by the direct demo path.

## Claims

All 17 listed commands ran independently and passed from the disposable clean clone. No declared claim is untested. F-5-1 through F-5-3 are separate unlisted-claim findings.

| Claim ID | Result | Evidence |
| --- | --- | --- |
| `sample-demo` | PASS | No real IndexedDB open/write; realistic seed, reset, discard, and exit. |
| `editor-workflow` | PASS | Create, edit, reload, and export. |
| `fps-options` | PASS | 12, 15, 24, 25, 30, and 60 fps. |
| `audio-preview` | PASS | Stored WAV waveform and aligned playback. |
| `local-storage-only` | PASS | Demo namespace and same-origin flow. |
| `runtime-privacy` | PASS | No analytics, cookies, remote fonts/scripts, or cross-origin planning request. |
| `asset-provenance` | PASS | Recorded prompt/source and bundled art. |
| `offline-reload` | PASS | Installed mobile demo reloaded offline with sample data. |
| `keyboard-operation` | PASS | Native activation and documented frame keys retain focus. |
| `project-json-roundtrip` | PASS | Complete backup reopens; invalid file preserves the project. |
| `adapter-json-v1` | PASS | Every sample event exports under adapter schema 1. |
| `csv-export` | PASS | UTF-8 header and one row per event. |
| `cached-license-offline` | PASS | Cached valid Studio access survives offline reload. |
| `license-lifecycle` | PASS | Daily cache, restoration, inactive fixtures, and free fallback. |
| `studio-outputs` | PASS | Godot 4, Unity 6, and print outputs. |
| `studio-checkout` | PASS | Checkout 303; verification 429 with `Retry-After: 4`; policy/cache checks. |
| `node-support` | PASS | Production build under Node 20.19.0. |

## Earlier findings rechecked live and in source

Every earlier review, polish report, verification history, and cumulative handoff was read. The full browser suite also runs the named regressions on desktop and mobile.

| Earlier ID | Round-5 confirmation |
| --- | --- |
| F-1-1 / F-3-1 | Fixed. Home, demo, legal, offline, and 404 h1s receive focus and a populated polite announcement; Back restores the route. |
| F-1-2 | Fixed. The visible three-step workflow appears on landing and demo. F-5-4 concerns only its decorative eyebrow. |
| F-1-3 / F-1-7 | Fixed. `keyboard-operation` is declared once and passed; README instructions remain short. |
| F-1-4 through F-1-6 / F-1-8 | Fixed. The cited README sentences remain rewritten and under 22 words. |
| F-1-9 / F-2-2 | Fixed. The cited vague workflow, export, and footer slogans remain replaced. F-5-4 through F-5-7 are different exact labels. |
| F-1-10 / F-2-3 | Fixed. Import, export chooser, guide, provenance, and license controls retain action names; save feedback remains status text. |
| F-2-1 | Fixed. Demo, Privacy, and Terms appear in every checked footer, including the current route. |
| F-2-4 | Fixed. Export copy explains what Adapter JSON and CSV contain. |
| F-3-2 / AES-QA-003 | Fixed. Every visible mobile link/button on all public routes measured at least 44 × 44 px. |
| F-3-3 / AES-QA-304 / AES-QA-305 | Fixed. Shared skeleton and metadata cover app, legal, offline, and designed HTTP 404 routes. |
| F-3-4 / AES-QA-201 / AES-QA-303 | Fixed for their exact prior outcome, provenance, runtime, Node, audio, and paid-output claims. F-5-1 through F-5-3 are newly identified sentences. |
| F-3-5 | Fixed for all exact prior controls, errors, headings, and board terms. |
| F-3-6 | Fixed. Exact Node ranges and plain storage/export wording remain. |
| F-4-1 / AES-QA-202 | Fixed. `/` is storage-free and `sample-demo` proves the CTA path never opens real storage. |
| AES-QA-001 / AES-QA-002 | Fixed. Hosted checkout returned 303; verification returned 429 with numeric `Retry-After`. |
| AES-QA-004 / AES-QA-005 | Fixed. Live CSP/anti-framing/capability headers and one-year immutable hashed assets passed. |
| AES-QA-203 | Fixed. The cold first screen states job, audience, first action, sample result, privacy, offline behavior, and price. |
| AES-QA-301 / AES-QA-302 | Fixed. Repeated keyboard movement retains focus; closing edit returns focus to its event. |
| AES-QA-401 | Fixed. Every local claim command builds before preview from the clean clone. |
| AES-QA-501 / AES-QA-502 | Fixed. License lifecycle remains declared/tested; Privacy describes one current project. |

## Structure, accessibility, links, and identity

**Passing checks:** home, query demo, `/demo`, Privacy, Terms, offline, and 404 have the required title patterns, one h1, descriptions, canonicals, Open Graph/Twitter metadata, product social image, SVG and Apple icons, `lang=en`, main landmark, skip link, shared navigation/footer, route announcement, and focused h1. The unknown route returns HTTP 404 with a way back. `robots.txt` and `sitemap.xml` are live. All discovered internal links returned 200; checkout returned its expected hosted 303; mail links are explicit. Back navigation, deep links, and 390 px target geometry passed.

Fresh Axe WCAG 2 A/AA scans found zero violations on every public route. The URL verifier reported HTTP 200, the Demo title, `lang=en`, one h1, a main landmark, complete alternatives, labeled buttons, and zero console/page errors. The designed 404 produces only the browser’s expected failed-document 404 console entry.

The charcoal, paper, cyan, coral, editorial serif, timeline rails, and original blue-hour cutting-room scene match `.factory/design.md`. The visual identity is specific to animation pre-production and is not a generic SaaS template. Reduced-motion rules are present. Initial JavaScript is 30.62 kB / 10.63 kB gzip.

## Quality gates

From `/tmp/animatic-review-5-clean.QK30Jo/repo` after `npm ci`:

- All 17 exact `.factory/claims.json` commands: PASS.
- `npm test`: PASS, 18/18.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run build`: PASS; `dist/index.html` produced.
- `npm run test:e2e`: PASS, 51 passed and 3 intentional profile skips.
- `npm run test:pwa-update`: PASS; update toast shown, v11 activated, old cache removed.
- `/opt/fleet/lib/verify-url.sh https://animatic-event-strip.sociobot.in/?demo=1`: PASS.

## Missed leverage

No missed-leverage finding results. The brief calls for image boards, waveform snippets, markers, frame labels, offline work, and JSON/CSV engine handoff; all are present. Project import/export, Godot/Unity starter adapters, and a printable handoff cover the obvious portability path. Runtime AI would be decorative here, and AI image generation is an explicit non-goal. No provider key, Azure endpoint, or decorative AI control is embedded.

## What would make this perfect

Resolve F-5-1 through F-5-7: declare and test the free-export and mobile-layout promises, remove or test the embedded-ID promise, and replace the four decorative/metaphorical labels with direct names. Then rerun the 17 exact claims, full desktop/mobile browser suite, live route crawl, and copy audit. A later review can pass only if it finds zero remaining issues.
