# Game environment — micro-interactions

A designer-facing guide to **what the player sees and feels** in tic tac co: moments, copy, motion, and how pieces of the UI stay in sync.

For layout measurements (wheel size, margins, frame), see [`LAYOUT.md`](./LAYOUT.md).

---

## How a game feels (the big picture)

Players duel on an **8×8** sketch grid. On your turn you tap a tile to place **X**, tap again for **O**, tap again to clear. Goal: complete **X–O–X** in a row, column, or diagonal.

A full **match** is several short games (usually best of three). Winning a game adds a point. A true **tie** (nobody can win) does **not** give anyone a point.

Most of the time you’re in one of three moods:

1. **Your turn** — grid is live, timer may be running, you can react with stickers  
2. **Reveal** — both moves lock in; we show what happened for a beat  
3. **Result** — big badge, then a smaller card with “play again”

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

### Waiting too long to start (~10 seconds)

If the player hasn’t tapped the grid for **10 seconds**, three things light up **together** (they should always match):

| Piece | What it does |
| --- | --- |
| Status bar | Dark/inverted: *your move — rival is waiting* |
| Timer | Orange line **traces** around the outline (no fill) |
| Grid | Soft **skeleton shimmer** over the cells, tap icon, same waiting message |

The overlay is visual only — taps still go through to the grid.  
As soon as they tap, waiting chrome goes away and the round starts.

---

### During your turn

**Status**

- Default: *tap tile · again = O · again = clear*
- After a placement: *tap again to change · X* or *· O*

**Timer**  
Crayon squiggle **fills** left → right for about **5 seconds**.

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
3. After ~1.6s → smaller card (~**80%** screen width) with **play again** / **new match**  
4. Crown appears over your avatar once the big badge minimizes  

---

### You lose

1. Big badge: **YOU LOST** / *rival got it*  
2. Lose confetti + **ink pour** — the screen goes grey while avatars and the board stay in color  
3. Same minimize → smaller card pattern as a win  

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
| Waiting 10s to start | your move — rival is waiting | Alert (dark bar) | Outline tracing |
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
| Phone frame | Fixed mobile width (~390px); paper stays inside rounded corners |
| Checkered paper | Soft background texture; doesn’t spill outside the frame |
| Scribble | Light doodle in the upper area — atmospheric, not interactive |
| Top bar | Torn-paper strip flush to the top; logo + menu/profile/settings |
| Achievements | Small rewards **beside** the grid on the left — don’t shove the board |

---

## Rough timings (for motion specs)

| Moment | About how long |
| --- | --- |
| Time to place after first tap | 5 seconds |
| Normal reveal pause | ~2 seconds |
| Major collision hold (reveal + badge) | ~4 seconds |
| Idle “rival is waiting” appears | after 10 seconds with no tap |
| Big result badge before it shrinks | ~1.6 seconds |
| Thought cloud on screen | ~2.6 seconds |

---

## Design guardrails

- **MAJOR COLLISION** = mid-game drama; play continues.  
- **IT’S A TIE** = game over; nobody won.  
- Waiting state = status + timer + grid shimmer **as one beat**.  
- Waiting overlay must never block taps on the grid.  
- Widening the reaction wheel shouldn’t make the visible arc **taller**.  
- Confetti for win/lose should feel continuous — shrinking the badge shouldn’t restart it.  
- Minimized win/lose/tie cards stay around **80%** of the screen width, not full bleed.

---

## Where this lives in the repo (for handoff)

You don’t need these to design — useful when pairing with engineering:

- Board & waiting shimmer → `Board.tsx`, `BoardWaitingOverlay.tsx`  
- Status & timer → `GameScreen.tsx` (status card), `RoundTimer.tsx`  
- Badges & mini card → `WinBadge.tsx`, minimized card in `GameScreen.tsx`  
- Wheel & clouds → `ReactionWheel.tsx`, `PlayerCards.tsx`  
- Rules for wins / draws → `src/game/rules.ts`, `useGameEngine.ts`
