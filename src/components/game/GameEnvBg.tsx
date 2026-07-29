/**
 * GameEnvBg — Figma "Game env bg" (node 2189:408).
 * Checkered paper fills the full frame; clipped to the phone’s rounded corners.
 * Scribble sits in-viewport (upper-left), rotated like the design.
 */
export function GameEnvBg({ className }: { className?: string }) {
  return (
    <div
      data-game-env-bg
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-none sm:rounded-[24px] ${className ?? ""}`}
      aria-hidden
    >
      {/*
        Asset has large transparent margins. Overscale so the opaque checker
        covers the frame; parent overflow-hidden clips to rounded corners.
      */}
      <img
        src="/game-env/paper.png"
        alt=""
        draggable={false}
        className="absolute left-1/2 top-1/2 max-h-none max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.26]"
        style={{
          height: "220%",
          width: "auto",
          minWidth: "240%",
          minHeight: "220%",
          objectFit: "cover",
        }}
      />
      {/* SVG fill-opacity is the visibility control; keep CSS opacity at 1. */}
      <img
        src="/game-env/scribble.svg"
        alt=""
        draggable={false}
        className="absolute"
        style={{
          left: "6%",
          top: "12%",
          width: "min(58%, 260px)",
          height: "auto",
          transform: "rotate(-32.48deg)",
          transformOrigin: "center center",
          opacity: 1,
        }}
      />
    </div>
  );
}
