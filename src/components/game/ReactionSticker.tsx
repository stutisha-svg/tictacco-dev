/**
 * ReactionSticker — shared renderer for wheel buttons + thought clouds.
 * Prefers `assetSrc` when set; otherwise draws the interim kaomoji mark.
 */
import type { Reaction } from "./reactions";

interface Props {
  reaction: Reaction;
  /** Pixel size for the mark / image. */
  size?: number;
  color?: string;
  className?: string;
}

export function ReactionSticker({
  reaction,
  size = 22,
  color = "var(--ink)",
  className,
}: Props) {
  if (reaction.assetSrc) {
    return (
      <img
        src={reaction.assetSrc}
        alt={reaction.label}
        width={size}
        height={size}
        className={className}
        draggable={false}
        style={{ objectFit: "contain", width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-display)",
        fontSize: size * 0.72,
        lineHeight: 1,
        color,
        letterSpacing: "-0.02em",
        userSelect: "none",
      }}
      aria-hidden
    >
      {reaction.mark}
    </span>
  );
}
