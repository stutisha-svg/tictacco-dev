import { Link, type LinkProps } from "react-router-dom";
import type { MouseEvent, ReactNode } from "react";

import { CTA_INTERACTION } from "./constants";

type HomeCtaShellProps = {
  id: string;
  label: string;
  /** Figma component width in px — defines tap target. */
  width: number;
  /** Figma component height in px — defines tap target. */
  height: number;
  maxWidthClass?: string;
  /**
   * block       — children use absolute positioning (NEW GAME).
   * flex-center — children centered in the frame (secondary CTAs).
   */
  align?: "block" | "flex-center";
  /** When omitted, renders a `<button>` instead of `<Link>`. */
  to?: LinkProps["to"];
  /** Optional click handler (e.g. intercept Link navigation). */
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  children: ReactNode;
};

/**
 * Outermost CTA layer: accessible hit target with hover/active scale.
 *
 * Children are expected to be exactly:
 *   `<HomeCtaPaper />` then `<HomeCtaContentRow />`
 */
export function HomeCtaShell({
  id,
  label,
  width,
  height,
  maxWidthClass,
  align = "block",
  to,
  onClick,
  children,
}: HomeCtaShellProps) {
  const className = [
    "relative shrink-0 overflow-visible border-0 bg-transparent p-0",
    align === "flex-center" ? "flex items-center justify-center" : "block",
    CTA_INTERACTION,
    maxWidthClass ?? "",
  ].join(" ");

  const style = { width, height };

  if (to) {
    return (
      <Link
        to={to}
        aria-label={label}
        data-cta={id}
        className={className}
        style={style}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      data-cta={id}
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
