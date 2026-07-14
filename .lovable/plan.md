
# XOX — Crayon Grid Duel

A portrait mobile web game. Two players (you vs an opponent — bot for the prototype, room-based multiplayer stub for later) tap an 8x8 grid to place shapes. Every 5-second round both moves reveal simultaneously with dramatic hand-drawn animation. First to draw a literal `X-O-X` sequence in a row/column/diagonal wins.

## Visual direction

Hand-drawn / crayon on off-white paper. No shadcn polish, no glassmorphism, no clean geometric borders.

- Background: warm paper (`#f4ecdc`) with subtle noise/grain (SVG turbulence filter).
- Grid: irregular, slightly wobbly lines drawn as SVG paths with `stroke-linecap: round` and a `feTurbulence` + `feDisplacementMap` filter so every stroke looks scratched.
- Shapes: X and O drawn as SVG paths with a "crayon" filter (roughness + slight opacity variation) — orange `#ff7a3d` for you, cyan `#39c6d9` for opponent.
- Typography: a hand-drawn display font (Google Font "Caveat" for headings, "Patrick Hand" for UI text). Loaded via `<link>` in `__root.tsx` head.
- Player cards: hand-drawn circles (wobbly SVG ellipse stroke), initials inside, name below in Caveat.
- Center XOX indicator: three light-grey crayon-stroked shapes between the two avatars.

## Screens & layout (portrait, single screen)

```text
┌───────────────────────────┐
│  ( You )  X O X  ( Opp )  │  ← player cards + center indicator
│  ▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░  │  ← 5s round progress (crayon bar)
│                           │
│   ┌─┬─┬─┬─┬─┬─┬─┬─┐       │
│   ├─┼─┼─┼─┼─┼─┼─┼─┤       │
│   │  8x8 crayon grid │    │
│   └─┴─┴─┴─┴─┴─┴─┴─┘       │
│                           │
│   Round 3   ✎ tap to play │
└───────────────────────────┘
```

## Interaction model

- Tap a tile: tentative X (your color, low opacity, wobble-in).
- Double-tap: tentative O.
- Triple-tap: clear tentative.
- Only one tentative tile per round; tapping a different tile moves the tentative.
- A round-wide 5s timer runs continuously (simultaneous rounds). Progress bar sits under the player cards.
- On timer end → lock-in phase → reveal.

## Round lifecycle

1. **Placement (5s)** — timer bar fills left→right in the player's color (or neutral crayon grey if no tentative yet).
2. **Lock** — tentative shape "settles": brief scale/opacity snap, ink darkens.
3. **Skeleton reveal (≈900ms)** — every empty tile the opponent could have touched gets a light crayon skeleton stroke animated along its border (SVG `pathLength` 0→1, staggered from the last-known opponent focus outward). Uses Framer Motion `motion.path` with `initial={{ pathLength: 0 }}` / `animate={{ pathLength: 1 }}`.
4. **Opponent shape draw** — on their chosen tile, the X or O is drawn stroke-by-stroke (path draw animation, ~500ms), color cyan.
5. **Collision resolution** — if both picked the same tile:
   - Both shapes are drawn overlapping.
   - A black scribble path scribbles across the tile (rapid multi-segment path, `pathLength` 0→1 in ~350ms) marking it wasted. Tile becomes permanently dead.
6. **Win check** — scan rows/cols/diagonals for adjacent triples matching the literal sequence `X,O,X` where all three tiles are owned by the same player. If found → win animation (winner's color floods the winning triple, screen shake, "YOU WIN" in Caveat).
7. Otherwise → next round starts, timer resets.

## Center XOX indicator (progress fill)

For each player, find their *best line* (row/col/diagonal) — the one where they're closest to completing an `X-O-X` triple they own. Their side of the three center shapes fills based on how many of the three positions are already correctly placed (0/3 grey → 1/3 partial crayon fill → 2/3 nearly full → 3/3 = win). Left shapes fill with orange for you, right shapes fill with cyan for opponent. Middle shape shared — fills toward whoever is leading.

## Opponent

Prototype ships with a bot (`selectBotMove(boardState)`), but the game state is structured so a future WebSocket/room layer can swap in a human opponent without refactoring components. No backend in this plan — pure client state.

- Bot difficulty: picks a random empty (non-dead) tile with light heuristic (prefer tiles that extend its own near-XOX line).
- Bot's move is chosen at round start but hidden until reveal.

## Technical details

- **Route**: replace `src/routes/index.tsx` placeholder with the game screen. Update `__root.tsx` head to real title/description ("XOX — a crayon duel").
- **Fonts**: add `<link>` for Caveat + Patrick Hand in `__root.tsx` head (not `@import` in CSS — per Tailwind v4 rule).
- **State**: single `useReducer` in `src/game/useGameEngine.ts` holding `board[64]`, `round`, `phase` ('placing' | 'locking' | 'revealing' | 'won'), `myTentative`, `opponentMove`, `deadTiles`, `winner`. Tap handler in `Tile` dispatches; a `useEffect` runs the 5s timer via `setTimeout` + `requestAnimationFrame` for smooth bar.
- **Components** (all in `src/components/game/`):
  - `GameScreen.tsx` — layout, owns engine hook.
  - `PlayerCards.tsx` — two crayon avatars + `XoxIndicator` between them.
  - `XoxIndicator.tsx` — three SVG shapes with per-side fill props.
  - `RoundTimer.tsx` — crayon progress bar (SVG rect with animated width; color = current tentative owner).
  - `Board.tsx` — SVG 8x8 grid with the wobble filter, renders 64 `Tile`s.
  - `Tile.tsx` — handles tap/double/triple detection (300ms window), renders tentative + committed shapes + dead scribble.
  - `Shape.tsx` — reusable X or O crayon SVG with draw-in animation.
  - `SkeletonReveal.tsx` — overlay that animates grid lines during reveal phase.
  - `WinOverlay.tsx` — final flourish.
- **Animation**: `framer-motion` (already in the ecosystem; install with `bun add framer-motion` if missing). All draw-ins use `motion.path` with `pathLength`. Wobble/tremble on hover uses `animate` loops. Screen shake on win via `motion.div` with keyframe `x`/`y`.
- **Tap detection**: custom hook `useTapCount` in `Tile` — count taps within a 300ms window, dispatch on window close (so triple-tap doesn't fire an X first). Trade-off: 300ms input latency per tap, which is acceptable for turn-based play.
- **Colors**: add crayon palette tokens to `src/styles.css` (`--paper`, `--ink`, `--player-you`, `--player-opp`, `--dead`) using `oklch`. No hardcoded hex in components — reference via CSS vars / Tailwind arbitrary values from tokens.
- **Grid wobble filter**: one shared `<defs><filter id="crayon">` with `feTurbulence baseFrequency="0.9"` + `feDisplacementMap scale="1.5"` used across all SVG strokes.
- **Head metadata**: real title, description, og:title, og:description, og:type, twitter:card in `__root.tsx`. Leaf `index.tsx` route sets a matching page head (no og:image — omit per guidance).

## Out of scope for this build

- Real multiplayer / room joining (bot only; state shape ready for it).
- Sound effects.
- Persistence / accounts.
- Landing / menu screen — game opens directly at `/`.

## Files to create / change

- Modify: `src/routes/__root.tsx` (head + font links), `src/routes/index.tsx` (mount `GameScreen`), `src/styles.css` (crayon tokens + paper background).
- Create: `src/game/useGameEngine.ts`, `src/game/bot.ts`, `src/game/rules.ts` (win detection, best-line scoring), `src/components/game/*` (list above), `src/components/game/CrayonDefs.tsx` (shared SVG filter/defs).
- Install: `framer-motion` if not already present.
