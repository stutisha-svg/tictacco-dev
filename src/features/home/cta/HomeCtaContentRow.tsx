/**
 * Icon + label row — top layer of every home CTA.
 *
 * Layout variants mirror Figma "Frame 1" content blocks:
 *   inset-percent  — NEW GAME (percent inset from hit target)
 *   absolute-box   — TUTORIAL (fixed px box inside frame)
 *   fixed-row      — INVITE (centered row, explicit 198×35)
 *   centered-row   — ACHIEVEMENTS (centered, max-width clamp)
 *
 * Icons are always object-contain at exact px size (28 or 48) — never stretched.
 * Secondary labels use whitespace-nowrap so text stays on one line.
 */
import type { CSSProperties } from "react";

export type ContentLayout =
  | {
      variant: "inset-percent";
      inset: { top: string; right: string; bottom: string; left: string };
      gap: number;
    }
  | {
      variant: "absolute-box";
      box: { left: number; top: number; width: number; height: number };
      gap: number;
    }
  | {
      variant: "centered-row";
      height: number;
      maxWidth?: number;
      gap: number;
      paddingX?: number;
    }
  | {
      variant: "fixed-row";
      width: number;
      height: number;
      gap: number;
    };

export type IconSpec = {
  src: string;
  size: 28 | 48;
};

export type LabelSpec = {
  text: string;
  fontSize: number;
  lineHeight: string;
  height?: number;
  width?: number;
  /** Keep true for all current CTAs — Figma labels are single-line. */
  nowrap?: boolean;
};

/** Fixed-size icon box; SVG uses object-contain to preserve aspect ratio. */
function CtaIcon({ src, size }: IconSpec) {
  const boxClass = size === 48 ? "size-12" : "size-[28px]";

  return (
    <span className={`relative ${boxClass} shrink-0 overflow-visible`}>
      <img
        src={src}
        alt=""
        draggable={false}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 block max-w-none object-contain"
        style={{ width: size, height: size }}
        width={size}
        height={size}
      />
    </span>
  );
}

/** Crayon Libre label — uses `--font-display` token. */
function CtaLabel({ spec }: { spec: LabelSpec }) {
  const { text, fontSize, lineHeight, height, width, nowrap = true } = spec;

  return (
    <span
      className={[
        "relative shrink-0 text-[var(--ink)]",
        nowrap ? "whitespace-nowrap" : "",
      ].join(" ")}
      style={{
        fontFamily: "var(--font-display)",
        fontSize,
        lineHeight,
        ...(height != null ? { height } : {}),
        ...(width != null ? { width } : {}),
      }}
    >
      {text}
    </span>
  );
}

function Row({
  icon,
  label,
  className,
  style,
}: {
  icon: IconSpec;
  label: LabelSpec;
  className: string;
  style?: CSSProperties;
}) {
  return (
    <span className={className} style={style}>
      <CtaIcon {...icon} />
      <CtaLabel spec={label} />
    </span>
  );
}

export function HomeCtaContentRow({
  layout,
  icon,
  label,
}: {
  layout: ContentLayout;
  icon: IconSpec;
  label: LabelSpec;
}) {
  switch (layout.variant) {
    case "inset-percent":
      return (
        <Row
          icon={icon}
          label={label}
          className="absolute flex items-center"
          style={{
            top: layout.inset.top,
            right: layout.inset.right,
            bottom: layout.inset.bottom,
            left: layout.inset.left,
            gap: layout.gap,
          }}
        />
      );

    case "absolute-box":
      return (
        <Row
          icon={icon}
          label={label}
          className="absolute z-[1] flex items-center"
          style={{
            left: layout.box.left,
            top: layout.box.top,
            width: layout.box.width,
            height: layout.box.height,
            gap: layout.gap,
          }}
        />
      );

    case "centered-row":
      return (
        <Row
          icon={icon}
          label={label}
          className="relative z-[1] flex shrink-0 items-center justify-center"
          style={{
            height: layout.height,
            maxWidth: layout.maxWidth,
            gap: layout.gap,
            paddingLeft: layout.paddingX,
            paddingRight: layout.paddingX,
          }}
        />
      );

    case "fixed-row":
      return (
        <Row
          icon={icon}
          label={label}
          className="relative z-[1] flex shrink-0 items-center"
          style={{
            width: layout.width,
            height: layout.height,
            gap: layout.gap,
          }}
        />
      );
  }
}
