/**
 * INVITE FRIEND CTA — Figma node 14:936 (Component 3).
 * Content block = node 14:938: 198×35, icon 28×28, gap 12px, label 158×25.
 */
const PAPER = "/homescreen/btn-paper.png";
const ICON = "/homescreen/icon-users.svg";

export function InviteFriendCta() {
  return (
    <button
      type="button"
      aria-label="INVITE FRIEND"
      data-cta="invite-friend"
      className="relative flex h-[61.34px] w-[199px] shrink-0 items-center justify-center overflow-visible border-0 bg-transparent p-0 transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Paper 17 — 14:937 */}
      <div
        className="pointer-events-none absolute -top-px flex aspect-[279/82] items-center justify-center overflow-hidden"
        style={{ left: "-5.03%", right: "-8.54%", transform: "translate(-5px, -5px)" }}
        aria-hidden
      >
        <div className="-scale-x-100 size-full">
          <div className="relative size-full">
            <img
              src={PAPER}
              alt=""
              draggable={false}
              className="absolute max-w-none"
              style={{
                height: "160.2%",
                width: "108.96%",
                left: "-5.38%",
                top: "-30.71%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Frame 1 — 14:938 */}
      <span className="relative z-[1] flex h-[35px] w-[198px] shrink-0 items-center gap-[12px]">
        {/* People/users — 14:939 @ (0, 3.5) */}
        <span className="relative size-[28px] shrink-0 overflow-visible">
          <img
            src={ICON}
            alt=""
            draggable={false}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 block h-[28px] w-[28px] max-w-none object-contain object-left"
            width={28}
            height={28}
          />
        </span>

        {/* INVITE FRIEND — 14:940 @ (40, 5); 40 − 28 = 12px gap */}
        <span
          className="relative h-[25px] w-[158px] shrink-0 whitespace-nowrap text-[28.53px] not-italic leading-[18.545px] text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          INVITE FRIEND
        </span>
      </span>
    </button>
  );
}
