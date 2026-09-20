# Routes

TanStack Start uses **file-based routing** for the app shell. Every `.tsx` file in this directory
defines a TanStack route. Do **not** create `src/pages/`, `src/routes/_app/index.tsx`, or
`app/layout.tsx` — those are Next.js / Remix conventions. The only root layout
is `src/routes/__root.tsx`.

## Product screens (react-router-dom)

Inside the 390px shell, **`AppRoutes.tsx`** mounts the game product with `react-router-dom`:

| Path | Screen |
| --- | --- |
| `/` | Home |
| `/game` | Live match (`GameScreen`) |
| `/tutorial` | Tutorial walkthrough |
| `/score` | Post-series scoring |
| `/achievements` | Achievements gallery |

Prefer adding new product pages under `src/features/<name>/` and registering them in `AppRoutes.tsx` rather than inventing a parallel pages tree.

## TanStack file conventions

| File | URL |
| --- | --- |
| `index.tsx` | `/` (TanStack entry; product home is also served via AppRoutes) |
| `about.tsx` | `/about` |
| `users/index.tsx` | `/users` |
| `users/$id.tsx` | `/users/:id` (dynamic — bare `$`, no curly braces) |
| `posts/{-$category}.tsx` | `/posts/:category?` (optional segment) |
| `files/$.tsx` | `/files/*` (splat — read via `_splat` param, never `*`) |
| `_layout.tsx` | layout route (renders children via `<Outlet />`) |
| `__root.tsx` | app shell — wraps every page; preserve `<Outlet />` |
| `design-system.tsx` | `/design-system` |

`routeTree.gen.ts` is auto-generated. Don't edit it by hand.
