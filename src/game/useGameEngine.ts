import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  Board,
  Owner,
  Placement,
  ShapeKind,
  bestProgress,
  emptyBoard,
  findWin,
} from "./rules";
import { selectBotMove } from "./bot";

export type Phase = "placing" | "revealing" | "won";

interface Tentative {
  tile: number;
  shape: ShapeKind;
}

export interface GameState {
  board: Board;
  round: number;
  phase: Phase;
  /** timestamp when the current round's 5s clock started (only after first placement) */
  timerStart: number | null;
  duration: number;
  myTentative: Tentative | null;
  /** true once the player has placed at least one tentative this round */
  roundStarted: boolean;
  /** true when player has been idle >8s in placing phase with nothing placed */
  idleWarning: boolean;
  oppMove: Tentative | null;
  lastReveal: {
    mine: Tentative | null;
    opp: Tentative | null;
    collision: boolean;
  } | null;
  winner: { owner: Owner; line: number[] } | null;
  progressYou: number;
  progressOpp: number;
}

type Action =
  | { type: "tap"; tile: number }
  | { type: "lock"; oppMove: Tentative | null }
  | { type: "nextRound" }
  | { type: "setIdleWarning"; value: boolean };

const ROUND_MS = 5000;
const REVEAL_MS = 1800;
const IDLE_WARN_MS = 8000;

const initial = (): GameState => ({
  board: emptyBoard(),
  round: 1,
  phase: "placing",
  timerStart: null,
  duration: ROUND_MS,
  myTentative: null,
  roundStarted: false,
  idleWarning: false,
  oppMove: null,
  lastReveal: null,
  winner: null,
  progressYou: 0,
  progressOpp: 0,
});

function cycleShape(prev: ShapeKind | null): ShapeKind | "clear" {
  if (prev === null) return "X";
  if (prev === "X") return "O";
  return "clear";
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "tap": {
      if (state.phase !== "placing") return state;
      const t = state.board[action.tile];
      if (t.dead || t.placements.length > 0) return state;
      const prev =
        state.myTentative && state.myTentative.tile === action.tile
          ? state.myTentative.shape
          : null;
      const next = cycleShape(prev);
      if (next === "clear") {
        // tentative cleared; keep roundStarted true if timer already running
        return { ...state, myTentative: null };
      }
      const startingNow = !state.roundStarted;
      return {
        ...state,
        myTentative: { tile: action.tile, shape: next },
        roundStarted: true,
        idleWarning: false,
        timerStart: startingNow ? Date.now() : state.timerStart,
      };
    }
    case "setIdleWarning": {
      if (state.phase !== "placing") return state;
      return { ...state, idleWarning: action.value };
    }
    case "lock": {
      const board = state.board.map((t) => ({
        ...t,
        placements: [...t.placements],
      }));
      const mine = state.myTentative;
      const opp = action.oppMove;
      let collision = false;

      const push = (i: number, p: Placement) => {
        board[i] = { ...board[i], placements: [...board[i].placements, p] };
      };
      if (mine && opp && mine.tile === opp.tile) {
        push(mine.tile, { owner: "you", shape: mine.shape });
        push(mine.tile, { owner: "opp", shape: opp.shape });
        board[mine.tile] = { ...board[mine.tile], dead: true, placements: board[mine.tile].placements };
        collision = true;
      } else {
        if (mine) push(mine.tile, { owner: "you", shape: mine.shape });
        if (opp) push(opp.tile, { owner: "opp", shape: opp.shape });
      }

      const win = findWin(board);
      return {
        ...state,
        board,
        phase: win ? "won" : "revealing",
        myTentative: null,
        oppMove: opp,
        lastReveal: { mine, opp, collision },
        winner: win,
        progressYou: bestProgress(board, "you"),
        progressOpp: bestProgress(board, "opp"),
      };
    }
    case "nextRound": {
      if (state.phase === "won") return state;
      return {
        ...state,
        phase: "placing",
        round: state.round + 1,
        timerStart: null,
        roundStarted: false,
        idleWarning: false,
        duration: ROUND_MS,
        oppMove: null,
      };
    }
  }
}

export function useGameEngine() {
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Round timer: only starts once the player has placed a tentative.
  useEffect(() => {
    if (state.phase !== "placing" || !state.roundStarted) return;
    const t = setTimeout(() => {
      const s = stateRef.current;
      const opp = selectBotMove(s.board, "opp");
      dispatch({ type: "lock", oppMove: opp });
    }, ROUND_MS);
    return () => clearTimeout(t);
  }, [state.phase, state.round, state.roundStarted]);

  // Idle-warning: nudge after 8s of no placement.
  useEffect(() => {
    if (state.phase !== "placing" || state.roundStarted) {
      if (state.idleWarning) dispatch({ type: "setIdleWarning", value: false });
      return;
    }
    const t = setTimeout(
      () => dispatch({ type: "setIdleWarning", value: true }),
      IDLE_WARN_MS,
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.round, state.roundStarted]);

  // reveal -> next round
  useEffect(() => {
    if (state.phase !== "revealing") return;
    const t = setTimeout(() => dispatch({ type: "nextRound" }), REVEAL_MS + 400);
    return () => clearTimeout(t);
  }, [state.phase, state.round]);

  const tap = useCallback((tile: number) => dispatch({ type: "tap", tile }), []);
  const reset = useCallback(() => {
    window.location.reload();
  }, []);

  return { state, tap, reset, roundMs: ROUND_MS, revealMs: REVEAL_MS };
}
