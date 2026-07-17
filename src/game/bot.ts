import { Board, Owner, ShapeKind, SIZE, idx } from "./rules";

interface Move {
  tile: number;
  shape: ShapeKind;
}

export interface BotOptions {
  /** Player's currently-placed tentative — bot will sometimes target the same tile. */
  playerTentative?: Move | null;
  /** 0..1 chance the bot picks the same tile as the player to force collisions. */
  collisionBias?: number;
}

/**
 * Bot strategy:
 *  1. With `collisionBias` probability, place on the player's tentative tile
 *     (using the shape that fits its best line for that spot) so collisions
 *     happen more often.
 *  2. Try to complete an XOX line if it's one placement away (wins the game
 *     and gives us tie-round scenarios when the player also completes).
 *  3. Otherwise extend an existing near-XOX line.
 *  4. Fallback: random empty non-dead tile.
 */
export function selectBotMove(
  board: Board,
  self: Owner = "opp",
  options: BotOptions = {},
): Move | null {
  const empties: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (!board[i].dead && board[i].placements.length === 0) empties.push(i);
  }
  if (empties.length === 0) return null;

  const wanted: ShapeKind[] = ["X", "O", "X"];
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

  const winningMoves: Move[] = [];
  const extendingMoves: Move[] = [];

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
      if (mine === 2) winningMoves.push({ tile: empty.i, shape: empty.shape });
      else extendingMoves.push({ tile: empty.i, shape: empty.shape });
    }
  }

  // 1. Collision bias — copy the player's tentative tile
  const bias = options.collisionBias ?? 0.35;
  const playerT = options.playerTentative;
  if (
    playerT &&
    !board[playerT.tile].dead &&
    board[playerT.tile].placements.length === 0 &&
    Math.random() < bias
  ) {
    // Prefer a shape that also happens to extend one of our lines; else random.
    const helpful = extendingMoves.find((m) => m.tile === playerT.tile);
    return helpful ?? { tile: playerT.tile, shape: Math.random() < 0.5 ? "X" : "O" };
  }

  // 2. Prefer completing an XOX (also raises tie-round frequency)
  if (winningMoves.length > 0) {
    return winningMoves[Math.floor(Math.random() * winningMoves.length)];
  }

  // 3. Extend a near-XOX line
  if (extendingMoves.length > 0) {
    return extendingMoves[Math.floor(Math.random() * extendingMoves.length)];
  }

  // 4. Random fallback
  const tile = empties[Math.floor(Math.random() * empties.length)];
  const shape: ShapeKind = Math.random() < 0.6 ? "X" : "O";
  return { tile, shape };
}
