/**
 * CrayonCloseIcon — X in a circle with the same displacement grain as TopBar icons.
 */
import { useId } from "react";

export function CrayonCloseIcon({ size = 36 }: { size?: number }) {
  const id = `crayon-close-${useId().replace(/:/g, "")}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="pointer-events-none block"
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
            seed={5127}
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
      <g filter={`url(#${id})`} stroke="#000" strokeWidth={2.4} strokeLinecap="round">
        <circle cx="18" cy="18" r="13.2" fill="none" />
        <path d="M12.2 12.2 L23.8 23.8" />
        <path d="M23.8 12.2 L12.2 23.8" />
      </g>
    </svg>
  );
}
