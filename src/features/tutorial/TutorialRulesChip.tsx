/**
 * TutorialRulesChip — inline collision / scribble label in rules copy.
 * Same type size as body text; not a banner or StatusCard.
 */
import type { TutorialChip } from "./tutorialSteps";

type TutorialRulesChipProps = {
  chip: NonNullable<TutorialChip>;
};

export function TutorialRulesChip({ chip }: TutorialRulesChipProps) {
  return (
    <span
      className="mx-1 inline-block rounded-sm border px-1.5 py-0.5 align-baseline text-[clamp(0.95rem,3.8vw,1.1rem)] leading-none"
      style={{
        borderColor: "var(--ink)",
        background: "var(--paper)",
        fontFamily: "var(--font-display)",
        color: "var(--ink)",
      }}
    >
      {chip}
    </span>
  );
}
