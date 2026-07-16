## XOX — Crayon Polish Pass

Only the listed items change. Win/lose badge visuals stay as-is.

### 1. Font + shape rendering (Caveat everywhere, no italics)
- `src/styles.css`: verify `--font-display` / `--font-hand` both load Caveat via the existing `<link>` in `__root.tsx`; add `font-style: normal !important` on the base body + explicit `font-style: normal` on all text tokens. Remove any `italic` classes if present.
- `Shape.tsx`: X/O currently render as text glyphs — confirm `font-style: normal`, `font-family: var(--font-display)`, and the crayon SVG filter is applied to the text. Winning/losing badge text keeps its current styling (may remain italic if it already is).

### 2. Minimized badge card + return to grid
- `GameScreen.tsx`: after the badge slide-in animation completes (~1.2s hold), animate the overlay to fade out the dim backdrop and shrink the badge + "play again" into a small rounded-rectangle **floating card** anchored bottom-center (above the bottom bar), ~260px wide, crayon border, off-white fill.
- The grid becomes visible + interactive-looking again (still frozen — no new taps accepted).
- The floating card contains the mini badge glyph + "play again" button; tapping restarts.
- Confetti / shake still fire during the full-size badge moment, not after minimize.

### 3. Player-driven timer + blank warning
- `useGameEngine.ts`: timer only starts when `myTentative` becomes non-null. Reset `timerStart` on first placement of the round; clearing the tentative (triple-tap) pauses/resets it.
- Opponent's lock waits for the player's timer to elapse — no auto-lock on blank.
- Add a "nudge" warning: if the player has been idle >8s with no tentative, show a **red crayon dot** pulsing next to the bottom bar label, and change label to "your move — rival is waiting". Dot disappears the moment they tap a tile.
- `RoundTimer.tsx`: accepts a `running` prop already; add an `idle` visual (empty rectangle with faint dashed crayon outline) when not running.

### 4. Louder XOX indicator
- `XoxIndicator.tsx`: increase shape size (~48px), thicker crayon strokes, and on each fill trigger:
  - a burst of 6–8 tiny crayon confetti glyphs (reuse `Confetti` primitives, scoped to that shape's bounding box)
  - a quick color flash halo (radial crayon-textured circle scaling 0→1.4, fading out over 500ms)
  - a spring scale bump (1 → 1.25 → 1)
- Add subtle idle "breathing" only on the leader's next-to-fill slot to draw the eye.

### 5. Winner crown (drawn, not popped)
- New `Crown.tsx`: SVG crown path (3 points + base line) with crayon filter, animated via `pathLength` 0→1 over ~700ms, colored in the winner's hue.
- `PlayerCards.tsx`: accepts `winner: Owner | null`; renders `<Crown>` absolutely positioned above that avatar's circle.
- Appears only after the badge minimizes (step 2), stays until "play again" (which reloads → gone).

### 6. Progress bar = rounded rectangle with squiggle fill
- `RoundTimer.tsx`: outer shape is a crayon-stroked rounded rectangle (~24px tall, full width of bottom bar area).
- Inside, a horizontally-sweeping **zigzag/squiggle path** (crayon-textured, thicker stroke) whose visible width grows with elapsed time (animate a clip-path or mask width from 0 → 100%).
- Squiggle color matches the tentative-shape color (orange when placed, muted grey when idle).

### 7. Collision: smoke-squiggle scribble
- Collision reveal: draw both players' shapes first (existing behavior), then overlay a new `SmokeScribble.tsx` — a spiraling, loopy black crayon path (bezier curves, roughly circular smoke coil) instead of the current jagged zig-zag. Animate `pathLength` 0→1 over ~500ms.
- Replace `DeadScribble` usage on collision tiles with `SmokeScribble`. Keep `DeadScribble` for any non-collision dead cases if applicable, or retire it if unused.

### 8. Straight grid lines, crayon texture only
- `Board.tsx`: grid rendering currently uses wobbled paths — replace with straight `<line>` elements (perfect x/y coords) but keep the crayon SVG filter (`feTurbulence` + `feDisplacementMap` with reduced `scale` so displacement only adds grain/width variance, not curvature). Increase `baseFrequency` for finer grain, drop `scale` from ~2 to ~0.6.
- Skeleton reveal keeps its current behavior on the new straight lines.

### 9. Reveal focus: dim + spotlight sweep + enlarged banner
- During `phase === "revealing"`:
  - Full-screen `bg-black/35` dim layer with a radial "hole" spotlight over the board area (SVG radial gradient mask, warm cream color).
  - Spotlight animates: sweeps left→right across the board over ~700ms in sync with the skeleton stroke reveal.
  - Bottom-bar label "revealing…" replaced by a larger centered banner (~text-heading-md, crayon-underlined, pulsing 1 → 1.05 → 1). Collision variant: "collision — tile wasted".
  - Banner and spotlight both exit when phase leaves `revealing`.

### 10. Scope guard
- No changes to: win/lose badge visuals + animation, WinBadge, Confetti glyph shapes, PlayerCards avatar look (only adds crown), design-system route, game rules, bot logic.

---

### Technical notes

- **Files created**: `src/components/game/Crown.tsx`, `src/components/game/SmokeScribble.tsx`, `src/components/game/RevealSpotlight.tsx`.
- **Files edited**: `styles.css`, `useGameEngine.ts` (timer trigger + idle warning state), `GameScreen.tsx` (badge minimize + spotlight/banner + warning dot + crown wiring), `RoundTimer.tsx` (rounded-rect squiggle + idle state), `Board.tsx` (straight lines, collision → SmokeScribble), `PlayerCards.tsx` (crown prop), `XoxIndicator.tsx` (bigger + confetti/flash), `Shape.tsx` (font-style normal), possibly `DeadScribble.tsx` removed if unused.
- **State additions**: `phase` gains an implicit "idle-timer" via `myTentative === null` check; add `idleWarning: boolean` derived from an internal 8s timeout when placing and no tentative; add `badgeMinimized: boolean` triggered ~1.2s after `phase === 'won'`.
- **Reset flow**: `reset()` continues to `window.location.reload()` — crown/streak state naturally gone.
- **No new deps.**
