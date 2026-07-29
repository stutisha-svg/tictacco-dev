export type ShapeKind = "X" | "O";
export type Owner = "you" | "opp";

export interface Placement {
  owner: Owner;
  shape: ShapeKind;
}

export interface Tile {
  /** committed placements on this tile (usually one, or two if collided) */
  placements: Placement[];
  dead: boolean;
}

export type Board = Tile[]; // length 64, row-major

export const SIZE = 8;
export const emptyBoard = (): Board =>
  Array.from({ length: SIZE * SIZE }, () => ({ placements: [], dead: false }));

export const idx = (r: number, c: number) => r * SIZE + c;

/** All 3-in-a-row triples on the board (row/col/diag). */
function allLines(): number[][] {
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
  return lines;
}

const LINES = allLines();

/** owner of a live (non-dead, single-placement) tile, else null */
function tileOwner(t: Tile): { owner: Owner; shape: ShapeKind } | null {
  if (t.dead) return null;
  if (t.placements.length !== 1) return null;
  return t.placements[0];
}

/** Did anyone score a literal X-O-X owned by one player? Returns the winning line. */
export function findWin(board: Board): { owner: Owner; line: number[] } | null {
  const all = findAllWins(board);
  return all.length > 0 ? all[0] : null;
}

/** All simultaneous X-O-X lines on the board (used to detect tie rounds). */
export function findAllWins(
  board: Board,
): { owner: Owner; line: number[] }[] {
  const out: { owner: Owner; line: number[] }[] = [];
  for (const line of LINES) {
    const owners = line.map((i) => tileOwner(board[i]));
    if (owners.some((o) => o === null)) continue;
    const [a, b, c] = owners as NonNullable<(typeof owners)[number]>[];
    if (a.owner !== b.owner || b.owner !== c.owner) continue;
    if (a.shape === "X" && b.shape === "O" && c.shape === "X") {
      out.push({ owner: a.owner, line });
    }
  }
  return out;
}


/**
 * For each player, best progress toward an X-O-X triple: 0..3 positions
 * correctly filled by them on some line where the other positions are
 * still fillable (empty & not dead).
 */
export function bestProgress(board: Board, owner: Owner): number {
  const wanted: ShapeKind[] = ["X", "O", "X"];
  let best = 0;
  for (const line of LINES) {
    let count = 0;
    let viable = true;
    for (let k = 0; k < 3; k++) {
      const t = board[line[k]];
      if (t.dead) {
        viable = false;
        break;
      }
      const o = tileOwner(t);
      if (o) {
        if (o.owner === owner && o.shape === wanted[k]) count++;
        else {
          viable = false;
          break;
        }
      }
    }
    if (viable && count > best) best = count;
    if (best === 3) return 3;
  }
  return best;
}

/** True when no empty live tiles remain. */
export function isBoardFull(board: Board): boolean {
  return board.every((t) => t.dead || t.placements.length > 0);
}

/** True when `owner` still has at least one completable X-O-X line. */
export function canPlayerStillWin(board: Board, owner: Owner): boolean {
  const wanted: ShapeKind[] = ["X", "O", "X"];
  for (const line of LINES) {
    let viable = true;
    for (let k = 0; k < 3; k++) {
      const t = board[line[k]];
      if (t.dead) {
        viable = false;
        break;
      }
      const o = tileOwner(t);
      if (o && !(o.owner === owner && o.shape === wanted[k])) {
        viable = false;
        break;
      }
    }
    if (viable) return true;
  }
  return false;
}

/**
 * Stalemate: board full, or neither player can still form X-O-X.
 * Call only when nobody just scored a win.
 */
export function isDraw(board: Board): boolean {
  if (isBoardFull(board)) return true;
  return !canPlayerStillWin(board, "you") && !canPlayerStillWin(board, "opp");
}
