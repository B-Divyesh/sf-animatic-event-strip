# Adversarial first-read review 1 — Animatic Event Strip

**Verdict: FAIL**

- Reviewed: 2026-08-28 UTC
- Live URL: <https://animatic-event-strip.sociobot.in>
- Candidate: `fdba68853a4bff1c302cad5e860b05e948b5ab5e`
- Method: fresh Chromium contexts at 390 × 844 and 1440 × 900; no product code changed.

## First 30 seconds

This passes the cold first-read test. Before scrolling, the site says **“Plan animation events before engine work.”** It is for **“solo 2D animators and small game teams”** and the first action is **“Try it with sample data.”** The adjacent note, **“Loads a filled 10-second strip,”** says what will happen. The same content was visible at 390 px and desktop with no console errors or body overflow.

## Findings

### F-1-1 — High: route changes do not move focus or announce the new route

**Location / evidence:** From the live home header, activating **Demo** loaded `/demo`; `document.activeElement` was `BODY`, not the page `<h1>`. Browser Back returned to `/` with focus still on `BODY`. The only `aria-live="polite"` region is the empty demo-status node; it is not populated on either navigation. Source search confirms no route-level focus or `popstate` handling.

**Why this matters:** Keyboard and screen-reader users receive no reliable indication that the editor has changed from an empty real project to the isolated sample project. Back also loses their reading position.

**Concrete fix:** On initial load, Demo navigation, and Back/Forward, focus the route `<h1>` (with `tabindex="-1"`) and set a polite route-status message such as “Demo loaded: Rain Gate sample strip.” Preserve/restore scroll and focus for Back/Forward. Add a browser test that activates Demo, goes Back, and asserts pathname, focused `<h1>`, and non-empty route announcement each time.

### F-1-2 — Medium: the landing page has no visible three-step “How it works” section

**Location / evidence:** The landing page goes from the live/empty strip to **“First pass”**, then **“Portable by design.”** The only three steps are hidden inside the **Quick guide** dialog. In demo mode the empty-state instruction is absent, so a visitor sees no short workflow explanation outside a dialog.

**Why this matters:** The site-structure contract requires a visible, scannable three-step explanation after the product preview. A first-time visitor must infer how to turn the sample into a handoff.

**Concrete fix:** Add a visible `How it works` section after the strip with the existing three concrete verbs: “Add boards”, “Align sound”, and “Name implementation moments.” Keep Quick guide as an optional expanded explanation. Add an assertion for the heading and three steps on `/` and `/demo`.

### F-1-3 — Medium: README makes an unlisted keyboard-access claim

**Location / quote:** README, **Keyboard and mobile**: “All actions use native buttons, forms, and dialogs.” “Tab reaches every control; Enter/Space activates it.” “In the timeline, Left/Right steps a focused event or the playhead by one frame, Shift+Left/Right by ten, and Home/End move the playhead to scene bounds.”

**Why this matters:** These are visitor-reliant accessibility and keyboard-operation claims, but `.factory/claims.json` contains no keyboard claim. Existing untagged regression tests do not make the promises an executable declared claim.

**Concrete fix:** Add one `keyboard-operation` claim and exactly one `@claim:keyboard-operation` demo test. The test should Tab to the documented controls, activate them with Enter/Space, verify Left/Right, Shift+Left/Right, Home, and End observable outcomes, and verify no focus loss. Alternatively remove the broad README promises and retain only behaviour covered by an existing declared claim.

### F-1-4 — Minor: README sentence exceeds the 22-word hard cap and contains unexplained jargon

**Location / quote (28 words):** README introduction: “It keeps storyboard ranges, local audio clips, semantic beats, sound cues, and interaction windows aligned in one engine-neutral strip before code and final assets lock the scene down.”

**Why this matters:** “Semantic beats” and “engine-neutral” are not plain language for a cold visitor, and the overloaded sentence delays comprehension.

**Concrete fix:** Replace with: “Keep storyboard ranges, audio clips, and named moments in one strip. Plan them before code and final assets lock the scene.”

### F-1-5 — Minor: README sentence exceeds the 22-word hard cap

**Location / quote (24 words):** README, **Test**: “Each end-to-end or local claim command builds the production artifact before starting vite preview, so it works after npm ci in a clean clone.”

**Why this matters:** This is build documentation, but the repository’s plain-words rule applies to README copy too.

**Concrete fix:** Replace with: “Each claim command builds the production artifact first. It then starts Vite preview and works after `npm ci` in a clean clone.”

### F-1-6 — Minor: README sentence exceeds the 22-word hard cap

**Location / quote (25 words):** README, **Test**: “The live-policy check intentionally targets the production Sociobot API and deployed product, so run it after deployment rather than as part of local unit tests.”

**Why this matters:** The deployment instruction is easy to miss when embedded in a long, technical sentence.

**Concrete fix:** Replace with: “The live-policy check calls the deployed product and Sociobot API. Run it after deployment, not with local unit tests.”

### F-1-7 — Minor: README sentence exceeds the 22-word hard cap

**Location / quote (29 words):** README, **Keyboard and mobile**: “In the timeline, Left/Right steps a focused event or the playhead by one frame, Shift+Left/Right by ten, and Home/End move the playhead to scene bounds.”

**Why this matters:** The actual keyboard help is dense enough that a visitor must parse four commands in one sentence.

**Concrete fix:** Replace with: “Left and Right move the selected event or playhead one frame. Hold Shift to move ten frames. Home and End jump to the scene start and end.”

### F-1-8 — Minor: README sentence exceeds the 22-word hard cap

**Location / quote (23 words):** README, **Privacy and payment**: “It restricts content sources and framing, disables unused browser capabilities, and gives content-addressed JS, CSS, art, and icons a one-year immutable cache lifetime.”

**Why this matters:** The sentence combines unrelated security and cache-policy details, with deployment jargon that obscures the instruction.

**Concrete fix:** Replace with: “The policy restricts content sources and framing. It also disables unused browser capabilities. Versioned assets use a one-year immutable cache.”

### F-1-9 — Minor: two headings are vague out of context

**Location / quote:** Landing h2 context labels **“First pass”** and **“Portable by design.”**

**Why this matters:** A screen-reader heading list does not say what either section contains. The latter is a marketing adjective rather than a task or outcome.

**Concrete fix:** Rename them to **“Start your first strip”** and **“Export this strip for engine work.”** Keep the current explanatory text beneath each heading.

### F-1-10 — Minor: several toolbar buttons do not name their result

**Location / quote:** Landing workspace buttons **“Import”**, **“Export”**, and license button **“Restore.”**

**Why this matters:** A cold visitor cannot tell what kind of data is imported/exported or what Restore restores without surrounding visual context.

**Concrete fix:** Use **“Import project”**, **“Choose export”** (or separate result-naming export buttons), and **“Restore Studio license.”** Preserve the existing concise names only where the action result is directly visible.

## Copy audit

Counts treat a hyphenated term, version, URL, and currency amount as one word. The audit covers all default-visible landing prose/labels and all README prose; command blocks and state-dependent dialog/error copy are excluded. Findings are annotated inline. No banned plain-words term was found. The terminology is mostly consistent: **project**, **strip**, **event**, **demo**, and **Studio Pack** are used consistently. The exceptions are the jargon and vague headings recorded in F-1-4 and F-1-9.

### Landing page

| Words | Copy |
| ---: | --- |
| 3 | Animation handoff planner |
| 6 | Plan animation events before engine work. |
| 18 | For solo 2D animators and small game teams planning frames, sound cues, and input windows before engine work. |
| 5 | Loads a filled 10-second strip. |
| 8 | The demo never opens or changes your project. |
| 6 | Your project stays on this device. |
| 6 | Reopens offline after your first visit. |
| 4 | Core exports are free. |
| 5 | Studio Pack costs $12 once. |
| 2 | Current strip |
| 7 | Start with the beat you can see. |
| 13 | Add a board image, then mark the sounds and implementation moments around it. |
| 4 | Everything is stored locally. |
| 3 | Portable by design — F-1-9 |
| 4 | One strip, several handoffs. |
| 7 | Project JSON reopens here with local media. |
| 17 | Adapter JSON and CSV stay implementation-neutral, with stable schema versions for Godot, Unity, or your own tools. |
| 5 | Turn markers into starter code. |
| 9 | The full planner and every core export are free. |
| 18 | A one-time Studio Pack adds direct Godot 4 and Unity 6 adapter source plus a printable handoff sheet. |
| 7 | Licenses are checked at most once daily. |
| 4 | Cached access works offline. |
| 5 | Built for sketches before systems. |
| 8 | Your project and media stay on this device. |
| 4 | Original AI-generated environmental artwork. |
| 2 | No analytics. |
| 4 | Built by Param Factory. |
| 4 | Version 1.0.0, repair 5. |

### README

| Words | Copy |
| ---: | --- |
| 16 | Animatic Event Strip is an offline-first timing board for solo 2D animators and small game teams. |
| 28 | It keeps storyboard ranges, local audio clips, semantic beats, sound cues, and interaction windows aligned in one engine-neutral strip before code and final assets lock the scene down. — F-1-4 |
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
| 10 | Run every observable product claim from a fresh demo sandbox: |
| 5 | Playwright is pinned to 1.58.2. |
| 24 | Each end-to-end or local claim command builds the production artifact before starting Vite preview, so it works after `npm ci` in a clean clone. — F-1-5 |
| 25 | The live-policy check intentionally targets the production Sociobot API and deployed product, so run it after deployment rather than as part of local unit tests. — F-1-6 |
| 8 | All actions use native buttons, forms, and dialogs. — F-1-3 |
| 8 | Tab reaches every control; Enter/Space activates it. — F-1-3 |
| 29 | In the timeline, Left/Right steps a focused event or the playhead by one frame, Shift+Left/Right by ten, and Home/End move the playhead to scene bounds. — F-1-3, F-1-7 |
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
| 23 | It restricts content sources and framing, disables unused browser capabilities, and gives content-addressed JS, CSS, art, and icons a one-year immutable cache lifetime. — F-1-8 |
| 15 | The HTML, manifest, service worker, and legal documents remain revalidatable so updates are discovered safely. |

## Demo and sandbox verification

**PASS.** The first click to `/demo` immediately showed a realistic **Rain Gate — opening beat** strip with six events: two board ranges, a waveform sound clip, a visual beat, an interaction window, and an implementation note. The persistent banner reads **“Demo — sample data, nothing is saved to your project”** and exposes **Reset demo** and **Start for real**. Reset restored six events.

In a direct fresh `/demo` context, IndexedDB contained only `demo:animatic-event-strip`; no real project database was opened. Leaving demo created the separate real `animatic-event-strip` database with zero events. The `local-storage-only`, `runtime-privacy`, and `offline-reload` claim tests passed; their browser flow uses same-origin requests and an offline demo reload.

## Claims and quality gates

All 14 declared claim commands passed after `npm ci` in this sandbox. The local browser commands each build and start their own production preview; the live-policy command passed with `checkout=303`, `rate-limit=429`, `retry-after=4`, and an immutable asset response.

| Claim ID | Result |
| --- | --- |
| sample-demo | PASS |
| editor-workflow | PASS |
| fps-options | PASS |
| audio-preview | PASS |
| local-storage-only | PASS |
| runtime-privacy | PASS |
| offline-reload | PASS |
| project-json-roundtrip | PASS |
| adapter-json-v1 | PASS |
| csv-export | PASS |
| cached-license-offline | PASS |
| license-lifecycle | PASS |
| studio-outputs | PASS |
| studio-checkout | PASS |

`npm test` passed (13 tests), as did `npm run lint`, `npm run typecheck`, and `npm run build`. The build produced `dist/` with 10.22 KB gzip JavaScript. The full e2e suite was also started; the individually-run claim commands above are the required claim evidence.

## Structure, accessibility, links, and identity

**Checked and passing:** route titles (`Animatic Event Strip — plan animation events`, `Demo — Animatic Event Strip`, Privacy, Terms, and a 404 title), one h1 per page, descriptions, canonical links, Open Graph/Twitter metadata, SVG/Apple favicon, `lang=en`, designed 404 with HTTP 404, robots, sitemap, CSP/security headers, header/footer links, and the visible skip link. Crawled internal links returned 200, except the intentional designed 404 route; mailto and checkout links are explicit external destinations. The visual system is distinct and matches the documented cutting-room thesis, not a generic SaaS template. The only structural failures are F-1-1 and F-1-2.

No additional AI feature is expected: AI image generation is an explicit brief non-goal, while the clearly implied import/export and engine-handoff capabilities are present. No provider key or runtime Azure endpoint was found.

## Earlier findings recheck

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. I read the earlier verification reports and handoff. Each historical finding below was confirmed fixed live and in the current code/tests; none is re-opened under its historical ID.

| Earlier ID | Current result |
| --- | --- |
| AES-QA-001 | Checkout live-policy claim passes with hosted 303 redirect. |
| AES-QA-002 | Live-policy claim observes 429 and numeric Retry-After. |
| AES-QA-003 | Current mobile target regression passes. |
| AES-QA-004 | Live CSP, frame protection, and permissions policy are present. |
| AES-QA-005 | Hashed asset cache policy is present and live-policy passes. |
| AES-QA-201 | Claims manifest exists; all declared commands passed. |
| AES-QA-202 | Isolated `/demo`, reset, exit, and sample data verified. |
| AES-QA-203 | Cold first screen plainly states job, audience, and first action. |
| AES-QA-301 | Existing keyboard frame-move regression passes. |
| AES-QA-302 | Existing edit-dialog focus-return regression passes. |
| AES-QA-303 | The prior listed public claims now have declared tests. F-1-3 identifies a separate README keyboard claim omitted from that manifest. |
| AES-QA-304 | Unknown route returns the designed HTTP 404. |
| AES-QA-305 | Route metadata and shared header/footer are present. |
| AES-QA-401 | Each local claim command built successfully without relying on a pre-existing `dist/`. |
| AES-QA-501 | `license-lifecycle` is now declared and passed its fixture-based test. |
| AES-QA-502 | Privacy correctly describes one current project, not history. |

## What would make this perfect

Implement F-1-1 through F-1-10, especially route-change focus/announcement and the missing visible three-step explanation. Then rerun the full cold mobile/desktop flow and the declared claims from a clean clone. The core product, honest demo, isolation, exports, and offline/privacy evidence are already strong; the remaining work is about making that quality equally clear and dependable on first use.
