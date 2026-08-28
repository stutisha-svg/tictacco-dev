/**
 * TanStack index — shell only. Screen UI is owned by react-router-dom AppRoutes
 * inside the 390px frame in `__root.tsx`.
 */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "tic tac co" },
      {
        name: "description",
        content:
          "A hand-drawn 8x8 grid duel. Tap to place X, O, or clear. First to sketch X-O-X wins.",
      },
    ],
  }),
  component: () => null,
});
