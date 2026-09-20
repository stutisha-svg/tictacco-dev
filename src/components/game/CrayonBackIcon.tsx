/**
 * CrayonBackIcon — left chevron in a circle with TopBar-matching crayon grain.
 */
import { useId } from "react";

export function CrayonBackIcon({
  size = 36,
  stroke = "#000",
}: {
  size?: number;
  /** Stroke color — use paper on ink-filled buttons. */
  stroke?: string;
}) {
  const id = `crayon-back-${useId().replace(/:/g, "")}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="pointer-events-none relative block shrink-0"
    >
      <defs>
        <filter
          id={id}
          x="-15%"
          y="-15%"
          width="130%"
          height="130%"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72 0.72"
            numOctaves={3}
            seed={1312}
          />
          <feDisplacementMap
            in="shape"
            scale={2.6}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displacedImage"
            width="100%"
            height="100%"
          />
          <feMerge>
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
      </defs>
      <g
        filter={`url(#${id})`}
        stroke={stroke}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="18" cy="18" r="13.2" fill="none" />
        <path d="M20.5 11.5 L14 18 L20.5 24.5" fill="none" />
      </g>
    </svg>
  );
}
