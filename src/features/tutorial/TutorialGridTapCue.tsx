/**
 * TutorialGridTapCue — static “tap the grid” hint over the board.
 * Feature-local cue; not used in live GameScreen.
 */
type TutorialGridTapCueProps = {
  hint?: string;
};

export function TutorialGridTapCue({
  hint = "tap the grid to start",
}: TutorialGridTapCueProps) {
  return (
    <div
      data-tutorial-grid-tap-cue
      className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center"
      aria-hidden
    >
      <div className="flex max-w-[85%] flex-col items-center gap-2 px-3 text-center">
        <img
          src="/game/tap-icon.svg"
          alt=""
          draggable={false}
          width={40}
          height={40}
          className="block size-10 opacity-90 drop-shadow-sm"
        />
        <p
          className="text-[clamp(0.95rem,3.8vw,1.15rem)] leading-tight text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {hint}
        </p>
      </div>
    </div>
  );
}
