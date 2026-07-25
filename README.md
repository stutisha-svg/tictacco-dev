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
| `/` | The game |
| `/design-system` | Live token & component reference |

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
│   ├── routes/               # file-based routes (see routes/README.md)
│   │   ├── __root.tsx        # app shell, fonts, meta ("tic tac co")
│   │   ├── index.tsx         # game at /
│   │   └── design-system.tsx # design reference at /design-system
│   ├── game/                 # pure game logic (no React UI)
│   │   ├── rules.ts          # board size, X-O-X win lines, shapes
│   │   ├── useGameEngine.ts  # turn/timer/match state hook
│   │   └── bot.ts            # rival placement helper
│   ├── components/
│   │   ├── game/             # all game chrome & visuals (see below)
│   │   └── ui/               # generic shadcn-style primitives (mostly unused by game)
│   ├── hooks/
│   └── lib/                  # utils, Lovable error reporting
├── public/                   # static assets (e.g. fonts)
└── .cursor/rules/            # Cursor agent layout rules for game chrome
```

### Game UI (`src/components/game/`)

| File | Role |
| --- | --- |
| `GameScreen.tsx` | Top-level layout: profiles → board → timer; mounts wheel, confetti, overlays |
| `Board.tsx` / `Shape.tsx` | 8×8 grid + crayon X/O marks |
| `PlayerCards.tsx` / `XoxIndicator.tsx` | Avatars, match score, X-O-X progress |
| `RoundTimer.tsx` | Idle “rival is waiting” outline trace; fill when the round runs |
| `ReactionWheel.tsx` | Sticker wheel docked to the **viewport right** (drag + inertia) |
| `reactions.ts` / `ReactionSticker.tsx` | Reaction catalog + renderer (kaomoji interim; `assetSrc` ready) |
| `layoutChrome.ts` / `LAYOUT.md` | Board/wheel sizing constants and layout notes |
| `AchievementRail.tsx` | Reward badges **left of the grid** |
| `WinBadge.tsx` / `Confetti.tsx` | Win/lose/tie chrome + continuous confetti |
| `InkPourOverlay.tsx` / `DeadScribble.tsx` / … | Loss / dead-cell flourishes |

---

## Design system

**Live page:** `/design-system`  
**Source of truth for tokens:** `src/styles.css`  
**Interactive demos:** `src/routes/design-system.tsx` (swatches, type scale, buttons, game widgets)

### Visual language

- Paper cream background, ink outlines, hand-drawn / crayon feel
- Display font stack: **Crayon Libre** → Caveat → Patrick Hand
- Player you = orange (`--player-you`); rival = cyan (`--player-opp`)
- Achievements / accents use purple (`--accent-purple`)

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

### Layout rules (game chrome — still in flux)

Documented in `src/components/game/LAYOUT.md` and `.cursor/rules/game-chrome-layout.mdc`:

- **Centered column:** profiles → board → timer (`max-w-[460px]`, centered). Side chrome must not resize/off-center that stack.
- **Reaction wheel:** `position: fixed; right: 0`; diameter ≈ **75%** of grid height; only ~**20–25%** of the circle width peeks on-screen.
- **Achievements:** left of the grid (not above it in document flow).
- Cells stay **≥ 44×44px** (board ≥ 352px) when the viewport allows.

**Known open item for the meeting:** wheel size vs. overlap on narrow screens still needs tuning — don’t treat the current peek/diameter as final product polish.

---

## Git + Lovable

This repo is connected to **Lovable** (see `AGENTS.md`):

- **Do** commit and push normally — changes sync into Lovable.
- **Don’t** force-push or rebase/amend/squash commits that are already on the remote (that rewrites Lovable history).

Cursor ↔ Lovable workflow: commit + push from one tool, pull before editing in the other.

---

## Quick product summary

- Match play with a round timer and rival bot placements
- Reaction stickers via the right-edge wheel
- Win / lose / tie badges, confetti, ink-pour on loss
- Branding name: **tic tac co** (X-O-X remains the win mechanic copy)
