export function CrayonDefs() {
  return (
    <defs>
      <filter id="crayon" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
        <feDisplacementMap in="SourceGraphic" scale="1.6" />
      </filter>
      <filter id="crayon-soft" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="7" />
        <feDisplacementMap in="SourceGraphic" scale="0.9" />
      </filter>
      <filter id="crayon-rough" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" seed="11" />
        <feDisplacementMap in="SourceGraphic" scale="2.8" />
      </filter>
    </defs>
  );
}
