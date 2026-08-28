# Animatic Event Strip — build handoff

Work order: `animatic-event-strip-build-1`

Completed: 2026-08-28

## What shipped

- A production Vite + TypeScript PWA in `dist/`, with its JavaScript and CSS inlined into the app shell for resilient offline startup.
- A frame-accurate, horizontally scrollable event strip for board-image ranges, local audio clips with calculated waveform snippets, and semantic visual-beat, sound-cue, interaction-window, and implementation-note markers.
- Project timing at 12/15/24/25/30/60 fps, timecode transport, click scrubbing, playback with aligned local audio, zoom, editing, named destructive confirmation, and keyboard frame movement.
- IndexedDB persistence for the active project and media. State survives refresh, tab close, and PWA installation; the save state is visible and failures tell the user to export a backup.
- Validated complete project import/export (`aes-project-1`, embedded media), lean adapter JSON (`animatic-event-strip/adapter` v1), and UTF-8 CSV. Core data portability is free.
- A $12 one-time Studio Pack using the Sociobot billing contract: hosted checkout link, query-token capture, local license restoration, optimistic cached unlock, daily verification, offline behavior, and revoked-license fallback. Paid downloads are Godot 4 GDScript, Unity 6 C#, and the print handoff sheet.
- Install manifest, 192/512/maskable icons, versioned service-worker shell caching, network-first navigation, cache-first art/assets, offline notice, fallback page, and update toast.
- Responsive 390px treatment, native dialogs and controls, designed focus states, reduced-motion overrides, safe-area spacing, legal pages, and no analytics/CDNs/runtime third parties.
- Original cinematic cutting-room art generated specifically for the product, reviewed and optimized to 36 KB mobile / 74 KB desktop WebP. Prompt, model, date, and license provenance are in `.factory/design.md` and `assets/src/`.

## Verification

Run from a clean checkout:

```sh
npm install
npm test
npm run build
npm run test:e2e
```

Verified locally on 2026-08-28:

- `npm test`: 5/5 Vitest tests pass (timecode, frame ranges, validation, adapter JSON, CSV).
- `npm run test:e2e`: 6 pass / 2 intentional profile skips. The same workflow is run on desktop and Pixel 5 profiles; mobile alone owns the offline-PWA and 390px-only assertions. Create, local-media attach, edit, IndexedDB reload, JSON export, offline reload, and mobile dialog paths pass.
- Axe WCAG 2 A/AA: zero serious or critical violations on desktop and mobile.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200; no console/page errors; `lang=en`; one `h1`; `main` present; 0 images missing alt; 0 unlabeled buttons. Report: `.factory/evidence/verify.json`.
- Lighthouse 12.8.2, mobile/default throttling against the production build: **Performance 100, Accessibility 100, Best Practices 100, SEO 100**. LCP 1.1 s, TBT 0 ms, CLS 0.014.
- Initial transfer: 60.45 KB app shell / 18.74 KB gzip, including 25.36 KB uncompressed JavaScript and 19.54 KB CSS; LCP WebP 36 KB. All are below the 200 KB JS, 50 KB CSS, 120 KB fonts, and 300 KB hero budgets. No font files ship.
- `npm audit --omit=dev`: 0 vulnerabilities.

## Known gaps / next steps

- The factory still needs to register the test and live billing products and exercise a real checkout/return token; no product ID is hardcoded. License verification behavior is implemented and degrades quietly offline.
- A five-person handoff pilot has not yet been run, so the brief’s “fewer than one ambiguous implementation question per scene” success measure remains to be validated with users.
- Audio decoding/playback depends on browser codec support. Unsupported files remain stored/exportable and receive a neutral placeholder waveform.
- This focused v1 keeps one active local scene. Multiple projects, cloud sync, engine execution, tweening, and animation authoring remain intentional non-goals.
