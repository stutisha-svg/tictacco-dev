/**
 * TutorialSpotlightOverlay — board-local dim with a hole on one tile.
 * Uses the same cell math as Board / TutorialTileBlink (no viewport / fixed).
 * Feature-local — not a GameScreen overlay.
 */
import { SIZE } from "@/game/rules";

type TutorialSpotlightOverlayProps = {
  tile: number;
  boardPx: number;
};

export function TutorialSpotlightOverlay({
  tile,
  boardPx,
}: TutorialSpotlightOverlayProps) {
  const cell = boardPx / SIZE;
  const row = Math.floor(tile / SIZE);
  const col = tile % SIZE;
  const pad = 2;
  const left = col * cell + pad;
  const top = row * cell + pad;
  const size = cell - pad * 2;

  return (
    <div
      data-tutorial-spotlight
      className="pointer-events-none absolute inset-0 z-20"
      style={{ width: boardPx, height: boardPx }}
      aria-hidden
    >
      {/* Four dim panels around the hole */}
      <div
        className="absolute left-0 right-0 top-0 bg-black/50"
        style={{ height: top }}
      />
      <div
        className="absolute left-0 bg-black/50"
        style={{ top, width: left, height: size }}
      />
      <div
        className="absolute bg-black/50"
        style={{
          top,
          left: left + size,
          width: Math.max(0, boardPx - left - size),
          height: size,
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 bg-black/50"
        style={{ top: top + size, height: Math.max(0, boardPx - top - size) }}
      />

      {/* Cream sketch ring — no black inner edge */}
      <div
        className="absolute rounded-[5px]"
        style={{
          left,
          top,
          width: size,
          height: size,
          border: "3px solid var(--paper)",
          boxShadow:
            "0 0 0 1px color-mix(in oklab, var(--ink-brown) 25%, transparent)",
        }}
      />
    </div>
  );
}
