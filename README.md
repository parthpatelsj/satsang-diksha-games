# 🦁 Sinh Santano Charkho

TV kiosk game for the SJBM foyer — Mission Sinh Santano, Satsang Diksha challenge.
Kids walk up, spin the Charkho wheel, play a quick bonus arcade game, answer a
shlok challenge, and capture beads on the 25-bead mala board for their group
(Bal 2A / Bal 2B / Bal 3). A full turn takes about 60–90 seconds.

## Run it

```bash
npm install
npm run dev          # local development
npm run build        # production build → dist/
npm run preview      # serve the production build
```

For the foyer TV: `npm run build`, serve `dist/` (or `npm run preview`), open
it in a browser in fullscreen/kiosk mode. **Keep the tab in the foreground** —
browsers pause animations in background tabs. All state lives in
`localStorage`, so standings survive refreshes and reboots.

## Game flow

Attract mode (board + rotating standings/ticker/shlok-of-the-day/goal)
→ Tap to play → pick group → enter name (on-screen keyboard)
→ spin the **Charkho Wheel** (5 challenge types)
→ **Bonus arcade round** (random: Diya Catch / Lion Leap / Mala Tap — winning
earns a 🪔 Second Chance, one wrong answer forgiven; skippable)
→ shlok challenge (45s limit)
→ correct = capture a bead (Lion Round steals from another group)
→ celebration → back to attract.

Anti-hogging: the same name can't play twice within 3 minutes
(toggle in admin; tapping the 🦁 on the blocked screen 5× overrides).
Abandoned turns auto-return to attract after 75s.

## Editing shloks

Everything lives in [src/data/shloks.js](src/data/shloks.js). Each shlok has:

- `chunks` — the 4 rhythm chunks (2 per line) used for Word Scramble and
  Finish the Line
- `anchors` — the anchor words, blanked first in Missing Words and shown on
  the result screen
- `meaning` — short English meaning, used for Arth Match

To add shloks 26–50, append entries with `id: 26 … 50` — the admin batch
switcher unlocks new batches automatically.

## Admin panel

Open it by tapping the title 5 times on the attract screen, or the faint ⚙
button in the bottom-right corner. From there you can:

- switch batch (1–25, 26–50, …)
- undo the last capture
- reset the current board or everything
- export / import results as JSON
- toggle the 3-minute player cooldown

## Testing hook

In the browser console, `window.__forceGame = 'diya' | 'lion' | 'mala'`
forces which bonus game appears next.
