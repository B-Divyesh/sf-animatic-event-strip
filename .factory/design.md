# Animatic Event Strip — visual thesis

## Direction

**Cinematic environmental art: the cutting room at blue hour.** The interface feels like a practical location-scout notebook laid over a dim projection desk: charcoal rails, warm paper labels, a signal-cyan playhead, and coral sound cues. The scene art establishes a quiet, pre-production world—a rain-dark stage, distant flats, and a work light—without pretending the product animates anything. Chrome stays restrained so frame cards, timing, and semantic markers remain the subject.

This is intentionally a single dark treatment. Animatic review is usually done alongside image and audio work where stable luminance matters; painting every surface explicitly avoids unpredictable OS theme shifts. Contrast is maintained with warm off-white type rather than pure white.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#11191d` | app background / projection room |
| `--ink-raised` | `#19252a` | tool surfaces |
| `--slate` | `#24343a` | selected rails and dividers |
| `--paper` | `#f2ead8` | primary text, field surfaces |
| `--paper-dim` | `#b8b4a8` | secondary text (7.6:1 on ink) |
| `--signal` | `#65e3d1` | playhead, focus, primary actions |
| `--signal-ink` | `#092b2a` | text on signal |
| `--ember` | `#ff8b6b` | audio cues and warnings |
| `--gold` | `#edc778` | interaction windows / time labels |
| `--success` | `#9bd38d` | saved / licensed states |
| `--danger` | `#ff9a8c` | destructive actions |

Fine timeline rules use semi-transparent paper, but state is never communicated by color alone: every marker has a type label or icon and all statuses include text.

## Typography

- **Headings / editorial labels:** Georgia, `Times New Roman`, serif. Its film-credit character makes scene titles feel authored without shipping a font file.
- **UI / timecode / data:** system sans (`Inter`-like platform stack) and `ui-monospace` for frame counts. These are fast, familiar, and license-free.
- Scale: 12px metadata, 14px controls, 16px body, 20px section titles, 32–48px product title. Body copy stays at 16px minimum. Numeric timing uses tabular figures.

## Spacing and shape

An 8px base rhythm with 4px for optical nudges. Major gutters are 24px desktop and 16px phone. Surfaces use 2–12px corner radii: small radii keep the utility feeling like edited film stock rather than soft consumer cards. All controls are at least 44px tall. Borders are 1px warm-gray; selected items gain a 2px signal edge and subtle inner light.

## Interaction grammar

- The playhead is the visual spine: scrubbing or keyboard stepping updates it immediately.
- Frame cards are independent shots and therefore use physical cards; marker rows remain compact rails rather than nested cards.
- Add actions originate beside the rail they affect. Editing opens a focused dialog and returns focus to the originating item.
- Timeline items can be selected with click or Tab; Arrow Left/Right moves selected items by one frame, Shift+Arrow by ten. Reorder controls have explicit labels for non-pointer paths.
- Destructive changes require a named confirmation; project replacement via import also confirms.
- On phones, inspector copy and secondary project metadata stack below controls; the timeline deliberately stays horizontally scrollable because shrinking time would destroy meaning.

## Motion policy

State changes use 180–240ms opacity and transform transitions: dialogs rise 8px from their trigger plane; the update toast enters from the lower edge; the playhead moves without easing to preserve timing accuracy. There is no ambient or looping motion. With `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed and state changes become instant opacity swaps.

## Original asset plan and provenance

### `cutting-room.webp` / responsive derivatives

- Purpose: compact introductory/empty-state environmental plate, not a product screenshot.
- Use case: `stylized-concept`.
- Art direction / prompt: “A cinematic environmental concept painting of a small independent animation cutting room at blue hour, viewed across a rain-dark soundstage. A single practical work lamp illuminates a low editing desk with blank storyboard cards and a strip of unmarked film; distant painted forest flats dissolve into teal mist. Wide 2.4:1 composition, quiet pre-production mood, gouache and matte-painting texture, charcoal blue-black shadows, warm parchment highlights, restrained signal-cyan reflections and one muted coral cable. No people, no screens with UI, no readable text, no letters, no numbers, no logos, no watermark, no branded or copyrighted characters.”
- Generated with the Param Factory Azure image deployment (`factory-image`) on 2026-08-28; original to this product. The image is decorative/atmospheric and disclosed as AI-generated in the footer.
- Review checklist: reject accidental text, logos, recognizable characters, malformed furniture, prominent visual seams, or palette drift. Ship only reviewed WebP derivatives, each under 300 KB.

All interface icons are original inline SVG strokes authored for this product. No third-party fonts, clips, scripts, photos, or character assets are included.
