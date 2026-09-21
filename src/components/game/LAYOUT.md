# Game chrome layout

See `.cursor/rules/game-chrome-layout.mdc`.
For game scenarios, badges, and micro-interactions see [`MICRO_INTERACTIONS.md`](../../../MICRO_INTERACTIONS.md).
For product routes and feature folders see the root [`README.md`](../../../README.md).

- Wheel peeks from **bottom of the screen** (under status/timer), horizontally flipped, flush — no bottom margin/padding.
- **Visible arc width** = **88%** of grid (`WHEEL_CHORD_FRAC`). Full circle diameter is larger (solved from chord + peek).
- Peek height locked to **~22.5% of board** — must not grow with diameter.
- Stickers evenly spaced on the ring; status + timer sit **above** the wheel.
- Drag horizontally to spin; tap a sticker to react.
- Product lists (e.g. achievements) must keep the **390px frame height** fixed and scroll inside with a hidden scrollbar.
