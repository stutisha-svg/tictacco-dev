/**
 * TutorialSpotlightOverlay — four-panel dim scrim leaving one grid tile clear.
 *
 * When `passThrough` is true the scrim is visual-only so tile taps reach the board.
 */
import { useLayoutEffect, useState } from "react";
import { SIZE } from "@/game/rules";

type Hole = { x: number; y: number; w: number; h: number };

type TutorialSpotlightOverlayProps = {
  boardRef: React.RefObject<HTMLElement | null>;
  tile: number | null;
  boardPx: number;
  /** Visual-only — taps pass through to the board below. */
  passThrough?: boolean;
  tappable?: boolean;
  onTap?: () => void;
};

export function TutorialSpotlightOverlay({
  boardRef,
  tile,
  boardPx,
  passThrough = false,
  tappable = false,
  onTap,
}: TutorialSpotlightOverlayProps) {
  const [hole, setHole] = useState<Hole | null>(null);

  useLayoutEffect(() => {
    if (tile == null || !boardRef.current) {
      setHole(null);
      return;
    }
    const update = () => {
      if (!boardRef.current || tile == null) return;
      const rect = boardRef.current.getBoundingClientRect();
      const cell = boardPx / SIZE;
      const r = Math.floor(tile / SIZE);
      const c = tile % SIZE;
      setHole({
        x: rect.left + c * cell,
        y: rect.top + r * cell,
        w: cell,
        h: cell,
      });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [boardRef, tile, boardPx]);

  if (tile == null || !hole) return null;

  const pad = 2;
  const x = hole.x - pad;
  const y = hole.y - pad;
  const w = hole.w + pad * 2;
  const h = hole.h + pad * 2;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pe = passThrough ? "none" : tappable ? "auto" : "none";

  const panels = [
    { left: 0, top: 0, width: vw, height: y },
    { left: 0, top: y, width: x, height: h },
    { left: x + w, top: y, width: vw - x - w, height: h },
    { left: 0, top: y + h, width: vw, height: vh - y - h },
  ];

  return (
    <>
      {panels.map((p, i) => (
        <div
          key={i}
          className="fixed z-20 bg-black/55"
          style={{
            left: p.left,
            top: p.top,
            width: p.width,
            height: p.height,
            pointerEvents: pe,
          }}
          onClick={tappable && !passThrough ? onTap : undefined}
          aria-hidden
        />
      ))}
    </>
  );
}
