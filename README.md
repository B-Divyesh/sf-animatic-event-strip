# Animatic Event Strip

Animatic Event Strip is an offline-first timing board for solo 2D animators and small game teams. Keep storyboard ranges, audio clips, and named moments in one strip. Plan them before code and final assets lock the scene.

Live product: <https://animatic-event-strip.sociobot.in>

One-click demo: <https://animatic-event-strip.sociobot.in/demo>. It opens a filled 10-second strip without reading or changing your project. **Reset demo** restores the sample, and **Start for real** discards demo edits.

## What it does

- Builds a frame-accurate strip at 12, 15, 24, 25, 30, or 60 fps.
- Stores board images, audio blobs, calculated waveform snippets, markers, and notes in IndexedDB.
- Previews the timeline and aligned browser-supported audio locally.
- Exports a complete `.aes.json` backup with embedded media.
- Exports stable adapter v1 JSON and UTF-8 CSV without a license.
- Imports and validates project backups before replacing local data.
- Installs as a PWA and reopens the editor offline.
- Optionally unlocks Godot 4 / Unity 6 starter adapters and a print handoff sheet through a one-time Sociobot license.

This is a pre-production tool, not an animation editor: it does not tween, generate art, animate characters, or execute engine events.

The demo stores edits in the separate `demo:animatic-event-strip` IndexedDB database. Real projects use `animatic-event-strip`. The complete claim list and one tagged browser test per claim are in [`.factory/claims.json`](.factory/claims.json).

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Production build (the deployment command):

```sh
npm run build
```

The static artifact is written to `dist/`, with `dist/index.html` at its root.

## Test

```sh
npm test                 # model plus release-policy regression tests
npm run lint             # ESLint for TypeScript and test sources
npm run typecheck        # TypeScript without emitting files
npm run test:e2e         # Chromium desktop/390px mobile, persistence, axe, offline
npm run test:live-policy # checkout, rate limit, live headers/cache, and identity
```

Run every observable product claim from a fresh demo sandbox:

```sh
node -e "for (const c of require('./.factory/claims.json')) console.log(c.test)"
```

Playwright is pinned to 1.58.2. Each claim command builds the production artifact first. It then starts Vite preview and works after `npm ci` in a clean clone.

The live-policy check calls the deployed product and Sociobot API. Run it after deployment, not with local unit tests.

## Keyboard and mobile

Use Tab to reach planner controls. Enter or Space opens the focused button. Left and Right move the selected event or playhead one frame. Hold Shift to move ten frames. Home and End jump to the scene start and end. The phone layout stacks project controls while keeping the time axis horizontally scrollable.

## Data and export schemas

The active project is held under the `animatic-event-strip` IndexedDB database. There is no server sync. `.aes.json` uses `aes-project-1` and embeds selected media as data URLs. Adapter JSON and CSV identify `animatic-event-strip/adapter` version `1`; ranges are represented as `start_frame` plus an exclusive `end_frame_exclusive`.

Project JSON is the backup/reopen format. Adapter JSON and CSV are deliberately media-light handoff formats; they include the original local filename but not file contents.

## Privacy and payment

No analytics, cookies, remote fonts, or third-party runtime scripts are present. The only optional request is a Studio Pack license check to the Sociobot billing API. Checkout is hosted by Sociobot/Dodo; no product or payment-provider IDs are embedded here. See [`public/privacy/index.html`](public/privacy/index.html) and [`public/terms/index.html`](public/terms/index.html).

Production response policy is declared in [`public/staticwebapp.config.json`](public/staticwebapp.config.json). The policy restricts content sources and framing. It also disables unused browser capabilities. Versioned assets use a one-year immutable cache. The HTML, manifest, service worker, and legal documents remain revalidatable so updates are discovered safely.

## Project notes

- Product brief: [`.factory/brief.json`](.factory/brief.json)
- Visual system and generated-art provenance: [`.factory/design.md`](.factory/design.md)
- Build verification and known gaps: [`.factory/handoff.md`](.factory/handoff.md)
- License: MIT
