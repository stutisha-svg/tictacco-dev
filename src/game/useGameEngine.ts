import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  Board,
  Owner,
  Placement,
  ShapeKind,
  bestProgress,
  emptyBoard,
  findAllWins,
} from "./rules";
import { selectBotMove } from "./bot";

export type Phase = "placing" | "revealing" | "won";

interface Tentative {
  tile: number;
  shape: ShapeKind;
}

export interface TieRound {
  tiles: number[];
  lines: number[][];
}

export interface MatchScore {
  you: number;
  opp: number;
}

export interface GameState {
  board: Board;
  round: number;
  phase: Phase;
  timerStart: number | null;
  duration: number;
  myTentative: Tentative | null;
  roundStarted: boolean;
  idleWarning: boolean;
  oppMove: Tentative | null;
  lastReveal: {
    mine: Tentative | null;
    opp: Tentative | null;
    collision: boolean;
  } | null;
  winner: { owner: Owner; line: number[] } | null;
  tieRound: TieRound | null;
  progressYou: number;
  progressOpp: number;
  match: MatchScore;
  matchTarget: number;
  matchOver: boolean;
}

type Action =
  | { type: "tap"; tile: number }
  | { type: "lock"; oppMove: Tentative | null }
  | { type: "nextRound" }
  | { type: "clearTieRound" }
  | { type: "setIdleWarning"; value: boolean }
  | { type: "softReset" };

const ROUND_MS = 5000;
const REVEAL_MS = 1800;
const TIE_HOLD_MS = 2200;
const IDLE_WARN_MS = 8000;
const MATCH_TARGET = 2; // best of 3

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
  tieRound: null,
  progressYou: 0,
  progressOpp: 0,
  match: { you: 0, opp: 0 },
  matchTarget: MATCH_TARGET,
  matchOver: false,
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
    case "clearTieRound": {
      return { ...state, tieRound: null };
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
        board[mine.tile] = { ...board[mine.tile], dead: true };
        collision = true;
      } else {
        if (mine) push(mine.tile, { owner: "you", shape: mine.shape });
        if (opp) push(opp.tile, { owner: "opp", shape: opp.shape });
      }

      const wins = findAllWins(board);
      const owners = new Set(wins.map((w) => w.owner));
      const isTieRound = wins.length >= 2 && owners.size === 2;

      let phase: Phase = "revealing";
      let winner: { owner: Owner; line: number[] } | null = null;
      let tieRound: TieRound | null = null;
      let match = state.match;
      let matchOver = state.matchOver;

      if (isTieRound) {
        const tiles = Array.from(new Set(wins.flatMap((w) => w.line)));
        tieRound = { tiles, lines: wins.map((w) => w.line) };
        phase = "revealing";
      } else if (wins.length > 0) {
        phase = "won";
        winner = wins[0];
        match = {
          you: state.match.you + (winner.owner === "you" ? 1 : 0),
          opp: state.match.opp + (winner.owner === "opp" ? 1 : 0),
        };
        matchOver =
          match.you >= state.matchTarget || match.opp >= state.matchTarget;
      }

      return {
        ...state,
        board,
        phase,
        myTentative: null,
        oppMove: opp,
        lastReveal: { mine, opp, collision },
        winner,
        tieRound,
        progressYou: bestProgress(board, "you"),
        progressOpp: bestProgress(board, "opp"),
        match,
        matchOver,
      };
    }
    case "nextRound": {
      if (state.phase === "won") return state;
      let board = state.board;
      if (state.tieRound) {
        board = board.map((t, i) =>
          state.tieRound!.tiles.includes(i) ? { ...t, dead: true } : t,
        );
      }
      return {
        ...state,
        board,
        phase: "placing",
        round: state.round + 1,
        timerStart: null,
        roundStarted: false,
        idleWarning: false,
        duration: ROUND_MS,
        oppMove: null,
        tieRound: null,
        progressYou: bestProgress(board, "you"),
        progressOpp: bestProgress(board, "opp"),
      };
    }
    case "softReset": {
      // If match is over, wipe match wins too; else keep them and start next game.
      const keepMatch = !state.matchOver;
      return {
        ...initial(),
        match: keepMatch ? state.match : { you: 0, opp: 0 },
        matchTarget: state.matchTarget,
      };
    }
  }
}

export function useGameEngine() {
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (state.phase !== "placing" || !state.roundStarted) return;
    const t = setTimeout(() => {
      const s = stateRef.current;
      const opp = selectBotMove(s.board, "opp", {
        playerTentative: s.myTentative,
        collisionBias: 0.4,
      });
      dispatch({ type: "lock", oppMove: opp });
    }, ROUND_MS);
    return () => clearTimeout(t);
  }, [state.phase, state.round, state.roundStarted]);

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

  useEffect(() => {
    if (state.phase !== "revealing") return;
    const wait = state.tieRound ? REVEAL_MS + TIE_HOLD_MS : REVEAL_MS + 400;
    const t = setTimeout(() => dispatch({ type: "nextRound" }), wait);
    return () => clearTimeout(t);
  }, [state.phase, state.round, state.tieRound]);

  const tap = useCallback((tile: number) => dispatch({ type: "tap", tile }), []);
  const reset = useCallback(() => dispatch({ type: "softReset" }), []);

  return { state, tap, reset, roundMs: ROUND_MS, revealMs: REVEAL_MS };
}
