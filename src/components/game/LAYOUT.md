# Game chrome layout

See `.cursor/rules/game-chrome-layout.mdc`.

- Centered column inside the **390px** mobile shell. Wheel must not resize it.
- **Visible arc width** = **88%** of grid (`WHEEL_CHORD_FRAC`). Full circle diameter is larger (solved from chord + peek) — do not set diameter = 0.88×board or the arc looks unchanged.
- Peek height locked to **~22.5% of board** — must not grow with diameter.
- Circle center under the grid; bottom arc peeks out; rest clipped.
- Stickers evenly spaced on the ring; status + timer below peek with no overlap.
- Drag horizontally to spin; tap a sticker to react.
