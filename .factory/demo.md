# Animatic Event Strip demo sandbox

Open <https://animatic-event-strip.sociobot.in/demo>, open `?demo=1`, or choose **Try it with sample data** on the first screen.

The demo starts with a 10-second, 24 fps scene called **Rain Gate — opening beat**. Its six events include two boards, one sound clip, and three event markers. The labels and notes show a realistic animator-to-engine handoff.

Demo edits use the separate IndexedDB database `demo:animatic-event-strip`. Demo mode never opens the real `animatic-event-strip` database or reads a saved Studio license. **Reset demo** restores the six original events. **Start for real** clears the demo record before returning to the real workspace; the real project remains unchanged.

The sample is bundled in the application JavaScript and works after the demo's first online visit. Claim tests always start in a fresh Playwright browser context and use `/demo` as their entry point.
