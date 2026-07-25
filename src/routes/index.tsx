import { createFileRoute } from "@tanstack/react-router";
import { GameScreen } from "@/components/game/GameScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "tic tac co" },
      {
        name: "description",
        content:
          "A dramatic hand-drawn duel on an 8x8 grid. Place X, O, or clear. First to sketch X-O-X in a line wins.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <GameScreen />;
}
