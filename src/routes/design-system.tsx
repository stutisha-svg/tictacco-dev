/**
 * Design System — visual dashboard of tokens, typography, buttons, and
 *                 game-specific interactive states.
 *
 * Purpose: developer-facing reference for maintaining a consistent
 *          crayon/hand-drawn look across the app.
 * Deps: shared game components (Shape, RoundTimer, WinBadge) so the demos
 *       stay in sync with the real UI.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shape } from "@/components/game/Shape";
import { RoundTimer } from "@/components/game/RoundTimer";
import { WinBadge, type BadgeKind } from "@/components/game/WinBadge";
import { CrayonDefs } from "@/components/game/CrayonDefs";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "Design Tokens Guide — tic tac co" },
      {
        name: "description",
        content:
          "Design system reference: crayon color tokens, typography scale, button states, and animated interactive demos for tic tac co.",
      },
    ],
  }),
  component: DesignSystemPage,
});

interface SwatchProps {
  name: string;
  cssVar: string;
  hint: string;
}

function Swatch({ name, cssVar, hint }: SwatchProps) {
  return (
    <div className="flex items-center gap-3 rounded-md border-2 border-ink/20 p-3">
      <div
        className="h-12 w-12 shrink-0 rounded"
        style={{ background: `var(${cssVar})` }}
      />
      <div className="flex flex-col">
        <div className="text-body-md" style={{ color: "var(--ink)" }}>
          {name}
        </div>
        <div className="text-micro" style={{ color: "var(--ink-soft)" }}>
          {cssVar} — {hint}
        </div>
      </div>
    </div>
  );
}

interface DemoButtonProps {
  label: string;
  variant: "primary" | "secondary" | "icon";
  state: "default" | "hover" | "active" | "disabled";
}

function DemoButton({ label, variant, state }: DemoButtonProps) {
  const disabled = state === "disabled";
  const baseClasses =
    "inline-flex items-center justify-center rounded-full border-2 transition-all duration-200 ease-in-out";
  const sizeClasses =
    variant === "icon" ? "h-10 w-10 text-body-lg" : "px-5 py-2 text-body-md";
  const paletteClasses =
    variant === "primary"
      ? "bg-primary text-primary-foreground border-primary"
      : "bg-transparent border-ink text-ink";
  const stateClasses =
    state === "hover"
      ? "scale-[1.03] shadow-md"
      : state === "active"
        ? "scale-[0.97]"
        : "";
  const disabledClasses = disabled ? "opacity-40 pointer-events-none" : "";
  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${paletteClasses} ${stateClasses} ${disabledClasses}`}
      disabled={disabled}
      style={{ fontFamily: "var(--font-display)" }}
    >
      {variant === "icon" ? "✎" : label}
    </button>
  );
}

function TypographyRow({ className, sample }: { className: string; sample: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-2">
      <span className={className} style={{ color: "var(--ink)" }}>
        {sample}
      </span>
      <code className="text-micro" style={{ color: "var(--ink-soft)" }}>
        .{className}
      </code>
    </div>
  );
}

function LiveTileDemo() {
  const [tapCount, setTapCount] = useState(0);
  const shape = tapCount % 3 === 1 ? "X" : tapCount % 3 === 2 ? "O" : null;
  const size = 96;
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={() => setTapCount((c) => c + 1)}
        className="rounded border-2 border-ink/40 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
        style={{ width: size, height: size, background: "var(--paper)" }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          <CrayonDefs />
          {shape && <Shape shape={shape} owner="you" size={size} seed={1} />}
        </svg>
      </button>
      <div className="text-micro" style={{ color: "var(--ink-soft)" }}>
        tap: none → X → O → clear
      </div>
    </div>
  );
}

function BadgeDemo() {
  const [kind, setKind] = useState<BadgeKind>("win");
  const options: BadgeKind[] = ["win", "lose", "tie", "collision"];
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setKind(option)}
            className={`rounded-full border-2 px-4 py-1 text-body-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${
              kind === option ? "bg-ink text-paper" : "bg-transparent text-ink"
            }`}
            style={{
              fontFamily: "var(--font-display)",
              borderColor: "var(--ink)",
            }}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="relative h-[220px] w-[360px] overflow-hidden rounded-lg bg-black/50">
        <WinBadge key={kind} kind={kind} />
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-heading" style={{ color: "var(--ink)" }}>
        {title}
      </h2>
      <div className="rounded-lg border-2 border-ink/15 bg-paper p-5">{children}</div>
    </section>
  );
}

function DesignSystemPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-display" style={{ color: "var(--ink)" }}>
          Design Tokens Guide
        </h1>
        <p className="text-body-md" style={{ color: "var(--ink-soft)" }}>
          Every surface, glyph, and micro-interaction in tic tac co should feel
          hand-drawn. Use this page as the single source of truth.
        </p>
      </header>

      <Section title="Color Swatches">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Swatch name="Paper (background)" cssVar="--paper" hint="warm off-white" />
          <Swatch name="Ink (foreground)" cssVar="--ink" hint="deep pencil" />
          <Swatch name="Ink Soft" cssVar="--ink-soft" hint="muted labels" />
          <Swatch name="Player You" cssVar="--player-you" hint="orange crayon" />
          <Swatch name="Player Rival" cssVar="--player-opp" hint="cyan crayon" />
          <Swatch name="Dead Tile" cssVar="--dead" hint="scribble black" />
        </div>
      </Section>

      <Section title="Typography Scale">
        <TypographyRow className="text-display" sample="Aa — Display" />
        <TypographyRow className="text-heading" sample="Aa — Heading" />
        <TypographyRow className="text-subheading" sample="Aa — Subheading" />
        <TypographyRow className="text-body-lg" sample="Body large — flowing crayon copy" />
        <TypographyRow className="text-body-md" sample="Body medium — default body copy" />
        <TypographyRow className="text-body-sm" sample="Body small — captions & meta" />
        <TypographyRow className="text-micro" sample="Micro — hints & footnotes" />
      </Section>

      <Section title="Button States">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {(["default", "hover", "active", "disabled"] as const).map((state) => (
            <div key={state} className="flex flex-col items-center gap-3">
              <DemoButton label="Play" variant="primary" state={state} />
              <DemoButton label="Cancel" variant="secondary" state={state} />
              <DemoButton label="" variant="icon" state={state} />
              <span className="text-micro" style={{ color: "var(--ink-soft)" }}>
                {state}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Interactive Demos">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center gap-3">
            <h3 className="text-subheading">Round Timer</h3>
            <div className="w-full max-w-[320px]">
              <RoundTimer running duration={5000} color="var(--player-you)" keyId={0} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <h3 className="text-subheading">Lobby Tile Tap Cycle</h3>
            <LiveTileDemo />
          </div>
          <div className="flex flex-col items-center gap-3 md:col-span-2">
            <h3 className="text-subheading">Result Badges</h3>
            <BadgeDemo />
          </div>
        </div>
      </Section>
    </div>
  );
}
