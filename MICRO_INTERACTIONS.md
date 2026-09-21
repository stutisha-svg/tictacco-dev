# Game environment — micro-interactions

A designer-facing guide to **what the player sees and feels** in tic tac co: moments, copy, motion, and how pieces of the UI stay in sync.

For layout measurements (wheel size, margins, frame), see [`LAYOUT.md`](./src/components/game/LAYOUT.md).

---

## How a game feels (the big picture)

Players duel on an **8×8** sketch grid. On your turn you tap a tile to place **X**, tap again for **O**, tap again to clear. Goal: complete **X–O–X** in a row, column, or diagonal.

A full **match** is several short games (**best of N**, chosen on New Game setup — default **3**, max **7**). Winning a game adds a point. A true **tie** (nobody can win) does **not** give anyone a point. Round timer length depends on mode (relaxed / timed / ???).

Most of the time you’re in one of three moods:

1. **Your turn** — grid is live, timer may be running, you can react with stickers  
2. **Reveal** — both moves lock in; we show what happened for a beat  
3. **Result** — big badge, then a smaller card; when the **series** ends → scoring screen

---

## Moments on the board

### Before anyone has tapped

**What you see**

- Status: *tap the grid to start*
- Timer: empty dashed outline (not filling)
- Grid: normal, ready to tap

**What happens**  
First tap on a tile starts the round and the timer.

---

### Waiting too long (~10 seconds)

If the player hasn’t placed a mark for **10 seconds**, three things light up **together** (they should always match). This covers:

- before the first tap of a round, and  
- after they **clear** their shape (timer paused) and sit idle  

| Piece | What it does |
| --- | --- |
| Status bar | Dark/inverted: *your move — rival is waiting* |
| Timer | Orange line **traces** around the outline (frozen fill stays if mid-round) |
| Grid | Soft **skeleton shimmer** over the cells, Figma tap icon (white fill), same waiting message |

The overlay is visual only — taps still go through to the grid.  
Placing a shape again clears waiting chrome and resumes the timer.

---

### During your turn

**Status**

- Default: *tap tile · again = O · again = clear*
- After a placement: *tap again to change · X* or *· O*

**Timer**  
Crayon squiggle **fills** left → right for the mode’s round length (default **~5 seconds** on timed; longer on relaxed, shorter on ??? / blitz).

**Grid**  
Empty cells cycle none → X → O → clear. Dead or already-taken cells don’t respond.

---

### Both players hit the same tile

**Feel:** that cell is ruined.

- Smoke / scribble on the cell  
- Status: *collision — tile wasted*  
- Rival may flash a reaction sticker  
- **Game keeps going** — this is not a win or a tie

---

### Major collision (both complete X–O–X at once)

**Feel:** big mid-game smash — **not** the end of the game.

- Full-screen badge slides in: **MAJOR COLLISION** / *keep playing*
- Status: *major collision — tiles are toast*
- Those winning lines get scribbled out after a short hold (~4 seconds including reveal)
- Play continues on the next turn

**Important for copy & art**  
Do **not** use **IT’S A TIE** here. New players will think the match ended.  
Reserve **IT’S A TIE** for when the game is actually over with no winner.

---

### Normal reveal (nothing dramatic)

- Status: *revealing rival's move…*
- Soft spotlight toward the rival’s tile  
- Short pause (~2 seconds), then the next turn

---

### You win

1. Big badge: **YOU WIN!** / *epic sketch* (slides in, slight spring, flash)  
2. Win confetti rains (stays on while the badge shrinks — don’t restart it)  
3. After ~1.6s → smaller card (~**80%** screen width)  
4. Crown appears over your avatar once the big badge minimizes  
5. When the **series** is over (`matchOver`): hold the full badge ~**3s**, then hand off to **`/score`** (scoring feature) — rematch / quit live there, not a “new match” CTA on the badge  

---

### You lose

1. Big badge: **YOU LOST** / *rival got it*  
2. Lose confetti + **ink pour** — the screen goes grey while avatars and the board stay in color  
3. Same minimize → smaller card pattern as a win  
4. Same series → **`/score`** handoff when the match is over  

---

### True tie (game over, nobody scored)

Happens when:

- the board is **full**, or  
- **neither** side can still make an X–O–X  

Also can happen right after a major collision if the scribbles leave no path to win.

- Badge: **IT’S A TIE** / *nobody scored*  
- Then the same minimized card as win/lose  
- No point for either player  

---

## Result badges at a glance

| Situation | Big title | Small line under it | Does play continue? |
| --- | --- | --- | --- |
| You completed X–O–X | YOU WIN! | epic sketch | No → result card |
| Rival completed X–O–X | YOU LOST | rival got it | No → result card |
| Board stuck / full | IT’S A TIE | nobody scored | No → result card |
| Both completed X–O–X same turn | MAJOR COLLISION | keep playing | **Yes** → scribble & continue |

**Motion language (all big badges)**  
Enter from the right → settle with a soft bounce → halo flash → exit toward the left when dismissed.  
The small result card should feel like the **same ribbon**, just shrunk.

---

## Status + timer (always paired)

| Player moment | Status text | Look | Timer |
| --- | --- | --- | --- |
| Waiting 10s (no mark / paused) | your move — rival is waiting | Alert (dark bar) | Outline tracing |
| Ready, under 10s | tap the grid to start | Calm info | Dashed, empty |
| Taking a turn | tap tile · again = O · again = clear | Calm info | Filling |
| Mark already placed | tap again to change · shape | Calm info | Filling |
| Watching reveal | revealing rival's move… | Calm info | Idle |
| Same-tile clash | collision — tile wasted | Warm warn | Idle |
| Double X–O–X | major collision — tiles are toast | Warm warn | Idle |

---

## Reactions & stickers

- **Wheel** sits at the **bottom of the phone**, under the timer, flush to the edge (no bottom gap)  
- Only a **low arc** shows; the rest of the circle is hidden  
- Arc spans most of the grid width (~88%); height of that peek stays fixed  
- Drag sideways to spin; tap a sticker  
- Your sticker pops in a **paper thought cloud** above your avatar (~2.5 seconds)  
- Rival can react on reveals, collisions, and when they win  

---

## Screen chrome (the “desk”)

| Piece | Intent |
| --- | --- |
| Phone frame | Fixed mobile width (~390px); paper stays inside rounded corners; **do not grow frame height** for long lists |
| Checkered paper | Soft background texture; doesn’t spill outside the frame |
| Scribble | Light doodle in the upper area — atmospheric, not interactive |
| Top bar | Torn-paper strip flush to the top; logo (optional on home) + menu / profile / **settings** |
| Settings gear | Brief crayon rotate on tap → paper **Settings** overlay (volumes, contrast, language, tutorial, quit, report feedback) |
| Achievement nudge | Irregular paper drawer peeks under the top bar while a badge is tracked or just unlocked — tap opens detail |
| Status bar | Game status cycles with achievement banners (~3.5s); tap a banner for the same detail modal |
| Achievement modal | Hand-drawn sheet: how to win the badge + cycling winner pills (icon, name, country) |

---

## Product surfaces (outside the live match)

### Home (`/`)

- Kraft CTA stack: **NEW GAME**, invite, tutorial, achievements  
- New Game keeps the same Link chrome as before; click opens setup (does not navigate until **start match**)

### New Game setup (home modal)

1. **Game mode** — three sketch buttons only: `relaxed` / `timed` / `???` (no chips/blurbs). Pick advances automatically.  
2. **Game count** — slider **3–7** (default 3); subtitle: select number of games for the match.  
3. One fixed cream paper shell for both steps; content **fades in place** (shell does not resize/slide away).  
4. Circular crayon **back** (top-left): closes on mode, returns to mode on count.  
5. Navigates to `/game` with `{ mode, gameCount }` router state → engine `roundMs` + `matchTarget`.

### Settings (TopBar)

- Sketch-framed controls (same wobble language as New Game buttons)  
- Tutorial → `/tutorial`; Quit game → `/`  
- Contrast sets `data-contrast` on `<html>` for future CSS hooks  
- Close: crayon **X** in circle (top-left)

### Tutorial (`/tutorial`)

- Namespaced `Tutorial*` UI; static frames + rules panel  
- Reaction strip is **tap-only** (not the live spin wheel)  
- Must not rewrite live `GameScreen` / `ReactionWheel` / `RoundTimer`

### Scoring (`/score`)

- After series `matchOver` (~3s full badge hold)  
- Profiles, best-of, **groop XP**, rematch → `/game`, quit → `/`  
- All `Scoring*`-prefixed under `src/features/scoring/`

### Achievements gallery (`/achievements`)

- Cream summary card + sketch badge cards with per-badge trackers  
- Screen height **locked to the phone frame**; list uses **invisible** inner scroll  
- Floating **back home** FAB: sketch ink button + crayon left-arrow, **20px** above bottom  
- Tap card → shared `AchievementModal`  
- Static catalog (scoped demo progress) — separate from in-match nudge tracking  

---

## Rough timings (for motion specs)

| Moment | About how long |
| --- | --- |
| Time to place after first tap | ~5s timed (relaxed / ??? differ via New Game mode) |
| Normal reveal pause | ~2 seconds |
| Major collision hold (reveal + badge) | ~4 seconds |
| Idle “rival is waiting” appears | after 10 seconds with no mark (pre-start or paused clear) |
| Big result badge before it shrinks | ~1.6 seconds |
| Series-over badge hold before `/score` | ~3 seconds |
| Achievement status / nudge cycle | ~3.5 seconds per slide |
| Achievement unlock flash (nudge + status) | ~5.5 seconds |
| Achievement winner pill cycle | ~2.4 seconds |
| New Game step content fade | ~0.22 seconds (paper shell stays put) |
| Settings gear rotate on open | short spring (~45°) |

---

## Design guardrails

- **MAJOR COLLISION** = mid-game drama; play continues.  
- **IT’S A TIE** = game over; nobody won.  
- Achievement banners cycle in the status bar — don’t steal space beside the board.  
- Waiting state = status + timer + grid shimmer **as one beat**.  
- Waiting overlay must never block taps on the grid.  
- Widening the reaction wheel shouldn’t make the visible arc **taller**.  
- Confetti for win/lose should feel continuous — shrinking the badge shouldn’t restart it.  
- Minimized win/lose/tie cards stay around **80%** of the screen width, not full bleed.  
- Feature modals / galleries: cream `var(--paper)`, sketch outlines, `var(--font-display)` — don’t invent a second visual system.  
- Never grow the **390px frame** height for content; scroll inside instead.  
- Don’t overwrite existing CTAs/chrome when adding flows (e.g. New Game stays a Link shell).

---

## Where this lives in the repo (for handoff)

You don’t need these to design — useful when pairing with engineering:

- Board & waiting shimmer → `Board.tsx`, `BoardWaitingOverlay.tsx`  
- Status & timer → `GameScreen.tsx` (status card), `RoundTimer.tsx`  
- In-match achievements → `achievements.ts`, `AchievementNudge.tsx`, `AchievementModal.tsx`, status cycle in `GameScreen.tsx`  
- Achievements gallery → `src/features/achievements/`  
- Badges & mini card → `WinBadge.tsx`, minimized card in `GameScreen.tsx`  
- Series scoring → `src/features/scoring/` (+ `useScoringMatchOverHandoff` from GameScreen)  
- New Game setup → `src/features/home/newGame/`  
- Settings → `src/features/settings/` + `TopBar.tsx`  
- Tutorial → `src/features/tutorial/`  
- Wheel & clouds → `ReactionWheel.tsx`, `PlayerCards.tsx`  
- Rules for wins / draws → `src/game/rules.ts`, `useGameEngine.ts`  
- Routes → `src/routes/AppRoutes.tsx`
