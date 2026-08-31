/** Rule copy — typewriter reveal, left-aligned inside a centered block. */
import { useEffect, useState } from "react";

type TutorialRulesTextProps = {
  children: string;
};

/** Milliseconds between each character. */
const CHAR_MS = 34;

export function TutorialRulesText({ children }: TutorialRulesTextProps) {
  const [visible, setVisible] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setVisible("");
    setDone(false);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setVisible(children.slice(0, i));
      if (i >= children.length) {
        setDone(true);
        window.clearInterval(id);
      }
    }, CHAR_MS);
    return () => window.clearInterval(id);
  }, [children]);

  return (
    <div className="pointer-events-none flex w-full justify-center">
      <p
        className="w-full max-w-[min(100%,340px)] py-1 pl-[10px] pr-2 text-left text-[clamp(0.95rem,3.8vw,1.1rem)] leading-snug text-[var(--ink)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {visible}
        {!done && (
          <span
            className="ml-px inline-block animate-pulse opacity-60"
            aria-hidden
          >
            |
          </span>
        )}
      </p>
    </div>
  );
}
