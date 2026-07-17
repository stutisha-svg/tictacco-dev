export function CrayonDefs() {
  return (
    <defs>
      <filter id="crayon" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
        <feDisplacementMap in="SourceGraphic" scale="2.2" />
      </filter>
      {/* Grid lines: chunkier grain (40% scale-up) — still no curvature. */}
      <filter id="crayon-soft" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" />
        <feDisplacementMap in="SourceGraphic" scale="1.6" />
      </filter>
      <filter id="crayon-rough" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" seed="11" />
        <feDisplacementMap in="SourceGraphic" scale="3.6" />
      </filter>
    </defs>
  );
}
