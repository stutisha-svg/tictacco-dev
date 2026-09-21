# Start here — tic tac co

Hand-drawn **8×8** duel: place X / O / clear on a shared grid. First to sketch **X-O-X** wins. Built with **Vite + TanStack Start + React**, crayon UI tokens, and Lovable-compatible git sync.

This doc is the meeting handoff: how to run the app, where things live, and how the design system works.

---

## Run the app

**Requires:** [Bun](https://bun.sh) (preferred) or Node 20+.

```bash
# from repo root
bun install
bun run dev
```

Then open the URL Vite prints (often `http://localhost:8080/` in the Lovable/Vite sandbox; otherwise check the terminal).

| Script | What it does |
| --- | --- |
| `bun run dev` | Local dev server |
| `bun run build` | Production build |
| `bun run preview` | Preview the production build |
| `bun run lint` | ESLint |

Useful URLs while developing:

| URL | Page |
| --- | --- |
| `/` | Home (CTAs: new game, invite, tutorial, achievements) |
| `/game` | Live match |
| `/tutorial` | Static rules walkthrough |
| `/score` | Post-series scoring (after matchOver) |
| `/achievements` | Badge gallery |
| `/design-system` | Live token & component reference |

Product screens are wired in `src/routes/AppRoutes.tsx` (react-router-dom inside the 390px shell). TanStack file routes still own `__root.tsx` / `/design-system` — see `src/routes/README.md`.

---

## Repo map (what lives where)

```
tictacco/
├── AGENTS.md                 # Lovable note: don't rewrite published git history
├── package.json              # scripts + deps
├── vite.config.ts            # Lovable TanStack Start Vite config
├── src/
│   ├── styles.css            # crayon design tokens, typography utilities
│   ├── router.tsx / start.ts / server.ts
│   ├── routeTree.gen.ts      # auto-generated — don't hand-edit
│   ├── routes/               # TanStack shell + AppRoutes (see routes/README.md)
│   │   ├── __root.tsx        # 390px frame, fonts, meta ("tic tac co")
│   │   ├── AppRoutes.tsx     # /, /game, /tutorial, /score, /achievements
│   │   └── design-system.tsx # design reference at /design-system
│   ├── features/             # product surfaces (namespaced by feature)
│   │   ├── home/             # HomeScreen, CTAs, newGame setup modal
│   │   ├── tutorial/         # Tutorial* walkthrough (not GameScreen chrome)
│   │   ├── scoring/          # Scoring* post-series results
│   │   ├── settings/         # TopBar settings overlay + prefs
│   │   └── achievements/     # Achievements* gallery
│   ├── game/                 # pure game logic (no React UI)
│   │   ├── rules.ts          # board size, X-O-X win lines, shapes
│   │   ├── useGameEngine.ts  # turn/timer/match state (optional matchTarget/roundMs)
│   │   └── bot.ts            # rival placement helper
│   ├── components/
│   │   ├── game/             # live match chrome & visuals (see below)
│   │   └── ui/               # generic shadcn-style primitives (mostly unused by game)
│   ├── hooks/
│   └── lib/                  # utils, Lovable error reporting
├── public/                   # static assets (homescreen, top-bar, game-env, fonts)
└── .cursor/rules/            # Cursor agent layout rules for game chrome
```

### Product features (`src/features/`)

| Feature | Route / entry | Notes |
| --- | --- | --- |
| `home/` | `/` | Kraft CTAs; **New Game** opens setup modal (does not deep-link straight to `/game`) |
| `home/newGame/` | modal on home | Mode (relaxed / timed / ???) → game count slider 3–7 → `/game` with router state |
| `tutorial/` | `/tutorial` | `Tutorial*`-prefixed static walkthrough; tap-only reaction strip |
| `scoring/` | `/score` | After matchOver (~3s); groop XP, rematch / quit |
| `settings/` | TopBar gear | Paper overlay: SFX/game volume, contrast, language, tutorial, quit; prefs in localStorage |
| `achievements/` | `/achievements` | Static gallery; frame-height + invisible scroll; FAB **back home**; tap → `AchievementModal` |

Keep feature prefixes (`NewGame*`, `Tutorial*`, `Scoring*`, `Achievements*`, `Settings*`) so ownership is obvious at a glance. Do not fold tutorial/scoring chrome into `GameScreen` except thin handoff hooks.

### Game UI (`src/components/game/`)

| File | Role |
| --- | --- |
| `GameScreen.tsx` | Top-level layout: profiles → board → timer; mounts wheel, confetti, overlays |
| `Board.tsx` / `Shape.tsx` | 8×8 grid + crayon X/O marks |
| `PlayerCards.tsx` / `XoxIndicator.tsx` | Avatars, match score, X-O-X progress |
| `RoundTimer.tsx` | Idle “rival is waiting” outline trace; fill when the round runs |
| `ReactionWheel.tsx` | Sticker wheel docked to the **bottom of the phone** (drag + inertia) |
| `reactions.ts` / `ReactionSticker.tsx` | Reaction catalog + renderer (kaomoji interim; `assetSrc` ready) |
| `layoutChrome.ts` / `LAYOUT.md` | Board/wheel sizing constants and layout notes |
| [`MICRO_INTERACTIONS.md`](./MICRO_INTERACTIONS.md) | Game scenarios, UI states, chrome + feature micro-interactions (repo root) |
| `TopBar.tsx` | Global kraft strip; settings gear rotates and opens `SettingsMenu` |
| `CrayonCloseIcon.tsx` / `CrayonBackIcon.tsx` | Crayon-grain circle controls (settings close / back / FAB) |
| `achievements.ts` / `AchievementNudge.tsx` / `AchievementModal.tsx` | In-match badge catalog, nudge, detail sheet |
| `WinBadge.tsx` / `Confetti.tsx` | Win/lose/tie/collision chrome + continuous confetti |
| `BoardWaitingOverlay.tsx` | Idle skeleton + tap cue (synced with status/timer) |
| `InkPourOverlay.tsx` / `DeadScribble.tsx` / … | Loss / dead-cell flourishes |

---

## Design system

**Live page:** `/design-system`  
**Source of truth for tokens:** `src/styles.css`  
**Interactive demos:** `src/routes/design-system.tsx` (swatches, type scale, buttons, game widgets)

### Visual language

- Paper cream background, ink outlines, hand-drawn / crayon feel
- Display font stack: **Crayon Libre** → Caveat → Patrick Hand (`var(--font-display)` for headings / UI labels — avoid one-off decorative stacks on feature chrome)
- Player you = orange (`--player-you`); rival = cyan (`--player-opp`)
- Achievements / accents use purple (`--accent-purple`)
- Modals / sheets fill with **`var(--paper)`** (cream), sketch wobble outlines, dashed purple inner stroke — same language for New Game, Settings, Achievement detail, scoring cards

### Core CSS variables (in `:root`)

| Token | Use |
| --- | --- |
| `--paper` / `--ink` / `--ink-soft` | Page & copy |
| `--player-you` / `--player-opp` | Player colors |
| `--accent-purple` / `--accent-purple-soft` | Achievements |
| `--ink-brown` | Softer outlines |
| `--dead` | Dead / ink-pour states |
| `--font-display` / `--font-hand` | Headings & crayon UI text |

Typography utilities live in `styles.css` (`text-display`, `text-body-md`, `text-micro`, …). Prefer these over one-off font sizes in game chrome.

### Layout rules (game chrome)

Documented in `src/components/game/LAYOUT.md` and `.cursor/rules/game-chrome-layout.mdc`:

- **Phone frame:** ~**390px** wide (`__root.tsx`); product screens must **not** grow the frame height — use inner invisible scroll when lists are long (e.g. achievements).
- **Centered column:** profiles → board → timer, centered inside the frame. Side chrome must not resize/off-center that stack.
- **Reaction wheel:** flush at the **bottom of the screen** (under status/timer); visible arc ≈ **88%** of grid width; peek height locked — don’t grow peek when widening the arc.
- **In-match achievement chrome:** nudge under top bar + status banners — not a side rail that resizes the board.
- Cells stay **≥ 44×44px** (board ≥ 352px) when the viewport allows. Cap board at **390px**.

---

## Git + Lovable

This repo is connected to **Lovable** (see `AGENTS.md`):

- **Do** commit and push normally — changes sync into Lovable.
- **Don’t** force-push or rebase/amend/squash commits that are already on the remote (that rewrites Lovable history).

Cursor ↔ Lovable workflow: commit + push from one tool, pull before editing in the other.

---

## Quick product summary

- Home launch screen with kraft CTAs
- New Game setup: pace + best-of (3–7), then match
- Match play with round timer (mode-dependent) and rival bot placements
- Reaction stickers via the bottom-edge wheel
- Win / lose / tie badges, confetti, ink-pour on loss; series → scoring + groop XP
- Settings from TopBar; tutorial walkthrough; achievements gallery
- Branding name: **tic tac co** (X-O-X remains the win mechanic copy)
