# Animatic Event Strip

Animatic Event Strip is an offline-first timing board for solo 2D animators and small game teams. It keeps storyboard ranges, local audio clips, semantic beats, sound cues, and interaction windows aligned in one engine-neutral strip before code and final assets lock the scene down.

Live product: <https://animatic-event-strip.sociobot.in>

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
npm test          # timing, validation, JSON/CSV adapters
npm run test:e2e # Chromium desktop/mobile, persistence, axe, offline
```

Playwright is pinned to 1.58.2. The end-to-end test starts `vite preview` automatically when one is not already running.

## Keyboard and mobile

All actions use native buttons, forms, and dialogs. Tab reaches every control; Enter/Space activates it. In the timeline, Left/Right steps a focused event or the playhead by one frame, Shift+Left/Right by ten, and Home/End move the playhead to scene bounds. The phone layout stacks project controls while keeping the time axis horizontally scrollable.

## Data and export schemas

The active project is held under the `animatic-event-strip` IndexedDB database. There is no server sync. `.aes.json` uses `aes-project-1` and embeds selected media as data URLs. Adapter JSON and CSV identify `animatic-event-strip/adapter` version `1`; ranges are represented as `start_frame` plus an exclusive `end_frame_exclusive`.

Project JSON is the backup/reopen format. Adapter JSON and CSV are deliberately media-light handoff formats; they include the original local filename but not file contents.

## Privacy and payment

No analytics, cookies, remote fonts, or third-party runtime scripts are present. The only optional request is a Studio Pack license check to the Sociobot billing API. Checkout is hosted by Sociobot/Dodo; no product or payment-provider IDs are embedded here. See [`public/privacy/index.html`](public/privacy/index.html) and [`public/terms/index.html`](public/terms/index.html).

## Project notes

- Product brief: [`.factory/brief.json`](.factory/brief.json)
- Visual system and generated-art provenance: [`.factory/design.md`](.factory/design.md)
- Build verification and known gaps: [`.factory/handoff.md`](.factory/handoff.md)
- License: MIT
