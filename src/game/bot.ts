import { Board, Owner, ShapeKind, SIZE, idx } from "./rules";

interface Move {
  tile: number;
  shape: ShapeKind;
}

/** Simple bot: prefer extending own near-XOX lines; else random empty non-dead tile. */
export function selectBotMove(board: Board, self: Owner = "opp"): Move | null {
  const empties: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (!board[i].dead && board[i].placements.length === 0) empties.push(i);
  }
  if (empties.length === 0) return null;

  const wanted: ShapeKind[] = ["X", "O", "X"];
  const candidates: Move[] = [];
  const lines: number[][] = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c <= SIZE - 3; c++)
      lines.push([idx(r, c), idx(r, c + 1), idx(r, c + 2)]);
  for (let c = 0; c < SIZE; c++)
    for (let r = 0; r <= SIZE - 3; r++)
      lines.push([idx(r, c), idx(r + 1, c), idx(r + 2, c)]);
  for (let r = 0; r <= SIZE - 3; r++)
    for (let c = 0; c <= SIZE - 3; c++)
      lines.push([idx(r, c), idx(r + 1, c + 1), idx(r + 2, c + 2)]);
  for (let r = 0; r <= SIZE - 3; r++)
    for (let c = 2; c < SIZE; c++)
      lines.push([idx(r, c), idx(r + 1, c - 1), idx(r + 2, c - 2)]);

  for (const line of lines) {
    let viable = true;
    let mine = 0;
    let empty: { i: number; shape: ShapeKind } | null = null;
    for (let k = 0; k < 3; k++) {
      const t = board[line[k]];
      if (t.dead) {
        viable = false;
        break;
      }
      if (t.placements.length === 0) {
        if (empty) {
          viable = viable && true;
        }
        empty = { i: line[k], shape: wanted[k] };
      } else if (t.placements.length === 1) {
        const p = t.placements[0];
        if (p.owner !== self || p.shape !== wanted[k]) {
          viable = false;
          break;
        }
        mine++;
      } else {
        viable = false;
        break;
      }
    }
    if (viable && empty && mine >= 1) {
      candidates.push({ tile: empty.i, shape: empty.shape });
    }
  }

  if (candidates.length > 0) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  const tile = empties[Math.floor(Math.random() * empties.length)];
  const shape: ShapeKind = Math.random() < 0.6 ? "X" : "O";
  return { tile, shape };
}
