/**
 * Design token bridge for Tailwind.
 * Source of truth for runtime values remains `src/styles.css` (:root / @theme).
 * This file maps those CSS variables into Tailwind theme keys for tooling & docs.
 */
import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-brown": "var(--ink-brown)",
        "player-you": "var(--player-you)",
        "player-opp": "var(--player-opp)",
        "accent-purple": "var(--accent-purple)",
        "accent-purple-soft": "var(--accent-purple-soft)",
        dead: "var(--dead)",
      },
      fontFamily: {
        display: "var(--font-display)",
        hand: "var(--font-hand)",
      },
      maxWidth: {
        phone: "390px",
      },
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
    },
  },
} satisfies Config;

export default config;
