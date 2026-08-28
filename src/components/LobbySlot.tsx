/**
 * LobbySlot — shared hand-drawn slot for lobby / matchmaking UI.
 */
export function LobbySlot({
  label = "Lobby slot",
}: {
  label?: string;
}) {
  return (
    <div
      data-lobby-slot
      className="relative flex min-h-[44px] min-w-[44px] w-full items-center justify-center overflow-hidden px-4 py-3"
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 320 56"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M 10 28 Q 8 6 30 4 L 292 2 Q 316 6 312 30 Q 310 52 286 50 L 28 52 Q 6 48 10 28 Z"
          fill="rgba(255,255,255,0.55)"
          stroke="var(--ink-brown)"
          strokeWidth={2}
          strokeDasharray="5 4"
        />
      </svg>
      <span
        className="relative z-[1] text-sm text-[var(--ink-soft)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {label}
      </span>
    </div>
  );
}
